# 대전 평생교육기관 Python 수집기 설계서

## 1. 목표

대전광역시 평생교육기관 데이터를 `반자동 검수 가능한 자동 수집 파이프라인`으로 전환한다.

산출물은 아래 3종이다.

- `raw_source_documents`: 원문 HTML, 첨부 파일 메타데이터, OCR 결과
- `institution_candidates`: 소스별로 추출된 기관 후보
- `institutions_master`: 병합과 정규화가 끝난 기준 기관 테이블

1차 범위는 아래 기관군으로 제한한다.

- 대전평생교육진흥원 및 대전시민대학 계열
- 5개 자치구 평생학습관/평생학습원
- 동 단위 평생학습센터
- 대전평생학습관
- 공공도서관 중 평생교육 운영 기관
- 대학 부설 평생교육원

## 2. 설계 원칙

- 소스 정의와 파서 구현을 분리한다.
- `공식 사이트 > 광역 허브 > 강좌 카탈로그 > OCR 첨부` 순으로 신뢰도를 둔다.
- 동적 페이지는 최소 범위에서만 브라우저를 사용한다.
- 자동 수집 결과는 바로 사용자 노출하지 않고 `검수 큐`를 거친다.
- 동일 기관의 다중 노출은 병합하되, 본관과 동 센터는 분리한다.

## 3. 권장 디렉터리 구조

```text
script/
  daejeon_crawler/
    __init__.py
    cli.py
    settings.py
    registry_loader.py
    http.py
    browser.py
    models.py
    normalize.py
    dedupe.py
    storage.py
    quality.py
    parsers/
      __init__.py
      base.py
      dile_home.py
      dile_board_attachment.py
      junggu_portal.py
      seogu_portal.py
      dllc_home.py
      donggu_portal.py
      yuseong_portal.py
      daedeok_portal.py
      nurim_catalog.py
      sugang_catalog.py
      university_extension_home.py
    ocr/
      image_ocr.py
      pdf_ocr.py
    fixtures/
      daejeon_source_registry.json
    output/
      raw/
      parsed/
      logs/
```

## 4. 실행 환경

권장 Python 버전:

- `Python 3.11` 이상

권장 라이브러리:

- `httpx`
- `beautifulsoup4`
- `lxml`
- `playwright`
- `pydantic`
- `rapidfuzz`
- `pandas`
- `sqlite-utils` 또는 `sqlalchemy`
- `pdfplumber`
- `pytesseract`
- `python-dateutil`

권장 설치 예시:

```bash
pip install httpx beautifulsoup4 lxml playwright pydantic rapidfuzz pandas pdfplumber pytesseract python-dateutil
playwright install chromium
```

## 5. 소스 레지스트리 스키마

`reports/daejeon_source_registry_draft.json`을 구현 시 `script/daejeon_crawler/fixtures/daejeon_source_registry.json`으로 복사해 사용한다.

필수 필드는 아래로 고정한다.

```json
{
  "source_id": "string",
  "name_ko": "string",
  "owner": "string",
  "coverage_level": "metro|district|district_subcenter|university|metro_education_office",
  "region_scope": ["string"],
  "base_url": "string",
  "entry_url": "string",
  "source_kind": "string",
  "transport": "static_html|dynamic_html|static_html_or_playwright|static_html_plus_attachment",
  "extraction_mode": "bs4|playwright|bs4_and_ocr|bs4_with_playwright_fallback",
  "expected_entities": ["string"],
  "parser_family": "string",
  "refresh_cadence": "daily|weekly|monthly",
  "priority": 0,
  "trust_score": 0.0,
  "verification_status": "string",
  "dedupe_keys": ["string"],
  "output_hints": {},
  "notes": "string"
}
```

## 6. 데이터 모델

### 6.1 SourceRecord

```python
from pydantic import BaseModel, HttpUrl


class SourceRecord(BaseModel):
    source_id: str
    name_ko: str
    owner: str
    coverage_level: str
    region_scope: list[str]
    base_url: HttpUrl
    entry_url: HttpUrl
    source_kind: str
    transport: str
    extraction_mode: str
    expected_entities: list[str]
    parser_family: str
    refresh_cadence: str
    priority: int
    trust_score: float
    verification_status: str
    dedupe_keys: list[str]
    output_hints: dict
    notes: str
```

### 6.2 RawDocument

