import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Search, ExternalLink, MapPin, Building, CheckCircle, MonitorPlay, HeartHandshake } from "lucide-react";
import { Link, useLocation } from "wouter";
import { onlineLectures } from "@/data/onlineLectures";
import { localPrograms } from "@/data/localPrograms";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OnlineLectureList() {
  // State for Online Lectures
  const [onlineCategory, setOnlineCategory] = useState("all");
  const [onlineSearchTerm, setOnlineSearchTerm] = useState("");

  // State for Local Programs
  const [localRegion, setLocalRegion] = useState("all");
  const [localType, setLocalType] = useState("all");
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Filter Logic for Online Lectures
  const filteredLectures = onlineLectures.filter(lecture => {
    const matchesCategory = onlineCategory === "all" || lecture.category === onlineCategory;
    const matchesSearch = lecture.title.toLowerCase().includes(onlineSearchTerm.toLowerCase()) || 
                          lecture.description.toLowerCase().includes(onlineSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onlineCategories = [
    { id: "all", label: "전체" },
    { id: "의", label: "의 (옷/스타일)" },
    { id: "식", label: "식 (요리/건강식)" },
    { id: "주", label: "주 (주거/안전)" },
    { id: "건강운동", label: "건강·운동" },
    { id: "정서취미", label: "정서·취미" }
  ];

  // Filter Logic for Local Programs
  const filteredPrograms = localPrograms.filter(program => {
    const matchesRegion = localRegion === "all" || program.region === localRegion;
    const matchesType = localType === "all" || program.operationType === localType;
    const matchesSearch = program.programName.toLowerCase().includes(localSearchTerm.toLowerCase()) || 
                          program.organizationName.toLowerCase().includes(localSearchTerm.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 border-b border-blue-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">시니어 배움터</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            온라인 강좌와 지역 복지 프로그램을 한곳에서 만나보세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="online" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-14 p-1 bg-slate-100 rounded-full">
              <TabsTrigger value="online" className="rounded-full text-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
                <MonitorPlay className="w-5 h-5 mr-2" /> 온라인 강좌
              </TabsTrigger>
              <TabsTrigger value="local" className="rounded-full text-lg data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm transition-all">
                <HeartHandshake className="w-5 h-5 mr-2" /> 지역 복지
              </TabsTrigger>
            </TabsList>
          </div>

          {/* --- Online Lectures Tab Content --- */}
          <TabsContent value="online" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-wrap justify-center gap-2">
                {onlineCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={onlineCategory === cat.id ? "default" : "outline"}
                    onClick={() => setOnlineCategory(cat.id)}
                    className={`rounded-full px-6 py-2 h-auto text-lg transition-all ${
                      onlineCategory === cat.id 
                        ? "bg-blue-600 hover:bg-blue-700 shadow-md transform scale-105" 
                        : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              
              <div className="w-full max-w-xl relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="영상 제목이나 내용을 검색해보세요" 
                  className="pl-12 h-12 text-lg rounded-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  value={onlineSearchTerm}
                  onChange={(e) => setOnlineSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredLectures.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLectures.map((lecture) => (
                  <Card key={lecture.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group flex flex-col h-full hover:-translate-y-1">
                    <div 
                      className={`relative aspect-video bg-slate-100 overflow-hidden ${lecture.id === "1" || lecture.id === "2" ? "cursor-pointer" : ""}`}
                      onClick={() => {
                        if (lecture.id === "1") {
                          window.open("https://www.youtube.com/watch?v=lTqx-oDq4D8", "_blank");
                        } else if (lecture.id === "2") {
                          window.open("https://youtu.be/AsZVWppIwuM?si=-9D2_zxoqJRhLt3R", "_blank");
                        }
                      }}
                    >
                      <img 
                        src={lecture.thumbnailUrl} 
                        alt={lecture.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm font-medium">
                        {lecture.category}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle className="w-16 h-16 text-white drop-shadow-lg transform group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {lecture.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <h3 
                          className={`text-xl font-bold mb-2 line-clamp-2 transition-colors ${lecture.id === "1" || lecture.id === "2" ? "text-blue-600 cursor-pointer hover:underline" : "text-slate-900 group-hover:text-blue-600"}`}
                          onClick={() => {
                            if (lecture.id === "1") {
                              window.open("https://www.youtube.com/watch?v=lTqx-oDq4D8", "_blank");
                            } else if (lecture.id === "2") {
                              window.open("https://youtu.be/AsZVWppIwuM?si=-9D2_zxoqJRhLt3R", "_blank");
                            }
                          }}
                        >
                          {lecture.title}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
                          {lecture.description}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-xs text-blue-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> 이런 분께 추천해요
                        </p>
                        <p className="text-sm text-slate-700 mt-1">
                          {lecture.helpfulFor}
                        </p>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        {lecture.id === "1" || lecture.id === "2" ? (
                          <Button 
                            className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-lg h-12 shadow-md hover:shadow-lg transition-all"
                            onClick={() => {
                              if (lecture.id === "1") window.open("https://www.youtube.com/watch?v=lTqx-oDq4D8", "_blank");
                              if (lecture.id === "2") window.open("https://youtu.be/AsZVWppIwuM?si=-9D2_zxoqJRhLt3R", "_blank");
                            }}
                          >
                            자세히 보기
                          </Button>
                        ) : (
                          <Link href={`/online/${lecture.id}`} className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg h-12 shadow-md hover:shadow-lg transition-all">
                              자세히 보기
                            </Button>
                          </Link>
                        )}
                        <Button variant="outline" className="px-3 border-slate-300 hover:bg-slate-50" onClick={() => window.open(lecture.videoUrl, '_blank')}>
                          <ExternalLink className="h-5 w-5 text-slate-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-xl text-slate-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </TabsContent>

          {/* --- Local Welfare Tab Content --- */}
          <TabsContent value="local" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Select value={localRegion} onValueChange={setLocalRegion}>
                  <SelectTrigger className="h-12 text-lg rounded-xl border-slate-300 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    <SelectItem value="동구">동구</SelectItem>
                    <SelectItem value="중구">중구</SelectItem>
                    <SelectItem value="서구">서구</SelectItem>
                    <SelectItem value="유성구">유성구</SelectItem>
                    <SelectItem value="대덕구">대덕구</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={localType} onValueChange={setLocalType}>
                  <SelectTrigger className="h-12 text-lg rounded-xl border-slate-300 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="운영 방식" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 방식</SelectItem>
                    <SelectItem value="오프라인">오프라인</SelectItem>
                    <SelectItem value="온라인">온라인</SelectItem>
                    <SelectItem value="혼합">혼합</SelectItem>
                    <SelectItem value="방문서비스">방문서비스</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <Input 
                    placeholder="프로그램명 또는 기관명" 
                    className="pl-10 h-12 text-lg rounded-xl border-slate-300 focus:border-green-500 focus:ring-green-500"
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((program) => (
                  <Card key={program.id} className="hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden group hover:border-green-200">
                    <div className="flex flex-col md:flex-row">
                      <div className={`w-full md:w-3 shrink-0 transition-all duration-300
                        ${program.region === '동구' ? 'bg-blue-500 group-hover:w-4' : 
                          program.region === '중구' ? 'bg-green-500 group-hover:w-4' : 
                          program.region === '서구' ? 'bg-yellow-500 group-hover:w-4' : 
                          program.region === '유성구' ? 'bg-purple-500 group-hover:w-4' : 'bg-red-500 group-hover:w-4'}`
                      } />
                      
                      <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-slate-600 border-slate-300 text-sm px-3 py-1 rounded-md">
                              {program.region}
                            </Badge>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-sm px-3 py-1 rounded-md">
                              {program.operationType}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 hover:text-green-700 transition-colors">
                              <Link href={`/local/${program.id}`}>{program.programName}</Link>
                            </h3>
                            <div className="text-slate-500 flex items-center gap-1 font-medium">
                              <Building className="w-4 h-4" /> {program.organizationName}
                            </div>
                          </div>

                          <p className="text-slate-600 line-clamp-2 leading-relaxed">
                            {program.description}
                          </p>

                          <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-500 pt-2">
                            <span className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <CheckCircle className="w-4 h-4 text-green-600" /> {program.target}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center gap-3 min-w-[180px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                          <Link href={`/local/${program.id}`}>
                            <Button className="w-full bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 font-bold h-12 text-lg shadow-sm transition-all">
                              자세히 보기
                            </Button>
                          </Link>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all"
                            onClick={() => window.open(program.homepageUrl, '_blank')}
                          >
                            기관 홈페이지
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <p className="text-xl text-slate-500">조건에 맞는 프로그램이 없습니다.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}