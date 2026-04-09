from __future__ import annotations

import asyncio
import hashlib
import importlib.util
from datetime import datetime, timezone

from .models import RawDocument, SourceRecord
from .settings import RAW_DIR, ensure_output_dirs


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _browser_output_path(run_id: str, source_id: str) -> str:
    return str(RAW_DIR / f"{run_id}__{source_id}__browser.html")


def browser_available() -> bool:
    return importlib.util.find_spec("playwright") is not None


async def _fetch_html_async(url: str) -> tuple[str, str]:
    from playwright.async_api import async_playwright  # type: ignore

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="networkidle", timeout=45000)
        html = await page.content()
        final_url = page.url
        await browser.close()
        return final_url, html


def fetch_with_browser(source: SourceRecord, run_id: str) -> RawDocument:
    ensure_output_dirs()
    fetched_at = _utc_now_iso()
    if not browser_available():
        return RawDocument(
            run_id=run_id,
            source_id=source.source_id,
            fetched_at=fetched_at,
            url=source.entry_url,
            fetch_method="browser",
            error_message=(
                "Playwright for Python is not installed. "
                "Install with: pip install playwright && playwright install chromium"
            ),
        )

    try:
        final_url, html = asyncio.run(_fetch_html_async(source.entry_url))
        output_path = _browser_output_path(run_id, source.source_id)
        RAW_DIR.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as handle:
            handle.write(html)
        return RawDocument(
            run_id=run_id,
            source_id=source.source_id,
            fetched_at=fetched_at,
            url=final_url,
            fetch_method="browser",
            http_status=200,
            content_type="text/html",
            encoding="utf-8",
            body_path=output_path,
            body_sha256=hashlib.sha256(html.encode("utf-8")).hexdigest(),
            text_content=html,
        )
    except Exception as exc:  # pragma: no cover
        return RawDocument(
            run_id=run_id,
            source_id=source.source_id,
            fetched_at=fetched_at,
            url=source.entry_url,
            fetch_method="browser",
            error_message=str(exc),
        )
