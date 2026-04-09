from __future__ import annotations

from collections import defaultdict

from .models import InstitutionCandidate, MasterInstitution


def dedupe_candidates(candidates: list[InstitutionCandidate]) -> list[MasterInstitution]:
    grouped: dict[tuple[str, str | None], list[InstitutionCandidate]] = defaultdict(list)
    for candidate in candidates:
        key = (candidate.canonical_name or candidate.raw_name, candidate.phone)
        grouped[key].append(candidate)

    masters: list[MasterInstitution] = []
    for index, group in enumerate(grouped.values(), start=1):
        primary = sorted(group, key=lambda item: item.confidence_score, reverse=True)[0]
        masters.append(
            MasterInstitution(
                institution_id=f"dj-{index:04d}",
                canonical_name=primary.canonical_name or primary.raw_name,
                display_name=primary.raw_name,
                institution_type=primary.institution_type or "other_public_partner",
                operator_name=primary.operator_name,
                homepage_url=primary.homepage_url,
                phone=primary.phone,
                road_address=primary.address,
                sido=primary.sido,
                sigungu=primary.sigungu,
                eupmyeondong=primary.eupmyeondong,
                operation_status=_merge_operation_status(group),
                confidence_score=max(item.confidence_score for item in group),
                source_count=len({item.source_id for item in group}),
                source_ids=sorted({item.source_id for item in group}),
                last_crawled_at=max(item.recent_activity_date or "" for item in group),
            )
        )
    return masters


def _merge_operation_status(group: list[InstitutionCandidate]) -> str:
    statuses = {item.operation_status for item in group if item.operation_status}
    if "운영중단" in statuses:
        return "운영중단"
    if "운영중" in statuses:
        return "운영중"
    if "확인불가" in statuses:
        return "확인불가"
    return "재확인필요"
