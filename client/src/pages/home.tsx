import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PlayCircle, Search, MonitorPlay, HeartHandshake, ExternalLink, User, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import { onlineLectures } from "@/data/onlineLectures";
import { localPrograms } from "@/data/localPrograms";

export default function Home() {
  // Get latest 4 items
  const recentOnline = onlineLectures.slice(0, 4);
  const recentLocal = localPrograms.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-10 duration-700 fade-in">
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6 text-white tracking-tight">
              시니어를 위한 <span className="text-primary">배움</span>과 <span className="text-green-400">나눔</span><br />
              통합 플랫폼
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-12 leading-relaxed font-light">
              시니어를 위한 온라인 강좌와 지역 복지 프로그램을<br/>
              한 번에 찾아보는 통합 플랫폼입니다.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="/online">
                <div className="group bg-white hover:bg-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center border border-slate-200 hover:border-blue-300">
                  <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MonitorPlay className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700">시니어 온라인 강좌</h3>
                  <p className="text-slate-500 text-sm group-hover:text-slate-600">유튜브 등 다양한 영상 강좌 모음</p>
                </div>
              </Link>
              
              <Link href="/local">
                <div className="group bg-white hover:bg-green-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col items-center justify-center border border-slate-200 hover:border-green-300">
                  <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HeartHandshake className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-700">지역 복지 프로그램</h3>
                  <p className="text-slate-500 text-sm group-hover:text-slate-600">우리 동네 복지관/지자체 프로그램</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Online Courses Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">온라인 강좌</Badge>
              <h2 className="text-3xl font-bold text-slate-900">최신 온라인 강좌</h2>
              <p className="text-slate-600 mt-2">시니어를 위한 맞춤형 영상 콘텐츠를 만나보세요.</p>
            </div>
            <Link href="/online">
              <Button variant="ghost" className="text-slate-500 hover:text-primary">
                전체보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentOnline.map((course) => (
              <Link key={course.id} href={`/online/${course.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 group overflow-hidden">
                  <div className="relative aspect-video overflow-hidden bg-slate-200">
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                      {course.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> {course.platform}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {course.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Local Welfare Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Badge className="mb-2 bg-green-100 text-green-700 hover:bg-green-200 border-none">지역 복지</Badge>
              <h2 className="text-3xl font-bold text-slate-900">우리 동네 복지 프로그램</h2>
              <p className="text-slate-600 mt-2">내 집 가까운 곳에서 누리는 다양한 혜택</p>
            </div>
            <Link href="/local">
              <Button variant="ghost" className="text-slate-500 hover:text-green-600 hover:bg-green-50">
                전체보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentLocal.map((program) => (
              <Link key={program.id} href={`/local/${program.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 group hover:border-green-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="font-normal text-slate-500 bg-slate-50">
                        {program.region}
                      </Badge>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        program.operationType === '오프라인' ? 'bg-orange-100 text-orange-700' :
                        program.operationType === '온라인' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {program.operationType}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {program.programName}
                    </h3>
                    <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {program.organizationName}
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{program.target}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{program.schedule}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] transform translate-x-1/4" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">배움에는 나이가 없습니다</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
            지금 바로 시작해보세요. 당신의 새로운 도전을 응원합니다.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/online">
              <Button size="lg" className="h-14 px-8 rounded-full font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                온라인 강좌 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