```python
class RawDocument(BaseModel):
    run_id: str
    source_id: str
    fetched_at: str
    url: str
    content_type: str | None = None
    http_status: int | None = None
    encoding: str | None = None
    body_path: str | None = None
    body_sha256: str | None = None
    text_content: str | None = None
    attachment_urls: list[str] = []
    fetch_method: str
```

### 6.3 InstitutionCandidate

```python
class InstitutionCandidate(BaseModel):
    run_id: str
    source_id: str
    source_url: str
    raw_name: str
    canonical_name: str | None = None
    institution_type: str | None = None
    operator_name: str | None = None
    homepage_url: str | None = None
    phone: str | None = None
    address: str | None = None
    sido: str = "대전광역시"
    sigungu: str | None = None
    eupmyeondong: str | None = None
    operation_status: str | None = None
    recent_activity_date: str | None = None
    confidence_score: float = 0.0
    extraction_notes: str | None = None
```

### 6.4 MasterInstitution

```python
class MasterInstitution(BaseModel):
    institution_id: str
    canonical_name: str
    display_name: str
    institution_type: str
    operator_name: str | None = None
    homepage_url: str | None = None
    phone: str | None = None
    road_address: str | None = None
    sido: str = "대전광역시"
    sigungu: str | None = None
    eupmyeondong: str | None = None
    operation_status: str
    confidence_score: float
    last_crawled_at: str
    last_verified_at: str | None = None
    source_count: int
    source_ids: list[str]
```

## 7. 수집 파이프라인

### 7.1 단계

1. 레지스트리 로드
2. 대상 소스 필터링
3. 문서 수집
4. 파서 실행
5. 후보 정규화
6. 병합 및 중복 제거
7. 품질 규칙 적용
8. 검수 큐 생성
9. 마스터 출력

### 7.2 전체 흐름

```text
registry -> fetch -> raw documents -> parse -> candidates
-> normalize -> dedupe -> quality rules -> master + review queue
```

## 8. 파서 인터페이스

모든 파서는 동일한 인터페이스를 갖는다.

```python
from abc import ABC, abstractmethod


class BaseParser(ABC):
    parser_family: str

    @abstractmethod
    def parse(self, source: SourceRecord, raw_document: RawDocument) -> list[InstitutionCandidate]:
        raise NotImplementedError
```

브라우저가 필요한 소스는 fetch 단계에서 해결하고, parser는 가능한 한 HTML 문자열만 받도록 유지한다.

## 9. 소스별 구현 전략

### 9.1 `dile_home`

역할:

- 관련 사이트 링크 수집
- 협약기관 링크 수집
- 광역 기관 메타데이터 확보

추출 규칙:

- `관련사이트`, `협약기관안내` 섹션의 링크 텍스트와 URL 추출
- `대전평생교육진흥원`, `대전시민대학`은 직접 기관 엔터티 생성
- 자치구/대학 링크는 `source discovery queue`에 추가

### 9.2 `dile_board_attachment`

역할:

- JPG/PDF 첨부에서 기관명 대량 확보

추출 규칙:

- 게시글 본문에서 첨부 링크 추출
- 파일이 이미지면 OCR 수행
- `기관명`, `번호`, `구분` 패턴을 우선 탐지
- 상세 정보 없는 후보는 `confidence_score=0.45`로 생성

### 9.3 `junggu_portal`

역할:

- 중구 평생학습관 기본 정보 확보
- 메뉴 기반 하위 기관 탐색

추출 규칙:

- 메인 페이지에서 `평생학습기관안내`, `동 평생학습센터` 링크 추출
- 연락처, 주소, 공지 최신일 추출
- 최근 공지 날짜로 운영 여부 보조 판정

### 9.4 `seogu_portal`

역할:

- 서구 평생학습원과 연계 도서관 추출

추출 규칙:

- 상단 핵심 기관 `서구 평생학습원` 생성
- 하단 도서관 블록은 각각 별도 후보 생성
- 도서관은 `institution_type=public_library`
- 평생학습원 블록이 있으면 `institution_type=district_lifelong_center`

### 9.5 `dllc_home`

역할:

- 대전평생학습관 기본 정보 확보

추출 규칙:

- 브라우저 fallback이 필요하면 snapshot 텍스트 기준으로 기관명, 주소, 연락처 추출
- 교육청계 기관으로 분류

