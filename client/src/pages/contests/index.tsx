import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronRight, Download, Filter, Search, Eye, User, X, Folder, Users, Trophy, Building2 } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Constants for Filter Structure
const structure = {
  status: ["진행 중 공모", "접수 예정 공모", "종료"],
  categories: [
    "교육·평생학습 프로그램",
    "아이디어·정책제안",
    "디지털·AI·미디어",
    "문화·예술·콘텐츠",
    "지역문제 해결·사회참여"
  ],
  targets: [
    "시민·일반인",
    "청소년·대학생",
    "누구나 참여"
  ],
  awards: [
    "사업비 지원",
    "교육·컨설팅 지원",
    "인증·선정형",
    "기타 혜택"
  ],
  organizers: [
    "중앙정부·공공기관",
    "지방자치단체·지역 공기업",
    "교육기관",
    "민간기업·단체"
  ]
};

// Mock Data for Contests (Updated from Wevity)
const mockContests = [
  {
    id: 29,
    title: "제68회 밀양아리랑대축제 아리랑 체험 프로그램 공모",
    organizer: "밀양문화관광재단",
    organizerType: "지방자치단체·지역 공기업",
    description: "2026년 제68회 밀양아리랑대축제의 성공적인 개최를 위해 참신하고 특색 있는 아리랑 체험 프로그램을 공모합니다. 축제 관람객들에게 즐거움을 선사할 다양한 아이디어를 제안해주세요.",
    period: "2025.11.13 ~ 2025.12.26",
    status: "진행 중 공모",
    dDay: 13,
    category: "문화·예술·콘텐츠",
    target: "누구나 참여",
    awardType: "사업비 지원",
    views: 56,
    detailImage: "https://images.unsplash.com/photo-1533669955142-6a73332af4db?q=80&w=2074&auto=format&fit=crop",
    files: ["공고문.hwp", "참가신청서.hwp"],
    link: "https://www.arirang.or.kr/content/04borad/01_01.php?proc_type=view&a_num=16450513&b_num=60&rtn_url=%2Fcontent%2F04borad%2F01_01.php"
  },
  {
    id: 28,
    title: "창원특례시 평생학습관 명칭 공모 안내",
    organizer: "창원특례시",
    organizerType: "지방자치단체·지역 공기업",
    description: "창원시 평생학습에 관심이 있는 사람 누구나 참여 가능한 평생학습관 명칭 공모전입니다. 시민들의 참신한 아이디어를 기다립니다.",
    period: "2025.11.17 ~ 2025.11.30",
    status: "종료",
    dDay: -3,
    category: "아이디어·정책제안",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 99,
    detailImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    files: ["공고문.hwp", "홍보포스터.jpg"],
    link: "https://www.changwon.go.kr/lll/portal/bbs/view.do?mId=0601000000&bIdx=10872&ptIdx=112"
  },
  {
    id: 27,
    title: "2025년 반려식물 키트 아이디어 공모전",
    organizer: "국립세종수목원",
    organizerType: "중앙정부·공공기관",
    description: "탄소중립 시대에 맞는 창의적인 반려식물 키트 아이디어를 발굴하기 위한 공모전입니다. '탄소 중립' 또는 '나의 첫 반려식물'을 주제로 자신만의 키트 아이디어를 제안해주세요.",
    period: "2025.10.28 ~ 2025.11.20",
    status: "종료",
    dDay: -13,
    category: "아이디어·정책제안",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 450,
    detailImage: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=2090&auto=format&fit=crop",
    files: ["공고문.pdf", "참가신청서.hwp"],
    link: "https://www.sjna.or.kr/contents/dynamicDetail?menuId=M0016&upMenuId=M0009&s0&postNo=3159"
  },
  {
    id: 26,
    title: "2025년 대전교육 제안 공모",
    organizer: "대전광역시교육청",
    organizerType: "지방자치단체·지역 공기업",
    description: "대전교육청에서는 국민ㆍ공무원의 창의적인 아이디어를 발굴하여 대전교육정책에 반영하고자 대전교육 제안 공모를 실시합니다. 대전교육 발전을 위한 창의적인 아이디어를 제안해주세요.",
    period: "2025.11.05 ~ 2025.11.14",
    status: "종료",
    dDay: -19,
    category: "아이디어·정책제안",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 332,
    detailImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    files: ["공모계획.hwp", "제안서양식.hwpx"],
    link: "https://www.dje.go.kr/boardCnts/view.do?m=020908&s=dje&boardID=447&viewBoardID=447&boardSeq=3333659&lev=0&action=view&searchType=&statusYN=W&page=1"
  },
  {
    id: 30,
    title: "대전시소 아이디어 공모",
    organizer: "대전광역시",
    organizerType: "지방자치단체·지역 공기업",
    description: "시민의 제안이 정책이 됩니다. 대전시소는 대전시민 누구나 자유롭게 정책을 제안하고 토론하는 시민참여 플랫폼입니다.",
    period: "2025.09.22 ~ 2025.10.31",
    status: "종료",
    dDay: -33,
    category: "아이디어·정책제안",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 1200,
    detailImage: "/images/daejeon_seesaw_poster.jpg",
    files: [],
    link: "https://www.daejeon.go.kr/seesaw/index.do"
  },
  {
    id: 1,
    title: "2025년 국민체육진흥공단 공공데이터 활용 경진대회",
    organizer: "국민체육진흥공단",
    organizerType: "중앙정부·공공기관",
    description: "스포츠·체육 분야 공공데이터를 활용한 창의적인 아이디어와 비즈니스 모델을 발굴합니다.",
    period: "2025.01.15 ~ 2025.02.28",
    status: "종료",
    dDay: -278,
    category: "디지털·AI·미디어",
    target: "누구나 참여",
    awardType: "사업비 지원",
    views: 1540,
    detailImage: "https://www.wevity.com/upload/contest/20250806140711_b33ccd39.jpg",
    files: ["공고문.hwp", "참가신청서.hwp"]
  },
  {
    id: 2,
    title: "2026 포스텍 SF 어워드 (SF 단편소설 공모전)",
    organizer: "포스텍 소통과 공론 연구소",
    organizerType: "교육기관",
    description: "과학기술과 인간, 사회의 미래를 그려보는 SF 단편소설 공모전입니다. 이공계 대학생 및 일반인 누구나 참여 가능합니다.",
    period: "2025.01.01 ~ 2025.03.31",
    status: "종료",
    dDay: -247,
    category: "문화·예술·콘텐츠",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 2850,
    detailImage: "https://www.wevity.com/upload/contest/20251128141425_4d593658.jpg",
    files: ["공모요강.pdf"]
  },
  {
    id: 3,
    title: "제1회 그린 스테이지 희곡 공모전",
    organizer: "한국극작가협회",
    organizerType: "민간기업·단체",
    description: "기후 위기와 환경 문제를 주제로 한 창작 희곡을 공모합니다. 선정작은 무대화 지원을 받습니다.",
    period: "2025.02.01 ~ 2025.04.30",
    status: "종료",
    dDay: -217,
    category: "문화·예술·콘텐츠",
    target: "시민·일반인",
    awardType: "사업비 지원",
    views: 1120,
    detailImage: "https://www.wevity.com/upload/contest/20251119181633_6155716d.jpg",
    files: ["공모신청서.docx"]
  },
  {
    id: 4,
    title: "AI로 만들어가는 국회 미래로(路) 영상 공모전",
    organizer: "국회사무처",
    organizerType: "중앙정부·공공기관",
    description: "생성형 AI 기술을 활용하여 국회의 미래 비전을 담은 창의적인 영상을 공모합니다.",
    period: "2025.01.10 ~ 2025.01.30",
    status: "종료",
    dDay: -307,
    category: "디지털·AI·미디어",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 3200,
    detailImage: "https://www.wevity.com/upload/contest/20251104213729_5007cb78.jpg",
    files: ["가이드라인.pdf"]
  },
  {
    id: 5,
    title: "2025 K-슈즈 메이킹 챌린지 | 신발 제품화 디자인 공모전",
    organizer: "부산경제진흥원",
    organizerType: "지방자치단체·지역 공기업",
    description: "참신한 신발 디자인을 발굴하고 제품화를 지원하는 디자인 챌린지입니다.",
    period: "2025.01.05 ~ 2025.02.10",
    status: "종료",
    dDay: -296,
    category: "문화·예술·콘텐츠",
    target: "청소년·대학생",
    awardType: "교육·컨설팅 지원",
    views: 1890,
    detailImage: "https://www.wevity.com/upload/contest/20251126150105_c73d31f0.jpg",
    files: ["디자인도안.ai"]
  },
  {
    id: 6,
    title: "2025년도 허위정보 대응 아이디어 공모전",
    organizer: "방송통신위원회",
    organizerType: "중앙정부·공공기관",
    description: "디지털 공간의 허위조작정보(가짜뉴스) 확산을 방지하고 건전한 미디어 환경을 조성하기 위한 아이디어를 찾습니다.",
    period: "2025.01.20 ~ 2025.01.28",
    status: "종료",
    dDay: -309,
    category: "아이디어·정책제안",
    target: "시민·일반인",
    awardType: "기타 혜택",
    views: 950,
    detailImage: "https://www.wevity.com/upload/contest/20251029200338_325b22ec.jpg",
    files: ["제안서양식.hwp"]
  },
  {
    id: 7,
    title: "제9회 다새쓰 방정환문학 공모전",
    organizer: "한국방정환재단",
    organizerType: "민간기업·단체",
    description: "어린이와 청소년을 위한 문학 작품을 공모합니다. 동화, 동시, 청소년 소설 등 다양한 장르를 모집합니다.",
    period: "2025.04.01 ~ 2025.06.30",
    status: "종료",
    dDay: -156,
    category: "문화·예술·콘텐츠",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 2100,
    detailImage: "https://www.wevity.com/upload/contest/20251110155122_2d4ef7ad.jpg",
    files: ["공모요강.pdf"]
  },
  {
    id: 8,
    title: "[SK행복나눔재단] 2026년 Sunny Scholar 5기 모집",
    organizer: "SK행복나눔재단",
    organizerType: "민간기업·단체",
    description: "사회 변화를 이끌어갈 대학생 인재를 모집합니다. 사회문제 해결 프로젝트를 기획하고 실행합니다.",
    period: "2025.01.01 ~ 2025.01.30",
    status: "종료",
    dDay: -307,
    category: "지역문제 해결·사회참여",
    target: "청소년·대학생",
    awardType: "교육·컨설팅 지원",
    views: 4500,
    detailImage: "https://www.wevity.com/upload/contest/20251116213306_1f51ae8a.jpg",
    files: ["모집공고.pdf"]
  },
  {
    id: 9,
    title: "제2회 컴투스 글로벌 게임개발 공모전 컴:온 2025",
    organizer: "컴투스",
    organizerType: "민간기업·단체",
    description: "글로벌 시장을 겨냥한 창의적인 모바일 게임 개발 공모전입니다. 개발 지원금과 입사 특전이 주어집니다.",
    period: "2025.01.10 ~ 2025.02.20",
    status: "종료",
    dDay: -286,
    category: "디지털·AI·미디어",
    target: "청소년·대학생",
    awardType: "사업비 지원",
    views: 3800,
    detailImage: "https://www.wevity.com/upload/contest/20251002145352_2f90e326.jpg",
    files: ["기획서양식.ppt"]
  },
  {
    id: 10,
    title: "제2회 매경미디어 AI 영상광고•숏폼 공모전",
    organizer: "매경미디어그룹",
    organizerType: "민간기업·단체",
    description: "AI 기술을 활용한 창의적인 영상 광고 및 숏폼 콘텐츠를 공모합니다.",
    period: "2025.01.15 ~ 2025.02.05",
    status: "종료",
    dDay: -301,
    category: "디지털·AI·미디어",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 1650,
    detailImage: "https://www.wevity.com/upload/contest/20251117130924_289551c4.jpg",
    files: ["참가신청서.hwp"]
  },
  {
    id: 11,
    title: "제3회 현대문학*미래엔 청소년 문학상",
    organizer: "현대문학, 미래엔",
    organizerType: "민간기업·단체",
    description: "미래 문학을 이끌어갈 청소년 작가를 발굴합니다. 소설 부문 작품을 모집합니다.",
    period: "2025.02.01 ~ 2025.03.31",
    status: "종료",
    dDay: -247,
    category: "문화·예술·콘텐츠",
    target: "청소년·대학생",
    awardType: "기타 혜택",
    views: 1340,
    detailImage: "https://www.wevity.com/upload/contest/20251110114013_47631e46.jpg",
    files: ["응모양식.hwp"]
  },
  {
    id: 12,
    title: "을지로4가역 미디어아트 공모전",
    organizer: "서울교통공사",
    organizerType: "지방자치단체·지역 공기업",
    description: "지하철 역사를 문화 예술 공간으로 조성하기 위한 미디어아트 작품을 공모합니다.",
    period: "2025.01.10 ~ 2025.02.07",
    status: "종료",
    dDay: -299,
    category: "디지털·AI·미디어",
    target: "시민·일반인",
    awardType: "사업비 지원",
    views: 2200,
    detailImage: "https://www.wevity.com/upload/contest/20251126105022_edbc7b0c.jpg",
    files: ["작품제작규격.pdf"]
  },
  {
    id: 13,
    title: "제1회 글뿌리출판사 어린이책 공모전",
    organizer: "글뿌리출판사",
    organizerType: "민간기업·단체",
    description: "어린이들에게 꿈과 희망을 줄 수 있는 창작 그림책 및 동화 원고를 모집합니다.",
    period: "2025.01.01 ~ 2025.02.28",
    status: "종료",
    dDay: -278,
    category: "문화·예술·콘텐츠",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 890,
    detailImage: "https://www.wevity.com/upload/contest/20250818175832_844e3671.jpg",
    files: ["원고접수양식.hwp"]
  },
  {
    id: 14,
    title: "[무료] 25년 12월 삼성생명 금융아카데미 참가자 모집",
    organizer: "삼성생명",
    organizerType: "민간기업·단체",
    description: "금융 기초 지식부터 실전 자산관리까지 배울 수 있는 금융 아카데미 참가자를 모집합니다.",
    period: "2025.01.20 ~ 2025.01.31",
    status: "종료",
    dDay: -306,
    category: "교육·평생학습 프로그램",
    target: "청소년·대학생",
    awardType: "교육·컨설팅 지원",
    views: 4100,
    detailImage: "https://www.wevity.com/upload/contest/20251118185430_196ed473.jpg",
    files: ["커리큘럼.pdf"]
  },
  {
    id: 15,
    title: "제10회 대한민국 평생학습 박람회 체험부스 운영기관 모집",
    organizer: "국가평생교육진흥원",
    organizerType: "중앙정부·공공기관",
    description: "전국 평생학습 성과를 공유하는 박람회에서 체험 부스를 운영할 기관을 모집합니다.",
    period: "2025.03.10 ~ 2025.04.10",
    status: "종료",
    dDay: -237,
    category: "교육·평생학습 프로그램",
    target: "누구나 참여",
    awardType: "사업비 지원",
    views: 520,
    detailImage: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop",
    files: ["운영모집공고.hwp"]
  },
  {
    id: 16,
    title: "2025년 노인일자리 창출 우수사례 공모전",
    organizer: "보건복지부",
    organizerType: "중앙정부·공공기관",
    description: "노인 일자리 창출에 기여한 우수 기업 및 기관의 사례를 발굴하여 시상합니다.",
    period: "2025.02.15 ~ 2025.03.15",
    status: "종료",
    dDay: -263,
    category: "지역문제 해결·사회참여",
    target: "누구나 참여",
    awardType: "인증·선정형",
    views: 840,
    detailImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop",
    files: ["공모신청서.hwp"]
  },
  {
    id: 17,
    title: "전국 도서관 독서문화 프로그램 아이디어 공모",
    organizer: "국립중앙도서관",
    organizerType: "중앙정부·공공기관",
    description: "도서관 이용 활성화를 위한 독창적인 독서 문화 프로그램 아이디어를 제안해주세요.",
    period: "2025.01.05 ~ 2025.02.28",
    status: "종료",
    dDay: -278,
    category: "아이디어·정책제안",
    target: "시민·일반인",
    awardType: "기타 혜택",
    views: 1250,
    detailImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2028&auto=format&fit=crop",
    files: ["제안서.docx"]
  },
  {
    id: 18,
    title: "제3회 우리 동네 배움터 영상 브이로그 공모전",
    organizer: "서울시평생교육진흥원",
    organizerType: "지방자치단체·지역 공기업",
    description: "우리 동네 배움터에서 일어나는 소소하고 감동적인 이야기를 영상으로 담아주세요.",
    period: "2025.01.20 ~ 2025.02.20",
    status: "종료",
    dDay: -286,
    category: "디지털·AI·미디어",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 2100,
    detailImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2070&auto=format&fit=crop",
    files: ["참가신청서.hwp"]
  },
  {
    id: 19,
    title: "2025 청년 로컬크리에이터 활성화 지원사업",
    organizer: "중소벤처기업부",
    organizerType: "중앙정부·공공기관",
    description: "지역의 자원과 특성을 기반으로 혁신적인 비즈니스를 창출할 청년 로컬크리에이터를 모집합니다.",
    period: "2025.02.01 ~ 2025.03.02",
    status: "종료",
    dDay: -276,
    category: "지역문제 해결·사회참여",
    target: "청소년·대학생",
    awardType: "사업비 지원",
    views: 4200,
    detailImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    files: ["사업계획서.hwp"]
  },
  {
    id: 20,
    title: "장애인 평생교육 프로그램 개발 공모",
    organizer: "국립특수교육원",
    organizerType: "중앙정부·공공기관",
    description: "장애 성인의 평생학습 기회 확대를 위한 맞춤형 교육 프로그램 개발을 지원합니다.",
    period: "2025.01.15 ~ 2025.02.15",
    status: "종료",
    dDay: -291,
    category: "교육·평생학습 프로그램",
    target: "누구나 참여",
    awardType: "사업비 지원",
    views: 670,
    detailImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2069&auto=format&fit=crop",
    files: ["공고문.pdf"]
  },
  {
    id: 21,
    title: "제12회 미래교육 디자인 공모전",
    organizer: "교육부",
    organizerType: "중앙정부·공공기관",
    description: "미래 교육 공간 구축 및 교육 과정 혁신을 위한 디자인 아이디어를 공모합니다.",
    period: "2025.04.01 ~ 2025.05.31",
    status: "종료",
    dDay: -186,
    category: "아이디어·정책제안",
    target: "청소년·대학생",
    awardType: "기타 혜택",
    views: 1500,
    detailImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
    files: ["공모요강.pdf"]
  },
  {
    id: 22,
    title: "다문화가정 한국어 말하기 대회",
    organizer: "한국건강가정진흥원",
    organizerType: "중앙정부·공공기관",
    description: "다문화가족의 한국어 소통 능력 향상과 사회 통합을 위한 말하기 대회를 개최합니다.",
    period: "2025.03.01 ~ 2025.03.31",
    status: "종료",
    dDay: -247,
    category: "문화·예술·콘텐츠",
    target: "시민·일반인",
    awardType: "기타 혜택",
    views: 980,
    detailImage: "https://images.unsplash.com/photo-1529070538774-1843cb6e6581?q=80&w=2070&auto=format&fit=crop",
    files: ["참가신청서.hwp"]
  },
  {
    id: 23,
    title: "2025 전국 평생학습도시 슬로건 공모전",
    organizer: "전국평생학습도시협의회",
    organizerType: "민간기업·단체",
    description: "평생학습도시의 비전과 가치를 담은 창의적인 슬로건을 공모합니다.",
    period: "2025.01.01 ~ 2025.01.31",
    status: "종료",
    dDay: -306,
    category: "아이디어·정책제안",
    target: "누구나 참여",
    awardType: "기타 혜택",
    views: 2300,
    detailImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
    files: ["참가신청서.hwp"]
  },
  {
    id: 24,
    title: "시니어 디지털 역량강화 강사 모집",
    organizer: "한국지능정보사회진흥원(NIA)",
    organizerType: "중앙정부·공공기관",
    description: "어르신들의 디지털 기기 활용 능력 향상을 도울 열정적인 디지털 강사를 모집합니다.",
    period: "2025.01.10 ~ 2025.01.25",
    status: "종료",
    dDay: -312,
    category: "교육·평생학습 프로그램",
    target: "시민·일반인",
    awardType: "교육·컨설팅 지원",
    views: 3100,
    detailImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    files: ["채용공고.pdf"]
  },
  {
    id: 25,
    title: "환경사랑 그림그리기 대회",
    organizer: "K-water",
    organizerType: "중앙정부·공공기관",
    description: "물의 소중함과 환경 보전의 중요성을 주제로 한 그림 그리기 대회입니다.",
    period: "2025.04.15 ~ 2025.05.15",
    status: "종료",
    dDay: -202,
    category: "문화·예술·콘텐츠",
    target: "청소년·대학생",
    awardType: "기타 혜택",
    views: 1450,
    detailImage: "https://images.unsplash.com/photo-1560421683-6856ea585c78?q=80&w=2074&auto=format&fit=crop",
    files: ["대회요강.pdf"]
  }
];

