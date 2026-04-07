import type { InstitutionSummary } from "@/types/institution";
import seoulInstitutions from "@/pages/institutions/seoul_data.json";
import daejeonInstitutions from "@/pages/institutions/daejeon_data.json";
import busanInstitutions from "@/pages/institutions/busan_data.json";
import daeguInstitutions from "@/pages/institutions/daegu_data.json";
import incheonInstitutions from "@/pages/institutions/incheon_data.json";

const canonicalRegionNames = {
  seoul: "서울특별시",
  busan: "부산광역시",
  daegu: "대구광역시",
  incheon: "인천광역시",
  gwangju: "광주광역시",
  daejeon: "대전광역시",
  gyeonggi: "경기도",
  gangwon: "강원특별자치도",
  gyeongbuk: "경상북도",
  gyeongnam: "경상남도",
  jeju: "제주특별자치도",
} as const;

const regionAliases: Record<keyof typeof canonicalRegionNames, string[]> = {
  seoul: ["서울특별시", "서울"],
  busan: ["부산광역시", "부산"],
  daegu: ["대구광역시", "대구"],
  incheon: ["인천광역시", "인천"],
  gwangju: ["광주광역시", "광주"],
  daejeon: ["대전광역시", "대전"],
  gyeonggi: ["경기도", "경기"],
  gangwon: ["강원특별자치도", "강원도", "강원"],
  gyeongbuk: ["경상북도", "경북"],
  gyeongnam: ["경상남도", "경남"],
  jeju: ["제주특별자치도", "제주도", "제주"],
};

function inferRegionIdFromText(value?: string): keyof typeof canonicalRegionNames | undefined {
  if (!value) {
    return undefined;
  }

  for (const [regionId, aliases] of Object.entries(regionAliases) as Array<
    [keyof typeof canonicalRegionNames, string[]]
  >) {
    if (aliases.some((alias) => value.includes(alias))) {
      return regionId;
    }
  }

  return undefined;
}

function inferRegionId(institution: InstitutionSummary): keyof typeof canonicalRegionNames | undefined {
  const regionFromText =
    inferRegionIdFromText(institution.region) || inferRegionIdFromText(institution.detail_region);

  if (regionFromText) {
    return regionFromText;
  }

  const id = institution.id;
  const numericId = Number(id);

  if (!Number.isFinite(numericId)) {
    return undefined;
  }

  if (numericId >= 1 && numericId < 2000) return "daejeon";
  if (numericId >= 2000 && numericId < 4000) return "jeju";
  if (numericId >= 4000 && numericId < 6000) return "gangwon";
  if (numericId >= 6000 && numericId < 8000) return "gyeonggi";
  if (numericId >= 8000 && numericId < 10000) return "gyeongnam";
  if (numericId >= 10000 && numericId < 12000) return "gyeongbuk";
  if (numericId >= 12000 && numericId < 14000) return "busan";
  if (numericId >= 14000 && numericId < 16000) return "seoul";
  if (numericId >= 16000 && numericId < 18000) return "incheon";
  if (numericId >= 18000 && numericId < 20000) return "daegu";
  if (numericId >= 120000 && numericId < 140000) return "gwangju";

  return undefined;
}

function normalizeDetailRegion(detailRegion: string | undefined, regionName: string) {
  if (!detailRegion || detailRegion.includes("?")) {
    return regionName;
  }

  return detailRegion;
}

function normalizeInstitution(institution: InstitutionSummary): InstitutionSummary {
  const regionId = inferRegionId(institution);
  const canonicalRegionName = regionId ? canonicalRegionNames[regionId] : institution.region;
  const needsReview =
    institution.name.includes("?") ||
    institution.address.includes("?") ||
    institution.category.includes("?") ||
    institution.region.includes("?") ||
    institution.detail_region.includes("?") ||
    institution.status?.includes("?") === true;

  return {
    ...institution,
    regionId,
    region: canonicalRegionName,
    detail_region: normalizeDetailRegion(institution.detail_region, canonicalRegionName),
    status: institution.status?.includes("?") ? "운영중" : institution.status,
    sourceQuality: needsReview ? "needs_review" : "verified",
  };
}

