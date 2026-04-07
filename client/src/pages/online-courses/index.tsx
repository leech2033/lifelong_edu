import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock, BookOpen, Star, CheckCircle, ArrowRight } from "lucide-react";

export default function OnlineCourses() {
  const courses = [
    {
      id: 1,
      title: "디지털 리터러시: 스마트폰 100% 활용하기",
      instructor: "김철수 강사",
      duration: "4주 (8시간)",
      level: "초급",
      category: "디지털/IT",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 0
    },
    {
      id: 2,
      title: "우리 집 식탁을 바꾸는 건강 요리",
      instructor: "이영희 셰프",
      duration: "6주 (12시간)",
      level: "중급",
      category: "생활/요리",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 25
    },
    {
      id: 3,
      title: "하루 10분, 생활 영어 회화",
      instructor: "박지성 강사",
      duration: "12주 (24시간)",
      level: "초급",
      category: "외국어",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 100
    },
    {
      id: 4,
      title: "초보자를 위한 파이썬 코딩 입문",
      instructor: "정우성 개발자",
      duration: "8주 (16시간)",
      level: "초급",
      category: "디지털/IT",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 0
    },
    {
      id: 5,
      title: "나만의 감성 수채화 그리기",
      instructor: "한가인 작가",
      duration: "5주 (10시간)",
      level: "초급",
      category: "문화예술",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 0
    },
    {
      id: 6,
      title: "성공적인 노후를 위한 자산관리",
      instructor: "백종원 전문가",
      duration: "3주 (6시간)",
      level: "중급",
      category: "재테크",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      progress: 60
    }
  ];

  return (
    <Layout>
      <div className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-blue-500 hover:bg-blue-600 border-none text-white">Online Learning</Badge>
            <h1 className="text-4xl font-bold mb-6">온라인 강좌</h1>
            <p className="text-slate-300 text-lg mb-8">
              언제 어디서나 자유롭게 학습하세요. 다양한 분야의 전문가들이 준비한 고품질 강좌를 만나보세요.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                <PlayCircle className="mr-2 h-5 w-5" /> 학습 시작하기
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white">
                강좌 둘러보기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="all" className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-900">추천 강좌</h2>
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="it">디지털/IT</TabsTrigger>
              <TabsTrigger value="art">문화예술</TabsTrigger>
              <TabsTrigger value="lang">외국어</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-slate-200">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" className="rounded-full">
                        <PlayCircle className="mr-2 h-4 w-4" /> 미리보기
                      </Button>
                    </div>
                    {course.progress === 100 && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> 수강완료
                      </div>
                    )}
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                        <div className="h-full bg-blue-500" style={{ width: `${course.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="font-normal text-slate-500">{course.category}</Badge>
                      <div className="flex items-center text-yellow-500 text-xs font-bold">
                        <Star className="w-3 h-3 fill-current mr-1" /> {course.rating}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">{course.instructor}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {course.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" /> {course.level}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full group-hover:bg-blue-600">
                      {course.progress > 0 ? '이어보기' : '수강신청'} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-slate-200">
          <div className="text-center p-6 rounded-2xl bg-slate-50">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              PC
            </div>
            <h3 className="font-bold text-lg mb-2">언제 어디서나</h3>
            <p className="text-slate-600 text-sm">PC, 모바일, 태블릿 등<br/>모든 기기에서 수강 가능</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-50">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              Q
            </div>
            <h3 className="font-bold text-lg mb-2">1:1 학습 질문</h3>
            <p className="text-slate-600 text-sm">궁금한 점은 언제든지<br/>강사님께 질문하세요</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-slate-50">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              C
            </div>
            <h3 className="font-bold text-lg mb-2">수료증 발급</h3>
            <p className="text-slate-600 text-sm">강좌 완강 시<br/>공식 수료증 발급</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}