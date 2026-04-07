import Layout from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Search, Clock, CreditCard, User, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function DamoaCourseList() {
  // Mock Data derived from the structure of the reference site
  const courses = [
    {
      id: 1,
      title: "댄스스포츠 초급(라틴5종 베이직)",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "26.1.9. ~ 26.2.27.",
      time: "금, 10:00~11:50",
      target: "인터넷 20명 / 방문 0명",
      fee: "100,000원",
      status: "접수중",
      statusType: "active", // active, closed, upcoming
      regPeriod: "25.12.02 ~ 26.01.09",
      category: "문화예술"
    },
    {
      id: 2,
      title: "통기타 : 중급",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "26.1.8. ~ 26.2.26.",
      time: "목, 19:00~20:30",
      target: "인터넷 10명 / 방문 0명",
      fee: "60,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.02 ~ 26.01.08",
      category: "문화예술"
    },
    {
      id: 3,
      title: "소액투자 부동산경매",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "25.12.19. ~ 26.2.6.",
      time: "금, 19:00~21:50",
      target: "인터넷 10명 / 방문 0명",
      fee: "200,000원",
      status: "접수마감",
      statusType: "closed",
      regPeriod: "25.12.02 ~ 25.12.26",
      category: "직업능력"
    },
    {
      id: 4,
      title: "독서지도사 자격증과정",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "25.12.19. ~ 26.2.6.",
      time: "금, 10:00~11:30",
      target: "인터넷 10명 / 방문 0명",
      fee: "80,000원",
      status: "접수마감",
      statusType: "closed",
      regPeriod: "25.12.02 ~ 25.12.26",
      category: "직업능력"
    },
    {
      id: 5,
      title: "차를 배우는 하루 : 중국차 다도 체험 클래스 B",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "25.12.18. ~ 26.1.29.",
      time: "목, 14:00~15:50",
      target: "인터넷 10명 / 방문 0명",
      fee: "100,000원",
      status: "접수마감",
      statusType: "closed",
      regPeriod: "25.12.02 ~ 25.12.18",
      category: "인문교양"
    },
    {
      id: 6,
      title: "캘리그라피 B",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "25.12.16. ~ 26.2.3.",
      time: "화, 18:30~20:00",
      target: "인터넷 10명 / 방문 0명",
      fee: "90,000원",
      status: "접수마감",
      statusType: "closed",
      regPeriod: "25.12.02 ~ 25.12.16",
      category: "문화예술"
    },
    {
      id: 7,
      title: "스마트폰 영상 편집 기초",
      institution: "유성구 평생학습원",
      period: "26.3.5. ~ 26.4.23.",
      time: "수, 14:00~16:00",
      target: "인터넷 15명",
      fee: "무료",
      status: "접수예정",
      statusType: "upcoming",
      regPeriod: "26.2.10 ~ 26.2.28",
      category: "직업능력"
    },
    {
      id: 8,
      title: "시니어 요가 교실",
      institution: "대덕구 평생학습관",
      period: "26.3.2. ~ 26.5.30.",
      time: "월/수, 10:00~11:00",
      target: "방문 20명",
      fee: "30,000원",
      status: "접수예정",
      statusType: "upcoming",
      regPeriod: "26.2.15 ~ 26.2.25",
      category: "건강/스포츠"
    },
    {
      id: 9,
      title: "다이어트댄스(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 30명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "건강/스포츠"
    },
    {
      id: 10,
      title: "통기타(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 15명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "문화예술"
    },
    {
      id: 11,
      title: "문서작성실무(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 23명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "직업능력"
    },
    {
      id: 12,
      title: "핸드드립커피(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 10명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "인문교양"
    },
    {
      id: 13,
      title: "폼롤러바디케어(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.02.28",
      time: "(토)",
      target: "추첨식 20명",
      fee: "20,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "건강/스포츠"
    },
    {
      id: 14,
      title: "IT를활용한부동산투자(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 24명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "직업능력"
    },
    {
      id: 15,
      title: "웰빙샐러드&샌드위치(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 15명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "인문교양"
    },
    {
      id: 16,
      title: "사진편집디자인(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 23명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "직업능력"
    },
    {
      id: 17,
      title: "의류리폼창업(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 20명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "직업능력"
    },
    {
      id: 18,
      title: "코어강화근력운동(주말)",
      institution: "여성가족원(본원)",
      period: "26.01.10 ~ 26.03.28",
      time: "(토)",
      target: "추첨식 24명",
      fee: "30,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.03 ~ 25.12.10",
      category: "건강/스포츠"
    },
    {
      id: 19,
      title: "댄스스포츠 초급(룸바)",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "26.1.6.~26.2.26.",
      time: "화/목, 18:30~19:20",
      target: "인터넷 20명 / 방문 0명",
      fee: "100,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.02 ~ 26.01.06",
      category: "문화예술"
    },
    {
      id: 20,
      title: "댄스스포츠 중급(자이브)",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "26.1.6.~26.2.26.",
      time: "화/목, 19:30~20:20",
      target: "인터넷 20명 / 방문 0명",
      fee: "100,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.02 ~ 26.01.06",
      category: "문화예술"
    },
    {
      id: 21,
      title: "권경숙의 명품 노래교실",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "26.1.6.~26.3.31.",
      time: "화, 19:00~20:50",
      target: "인터넷 20명 / 방문 0명",
      fee: "70,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.02 ~ 26.01.06",
      category: "문화예술"
    },
    {
      id: 22,
      title: "통기타 : 초급",
      institution: "대전과학기술대학교 부설 평생교육원",
      period: "25.12.30.~26.2.24.",
      time: "화, 19:00~20:30",
      target: "인터넷 10명 / 방문 0명",
      fee: "60,000원",
      status: "접수중",
      statusType: "active",
      regPeriod: "25.12.02 ~ 25.12.30",
      category: "문화예술"
    }
  ];

  const [viewType, setViewType] = useState<'list' | 'card'>('list');

  return (
    <Layout>
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">평생학습 강좌 (다모아)</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            대전의 모든 평생교육 강좌를 한눈에 검색하고 신청하세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search & Filter Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="지역 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="dong">동구</SelectItem>
                <SelectItem value="jung">중구</SelectItem>
                <SelectItem value="seo">서구</SelectItem>
                <SelectItem value="yuseong">유성구</SelectItem>
                <SelectItem value="daedeok">대덕구</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="분야 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="humanities">인문교양</SelectItem>
                <SelectItem value="culture">문화예술</SelectItem>
                <SelectItem value="job">직업능력</SelectItem>
                <SelectItem value="citizen">시민참여</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="대상 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="adult">성인</SelectItem>
                <SelectItem value="senior">어르신</SelectItem>
                <SelectItem value="child">유아/아동</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="접수상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="ing">접수중</SelectItem>
                <SelectItem value="end">마감</SelectItem>
                <SelectItem value="pre">접수예정</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Input placeholder="강좌명 또는 기관명을 입력하세요" className="flex-1" />
            <Button className="w-32"><Search className="w-4 h-4 mr-2" /> 검색</Button>
          </div>
        </div>

        {/* List Header & Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-600">
            총 <span className="font-bold text-primary">{courses.length}</span>건의 강좌가 있습니다.
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewType === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewType('list')}
            >
              리스트형
            </Button>
            <Button 
              variant={viewType === 'card' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewType('card')}
            >
              카드형
            </Button>
          </div>
        </div>

        {/* Course List */}
        {viewType === 'list' ? (
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow border-slate-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Left Status Bar */}
                  <div className={`w-full md:w-2 bg-slate-100 
                    ${course.statusType === 'active' ? 'bg-blue-500' : 
                      course.statusType === 'closed' ? 'bg-slate-400' : 'bg-green-500'}`
                  } />
                  
                  <div className="p-6 flex-1 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-slate-500 border-slate-200 font-normal">
                          {course.category}
                        </Badge>
                        <Badge className={`
                          ${course.statusType === 'active' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 
                            course.statusType === 'closed' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 
                            'bg-green-100 text-green-700 hover:bg-green-200'} border-none
                        `}>
                          {course.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 hover:text-primary cursor-pointer">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" /> {course.institution}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600 min-w-[300px]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>기간: {course.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>일시: {course.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>모집: {course.target}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">{course.fee}</span>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-2 justify-center min-w-[120px]">
                      <Button className="w-full" disabled={course.statusType === 'closed'}>
                        수강신청
                      </Button>
                      <div className="text-xs text-center text-slate-500">
                        접수: {course.regPeriod}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow border-slate-200 flex flex-col h-full">
                <CardContent className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge className={`
                      ${course.statusType === 'active' ? 'bg-blue-100 text-blue-700' : 
                        course.statusType === 'closed' ? 'bg-slate-100 text-slate-600' : 
                        'bg-green-100 text-green-700'} border-none
                    `}>
                      {course.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 h-14">
                    {course.title}
                  </h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{course.institution}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span>{course.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{course.time}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>{course.fee}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-slate-50 border-t border-slate-100">
                  <Button className="w-full" disabled={course.statusType === 'closed'}>
                    상세보기 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50" disabled>&lt;</button>
            <button className="w-9 h-9 flex items-center justify-center rounded bg-primary text-white font-bold">1</button>
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">3</button>
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">&gt;</button>
          </nav>
        </div>
      </div>
    </Layout>
  );
}