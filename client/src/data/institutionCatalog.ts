import { allInstitutions } from "@/data/institutionsNationwide";
import type { InstitutionDetailData, InstitutionSummary } from "@/types/institution";

const institutionImageMap: Record<string, string> = {};

export function getInstitutionById(id?: string) {
  return allInstitutions.find((institution) => String(institution.id) === id);
}

export function buildInstitutionDetail(institution?: InstitutionSummary): InstitutionDetailData | null {
  if (!institution) {
    return null;
  }

  const image = institution.image || institutionImageMap[institution.name];
  const categoryLabel = institution.tags?.length
    ? `${institution.tags[0]} / ${institution.category}`
    : institution.category;

  return {
    id: String(institution.id),
    name: institution.name,
    category: categoryLabel,
    region: institution.detail_region,
    address: institution.address,
    phone: institution.phone,
    website: institution.homepage,
    status: institution.status || "운영중",
    description:
      `${institution.name}은(는) ${institution.detail_region}에서 운영되는 ${institution.category} 기관입니다. ` +
      `전국 기관 통합 카탈로그 기준으로 기본 정보를 우선 제공하고 있으며, 상세 운영 정보는 순차적으로 보완 중입니다.`,
    operatingHours: "평일 09:00 - 18:00",
    established: "정보 준비중",
    facilities: ["강의실", "상담공간", "안내데스크", "자료공간"],
    images: image ? [image] : [],
    programs: [
      { name: "기관 기본 프로그램 안내", status: "운영중", type: "기관 안내" },
      { name: "지역 맞춤 교육과정", status: "문의 가능", type: "평생교육" },
      { name: "주민 참여 프로그램", status: "운영중", type: "지역 연계" },
    ],
  };
}
