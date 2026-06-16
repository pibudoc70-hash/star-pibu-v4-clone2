/**
 * AdminEquipment3New - 신규 시술 등록 페이지
 * URL: /admin/equipment3/new
 */
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, X } from "lucide-react";

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
  slug: string;
  badge: string; badgeColor: string;
  sortOrder: string;
  youtubeUrl: string;
  imageUrl: string;
  bgImageUrl: string;
  isBest: boolean;
};

const INITIAL: FormData = {
  name: "", nameEn: "", nameJa: "", nameZh: "",
  category: "", categoryEn: "", categoryJa: "", categoryZh: "",
  desc: "", descEn: "", descJa: "", descZh: "",
  detail: "", detailEn: "", detailJa: "", detailZh: "",
  effect: "", effectEn: "", effectJa: "", effectZh: "",
  caution: "", cautionEn: "", cautionJa: "", cautionZh: "",
  sessions: "", sessionsEn: "", sessionsJa: "", sessionsZh: "",
  time: "", timeEn: "", timeJa: "", timeZh: "",
  recovery: "", recoveryEn: "", recoveryJa: "", recoveryZh: "",
  slug: "", badge: "", badgeColor: "#4A6FA5", sortOrder: "0",
  youtubeUrl: "", imageUrl: "", bgImageUrl: "", isBest: false,
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminEquipment3New() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = trpc.equipment3.create.useMutation();
  const uploadMutation = trpc.equipment3.uploadImage.useMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // name 변경 시 slug 자동 생성 (slug가 비어있을 때만)
      if (name === "name" && !prev.slug) {
        updated.slug = toSlug(value);
      }
      return updated;
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const result = await uploadMutation.mutateAsync({ base64, fileName: file.name, mimeType: file.type });
        setForm((prev) => ({ ...prev, imageUrl: result.url }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("이미지 업로드에 실패했습니다.");
      setUploading(false);
    }
  }

  async function handleBgImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    setUploadingBg(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        const result = await uploadMutation.mutateAsync({ base64, fileName: file.name, mimeType: file.type });
        setForm((prev) => ({ ...prev, bgImageUrl: result.url }));
        setUploadingBg(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert("배경 이미지 업로드에 실패했습니다.");
      setUploadingBg(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { alert("시술명(한국어)은 필수입니다."); return; }
    if (!form.slug.trim()) { alert("슬러그는 필수입니다."); return; }
    setSubmitting(true);
    try {
      await createMutation.mutateAsync({
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
        isActive: "1",
        isBest: form.isBest ? "1" : "0",
      });
      alert("✅ 시술이 등록되었습니다!");
      navigate("/admin/equipment3");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      alert(`❌ 등록 실패: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  }

  // 언어별 필드 그룹 렌더러
  function MultiLangField({
    label, fieldKey, type = "input", rows = 4,
  }: { label: string; fieldKey: string; type?: "input" | "textarea"; rows?: number }) {
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
            const value = form[name as keyof FormData];
            if (typeof value === 'boolean') return null; // isBest 같은 boolean 필드 제외
            return type === "textarea" ? (
              <div key={code}>
                <Label className="text-xs text-gray-500 mb-1 block">{placeholder}</Label>
                <Textarea
                  name={name}
                  value={value}
                  onChange={handleChange}
                  placeholder={placeholder}
                  rows={rows}
                  className="text-sm"
                />
              </div>
            ) : (
              <div key={code}>
                <Label className="text-xs text-gray-500 mb-1 block">{placeholder}</Label>
                <Input
                  name={name}
                  value={value}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="text-sm"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/equipment3")}
            className="p-2 hover:bg-gray-200 rounded-md transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">새 시술 등록</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <MultiLangField label="시술명 *" fieldKey="name" />
              <MultiLangField label="카테고리" fieldKey="category" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug" className="font-semibold">슬러그 (URL) *</Label>
                  <Input
                    id="slug" name="slug" value={form.slug} onChange={handleChange}
                    placeholder="예: laser-toning"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    URL: /equipment3/<strong>{form.slug || "slug"}</strong>
                  </p>
                </div>
                <div>
                  <Label htmlFor="sortOrder" className="font-semibold">정렬 순서</Label>
                  <Input
                    id="sortOrder" name="sortOrder" type="number" value={form.sortOrder}
                    onChange={handleChange} className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge" className="font-semibold">뱃지 텍스트</Label>
                  <Input id="badge" name="badge" value={form.badge} onChange={handleChange} placeholder="예: 인기" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="badgeColor" className="font-semibold">뱃지 색상</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" name="badgeColor" value={form.badgeColor}
                      onChange={handleChange} className="h-9 w-12 rounded cursor-pointer border" />
                    <Input name="badgeColor" value={form.badgeColor} onChange={handleChange} className="flex-1" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBest"
                  checked={form.isBest}
                  onChange={(e) => setForm((prev) => ({ ...prev, isBest: e.target.checked }))}
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
                    <button type="button" onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))}
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
                    <button type="button" onClick={() => setForm((p) => ({ ...p, bgImageUrl: "" }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X className="h-4 w-4" />
                    </button>
                    {/* 오버레이 미리보기 */}
                    <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-center px-4 py-3">
                        <p className="text-[9px] font-semibold tracking-widest uppercase text-white/80">TREATMENT NAME</p>
                        <p className="text-lg font-black text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>시술명 오버레이</p>
                        <p className="text-xs font-semibold text-white/90">［ Category ］</p>
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
              <MultiLangField label="짧은 설명 (카드 미리보기)" fieldKey="desc" type="textarea" rows={3} />
              <MultiLangField label="상세 설명 (마크다운 지원)" fieldKey="detail" type="textarea" rows={6} />
            </CardContent>
          </Card>

          {/* 시술 정보 */}
          <Card>
            <CardHeader><CardTitle>시술 정보</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <MultiLangField label="기대 효과" fieldKey="effect" type="textarea" rows={4} />
              <MultiLangField label="주의사항" fieldKey="caution" type="textarea" rows={4} />
              <MultiLangField label="시술 시간" fieldKey="time" />
              <MultiLangField label="회복 기간" fieldKey="recovery" />
              <MultiLangField label="권장 횟수" fieldKey="sessions" />
            </CardContent>
          </Card>

          {/* 미디어 */}
          <Card>
            <CardHeader><CardTitle>YouTube 영상</CardTitle></CardHeader>
            <CardContent>
              <Label htmlFor="youtubeUrl">YouTube embed URL</Label>
              <Input
                id="youtubeUrl" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                YouTube 영상 URL: https://www.youtube.com/embed/VIDEO_ID 형식
              </p>
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex gap-3 justify-end pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/equipment3")}>
              취소
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "등록 중..." : "시술 등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