### 9.6 `donggu_portal`, `yuseong_portal`, `daedeok_portal`

역할:

- 자치구별 기본 기관과 하위 센터 추출

공통 전략:

- 첫 시도는 `httpx`
- 응답 비정상, 빈 HTML, 타임아웃이면 `Playwright`
- 내비게이션 메뉴에서 `평생학습관`, `학습센터`, `수강신청`, `기관안내` 키워드 링크를 우선 추적
- 하위 센터는 메뉴 라벨만 있더라도 최소 엔터티 생성

### 9.7 `nurim_catalog`, `sugang_catalog`

역할:

- 강좌 운영기관명 확보
- 최근 운영 여부 보조 판정

추출 규칙:

- 검색 결과의 `운영기관명`, `교육기관`, `주관기관` 필드 수집
- 최근 강좌 개설일이 12개월 이내면 `operation_status=운영중` 보조 점수 부여
- 기본 연락처와 주소는 덮어쓰지 않고 후보 근거만 추가

### 9.8 `university_extension_home`

역할:

- 대학 부설 평생교육원 표준 파서

추출 규칙:

- 사이트 타이틀과 대표 소개 블록에서 기관명 확보
- 연락처, 주소, 수강안내 링크 추출
- 대학명과 평생교육원명을 분리 보관

## 10. Fetch 계층 설계

### 10.1 HTTP Fetcher

기능:

- 타임아웃 20초
- 재시도 2회
- 기본 User-Agent 고정
- gzip/utf-8 처리

예시:

```python
async def fetch_html(url: str) -> RawDocument:
    ...
```

### 10.2 Browser Fetcher

브라우저 사용 조건:

- 레지스트리 `extraction_mode`가 `playwright`
- HTTP fetch 타임아웃
- HTML 길이가 너무 짧음
- 페이지가 JS 렌더링 전용

수집 항목:

- 최종 URL
- 렌더링된 HTML
- 텍스트 스냅샷
- 네트워크 상태

### 10.3 Attachment Fetcher

지원 대상:

- jpg
- png
- pdf
- xlsx

정책:

- 원본은 `output/raw/attachments/`에 저장
- OCR 결과는 별도 `.txt`로 저장
- 첨부 파일 해시는 기록

## 11. 정규화 규칙

### 11.1 기관명 정규화

- 접두어 `대전광역시`, `대전광역시교육청` 제거 후 별도 필드 보관
- 괄호 속 보조정보 제거
- `평생학습관`, `평생학습원`, `평생교육원`, `도서관`, `센터`는 유지
- `은행ㆍ선화동` 같은 복합 동명은 그대로 유지

예:

- `대전광역시 서구 평생학습원` -> `서구 평생학습원`
- `대전광역시 중구 평생학습관` -> `중구 평생학습관`

### 11.2 주소 정규화

- 도로명주소 우선
- 앞뒤 공백, 중복 공백 제거
- `대전광역시` 누락 시 자동 보완

### 11.3 전화번호 정규화

- 숫자만 추출 후 `042-000-0000` 형식으로 복원
- 내선은 별도 필드 또는 note에 보관

### 11.4 기관유형 분류

권장 enum:

- `metro_hub`
- `district_lifelong_center`
- `dong_lifelong_center`
- `education_office_lifelong_center`
- `public_library`
- `university_extension`
- `other_public_partner`

## 12. 병합 규칙

우선순위는 아래 순서로 적용한다.

1. 홈페이지 URL 동일
2. 전화번호 동일
3. 기관명 유사도 95 이상 + 주소 유사도 90 이상
4. 기관명 유사도 95 이상 + 동일 자치구 + 동일 운영주체

예외:

- `중구 평생학습관`과 `태평1동 평생학습센터`는 병합 금지
- 도서관은 평생학습 프로그램 운영 여부와 무관하게 별도 기관 유지
- 대학 본부 사이트와 평생교육원 사이트는 병합 금지

추천 구현:

```python
from rapidfuzz import fuzz
```

## 13. 운영 상태 판정

자동 판정 규칙:

- 최근 12개월 내 공지 또는 강좌 있음: `운영중`
- 기관 소개는 있으나 최근 활동 근거 없음: `재확인필요`
- 폐관/통폐합 명시: `운영중단`
- 주소/연락처/활동 근거 모두 부족: `확인불가`

