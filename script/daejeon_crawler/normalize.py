from __future__ import annotations

import re

from .models import InstitutionCandidate

PHONE_DIGITS_RE = re.compile(r"\d+")


def normalize_candidate(candidate: InstitutionCandidate) -> InstitutionCandidate:
    candidate.raw_name = _clean_space(candidate.raw_name)
    candidate.canonical_name = normalize_name(candidate.canonical_name or candidate.raw_name)
    candidate.phone = normalize_phone(candidate.phone)
    candidate.address = normalize_address(candidate.address)
    candidate.sigungu = detect_sigungu(candidate.address, candidate.sigungu)
    candidate.eupmyeondong = detect_eupmyeondong(candidate.address, candidate.eupmyeondong)
    candidate.institution_type = infer_institution_type(
        candidate.institution_type, candidate.canonical_name
    )
    candidate.operation_status = candidate.operation_status or "재확인필요"
    candidate.confidence_score = max(candidate.confidence_score, base_confidence(candidate))
    return candidate


def normalize_name(name: str) -> str:
    value = _clean_space(name)
    for prefix in ("대전광역시교육청 ", "대전광역시 ", "대전 "):
        if value.startswith(prefix):
            value = value[len(prefix) :]
            break
    value = re.sub(r"\([^)]*\)", "", value).strip()
    return _clean_space(value)


def normalize_phone(phone: str | None) -> str | None:
    if not phone:
        return None
    digits = "".join(PHONE_DIGITS_RE.findall(phone))
    if len(digits) == 10 and digits.startswith("042"):
        return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"
    if len(digits) == 11 and digits.startswith("010"):
        return f"{digits[:3]}-{digits[3:7]}-{digits[7:]}"
    return phone.strip() or None


def normalize_address(address: str | None) -> str | None:
    if not address:
        return None
    value = _clean_space(address)
    if "대전" in value and not value.startswith("대전광역시"):
        value = value.replace("대전 ", "대전광역시 ", 1)
    for token in (" TEL", " FAX", " Copyright", " 메뉴보기", " 닫기", " 하루동안", " All Rights Reserved"):
        if token in value:
            value = value.split(token, 1)[0].strip()
    if "대전광역시" in value:
        last_digit = max(value.rfind(str(n)) for n in range(10))
        if last_digit != -1 and last_digit + 1 < len(value):
            trailing = value[last_digit + 1 :]
            if len(trailing) > 20:
                value = value[: last_digit + 1].strip()
    return normalize_display_address(value)


def normalize_display_address(address: str | None) -> str | None:
    if not address:
        return None
    value = _clean_space(address)
    value = re.sub(r"^대전광역시\s*", "대전 ", value)
    value = re.sub(r"^대전시\s*", "대전 ", value)
    value = re.sub(r"^대전\s+", "대전 ", value)
    return value


def detect_sigungu(address: str | None, existing: str | None) -> str | None:
    if existing:
        return existing
    if not address:
        return None
    for name in ("동구", "중구", "서구", "유성구", "대덕구"):
        if name in address:
            return name
    return None


def detect_eupmyeondong(address: str | None, existing: str | None) -> str | None:
    if existing:
        return existing
    if not address:
        return None
    match = re.search(r"([가-힣0-9ㆍ]+동)", address)
    return match.group(1) if match else None


def infer_institution_type(current: str | None, name: str | None) -> str | None:
    if current:
        return current
    if not name:
        return None
    if "평생교육진흥원" in name:
        return "metro_hub"
    if "평생학습관" in name and "동" not in name[:6]:
        return "district_lifelong_center"
    if "평생학습원" in name:
        return "district_lifelong_center"
    if "평생교육원" in name:
        return "university_extension"
    if "도서관" in name:
        return "public_library"
    if "센터" in name:
        return "dong_lifelong_center"
    return "other_public_partner"


def base_confidence(candidate: InstitutionCandidate) -> float:
    score = 0.2
    if candidate.homepage_url:
        score += 0.25
    if candidate.phone:
        score += 0.2
    if candidate.address:
        score += 0.2
    if candidate.operation_status == "운영중":
        score += 0.15
    return min(score, 1.0)


def _clean_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()
