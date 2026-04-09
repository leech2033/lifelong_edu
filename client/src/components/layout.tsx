import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Bell, Globe, Phone } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const enableInternalPages = import.meta.env.VITE_ENABLE_INTERNAL_PAGES === "true";

  const navItems = [
    {
      title: "다모아",
      href: "/damoa",
      children: [
        { title: "평생학습강좌", href: "/damoa" },
        { title: "강좌검색", href: "/damoa?tab=search" },
        { title: "수강신청안내", href: "/damoa?tab=guide" },
      ],
    },
    {
      title: "온라인 강좌",
      href: "/online",
      children: [
        { title: "전체 강좌", href: "/online" },
        { title: "주제별 강좌", href: "/online" },
      ],
    },
    {
      title: "공모사업",
      href: "/contests",
      children: [
        { title: "전체 공모사업", href: "/contests" },
        { title: "분야별 공모", href: "/contests?filter=field" },
        { title: "응모 대상자별", href: "/contests?filter=target" },
        { title: "시상 형태별", href: "/contests?filter=award" },
        { title: "주최 기관별", href: "/contests?filter=host" },
      ],
    },
    {
      title: "평생교육기관",
      href: "/institutions?region=daejeon",
      children: [
        { title: "지역별 기관 보기", href: "/institutions?region=daejeon&view=grid" },
        { title: "전체 기관 목록", href: "/institutions?region=all&view=list" },
        { title: "기관 지도 보기", href: "/institutions?region=daejeon&view=map" },
        { title: "웹크롤링 임시 페이지", href: "/institutions/crawl-temp" },
        { title: "기관 상세", href: "/institutions/detail/1" },
      ],
    },
    {
      title: "컨설팅",
      href: "#",
      children: [
        { title: "사업신청", href: "/application" },
        { title: "지정기관 공간", href: "/dashboard" },
        { title: "우수사례", href: "/performance/best-practices" },
        { title: "사진·영상", href: "/performance/media" },
        { title: "성과집", href: "/performance/books" },
      ],
    },
    {
      title: "자료실",
      href: "/resources",
      children: [
        { title: "공지문", href: "/resources?tab=notices" },
        { title: "설명회 자료", href: "/resources?tab=briefings" },
        { title: "서식", href: "/resources?tab=forms" },
        { title: "홍보자료", href: "/resources?tab=pr" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <div className="bg-slate-50 border-b border-slate-200 py-2 text-xs text-slate-600 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              관련 사이트 바로가기
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              고객센터 1588-0000
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-primary hover:underline">
              로그인
            </Link>
            <Link href="/register" className="hover:text-primary hover:underline">
              회원가입
            </Link>
            <Link href="/sitemap" className="hover:text-primary hover:underline">
              사이트맵
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 mr-8">
            <div className="bg-primary text-primary-foreground h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
              L
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl leading-none text-slate-900 tracking-tight">평생교육</span>
              <span className="text-xs font-medium text-slate-500 tracking-widest uppercase">Platform</span>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger
                      className="text-base font-medium h-12 bg-transparent hover:bg-slate-50 data-[state=open]:bg-slate-50"
                      onClick={() => {
                        if (item.href) {
                          setLocation(item.href);
                        }
                      }}
                    >
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.children
                          .filter((child) => enableInternalPages || child.href !== "/dashboard")
                          .map((child) => (
                            <li key={child.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                                >
                                  <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                    {child.title}
                                  </div>
                                  <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                    {child.title} 페이지로 이동합니다.
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="통합검색"
                className="w-48 pl-9 h-9 bg-slate-50 border-slate-200 focus:w-64 transition-all duration-300 rounded-full"
              />
            </div>
            <Button size="icon" variant="ghost" className="text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20">
              사업신청
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground h-8 w-8 rounded-md flex items-center justify-center font-bold text-lg">
                L
              </div>
              <span>전체메뉴</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <div key={item.title} className="space-y-3">
                <h4 className="font-bold text-lg text-slate-900 border-b pb-2">{item.title}</h4>
                <ul className="grid grid-cols-1 gap-2">
                  {item.children
                    .filter((child) => enableInternalPages || child.href !== "/dashboard")
                    .map((child) => (
                      <li key={child.title}>
                        <Link
                          href={child.href}
                          className="text-slate-600 hover:text-primary py-1 block text-sm"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          - {child.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white text-slate-900 h-8 w-8 rounded flex items-center justify-center font-bold">L</div>
                <span className="font-bold text-xl text-white">평생교육 통합지원시스템</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                모든 국민이 언제 어디서나 원하는 교육을 받을 수 있도록
                <br />
                평생교육기관과 학습자를 연결하는 열린 플랫폼입니다.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">바로가기</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/institutions" className="hover:text-white transition-colors">평생교육기관 찾기</Link></li>
                <li><Link href="/contests" className="hover:text-white transition-colors">공모사업 안내</Link></li>
                <li><Link href="/application" className="hover:text-white transition-colors">사업신청</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">문의처</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 opacity-70" /> 1588-0000</li>
                <li className="text-slate-500 text-xs mt-2">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <div className="flex gap-4 mb-4 md:mb-0">
              <a href="#" className="hover:text-white">이용약관</a>
              <a href="#" className="hover:text-white font-bold">개인정보처리방침</a>
              <a href="#" className="hover:text-white">이메일무단수집거부</a>
              <a href="#" className="hover:text-white">웹접근성정책</a>
            </div>
            <p>Copyright 2024 Lifelong Education Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
