from __future__ import annotations

from .base import BaseParser
from ..models import InstitutionCandidate, RawDocument, SourceRecord


LIBRARY_KEYWORDS = ("도서관", "평생학습원", "평생학습관")


class SeoguPortalParser(BaseParser):
    parser_family = "seogu_portal"

    def parse(
        self, source: SourceRecord, raw_document: RawDocument
    ) -> list[InstitutionCandidate]:
        text = self.plain_text(raw_document.text_content)
        recent_date = self.first_date(text)
        candidates: list[InstitutionCandidate] = [
            self.make_candidate(
                source,
                raw_document,
                "서구 평생학습원",
                homepage_url=source.entry_url,
                phone=self.first_phone(text),
                address=self.first_address(text),
                operation_status="운영중" if recent_date else "재확인필요",
                recent_activity_date=recent_date,
                confidence_score=0.85,
                extraction_notes="Primary Seogu lifelong learning center",
            )
        ]

        for label, href in self.filtered_links(source.base_url, raw_document.text_content, LIBRARY_KEYWORDS):
            if label == "서구 평생학습원":
                continue
            notes = "Seogu linked library or sub-institution"
            candidates.append(
                self.make_candidate(
                    source,
                    raw_document,
                    label,
                    source_url=href,
                    homepage_url=href,
                    operation_status="재확인필요",
                    confidence_score=0.5 if "도서관" in label else 0.55,
                    extraction_notes=notes,
                )
            )
        return _dedupe_by_name(candidates)


def _dedupe_by_name(candidates: list[InstitutionCandidate]) -> list[InstitutionCandidate]:
    seen: set[str] = set()
    result: list[InstitutionCandidate] = []
    for candidate in candidates:
        key = candidate.raw_name.strip()
        if key in seen:
            continue
        seen.add(key)
        result.append(candidate)
    return result
