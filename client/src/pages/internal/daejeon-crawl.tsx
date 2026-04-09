import Layout from "@/components/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
  Filter,
  MapPin,
  Phone,
  Save,
  Search,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type ReviewStatus = "pending" | "approved" | "rejected" | "unreviewed";

type ReviewState = {
  regionId: string;
  itemKey: string;
  status: "pending" | "approved" | "rejected";
  note: string;
  updatedAt: string;
};

type CrawlInstitution = {
  institution_id: string;
  canonical_name: string;
  display_name: string;
  institution_type: string;
  operator_name: string | null;
  homepage_url: string | null;
  phone: string | null;
  road_address: string | null;
  sido: string | null;
  sigungu: string | null;
  eupmyeondong: string | null;
  operation_status: string;
  confidence_score: number;
  source_count: number;
  source_ids: string[] | string;
  last_crawled_at: string;
  last_verified_at: string | null;
  itemKey: string;
  reviewState: ReviewState | null;
  isRegistered: boolean;
  registeredAt: string | null;
  matchedExisting: {
    name: string;
    address: string;
    phone: string;
    homepage: string | null;
  } | null;
};

type ReviewItem = {
  itemKey: string;
  source_id: string;
  institution_id: string;
  name: string;
  sigungu: string | null;
  confidence_score: number;
  reasons: string;
  source_url: string | null;
  homepage_url: string | null;
  address: string | null;
  phone: string | null;
  reviewState: ReviewState | null;
};

type CrawlResponse = {
  generatedAt: string;
  region: {
    id: string;
    name: string;
  };
  availableRegions: { id: string; name: string }[];
  stats: {
    totalInstitutions: number;
    totalReviewItems: number;
    withPhone: number;
    withAddress: number;
    byType: Record<string, number>;
    bySigungu: Record<string, number>;
    bySource: Record<string, number>;
    registeredCount: number;
  };
  institutions: CrawlInstitution[];
  reviewItems: ReviewItem[];
};

type InstitutionDraft = {
  canonical_name: string;
  display_name: string;
  institution_type: string;
  operator_name: string;
  homepage_url: string;
  phone: string;
  road_address: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  operation_status: string;
  note: string;
};

const ALL_VALUE = "__all__";

const DISTRICT_IMPORT_BUTTONS = [
  { id: "donggu", label: "동구 포털 가져오기" },
  { id: "junggu", label: "중구 포털 가져오기" },
  { id: "seogu", label: "서구 포털 가져오기" },
  { id: "yuseong", label: "유성구 포털 가져오기" },
  { id: "daedeok", label: "대덕구 포털 가져오기" },
];

function sourceLabelFromIds(sourceIds: string[] | string) {
  const items = Array.isArray(sourceIds) ? sourceIds : [sourceIds];
  if (items.some((item) => String(item).includes("daedeok_official_status"))) {
    return "대덕구 공식 현황";
  }
  if (items.some((item) => String(item).includes("daejeon_office_public_notice"))) {
    return "대전광역시교육청 정보공시";
  }
  if (items.some((item) => String(item).includes("dj_donggu_lifelong_home"))) {
    return "동구 포털";
  }
  if (items.some((item) => String(item).includes("dj_junggu_lifelong_home"))) {
    return "중구 포털";
  }
  if (items.some((item) => String(item).includes("dj_seogu_lifelong_home"))) {
    return "서구 포털";
  }
  if (items.some((item) => String(item).includes("dj_yuseong_lifelong_home"))) {
    return "유성구 포털";
  }
  if (items.some((item) => String(item).includes("dj_daedeok_lifelong_home"))) {
    return "대덕구 포털";
  }
  if (items.some((item) => String(item).includes("dj_nurim_recognized_2025"))) {
    return "대전 인정기관";
  }
  if (items.some((item) => String(item).includes("legacy_"))) {
    return "기존 서비스 데이터";
  }
  return String(items[0] || "기타");
}

function toDraft(item: CrawlInstitution): InstitutionDraft {
  return {
    canonical_name: item.canonical_name || "",
    display_name: item.display_name || "",
    institution_type: item.institution_type || "",
    operator_name: item.operator_name || "",
    homepage_url: item.homepage_url || "",
    phone: item.phone || "",
    road_address: item.road_address || "",
    sido: item.sido || "",
    sigungu: item.sigungu || "",
    eupmyeondong: item.eupmyeondong || "",
    operation_status: item.operation_status || "운영중",
    note: item.reviewState?.note || "",
  };
}

