import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Globe, Clock, Users, Award, Share2, Printer, Heart, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import { buildInstitutionDetail, getInstitutionById } from "@/data/institutionCatalog";

export default function InstitutionDetail() {
  const [, params] = useRoute("/institutions/detail/:id");
  const id = params?.id || "1";
  const institution =
    buildInstitutionDetail(getInstitutionById(id)) || {
      id,
      name: "기관 정보 준비중",
      category: "기관 상세",
      region: "전국",
      address: "상세 주소 정보 준비중",
      phone: "문의처 정보 준비중",
      website: "",
      status: "정보 준비중",
      description:
        "해당 기관은 전국 단위 데이터 통합 과정에 포함되어 있으며, 현재 상세 정보 구조를 순차적으로 정비하고 있습니다.",
      operatingHours: "운영시간 정보 준비중",
      established: "정보 준비중",
      facilities: ["정보 업데이트 예정"],
      images: [],
      programs: [{ name: "기관 프로그램 정보 업데이트 예정", status: "준비중", type: "안내" }],
    };

  return (
    <Layout>
      <div className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="container mx-auto px-4">
          <Link href="/institutions" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> 목록으로 돌아가기
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">{institution.category}</Badge>
                <Badge variant="outline" className="text-slate-500 border-slate-300">{institution.status}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{institution.name}</h1>
              <p className="text-slate-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {institution.address}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 aspect-video relative group">
              {institution.images[0] ? (
                <>
                  <img 
                    src={institution.images[0]} 
                    alt={institution.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Award className="h-3 w-3" /> 대표 이미지
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>등록된 대표 이미지가 없습니다.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                기관 소개
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {institution.description}
              </p>
            </section>

            <Separator />

            {/* Facilities */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                보유 시설
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {institution.facilities.map((facility, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100 hover:border-primary/30 transition-colors">
                    <span className="font-medium text-slate-700">{facility}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Map */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                찾아오시는 길
              </h2>
              <div className="bg-slate-100 h-[300px] rounded-xl border border-slate-200 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>지도 API 연동 영역</p>
                  <p className="text-sm">{institution.address}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-md">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">기관 정보</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">전화번호</p>
                    <p className="text-slate-900">{institution.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">홈페이지</p>
                    {institution.website ? (
                      <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block w-48">
                        {institution.website}
                      </a>
                    ) : (
                      <p className="text-slate-500">정보 준비중</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">운영시간</p>
                    <p className="text-slate-900">{institution.operatingHours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">설립일</p>
                    <p className="text-slate-900">{institution.established}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-md overflow-hidden">
              <div className="bg-primary p-4 text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  운영중인 강좌
                </h3>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {institution.programs.map((program, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">{program.type}</div>
                        <div className="font-medium text-slate-900">{program.name}</div>
                      </div>
                      <Badge variant={program.status === "접수중" ? "default" : "secondary"}>
                        {program.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <Button variant="link" className="text-primary p-0 h-auto">전체 강좌 보기</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
