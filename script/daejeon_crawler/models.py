from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(slots=True)
class SourceRecord:
    source_id: str
    name_ko: str
    owner: str
    coverage_level: str
    region_scope: list[str]
    base_url: str
    entry_url: str
    source_kind: str
    transport: str
    extraction_mode: str
    expected_entities: list[str]
    parser_family: str
    refresh_cadence: str
    priority: int
    trust_score: float
    verification_status: str
    dedupe_keys: list[str]
    output_hints: dict[str, Any] = field(default_factory=dict)
    notes: str = ""

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "SourceRecord":
        return cls(**data)


@dataclass(slots=True)
class RawDocument:
    run_id: str
    source_id: str
    fetched_at: str
    url: str
    fetch_method: str
    http_status: int | None = None
    content_type: str | None = None
    encoding: str | None = None
    body_path: str | None = None
    body_sha256: str | None = None
    text_content: str | None = None
    attachment_urls: list[str] = field(default_factory=list)
    error_message: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class InstitutionCandidate:
    run_id: str
    source_id: str
    source_url: str
    raw_name: str
    canonical_name: str | None = None
    institution_type: str | None = None
    operator_name: str | None = None
    homepage_url: str | None = None
    phone: str | None = None
    address: str | None = None
    sido: str = "대전광역시"
    sigungu: str | None = None
    eupmyeondong: str | None = None
    operation_status: str | None = None
    recent_activity_date: str | None = None
    confidence_score: float = 0.0
    extraction_notes: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class MasterInstitution:
    institution_id: str
    canonical_name: str
    display_name: str
    institution_type: str
    operator_name: str | None = None
    homepage_url: str | None = None
    phone: str | None = None
    road_address: str | None = None
    sido: str = "대전광역시"
    sigungu: str | None = None
    eupmyeondong: str | None = None
    operation_status: str = "재확인필요"
    confidence_score: float = 0.0
    source_count: int = 1
    source_ids: list[str] = field(default_factory=list)
    last_crawled_at: str = ""
    last_verified_at: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