export default function CrawlPreviewPage() {
  const [data, setData] = useState<CrawlResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("daejeon");
  const [selectedSigungu, setSelectedSigungu] = useState(ALL_VALUE);
  const [selectedType, setSelectedType] = useState(ALL_VALUE);
  const [selectedSource, setSelectedSource] = useState(ALL_VALUE);
  const [selectedReviewStatus, setSelectedReviewStatus] = useState(ALL_VALUE);
  const [query, setQuery] = useState("");
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, InstitutionDraft>>({});
  const [savingInstitutionId, setSavingInstitutionId] = useState<string | null>(null);
  const [registeringInstitutionId, setRegisteringInstitutionId] = useState<string | null>(null);
  const [bulkRegistering, setBulkRegistering] = useState(false);
  const [bulkReviewing, setBulkReviewing] = useState<"approved" | "rejected" | null>(null);
  const [importingDaedeok, setImportingDaedeok] = useState(false);
  const [importingDistrictId, setImportingDistrictId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const response = await fetch(`/api/internal/crawl-preview?region=${selectedRegion}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.message || "Failed to load crawl data");
        }
        if (!active) return;
        setData(payload);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [selectedRegion]);

  useEffect(() => {
    if (!data) return;
    const nextDrafts: Record<string, InstitutionDraft> = {};
    for (const item of data.institutions) {
      nextDrafts[item.institution_id] = toDraft(item);
    }
    setDrafts(nextDrafts);
    setSelectedInstitutionId((current) =>
      current && data.institutions.some((item) => item.institution_id === current)
        ? current
        : data.institutions[0]?.institution_id || null,
    );
  }, [data]);

  const reviewStats = useMemo(() => {
    if (!data) {
      return { approved: 0, rejected: 0, pending: 0, unreviewed: 0 };
    }
    return data.institutions.reduce(
      (acc, item) => {
        const status = (item.reviewState?.status || "unreviewed") as ReviewStatus;
        acc[status] += 1;
        return acc;
      },
      { approved: 0, rejected: 0, pending: 0, unreviewed: 0 } as Record<ReviewStatus, number>,
    );
  }, [data]);

  const sigunguOptions = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.stats.bySigungu).sort((a, b) => a.localeCompare(b, "ko"));
  }, [data]);

  const typeOptions = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.stats.byType).sort((a, b) => a.localeCompare(b, "en"));
  }, [data]);

  const sourceOptions = useMemo(() => {
    if (!data) return [];
    return Object.keys(data.stats.bySource).sort((a, b) => a.localeCompare(b, "ko"));
  }, [data]);

  const filteredInstitutions = useMemo(() => {
    if (!data) return [];
    const normalized = query.trim().toLowerCase();
    return data.institutions.filter((item) => {
      const reviewStatus = (item.reviewState?.status || "unreviewed") as ReviewStatus;
      const matchesQuery =
        !normalized ||
        [
          item.canonical_name,
          item.display_name,
          item.sigungu,
          item.eupmyeondong,
          item.road_address,
          item.operator_name,
          item.phone,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized));
      const matchesSigungu =
        selectedSigungu === ALL_VALUE || (item.sigungu || "미분류") === selectedSigungu;
      const matchesType = selectedType === ALL_VALUE || item.institution_type === selectedType;
      const sourceLabels = [sourceLabelFromIds(item.source_ids)];
      const matchesSource = selectedSource === ALL_VALUE || sourceLabels.includes(selectedSource);
      const matchesReview =
        selectedReviewStatus === ALL_VALUE || reviewStatus === selectedReviewStatus;
      return matchesQuery && matchesSigungu && matchesType && matchesSource && matchesReview;
    });
  }, [data, query, selectedReviewStatus, selectedSigungu, selectedSource, selectedType]);

  const selectedInstitution = useMemo(
    () => data?.institutions.find((item) => item.institution_id === selectedInstitutionId) || null,
    [data, selectedInstitutionId],
  );

  const selectedDraft = selectedInstitutionId ? drafts[selectedInstitutionId] : null;

  const bulkRegisterableIds = useMemo(
    () =>
      filteredInstitutions
        .filter((item) => item.reviewState?.status === "approved" && !item.isRegistered)
        .map((item) => item.institution_id),
    [filteredInstitutions],
  );

  const bulkReviewTargetIds = useMemo(
    () =>
      filteredInstitutions
        .filter((item) => !item.isRegistered)
        .map((item) => item.institution_id),
    [filteredInstitutions],
  );

  function updateDraft(field: keyof InstitutionDraft, value: string) {
    if (!selectedInstitutionId) return;
    setDrafts((current) => ({
      ...current,
      [selectedInstitutionId]: {
        ...current[selectedInstitutionId],
        [field]: value,
      },
    }));
  }

  async function saveInstitution() {
    if (!data || !selectedInstitution || !selectedDraft) return;
    try {
      setSavingInstitutionId(selectedInstitution.institution_id);
      const response = await fetch("/api/internal/crawl-institution-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionId: data.region.id,
          institutionId: selectedInstitution.institution_id,
          ...selectedDraft,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to save institution");

      setData((current) =>
        current
          ? {
              ...current,
              institutions: current.institutions.map((item) =>
                item.institution_id === selectedInstitution.institution_id
                  ? { ...item, ...payload.institutionOverride }
                  : item,
              ),
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSavingInstitutionId(null);
    }
  }

  async function saveReviewStatus(status: "pending" | "approved" | "rejected") {
    if (!data || !selectedInstitution || !selectedDraft) return;
    try {
      const response = await fetch("/api/internal/crawl-review-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionId: data.region.id,
          itemKey: selectedInstitution.itemKey,
          status,
          note: selectedDraft.note,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to save review status");

      setData((current) =>
        current
          ? {
              ...current,
              institutions: current.institutions.map((item) =>
                item.institution_id === selectedInstitution.institution_id
                  ? { ...item, reviewState: payload.reviewState }
                  : item,
              ),
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  async function registerInstitution() {
    if (!data || !selectedInstitution) return;
    try {
      setRegisteringInstitutionId(selectedInstitution.institution_id);
      const response = await fetch("/api/internal/crawl-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionId: data.region.id,
          institutionId: selectedInstitution.institution_id,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to register institution");

      setData((current) =>
        current
          ? {
              ...current,
              stats: {
                ...current.stats,
                registeredCount: current.stats.registeredCount + 1,
              },
              institutions: current.institutions.map((item) =>
                item.institution_id === selectedInstitution.institution_id
                  ? { ...item, isRegistered: true, registeredAt: payload.registered.registeredAt }
                  : item,
              ),
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRegisteringInstitutionId(null);
    }
  }

  async function registerApprovedInstitutions() {
    if (!data || bulkRegisterableIds.length === 0) return;
    try {
      setBulkRegistering(true);
      const response = await fetch("/api/internal/crawl-register-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionId: data.region.id,
          institutionIds: bulkRegisterableIds,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to register institutions");

      const registeredIds = new Set(
        (payload.registered || []).map((item: { institutionId: string }) => item.institutionId),
      );

      setData((current) =>
        current
          ? {
              ...current,
              stats: {
                ...current.stats,
                registeredCount: current.stats.registeredCount + registeredIds.size,
              },
              institutions: current.institutions.map((item) =>
                registeredIds.has(item.institution_id)
                  ? { ...item, isRegistered: true, registeredAt: new Date().toISOString() }
                  : item,
              ),
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBulkRegistering(false);
    }
  }

  async function updateFilteredReviewStatus(status: "approved" | "rejected") {
    if (!data || bulkReviewTargetIds.length === 0) return;
    try {
      setBulkReviewing(status);
      const response = await fetch("/api/internal/crawl-review-state-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionId: data.region.id,
          institutionIds: bulkReviewTargetIds,
          status,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to update review states");

      const reviewStates = (payload.reviewStates || []) as ReviewState[];
      const stateMap = new Map<string, ReviewState>(reviewStates.map((item) => [item.itemKey, item]));

      setData((current) =>
        current
          ? {
              ...current,
              institutions: current.institutions.map((item) =>
                stateMap.has(item.itemKey)
                  ? { ...item, reviewState: stateMap.get(item.itemKey) || item.reviewState }
                  : item,
              ),
              reviewItems: current.reviewItems.map((item) =>
                stateMap.has(item.itemKey)
                  ? { ...item, reviewState: stateMap.get(item.itemKey) || item.reviewState }
                  : item,
              ),
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBulkReviewing(null);
    }
  }

  async function importDaedeokOfficial() {
    try {
      setImportingDaedeok(true);
      const response = await fetch("/api/internal/import-daedeok-official", {
        method: "POST",
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to import Daedeok official data");

      const refresh = await fetch(`/api/internal/crawl-preview?region=${selectedRegion}`);
      const nextPayload = await refresh.json();
      if (!refresh.ok) throw new Error(nextPayload.message || "Failed to refresh crawl data");
      setData(nextPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setImportingDaedeok(false);
    }
  }

  async function importDistrictSource(districtId: string) {
    try {
      setImportingDistrictId(districtId);
      const response = await fetch("/api/internal/import-district-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ districtId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Failed to import district source");

      const refresh = await fetch(`/api/internal/crawl-preview?region=${selectedRegion}`);
      const nextPayload = await refresh.json();
      if (!refresh.ok) throw new Error(nextPayload.message || "Failed to refresh crawl data");
      setData(nextPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setImportingDistrictId(null);
    }
  }

  return (
    <Layout>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
          <div className="space-y-3 lg:max-w-4xl">
            <Badge variant="outline" className="bg-white text-slate-700">
              기관 웹크롤링 관리
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">대전 기관 수집 검토 및 등록</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              공식 수집 목록을 보정하고, 관리자 검토를 거쳐 서비스용 기관 데이터로 등록하는 내부 페이지입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto space-y-6 px-4 py-6 sm:py-8">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-5 w-5 text-slate-500" />
              조회 조건
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label="지역"
              value={selectedRegion}
              onValueChange={setSelectedRegion}
              options={(data?.availableRegions ?? [{ id: "daejeon", name: "대전" }]).map((item) => ({
                value: item.id,
                label: formatRegionNameClean(item.id, item.name),
              }))}
            />
            <FilterSelect
              label="구"
              value={selectedSigungu}
              onValueChange={setSelectedSigungu}
              options={[{ value: ALL_VALUE, label: "전체" }, ...sigunguOptions.map((item) => ({ value: item, label: item }))]}
            />
            <FilterSelect
              label="유형"
              value={selectedType}
              onValueChange={setSelectedType}
              options={[{ value: ALL_VALUE, label: "전체" }, ...typeOptions.map((item) => ({ value: item, label: formatInstitutionTypeLabel(item) }))]}
            />
            <FilterSelect
              label="소스"
              value={selectedSource}
              onValueChange={setSelectedSource}
              options={[{ value: ALL_VALUE, label: "전체" }, ...sourceOptions.map((item) => ({ value: item, label: formatSourceLabelClean(item) }))]}
            />
            <FilterSelect
              label="검토 상태"
              value={selectedReviewStatus}
              onValueChange={setSelectedReviewStatus}
              options={[
                { value: ALL_VALUE, label: "전체" },
                { value: "approved", label: formatReviewStatusLabelClean("approved") },
                { value: "pending", label: formatReviewStatusLabelClean("pending") },
                { value: "rejected", label: formatReviewStatusLabelClean("rejected") },
                { value: "unreviewed", label: formatReviewStatusLabelClean("unreviewed") },
              ]}
            />
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="기관명, 운영주체, 주소, 전화번호 검색"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="sm:col-span-2 xl:col-span-2 flex items-end justify-stretch sm:justify-end">
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                <Button className="w-full sm:w-auto" variant="outline" onClick={importDaedeokOfficial} disabled={importingDaedeok}>
                  {importingDaedeok ? "가져오는 중..." : "대덕구 공식 현황 가져오기"}
                </Button>
                {DISTRICT_IMPORT_BUTTONS.map((button) => (
                  <Button
                    className="w-full sm:w-auto"
                    key={button.id}
                    variant="outline"
                    onClick={() => importDistrictSource(button.id)}
                    disabled={importingDistrictId !== null}
                  >
                    {importingDistrictId === button.id ? "가져오는 중..." : getDistrictImportLabelClean(button.id)}
                  </Button>
                ))}
                <Button
                  className="w-full sm:w-auto"
                  variant="secondary"
                  onClick={() => updateFilteredReviewStatus("approved")}
                  disabled={bulkReviewing !== null || bulkReviewTargetIds.length === 0}
                >
                  {bulkReviewing === "approved" ? "승인 중..." : `필터 결과 승인 (${bulkReviewTargetIds.length})`}
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  variant="secondary"
                  onClick={() => updateFilteredReviewStatus("rejected")}
                  disabled={bulkReviewing !== null || bulkReviewTargetIds.length === 0}
                >
                  {bulkReviewing === "rejected" ? "반려 중..." : `필터 결과 반려 (${bulkReviewTargetIds.length})`}
                </Button>
                <Button className="w-full sm:w-auto" onClick={registerApprovedInstitutions} disabled={bulkRegistering || bulkRegisterableIds.length === 0}>
                  <Upload className="mr-2 h-4 w-4" />
                  {bulkRegistering ? "등록 중..." : `승인 기관 등록 (${bulkRegisterableIds.length})`}
                </Button>
                <Button className="w-full sm:w-auto" asChild variant="outline">
                  <a href={`/api/internal/crawl-registered-export?region=${selectedRegion}`} target="_blank" rel="noreferrer">
                    <Upload className="mr-2 h-4 w-4" />
                    등록 목록 JSON 보기
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-8">
          <MetricCard title="기관 수" value={data?.stats.totalInstitutions ?? (loading ? "..." : 0)} icon={<Database className="h-4 w-4 text-blue-600" />} />
          <MetricCard title="검토 필요" value={data?.stats.totalReviewItems ?? (loading ? "..." : 0)} icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} />
          <MetricCard title="전화 확보" value={data?.stats.withPhone ?? (loading ? "..." : 0)} icon={<Phone className="h-4 w-4 text-emerald-600" />} />
          <MetricCard title="주소 확보" value={data?.stats.withAddress ?? (loading ? "..." : 0)} icon={<MapPin className="h-4 w-4 text-rose-600" />} />
          <MetricCard title="승인" value={reviewStats.approved} />
          <MetricCard title="검토중" value={reviewStats.pending} />
          <MetricCard title="반려" value={reviewStats.rejected} />
          <MetricCard title="등록 완료" value={data?.stats.registeredCount ?? 0} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">크롤링 기관 목록</CardTitle>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              <div className="space-y-3 px-4 sm:hidden">
                {filteredInstitutions.map((item, index) => (
                  <button
                    key={item.institution_id}
                    type="button"
                    className={`w-full rounded-xl border p-4 text-left shadow-sm transition ${selectedInstitutionId === item.institution_id ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white"}`}
                    onClick={() => setSelectedInstitutionId(item.institution_id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-2">
                        <div className="text-xs font-medium text-slate-500">No. {filteredInstitutions.length - index}</div>
                        <div className="break-words font-semibold text-slate-900">{item.canonical_name}</div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{classifyOwnership(item)}</Badge>
                          <Badge variant="outline">{formatRegionLabel(item)}</Badge>
                          {item.isRegistered ? <Badge className="bg-emerald-600">등록됨</Badge> : <Badge variant="secondary">미등록</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          <span>{formatInstitutionTypeLabel(item.institution_type)}</span>
                          <span>·</span>
                          <span>{sourceLabelFromIds(item.source_ids)}</span>
                        </div>
                      </div>
                      {item.homepage_url ? (
                        <a
                          href={item.homepage_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex shrink-0 items-center rounded-full border border-slate-200 p-2 text-slate-600"
                          aria-label={`${item.canonical_name} 홈페이지`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>{item.phone || "-"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <span className="break-words">{item.road_address || "-"}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-xl border border-slate-200 sm:block">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="bg-slate-50 text-left text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">No</th>
                      <th className="px-4 py-3 font-medium">기관명</th>
                      <th className="px-4 py-3 font-medium">공공 / 민간</th>
                      <th className="px-4 py-3 font-medium">지역</th>
                      <th className="px-4 py-3 font-medium">등록</th>
                      <th className="px-4 py-3 font-medium">전화</th>
                      <th className="px-4 py-3 font-medium">주소</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstitutions.map((item, index) => (
                      <tr
                        key={item.institution_id}
                        className={`cursor-pointer border-t border-slate-100 align-top ${selectedInstitutionId === item.institution_id ? "bg-blue-50/70" : "hover:bg-slate-50"}`}
                        onClick={() => setSelectedInstitutionId(item.institution_id)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{filteredInstitutions.length - index}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{item.canonical_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{classifyOwnership(item)}</Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{formatRegionLabel(item)}</td>
                        <td className="px-4 py-3">
                          {item.isRegistered ? <Badge className="bg-emerald-600">등록됨</Badge> : <Badge variant="secondary">미등록</Badge>}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.phone || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="flex items-start gap-2">
                            {item.homepage_url ? (
                              <span className="mt-0.5 inline-flex shrink-0 items-center">
                                <a
                                  href={item.homepage_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                                  aria-label={`${item.canonical_name} 홈페이지`}
                                  title={`${item.canonical_name} 홈페이지`}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                                <a
                                  href={item.homepage_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className="hidden"
                                >
                                  홈페이지
                                </a>
                              </span>
                            ) : null}
                            <span>{item.road_address || "-"}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-6 self-start">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">기관 상세 검토</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
              {!selectedInstitution || !selectedDraft ? (
                <p className="text-sm text-slate-500">기관을 선택해 주세요.</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900">{selectedInstitution.canonical_name}</h2>
                      <ReviewStatusBadge status={(selectedInstitution.reviewState?.status || "unreviewed") as ReviewStatus} />
                      {selectedInstitution.isRegistered && <Badge className="bg-emerald-600">등록됨</Badge>}
                    </div>
                    <p className="text-sm text-slate-500">
                      {selectedInstitution.matchedExisting
                        ? `기존 서비스 데이터와 이름 매칭됨: ${selectedInstitution.matchedExisting.name}`
                        : "기존 서비스 데이터와 이름 매칭 없음"}
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <EditableField label="기관명" value={selectedDraft.canonical_name} onChange={(value) => updateDraft("canonical_name", value)} />
                    <EditableField label="표시명" value={selectedDraft.display_name} onChange={(value) => updateDraft("display_name", value)} />
                    <EditableField label="운영주체" value={selectedDraft.operator_name} onChange={(value) => updateDraft("operator_name", value)} />
                    <EditableField label="기관 유형" value={selectedDraft.institution_type} onChange={(value) => updateDraft("institution_type", value)} />
                    <EditableField label="홈페이지" value={selectedDraft.homepage_url} onChange={(value) => updateDraft("homepage_url", value)} />
                    <EditableField label="전화" value={selectedDraft.phone} onChange={(value) => updateDraft("phone", value)} />
                    <EditableField label="주소" value={selectedDraft.road_address} onChange={(value) => updateDraft("road_address", value)} />
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      <EditableField label="시도" value={selectedDraft.sido} onChange={(value) => updateDraft("sido", value)} />
                      <EditableField label="시군구" value={selectedDraft.sigungu} onChange={(value) => updateDraft("sigungu", value)} />
                      <EditableField label="읍면동" value={selectedDraft.eupmyeondong} onChange={(value) => updateDraft("eupmyeondong", value)} />
                    </div>
                    <EditableField label="운영상태" value={selectedDraft.operation_status} onChange={(value) => updateDraft("operation_status", value)} />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">검토 메모</label>
                      <Textarea
                        value={selectedDraft.note}
                        onChange={(event) => updateDraft("note", event.target.value)}
                        rows={4}
                        placeholder="확인한 출처와 보정 사유를 적어두세요"
                      />
                    </div>
                  </div>

                  {selectedInstitution.homepage_url && (
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={selectedInstitution.homepage_url} target="_blank" rel="noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          홈페이지
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button className="w-full" onClick={saveInstitution} disabled={savingInstitutionId === selectedInstitution.institution_id}>
                      <Save className="mr-2 h-4 w-4" />
                      {savingInstitutionId === selectedInstitution.institution_id ? "저장 중..." : "상세 저장"}
                    </Button>
                    <Button className="w-full" variant="secondary" onClick={() => saveReviewStatus("pending")}>검토중</Button>
                    <Button className="w-full" variant="secondary" onClick={() => saveReviewStatus("approved")}>승인</Button>
                    <Button className="w-full" variant="secondary" onClick={() => saveReviewStatus("rejected")}>반려</Button>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 sm:col-span-2"
                      variant="default"
                      onClick={registerInstitution}
                      disabled={selectedInstitution.reviewState?.status !== "approved" || !!selectedInstitution.isRegistered || registeringInstitutionId === selectedInstitution.institution_id}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {selectedInstitution.isRegistered
                        ? "등록됨"
                        : registeringInstitutionId === selectedInstitution.institution_id
                          ? "등록 중..."
                          : "서비스 목록에 등록"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <Input className="w-full" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function formatInstitutionTypeLabel(type: string) {
  const labels: Record<string, string> = {
    metro_learning_center: "광역 평생학습관",
    women_family_center: "여성가족 평생교육기관",
    metro_hub: "광역 거점기관",
    district_lifelong_center: "구 평생학습관",
    university_extension: "대학 부설 평생교육원",
    dong_lifelong_center: "동 평생학습센터",
    employment_support_center: "고용·직업 지원 기관",
    public_office: "공공기관",
    education_office: "교육청 소관 기관",
    public_school: "학교",
    remote_lifelong: "원격 평생교육시설",
    civic_lifelong: "시민사회단체 부설 평생교육시설",
    media_lifelong: "언론기관 부설 평생교육시설",
    community_center: "주민자치센터",
    public_library: "공공도서관",
    museum: "박물관·미술관",
    welfare_center: "사회복지관",
    disability_welfare: "장애인 복지시설",
    disability_employment: "장애인 직업고용시설",
    arts_culture: "문화예술 관련 시설",
    other_facility: "기타 시설",
    other_public_partner: "기타 공공협력기관",
    employment_training: "지식·인력개발 평생교육시설",
    workplace_lifelong: "사업장 부설 평생교육시설",
    school_disability_lifelong: "학교형태 장애인 평생교육시설",
    other_private_lifelong: "기타 민간 평생교육시설",
  };

  return labels[type] || type || "-";
}

function classifyOwnership(item: CrawlInstitution) {
  const operator = `${item.operator_name || ""} ${item.canonical_name || ""}`.toLowerCase();
  const type = (item.institution_type || "").toLowerCase();

  if (
    operator.includes("대전광역시") ||
    operator.includes("교육청") ||
    operator.includes("구청") ||
    operator.includes("주민자치센터") ||
    operator.includes("도서관") ||
    operator.includes("공립") ||
    type.includes("metro") ||
    type.includes("district") ||
    type.includes("dong") ||
    type.includes("women") ||
    type.includes("employment_support") ||
    ["public_office", "education_office", "public_school", "community_center", "public_library", "museum", "arts_culture"].includes(type)
  ) {
    return "공공";
  }

  return "민간";
}

function formatRegionLabel(item: CrawlInstitution) {
  const address = (item.road_address || "").trim();
  const match = address.match(/^대전\s+(\S{2,3})/);
  if (match?.[1]) {
    return match[1];
  }
  return item.sigungu || "미분류";
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between px-4 py-5">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  if (status === "approved") return <Badge className="bg-emerald-600">승인</Badge>;
  if (status === "rejected") return <Badge variant="destructive">반려</Badge>;
  if (status === "pending") return <Badge className="bg-amber-500 text-white">검토중</Badge>;
  return <Badge variant="outline">미검토</Badge>;
}

function formatSourceLabelClean(label: string) {
  return label;
}

function formatRegionNameClean(regionId: string, regionName?: string) {
  const labels: Record<string, string> = {
    daejeon: "대전",
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
    incheon: "인천",
    gwangju: "광주",
    ulsan: "울산",
    sejong: "세종",
    gyeonggi: "경기",
    gangwon: "강원",
    chungbuk: "충북",
    chungnam: "충남",
    jeonbuk: "전북",
    jeonnam: "전남",
    gyeongbuk: "경북",
    gyeongnam: "경남",
    jeju: "제주",
  };

  return labels[regionId] || regionName || regionId;
}

function formatReviewStatusLabelClean(status: string) {
  const labels: Record<string, string> = {
    approved: "승인",
    pending: "검토중",
    rejected: "반려",
    unreviewed: "미검토",
  };

  return labels[status] || status;
}

function getDistrictImportLabelClean(buttonId: string) {
  const labels: Record<string, string> = {
    donggu: "동구 포털 가져오기",
    junggu: "중구 포털 가져오기",
    seogu: "서구 포털 가져오기",
    yuseong: "유성구 포털 가져오기",
    daedeok: "대덕구 포털 가져오기",
  };

  return labels[buttonId] || buttonId;
}
