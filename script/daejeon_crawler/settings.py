from __future__ import annotations

from pathlib import Path


PACKAGE_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = PACKAGE_ROOT.parent.parent
FIXTURES_DIR = PACKAGE_ROOT / "fixtures"
OUTPUT_DIR = PACKAGE_ROOT / "output"
RAW_DIR = OUTPUT_DIR / "raw"
PARSED_DIR = OUTPUT_DIR / "parsed"
LOGS_DIR = OUTPUT_DIR / "logs"
DB_PATH = OUTPUT_DIR / "daejeon_crawler.sqlite3"

DEFAULT_REGISTRY_PATHS = [
    FIXTURES_DIR / "daejeon_source_registry.json",
    PROJECT_ROOT / "reports" / "daejeon_source_registry_draft.json",
]


def ensure_output_dirs() -> None:
    for path in (OUTPUT_DIR, RAW_DIR, PARSED_DIR, LOGS_DIR, FIXTURES_DIR):
        path.mkdir(parents=True, exist_ok=True)
