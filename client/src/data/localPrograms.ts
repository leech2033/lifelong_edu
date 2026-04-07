import type { LocalProgram } from "@/types/content";

export const localPrograms: LocalProgram[] = [
  {
    id: "1",
    region: "대덕구",
    organizationName: "대전 대덕구 노인종합복지관",
    programName: "노년사회화교육프로그램",
    description: "어르신들의 건전한 여가선용과 자기개발을 위한 다양한 평생교육 프로그램을 제공합니다.",
    target: "60세 이상 복지관 회원 어르신",
    schedule: "15주 과정, 상·하반기 접수",
    operationType: "오프라인",
    applicationMethod: "방문 신청 / 전화 042-627-0767",
    homepageUrl: "http://www.ddswc.net",
    address: "대전광역시 대덕구 계족로 663번길 26"
  },
  {
    id: "2",
    region: "서구",
    organizationName: "서구노인복지관",
    programName: "스마트폰 활용 교육",
    description: "스마트폰 기본 기능부터 실생활에 유용한 앱 활용법까지 교육합니다.",
    target: "서구 거주 60세 이상 어르신",
    schedule: "4주 과정, 매월 접수",
    operationType: "오프라인",
    applicationMethod: "전화 접수 042-488-6259",
    homepageUrl: "http://www.seogu-noin.or.kr",
    address: "대전광역시 서구 계룡로 553번길 52"
  },
  {
    id: "3",
    region: "유성구",
    organizationName: "유성구종합사회복지관",
    programName: "독거어르신 도시락 배달",
    description: "거동이 불편한 저소득 독거 어르신 댁으로 영양 잡힌 도시락을 배달해 드립니다.",
    target: "유성구 거주 저소득 독거 어르신",
    schedule: "연중 수시 접수",
    operationType: "방문서비스",
    applicationMethod: "주민센터 의뢰 또는 복지관 전화 상담",
    homepageUrl: "http://www.yuseong.or.kr",
    address: "대전광역시 유성구 도안대로 589번길 27"
  },
  {
    id: "4",
    region: "중구",
    organizationName: "중구시니어클럽",
    programName: "노인일자리 및 사회활동지원",
    description: "어르신들의 활기차고 건강한 노후생활을 위해 다양한 일자리와 사회활동을 지원합니다.",
    target: "중구 거주 65세 이상 기초연금 수급자",
    schedule: "연초 통합 모집 (12월~1월)",
    operationType: "오프라인",
    applicationMethod: "방문 접수",
    homepageUrl: "http://www.junggusc.or.kr",
    address: "대전광역시 중구 보문로 246"
  },
  {
    id: "5",
    region: "동구",
    organizationName: "동구정다운어르신복지관",
    programName: "건강증진실 운영",
    description: "물리치료, 체력단련실 등 어르신들의 건강 관리를 위한 시설을 운영합니다.",
    target: "복지관 회원 누구나",
    schedule: "평일 09:00 ~ 18:00",
    operationType: "오프라인",
    applicationMethod: "자율 이용",
    homepageUrl: "http://www.donggu-noin.or.kr",
    address: "대전광역시 동구 가양로 13"
  }
];
