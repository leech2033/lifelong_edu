from __future__ import annotations

from .attachment_seed import AttachmentSeedParser
from .dile_home import DileHomeParser
from .district_sites import DaedeokPortalParser, DongguPortalParser, YuseongPortalParser
from .generic_portal import GenericPortalParser
from .junggu_portal import JungguPortalParser
from .seogu_portal import SeoguPortalParser

PARSER_BY_FAMILY = {
    "dile_home": DileHomeParser,
    "dile_board_attachment": AttachmentSeedParser,
    "junggu_portal": JungguPortalParser,
    "junggu_institution_directory": JungguPortalParser,
    "junggu_dong_centers": JungguPortalParser,
    "seogu_portal": SeoguPortalParser,
    "dllc_home": GenericPortalParser,
    "donggu_portal": DongguPortalParser,
    "yuseong_portal": YuseongPortalParser,
    "daedeok_portal": DaedeokPortalParser,
    "nurim_catalog": GenericPortalParser,
    "sugang_catalog": GenericPortalParser,
    "university_extension_home": GenericPortalParser,
}


def get_parser(parser_family: str):
    parser_class = PARSER_BY_FAMILY.get(parser_family, GenericPortalParser)
    return parser_class()