const jejuInstitutions: InstitutionSummary[] = [
  { id: 2002, name: "제주시평생학습관", region: "제주특별자치도", detail_region: "제주 제주시", category: "국가 및 지자체", address: "제주특별자치 제주시 사라봉동길 15", phone: "064-728-2114", tags: ["공공", "국가 및 지자체"], status: "운영중", image: "/images/jeju_lifelong_learning_center.png" },
  { id: 2003, name: "한림읍 주민센터", region: "제주특별자치도", detail_region: "제주 제주시", category: "주민자치기관", address: "제주특별자치도 제주시 한림읍 한림상로 132", phone: "064-728-1521", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 2004, name: "애월읍 주민센터", region: "제주특별자치도", detail_region: "제주 제주시", category: "주민자치기관", address: "제주특별자치도 제주시 애월읍 일주서로 6322", phone: "064-728-1522", tags: ["공공", "주민자치기관"], status: "운영중", image: "/images/aewol_eup_office.png" },
  { id: 2005, name: "구좌읍 주민센터", region: "제주특별자치도", detail_region: "제주 제주시", category: "주민자치기관", address: "제주특별자치도 제주시 구좌읍 일주동로 3116", phone: "064-728-1523", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 2029, name: "서귀포시청", region: "제주특별자치도", detail_region: "제주 서귀포시", category: "국가 및 지자체", address: "제주특별자치도 서귀포시 중앙로 105", phone: "064-120", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 2030, name: "남원읍 주민센터", region: "제주특별자치도", detail_region: "제주 서귀포시", category: "주민자치기관", address: "제주특별자치도 서귀포시 남원읍 태위로 695", phone: "064-760-4112", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 2031, name: "대정읍 주민센터", region: "제주특별자치도", detail_region: "제주 서귀포시", category: "주민자치기관", address: "제주특별자치도 서귀포시 대정읍 하모중앙로 20", phone: "064-760-4012", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 2047, name: "제주평생교육진흥원", region: "제주특별자치도", detail_region: "제주 제주시", category: "국가 및 지자체", address: "제주특별자치도 제주시 연삼로 473", phone: "064-744-9852", tags: ["공공", "국가 및 지자체"], status: "운영중" },
];

