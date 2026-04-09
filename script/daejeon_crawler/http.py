from __future__ import annotations

import hashlib
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .models import RawDocument, SourceRecord
from .settings import RAW_DIR, ensure_output_dirs

DEFAULT_HEADERS = {
    "User-Agent": "LifelongEdu-DaejeonCrawler/0.1 (+https://example.invalid)",
    "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.6",
}

META_CHARSET_RE = re.compile(br'charset=["\']?([A-Za-z0-9\-_]+)', re.IGNORECASE)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _raw_file_path(run_id: str, source_id: str) -> Path:
    return RAW_DIR / f"{run_id}__{source_id}.html"


def decode_body(body: bytes, header_encoding: str | None = None) -> tuple[str, str]:
    encodings: list[str] = []
    if header_encoding:
        encodings.append(header_encoding)

    meta_match = META_CHARSET_RE.search(body[:4096])
    if meta_match:
        encodings.append(meta_match.group(1).decode("ascii", errors="ignore").lower())

    encodings.extend(["utf-8", "cp949", "euc-kr"])

    tried: list[str] = []
    best_text = ""
    best_encoding = "utf-8"
    best_score = -1

    for encoding in encodings:
        encoding = encoding.lower()
        if encoding in tried:
            continue
        tried.append(encoding)
        try:
            text = body.decode(encoding, errors="replace")
        except LookupError:
            continue

        hangul = sum(1 for ch in text if "가" <= ch <= "힣")
        replacement_penalty = text.count("\ufffd") * 3
        mojibake_penalty = text.count("?") // 5
        score = hangul - replacement_penalty - mojibake_penalty
        if score > best_score:
            best_score = score
            best_text = text
            best_encoding = encoding

    return best_text, best_encoding


def fetch_source(source: SourceRecord, run_id: str, timeout: int = 20) -> RawDocument:
    ensure_output_dirs()
    request = Request(source.entry_url, headers=DEFAULT_HEADERS)
    fetched_at = utc_now_iso()
    try:
        with urlopen(request, timeout=timeout) as response:
            body = response.read()
            content_type = response.headers.get_content_type()
            text, encoding = decode_body(body, response.headers.get_content_charset())
            output_path = _raw_file_path(run_id, source.source_id)
            output_path.write_text(text, encoding="utf-8")
            return RawDocument(
                run_id=run_id,
                source_id=source.source_id,
                fetched_at=fetched_at,
                url=response.geturl(),
                http_status=getattr(response, "status", None),
                content_type=content_type,
                encoding=encoding,
                body_path=str(output_path),
                body_sha256=hashlib.sha256(body).hexdigest(),
                text_content=text,
                fetch_method="http",
            )
    except HTTPError as exc:
        return RawDocument(
            run_id=run_id,
            source_id=source.source_id,
            fetched_at=fetched_at,
            url=source.entry_url,
            fetch_method="http",
            http_status=exc.code,
            error_message=str(exc),
        )
    except URLError as exc:
        return RawDocument(
            run_id=run_id,
            source_id=source.source_id,
            fetched_at=fetched_at,
            url=source.entry_url,
            fetch_method="http",
            error_message=str(exc),
        )


def should_use_browser_fallback(source: SourceRecord, raw: RawDocument) -> bool:
    if "playwright" not in source.transport and "playwright" not in source.extraction_mode:
        return False
    if raw.error_message:
        return True
    text = (raw.text_content or "").strip()
    if len(text) < 200:
        return True
    return False
