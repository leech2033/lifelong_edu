from __future__ import annotations

from .models import InstitutionCandidate, MasterInstitution


def build_review_queue(
    candidates: list[InstitutionCandidate], masters: list[MasterInstitution]
) -> list[dict[str, str | float | None]]:
    review_items: list[dict[str, str | float | None]] = []
    for candidate in candidates:
        reasons: list[str] = []
        if candidate.confidence_score < 0.6:
            reasons.append("low_confidence")
        if not candidate.address:
            reasons.append("missing_address")
        if not candidate.phone:
            reasons.append("missing_phone")
        if "attachment" in candidate.source_id:
            reasons.append("attachment_seed")
        if reasons:
            review_items.append(
                {
                    "source_id": candidate.source_id,
                    "name": candidate.canonical_name or candidate.raw_name,
                    "sigungu": candidate.sigungu,
                    "confidence_score": candidate.confidence_score,
                    "reasons": ",".join(reasons),
                }
            )

    seen = {item["name"] for item in review_items}
    for master in masters:
        if master.confidence_score < 0.6 and master.canonical_name not in seen:
            review_items.append(
                {
                    "source_id": ",".join(master.source_ids),
                    "name": master.canonical_name,
                    "sigungu": master.sigungu,
                    "confidence_score": master.confidence_score,
                    "reasons": "low_confidence_master",
                }
            )
    return review_items
