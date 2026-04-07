import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, Download, ChevronRight, Bell } from "lucide-react";

export default function Resources() {
  return (
    <Layout>
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">자료실</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            사업 운영에 필요한 각종 서식과 안내 자료를 확인하세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="notices" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <TabsList className="grid w-full md:w-auto grid-cols-4 h-12">
              <TabsTrigger value="notices" className="h-10">공고문</TabsTrigger>
              <TabsTrigger value="briefings" className="h-10">설명회 자료</TabsTrigger>
              <TabsTrigger value="forms" className="h-10">서식</TabsTrigger>
              <TabsTrigger value="pr" className="h-10">홍보자료</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="제목 또는 내용 검색" className="pl-9" />
            </div>
          </div>

          <TabsContent value="notices" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className="text-center w-16 flex-shrink-0">
                          <span className="block text-xs text-slate-500 font-bold uppercase">2025</span>
                          <span className="block text-xl font-bold text-slate-900">01.0{i}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {i === 1 && <Badge className="bg-red-500 hover:bg-red-600">중요</Badge>}
                            <Badge variant="outline" className="text-slate-500 font-normal">공고</Badge>
                          </div>
                          <h3 className="text-lg font-medium text-slate-900 group-hover:text-primary transition-colors">
                            2025년도 평생교육 바우처 지원사업 공고
                          </h3>
                          <p className="text-slate-500 text-sm mt-1">
                            교육부 평생직업교육국 | 조회수 1,23{i}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-6 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                          2025년도 사업계획서 양식
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">
                          hwp | 45.2 KB | 2025.01.01
                        </p>
                        <Button variant="outline" size="sm" className="h-8">
                          <Download className="h-3 w-3 mr-2" /> 다운로드
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Placeholder for other tabs */}
          <TabsContent value="briefings" className="py-12 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>등록된 설명회 자료가 없습니다.</p>
          </TabsContent>
          <TabsContent value="pr" className="py-12 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>등록된 홍보자료가 없습니다.</p>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}