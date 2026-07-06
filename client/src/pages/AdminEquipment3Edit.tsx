/**
 * AdminEquipment3Edit - 시술 수정 페이지
 * URL: /admin/equipment3/:id/edit
 */
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X, Loader, Languages, CheckCircle } from "lucide-react";

// 카테고리 목록 (Equipment3와 동일)
const CATEGORY_OPTIONS = [
  { id: "best-시술", label: "Best 시술", labelEn: "Best Treatments", labelJa: "ベスト施術", labelZh: "最佳项目" },
  { id: "건선-아토피", label: "건선·아토피", labelEn: "Psoriasis & Atopy", labelJa: "乾癬・アトピー", labelZh: "银屑病·特应性" },
  { id: "눈밑지방재배치", label: "눈밑지방재배치", labelEn: "Under-eye Fat Repositioning", labelJa: "目の下の脂肪再配置", labelZh: "眼底脂肪重置" },
  { id: "리프팅-탄력", label: "리프팅·탄력", labelEn: "Lifting & Elasticity", labelJa: "リフティング・弾力", labelZh: "提拉·弹力" },
  { id: "백반증", label: "백반증", labelEn: "Vitiligo", labelJa: "白斑", labelZh: "白癜风" },
  { id: "보톡스-필러", label: "보톡스·필러", labelEn: "Botox & Filler", labelJa: "ボトックス", labelZh: "肉毒素·填充" },
  { id: "볼륨-부스터", label: "볼륨·부스터", labelEn: "Volume & Booster", labelJa: "ボリューム", labelZh: "填充·提升" },
  { id: "색소-문신", label: "색소·문신", labelEn: "Pigmentation·Tattoo", labelJa: "色素・タトゥー", labelZh: "色素·纹身" },
  { id: "손-발톱무좀", label: "손·발톱무좀", labelEn: "Nail Fungus", labelJa: "爪水虫", labelZh: "灰指甲" },
  { id: "액취증-다한증", label: "액취증·다한증", labelEn: "Osmidrosis · Hyperhidrosis", labelJa: "腋臭症・多汗症", labelZh: "狐臭·多汗症" },
  { id: "여드름", label: "여드름", labelEn: "Acne", labelJa: "ニキビ", labelZh: "痤疮" },
  { id: "줄기세포-치료", label: "줄기세포 치료", labelEn: "Stem Cell Therapy", labelJa: "幹細胞治療", labelZh: "干细胞治疗" },
  { id: "홍조-혈관", label: "홍조·혈관", labelEn: "Rosacea & Vascular", labelJa: "赤ら顔・血管", labelZh: "红血丝·血管" },
  { id: "흉터-모공", label: "흉터·모공", labelEn: "Scars·Pores", labelJa: "傷跡・毛穴", labelZh: "疤痕·毛孔" },
];

