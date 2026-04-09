from __future__ import annotations

from .base import BaseParser
from ..models import InstitutionCandidate, RawDocument, SourceRecord


DISCOVERY_KEYWORDS = ("평생학습센터", "평생학습관", "평생교육원", "도서관")


class GenericPortalParser(BaseParser):
    parser_family = "generic_portal"

    def parse(
        self, source: SourceRecord, raw_document: RawDocument
    ) -> list[InstitutionCandidate]:
        text = self.plain_text(raw_document.text_content)
        recent_date = self.first_date(text)
        candidates: list[InstitutionCandidate] = [
            self.make_candidate(
                source,
                raw_document,
                source.name_ko,
                homepage_url=source.entry_url,
                phone=self.first_phone(text),
                address=self.first_address(text),
                operation_status="운영중" if recent_date else "재확인필요",
                recent_activity_date=recent_date,
                confidence_score=0.8,
                extraction_notes="Primary institution extracted from portal homepage",
            )
        ]

        for label, href in self.filtered_links(source.base_url, raw_document.text_content, DISCOVERY_KEYWORDS):
            if label == source.name_ko:
                continue
            candidates.append(
                self.make_candidate(
                    source,
                    raw_document,
                    label,
                    source_url=href,
                    homepage_url=href,
                    operation_status="재확인필요",
                    confidence_score=0.45,
                    extraction_notes="Seed candidate discovered from portal navigation",
                )
            )
        return candidates
