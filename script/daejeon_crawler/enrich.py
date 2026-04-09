from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .models import MasterInstitution
from .normalize import normalize_display_address
from .settings import FIXTURES_DIR


DEFAULT_ENRICH_SEED_PATH = FIXTURES_DIR / "daejeon_enrich_seeds.json"


def load_enrich_seeds(seed_path: str | Path | None = None) -> list[dict[str, Any]]:
    path = Path(seed_path) if seed_path else DEFAULT_ENRICH_SEED_PATH
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def apply_enrich_seeds_to_masters(
    masters: list[MasterInstitution],
    seed_path: str | Path | None = None,
) -> list[MasterInstitution]:
    seed_map = _build_seed_map(load_enrich_seeds(seed_path))
    if not seed_map:
        return masters

    enriched: list[MasterInstitution] = []
    for master in masters:
        seed = seed_map.get(master.canonical_name)
        if not seed:
            enriched.append(master)
            continue
        enriched.append(
            MasterInstitution(
                institution_id=master.institution_id,
                canonical_name=master.canonical_name,
                display_name=seed.get("display_name") or master.display_name,
                institution_type=seed.get("institution_type") or master.institution_type,
                operator_name=seed.get("operator_name") or master.operator_name,
                homepage_url=seed.get("homepage_url") or master.homepage_url,
                phone=seed.get("phone") or master.phone,
                road_address=normalize_display_address(
                    seed.get("road_address") or master.road_address
                ),
                sido=_normalize_region_name(seed.get("sido") or master.sido),
                sigungu=seed.get("sigungu") or master.sigungu,
                eupmyeondong=seed.get("eupmyeondong") or master.eupmyeondong,
                operation_status=seed.get("operation_status") or master.operation_status,
                confidence_score=max(master.confidence_score, float(seed.get("confidence_score", 0.95))),
                source_count=master.source_count,
                source_ids=master.source_ids,
                last_crawled_at=master.last_crawled_at,
                last_verified_at=seed.get("last_verified_at") or master.last_verified_at,
            )
        )
    return enriched


def apply_enrich_seeds_to_json_rows(
    rows: list[dict[str, Any]],
    seed_path: str | Path | None = None,
) -> list[dict[str, Any]]:
    seed_map = _build_seed_map(load_enrich_seeds(seed_path))
    if not seed_map:
        return rows

    enriched_rows: list[dict[str, Any]] = []
    for row in rows:
        name = str(row.get("canonical_name") or row.get("display_name") or "")
        seed = seed_map.get(name)
        if not seed:
            enriched_rows.append(row)
            continue
        next_row = dict(row)
        for field in (
            "display_name",
            "institution_type",
            "operator_name",
            "homepage_url",
            "phone",
            "sido",
            "sigungu",
            "eupmyeondong",
            "operation_status",
            "last_verified_at",
        ):
            if seed.get(field):
                next_row[field] = seed[field]
        if seed.get("confidence_score") is not None:
            next_row["confidence_score"] = max(
                float(next_row.get("confidence_score") or 0),
                float(seed["confidence_score"]),
            )
        next_row["road_address"] = normalize_display_address(
            seed.get("road_address") or next_row.get("road_address")
        )
        next_row["sido"] = _normalize_region_name(seed.get("sido") or next_row.get("sido"))
        enriched_rows.append(next_row)
    return enriched_rows


def _build_seed_map(seeds: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    seed_map: dict[str, dict[str, Any]] = {}
    for seed in seeds:
        canonical_name = seed.get("canonical_name")
        if canonical_name:
            seed_map[str(canonical_name)] = seed
        for alias in seed.get("aliases", []):
            seed_map[str(alias)] = seed
    return seed_map


def _normalize_region_name(value: Any) -> Any:
    if value in ("대전광역시", "대전시"):
        return "대전"
    return value
