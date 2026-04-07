import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Phone, Globe, Star, Filter, List, Map as MapIcon, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { allInstitutions as nationwideInstitutions } from "@/data/institutionsNationwide";
import { institutionRegions } from "@/data/institutionRegions";

const allInstitutions = nationwideInstitutions;

const regions = institutionRegions;

export default function Institutions() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [selectedRegionId, setSelectedRegionId] = useState("daejeon");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sync URL query params with state
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const regionParam = searchParams.get("region");
    const viewParam = searchParams.get("view");
    
    if (regionParam) {
      if (regionParam === "all") {
         // Handle "All Institutions"
         if (!viewParam) setViewMode("list");
      } else if (regions.some(r => r.id === regionParam)) {
        setSelectedRegionId(regionParam);
        // Default to grid view for specific regions if not specified
        if (!viewParam) setViewMode("grid");
      }
    }
    
    if (viewParam) {
      if (viewParam === "map") setViewMode("map");
      else if (viewParam === "list" || viewParam === "table") setViewMode("list");
      else if (viewParam === "grid") setViewMode("grid");
    }
  }, [location, search]);
  
  const selectedRegionName = regions.find(r => r.id === selectedRegionId)?.name || "";

  const filteredInstitutions = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    const regionParam = searchParams.get("region");
    
    let baseList: typeof allInstitutions = [];
    if (regionParam === "all") {
      baseList = allInstitutions;
    } else if (selectedRegionId) {
      baseList = allInstitutions.filter((inst) => inst.regionId === selectedRegionId);
    }
    
    if (!searchQuery) return baseList;
    
    return baseList.filter(inst => 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inst.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.tags && inst.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [selectedRegionName, search, searchQuery]);

  return (
    <Layout>
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">?됱깮援먯쑁湲곌? 李얘린</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            ?꾧뎅 17媛??쒕룄???됱깮援먯쑁湲곌? ?뺣낫瑜??뺤씤?섍퀬, ?섏뿉寃?留욌뒗 援먯쑁 ?꾨줈洹몃옩??李얠븘蹂댁꽭??
          </p>
        </div>
      </div>

      {/* Region Navigation Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Desktop Region List */}
          <div className="hidden md:flex justify-center overflow-x-auto py-4 no-scrollbar">
            <div className="flex space-x-1">
              <Button
                 variant="ghost"
                 onClick={() => setLocation("/institutions?region=all&view=list")}
                 className={cn(
                   "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                   new URLSearchParams(search).get("region") === "all"
                     ? "bg-slate-900 text-white shadow-md hover:bg-slate-800 hover:text-white"
                     : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                 )}
              >
                ?꾩껜蹂닿린
              </Button>
              <div className="w-px h-6 bg-slate-200 mx-2 self-center" />
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    setSelectedRegionId(region.id);
                    setViewMode("grid");
                    setLocation(`/institutions?region=${region.id}&view=grid`);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    selectedRegionId === region.id && new URLSearchParams(search).get("region") !== "all"
                      ? "bg-primary text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {/* @ts-ignore - displayName is optional */}
                  {region.displayName || region.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Region Select */}
          <div className="md:hidden py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-white">
                  {selectedRegionName}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(100vw-2rem)] max-h-[300px] overflow-y-auto">
                {regions.map((region) => (
                  <DropdownMenuItem 
                    key={region.id}
                    onClick={() => {
                      setSelectedRegionId(region.id);
                      setViewMode("grid");
                      setLocation(`/institutions?region=${region.id}&view=grid`);
                    }}
                    className={cn("justify-center py-3", selectedRegionId === region.id && "bg-slate-100 font-bold")}
                  >
                    {region.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder={
                  new URLSearchParams(search).get("region") === "all"
                    ? "전체 기관명 또는 주소 검색"
                    : `${selectedRegionName} 기관명 또는 주소 검색`
                }
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-11 font-semibold text-base">검색하기</Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-sm font-medium text-slate-500 mr-2">인기 태그:</span>
            {["평생교육", "직업능력", "문화예술", "인문교양", "주민참여", "디지털교육"].map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                onClick={() => setSearchQuery(tag)}
                className="cursor-pointer hover:bg-secondary/80 px-3 py-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* View Toggle & Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 font-medium">
            <span className="font-bold text-slate-900">{new URLSearchParams(search).get("region") === "all" ? "?꾩껜" : selectedRegionName}</span> 寃?됯껐怨? 珥?<span className="text-primary font-bold">{filteredInstitutions.length}</span>嫄?          </p>
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
            <Button 
              variant={viewMode === 'grid' ? "outline" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? "shadow-sm bg-white border-slate-200" : "text-slate-500 border-transparent"}
              title="移대뱶??蹂닿린"
            >
              <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                <div className="bg-current rounded-[1px]"></div>
                <div className="bg-current rounded-[1px]"></div>
                <div className="bg-current rounded-[1px]"></div>
                <div className="bg-current rounded-[1px]"></div>
              </div>
              <span className="ml-2 hidden sm:inline">移대뱶</span>
            </Button>
            <Button 
              variant={viewMode === 'list' ? "outline" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? "shadow-sm bg-white border-slate-200" : "text-slate-500 border-transparent"}
              title="由ъ뒪?명삎 蹂닿린"
            >
              <List className="h-4 w-4 mr-2" /> 紐⑸줉
            </Button>
            <Button 
              variant={viewMode === 'map' ? "outline" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? "shadow-sm bg-white border-slate-200" : "text-slate-500 border-transparent"}
              title="吏??蹂닿린"
            >
              <MapIcon className="h-4 w-4 mr-2" /> 吏??            </Button>
          </div>
        </div>

        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((inst) => (
                <Card key={inst.id} className="group hover:border-primary/50 transition-all hover:shadow-lg duration-300">
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {/* Institution Image */}
                    {(inst as any).image ? (
                      <img 
                        src={(inst as any).image} 
                        alt={inst.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-300 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-slate-400 opacity-50" />
                      </div>
                    )}
                    <Button size="icon" variant="secondary" className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm text-slate-400 hover:text-yellow-500">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-xs text-primary font-bold mb-2 uppercase tracking-wide">{inst.detail_region}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-1" title={inst.name}>
                      <Link href={`/institutions/detail/${inst.id}`}>{inst.name}</Link>
                    </h3>
                    <div className="space-y-2 text-sm text-slate-500 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{inst.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{inst.phone}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inst.tags && inst.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="font-normal text-slate-500"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 border-t border-slate-50 mt-4 bg-slate-50/50">
                    <div className="w-full flex justify-between items-center mt-4">
                      <span className="text-xs text-slate-400">理쒓렐 ?낅뜲?댄듃: 2025.01.02</span>
                      <Button variant="link" className="p-0 h-auto text-primary font-semibold" asChild>
                        <Link href={`/institutions/detail/${inst.id}`}>?곸꽭蹂닿린</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <MapPin className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">?깅줉??湲곌????놁뒿?덈떎</h3>
                <p className="text-slate-500">
                  해당 지역({selectedRegionName})에는 현재 등록된 기관 데이터가 없습니다.
                  <br />
                  전국 기관 수집 범위를 기준으로 순차적으로 데이터를 보완하고 있습니다.
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && (
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             {/* Board Header */}
             <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {new URLSearchParams(search).get("region") === "all" ? "?꾩껜 湲곌? 紐⑸줉" : `${selectedRegionName} 湲곌? 紐⑸줉`}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">珥?{filteredInstitutions.length}媛쒖쓽 湲곌????깅줉?섏뼱 ?덉뒿?덈떎.</p>
                </div>
                <div className="flex gap-2">
                   <Select defaultValue="10">
                     <SelectTrigger className="w-[120px] h-9 bg-white">
                       <SelectValue placeholder="10媛쒖뵫 蹂닿린" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="10">10媛쒖뵫 蹂닿린</SelectItem>
                       <SelectItem value="20">20媛쒖뵫 蹂닿린</SelectItem>
                       <SelectItem value="50">50媛쒖뵫 蹂닿린</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
             </div>

             {/* Board Table */}
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left border-collapse">
                 <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-y border-slate-200">
                   <tr>
                     <th className="px-6 py-4 font-bold text-center w-[80px]">踰덊샇</th>
                     <th className="px-6 py-4 font-bold text-center w-[120px]">지역</th>
                     <th className="px-6 py-4 font-bold">기관명</th>
                     <th className="px-6 py-4 font-bold">二쇱냼</th>
                     <th className="px-6 py-4 font-bold w-[140px]">연락처</th>
                     <th className="px-6 py-4 font-bold text-center w-[100px]">?곹깭</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredInstitutions.length > 0 ? (
                     filteredInstitutions.map((inst, index) => (
                       <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors group">
                         <td className="px-6 py-4 text-center text-slate-500 font-mono text-xs">
                           {filteredInstitutions.length - index}
                         </td>
                         <td className="px-6 py-4 text-center font-medium text-slate-500 whitespace-nowrap">
                           <Badge variant="outline" className="font-normal bg-white border-slate-200 text-slate-600">
                             {inst.detail_region.split(" ")[1] || inst.detail_region}
                           </Badge>
                         </td>
                         <td className="px-6 py-4 font-bold text-slate-900">
                           <Link href={`/institutions/detail/${inst.id}`} className="group-hover:text-primary hover:underline block mb-1 text-base">
                             {inst.name}
                           </Link>
                           <div className="flex gap-1">
                            {inst.tags && inst.tags.slice(0, 2).map((tag: string, idx: number) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border bg-slate-100 text-slate-500 border-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                         </td>
                         <td className="px-6 py-4 text-slate-600 max-w-[300px]" title={inst.address}>
                           <div className="line-clamp-1 flex items-center gap-1">
                             <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                             {inst.address}
                           </div>
                         </td>
                         <td className="px-6 py-4 text-slate-600 whitespace-nowrap font-mono text-xs">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {inst.phone}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center whitespace-nowrap">
                           <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-0.5">
                             {inst.status}
                           </Badge>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={6} className="px-6 py-16 text-center text-slate-500 bg-slate-50/30">
                         <div className="flex flex-col items-center justify-center">
                           <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                             <Search className="h-6 w-6 text-slate-400" />
                           </div>
                           <p className="font-medium text-slate-900">?깅줉??湲곌????놁뒿?덈떎.</p>
                           <p className="text-xs text-slate-500 mt-1">寃??議곌굔??蹂寃쏀븯嫄곕굹 ?ㅻⅨ 吏??쓣 ?좏깮?댁＜?몄슂.</p>
                         </div>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>

             {/* Pagination Mockup */}
             {filteredInstitutions.length > 0 && (
               <div className="p-4 border-t border-slate-200 flex justify-center items-center gap-1 bg-slate-50/30">
                 <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                   <span className="sr-only">?댁쟾 ?섏씠吏</span>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 </Button>
                 <Button variant="outline" size="sm" className="h-8 w-8 bg-primary text-white border-primary hover:bg-primary hover:text-white">1</Button>
                 <Button variant="ghost" size="sm" className="h-8 w-8">2</Button>
                 <Button variant="ghost" size="sm" className="h-8 w-8">3</Button>
                 <Button variant="ghost" size="sm" className="h-8 w-8">4</Button>
                 <Button variant="ghost" size="sm" className="h-8 w-8">5</Button>
                 <Button variant="outline" size="icon" className="h-8 w-8">
                   <span className="sr-only">?ㅼ쓬 ?섏씠吏</span>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                 </Button>
               </div>
             )}
           </div>
        )}

        {viewMode === 'map' && (
          <div className="h-[700px] w-full bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden shadow-inner">
            <img 
              src="/images/daejeon_map_preview.png" 
              alt="Institution Map View" 
              className="w-full h-full object-cover"
            />
            
            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
               <div className="bg-white p-1 rounded shadow-md flex flex-col border border-slate-200">
                 <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100"><span className="text-lg font-bold">+</span></Button>
                 <div className="h-px bg-slate-200 mx-1" />
                 <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100"><span className="text-lg font-bold">-</span></Button>
               </div>
                <Button variant="secondary" size="sm" className="shadow-md bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 font-medium">
                  <MapIcon className="h-4 w-4 mr-2" /> 현재 지도에서 검색
                </Button>
            </div>

            {/* Map Legend/Info Overlay */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 max-w-xs">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {selectedRegionName} 二쇱슂 湲곌?
              </h4>
              <p className="text-xs text-slate-500 mb-3">지도에 표시된 기관: {filteredInstitutions.length}개</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-blue-500 block"></span>
                  <span>怨듦났湲곌? (援ъ껌/二쇰??쇳꽣)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                  <span>?됱깮?숈뒿愿/?쇳꽣</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-orange-500 block"></span>
                  <span>誘쇨컙 援먯쑁湲곌?</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="w-full md:w-auto min-w-[200px]">더보기</Button>
        </div>
      </div>
    </Layout>
  );
}

