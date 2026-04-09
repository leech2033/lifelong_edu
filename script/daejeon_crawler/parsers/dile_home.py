from __future__ import annotations

from .base import BaseParser
from ..models import InstitutionCandidate, RawDocument, SourceRecord


class DileHomeParser(BaseParser):
    parser_family = "dile_home"

    def parse(
        self, source: SourceRecord, raw_document: RawDocument
    ) -> list[InstitutionCandidate]:
        text = self.plain_text(raw_document.text_content)
        links = self.extract_links(source.base_url, raw_document.text_content)
        candidates: list[InstitutionCandidate] = [
            InstitutionCandidate(
                run_id=raw_document.run_id,
                source_id=source.source_id,
                source_url=raw_document.url,
                raw_name="대전평생교육진흥원",
                operator_name=source.owner,
                homepage_url=source.entry_url,
                phone=self.first_phone(text),
                address=self.first_address(text),
                operation_status="운영중" if self.first_date(text) else "재확인필요",
                recent_activity_date=self.first_date(text),
                confidence_score=0.85,
                extraction_notes="Primary metro hub extracted from homepage",
            )
        ]

        for label, href in links:
            if any(keyword in label for keyword in ("평생학습관", "평생학습원", "평생교육원", "도서관")):
                candidates.append(
                    InstitutionCandidate(
                        run_id=raw_document.run_id,
                        source_id=source.source_id,
                        source_url=href,
                        raw_name=label,
                        operator_name=source.owner,
                        homepage_url=href,
                        confidence_score=0.5,
                        extraction_notes="Seed candidate discovered from DILE link block",
                    )
                )
        return candidates
