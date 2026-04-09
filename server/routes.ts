import type { Express } from "express";
import type { Server } from "http";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

type CrawlRegionConfig = {
  id: string;
  name: string;
  mode: "crawler" | "legacy";
  masterFile: string;
  extraMasterFiles?: string[];
  reviewFile?: string;
  candidatesFile?: string;
};

type DaedeokOfficialRow = {
  values: string[];
  homepage: string | null;
};

type ReviewStatus = "pending" | "approved" | "rejected";

type ReviewOverride = {
  regionId: string;
  itemKey: string;
  status: ReviewStatus;
  note: string;
  updatedAt: string;
};

type InstitutionOverride = {
  regionId: string;
  institutionId: string;
  canonical_name?: string;
  display_name?: string;
  institution_type?: string;
  operator_name?: string | null;
  homepage_url?: string | null;
  phone?: string | null;
  road_address?: string | null;
  sido?: string | null;
  sigungu?: string | null;
  eupmyeondong?: string | null;
  operation_status?: string;
  note?: string;
  updatedAt: string;
};

type RegisteredInstitutionRecord = {
  regionId: string;
  institutionId: string;
  registeredAt: string;
};

type InstitutionSummary = {
  id: number | string;
  name: string;
  region: string;
  detail_region: string;
  category: string;
  address: string;
  phone: string;
  tags?: string[];
  status?: string;
  homepage?: string;
  image?: string;
  sourceQuality?: "verified" | "needs_review";
};

const CRAWL_REGIONS: CrawlRegionConfig[] = [
  {
    id: "daejeon",
    name: "대전",
    mode: "crawler",
    masterFile: "script/daejeon_crawler/output/parsed/institutions_master_curated.json",
    extraMasterFiles: [
      "script/daejeon_crawler/output/parsed/institutions_master_curated_b.json",
      "script/daejeon_crawler/output/parsed/institutions_daejeon_office_public_notice.json",
      "script/daejeon_crawler/output/parsed/institutions_daedeok_official.json",
      "script/daejeon_crawler/output/parsed/institutions_donggu_portal.json",
      "script/daejeon_crawler/output/parsed/institutions_junggu_portal.json",
      "script/daejeon_crawler/output/parsed/institutions_seogu_portal.json",
      "script/daejeon_crawler/output/parsed/institutions_yuseong_portal.json",
      "script/daejeon_crawler/output/parsed/institutions_daedeok_portal.json",
    ],
    reviewFile: "script/daejeon_crawler/output/parsed/review_queue_curated.json",
    candidatesFile: "script/daejeon_crawler/output/parsed/crawl_candidates_curated.json",
  },
  {
    id: "seoul",
    name: "서울",
    mode: "legacy",
    masterFile: "client/src/pages/institutions/seoul_data.json",
  },
  {
    id: "busan",
    name: "부산",
    mode: "legacy",
    masterFile: "client/src/pages/institutions/busan_data.json",
  },
  {
    id: "daegu",
    name: "대구",
    mode: "legacy",
    masterFile: "client/src/pages/institutions/daegu_data.json",
  },
  {
    id: "incheon",
    name: "인천",
    mode: "legacy",
    masterFile: "client/src/pages/institutions/incheon_data.json",
  },
];

const REVIEW_OVERRIDE_PATH = path.resolve(
  process.cwd(),
  "script/daejeon_crawler/output/parsed/review_overrides.json",
);
const INSTITUTION_OVERRIDE_PATH = path.resolve(
  process.cwd(),
  "script/daejeon_crawler/output/parsed/institution_overrides.json",
);
const REGISTERED_RECORDS_PATH = path.resolve(
  process.cwd(),
  "script/daejeon_crawler/output/parsed/registered_institutions.json",
);
const DAEJEON_REGISTERED_EXPORT_PATH = path.resolve(
  process.cwd(),
  "client/src/pages/institutions/daejeon_registered_data.json",
);
const DAEJEON_EXISTING_PATH = path.resolve(
  process.cwd(),
  "client/src/pages/institutions/daejeon_data.json",
);
const DAEDEOK_OFFICIAL_STATUS_PATH = path.resolve(
  process.cwd(),
  "script/daejeon_crawler/output/parsed/institutions_daedeok_official.json",
);
const DAEDEOK_OFFICIAL_STATUS_URL =
  "https://lll.daedeok.go.kr/lms/damoa/contents/dms/content/content.motion?mnucd=MENU0100081";
const execFileAsync = promisify(execFile);
const DISTRICT_IMPORTS: Record<
  string,
  { label: string; sourceId: string; outputFile: string }
