from __future__ import annotations

import re
from abc import ABC, abstractmethod
from html import unescape
from urllib.parse import urljoin

from ..models import InstitutionCandidate, RawDocument, SourceRecord

try:
    from bs4 import BeautifulSoup  # type: ignore
except ImportError:  # pragma: no cover
    BeautifulSoup = None


PHONE_RE = re.compile(r"(042[-)\s]?\d{3,4}[-\s]?\d{4})")
DATE_RE = re.compile(r"(20\d{2}[.-]\d{1,2}[.-]\d{1,2})")
ADDRESS_RE = re.compile(
    r"(대전(?:광역시)?\s+(?:동구|중구|서구|유성구|대덕구)\s+[가-힣0-9ㆍ ]+(?:로|길|동)[^<\n]*)"
)
LINK_RE = re.compile(
    r'<a [^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
    re.IGNORECASE | re.DOTALL,
)


class BaseParser(ABC):
    parser_family: str

    @abstractmethod
    def parse(
        self,
        source: SourceRecord,
        raw_document: RawDocument,
    ) -> list[InstitutionCandidate]:
        raise NotImplementedError

    def plain_text(self, html: str | None) -> str:
        if not html:
            return ""
        if BeautifulSoup:
            return BeautifulSoup(html, "html.parser").get_text(" ", strip=True)
        text = re.sub(r"<[^>]+>", " ", html)
        return re.sub(r"\s+", " ", unescape(text)).strip()

    def soup(self, html: str | None):
        if not html or not BeautifulSoup:
            return None
        return BeautifulSoup(html, "html.parser")

    def extract_links(self, base_url: str, html: str | None) -> list[tuple[str, str]]:
        if not html:
            return []
        if BeautifulSoup:
            soup = BeautifulSoup(html, "html.parser")
            links: list[tuple[str, str]] = []
            for anchor in soup.find_all("a", href=True):
                text = anchor.get_text(" ", strip=True)
                href = urljoin(base_url, anchor["href"])
                if text:
                    links.append((text, href))
            return links
        return [
            (re.sub(r"\s+", " ", unescape(text)).strip(), urljoin(base_url, href))
            for href, text in LINK_RE.findall(html)
            if re.sub(r"\s+", " ", unescape(text)).strip()
        ]

    def filtered_links(
        self,
        base_url: str,
        html: str | None,
        keywords: tuple[str, ...],
    ) -> list[tuple[str, str]]:
        return [
            (label, href)
            for label, href in self.extract_links(base_url, html)
            if any(keyword in label for keyword in keywords)
            and self.is_probable_institution_label(label)
        ]

    def first_phone(self, text: str) -> str | None:
        match = PHONE_RE.search(text)
        return match.group(1) if match else None

    def first_date(self, text: str) -> str | None:
        match = DATE_RE.search(text)
        return match.group(1).replace(".", "-") if match else None

    def first_address(self, text: str) -> str | None:
        match = ADDRESS_RE.search(text)
        return re.sub(r"\s+", " ", match.group(1)).strip() if match else None

    def make_candidate(
        self,
        source: SourceRecord,
        raw_document: RawDocument,
        raw_name: str,
        *,
        source_url: str | None = None,
        homepage_url: str | None = None,
        operator_name: str | None = None,
        phone: str | None = None,
        address: str | None = None,
        operation_status: str | None = None,
        recent_activity_date: str | None = None,
        confidence_score: float = 0.4,
        extraction_notes: str | None = None,
    ) -> InstitutionCandidate:
        return InstitutionCandidate(
            run_id=raw_document.run_id,
            source_id=source.source_id,
            source_url=source_url or raw_document.url,
            raw_name=raw_name,
            operator_name=operator_name or source.owner,
            homepage_url=homepage_url,
            phone=phone,
            address=address,
            operation_status=operation_status,
            recent_activity_date=recent_activity_date,
            confidence_score=confidence_score,
            extraction_notes=extraction_notes,
        )

    def is_probable_institution_label(self, label: str) -> bool:
        normalized = " ".join(label.split())
        if not normalized:
            return False
        if len(normalized) < 3 or len(normalized) > 40:
            return False
        if any(token in normalized for token in ("자세히보기", "로그인", "회원가입", "닫기", "열기", "전체보기")):
            return False
        if any(token in normalized for token in ("신청", "운영", "소개", "안내", "공지", "질문", "답변", "배너")):
            return False
        if any(mark in normalized for mark in ("?", "!", ":", ";", "/", "http")):
            return False
        return True
