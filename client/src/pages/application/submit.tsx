import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Upload, FileText, AlertCircle, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// --- Types ---
interface ProgramDetail {
  sessionNo: number;
  dateTime: string;
  topic: string;
  content: string;
  hours: number;
  place: string;
  teacherName: string;
}

interface PerformanceIndicator {
  indicatorName: string;
  targetValue: string;
}

interface FormData {
  // Step 1
  businessName: string;
  businessType: string;
  totalBudget: number;
  supportBudget: number;
  selfBudget: number;
  managerName: string;
  managerPosition: string;
  managerPhone: string;
  staffName: string;
  staffPosition: string;
  staffPhone: string;
  staffEmail: string;

  // Step 2
  purpose: string;
  programName: string;
  target: string;
  location: string;
  period: string;
  budgetSummary: string;

  // Step 3
  background: string;
  goal: string;
  programDetails: ProgramDetail[];
  performanceIndicators: PerformanceIndicator[];

  // Step 4
  orgIntroFile: string;
  orgLicenseFile: string;
  budgetExcelFile: string;
  teacherCvFile: string;
  scheduleFile: string;
}

const INITIAL_DATA: FormData = {
  businessName: "2026년 디지털 리터러시 강화 프로그램",
  businessType: "private_basic",
  totalBudget: 5000000,
  supportBudget: 4000000,
  selfBudget: 1000000,
  managerName: "김철수",
  managerPosition: "센터장",
  managerPhone: "010-1234-5678",
  staffName: "이영희",
  staffPosition: "팀장",
  staffPhone: "010-9876-5432",
  staffEmail: "test@example.com",
  purpose: "본 사업은 지역 내 고령층의 디지털 격차 해소를 위해 스마트폰 및 키오스크 활용 교육을 제공하여, 일상생활에서의 불편함을 최소화하고 사회 참여를 확대하는 것을 목적으로 합니다.",
  programName: "시니어 스마트 라이프",
  target: "지역 내 65세 이상 어르신 20명",
  location: "행복평생교육센터 201호",
  period: "2026.04.01 ~ 2026.11.30",
  budgetSummary: "강사료 300만원, 교재비 100만원, 홍보비 50만원, 예비비 50만원",
  background: "최근 비대면 서비스의 확산으로 인해 디지털 기기 사용이 필수가 되었으나, 고령층의 경우 기기 조작의 어려움으로 인해 서비스 이용에 제약을 받고 있음. 이에 대한 체계적인 교육 지원이 시급함.",
  goal: "1. 스마트폰 기본 기능 습득 (카카오톡, 문자, 사진 등)\n2. 생활 편의 앱 활용 능력 향상 (배달, 택시, 지도 등)\n3. 무인단말기(키오스크) 실습을 통한 자신감 회복",
  programDetails: [
    { sessionNo: 1, dateTime: "2026-04-05 10:00", topic: "스마트폰 기초", content: "전원 켜기/끄기, 화면 터치법", hours: 2, place: "201호", teacherName: "박지성" },
    { sessionNo: 2, dateTime: "2026-04-12 10:00", topic: "카카오톡 활용", content: "메시지 보내기, 사진 전송", hours: 2, place: "201호", teacherName: "박지성" },
    { sessionNo: 3, dateTime: "2026-04-19 10:00", topic: "유튜브 활용", content: "영상 검색, 구독, 좋아요", hours: 2, place: "201호", teacherName: "박지성" },
    { sessionNo: 4, dateTime: "2026-04-26 10:00", topic: "키오스크 실습 1", content: "카페 주문하기 시뮬레이션", hours: 2, place: "201호", teacherName: "손흥민" },
    { sessionNo: 5, dateTime: "2026-05-03 10:00", topic: "키오스크 실습 2", content: "패스트푸드 주문하기", hours: 2, place: "201호", teacherName: "손흥민" },
    { sessionNo: 6, dateTime: "2026-05-10 10:00", topic: "배달앱 활용", content: "배달의민족 사용법", hours: 2, place: "201호", teacherName: "이강인" },
    { sessionNo: 7, dateTime: "2026-05-17 10:00", topic: "택시앱 활용", content: "카카오T 호출하기", hours: 2, place: "201호", teacherName: "이강인" },
    { sessionNo: 8, dateTime: "2026-05-24 10:00", topic: "지도앱 활용", content: "길찾기, 버스 도착 정보", hours: 2, place: "201호", teacherName: "이강인" },
    { sessionNo: 9, dateTime: "2026-05-31 10:00", topic: "보이스피싱 예방", content: "금융사기 유형 및 대처법", hours: 2, place: "201호", teacherName: "김연아" },
    { sessionNo: 10, dateTime: "2026-06-07 10:00", topic: "수료식 및 발표회", content: "소감 나누기", hours: 2, place: "201호", teacherName: "박지성" }
  ],
  performanceIndicators: [
    { indicatorName: "교육 수료율", targetValue: "80% 이상" },
    { indicatorName: "만족도 조사", targetValue: "4.5점 이상 (5점 만점)" },
    { indicatorName: "디지털 기기 활용 능력 향상도", targetValue: "사전/사후 평가 20% 향상" }
  ],
  orgIntroFile: "",
  orgLicenseFile: "",
  budgetExcelFile: "",
  teacherCvFile: "",
  scheduleFile: "",
};