export default function Contests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedAwards, setSelectedAwards] = useState<string[]>([]);
  const [selectedOrganizers, setSelectedOrganizers] = useState<string[]>([]);
  
  const [selectedContest, setSelectedContest] = useState<typeof mockContests[0] | null>(null);

  const toggleFilter = (setFunc: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setFunc(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const filteredContests = useMemo(() => {
    return mockContests.filter(contest => {
      const matchesSearch = contest.title.includes(searchQuery) || contest.description.includes(searchQuery);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(contest.status);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(contest.category);
      const matchesTarget = selectedTargets.length === 0 || selectedTargets.includes(contest.target);
      const matchesAward = selectedAwards.length === 0 || selectedAwards.includes(contest.awardType);
      const matchesOrganizer = selectedOrganizers.length === 0 || selectedOrganizers.includes(contest.organizerType);

      return matchesSearch && matchesStatus && matchesCategory && matchesTarget && matchesAward && matchesOrganizer;
    });
  }, [searchQuery, selectedStatuses, selectedCategories, selectedTargets, selectedAwards, selectedOrganizers]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setSelectedCategories([]);
    setSelectedTargets([]);
    setSelectedAwards([]);
    setSelectedOrganizers([]);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.subtlepatterns.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-sm font-medium mb-4 backdrop-blur-sm">
                <Trophy className="w-4 h-4" />
                <span>도전하는 당신이 아름답습니다</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
                공모사업 <span className="text-blue-300">통합안내</span>
              </h1>
              <p className="text-blue-100/80 max-w-2xl text-lg font-light leading-relaxed">
                전국의 다양한 평생교육 공모사업을 한눈에 확인하세요.<br className="hidden md:block" />
                당신의 아이디어와 재능을 펼칠 기회가 기다리고 있습니다.
              </p>
            </div>
            <div className="hidden md:block">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 h-14 rounded-full shadow-lg transition-all hover:scale-105"
              >
                공모사업 등록신청
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="sticky top-24 border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    상세 필터
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-8 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    초기화
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Status Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">진행 상태</h4>
                    <div className="space-y-2">
                      {structure.status.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`status-${status}`} 
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={() => toggleFilter(setSelectedStatuses, status)}
                            className="data-[state=checked]:bg-blue-600 border-slate-300"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-800 transition-colors"
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">공모 분야</h4>
                    <div className="space-y-2">
                      {structure.categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleFilter(setSelectedCategories, category)}
                            className="data-[state=checked]:bg-blue-600 border-slate-300"
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-800 transition-colors"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px bg-slate-100" />

                   {/* Target Filter */}
                   <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">참여 대상</h4>
                    <div className="space-y-2">
                      {structure.targets.map((target) => (
                        <div key={target} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`target-${target}`} 
                            checked={selectedTargets.includes(target)}
                            onCheckedChange={() => toggleFilter(setSelectedTargets, target)}
                            className="data-[state=checked]:bg-blue-600 border-slate-300"
                          />
                          <label
                            htmlFor={`target-${target}`}
                            className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-800 transition-colors"
                          >
                            {target}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                   <div className="h-px bg-slate-100" />

                  {/* Award Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">시상/특전</h4>
                    <div className="space-y-2">
                      {structure.awards.map((award) => (
                        <div key={award} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`award-${award}`} 
                            checked={selectedAwards.includes(award)}
                            onCheckedChange={() => toggleFilter(setSelectedAwards, award)}
                            className="data-[state=checked]:bg-blue-600 border-slate-300"
                          />
                          <label
                            htmlFor={`award-${award}`}
                            className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-blue-800 transition-colors"
                          >
                            {award}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Promotional Banner - Removed */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Search Bar */}
            <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input 
                  placeholder="공모전 제목, 주관기관, 키워드로 검색해보세요" 
                  className="pl-10 border-0 bg-transparent focus-visible:ring-0 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 rounded-lg h-12">
                검색
              </Button>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center px-1">
              <p className="text-slate-600">
                총 <span className="font-bold text-blue-600">{filteredContests.length}</span>건의 공모사업이 있습니다.
              </p>
              <div className="flex gap-2">
                 <Select defaultValue="latest">
                  <SelectTrigger className="w-[140px] h-9 bg-white border-slate-200">
                    <SelectValue placeholder="정렬 순서" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="closing">마감임박순</SelectItem>
                    <SelectItem value="views">조회순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contests Grid */}
            {filteredContests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContests.map((contest) => (
                  <Card 
                    key={contest.id} 
                    className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden cursor-pointer flex flex-col h-full bg-white hover:-translate-y-1"
                    onClick={() => setSelectedContest(contest)}
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img 
                        src={contest.detailImage} 
                        alt={contest.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {contest.dDay !== undefined && (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "backdrop-blur-sm font-bold border-0 shadow-sm",
                              contest.dDay > 0 && contest.dDay !== 9999 ? "bg-red-600 text-white" : "bg-white/90 text-slate-800"
                            )}
                          >
                            {contest.dDay === 9999 ? "상시 접수" : (contest.dDay > 0 ? `D-${contest.dDay}` : (contest.dDay === 0 ? "D-Day" : "종료"))}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white font-medium text-sm flex items-center">
                          자세히 보기 <ChevronRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium truncate max-w-[120px]">
                          {contest.organizer}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="truncate text-blue-600 font-medium">{contest.category}</span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                        {contest.title}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          <span className="text-xs">{contest.period}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-slate-600">
                            <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                            <span className="text-xs">{contest.target}</span>
                          </div>
                          <div className="flex items-center text-slate-400 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            {contest.views}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">검색 결과가 없습니다</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  검색어나 필터 조건을 변경하여 다시 검색해보세요.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={resetFilters}
                >
                  필터 초기화
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedContest} onOpenChange={(open) => !open && setSelectedContest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selectedContest && (
            <div className="flex flex-col">
              <div className="relative h-64 md:h-80 bg-slate-100">
                <img 
                  src={selectedContest.detailImage} 
                  alt={selectedContest.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedContest.status !== "종료" && (
                      <Badge className="bg-blue-600 border-0">{selectedContest.status}</Badge>
                    )}
                    <Badge variant="outline" className="bg-white/20 text-white border-white/40 backdrop-blur-md">
                      {selectedContest.category}
                    </Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                    {selectedContest.title}
                  </h2>
                  <div className="flex items-center text-white/80 text-sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    {selectedContest.organizer}
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setSelectedContest(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                      공모 개요
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedContest.description}
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                      상세 정보
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
                        <div className="text-xs text-slate-500 mb-1">공모 기간</div>
                        <div className="font-medium text-slate-800 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                          {selectedContest.period}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
                        <div className="text-xs text-slate-500 mb-1">참가 대상</div>
                        <div className="font-medium text-slate-800 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          {selectedContest.target}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
                        <div className="text-xs text-slate-500 mb-1">시상 혜택</div>
                        <div className="font-medium text-slate-800 flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-blue-500" />
                          {selectedContest.awardType}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
                        <div className="text-xs text-slate-500 mb-1">주최/주관</div>
                        <div className="font-medium text-slate-800 flex items-center">
                          <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                          {selectedContest.organizer}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                    <h4 className="font-bold text-blue-900">첨부 파일</h4>
                    <div className="space-y-2">
                      {selectedContest.files.map((file, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          className="w-full justify-start bg-white text-slate-700 hover:text-blue-700 hover:border-blue-200 h-auto py-3"
                        >
                          <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate text-sm">{file}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold shadow-lg shadow-blue-200"
                      onClick={() => {
                        if ((selectedContest as any).link) {
                          window.open((selectedContest as any).link, '_blank');
                        }
                      }}
                    >
                      지원하기
                    </Button>
                    <Button variant="outline" className="w-full h-12 text-slate-600 border-slate-300 hover:bg-slate-50">
                      문의하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
