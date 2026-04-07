import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Award, User, MapPin } from "lucide-react";

export default function BestPractices() {
  const practices = [
    {
      id: 1,
      title: "대전광역시 둥지어린이집 우수사례",
      category: "민간지원사업(기본)",
      organization: "대전광역시 둥지어린이집",
      period: "2025.05.07 ~ 2025.10.28",
      location: "대전광역시 둥지어린이집 실내/외",
      description: "그림책을 활용한 영유아 테라피 및 양성평등 교육 프로그램 운영 사례입니다.",
      programs: [
        "그림책 영유아테라피: 감정 이해 및 표현 능력 함양",
        "세 살 버릇 여든까지, 모두 함께 양성평등: 성 고정관념 해소 및 양성평등 의식 강화"
      ],
      fileUrl: "/files/best_practice_dungji.pdf",
      coverImage: "/images/doongji_daycare.jpg",
      tags: ["영유아", "그림책", "양성평등", "테라피"],
      size: "5MB"
    },
    // Placeholder for other best practices
    {
      id: 2,
      title: "2024년 평생학습 우수사례",
      category: "공공지원사업",
      organization: "유성구 평생학습원",
      period: "2024.03.01 ~ 2024.11.30",
      location: "유성구 관내",
      description: "디지털 문해교육을 통한 어르신 키오스크 활용 능력 향상 사례입니다.",
      programs: ["찾아가는 디지털 배움터", "키오스크 체험존 운영"],
      fileUrl: "#",
      coverImage: "/images/lifelong_learning_expo.jpg",
      tags: ["노인", "디지털문해", "키오스크"],
      size: "3MB"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">우수사례</h1>
          <p className="text-slate-600">
            평생교육 현장의 생생한 이야기와 우수 운영 사례를 소개합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {practices.map((practice) => (
            <Card key={practice.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="md:flex h-full">
                <div className="md:w-2/5 relative h-48 md:h-auto bg-slate-100">
                  <img 
                    src={practice.coverImage} 
                    alt={practice.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 hover:bg-primary text-white border-none">
                      {practice.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="md:w-3/5 flex flex-col p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {practice.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {practice.tags.map((tag, i) => (
                        <span key={i} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                      {practice.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0" />
                        <span className="truncate">{practice.organization}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{practice.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{practice.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Button 
                      className="w-full gap-2" 
                      variant={practice.fileUrl === "#" ? "secondary" : "outline"}
                      disabled={practice.fileUrl === "#"}
                      asChild={practice.fileUrl !== "#"}
                    >
                      {practice.fileUrl !== "#" ? (
                        <a href={practice.fileUrl} target="_blank" rel="noopener noreferrer" download>
                          <Download className="h-4 w-4" />
                          우수사례 PDF 보기
                        </a>
                      ) : (
                        <span>
                          <FileText className="h-4 w-4 mr-2" />
                          준비중
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
