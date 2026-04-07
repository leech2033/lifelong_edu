# LifelongEduPortal

평생교육 포털 성격의 웹 프로젝트입니다.  
프런트엔드는 `React + Vite + TypeScript`, 서버는 `Express + TypeScript`로 구성되어 있으며, 개발 환경에서는 Express 서버가 Vite를 붙여 함께 서비스합니다.

## 프로젝트 개요

이 저장소는 다음 기능을 중심으로 구성되어 있습니다.

- 메인 랜딩 페이지
- 지역별 평생교육 기관 목록/상세
- 온라인 강좌 목록/상세
- 지역 프로그램 목록/상세
- 공모사업, 자료실, 성과집, 우수사례, 대시보드 화면

현재 서버 API는 최소 구조만 존재하며, 서비스의 대부분은 정적 데이터와 SPA 라우팅 중심으로 동작합니다.

## 기술 스택

- React 19
- Vite 7
- TypeScript
- Express 4
- Wouter
- TanStack Query
- Tailwind CSS 4
- Drizzle ORM

## 폴더 구조

```text
client/         프런트엔드 앱
server/         Express 서버
shared/         서버/클라이언트 공용 타입 및 스키마
script/         데이터 가공 및 빌드 스크립트
attached_assets/ 이미지, 원본 CSV/XLSX/PDF 등 첨부 자산
```

주요 파일:

- `package.json`: 실행/빌드 스크립트
- `server/index.ts`: 서버 진입점
- `server/routes.ts`: API 라우트 등록 위치
- `vite.config.ts`: Vite 설정
- `script/build.ts`: 프로덕션 빌드 스크립트

## 요구 사항

- Node.js 20 이상 권장
- npm 10 이상 권장

버전 확인:

```powershell
node -v
npm -v
```

## 설치

```powershell
npm install
```

## 개발 실행

이 프로젝트의 `package.json`에는 아래 스크립트가 있습니다.

```json
"dev": "NODE_ENV=development tsx server/index.ts"
```

이 스크립트는 Unix 셸 문법 기준이라 Windows PowerShell에서는 그대로 동작하지 않을 수 있습니다.  
Windows에서는 아래 방식으로 실행하는 것이 안전합니다.

```powershell
$env:NODE_ENV="development"
npx tsx server/index.ts
```

실행 후 접속 주소:

```text
http://localhost:5000
```

개발 서버는 Express가 `5000` 포트에서 뜨고, 개발 모드에서 내부적으로 Vite를 연결해 클라이언트까지 함께 제공합니다.

## 빌드

```powershell
npm run build
```

빌드 결과물:

- `dist/index.cjs`: 서버 번들
- `dist/public`: 정적 프런트 빌드 결과

## 프로덕션 실행

```powershell
$env:NODE_ENV="production"
node dist/index.cjs
```

기본 포트:

- `PORT` 환경변수가 있으면 해당 값 사용
- 없으면 `5000` 사용

## 환경 변수

현재 코드 기준 필수 환경 변수는 많지 않지만, 아래 항목은 참고가 필요합니다.

- `PORT`: 서버 포트
- `DATABASE_URL`: `drizzle.config.ts`에서 DB 푸시 작업 시 필요

주의:

- 현재 앱 자체는 메모리 스토리지(`server/storage.ts`)를 사용하므로, 단순 화면 실행만 할 경우 DB 없이도 동작 가능성이 높습니다.
- 다만 `drizzle-kit push` 같은 DB 작업을 할 때는 `DATABASE_URL`이 필요합니다.

## GitHub 업로드 방법

아직 이 폴더는 Git 저장소가 아닐 수 있습니다. 처음 업로드할 때는 아래 순서로 진행하면 됩니다.

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

이미 GitHub에 빈 저장소를 만들어 둔 상태라면 `USERNAME`과 `REPOSITORY`만 본인 값으로 바꾸면 됩니다.

## 포함/제외 파일

현재 `.gitignore`에는 아래 항목이 제외됩니다.

- `node_modules`
- `dist`
- `.DS_Store`
- `server/public`
- `vite.config.ts.*`
- `*.tar.gz`

일반적으로 아래는 GitHub에 포함해도 됩니다.

- `client/`
- `server/`
- `shared/`
- `script/`
- `attached_assets/`
- `package.json`
- `package-lock.json`

단, `attached_assets/` 안에는 이미지, 문서, CSV/XLSX 등 용량이 큰 파일이 많으므로 저장소 크기를 줄이고 싶다면 별도 정리가 필요할 수 있습니다.

## 확인된 주의 사항

- 일부 화면 파일에서 한글 문자열이 깨져 보입니다. 인코딩 또는 파일 저장 문제일 가능성이 있습니다.
- `server/routes.ts`는 현재 비어 있어 API 기능은 사실상 미구현 상태입니다.
- Windows에서 `npm run dev`가 바로 동작하지 않을 수 있습니다.

## 추천 개선 사항

운영 또는 협업을 위해 아래 작업을 권장합니다.

- `cross-env`를 도입해 Windows/macOS/Linux에서 동일하게 `npm run dev` 실행되도록 수정
- 깨진 한글 문자열 정리
- 실제 API 라우트 구현 또는 불필요한 서버 코드 축소
- `.env.example` 추가
- 배포 대상에 맞는 README 보강

## 라이선스

현재 `package.json` 기준 라이선스는 `MIT`입니다.
