import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { institutionNeedsReviewReport } from "@/data/generated/institutionNeedsReview";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";

type ReviewRegion = {
  regionId: string;
  displayName: string;
  sourceType: string;
  count: number;
};

type ReviewItem = {
  id: string;
  regionId: string;
  displayName: string;
  detailRegion: string;
  name: string;
  issues: string[];
};

export default function InstitutionQualityPage() {
  const report = institutionNeedsReviewReport as {
    generatedAt: string;
    total: number;
    regions: readonly ReviewRegion[];
    items: readonly ReviewItem[];
  };

  return (
    <Layout>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="bg-white text-slate-700">
                내부 검수
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900">기관 데이터 품질 검수</h1>
              <p className="max-w-2xl text-slate-600">
                전국 기관 카탈로그 중 `sourceQuality = needs_review` 항목만 모아서 확인하는 내부 페이지입니다.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              마지막 생성 시각: {new Date(report.generatedAt).toLocaleString("ko-KR")}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                검수 대상
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{report.total}</div>
              <p className="mt-2 text-sm text-slate-500">현재 검수 필요로 분류된 기관 수</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="h-4 w-4 text-blue-600" />
                영향 지역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{report.regions.length}</div>
              <p className="mt-2 text-sm text-slate-500">검수 대상이 존재하는 시도 수</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <RefreshCw className="h-4 w-4 text-emerald-600" />
                갱신 방법
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-800">
                npm.cmd run report:institution-quality
              </code>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>지역별 집계</CardTitle>
          </CardHeader>
          <CardContent>
            {report.regions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="px-3 py-3 font-medium">지역</th>
                      <th className="px-3 py-3 font-medium">건수</th>
                      <th className="px-3 py-3 font-medium">소스</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.regions.map((region) => (
                      <tr key={region.regionId} className="border-b border-slate-100">
                        <td className="px-3 py-3 font-medium text-slate-900">{region.displayName}</td>
                        <td className="px-3 py-3 text-slate-600">{region.count}</td>
                        <td className="px-3 py-3">
                          <Badge variant="outline">{region.sourceType}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500">현재 검수 대상이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>상세 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {report.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="px-3 py-3 font-medium">ID</th>
                      <th className="px-3 py-3 font-medium">지역</th>
                      <th className="px-3 py-3 font-medium">기관명</th>
                      <th className="px-3 py-3 font-medium">세부지역</th>
                      <th className="px-3 py-3 font-medium">이슈</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((item) => (
                      <tr key={`${item.regionId}-${item.id}`} className="border-b border-slate-100 align-top">
                        <td className="px-3 py-3 font-mono text-xs text-slate-500">{item.id}</td>
                        <td className="px-3 py-3 text-slate-700">{item.displayName}</td>
                        <td className="px-3 py-3 font-medium text-slate-900">{item.name}</td>
                        <td className="px-3 py-3 text-slate-600">{item.detailRegion}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-2">
                            {item.issues.map((issue) => (
                              <Badge key={issue} variant="secondary">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">검수 대상이 없습니다.</p>
                <p className="mt-2 text-sm text-slate-500">
                  현재 기준으로 `needs_review` 항목이 0건입니다. 데이터 변경 후 다시 검수 리포트를 생성하면 이 페이지에 반영됩니다.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/institutions?region=all&view=list">기관 목록 보기</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