가중치 예시:

- 공식 기관 소개 페이지 존재: `+0.3`
- 주소 존재: `+0.15`
- 전화 존재: `+0.15`
- 최근 공지 존재: `+0.2`
- 강좌 운영 흔적 존재: `+0.2`

`confidence_score < 0.6`이면 검수 큐로 보낸다.

## 14. 저장소 설계

초기 구현은 `SQLite`를 권장한다.

테이블:

- `crawl_runs`
- `raw_documents`
- `attachments`
- `institution_candidates`
- `institutions_master`
- `institution_aliases`
- `review_queue`
- `source_registry_snapshot`

핵심 컬럼:

```sql
create table if not exists institutions_master (
  institution_id text primary key,
  canonical_name text not null,
  display_name text not null,
  institution_type text not null,
  operator_name text,
  homepage_url text,
  phone text,
  road_address text,
  sido text not null,
  sigungu text,
  eupmyeondong text,
  operation_status text not null,
  confidence_score real not null,
  source_count integer not null,
  last_crawled_at text not null,
  last_verified_at text
);
```

## 15. CLI 설계

권장 명령:

```bash
python -m script.daejeon_crawler.cli crawl --source dj_dile_home
python -m script.daejeon_crawler.cli crawl --scope district
python -m script.daejeon_crawler.cli crawl --all
python -m script.daejeon_crawler.cli normalize
python -m script.daejeon_crawler.cli dedupe
python -m script.daejeon_crawler.cli review-report
python -m script.daejeon_crawler.cli export --format json
```

권장 옵션:

- `--source`
- `--scope`
- `--since`
- `--browser`
- `--limit`
- `--dry-run`

## 16. 로그와 모니터링

기본 로그 필드:

- `run_id`
- `source_id`
- `step`
- `url`
- `status`
- `elapsed_ms`
- `item_count`
- `error_message`

실패 정책:

- fetch 실패: 재시도 후 `raw_documents`에 실패 이력 저장
- parser 실패: 원문은 저장하고 candidate 생성은 건너뜀
- OCR 실패: 첨부 메타데이터만 저장하고 검수 큐에 등록

## 17. 검수 큐 생성 규칙

아래 조건이면 `review_queue`에 넣는다.

- OCR 기반 후보
- 주소 없음
- 전화 없음
- 기관명 길이 3자 이하
- 동일 후보가 서로 다른 소스에서 상충
- `confidence_score < 0.6`

검수 리포트 예시:

- 신규 후보 수
- 병합 후보 수
- 확인불가 수
- OCR 의존 후보 수
- 자치구별 누락 의심 수

## 18. 구현 우선순위

### Phase 1

- 레지스트리 로더
- HTTP fetcher
- `dile_home`, `junggu_portal`, `seogu_portal`
- SQLite 저장
- 기본 정규화

### Phase 2

- `dile_board_attachment`
- OCR 계층
- `dllc_home`
- 병합 규칙 고도화

### Phase 3

- `donggu_portal`, `yuseong_portal`, `daedeok_portal`
- Playwright fallback
- 강좌 카탈로그 기반 운영 상태 판정

### Phase 4

- 대학 부설 기관 자동 확장
- 증분 수집
- 대시보드 또는 검수 화면 연결

## 19. 예상 리스크

- 일부 자치구 포털은 빈 HTML 또는 타임아웃을 반환할 수 있다.
- 첨부 이미지 OCR 정확도가 낮을 수 있다.
- 같은 기관이 공지, 강좌, 허브 페이지에 다른 이름으로 노출될 수 있다.
- 도서관과 평생학습기관 경계가 모호한 데이터가 존재한다.

대응:

- 브라우저 fallback
- OCR 후보는 무조건 검수 큐
- 별칭 테이블 운영
- 기관유형과 프로그램운영여부 분리

## 20. 바로 구현할 최소 단위

첫 구현은 아래까지만 하면 된다.

1. `dj_dile_home`, `dj_junggu_lifelong_home`, `dj_seogu_lifelong_home` 3개 소스 수집
2. 기관 후보를 SQLite에 저장
3. 이름/전화/주소 기준으로 1차 병합
4. `institutions_master.json` 내보내기

이 4단계만 완료해도 대전 공공 평생교육기관의 기초 마스터를 빠르게 확보할 수 있다.
