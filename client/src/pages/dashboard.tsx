import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Calendar, 
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "대시보드", href: "/dashboard" },
    { icon: FileText, label: "운영일지", href: "/dashboard/log" },
    { icon: Users, label: "출석부 관리", href: "/dashboard/attendance" },
    { icon: BarChart3, label: "성과보고", href: "/dashboard/report" },
    { icon: Settings, label: "기관정보 설정", href: "/dashboard/settings" },
    { icon: ShieldCheck, label: "데이터 검수", href: "/internal/institution-quality" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary h-8 w-8 rounded flex items-center justify-center">L</div>
            <span>기관 전용 공간</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarFallback>EDU</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">강남구 평생학습관</p>
                <p className="text-xs text-slate-400">관리자님</p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="w-full text-xs h-8">
              내 정보 수정
            </Button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location === item.href 
                    ? "bg-primary text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Link href="/">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <LogOut className="h-5 w-5" />
              메인으로 나가기
            </a>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden -ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
              <span className="text-sm text-slate-500">최근 접속: 2025.01.02 14:30</span>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">진행중인 사업</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +1개 심사중
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">오늘 출석률</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    전일 대비 +2.1%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">예산 집행률</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    계획 대비 정상
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    기관 데이터 검수
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-600">
                    전국 기관 카탈로그의 검수 대상과 품질 상태를 내부 페이지에서 확인할 수 있습니다.
                  </p>
                </div>
                <Badge variant="outline" className="bg-white text-slate-700">
                  내부 전용
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild>
                  <Link href="/internal/institution-quality">검수 페이지 열기</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity & Notifications */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>주요 알림</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "1월 운영일지 제출 마감 안내", date: "오늘", type: "urgent" },
                      { title: "2025년도 사업 설명회 개최", date: "어제", type: "normal" },
                      { title: "시스템 점검 안내 (1/5)", date: "2일 전", type: "normal" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        {item.type === 'urgent' ? (
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>오늘의 일정</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-slate-500">14:00</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">디지털 문해교육 3기 개강</p>
                        <p className="text-sm text-slate-500">제2강의실 | 강사: 김철수</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-slate-500">16:00</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">운영위원회 회의</p>
                        <p className="text-sm text-slate-500">회의실</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
