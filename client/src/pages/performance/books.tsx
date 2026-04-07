import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";
import reportCover2024 from "@assets/stock_images/annual_report_book_c_aa91b933.jpg";
import reportCover2025 from "@assets/stock_images/annual_report_book_c_f22f08bf.jpg";

export default function AchievementBooks() {
  const books = [
    {
      year: "2025",
      title: "2025년 평생교육 성과공유회 성과집",
      description: "2025년 생활권 중심 평생학습 지원사업의 주요 성과와 우수사례, 공공 및 민간 지원사업 현황을 담은 성과자료집입니다.",
      date: "2025-12-20",
      fileUrl: "/files/2025_achievement_book.pdf",
      coverImage: reportCover2025,
      size: "72MB"
    },
    {
      year: "2024",
      title: "2024년 평생교육 성과공유회 성과집",
      description: "2024년 대전 평생교육 활성화 사업의 주요 성과와 우수사례, 참여자 수기 및 통계자료를 담은 종합 성과자료집입니다.",
      date: "2024-12-20",
      fileUrl: "/files/2024_achievement_book.pdf",
      coverImage: reportCover2024,
      size: "68MB"
    },
    {
      year: "2023",
      title: "2023년 평생교육 성과공유회 성과집",
      description: "2023년 생활권중심 평생학습사업의 주요 성과와 우수사례, 통계자료를 담은 성과자료집입니다.",
      date: "2023-12-20",
      fileUrl: "/files/2023_achievement_book.pdf",
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000", // New image for 2023
      size: "95MB"
    },
    {
      year: "2022",
      title: "2022년 평생교육 성과공유회 성과집",
      description: "2022년 한 해 동안의 평생교육 사업 성과와 우수사례를 담은 성과자료집입니다.",
      date: "2022-12-20",
      fileUrl: "/files/2022_achievement_book.pdf",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000", // Placeholder book cover
      size: "78MB"
    },
    // Placeholder for previous years to show cumulative structure
    {
      year: "2021",
      title: "2021년 평생교육 성과공유회 성과집",
      description: "2021년 평생교육 활성화 사업의 주요 성과와 통계자료가 수록되어 있습니다.",
      date: "2021-12-15",
      fileUrl: "#",
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000",
      size: "45MB"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">성과집</h1>
          <p className="text-slate-600">
            평생교육 사업의 연도별 성과와 발자취를 기록한 성과자료집을 확인하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-slate-100 group">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                  {book.year}
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl line-clamp-2 leading-tight">
                  {book.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>발행일: {book.date}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-slate-600 text-sm line-clamp-3">
                  {book.description}
                </p>
              </CardContent>
              
              <CardFooter className="pt-2 border-t bg-slate-50/50">
                <Button 
                  className="w-full gap-2" 
                  variant={book.fileUrl === "#" ? "secondary" : "default"}
                  disabled={book.fileUrl === "#"}
                  asChild={book.fileUrl !== "#"}
                >
                  {book.fileUrl !== "#" ? (
                    <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                      PDF 다운로드 ({book.size})
                    </a>
                  ) : (
                    <span>
                      <FileText className="h-4 w-4 mr-2" />
                      파일 준비중
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
