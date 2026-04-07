import Layout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Image as ImageIcon, Calendar, Eye } from "lucide-react";

export default function PerformanceMedia() {
  const mediaItems = [
    {
      id: 1,
      type: "image",
      title: "2024년 어린이 평생학습 체험 현장",
      date: "2024.05.15",
      views: 128,
      image: "/images/performance_child_1.jpg",
      category: "현장스케치"
    },
    {
      id: 2,
      type: "image",
      title: "창의력 쑥쑥! 놀이 학습 프로그램",
      date: "2024.06.20",
      views: 85,
      image: "/images/performance_child_2.jpg",
      category: "교육활동"
    },
    {
      id: 3,
      type: "video",
      title: "2023년 평생학습 성과공유회 하이라이트",
      date: "2023.12.10",
      views: 450,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "행사영상"
    },
    {
      id: 4,
      type: "image",
      title: "시니어 스마트폰 교육 수료식",
      date: "2024.04.05",
      views: 210,
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "수료식"
    },
    {
      id: 5,
      type: "image",
      title: "주말 가족 요리 교실",
      date: "2024.03.15",
      views: 156,
      image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "프로그램"
    },
    {
      id: 6,
      type: "video",
      title: "평생학습 동아리 경연대회",
      date: "2023.11.20",
      views: 320,
      image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "경연대회"
    }
  ];

  return (
    <Layout>
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">사진·영상</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            평생학습의 생생한 현장을 사진과 영상으로 만나보세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-8 gap-2">
          <Badge variant="default" className="px-4 py-2 text-sm cursor-pointer bg-slate-900 hover:bg-slate-800">전체</Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100">행사영상</Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100">현장스케치</Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100">교육활동</Badge>
        </div>

        {/* Media Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 cursor-pointer">
              <div className="relative aspect-video bg-slate-200 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  {item.type === 'video' && (
                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={`${item.type === 'video' ? 'bg-red-500' : 'bg-blue-500'} text-white border-none`}>
                    {item.type === 'video' ? 'VIDEO' : 'PHOTO'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="text-primary font-bold">{item.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center text-xs text-slate-400">
                  <Eye className="h-3 w-3 mr-1" /> 조회수 {item.views}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50" disabled>&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">&gt;</button>
          </nav>
        </div>
      </div>
    </Layout>
  );
}