// 언어별 필드 그룹 렌더러 (컴포넌트 외부에 정의하여 'Cannot create components during render' 에러 방지)
function MultiLangField({
  label, fieldKey, type = "input", rows = 4, form, onChange,
}: {
  label: string;
  fieldKey: string;
  type?: "input" | "textarea";
  rows?: number;
  form: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const langs = [
    { code: "ko", suffix: "", placeholder: "한국어" },
    { code: "en", suffix: "En", placeholder: "English" },
    { code: "ja", suffix: "Ja", placeholder: "日本語" },
    { code: "zh", suffix: "Zh", placeholder: "中文" },
  ];
  return (
    <div className="space-y-2">
      <Label className="font-semibold">{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {langs.map(({ code, suffix, placeholder }) => {
          const name = `${fieldKey}${suffix}`;
          const value = form[name as keyof FormData] as string;
          const isKo = code === "ko";
          return type === "textarea" ? (
            <div key={code} className={isKo ? "md:col-span-2 border-l-4 border-blue-400 pl-3" : ""}>
              <Label className={`text-xs mb-1 block ${isKo ? "text-blue-600 font-semibold" : "text-gray-500"}`}>{placeholder}{isKo ? " (원문)" : ""}</Label>
              <Textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="text-sm" />
            </div>
          ) : (
            <div key={code} className={isKo ? "md:col-span-2 border-l-4 border-blue-400 pl-3" : ""}>
              <Label className={`text-xs mb-1 block ${isKo ? "text-blue-600 font-semibold" : "text-gray-500"}`}>{placeholder}{isKo ? " (원문)" : ""}</Label>
              <Input name={name} value={value} onChange={onChange} placeholder={placeholder} className="text-sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

type FormData = {
  name: string; nameEn: string; nameJa: string; nameZh: string;
  category: string; categoryEn: string; categoryJa: string; categoryZh: string;
  desc: string; descEn: string; descJa: string; descZh: string;
  detail: string; detailEn: string; detailJa: string; detailZh: string;
  effect: string; effectEn: string; effectJa: string; effectZh: string;
  caution: string; cautionEn: string; cautionJa: string; cautionZh: string;
  sessions: string; sessionsEn: string; sessionsJa: string; sessionsZh: string;
  time: string; timeEn: string; timeJa: string; timeZh: string;
  recovery: string; recoveryEn: string; recoveryJa: string; recoveryZh: string;
  slug: string; badge: string; badgeColor: string; sortOrder: string;
  youtubeUrl: string; imageUrl: string; bgImageUrl: string; images: string[]; isActive: "0" | "1"; isBest: "0" | "1";
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
};

export default function AdminEquipment3Edit() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [, navigate] = useLocation();

  const { data: item, isLoading } = trpc.equipment3.byId.useQuery({ id }, { enabled: !!id });
  const updateMutation = trpc.equipment3.update.useMutation();
  const uploadMutation = trpc.equipment3.uploadImage.useMutation();
  const autoTranslateMutation = trpc.equipment3.autoTranslate.useMutation();
  const autoGenerateSeoMutation = trpc.equipment3.autoGenerateSeo.useMutation();

  const [form, setForm] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateDone, setTranslateDone] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [seoDone, setSeoDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // 데이터 로드 후 폼 초기화 (아이템 변경 시 1회만 실행되는 정상 패턴)
  useEffect(() => {
    if (!item) return;
    const images = item.images ? JSON.parse(item.images) : [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: item.name ?? "",
      nameEn: item.nameEn ?? "", nameJa: item.nameJa ?? "", nameZh: item.nameZh ?? "",
      category: item.category ?? "",
      categoryEn: item.categoryEn ?? "", categoryJa: item.categoryJa ?? "", categoryZh: item.categoryZh ?? "",
      desc: item.desc ?? "",
      descEn: item.descEn ?? "", descJa: item.descJa ?? "", descZh: item.descZh ?? "",
      detail: item.detail ?? "",
      detailEn: item.detailEn ?? "", detailJa: item.detailJa ?? "", detailZh: item.detailZh ?? "",
      effect: item.effect ?? "",
      effectEn: item.effectEn ?? "", effectJa: item.effectJa ?? "", effectZh: item.effectZh ?? "",
      caution: item.caution ?? "",
      cautionEn: item.cautionEn ?? "", cautionJa: item.cautionJa ?? "", cautionZh: item.cautionZh ?? "",
      sessions: item.sessions ?? "",
      sessionsEn: item.sessionsEn ?? "", sessionsJa: item.sessionsJa ?? "", sessionsZh: item.sessionsZh ?? "",
      time: item.time ?? "",
      timeEn: item.timeEn ?? "", timeJa: item.timeJa ?? "", timeZh: item.timeZh ?? "",
      recovery: item.recovery ?? "",
      recoveryEn: item.recoveryEn ?? "", recoveryJa: item.recoveryJa ?? "", recoveryZh: item.recoveryZh ?? "",
      slug: item.slug ?? "",
      badge: item.badge ?? "", badgeColor: item.badgeColor ?? "#4A6FA5",
      sortOrder: String(item.sortOrder ?? 0),
      youtubeUrl: item.youtubeUrl ?? "", imageUrl: item.imageUrl ?? "", bgImageUrl: item.bgImageUrl ?? "",
      images: Array.isArray(images) ? images : [],
      isActive: (item.isActive ?? "1") as "0" | "1",
      isBest: (item.isBest ?? "0") as "0" | "1",
      seoTitle: item.seoTitle ?? "",
      seoDescription: item.seoDescription ?? "",
      seoKeywords: item.seoKeywords ?? "",
      ogImageUrl: item.ogImageUrl ?? "",
    });
  }, [item]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => prev ? { ...prev, [name]: value } : prev);
    // 한국어 필드 변경 시 번역 완료 상태 초기화
    const koFields = ["name","category","desc","detail","effect","caution","sessions","time","recovery"];
    if (koFields.includes(name)) setTranslateDone(false);
  }

  /** 한국어 원문 기준 자동 번역 실행 */
  async function handleAutoTranslate() {
    if (!form) return;
    setTranslating(true);
    setTranslateDone(false);
    try {
      const result = await autoTranslateMutation.mutateAsync({
        name: form.name,
        category: form.category,
        desc: form.desc,
        detail: form.detail,
        effect: form.effect,
        caution: form.caution,
        sessions: form.sessions,
        time: form.time,
        recovery: form.recovery,
      });
      const { en, ja, zh } = result.translations;
      // 번역 결과 적용: LLM이 번역한 값이 있으면 적용, 빈 문자열이면 이전 값 유지
      // ?? 대신 || 사용 — ?? 는 null/undefined만 걸러내지만
      // || 는 빈 문자열도 폴백시켜 이전 값을 유지
      setForm((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          nameEn: en.name || prev.nameEn,
          nameJa: ja.name || prev.nameJa,
          nameZh: zh.name || prev.nameZh,
          categoryEn: en.category || prev.categoryEn,
          categoryJa: ja.category || prev.categoryJa,
          categoryZh: zh.category || prev.categoryZh,
          descEn: en.desc || prev.descEn,
          descJa: ja.desc || prev.descJa,
          descZh: zh.desc || prev.descZh,
          detailEn: en.detail || prev.detailEn,
          detailJa: ja.detail || prev.detailJa,
          detailZh: zh.detail || prev.detailZh,
          effectEn: en.effect || prev.effectEn,
          effectJa: ja.effect || prev.effectJa,
          effectZh: zh.effect || prev.effectZh,
          cautionEn: en.caution || prev.cautionEn,
          cautionJa: ja.caution || prev.cautionJa,
          cautionZh: zh.caution || prev.cautionZh,
          sessionsEn: en.sessions || prev.sessionsEn,
          sessionsJa: ja.sessions || prev.sessionsJa,
          sessionsZh: zh.sessions || prev.sessionsZh,
          timeEn: en.time || prev.timeEn,
          timeJa: ja.time || prev.timeJa,
          timeZh: zh.time || prev.timeZh,
          recoveryEn: en.recovery || prev.recoveryEn,
          recoveryJa: ja.recovery || prev.recoveryJa,
          recoveryZh: zh.recovery || prev.recoveryZh,
        };
      });
      setTranslateDone(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      alert(`❌ 자동 번역 실패: ${msg}`);
    } finally {
      setTranslating(false);
    }
  }

  /** SEO 메타 정보 자동생성 (LLM) */
  async function handleAutoGenerateSeo() {
    if (!form) return;
    if (!form.name.trim()) {
      alert("시술명을 먼저 입력해주세요.");
      return;
    }
    setGeneratingSeo(true);
    setSeoDone(false);
    try {
      const result = await autoGenerateSeoMutation.mutateAsync({
        name: form.name,
        nameEn: form.nameEn,
        category: form.category,
        desc: form.desc,
        detail: form.detail,
        effect: form.effect,
        caution: form.caution,
        sessions: form.sessions,
        time: form.time,
        recovery: form.recovery,
      });
      setForm((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          seoTitle: result.seoTitle || prev.seoTitle,
          seoDescription: result.seoDescription || prev.seoDescription,
          seoKeywords: result.seoKeywords || prev.seoKeywords,
        };
      });
      setSeoDone(true);
      setTimeout(() => setSeoDone(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      alert(`❌ SEO 자동생성 실패: ${msg}`);
    } finally {
      setGeneratingSeo(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("이미지 파일 크기는 5MB 이하여야 합니다."); return; }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const result = await uploadMutation.mutateAsync({ base64, fileName: file.name, mimeType: file.type });
        setForm((prev) => prev ? { ...prev, imageUrl: result.url } : prev);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("이미지 업로드에 실패했습니다.");
      setUploading(false);
    }
  }


  async function handleBgImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("이미지 파일 크기는 5MB 이하여야 합니다."); return; }
    setUploadingBg(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const result = await uploadMutation.mutateAsync({ base64, fileName: file.name, mimeType: file.type });
        setForm((prev) => prev ? { ...prev, bgImageUrl: result.url } : prev);
        setUploadingBg(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert("배경 이미지 업로드에 실패했습니다.");
      setUploadingBg(false);
    }
  }
  async function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("이미지 파일 크기는 5MB 이하여야 합니다."); return; }
    setGalleryUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const result = await uploadMutation.mutateAsync({ base64, fileName: file.name, mimeType: file.type });
        setForm((prev) => prev ? { ...prev, images: [...prev.images, result.url] } : prev);
        setGalleryUploading(false);
        if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    } catch {
      alert("이미지 업로드에 실패했습니다.");
      setGalleryUploading(false);
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => prev ? { ...prev, images: prev.images.filter((_, i) => i !== index) } : prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!form.name.trim()) { alert("시술명(한국어)은 필수입니다."); return; }
    if (!form.slug.trim()) { alert("슬러그는 필수입니다."); return; }
    setSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id,
        name: form.name,
        nameEn: form.nameEn, nameJa: form.nameJa, nameZh: form.nameZh,
        category: form.category, categoryEn: form.categoryEn, categoryJa: form.categoryJa, categoryZh: form.categoryZh,
        desc: form.desc, descEn: form.descEn, descJa: form.descJa, descZh: form.descZh,
        detail: form.detail, detailEn: form.detailEn, detailJa: form.detailJa, detailZh: form.detailZh,
        effect: form.effect, effectEn: form.effectEn, effectJa: form.effectJa, effectZh: form.effectZh,
        caution: form.caution, cautionEn: form.cautionEn, cautionJa: form.cautionJa, cautionZh: form.cautionZh,
        sessions: form.sessions, sessionsEn: form.sessionsEn, sessionsJa: form.sessionsJa, sessionsZh: form.sessionsZh,
        time: form.time, timeEn: form.timeEn, timeJa: form.timeJa, timeZh: form.timeZh,
        recovery: form.recovery, recoveryEn: form.recoveryEn, recoveryJa: form.recoveryJa, recoveryZh: form.recoveryZh,
        slug: form.slug,
        badge: form.badge, badgeColor: form.badgeColor,
        sortOrder: parseInt(form.sortOrder) || 0,
        youtubeUrl: form.youtubeUrl || undefined,
        imageUrl: form.imageUrl || undefined,
        bgImageUrl: form.bgImageUrl || undefined,
        images: JSON.stringify(form.images),
        isActive: form.isActive,
        isBest: form.isBest,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        seoKeywords: form.seoKeywords || undefined,
        ogImageUrl: form.ogImageUrl || undefined,
      });
      alert("✅ 시술 정보가 수정되었습니다!");
      navigate("/admin/equipment3");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      alert(`❌ 수정 실패: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!item || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-600">시술 정보를 찾을 수 없습니다.</p>
        <Button onClick={() => navigate("/admin/equipment3")}>목록으로</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button type="button" onClick={() => navigate("/admin/equipment3")} className="p-2 hover:bg-gray-200 rounded-md transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">시술 수정</h1>
          <span className="text-gray-400 text-sm">ID: {id}</span>
        </div>

        {/* 자동 번역 배너 */}
        <div className="mb-6 p-4 rounded-xl border bg-white flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Languages className="h-5 w-5 text-indigo-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">AI 자동 번역</p>
              <p className="text-xs text-gray-500">한국어 원문을 수정한 뒤 버튼을 클릭하면 영어·일본어·중국어가 자동으로 번역됩니다.</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleAutoTranslate}
            disabled={translating}
            className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {translating ? (
              <><Loader className="h-4 w-4 animate-spin" /> 번역 중...</>
            ) : translateDone ? (
              <><CheckCircle className="h-4 w-4" /> 번역 완료</>
            ) : (
              <><Languages className="h-4 w-4" /> 한국어 기준 자동 번역</>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <MultiLangField label="시술명 *" fieldKey="name" form={form} onChange={handleChange} />
              
              {/* 카테고리 선택 — 탭 메뉴 방식 */}
              {form && (
                <div className="space-y-2">
                  <Label className="font-semibold">카테고리</Label>
                  <div className="flex flex-wrap gap-2 w-full">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm((prev) => prev ? { ...prev, category: cat.label, categoryEn: cat.labelEn, categoryJa: cat.labelJa, categoryZh: cat.labelZh } : null)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                          form.category === cat.label
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug" className="font-semibold">슬러그 (URL) *</Label>
                  <Input id="slug" name="slug" value={form.slug} onChange={handleChange} className="mt-1" />
                  <p className="text-xs text-gray-400 mt-1">URL: /equipment3/<strong>{form.slug}</strong></p>
                </div>
                <div>
                  <Label htmlFor="sortOrder" className="font-semibold">정렬 순서</Label>
                  <Input id="sortOrder" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge" className="font-semibold">뱃지 텍스트</Label>
                  <Input id="badge" name="badge" value={form.badge} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="badgeColor" className="font-semibold">뱃지 색상</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" name="badgeColor" value={form.badgeColor} onChange={handleChange} className="h-9 w-12 rounded cursor-pointer border" />
                    <Input name="badgeColor" value={form.badgeColor} onChange={handleChange} className="flex-1" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="isActive" className="font-semibold">활성 상태</Label>
                <select
                  id="isActive" name="isActive" value={form.isActive} onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="1">활성 (공개)</option>
                  <option value="0">비활성 (숨김)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBest"
                  checked={form.isBest === "1"}
                  onChange={(e) => setForm((prev) => prev ? { ...prev, isBest: e.target.checked ? "1" : "0" } : prev)}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
                <Label htmlFor="isBest" className="font-semibold cursor-pointer">Best 시술에 추가</Label>
              </div>
            </CardContent>
          </Card>

          {/* 이미지 */}
          <Card>
            <CardHeader><CardTitle>이미지 설정</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {/* ── 대표 이미지 (한국어용) ── */}
              <div className="space-y-3">
                <div>
                  <Label className="font-semibold text-base">대표 이미지 <span className="text-xs font-normal text-gray-500">(한국어 페이지에 표시)</span></Label>
                  <p className="text-xs text-gray-400 mt-0.5">한국어 목록 카드 및 상세 페이지에 표시되는 메인 이미지입니다.</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {form.imageUrl ? (
                  <div className="relative inline-block">
                    <img src={form.imageUrl} alt="대표 이미지" className="h-48 rounded-xl object-cover border" />
                    <button type="button" onClick={() => setForm((p) => p ? { ...p, imageUrl: "" } : p)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition w-full justify-center">
                    <Upload className="h-5 w-5" />
                    {uploading ? "업로드 중..." : "대표 이미지 업로드 (최대 5MB)"}
                  </button>
                )}
                <div>
                  <Label className="text-xs text-gray-500">또는 URL 직접 입력</Label>
                  <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className="mt-1" />
                </div>
              </div>

              <hr className="border-dashed" />

              {/* ── 배경 이미지 (다국어용) ── */}
              <div className="space-y-3">
                <div>
                  <Label className="font-semibold text-base">배경 이미지 <span className="text-xs font-normal text-gray-500">(영어·일본어·중국어 페이지에 표시)</span></Label>
                  <p className="text-xs text-gray-400 mt-0.5">한글 텍스트를 제거한 배경 전용 이미지입니다. 등록 시 외국어 페이지에서 시술명이 해당 언어 텍스트로 자동 오버레이됩니다.</p>
                </div>
                <input ref={bgFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />
                {form.bgImageUrl ? (
                  <div className="relative inline-block">
                    <img src={form.bgImageUrl} alt="배경 이미지" className="h-48 rounded-xl object-cover border" />
                    <button type="button" onClick={() => setForm((p) => p ? { ...p, bgImageUrl: "" } : p)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X className="h-4 w-4" />
                    </button>
                    {/* 오버레이 미리보기 */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-center px-4 py-3">
                        <p className="text-[9px] font-semibold tracking-widest uppercase text-white/80">TREATMENT NAME</p>
                        <p className="text-lg font-black text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{form.name || "시술명 오버레이"}</p>
                        <p className="text-xs font-semibold text-white/90">［ {form.categoryEn || "Category"} ］</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => bgFileInputRef.current?.click()} disabled={uploadingBg}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-amber-300 rounded-xl text-amber-600 hover:border-amber-500 hover:text-amber-700 transition w-full justify-center bg-amber-50">
                    <Upload className="h-5 w-5" />
                    {uploadingBg ? "업로드 중..." : "배경 이미지 업로드 (텍스트 제거 버전, 최대 5MB)"}
                  </button>
                )}
                <div>
                  <Label className="text-xs text-gray-500">또는 URL 직접 입력</Label>
                  <Input name="bgImageUrl" value={form.bgImageUrl} onChange={handleChange} placeholder="https://..." className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 설명 */}
          <Card>
            <CardHeader><CardTitle>설명</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <MultiLangField label="짧은 설명 (카드 미리보기)" fieldKey="desc" type="textarea" rows={3} form={form} onChange={handleChange} />
              <MultiLangField label="상세 설명 (마크다운 지원)" fieldKey="detail" type="textarea" rows={6} form={form} onChange={handleChange} />
            </CardContent>
          </Card>

          {/* 시술 정보 */}
          <Card>
            <CardHeader><CardTitle>시술 정보</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <MultiLangField label="기대 효과" fieldKey="effect" type="textarea" rows={4} form={form} onChange={handleChange} />
              <MultiLangField label="주의사항" fieldKey="caution" type="textarea" rows={4} form={form} onChange={handleChange} />
              <MultiLangField label="시술 시간" fieldKey="time" form={form} onChange={handleChange} />
              <MultiLangField label="회복 기간" fieldKey="recovery" form={form} onChange={handleChange} />
              <MultiLangField label="권장 횟수" fieldKey="sessions" form={form} onChange={handleChange} />
            </CardContent>
          </Card>

          {/* 이미지 갤러리 */}
          <Card>
            <CardHeader><CardTitle>이미지 갤러리 (시술 사례)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <input ref={galleryFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
              <button type="button" onClick={() => galleryFileInputRef.current?.click()} disabled={galleryUploading}
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition w-full justify-center">
                <Upload className="h-5 w-5" />
                {galleryUploading ? "업로드 중..." : "갤러리 이미지 추가 (최대 5MB)"}
              </button>
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {form.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative">
                      <img src={imgUrl} alt={`갤러리 ${idx + 1}`} className="w-full h-40 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 미디어 */}
          <Card>
            <CardHeader><CardTitle>YouTube 영상</CardTitle></CardHeader>
            <CardContent>
              <Label htmlFor="youtubeUrl">YouTube embed URL</Label>
              <Input id="youtubeUrl" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..." className="mt-1" />
              <p className="text-xs text-gray-400 mt-2">💡 YouTube URL 형식: https://www.youtube.com/embed/VIDEO_ID</p>
            </CardContent>
          </Card>

          {/* SEO 메타 정보 */}
          <Card className="border-2 border-blue-100 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span>검색엔진 최적화 (SEO)</span>
                    <span className="text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">네이버 · 구글 최적화</span>
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">입력하지 않으면 시술명과 설명으로 자동 생성됩니다. 직접 입력 시 검색 결과에 더 정확한 정보가 표시됩니다.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoGenerateSeo}
                  disabled={generatingSeo}
                  className="shrink-0 border-blue-300 text-blue-700 hover:bg-blue-50 gap-1.5"
                >
                  {generatingSeo ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      생성 중...
                    </>
                  ) : seoDone ? (
                    <>✅ 생성 완료</>
                  ) : (
                    <>✨ AI 자동생성</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="seoTitle" className="font-semibold">
                  페이지 타이틀
                  <span className="ml-2 text-xs font-normal text-gray-400">권장 60자 이내 · 미입력 시: “시술명 | 부산 서면 스타피부과” 자동 생성</span>
                </Label>
                <Input
                  id="seoTitle" name="seoTitle" value={form.seoTitle} onChange={handleChange}
                  placeholder="예: 울쎄라피 프라임 | 부산 서면 스타피부과"
                  maxLength={120}
                  className="mt-1"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">구글 검색 결과에 표시되는 제목입니다. 네이버는 30자 이내 권장.</p>
                  <span className={`text-xs ${form.seoTitle.length > 60 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>{form.seoTitle.length}/60</span>
                </div>
              </div>

              <div>
                <Label htmlFor="seoDescription" className="font-semibold">
                  메타 설명
                  <span className="ml-2 text-xs font-normal text-gray-400">권장 80자 이내 (네이버 기준)</span>
                </Label>
                <Textarea
                  id="seoDescription" name="seoDescription" value={form.seoDescription} onChange={handleChange}
                  placeholder="예: 부산 서면 스타피부과의 울쎄라피 프라임 시술 안내. 피부과 전문의가가 직접 시술합니다."
                  rows={3}
                  className="mt-1 text-sm"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-400">검색 결과 스니펫에 표시됩니다. 사용자의 클릭율에 직접 영향을 줍니다.</p>
                  <span className={`text-xs ${form.seoDescription.length > 80 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>{form.seoDescription.length}/80</span>
                </div>
              </div>

              <div>
                <Label htmlFor="seoKeywords" className="font-semibold">
                  키워드
                  <span className="ml-2 text-xs font-normal text-gray-400">쉼표로 구분, 10개 이내 권장</span>
                </Label>
                <Input
                  id="seoKeywords" name="seoKeywords" value={form.seoKeywords} onChange={handleChange}
                  placeholder="예: 울쎄라피, 리프팅, 부산피부과, 스타피부과, 서면피부과"
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">네이버 검색에서 중요하게 작용합니다. 시술명, 지역명, 증상 등을 포함하세요.</p>
              </div>

              <div>
                <Label htmlFor="ogImageUrl" className="font-semibold">
                  SNS 공유 이미지 URL (OG Image)
                  <span className="ml-2 text-xs font-normal text-gray-400">카카오톡/마레이커톡 공유 시 노출 이미지 · 미입력 시 대표 이미지 사용</span>
                </Label>
                <Input
                  id="ogImageUrl" name="ogImageUrl" value={form.ogImageUrl} onChange={handleChange}
                  placeholder="https://... (미입력 시 대표 이미지 자동 사용)"
                  className="mt-1"
                />
                {form.ogImageUrl && (
                  <img src={form.ogImageUrl} alt="OG 이미지 미리보기" className="mt-2 h-24 rounded-lg object-cover border" />
                )}
              </div>

              {/* 검색 결과 예시 미리보기 */}
              <div className="bg-white border rounded-xl p-4 space-y-1">
                <p className="text-xs font-semibold text-gray-500 mb-2">Google 검색 결과 예시</p>
                <p className="text-blue-700 font-medium text-sm truncate">{form.seoTitle || `${form.name || '시술명'} | 부산 서면 스타피부과`}</p>
                <p className="text-green-700 text-xs">https://스타피부과.com/equipment3/{form.slug || 'slug'}</p>
                <p className="text-gray-600 text-xs line-clamp-2">{form.seoDescription || `부산 서면 스타피부과의 ${form.name || '시술명'} 시술 안내. 피부과 전문의가가 직접 시술합니다.`}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/equipment3")}>취소</Button>
            <Button type="submit" disabled={submitting}>{submitting ? "저장 중..." : "변경사항 저장"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
