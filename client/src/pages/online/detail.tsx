import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, PlayCircle, Share2, ThumbsUp, ExternalLink } from "lucide-react";
import { Link, useRoute } from "wouter";
import { getOnlineLectureById, getRelatedOnlineLectures } from "@/data/catalog";

export default function OnlineLectureDetail() {
  const [, params] = useRoute("/online/:id");
  const id = params?.id;
  const lecture = getOnlineLectureById(id);

  if (!lecture) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-900">강좌를 찾을 수 없습니다.</h2>
          <Link href="/online">
            <Button className="mt-4">목록으로 돌아가기</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedLectures = getRelatedOnlineLectures(lecture.id, lecture.category);

  return (
    <Layout>
      <div className="bg-slate-50 py-8 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <Link href="/online">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600 text-slate-500">
              <ArrowLeft className="mr-2 h-4 w-4" /> 목록으로 돌아가기
            </Button>
          </Link>
          <div className="flex gap-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none text-sm px-3 py-1">
              {lecture.category}
            </Badge>
            <Badge variant="outline" className="text-slate-600 border-slate-300 flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> {lecture.platform}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {lecture.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {lecture.tags.map(tag => (
              <span key={tag} className="text-sm bg-white text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-xl relative group">
              <img 
                src={lecture.thumbnailUrl} 
                alt={lecture.title} 
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full h-20 w-20 p-0 bg-red-600 hover:bg-red-700 shadow-2xl border-4 border-white/20"
                  onClick={() => window.open(lecture.videoUrl, '_blank')}
                >
                  <PlayCircle className="h-10 w-10 text-white ml-1" />
                </Button>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center text-white font-medium">
                재생 버튼을 누르면 유튜브로 이동합니다
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">강좌 소개</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  {lecture.description}
                </p>
              </section>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" /> 이런 분께 추천해요
                </h3>
                <p className="text-blue-900 text-lg">
                  "{lecture.helpfulFor}"
                </p>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 bg-slate-900 hover:bg-slate-800 text-lg h-14" onClick={() => window.open(lecture.videoUrl, '_blank')}>
                  영상 보러가기
                </Button>
                <Button size="lg" variant="outline" className="px-6 h-14 border-slate-300">
                  <Share2 className="h-5 w-5 mr-2" /> 공유하기
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">관련 강좌 더보기</h3>
              {relatedLectures.length > 0 ? (
                <div className="grid gap-4">
                  {relatedLectures.map(related => (
                    <Link key={related.id} href={`/online/${related.id}`}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow border-slate-200">
                        <div className="flex gap-3 p-3">
                          <div className="w-24 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                            <img src={related.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-2 mb-1 text-sm">
                              {related.title}
                            </h4>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {related.category}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">관련 강좌가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