export default function ApplicationSubmit() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName) newErrors.businessName = "사업명은 필수 입력 항목입니다.";
    if (!formData.businessType) newErrors.businessType = "사업유형은 필수 입력 항목입니다.";
    if (!formData.totalBudget) newErrors.totalBudget = "총사업비는 필수 입력 항목입니다.";
    if (!formData.supportBudget) newErrors.supportBudget = "사업지원금은 필수 입력 항목입니다.";
    // selfBudget can be 0, but required field means it should be entered? usually number input 0 is fine.
    // Logic check
    if (Number(formData.totalBudget) !== Number(formData.supportBudget) + Number(formData.selfBudget)) {
      newErrors.totalBudget = "총사업비는 사업지원금과 자부담의 합과 같아야 합니다.";
    }

    if (!formData.managerName) newErrors.managerName = "총괄책임자 이름은 필수입니다.";
    if (!formData.managerPosition) newErrors.managerPosition = "직위는 필수입니다.";
    if (!formData.managerPhone) newErrors.managerPhone = "연락처는 필수입니다.";

    if (!formData.staffName) newErrors.staffName = "담당자 이름은 필수입니다.";
    if (!formData.staffPosition) newErrors.staffPosition = "직위는 필수입니다.";
    if (!formData.staffPhone) newErrors.staffPhone = "연락처는 필수입니다.";
    if (!formData.staffEmail) newErrors.staffEmail = "이메일은 필수입니다.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.staffEmail)) {
      newErrors.staffEmail = "올바른 이메일 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.purpose) newErrors.purpose = "사업 목적은 필수입니다.";
    else if (formData.purpose.length < 30) newErrors.purpose = "최소 30자 이상 입력해주세요.";
    
    if (!formData.programName) newErrors.programName = "프로그램명은 필수입니다.";
    if (!formData.target) newErrors.target = "대상 및 인원은 필수입니다.";
    if (!formData.location) newErrors.location = "장소는 필수입니다.";
    if (!formData.period) newErrors.period = "운영기간은 필수입니다.";
    if (!formData.budgetSummary) newErrors.budgetSummary = "소요예산 요약은 필수입니다.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.background) newErrors.background = "사업배경은 필수입니다.";
    if (!formData.goal) newErrors.goal = "사업목적/목표는 필수입니다.";

    // Program Details Validation
    if (formData.programDetails.length === 0) {
      newErrors.programDetails = "최소 1개의 프로그램이 있어야 합니다.";
    } else {
      const totalHours = formData.programDetails.reduce((sum, item) => sum + Number(item.hours || 0), 0);
      if (totalHours < 20) {
        newErrors.programDetails = `총 운영시간은 최소 20시간 이상이어야 합니다. (현재 ${totalHours}시간)`;
      }
      
      // Check empty fields in rows
      const hasEmptyRow = formData.programDetails.some(
        item => !item.dateTime || !item.topic || !item.hours || !item.place || !item.teacherName
      );
      if (hasEmptyRow) {
        newErrors.programDetailsRow = "모든 세부 프로그램 항목을 입력해주세요.";
      }
    }

    // Performance Indicators Validation
    const hasEmptyIndicator = formData.performanceIndicators.some(
      item => !item.indicatorName || !item.targetValue
    );
    if (hasEmptyIndicator) {
      newErrors.performanceIndicators = "모든 성과지표 항목을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.orgIntroFile) newErrors.orgIntroFile = "해당 문서는 필수 업로드 항목입니다.";
    if (!formData.orgLicenseFile) newErrors.orgLicenseFile = "해당 문서는 필수 업로드 항목입니다.";
    if (!formData.budgetExcelFile) newErrors.budgetExcelFile = "해당 문서는 필수 업로드 항목입니다.";
    if (!formData.teacherCvFile) newErrors.teacherCvFile = "해당 문서는 필수 업로드 항목입니다.";
    if (!formData.scheduleFile) newErrors.scheduleFile = "해당 문서는 필수 업로드 항목입니다.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    if (step === 3) isValid = validateStep3();
    
    if (isValid) {
      setStep(prev => prev + 1);
    } else {
      toast({
        title: "입력 확인 필요",
        description: "필수 항목을 확인하거나 오류 내용을 수정해주세요.",
        variant: "destructive"
      });
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    if (validateStep4()) {
      console.log("최종 제출 데이터:", JSON.stringify(formData, null, 2));
      setIsSubmitted(true);
    } else {
      toast({
        title: "제출 불가",
        description: "모든 필수 문서를 업로드해주세요.",
        variant: "destructive"
      });
    }
  };

  // --- Render Steps ---

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <div className="h-32 w-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
            <Check className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">제출이 완료되었습니다.</h2>
          <p className="text-slate-600 mb-10 text-lg">
            2026년 생활권 중심 평생학습 지원사업 신청이 성공적으로 접수되었습니다.<br/>
            심사 결과는 추후 공지사항 및 개별 연락을 통해 안내해 드립니다.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/'}>메인으로</Button>
            <Button size="lg" onClick={() => window.location.href = '/dashboard'}>신청 내역 확인</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">2026년 생활권 중심 평생학습 지원사업</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            온라인 신청 시스템에 오신 것을 환영합니다. 각 단계별 정보를 정확히 입력해주세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            {/* Progress Bar Background */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -z-10 -translate-y-1/2" />
            {/* Active Progress Bar */}
            <div 
              className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex flex-col items-center bg-white px-2 z-10`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 
                  ${s <= step ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-300"}
                  ${s === step ? "ring-4 ring-primary/20" : ""}
                `}>
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                <span className={`text-xs font-bold mt-2 ${s === step ? "text-primary" : "text-slate-500"}`}>
                  {s === 1 && "사업신청서"}
                  {s === 2 && "사업요약서"}
                  {s === 3 && "사업계획서"}
                  {s === 4 && "파일업로드"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">STEP {step}</span>
              {step === 1 && "사업신청서 작성"}
              {step === 2 && "사업요약서 작성"}
              {step === 3 && "사업계획서 작성"}
              {step === 4 && "증빙서류 업로드"}
            </CardTitle>
            <CardDescription>
              필수 항목(<span className="text-red-500">*</span>)은 반드시 입력해야 합니다.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* STEP 1 Content */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Business Info */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">1. 사업 기본 정보</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>사업명 <span className="text-red-500">*</span></Label>
                      <Input 
                        value={formData.businessName} 
                        onChange={(e) => updateField("businessName", e.target.value)}
                        placeholder="사업명을 입력하세요"
                      />
                      {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>사업유형 <span className="text-red-500">*</span></Label>
                      <Select 
                        value={formData.businessType} 
                        onValueChange={(val) => updateField("businessType", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="유형을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private_basic">민간 기본</SelectItem>
                          <SelectItem value="private_jump">민간 도약</SelectItem>
                          <SelectItem value="public">공공</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.businessType && <p className="text-xs text-red-500">{errors.businessType}</p>}
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>총사업비 (원) <span className="text-red-500">*</span></Label>
                        <Input 
                          type="number"
                          value={formData.totalBudget} 
                          onChange={(e) => updateField("totalBudget", e.target.value)}
                        />
                        {errors.totalBudget && <p className="text-xs text-red-500">{errors.totalBudget}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>사업지원금 (원) <span className="text-red-500">*</span></Label>
                        <Input 
                          type="number"
                          value={formData.supportBudget} 
                          onChange={(e) => updateField("supportBudget", e.target.value)}
                        />
                        {errors.supportBudget && <p className="text-xs text-red-500">{errors.supportBudget}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>자부담 (원) <span className="text-red-500">*</span></Label>
                        <Input 
                          type="number"
                          value={formData.selfBudget} 
                          onChange={(e) => updateField("selfBudget", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Manager Info */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">2. 총괄 책임자 정보</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>이름 <span className="text-red-500">*</span></Label>
                      <Input value={formData.managerName} onChange={(e) => updateField("managerName", e.target.value)} />
                      {errors.managerName && <p className="text-xs text-red-500">{errors.managerName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>직위 <span className="text-red-500">*</span></Label>
                      <Input value={formData.managerPosition} onChange={(e) => updateField("managerPosition", e.target.value)} />
                      {errors.managerPosition && <p className="text-xs text-red-500">{errors.managerPosition}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>연락처 <span className="text-red-500">*</span></Label>
                      <Input value={formData.managerPhone} onChange={(e) => updateField("managerPhone", e.target.value)} placeholder="010-0000-0000" />
                      {errors.managerPhone && <p className="text-xs text-red-500">{errors.managerPhone}</p>}
                    </div>
                  </div>
                </section>

                {/* Staff Info */}
                <section className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">3. 실무 담당자 정보</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>이름 <span className="text-red-500">*</span></Label>
                      <Input value={formData.staffName} onChange={(e) => updateField("staffName", e.target.value)} />
                      {errors.staffName && <p className="text-xs text-red-500">{errors.staffName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>직위 <span className="text-red-500">*</span></Label>
                      <Input value={formData.staffPosition} onChange={(e) => updateField("staffPosition", e.target.value)} />
                      {errors.staffPosition && <p className="text-xs text-red-500">{errors.staffPosition}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>연락처 <span className="text-red-500">*</span></Label>
                      <Input value={formData.staffPhone} onChange={(e) => updateField("staffPhone", e.target.value)} placeholder="010-0000-0000" />
                      {errors.staffPhone && <p className="text-xs text-red-500">{errors.staffPhone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>이메일 <span className="text-red-500">*</span></Label>
                      <Input value={formData.staffEmail} onChange={(e) => updateField("staffEmail", e.target.value)} placeholder="example@email.com" />
                      {errors.staffEmail && <p className="text-xs text-red-500">{errors.staffEmail}</p>}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 2 Content */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>사업 목적 및 필요성 <span className="text-red-500">*</span> (최소 30자)</Label>
                  <Textarea 
                    className="h-32" 
                    value={formData.purpose} 
                    onChange={(e) => updateField("purpose", e.target.value)}
                    placeholder="사업의 목적과 필요성을 구체적으로 기술해주세요."
                  />
                  {errors.purpose && <p className="text-xs text-red-500">{errors.purpose}</p>}
                  <p className="text-xs text-slate-400 text-right">{formData.purpose.length} / 30자 이상</p>
                </div>

                <div className="space-y-2">
                  <Label>프로그램명 <span className="text-red-500">*</span></Label>
                  <Input value={formData.programName} onChange={(e) => updateField("programName", e.target.value)} />
                  {errors.programName && <p className="text-xs text-red-500">{errors.programName}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>대상 및 인원 <span className="text-red-500">*</span></Label>
                    <Input value={formData.target} onChange={(e) => updateField("target", e.target.value)} placeholder="예: 지역주민 20명" />
                    {errors.target && <p className="text-xs text-red-500">{errors.target}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>장소 <span className="text-red-500">*</span></Label>
                    <Input value={formData.location} onChange={(e) => updateField("location", e.target.value)} placeholder="교육 장소 입력" />
                    {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>운영기간 <span className="text-red-500">*</span></Label>
                  <Input value={formData.period} onChange={(e) => updateField("period", e.target.value)} placeholder="예: 2025.03.01 ~ 2025.11.30" />
                  {errors.period && <p className="text-xs text-red-500">{errors.period}</p>}
                </div>

                <div className="space-y-2">
                  <Label>소요예산 요약 <span className="text-red-500">*</span></Label>
                  <Input value={formData.budgetSummary} onChange={(e) => updateField("budgetSummary", e.target.value)} placeholder="예: 강사비 100만원, 재료비 50만원" />
                  {errors.budgetSummary && <p className="text-xs text-red-500">{errors.budgetSummary}</p>}
                </div>
              </div>
            )}

            {/* STEP 3 Content */}
            {step === 3 && (
              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">1. 사업배경 및 목적</h3>
                  <div className="space-y-2">
                    <Label>사업배경 <span className="text-red-500">*</span></Label>
                    <Textarea value={formData.background} onChange={(e) => updateField("background", e.target.value)} className="h-24" />
                    {errors.background && <p className="text-xs text-red-500">{errors.background}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>사업목적/목표 <span className="text-red-500">*</span></Label>
                    <Textarea value={formData.goal} onChange={(e) => updateField("goal", e.target.value)} className="h-24" />
                    {errors.goal && <p className="text-xs text-red-500">{errors.goal}</p>}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <h3 className="text-lg font-bold">2. 세부 프로그램 구성</h3>
                    <span className="text-sm font-medium">
                      총 운영시간: <span className={`font-bold ${formData.programDetails.reduce((sum, item) => sum + Number(item.hours || 0), 0) >= 20 ? "text-blue-600" : "text-red-600"}`}>
                        {formData.programDetails.reduce((sum, item) => sum + Number(item.hours || 0), 0)}
                      </span> 시간 (최소 20시간)
                    </span>
                  </div>
                  
                  {errors.programDetails && <p className="text-sm text-red-600 font-bold bg-red-50 p-2 rounded">{errors.programDetails}</p>}
                  {errors.programDetailsRow && <p className="text-sm text-red-600 font-bold bg-red-50 p-2 rounded">{errors.programDetailsRow}</p>}

                  <div className="space-y-4">
                    {formData.programDetails.map((detail, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-slate-50 relative">
                        <div className="absolute top-4 right-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              const newDetails = formData.programDetails.filter((_, i) => i !== index);
                              updateField("programDetails", newDetails);
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-1">
                              <Label className="text-xs">회기</Label>
                              <Input value={index + 1} disabled className="bg-slate-100 text-center" />
                            </div>
                            <div className="col-span-4">
                              <Label className="text-xs">일시 <span className="text-red-500">*</span></Label>
                              <Input 
                                type="datetime-local" // Simple date text or datetime
                                value={detail.dateTime}
                                onChange={(e) => {
                                  const newDetails = [...formData.programDetails];
                                  newDetails[index].dateTime = e.target.value;
                                  updateField("programDetails", newDetails);
                                }}
                              />
                            </div>
                            <div className="col-span-5">
                              <Label className="text-xs">주제 <span className="text-red-500">*</span></Label>
                              <Input 
                                value={detail.topic}
                                onChange={(e) => {
                                  const newDetails = [...formData.programDetails];
                                  newDetails[index].topic = e.target.value;
                                  updateField("programDetails", newDetails);
                                }}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs">시간 <span className="text-red-500">*</span></Label>
                              <Input 
                                type="number"
                                value={detail.hours}
                                onChange={(e) => {
                                  const newDetails = [...formData.programDetails];
                                  newDetails[index].hours = Number(e.target.value);
                                  updateField("programDetails", newDetails);
                                }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs">장소 <span className="text-red-500">*</span></Label>
                              <Input 
                                value={detail.place}
                                onChange={(e) => {
                                  const newDetails = [...formData.programDetails];
                                  newDetails[index].place = e.target.value;
                                  updateField("programDetails", newDetails);
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">강사명 <span className="text-red-500">*</span></Label>
                              <Input 
                                value={detail.teacherName}
                                onChange={(e) => {
                                  const newDetails = [...formData.programDetails];
                                  newDetails[index].teacherName = e.target.value;
                                  updateField("programDetails", newDetails);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">내용</Label>
                            <Input 
                              value={detail.content}
                              onChange={(e) => {
                                const newDetails = [...formData.programDetails];
                                newDetails[index].content = e.target.value;
                                updateField("programDetails", newDetails);
                              }}
                              placeholder="세부 내용 (선택)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full border-dashed border-2 py-6"
                      onClick={() => {
                        updateField("programDetails", [
                          ...formData.programDetails, 
                          { sessionNo: formData.programDetails.length + 1, dateTime: "", topic: "", content: "", hours: 0, place: "", teacherName: "" }
                        ]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> 행 추가하기
                    </Button>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">3. 성과지표</h3>
                  {errors.performanceIndicators && <p className="text-xs text-red-500">{errors.performanceIndicators}</p>}
                  <div className="space-y-3">
                    {formData.performanceIndicators.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end">
                         <div className="flex-1">
                           <Label className="text-xs">지표명 <span className="text-red-500">*</span></Label>
                           <Input 
                             value={item.indicatorName}
                             onChange={(e) => {
                               const newIndicators = [...formData.performanceIndicators];
                               newIndicators[index].indicatorName = e.target.value;
                               updateField("performanceIndicators", newIndicators);
                             }}
                             placeholder="예: 수료율"
                           />
                         </div>
                         <div className="flex-1">
                           <Label className="text-xs">목표값 <span className="text-red-500">*</span></Label>
                           <Input 
                             value={item.targetValue}
                             onChange={(e) => {
                               const newIndicators = [...formData.performanceIndicators];
                               newIndicators[index].targetValue = e.target.value;
                               updateField("performanceIndicators", newIndicators);
                             }}
                             placeholder="예: 90% 이상"
                           />
                         </div>
                         <Button 
                           variant="ghost" 
                           size="icon"
                           onClick={() => {
                             const newIndicators = formData.performanceIndicators.filter((_, i) => i !== index);
                             updateField("performanceIndicators", newIndicators);
                           }}
                         >
                           <Trash2 className="h-4 w-4 text-slate-400" />
                         </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        updateField("performanceIndicators", [
                          ...formData.performanceIndicators,
                          { indicatorName: "", targetValue: "" }
                        ]);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> 성과지표 추가
                    </Button>
                  </div>
                </section>
              </div>
            )}

            {/* STEP 4 Content */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                   <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>안내:</strong> 파일 업로드 기능은 현재 데모 버전에서 <strong>파일명 입력</strong>으로 대체됩니다. 실제 서류의 파일명을 입력해주세요.
                    </p>
                  </div>

                  {[
                    { key: "orgIntroFile", label: "기관 소개서" },
                    { key: "orgLicenseFile", label: "기관 등록증" },
                    { key: "budgetExcelFile", label: "예산 산출내역(엑셀)" },
                    { key: "teacherCvFile", label: "강사 이력서" },
                    { key: "scheduleFile", label: "세부 일정표" },
                  ].map((file) => (
                    <div key={file.key} className="space-y-2">
                      <Label>{file.label} <span className="text-red-500">*</span></Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            className="pl-10"
                            // @ts-ignore
                            value={formData[file.key]}
                            // @ts-ignore
                            onChange={(e) => updateField(file.key, e.target.value)}
                            placeholder={`${file.label} 파일명 입력`}
                          />
                        </div>
                        <Button variant="secondary" className="shrink-0">
                          <Upload className="h-4 w-4 mr-2" /> 찾아보기
                        </Button>
                      </div>
                      {/* @ts-ignore */}
                      {errors[file.key] && <p className="text-xs text-red-500">{errors[file.key]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter className="bg-slate-50 p-6 flex justify-between border-t border-slate-100">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              disabled={step === 1}
              className={step === 1 ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> 이전 단계
            </Button>
            
            {step < 4 ? (
              <Button onClick={handleNext} className="px-8">
                다음 단계 <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="px-8 bg-green-600 hover:bg-green-700">
                제출하기 <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}