> = {
  donggu: {
    label: "동구 포털",
    sourceId: "dj_donggu_lifelong_home",
    outputFile: "script/daejeon_crawler/output/parsed/institutions_donggu_portal.json",
  },
  junggu: {
    label: "중구 포털",
    sourceId: "dj_junggu_lifelong_home",
    outputFile: "script/daejeon_crawler/output/parsed/institutions_junggu_portal.json",
  },
  seogu: {
    label: "서구 포털",
    sourceId: "dj_seogu_lifelong_home",
    outputFile: "script/daejeon_crawler/output/parsed/institutions_seogu_portal.json",
  },
  yuseong: {
    label: "유성구 포털",
    sourceId: "dj_yuseong_lifelong_home",
    outputFile: "script/daejeon_crawler/output/parsed/institutions_yuseong_portal.json",
  },
  daedeok: {
    label: "대덕구 포털",
    sourceId: "dj_daedeok_lifelong_home",
    outputFile: "script/daejeon_crawler/output/parsed/institutions_daedeok_portal.json",
  },
};

const DAEJEON_ALIAS_MAP: Record<string, string[]> = {
  "동구청": ["대전광역시 동구 평생학습관"],
  "중구청": ["대전광역시 중구 평생학습관", "대전광역시중구 평생학습관평생,사회교육원"],
  "서구평생학습원": ["대전광역시 서구 평생학습관"],
  "유성구평생학습원": ["유성구 평생학습센터"],
  "대덕구평생학습원": ["대덕구 평생학습센터"],
  "국립한밭대학교 평생교육원": ["한밭대학교 평생교육원"],
  "대전대학교 부설 평생교육원": ["대전대학교 평생교육원"],
  "우송정보대학 평생교육원": ["우송대학교 평생교육원"],
  "대전과학기술대학교 평생교육원": [
    "대전과학기술대학교 평생교육원평생,사회교육원",
  ],
  "목원대학교 미래창의평생교육원": [
    "목원대학교 미래창의평생교육원평생,사회교육원",
    "목원대학교 평생교육원",
  ],
  "대덕대학교 평생교육원": ["대덕대학교 평생교육원평생,사회교육원"],
  "한남대학교 평생교육원": ["한남대학교평생교육원평생,사회교육원", "한남대학교 평생교육원"],
  "충남대학교 평생교육원": ["충남대학교 평생교육원", "충남대학교평생교육원교육원,교육센터"],
  "건양사이버대학교 평생교육원": ["건양사이버대학교 평생교육원", "건양사이버대학교"],
  "여성가족원 동부": ["동부여성가족원공연장"],
  "여성가족원 남부": ["대전남부여성가족원"],
  "여성가족원 본원": ["대전광역시 여성가족원", "대전광역시여성가족원문화센터"],
};

const DAEJEON_DISTRICT_HOMEPAGE_MAP: Record<string, string> = {
  광역: "https://www.dllc.or.kr",
  동구: "https://www.donggu.go.kr/lll/www/index.do",
  중구: "https://www.djjunggu.go.kr/lll/index.do",
  서구: "https://www.seogu.go.kr/library/contents/study/main.jsp",
  유성구: "https://lifelong.yuseong.go.kr",
  대덕구: "https://lll.daedeok.go.kr",
};

