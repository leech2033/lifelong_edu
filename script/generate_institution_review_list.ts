import { mkdir, writeFile } from "fs/promises";
import { allInstitutions } from "../client/src/data/institutionsNationwide.ts";
import { institutionRegions } from "../client/src/data/institutionRegions.ts";

type ReviewIssue =
  | "name_encoding"
  | "region_encoding"
  | "detail_region_encoding"
  | "category_encoding"
  | "address_encoding"
  | "status_encoding"
  | "missing_region_id"
  | "duplicate_id";

interface ReviewItem {
  id: string;
  regionId: string;
  regionName: string;
  displayName: string;
  sourceType: string;
  detailRegion: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  status: string;
  issues: ReviewIssue[];
}

const regionMap = new Map(
  institutionRegions.map((region) => [
    region.id,
    {
      name: region.name,
      displayName: region.displayName ?? region.name,
      sourceType: region.sourceType,
    },
  ]),
);

const duplicateIdCounts = allInstitutions.reduce<Record<string, number>>((acc, institution) => {
  const id = String(institution.id);
  acc[id] = (acc[id] ?? 0) + 1;
  return acc;
}, {});

function hasBrokenText(value?: string) {
  return typeof value === "string" && value.includes("?");
}

function collectIssues(institution: (typeof allInstitutions)[number]): ReviewIssue[] {
  const issues: ReviewIssue[] = [];

  if (hasBrokenText(institution.name)) issues.push("name_encoding");
  if (hasBrokenText(institution.region)) issues.push("region_encoding");
  if (hasBrokenText(institution.detail_region)) issues.push("detail_region_encoding");
  if (hasBrokenText(institution.category)) issues.push("category_encoding");
  if (hasBrokenText(institution.address)) issues.push("address_encoding");
  if (hasBrokenText(institution.status)) issues.push("status_encoding");
  if (!institution.regionId) issues.push("missing_region_id");
  if ((duplicateIdCounts[String(institution.id)] ?? 0) > 1) issues.push("duplicate_id");

  return issues;
}

function toReviewItem(institution: (typeof allInstitutions)[number]): ReviewItem {
  const regionId = institution.regionId ?? "unknown";
  const regionMeta = regionMap.get(regionId);

  return {
    id: String(institution.id),
    regionId,
    regionName: regionMeta?.name ?? institution.region,
    displayName: regionMeta?.displayName ?? institution.region,
    sourceType: regionMeta?.sourceType ?? "unknown",
    detailRegion: institution.detail_region,
    name: institution.name,
    category: institution.category,
    address: institution.address,
    phone: institution.phone,
    status: institution.status ?? "",
    issues: collectIssues(institution),
  };
}

function buildMarkdown(items: ReviewItem[]) {
  const grouped = new Map<string, ReviewItem[]>();

  for (const item of items) {
    const bucket = grouped.get(item.regionId) ?? [];
    bucket.push(item);
    grouped.set(item.regionId, bucket);
  }

  const summaryLines = Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([regionId, regionItems]) => {
      const meta = regionMap.get(regionId);
      const label = meta?.displayName ?? regionId;
      return `| ${label} | ${regionItems.length} | ${meta?.sourceType ?? "unknown"} |`;
    });

  const sectionLines = Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .flatMap(([regionId, regionItems]) => {
      const meta = regionMap.get(regionId);
      const label = meta?.displayName ?? regionId;
      const lines = [
        `## ${label} (${regionItems.length})`,
        "",
        "| ID | 기관명 | 세부지역 | 주요 이슈 | 주소 |",
        "| --- | --- | --- | --- | --- |",
        ...regionItems.map(
          (item) =>
            `| ${item.id} | ${item.name.replace(/\|/g, "/")} | ${item.detailRegion.replace(/\|/g, "/")} | ${item.issues.join(", ")} | ${item.address.replace(/\|/g, "/")} |`,
        ),
        "",
      ];

      return lines;
    });

  return [
    "# 기관 데이터 검수 목록",
    "",
    `- 생성 시각: ${new Date().toISOString()}`,
    `- 검수 대상 수: ${items.length}`,
    `- 기준: sourceQuality = needs_review`,
    "",
    "## 지역별 집계",
    "",
    "| 지역 | 건수 | sourceType |",
    "| --- | ---: | --- |",
    ...summaryLines,
    "",
    ...sectionLines,
  ].join("\n");
}

async function main() {
  const items = allInstitutions
    .filter((institution) => institution.sourceQuality === "needs_review")
    .map(toReviewItem)
    .sort((a, b) => a.regionId.localeCompare(b.regionId) || a.id.localeCompare(b.id, "ko"));

  const summary = {
    generatedAt: new Date().toISOString(),
    total: items.length,
    regions: Array.from(
      items.reduce((acc, item) => {
        acc.set(item.regionId, (acc.get(item.regionId) ?? 0) + 1);
        return acc;
      }, new Map<string, number>()),
    ).map(([regionId, count]) => ({
      regionId,
      displayName: regionMap.get(regionId)?.displayName ?? regionId,
      sourceType: regionMap.get(regionId)?.sourceType ?? "unknown",
      count,
    })),
    items,
  };

  await mkdir("reports", { recursive: true });
  await mkdir("client/src/data/generated", { recursive: true });
  await writeFile("reports/institution-needs-review.json", `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile("reports/institution-needs-review.md", `${buildMarkdown(items)}\n`, "utf8");
  await writeFile(
    "client/src/data/generated/institutionNeedsReview.ts",
    `export const institutionNeedsReviewReport = ${JSON.stringify(summary, null, 2)} as const;\n`,
    "utf8",
  );

  console.log(`generated ${items.length} review items`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
