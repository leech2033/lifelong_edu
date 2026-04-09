from __future__ import annotations

from .base import BaseParser
from ..models import InstitutionCandidate, RawDocument, SourceRecord


class AttachmentSeedParser(BaseParser):
    parser_family = "attachment_seed"

    def parse(
        self, source: SourceRecord, raw_document: RawDocument
    ) -> list[InstitutionCandidate]:
        text = self.plain_text(raw_document.text_content)
        names: list[str] = []
        for token in text.split():
            if "기관" in token or "센터" in token or "도서관" in token or "평생교육원" in token:
                names.append(token)
        unique_names = list(dict.fromkeys(names))[:30]
        return [
            InstitutionCandidate(
                run_id=raw_document.run_id,
                source_id=source.source_id,
                source_url=raw_document.url,
                raw_name=name,
                confidence_score=0.35,
                extraction_notes="Attachment/OCR seed candidate",
            )
            for name in unique_names
        ]
