from __future__ import annotations

from .base import BaseParser
from ..models import InstitutionCandidate, RawDocument, SourceRecord


CENTER_KEYWORDS = ("평생학습기관안내", "동 평생학습센터", "평생학습센터")


class JungguPortalParser(BaseParser):
    parser_family = "junggu_portal"

    def parse(
        self, source: SourceRecord, raw_document: RawDocument
    ) -> list[InstitutionCandidate]:
        text = self.plain_text(raw_document.text_content)
        recent_date = self.first_date(text)
        candidates: list[InstitutionCandidate] = [
            self.make_candidate(
                source,
                raw_document,
                "중구 평생학습관",
                homepage_url=source.entry_url,
                phone=self.first_phone(text),
                address=self.first_address(text),
                operation_status="운영중" if recent_date else "재확인필요",
                recent_activity_date=recent_date,
                confidence_score=0.85,
                extraction_notes="Primary Junggu lifelong learning center",
            )
        ]

        for label, href in self.filtered_links(source.base_url, raw_document.text_content, CENTER_KEYWORDS):
            if "기관안내" in label:
                continue
            candidates.append(
                self.make_candidate(
                    source,
                    raw_document,
                    label,
                    source_url=href,
                    homepage_url=href,
                    operation_status="재확인필요",
                    confidence_score=0.5,
                    extraction_notes="Junggu center discovered from navigation",
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
