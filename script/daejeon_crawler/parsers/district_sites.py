from __future__ import annotations

from .base import BaseParser
from ..models import InstitutionCandidate, RawDocument, SourceRecord


INSTITUTION_KEYWORDS = ("평생학습센터", "평생학습관", "평생학습원", "평생교육원", "도서관")
NOISE_TERMS = (
    "신청",
    "운영",
    "소개",
    "안내",
    "로그인",
    "회원",
    "전체",
    "강좌",
    "과정",
    "공지",
    "자료",
    "수강",
    "질문",
    "답변",
    "배너",
    "열기",
    "닫기",
)


class DistrictSiteParser(BaseParser):
    primary_name: str = ""
    primary_confidence: float = 0.85

    def parse(
        self, source: SourceRecord, raw_document: RawDocument
    ) -> list[InstitutionCandidate]:
        text = self.plain_text(raw_document.text_content)
        recent_date = self.first_date(text)
        candidates: list[InstitutionCandidate] = [
            self.make_candidate(
                source,
                raw_document,
                self.primary_name or source.name_ko,
                homepage_url=source.entry_url,
                phone=self.first_phone(text),
                address=self.first_address(text),
                operation_status="운영중" if recent_date else "재확인필요",
                recent_activity_date=recent_date,
                confidence_score=self.primary_confidence,
                extraction_notes="Primary district lifelong learning institution",
            )
        ]

        seen = {self.primary_name or source.name_ko}
        for label, href in self.filtered_links(source.base_url, raw_document.text_content, INSTITUTION_KEYWORDS):
            normalized = " ".join(label.split())
            if not normalized or normalized in seen:
                continue
            if any(term in normalized for term in NOISE_TERMS):
                continue
            if len(normalized) < 4:
                continue
            seen.add(normalized)
            candidates.append(
                self.make_candidate(
                    source,
                    raw_document,
                    normalized,
                    source_url=href,
                    homepage_url=href,
                    operation_status="재확인필요",
                    confidence_score=0.55 if "도서관" in normalized else 0.5,
                    extraction_notes="District sub-institution discovered from filtered navigation",
                )
            )

        return candidates


class DongguPortalParser(DistrictSiteParser):
    parser_family = "donggu_portal"
    primary_name = "동구 평생학습포털"


class YuseongPortalParser(DistrictSiteParser):
    parser_family = "yuseong_portal"
    primary_name = "유성구 평생학습원"


class DaedeokPortalParser(DistrictSiteParser):
    parser_family = "daedeok_portal"
    primary_name = "대덕구 평생학습원"
