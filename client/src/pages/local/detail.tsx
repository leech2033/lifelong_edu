import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, Globe, Calendar, User, CheckCircle, CalendarPlus } from "lucide-react";
import { Link, useRoute } from "wouter";
import { getLocalProgramById, getSiblingLocalPrograms } from "@/data/catalog";

export default function LocalProgramDetail() {
  const [, params] = useRoute("/local/:id");
  const id = params?.id;
  const program = getLocalProgramById(id);

  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">프로그램을 찾을 수 없습니다.</h2>
          <Link href="/local">
            <Button className="mt-4">목록으로 돌아가기</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const otherPrograms = getSiblingLocalPrograms(program.id, program.organizationName);

  return (
    <Layout>
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-8">
          <Link href="/local">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-green-600 text-slate-500">
              <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로 돌아가기
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-slate-800 hover:bg-slate-900 text-lg px-3 py-1">
              {program.region}
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-600 text-lg px-3 py-1 font-bold">
              {program.operationType}
            </Badge>
            <span className="text-slate-500 font-medium flex items-center gap-1 ml-auto">
              <MapPin className="w-4 h-4" /> {program.organizationName}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
            {program.programName}
          </h1>

          <div className="grid md:grid-cols-3 gap-4 text-lg">
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
              <User className="w-6 h-6 text-slate-400" />
              <span className="font-semibold">대상:</span> {program.target}
            </div>
            <div className="flex items-center gap-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-slate-400" />
              <span className="font-semibold">일정:</span> {program.schedule}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-l-4 border-green-500 pl-4">프로그램 상세 내용</h2>
              <div className="prose prose-lg max-w-none text-slate-700 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <p>{program.description}</p>
                <p className="mt-4 text-slate-500 text-base">
                  * 본 프로그램은 기관 사정에 따라 일정이 변경될 수 있습니다. 자세한 내용은 기관으로 문의해 주세요.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-l-4 border-green-500 pl-4">신청 방법</h2>
              <div className="bg-green-50 p-8 rounded-xl border border-green-100 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">신청 절차</h3>
                    <p className="text-lg text-slate-700 font-medium">{program.applicationMethod}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 text-white h-14 text-lg"
                    onClick={() => window.open(program.homepageUrl, '_blank')}
                  >
                    <Globe className="w-5 h-5 mr-2" /> 기관 홈페이지
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white border-slate-300 h-14 text-lg text-slate-700"
                  >
                    <Phone className="w-5 h-5 mr-2" /> 전화 문의하기
                  </Button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 border-l-4 border-green-500 pl-4">위치 안내</h2>
              <div className="bg-slate-100 rounded-xl h-64 flex items-center justify-center border border-slate-200">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium text-lg">{program.address}</p>
                  <p className="text-sm text-slate-400 mt-1">지도 API 연동 예정</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="text-slate-600">
                  <MapPin className="w-4 h-4 mr-2" /> 지도에서 크게 보기
                </Button>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-4">편의 기능</h3>
              <Button className="w-full mb-3 bg-slate-900 text-white hover:bg-slate-800 h-12">
                <CalendarPlus className="w-5 h-5 mr-2" /> 내 캘린더에 추가
              </Button>
              <p className="text-xs text-slate-500 text-center">
                * 관심 있는 프로그램을 캘린더에 저장하여<br/>일정을 관리해보세요.
              </p>
            </div>

            {otherPrograms.length > 0 && (
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-4">이 기관의 다른 프로그램</h3>
                <div className="space-y-3">
                  {otherPrograms.map(p => (
                    <Link key={p.id} href={`/local/${p.id}`}>
                      <div className="block bg-white p-4 rounded-lg border border-slate-200 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                        <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">{p.programName}</h4>
                        <p className="text-sm text-slate-500">{p.target}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
