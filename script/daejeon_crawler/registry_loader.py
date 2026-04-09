from __future__ import annotations

import json
from pathlib import Path

from .models import SourceRecord
from .settings import DEFAULT_REGISTRY_PATHS


def resolve_registry_path(explicit_path: str | None = None) -> Path:
    if explicit_path:
        path = Path(explicit_path)
        if not path.exists():
            raise FileNotFoundError(f"Registry file not found: {path}")
        return path

    for path in DEFAULT_REGISTRY_PATHS:
        if path.exists():
            return path

    searched = ", ".join(str(path) for path in DEFAULT_REGISTRY_PATHS)
    raise FileNotFoundError(f"No registry file found. Looked in: {searched}")


def load_registry(registry_path: str | None = None) -> list[SourceRecord]:
    path = resolve_registry_path(registry_path)
    data = json.loads(path.read_text(encoding="utf-8"))
    return [SourceRecord.from_dict(item) for item in data]


def filter_sources(
    sources: list[SourceRecord],
    source_id: str | None = None,
    scope: str | None = None,
) -> list[SourceRecord]:
    filtered = sources
    if source_id:
        filtered = [source for source in filtered if source.source_id == source_id]
    if scope:
        filtered = [
            source
            for source in filtered
            if source.coverage_level == scope or scope in source.region_scope
        ]
    return sorted(filtered, key=lambda item: (-item.priority, item.source_id))
