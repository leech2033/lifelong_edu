import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Search, Globe, Building, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { localPrograms } from "@/data/localPrograms";
import { useState } from "react";

export default function LocalProgramList() {
  const [region, setRegion] = useState("all");
  const [type, setType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrograms = localPrograms.filter(program => {
    const matchesRegion = region === "all" || program.region === region;
    const matchesType = type === "all" || program.operationType === type;
    const matchesSearch = program.programName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          program.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesType && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-green-50 py-12 border-b border-green-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">지역 복지 프로그램</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            대전 지역 복지관과 지자체에서 제공하는 교육·돌봄·주거안전 프로그램 정보를 모았습니다.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-12 text-lg">
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

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-12 text-lg">
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
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-md transition-shadow border-slate-200 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className={`w-full md:w-3 shrink-0 
                    ${program.region === '동구' ? 'bg-blue-500' : 
                      program.region === '중구' ? 'bg-green-500' : 
                      program.region === '서구' ? 'bg-yellow-500' : 
                      program.region === '유성구' ? 'bg-purple-500' : 'bg-red-500'}`
                  } />
                  
                  <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-slate-600 border-slate-300 text-sm px-2 py-0.5">
                          {program.region}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none text-sm px-2 py-0.5">
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

                      <p className="text-slate-600 line-clamp-2">
                        {program.description}
                      </p>

                      <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" /> {program.target}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <Link href={`/local/${program.id}`}>
                        <Button className="w-full bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold h-12 text-lg">
                          자세히 보기
                        </Button>
                      </Link>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
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
            <div className="text-center py-20 text-slate-500">
              <p className="text-xl">조건에 맞는 프로그램이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}