import type { OnlineLecture } from "@/types/content";

export const onlineLectures: OnlineLecture[] = [
  {
    id: "1",
    title: "촌스러운 옷장 싹 정리하세요",
    description: "나이 들수록 더 멋지게! 중년의 품격을 높이는 패션 스타일링 팁을 알려드립니다.",
    category: "의",
    tags: ["패션", "스타일링", "중년코디"],
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/embed/lTqx-oDq4D8", // Dummy embed URL
    thumbnailUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    helpfulFor: "나이든 60대"
  },
  {
    id: "2",
    title: "건강한 노화 위한 영양 식단",
    description: "고혈압 예방에 좋은 맛있고 건강한 저염식 레시피를 소개합니다.",
    category: "식",
    tags: ["건강식", "저염식", "레시피"],
    platform: "YouTube",
    videoUrl: "https://youtu.be/AsZVWppIwuM?si=-9D2_zxoqJRhLt3R",
    thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    helpfulFor: "건강한 식습관을 갖고 싶은 시니어"
  },
  {
    id: "3",
    title: "안전한 우리 집 만들기: 낙상 사고 예방",
    description: "집안에서 발생하기 쉬운 낙상 사고를 예방하기 위한 가구 배치와 안전 수칙.",
    category: "주",
    tags: ["안전", "주거환경", "낙상예방"],
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/embed/dummy3",
    thumbnailUrl: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    helpfulFor: "집안 안전이 걱정되는 어르신과 보호자"
  },
  {
    id: "4",
    title: "하루 10분 시니어 스트레칭",
    description: "굳은 몸을 풀어주고 활력을 되찾아주는 간단한 스트레칭 동작.",
    category: "건강운동",
    tags: ["운동", "스트레칭", "건강"],
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/embed/dummy4",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    helpfulFor: "운동 부족을 느끼는 60대 이상"
  },
  {
    id: "5",
    title: "스마트폰으로 손주와 영상통화 하기",
    description: "카카오톡 페이스톡 사용법부터 줌(Zoom) 활용법까지 쉽게 알려드려요.",
    category: "정서취미",
    tags: ["스마트폰", "디지털교육", "소통"],
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/embed/dummy5",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    helpfulFor: "가족과 더 자주 소통하고 싶은 어르신"
  },
  {
    id: "6",
    title: "반려식물 키우기 기초",
    description: "집안 공기를 맑게 하고 정서적 안정을 주는 반려식물 관리법.",
    category: "정서취미",
    tags: ["식물", "취미", "힐링"],
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/embed/dummy6",
    thumbnailUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    helpfulFor: "새로운 취미를 찾고 있는 시니어"
  }
];