function resolveRegion(regionId: string) {
  return CRAWL_REGIONS.find((region) => region.id === regionId);
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJsonFile<T = any>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function writeJsonFile(filePath: string, value: unknown) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

function loadReviewOverrides() {
  return readJsonFile<ReviewOverride[]>(REVIEW_OVERRIDE_PATH, []);
}

function saveReviewOverrides(items: ReviewOverride[]) {
  writeJsonFile(REVIEW_OVERRIDE_PATH, items);
}

function loadInstitutionOverrides() {
  return readJsonFile<InstitutionOverride[]>(INSTITUTION_OVERRIDE_PATH, []);
}

function saveInstitutionOverrides(items: InstitutionOverride[]) {
  writeJsonFile(INSTITUTION_OVERRIDE_PATH, items);
}

function loadRegisteredRecords() {
  return readJsonFile<RegisteredInstitutionRecord[]>(REGISTERED_RECORDS_PATH, []);
}

function saveRegisteredRecords(items: RegisteredInstitutionRecord[]) {
  writeJsonFile(REGISTERED_RECORDS_PATH, items);
}

function loadRegisteredExport() {
  return readJsonFile<InstitutionSummary[]>(DAEJEON_REGISTERED_EXPORT_PATH, []);
}

function saveRegisteredExport(items: InstitutionSummary[]) {
  writeJsonFile(DAEJEON_REGISTERED_EXPORT_PATH, items);
}

function normalizeText(value: string | null | undefined) {
  return (value || "").toLowerCase().replace(/[\s()\-_.]/g, "");
}

function normalizeDisplayAddress(value: string | null | undefined) {
  return (value || "")
    .replace(/^대전광역시\s*/, "대전 ")
    .replace(/^대전시\s*/, "대전 ")
    .replace(/^대전\s+/, "대전 ")
    .trim();
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSourceIds(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
}

function sourceLabelFromIds(sourceIds: string[]) {
  if (sourceIds.some((item) => item.includes("dj_donggu_lifelong_home"))) {
    return "동구 포털";
  }
  if (sourceIds.some((item) => item.includes("dj_junggu_lifelong_home"))) {
    return "중구 포털";
  }
  if (sourceIds.some((item) => item.includes("dj_seogu_lifelong_home"))) {
    return "서구 포털";
  }
  if (sourceIds.some((item) => item.includes("dj_yuseong_lifelong_home"))) {
    return "유성구 포털";
  }
  if (sourceIds.some((item) => item.includes("dj_daedeok_lifelong_home"))) {
    return "대덕구 포털";
  }
  if (sourceIds.some((item) => item.includes("daedeok_official_status"))) {
    return "대덕구 공식 현황";
  }
  if (sourceIds.some((item) => item.includes("daejeon_office_public_notice"))) {
    return "대전광역시교육청 정보공시";
  }
  if (sourceIds.some((item) => item.includes("dj_nurim_recognized_2025"))) {
    return "대전 인정기관";
  }
  if (sourceIds.some((item) => item.includes("legacy_"))) {
    return "기존 서비스 데이터";
  }
  return sourceIds[0] || "기타";
}

function compactText(value: string | null | undefined) {
  return normalizeText(value)
    .replace(/대전광역시/g, "")
    .replace(/국립/g, "")
    .replace(/부설/g, "")
    .replace(/미래창의/g, "")
    .replace(/평생,사회교육원/g, "")
    .replace(/교육원,교육센터/g, "")
    .replace(/평생교육원/g, "")
    .replace(/평생학습관/g, "")
    .replace(/평생학습원/g, "")
    .replace(/평생학습센터/g, "")
    .replace(/대학교/g, "")
    .replace(/대학/g, "");
}

function buildDongVariants(value: string | null | undefined) {
  const source = (value || "").trim();
  if (!source) return [];

  const variants = new Set<string>([
    source,
    source.replace(/\s+/g, ""),
    source.replace(/평생학습센터/g, "").trim(),
  ]);

  if (/\d동$/.test(source)) {
    variants.add(source.replace(/\d동$/, "동"));
    variants.add(source.replace(/\d동$/, "").trim());
  }

  return Array.from(variants)
    .map((item) => item.trim())
    .filter(Boolean);
}

function collectIndexItems(index: Map<string, InstitutionSummary[]>) {
  const unique = new Map<string, InstitutionSummary>();
  for (const matches of Array.from(index.values())) {
    for (const item of matches) {
      const key = [
        item.name || "",
        item.address || "",
        item.phone || "",
        item.homepage || "",
      ].join("::");
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    }
  }
  return Array.from(unique.values());
}

function inferCategoryFromType(type: string) {
  if (type.includes("university")) return "대학부설";
  if (type.includes("employment")) return "특화";
  if (type.includes("women")) return "공공";
  if (type.includes("dong")) return "공공";
  if (type.includes("district")) return "공공";
  if (type.includes("metro")) return "공공";
  return "공공";
}

function inferTagsFromType(type: string) {
  if (type.includes("university")) return ["대학부설", "평생교육원"];
  if (type.includes("employment")) return ["특화", "일자리", "직업역량"];
  if (type.includes("women")) return ["공공", "여성가족", "평생학습"];
  if (type.includes("dong")) return ["공공", "동 평생학습센터"];
  if (type.includes("district")) return ["공공", "평생학습관"];
  if (type.includes("metro")) return ["공공", "광역기관"];
  return ["공공"];
}

function inferInstitutionTypeFromSection(title: string, name: string) {
  if (title.includes("주민자치센터")) return "community_center";
  if (title.includes("도서관")) return "public_library";
  if (title.includes("초등학교") || title.includes("중학교") || title.includes("고등학교")) {
    return "public_school";
  }
  if (title.includes("학교부설 평생교육시설")) return "university_extension";
  if (title.includes("원격대학형태평생교육시설")) return "remote_lifelong";
  if (title.includes("시민사회단체 부설 평생교육시설")) return "civic_lifelong";
  if (title.includes("언론기관부설 평생교육시설")) return "media_lifelong";
  if (title.includes("박물관") || title.includes("미술관")) return "museum";
  if (title.includes("사회복지관")) return "welfare_center";
  if (title.includes("장애인복지시설")) return "disability_welfare";
  if (title.includes("장애인직업고용시설")) return "disability_employment";
  if (title.includes("문화예술관련시설")) return "arts_culture";
  if (title.includes("기타시설")) return "other_facility";
  if (title.includes("전담기관")) {
    if (name.includes("교육지원청")) return "education_office";
    if (name.includes("여성가족원")) return "women_family_center";
    if (name.includes("평생학습원")) return "district_lifelong_center";
    return "public_office";
  }
  return "other_public_partner";
}

function buildDetailRegion(item: any) {
  const parts = [item.sido, item.sigungu, item.eupmyeondong].filter(Boolean);
  return parts.join(" ");
}

function deriveDaejeonHomepage(item: any) {
  if (item.canonical_name?.includes("여성가족원")) {
    return "https://daejeon.go.kr/lif/index.do";
  }
  if (item.canonical_name === "대전중장년지원센터") {
    return "https://www.daejeonsenior.or.kr";
  }
  if (item.canonical_name === "대전광역여성새로일하기센터") {
    return "https://saeil.mogef.go.kr";
  }
  if (item.canonical_name === "대전배재대 ICT융합여성새로일하기센터") {
    return "https://ictsaeil.kr";
  }
  return DAEJEON_DISTRICT_HOMEPAGE_MAP[item.sigungu || ""] || null;
}

function normalizeLegacyInstitution(regionId: string, item: any) {
  const detailRegion = item.detail_region || "";
  const sigungu = detailRegion.split(" ").at(-1) || detailRegion || "미분류";
  return {
    institution_id: `${regionId}-${item.id}`,
    canonical_name: item.name,
    display_name: item.name,
    institution_type: item.category || "legacy_catalog",
    operator_name: item.category || null,
    homepage_url: item.homepage || null,
    phone: item.phone || null,
    road_address: normalizeDisplayAddress(item.address || null),
    sido: item.region === "대전광역시" || item.region === "대전시" ? "대전" : item.region || null,
    sigungu,
    eupmyeondong: null,
    operation_status: item.status || "확인필요",
    confidence_score: item.phone && item.address ? 0.9 : 0.7,
    source_count: 1,
    source_ids: [`legacy_${regionId}`],
    last_crawled_at: "",
    last_verified_at: null,
  };
}

function buildStats(institutions: any[], reviewItems: any[]) {
  return {
    totalInstitutions: institutions.length,
    totalReviewItems: reviewItems.length,
    withPhone: institutions.filter((item: any) => item.phone).length,
    withAddress: institutions.filter((item: any) => item.road_address).length,
    byType: institutions.reduce((acc: Record<string, number>, item: any) => {
      const key = item.institution_type || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    bySigungu: institutions.reduce((acc: Record<string, number>, item: any) => {
      const key = item.sigungu || "미분류";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    bySource: institutions.reduce((acc: Record<string, number>, item: any) => {
      const key = sourceLabelFromIds(parseSourceIds(item.source_ids));
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    registeredCount: institutions.filter((item: any) => item.isRegistered).length,
  };
}

function getDaejeonPrimaryInstitutionNames() {
  const files = [
    path.resolve(process.cwd(), "script/daejeon_crawler/output/parsed/institutions_master_curated.json"),
    path.resolve(process.cwd(), "script/daejeon_crawler/output/parsed/institutions_master_curated_b.json"),
  ];
  const names = new Set<string>();
  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;
    const rows = readJsonFile<any[]>(filePath, []);
    for (const row of rows) {
      names.add(normalizeText(row.canonical_name || row.display_name || ""));
    }
  }
  return names;
}

function parseDaedeokOfficialRows(html: string) {
  const sections = Array.from(
    html.matchAll(/<h5[^>]*>([\s\S]*?)<\/h5>[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/gi),
  );
  const parsed: { title: string; rows: DaedeokOfficialRow[] }[] = [];
  for (const section of sections) {
    const title = stripHtml(section[1] || "");
    const tableHtml = section[2] || "";
    const rows: DaedeokOfficialRow[] = [];
    const trMatches = Array.from(tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi));
    for (const tr of trMatches.slice(1)) {
      const trHtml = tr[1] || "";
      const values = Array.from(trHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((td) =>
        stripHtml(td[1] || ""),
      );
      if (values.length < 3) continue;
      const hrefMatch = trHtml.match(/<a[^>]+href=["']([^"']+)["']/i);
      rows.push({
        values,
        homepage: hrefMatch?.[1] || null,
      });
    }
    if (rows.length) {
      parsed.push({ title, rows });
    }
  }
  return parsed;
}

function buildDaedeokOfficialInstitutionsFromHtml(html: string) {
  const existingNames = getDaejeonPrimaryInstitutionNames();
  const sections = parseDaedeokOfficialRows(html);
  const institutions: any[] = [];
  let sequence = 1;

  for (const section of sections) {
    for (const row of section.rows) {
      const [rawName, rawAddress, rawPhone] = row.values;
      const canonicalName = rawName.replace(/\s+/g, " ").trim();
      if (!canonicalName || existingNames.has(normalizeText(canonicalName))) {
        continue;
      }
      const roadAddress = normalizeDisplayAddress(rawAddress);
      const sigunguMatch = roadAddress.match(/^대전\s+(\S{2,3})/);
      institutions.push({
        institution_id: `dj-daedeok-${String(sequence).padStart(4, "0")}`,
        canonical_name: canonicalName,
        display_name: canonicalName,
        institution_type: inferInstitutionTypeFromSection(section.title, canonicalName),
        operator_name: section.title,
        homepage_url: row.homepage,
        phone: rawPhone || null,
        road_address: roadAddress,
        sido: "대전",
        sigungu: sigunguMatch?.[1] || null,
        eupmyeondong: null,
        operation_status: "운영중",
        confidence_score: row.homepage ? 0.95 : 0.88,
        source_count: 1,
        source_ids: ["daedeok_official_status_20260408"],
        last_crawled_at: "2026-04-08",
        last_verified_at: "2026-04-08",
      });
      sequence += 1;
    }
  }

  return institutions;
}

function buildExistingDaejeonIndex() {
  const items = readJsonFile<InstitutionSummary[]>(DAEJEON_EXISTING_PATH, []);
  const index = new Map<string, InstitutionSummary[]>();
  for (const item of items) {
    const keys = new Set([normalizeText(item.name), compactText(item.name)]);
    for (const key of Array.from(keys)) {
      const current = index.get(key) || [];
      current.push(item);
      index.set(key, current);
    }
  }
  return index;
}

function matchExistingDaejeonInstitution(
  item: any,
  index: Map<string, InstitutionSummary[]>,
) {
  const keys = new Set<string>([
    normalizeText(item.canonical_name),
    compactText(item.canonical_name),
    normalizeText(item.display_name),
    compactText(item.display_name),
  ]);
  for (const alias of DAEJEON_ALIAS_MAP[item.canonical_name] || []) {
    keys.add(normalizeText(alias));
    keys.add(compactText(alias));
  }
  if (item.eupmyeondong) {
    keys.add(compactText(`${item.eupmyeondong} 평생학습센터`));
  }

  for (const key of Array.from(keys)) {
    const matches = index.get(key);
    if (matches?.length) {
      return matches[0];
    }
  }

  if (item.eupmyeondong) {
    const dongVariants = buildDongVariants(item.eupmyeondong);
    for (const candidate of collectIndexItems(index)) {
      if (!candidate.name?.includes("평생")) continue;
      const haystacks = [candidate.name, candidate.address, candidate.detail_region]
        .filter(Boolean)
        .map((value) => normalizeText(value));
      const sameDistrict =
        !item.sigungu ||
        haystacks.some((value) => value.includes(normalizeText(item.sigungu)));
      const sameDong = dongVariants.some((variant) =>
        haystacks.some((value) => value.includes(normalizeText(variant))),
      );
      if (sameDistrict && sameDong) {
        return candidate;
      }
    }
  }

  return null;
}

function buildGeneratedReviewItems(institutions: any[]) {
  return institutions
    .filter((item) => !item.phone || !item.road_address || !item.homepage_url)
    .map((item) => ({
      itemKey: `institution::${item.institution_id}`,
      source_id: "curated_daejeon",
      institution_id: item.institution_id,
      name: item.canonical_name,
      sigungu: item.sigungu,
      confidence_score: item.confidence_score ?? 0.8,
      reasons: [
        !item.phone ? "missing_phone" : null,
        !item.road_address ? "missing_address" : null,
        !item.homepage_url ? "missing_homepage" : null,
      ]
        .filter(Boolean)
        .join(","),
      source_url: item.homepage_url || null,
      homepage_url: item.homepage_url || null,
      address: item.road_address || null,
      phone: item.phone || null,
    }));
}

function buildCrawlerPayload(region: CrawlRegionConfig) {
  const masterPath = path.resolve(process.cwd(), region.masterFile);
  const reviewPath = path.resolve(process.cwd(), region.reviewFile!);
  const candidatesPath = path.resolve(process.cwd(), region.candidatesFile!);

  if (!fs.existsSync(masterPath)) {
    return null;
  }

  const masterPaths = [
    masterPath,
    ...(region.extraMasterFiles || []).map((file) => path.resolve(process.cwd(), file)),
  ];
  const baseInstitutions = masterPaths.flatMap((filePath) =>
    fs.existsSync(filePath) ? readJsonFile<any[]>(filePath, []) : [],
  );
  const reviewItemsFromFile = fs.existsSync(reviewPath) ? readJsonFile<any[]>(reviewPath, []) : [];
  const candidates = fs.existsSync(candidatesPath) ? readJsonFile<any[]>(candidatesPath, []) : [];
  const reviewOverrides = loadReviewOverrides().filter((item) => item.regionId === region.id);
  const reviewMap = new Map(reviewOverrides.map((item) => [item.itemKey, item]));
  const institutionOverrides = loadInstitutionOverrides().filter((item) => item.regionId === region.id);
  const institutionOverrideMap = new Map(
    institutionOverrides.map((item) => [item.institutionId, item]),
  );
  const registeredMap = new Map(
    loadRegisteredRecords()
      .filter((item) => item.regionId === region.id)
      .map((item) => [item.institutionId, item]),
  );
  const existingDaejeonIndex = region.id === "daejeon" ? buildExistingDaejeonIndex() : new Map();

  const institutions = baseInstitutions.map((item) => {
    const existing =
      region.id === "daejeon"
        ? matchExistingDaejeonInstitution(item, existingDaejeonIndex)
        : null;
    const override = institutionOverrideMap.get(item.institution_id);
    const merged = {
      ...item,
      operator_name: item.operator_name ?? existing?.category ?? null,
      homepage_url:
        item.homepage_url ??
        existing?.homepage ??
        (region.id === "daejeon" ? deriveDaejeonHomepage(item) : null) ??
        null,
      phone: item.phone ?? existing?.phone ?? null,
      road_address: normalizeDisplayAddress(item.road_address ?? existing?.address ?? null),
      sido:
        item.sido === "대전광역시" || item.sido === "대전시"
          ? "대전"
          : item.sido ?? null,
      ...override,
    };
    return {
      ...merged,
      road_address: normalizeDisplayAddress(merged.road_address),
      sido:
        merged.sido === "대전광역시" || merged.sido === "대전시"
          ? "대전"
          : merged.sido,
      itemKey: `institution::${item.institution_id}`,
      reviewState: reviewMap.get(`institution::${item.institution_id}`) || null,
      isRegistered: registeredMap.has(item.institution_id),
      registeredAt: registeredMap.get(item.institution_id)?.registeredAt || null,
      matchedExisting: existing
        ? {
            name: existing.name,
            address: existing.address,
            phone: existing.phone,
            homepage: existing.homepage || null,
          }
        : null,
    };
  });

  const candidateIndex = new Map<string, any[]>();
  for (const candidate of candidates) {
    const key = `${candidate.source_id}::${candidate.canonical_name || candidate.raw_name}`;
    const existing = candidateIndex.get(key) || [];
    existing.push(candidate);
    candidateIndex.set(key, existing);
  }

  const sourceReviewItems = reviewItemsFromFile.map((item: any) => {
    const key = `${item.source_id}::${item.name}`;
    const matches = candidateIndex.get(key) || [];
    const bestCandidate = matches.sort(
      (a, b) => (b.confidence_score || 0) - (a.confidence_score || 0),
    )[0];
    return {
      ...item,
      itemKey: key,
      source_url: bestCandidate?.source_url || null,
      homepage_url: bestCandidate?.homepage_url || null,
      address: bestCandidate?.address || null,
      phone: bestCandidate?.phone || null,
      reviewState: reviewMap.get(key) || null,
    };
  });

  const generatedReviewItems =
    sourceReviewItems.length > 0 ? [] : buildGeneratedReviewItems(institutions).map((item) => ({
      ...item,
      reviewState: reviewMap.get(item.itemKey) || null,
    }));

  return {
    paths: {
      masterPath,
      reviewPath,
      candidatesPath,
    },
    institutions,
    reviewItems: sourceReviewItems.length > 0 ? sourceReviewItems : generatedReviewItems,
  };
}

function buildLegacyPayload(region: CrawlRegionConfig) {
  const masterPath = path.resolve(process.cwd(), region.masterFile);
  if (!fs.existsSync(masterPath)) {
    return null;
  }

  const sourceItems = readJsonFile<any[]>(masterPath, []);
  const institutions = sourceItems.map((item: any) => normalizeLegacyInstitution(region.id, item));
  const reviewItems = institutions
    .filter((item: any) => !item.phone || !item.road_address)
    .map((item: any) => ({
      itemKey: `legacy_${region.id}::${item.canonical_name}`,
      source_id: `legacy_${region.id}`,
      institution_id: item.institution_id,
      name: item.canonical_name,
      sigungu: item.sigungu,
      confidence_score: item.confidence_score,
      reasons: [
        !item.phone ? "missing_phone" : null,
        !item.road_address ? "missing_address" : null,
      ]
        .filter(Boolean)
        .join(","),
      source_url: item.homepage_url,
      homepage_url: item.homepage_url,
      address: item.road_address,
      phone: item.phone,
      reviewState: null,
    }));

  return {
    paths: {
      masterPath,
      reviewPath: null,
      candidatesPath: null,
    },
    institutions,
    reviewItems,
  };
}

function loadPayload(regionId: string) {
  const region = resolveRegion(regionId);
  if (!region) return null;
  return region.mode === "crawler" ? buildCrawlerPayload(region) : buildLegacyPayload(region);
}

function toRegisteredInstitutionSummary(item: any): InstitutionSummary {
  return {
    id: item.institution_id,
    name: item.display_name || item.canonical_name,
    region:
      item.sido === "대전광역시" || item.sido === "대전시"
        ? "대전"
        : item.sido || "대전",
    detail_region: buildDetailRegion(item),
    category: inferCategoryFromType(item.institution_type || ""),
    address: normalizeDisplayAddress(item.road_address || ""),
    phone: item.phone || "",
    tags: inferTagsFromType(item.institution_type || ""),
    status: item.operation_status || "운영중",
    homepage: item.homepage_url || undefined,
    sourceQuality: "verified",
  };
}

function registerInstitutionRecord(regionId: string, institution: any) {
  const summary = toRegisteredInstitutionSummary(institution);
  const registeredRecords = loadRegisteredRecords().filter(
    (item) => !(item.regionId === regionId && item.institutionId === institution.institution_id),
  );
  const nextRecord: RegisteredInstitutionRecord = {
    regionId,
    institutionId: institution.institution_id,
    registeredAt: new Date().toISOString(),
  };
  registeredRecords.push(nextRecord);
  saveRegisteredRecords(registeredRecords);

  if (regionId === "daejeon") {
    const registeredItems = loadRegisteredExport().filter(
      (item) => item.id !== institution.institution_id,
    );
    registeredItems.push(summary);
    registeredItems.sort((a, b) => String(a.name).localeCompare(String(b.name), "ko"));
    saveRegisteredExport(registeredItems);
  }

  return { record: nextRecord, summary };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/internal/crawl-preview", (req, res) => {
    const requestedRegion = typeof req.query.region === "string" ? req.query.region : "daejeon";
    const region = resolveRegion(requestedRegion);

    if (!region) {
      return res.status(404).json({
        message: "Unsupported crawl region",
        region: requestedRegion,
        availableRegions: CRAWL_REGIONS.map(({ id, name }) => ({ id, name })),
      });
    }

    const payload = loadPayload(region.id);
    if (!payload) {
      return res.status(404).json({
        message: "Crawl output not found",
        region: region.id,
      });
    }

    return res.json({
      generatedAt: new Date().toISOString(),
      region: { id: region.id, name: region.name },
      availableRegions: CRAWL_REGIONS.map(({ id, name }) => ({ id, name })),
      paths: payload.paths,
      stats: buildStats(payload.institutions, payload.reviewItems),
      institutions: payload.institutions,
      reviewItems: payload.reviewItems,
    });
  });

  app.post("/api/internal/import-daedeok-official", async (_req, res) => {
    try {
      const response = await fetch(DAEDEOK_OFFICIAL_STATUS_URL);
      if (!response.ok) {
        return res.status(502).json({ message: "Failed to fetch Daedeok official page" });
      }
      const html = await response.text();
      const institutions = buildDaedeokOfficialInstitutionsFromHtml(html);
      writeJsonFile(DAEDEOK_OFFICIAL_STATUS_PATH, institutions);
      return res.json({
        ok: true,
        sourceUrl: DAEDEOK_OFFICIAL_STATUS_URL,
        count: institutions.length,
        outputPath: DAEDEOK_OFFICIAL_STATUS_PATH,
      });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Unknown import error",
      });
    }
  });

  app.post("/api/internal/import-district-source", async (req, res) => {
    const districtId = String(req.body.districtId || "");
    const target = DISTRICT_IMPORTS[districtId];
    if (!target) {
      return res.status(400).json({ message: "Unsupported districtId" });
    }

    try {
      const { stdout, stderr } = await execFileAsync(
        "python",
        [
          "-m",
          "script.daejeon_crawler.cli",
          "source-export",
          "--source",
          target.sourceId,
          "--browser-fallback",
          "--output",
          path.basename(target.outputFile),
        ],
        { cwd: process.cwd() },
      );

      return res.json({
        ok: true,
        districtId,
        label: target.label,
        sourceId: target.sourceId,
        outputPath: path.resolve(process.cwd(), target.outputFile),
        stdout,
        stderr,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error?.stderr || error?.message || "District import failed",
      });
    }
  });

  app.post("/api/internal/crawl-review-state", (req, res) => {
    const regionId = String(req.body.regionId || "");
    const itemKey = String(req.body.itemKey || "");
    const status = String(req.body.status || "pending") as ReviewStatus;
    const note = String(req.body.note || "");

    if (!regionId || !itemKey) {
      return res.status(400).json({ message: "regionId and itemKey are required" });
    }
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const overrides = loadReviewOverrides().filter(
      (item) => !(item.regionId === regionId && item.itemKey === itemKey),
    );
    const reviewState: ReviewOverride = {
      regionId,
      itemKey,
      status,
      note,
      updatedAt: new Date().toISOString(),
    };
    overrides.push(reviewState);
    saveReviewOverrides(overrides);
    return res.json({ ok: true, reviewState });
  });

  app.post("/api/internal/crawl-review-state-bulk", (req, res) => {
    const regionId = String(req.body.regionId || "");
    const institutionIds = Array.isArray(req.body.institutionIds)
      ? req.body.institutionIds.map((item: unknown) => String(item))
      : [];
    const status = String(req.body.status || "pending") as ReviewStatus;
    const note = String(req.body.note || "");

    if (!regionId || institutionIds.length === 0) {
      return res.status(400).json({ message: "regionId and institutionIds are required" });
    }
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const payload = loadPayload(regionId);
    if (!payload) {
      return res.status(404).json({ message: "Crawl output not found" });
    }

    const targets = payload.institutions.filter((item: any) =>
      institutionIds.includes(item.institution_id),
    );
    const targetKeys = new Set(targets.map((item: any) => item.itemKey));
    const overrides = loadReviewOverrides().filter(
      (item) => !(item.regionId === regionId && targetKeys.has(item.itemKey)),
    );
    const updatedAt = new Date().toISOString();
    const reviewStates = targets.map((item: any) => ({
      regionId,
      itemKey: item.itemKey,
      status,
      note,
      updatedAt,
    }));
    overrides.push(...reviewStates);
    saveReviewOverrides(overrides);

    return res.json({
      ok: true,
      updatedCount: reviewStates.length,
      reviewStates,
    });
  });

  app.post("/api/internal/crawl-institution-update", (req, res) => {
    const regionId = String(req.body.regionId || "");
    const institutionId = String(req.body.institutionId || "");

    if (!regionId || !institutionId) {
      return res.status(400).json({ message: "regionId and institutionId are required" });
    }

    const payload = loadPayload(regionId);
    const existing = payload?.institutions.find((item: any) => item.institution_id === institutionId);
    if (!existing) {
      return res.status(404).json({ message: "Institution not found" });
    }

    const nextOverride: InstitutionOverride = {
      regionId,
      institutionId,
      canonical_name: req.body.canonical_name ?? existing.canonical_name,
      display_name: req.body.display_name ?? existing.display_name,
      institution_type: req.body.institution_type ?? existing.institution_type,
      operator_name: req.body.operator_name ?? existing.operator_name,
      homepage_url: req.body.homepage_url ?? existing.homepage_url,
      phone: req.body.phone ?? existing.phone,
      road_address: normalizeDisplayAddress(req.body.road_address ?? existing.road_address),
      sido:
        req.body.sido === "대전광역시" || req.body.sido === "대전시"
          ? "대전"
          : req.body.sido ?? existing.sido,
      sigungu: req.body.sigungu ?? existing.sigungu,
      eupmyeondong: req.body.eupmyeondong ?? existing.eupmyeondong,
      operation_status: req.body.operation_status ?? existing.operation_status,
      note: req.body.note ?? "",
      updatedAt: new Date().toISOString(),
    };

    const overrides = loadInstitutionOverrides().filter(
      (item) => !(item.regionId === regionId && item.institutionId === institutionId),
    );
    overrides.push(nextOverride);
    saveInstitutionOverrides(overrides);

    return res.json({ ok: true, institutionOverride: nextOverride });
  });

  app.post("/api/internal/crawl-register", (req, res) => {
    const regionId = String(req.body.regionId || "");
    const institutionId = String(req.body.institutionId || "");

    if (!regionId || !institutionId) {
      return res.status(400).json({ message: "regionId and institutionId are required" });
    }

    const payload = loadPayload(regionId);
    const institution = payload?.institutions.find((item: any) => item.institution_id === institutionId);
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    const reviewState = institution.reviewState;
    if (!reviewState || reviewState.status !== "approved") {
      return res.status(400).json({ message: "Approved review state is required before registration" });
    }

    const registered = registerInstitutionRecord(regionId, institution);
    return res.json({ ok: true, registered: registered.record, institution: registered.summary });
  });

  app.post("/api/internal/crawl-register-bulk", (req, res) => {
    const regionId = String(req.body.regionId || "");
    const requestedIds = Array.isArray(req.body.institutionIds)
      ? req.body.institutionIds.map((item: unknown) => String(item))
      : null;

    if (!regionId) {
      return res.status(400).json({ message: "regionId is required" });
    }

    const payload = loadPayload(regionId);
    if (!payload) {
      return res.status(404).json({ message: "Crawl output not found" });
    }

    const targets = payload.institutions.filter((item: any) => {
      if (item.isRegistered) return false;
      if (item.reviewState?.status !== "approved") return false;
      if (!requestedIds) return true;
      return requestedIds.includes(item.institution_id);
    });

    const registered = targets.map((institution: any) =>
      registerInstitutionRecord(regionId, institution),
    );

    return res.json({
      ok: true,
      requestedCount: requestedIds?.length || 0,
      registeredCount: registered.length,
      registered: registered.map((item) => item.record),
      institutions: registered.map((item) => item.summary),
    });
  });

  app.get("/api/internal/crawl-registered-export", (req, res) => {
    const regionId = typeof req.query.region === "string" ? req.query.region : "daejeon";
    if (regionId !== "daejeon") {
      return res.status(404).json({ message: "Registered export is only configured for daejeon" });
    }
    return res.json({
      regionId,
      count: loadRegisteredExport().length,
      items: loadRegisteredExport(),
    });
  });

  return httpServer;
}