const gangwonInstitutions: InstitutionSummary[] = [
  { id: 4002, name: "춘천시청", region: "강원특별자치도", detail_region: "강원 춘천시", category: "국가 및 지자체", address: "강원도 춘천시 삭주로 3", phone: "033-253-3700", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4003, name: "신북읍 주민센터", region: "강원특별자치도", detail_region: "강원 춘천시", category: "주민자치기관", address: "강원도 춘천시 신북읍 율문길 75", phone: "033-250-3601", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 4004, name: "동면 주민센터", region: "강원특별자치도", detail_region: "강원 춘천시", category: "주민자치기관", address: "강원도 춘천시 동면 가산로 69", phone: "033-250-3602", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 4028, name: "원주시청", region: "강원특별자치도", detail_region: "강원 원주시", category: "국가 및 지자체", address: "강원도 원주시 시청로 1", phone: "033-742-2111", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4029, name: "문막읍 주민센터", region: "강원특별자치도", detail_region: "강원 원주시", category: "주민자치기관", address: "강원도 원주시 문막읍 건등로 11", phone: "033-737-5501", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 4054, name: "강릉시청", region: "강원특별자치도", detail_region: "강원 강릉시", category: "국가 및 지자체", address: "강원도 강릉시 강릉대로 33", phone: "033-660-2018", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4055, name: "주문진읍 주민센터", region: "강원특별자치도", detail_region: "강원 강릉시", category: "주민자치기관", address: "강원도 강릉시 주문진읍 항구로 19", phone: "033-660-3414", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 4077, name: "동해시청", region: "강원특별자치도", detail_region: "강원 동해시", category: "국가 및 지자체", address: "강원도 동해시 천곡로 77", phone: "033-530-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4088, name: "태백시청", region: "강원특별자치도", detail_region: "강원 태백시", category: "국가 및 지자체", address: "강원도 태백시 태붐로 21", phone: "033-552-1360", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4097, name: "속초시청", region: "강원특별자치도", detail_region: "강원 속초시", category: "국가 및 지자체", address: "강원도 속초시 중앙로 183", phone: "033-639-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4106, name: "삼척시청", region: "강원특별자치도", detail_region: "강원 삼척시", category: "국가 및 지자체", address: "강원도 삼척시 중앙로 296", phone: "033-570-3114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 4119, name: "홍천군청", region: "강원특별자치도", detail_region: "강원 홍천군", category: "국가 및 지자체", address: "강원도 홍천군 홍천읍 석화로 93", phone: "033-430-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
];

const gyeonggiInstitutions: InstitutionSummary[] = [
  { id: 6002, name: "수원시청", region: "경기도", detail_region: "경기 수원시", category: "국가 및 지자체", address: "경기도 수원시 팔달구 효원로 241", phone: "1899-3300", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6003, name: "장안구청", region: "경기도", detail_region: "경기 수원시", category: "국가 및 지자체", address: "경기도 수원시 장안구 송원로 101", phone: "1899-3300", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6014, name: "권선구청", region: "경기도", detail_region: "경기 수원시", category: "국가 및 지자체", address: "경기도 수원시 권선구 호매실로 12", phone: "1899-3300", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6027, name: "팔달구청", region: "경기도", detail_region: "경기 수원시", category: "국가 및 지자체", address: "경기도 수원시 팔달구 창룡대로 23", phone: "1899-3300", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6038, name: "영통구청", region: "경기도", detail_region: "경기 수원시", category: "국가 및 지자체", address: "경기도 수원시 영통구 효원로 407", phone: "1899-3300", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6049, name: "고양시청", region: "경기도", detail_region: "경기 고양시", category: "국가 및 지자체", address: "경기도 고양시 덕양구 고양시청로 10", phone: "031-909-9000", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6098, name: "성남시청", region: "경기도", detail_region: "경기 성남시", category: "국가 및 지자체", address: "경기도 성남시 중원구 성남대로 997", phone: "031-729-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6150, name: "용인시청", region: "경기도", detail_region: "경기 용인시", category: "국가 및 지자체", address: "경기도 용인시 처인구 중부대로 1199", phone: "031-324-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6200, name: "부천시청", region: "경기도", detail_region: "경기 부천시", category: "국가 및 지자체", address: "경기도 부천시 길주로 210", phone: "032-320-3000", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6250, name: "안산시청", region: "경기도", detail_region: "경기 안산시", category: "국가 및 지자체", address: "경기도 안산시 단원구 화랑로 387", phone: "031-481-2000", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6300, name: "안양시청", region: "경기도", detail_region: "경기 안양시", category: "국가 및 지자체", address: "경기도 안양시 동안구 시민대로 235", phone: "031-8045-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 6350, name: "남양주시청", region: "경기도", detail_region: "경기 남양주시", category: "국가 및 지자체", address: "경기도 남양주시 경춘로 1037", phone: "031-590-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
];

const gyeongnamInstitutions: InstitutionSummary[] = [
  { id: 8002, name: "창원시청", region: "경상남도", detail_region: "경남 창원시", category: "국가 및 지자체", address: "경상남도 창원시 의창구 중앙대로 151", phone: "1899-1111", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8003, name: "의창구청", region: "경상남도", detail_region: "경남 창원시", category: "국가 및 지자체", address: "경상남도 창원시 의창구 태복산로15번길 8", phone: "055-212-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8012, name: "성산구청", region: "경상남도", detail_region: "경남 창원시", category: "국가 및 지자체", address: "경상남도 창원시 성산구 창원대로 1086", phone: "055-272-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8020, name: "마산회원구청", region: "경상남도", detail_region: "경남 창원시", category: "국가 및 지자체", address: "경상남도 창원시 마산회원구 삼호로 63", phone: "055-230-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8033, name: "마산합포구청", region: "경상남도", detail_region: "경남 창원시", category: "국가 및 지자체", address: "경상남도 창원시 마산합포구 3·15대로 210", phone: "055-220-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8050, name: "진해구청", region: "경상남도", detail_region: "경남 창원시", category: "국가 및 지자체", address: "경상남도 창원시 진해구 진해대로 1101", phone: "055-548-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8067, name: "진주시청", region: "경상남도", detail_region: "경남 진주시", category: "국가 및 지자체", address: "경상남도 진주시 동진로 155", phone: "055-749-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 8099, name: "통영시청", region: "경상남도", detail_region: "경남 통영시", category: "국가 및 지자체", address: "경상남도 통영시 통영해안로 515", phone: "1577-0557", tags: ["공공", "국가 및 지자체"], status: "운영중" },
];

const gyeongbukInstitutions: InstitutionSummary[] = [
  { id: 10002, name: "경상북도청", region: "경상북도", detail_region: "경상북도 안동시", category: "국가 및 지자체", address: "경상북도 안동시 풍천면 도청대로 455", phone: "054-880-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 10003, name: "포항시청", region: "경상북도", detail_region: "경상북도 포항시", category: "국가 및 지자체", address: "경상북도 포항시 남구 시청로 1", phone: "054-270-8282", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 10004, name: "북구청", region: "경상북도", detail_region: "경상북도 포항시", category: "국가 및 지자체", address: "경상북도 포항시 북구 중앙로 325", phone: "054-270-8282", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 10005, name: "흥해읍 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 흥해읍 동해대로 1511", phone: "054-240-7560", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10006, name: "신광면 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 신광면 토성길37번길 13", phone: "054-240-7590", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10007, name: "청하면 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 청하면 청하로217번길 22", phone: "054-240-7610", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10008, name: "송라면 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 송라면 보경로 56", phone: "054-240-7641", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10009, name: "기계면 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 기계면 근면길 14", phone: "054-240-7651", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10010, name: "죽장면 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 죽장면 새마을로 3610", phone: "054-240-7670", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10011, name: "기북면 주민센터", region: "경상북도", detail_region: "경상북도 포항시", category: "주민자치기관", address: "경상북도 포항시 북구 기북면 기북로 443", phone: "054-240-7691", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10020, name: "남구청", region: "경상북도", detail_region: "경상북도 포항시", category: "국가 및 지자체", address: "경상북도 포항시 남구 희망대로 790", phone: "054-270-6222", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 10021, name: "구룡포읍 주민센터", region: "경상북도", detail_region: "포항시 남구", category: "주민자치기관", address: "포항시 남구 구룡포읍 호미로 133", phone: "054-270-6561", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10034, name: "경주시청", region: "경상북도", detail_region: "경상북도 경주시", category: "국가 및 지자체", address: "경상북도 경주시 양정로 260", phone: "054-779-8585", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 10035, name: "감포읍 주민센터", region: "경상북도", detail_region: "경상북도 경주시", category: "주민자치기관", address: "경상북도 경주시 감포읍 감포로8길 14-8", phone: "054-779-8003", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 10036, name: "안강읍 주민센터", region: "경상북도", detail_region: "경상북도 경주시", category: "주민자치기관", address: "경상북도 경주시 안강읍 비화원로 47", phone: "054-779-8032", tags: ["공공", "주민자치기관"], status: "운영중" },
];

const gwangjuInstitutions: InstitutionSummary[] = [
  { id: 12002, name: "광주시청", region: "광주광역시", detail_region: "광주광역시 서구", category: "국가 및 지자체", address: "광주광역시 서구 내방로 111", phone: "062-120", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 12003, name: "동구청", region: "광주광역시", detail_region: "광주광역시 동구", category: "국가 및 지자체", address: "광주광역시 동구 서남로 1", phone: "062-608-2114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 12004, name: "충장동 주민센터", region: "광주광역시", detail_region: "광주광역시 동구", category: "주민자치기관", address: "광주광역시 동구 충장로58번길 16", phone: "062-608-3500", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 12005, name: "동명동 주민센터", region: "광주광역시", detail_region: "광주광역시 동구", category: "주민자치기관", address: "광주광역시 동구 동명로26번길 13", phone: "062-608-3530", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 12017, name: "서구청", region: "광주광역시", detail_region: "광주광역시 서구", category: "국가 및 지자체", address: "광주광역시 서구 경열로 33", phone: "062-365-4114", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 12018, name: "양동 주민센터", region: "광주광역시", detail_region: "광주광역시 서구", category: "주민자치기관", address: "광주광역시 서구 천변좌로222번길 3-2", phone: "062-350-4203", tags: ["공공", "주민자치기관"], status: "운영중" },
  { id: 12036, name: "남구청", region: "광주광역시", detail_region: "광주광역시 남구", category: "국가 및 지자체", address: "광주광역시 남구 봉선로 1", phone: "062-651-9020", tags: ["공공", "국가 및 지자체"], status: "운영중" },
  { id: 12037, name: "양림동 주민센터", region: "광주광역시", detail_region: "광주광역시 남구", category: "주민자치기관", address: "광주광역시 남구 백서로 94", phone: "062-607-4502", tags: ["공공", "주민자치기관"], status: "운영중" },
];

const rawInstitutions: InstitutionSummary[] = [
  ...(seoulInstitutions as InstitutionSummary[]),
  ...(daejeonInstitutions as InstitutionSummary[]),
  ...(busanInstitutions as InstitutionSummary[]),
  ...(daeguInstitutions as InstitutionSummary[]),
  ...(incheonInstitutions as InstitutionSummary[]),
  ...jejuInstitutions,
  ...gangwonInstitutions,
  ...gyeonggiInstitutions,
  ...gyeongnamInstitutions,
  ...gyeongbukInstitutions,
  ...gwangjuInstitutions,
];

const duplicateIdCounts = rawInstitutions.reduce<Record<string, number>>((acc, institution) => {
  const id = String(institution.id);
  acc[id] = (acc[id] ?? 0) + 1;
  return acc;
}, {});

export const allInstitutions: InstitutionSummary[] = rawInstitutions.map((institution) => {
  const normalized = normalizeInstitution(institution);
  const isDuplicateId = (duplicateIdCounts[String(institution.id)] ?? 0) > 1;
  const normalizedId =
    isDuplicateId && normalized.regionId ? `${normalized.regionId}-${institution.id}` : institution.id;

  return {
    ...normalized,
    id: normalizedId,
    sourceQuality: normalized.sourceQuality,
  };
});
