/**
 * AdminPopupTab - 팝업 이벤트 관리 탭 (언어별 탭 구조)
 * 각 언어(한국어, 영어, 일본어, 중국어)별로 독립적으로 팝업 이벤트를 관리합니다.
 * AdminEventsTab과 동일한 패턴을 따릅니다.
 */
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Megaphone } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { PopupEventItem, PopupFormState } from "@/types/admin";

interface CurrentUser {
  role: string;
}

interface Props {
  currentUser: CurrentUser;
}

type TargetLang = "ko" | "en" | "ja" | "zh";

const LANG_LABELS: Record<TargetLang, string> = {
  ko: "🇰🇷 한국어",
  en: "🇺🇸 English",
  ja: "🇯🇵 日本語",
  zh: "🇨🇳 中文",
};

const LANG_TABS: TargetLang[] = ["ko", "en", "ja", "zh"];

/** 언어 코드에 따른 제목/부제목/설명/배지/주의사항 필드 키 반환 */
function getLangFields(lang: TargetLang) {
  if (lang === "ko") {
    return {
      titleKey: "title" as const,
      subtitleKey: "subtitle" as const,
      descKey: "desc" as const,
      badgeKey: "badge" as const,
      noteKey: "note" as const,
    };
  }
  const suffix = lang.charAt(0).toUpperCase() + lang.slice(1) as "En" | "Ja" | "Zh";
  return {
    titleKey: `title${suffix}` as keyof PopupFormState,
    subtitleKey: `subtitle${suffix}` as keyof PopupFormState,
    descKey: `desc${suffix}` as keyof PopupFormState,
    badgeKey: `badge${suffix}` as keyof PopupFormState,
    noteKey: `note${suffix}` as keyof PopupFormState,
  };
}

/** 팝업 아이템에서 현재 언어의 제목 반환 (폴백: 한국어) */
function getLocalizedTitle(ev: PopupEventItem, lang: TargetLang): string {
  if (lang === "ko") return ev.title;
  const map: Record<Exclude<TargetLang, "ko">, string | null | undefined> = {
    en: ev.titleEn,
    ja: ev.titleJa,
    zh: ev.titleZh,
  };
  return map[lang as Exclude<TargetLang, "ko">] || ev.title;
}

const EMPTY_FORM: PopupFormState = {
  tab: "",
  badge: "",
  title: "",
  subtitle: "",
  desc: "",
  note: "",
  priceItems: "[]",
  imageUrl: "",
  clickUrl: "",
  accent: "#4A6FA5",
  accentLight: "#EEF4FF",
  sortOrder: 0,
  isActive: "1",
  startAt: null,
  endAt: null,
  targetLang: "ko",
  titleEn: "",
  titleJa: "",
  titleZh: "",
  subtitleEn: "",
  subtitleJa: "",
  subtitleZh: "",
  descEn: "",
  descJa: "",
  descZh: "",
  badgeEn: "",
  badgeJa: "",
  badgeZh: "",
  noteEn: "",
  noteJa: "",
  noteZh: "",
};

export default function AdminPopupTab({ currentUser }: Props) {
  const [now] = useState(() => Date.now());
  const [activeLang, setActiveLang] = useState<TargetLang>("ko");
  const [popupForm, setPopupForm] = useState<PopupFormState | null>(null);
  const [popupEditId, setPopupEditId] = useState<number | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const utils = trpc.useUtils();

  const { data: popupList } = trpc.popup.adminList.useQuery(undefined, {
    enabled: currentUser.role === "admin",
  });

  const createPopupMutation = trpc.popup.create.useMutation({
    onSuccess: () => {
      utils.popup.adminList.invalidate();
      toast.success("팝업 이벤트가 추가되었습니다.");
      setPopupForm(null);
    },
    onError: () => toast.error("추가에 실패했습니다."),
  });

  const updatePopupMutation = trpc.popup.update.useMutation({
    onSuccess: () => {
      utils.popup.adminList.invalidate();
      toast.success("팝업 이벤트가 수정되었습니다.");
      setPopupEditId(null);
      setPopupForm(null);
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const deletePopupMutation = trpc.popup.delete.useMutation({
    onSuccess: () => {
      utils.popup.adminList.invalidate();
      toast.success("팝업 이벤트가 삭제되었습니다.");
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const uploadImageMutation = trpc.popup.uploadImage.useMutation({
    onSuccess: (data) => {
      setPopupForm((f) => (f ? { ...f, imageUrl: data.url } : f));
      toast.success("이미지가 업로드되었습니다.");
      setImageUploading(false);
    },
    onError: (err) => {
      toast.error("이미지 업로드 실패: " + err.message);
      setImageUploading(false);
    },
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기가 5MB를 초과합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setImageUploading(true);
      uploadImageMutation.mutate({ base64, fileName: file.name, mimeType: file.type || "image/jpeg" });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const togglePopupActive = (id: number, current: "0" | "1") => {
    updatePopupMutation.mutate({ id, isActive: current === "1" ? "0" : "1" });
  };

  const openNewPopupForm = () => {
    setPopupEditId(null);
    setPopupForm({ ...EMPTY_FORM, targetLang: activeLang });
  };

  const openEditPopupForm = (ev: PopupEventItem) => {
    setPopupEditId(ev.id);
    setPopupForm({
      tab: ev.tab,
      badge: ev.badge,
      title: ev.title,
      subtitle: ev.subtitle,
      desc: ev.desc,
      note: ev.note,
      priceItems: JSON.stringify(ev.priceItems ?? []),
      imageUrl: ev.imageUrl ?? "",
      clickUrl: ev.clickUrl ?? "",
      accent: ev.accent,
      accentLight: ev.accentLight,
      sortOrder: ev.sortOrder,
      isActive: ev.isActive,
      startAt: ev.startAt ?? null,
      endAt: ev.endAt ?? null,
      targetLang: ev.targetLang ?? activeLang,
      titleEn: ev.titleEn ?? "",
      titleJa: ev.titleJa ?? "",
      titleZh: ev.titleZh ?? "",
      subtitleEn: ev.subtitleEn ?? "",
      subtitleJa: ev.subtitleJa ?? "",
      subtitleZh: ev.subtitleZh ?? "",
      descEn: ev.descEn ?? "",
      descJa: ev.descJa ?? "",
      descZh: ev.descZh ?? "",
      badgeEn: ev.badgeEn ?? "",
      badgeJa: ev.badgeJa ?? "",
      badgeZh: ev.badgeZh ?? "",
      noteEn: ev.noteEn ?? "",
      noteJa: ev.noteJa ?? "",
      noteZh: ev.noteZh ?? "",
    });
  };

  const submitPopupForm = () => {
    if (!popupForm) return;
    if (popupEditId !== null) {
      updatePopupMutation.mutate({ id: popupEditId, ...popupForm });
    } else {
      createPopupMutation.mutate(popupForm);
    }
  };

  /** 현재 언어 탭에 해당하는 팝업 목록 필터링 */
  const filteredList = (popupList ?? []).filter((ev: PopupEventItem) => {
    // targetLang이 현재 탭 언어이거나 "all"인 항목 표시
    return ev.targetLang === activeLang || ev.targetLang === "all";
  });

  /** 현재 폼에서 활성 언어 탭 */
  const [formLangTab, setFormLangTab] = useState<TargetLang>("ko");

  return (
    <div className="flex-1 flex flex-col">
      {/* 언어 탭 */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex gap-2">
          {LANG_TABS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setActiveLang(lang);
                setPopupForm(null);
                setPopupEditId(null);
              }}
              className="px-4 py-2 rounded-lg font-semibold transition-all text-sm"
              style={{
                background: activeLang === lang ? "#4A9FA5" : "#E5E7EB",
                color: activeLang === lang ? "white" : "#6B7280",
              }}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={openNewPopupForm}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all text-sm"
          style={{ background: "#4A9FA5" }}
        >
          <Plus size={16} />
          팝업 추가
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* 팝업 추가/수정 폼 */}
        {popupForm && (
          <div className="bg-white border-2 border-[#4A9FA5] rounded-xl shadow-lg mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="font-bold text-[#1F2937]">
                {popupEditId !== null ? "팝업 수정" : "새 팝업 추가"}
              </h3>
              <button
                type="button"
                onClick={() => { setPopupForm(null); setPopupEditId(null); }}
                className="text-[#9CA3AF] hover:text-[#374151] text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* 폼 내 언어 탭 */}
            <div className="px-6 pt-4 flex gap-2 border-b border-[#E5E7EB] pb-3">
              {LANG_TABS.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setFormLangTab(lang)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: formLangTab === lang ? "#4A9FA5" : "#F3F4F6",
                    color: formLangTab === lang ? "white" : "#6B7280",
                  }}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
              <span className="ml-2 text-xs text-[#9CA3AF] self-center">
                각 언어별 콘텐츠를 입력하세요
              </span>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* 언어별 콘텐츠 입력 */}
              {(() => {
                const fields = getLangFields(formLangTab);
                const isKo = formLangTab === "ko";
                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`popup-${fields.badgeKey}`} className="text-xs font-semibold text-[#374151] mb-1 block">
                          배지 {isKo && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          id={`popup-${fields.badgeKey}`}
                          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                          value={(popupForm[fields.badgeKey] as string) ?? ""}
                          onChange={(e) => setPopupForm((f) => f && { ...f, [fields.badgeKey]: e.target.value })}
                          placeholder={isKo ? "확장기념 특가" : `Badge (${formLangTab.toUpperCase()})`}
                        />
                      </div>
                      <div>
                        <label htmlFor="popup-tab" className="text-xs font-semibold text-[#374151] mb-1 block">
                          탭 레이블 {isKo && <span className="text-red-500">*</span>}
                        </label>
                        {isKo ? (
                          <input
                            id="popup-tab"
                            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                            value={popupForm.tab}
                            onChange={(e) => setPopupForm((f) => f && { ...f, tab: e.target.value })}
                            placeholder="세르프 이벤트"
                          />
                        ) : (
                          <input
                            id="popup-tab"
                            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm bg-[#F9FAFB] text-[#9CA3AF]"
                            value={popupForm.tab}
                            disabled
                            placeholder="한국어 탭에서 설정"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`popup-${fields.titleKey}`} className="text-xs font-semibold text-[#374151] mb-1 block">
                        제목 {isKo && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id={`popup-${fields.titleKey}`}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                        value={(popupForm[fields.titleKey] as string) ?? ""}
                        onChange={(e) => setPopupForm((f) => f && { ...f, [fields.titleKey]: e.target.value })}
                        placeholder={isKo ? "이벤트 제목" : `Title (${formLangTab.toUpperCase()})`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`popup-${fields.subtitleKey}`} className="text-xs font-semibold text-[#374151] mb-1 block">부제목</label>
                      <input
                        id={`popup-${fields.subtitleKey}`}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                        value={(popupForm[fields.subtitleKey] as string) ?? ""}
                        onChange={(e) => setPopupForm((f) => f && { ...f, [fields.subtitleKey]: e.target.value })}
                        placeholder={isKo ? "부제목 (선택사항)" : `Subtitle (${formLangTab.toUpperCase()})`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`popup-${fields.descKey}`} className="text-xs font-semibold text-[#374151] mb-1 block">설명</label>
                      <textarea
                        id={`popup-${fields.descKey}`}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                        rows={3}
                        value={(popupForm[fields.descKey] as string) ?? ""}
                        onChange={(e) => setPopupForm((f) => f && { ...f, [fields.descKey]: e.target.value })}
                        placeholder={isKo ? "팝업 설명 (선택사항)" : `Description (${formLangTab.toUpperCase()})`}
                      />
                    </div>
                    <div>
                      <label htmlFor={`popup-${fields.noteKey}`} className="text-xs font-semibold text-[#374151] mb-1 block">주의사항 / 안내문구</label>
                      <input
                        id={`popup-${fields.noteKey}`}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                        value={(popupForm[fields.noteKey] as string) ?? ""}
                        onChange={(e) => setPopupForm((f) => f && { ...f, [fields.noteKey]: e.target.value })}
                        placeholder={isKo ? "주의사항 (선택사항)" : `Note (${formLangTab.toUpperCase()})`}
                      />
                    </div>
                  </div>
                );
              })()}

              <hr className="border-[#E5E7EB]" />

              {/* 공통 설정 (이미지, URL, 기간 등) */}
              <p className="text-xs font-bold text-[#374151] uppercase tracking-wide">공통 설정</p>

              {/* 이미지 업로드 */}
              <div>
                <span className="text-xs font-semibold text-[#374151] mb-1 block">이미지</span>
                {popupForm.imageUrl && (
                  <div className="relative mb-2 inline-block">
                    <img
                      src={popupForm.imageUrl}
                      alt="미리보기"
                      className="h-24 w-auto rounded-xl border border-[#E5E7EB] object-contain bg-[#F9FAFB]"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      onClick={() => setPopupForm((f) => (f ? { ...f, imageUrl: "" } : f))}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label="이미지 제거"
                      title="이미지 제거"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <label
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-all text-sm ${
                    imageUploading
                      ? "border-[#4A9FA5] bg-[#F0FAFA] text-[#4A9FA5]"
                      : "border-[#D1D5DB] hover:border-[#4A9FA5] hover:bg-[#F0FAFA] text-[#6B7280] hover:text-[#4A9FA5]"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={imageUploading}
                  />
                  {imageUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#4A9FA5] border-t-transparent rounded-full animate-spin" />
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {popupForm.imageUrl ? "다른 이미지 선택" : "이미지 파일 선택 (JPG/PNG/WEBP, 최대 5MB)"}
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-400 mt-1">PNG/JPEG 업로드 시 WebP로 자동 변환 및 1600px 리사이즈됩니다.</p>
                <input
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs mt-2 text-[#9CA3AF]"
                  value={popupForm.imageUrl}
                  onChange={(e) => setPopupForm((f) => f && { ...f, imageUrl: e.target.value })}
                  placeholder="또는 URL 직접 입력 (https://...)"
                />
              </div>

              {/* 클릭 URL */}
              <div>
                <label htmlFor="popup-click-url" className="text-xs font-semibold text-[#374151] mb-1 block">클릭 시 이동 URL</label>
                <input
                  id="popup-click-url"
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  value={popupForm.clickUrl}
                  onChange={(e) => setPopupForm((f) => f && { ...f, clickUrl: e.target.value })}
                  placeholder="https://example.com"
                />
                <p className="text-xs text-[#9CA3AF] mt-1">이미지를 클릭했을 때 이동할 URL</p>
              </div>

              {/* 표시 순서 */}
              <div>
                <label htmlFor="popup-sort-order" className="text-xs font-semibold text-[#374151] mb-1 block">표시 순서</label>
                <input
                  id="popup-sort-order"
                  type="number"
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                  value={popupForm.sortOrder}
                  onChange={(e) => setPopupForm((f) => f && { ...f, sortOrder: Number(e.target.value) })}
                />
              </div>

              {/* 유효기간 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="popup-start-at" className="text-xs font-semibold text-[#374151] mb-1 block">
                    시작일 <span className="font-normal text-[#9CA3AF]">(비워두면 즉시)</span>
                  </label>
                  <input
                    id="popup-start-at"
                    type="date"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                    value={popupForm.startAt ? new Date(popupForm.startAt).toISOString().slice(0, 10) : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPopupForm((f) => f && { ...f, startAt: val ? new Date(val + "T00:00:00").getTime() : null });
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="popup-end-at" className="text-xs font-semibold text-[#374151] mb-1 block">
                    종료일 <span className="font-normal text-[#9CA3AF]">(비워두면 무기한)</span>
                  </label>
                  <input
                    id="popup-end-at"
                    type="date"
                    className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm"
                    value={popupForm.endAt ? new Date(popupForm.endAt).toISOString().slice(0, 10) : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPopupForm((f) => f && { ...f, endAt: val ? new Date(val + "T23:59:59").getTime() : null });
                    }}
                  />
                </div>
              </div>

              {(popupForm.startAt || popupForm.endAt) && (
                <div className="text-xs text-[#6B7280] bg-[#F9FAFB] rounded-lg px-3 py-2 border border-[#E5E7EB]">
                  {popupForm.startAt && popupForm.endAt ? (
                    <>
                      표시 기간: <strong>{new Date(popupForm.startAt).toLocaleDateString("ko-KR")}</strong> ~{" "}
                      <strong>{new Date(popupForm.endAt).toLocaleDateString("ko-KR")}</strong>
                      {now > popupForm.endAt && <span className="ml-2 text-red-500 font-semibold">⚠️ 기간 만료</span>}
                      {now < popupForm.startAt && <span className="ml-2 text-amber-500 font-semibold">⏳ 시작 전</span>}
                    </>
                  ) : popupForm.endAt ? (
                    <>종료일: <strong>{new Date(popupForm.endAt).toLocaleDateString("ko-KR")}</strong>
                      {now > popupForm.endAt && <span className="ml-2 text-red-500 font-semibold">⚠️ 기간 만료</span>}
                    </>
                  ) : (
                    <>시작일: <strong>{new Date(popupForm.startAt!).toLocaleDateString("ko-KR")}</strong></>
                  )}
                </div>
              )}

              {/* 활성화 */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={popupForm.isActive === "1"}
                  onChange={(e) => setPopupForm((f) => f && { ...f, isActive: e.target.checked ? "1" : "0" })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActiveCheck" className="text-sm text-[#374151]">
                  팝업에 표시 (활성화)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#E5E7EB] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setPopupForm(null); setPopupEditId(null); }}
                className="px-4 py-2 rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitPopupForm}
                disabled={createPopupMutation.isPending || updatePopupMutation.isPending}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "#4A9FA5" }}
              >
                {createPopupMutation.isPending || updatePopupMutation.isPending
                  ? "저장 중..."
                  : popupEditId !== null ? "수정 저장" : "추가"}
              </button>
            </div>
          </div>
        )}

        {/* 팝업 목록 */}
        <div className="space-y-3">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-[#9CA3AF] text-sm">
              {LANG_LABELS[activeLang]} 팝업이 없습니다.
              <br />
              <span className="text-xs mt-1 block">위의 &quot;팝업 추가&quot; 버튼으로 추가하세요.</span>
            </div>
          ) : (
            filteredList.map((ev: PopupEventItem) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-4"
              >
                {ev.imageUrl ? (
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-16 h-16 object-contain rounded-xl border border-[#F3F4F6] flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: ev.accentLight }}
                  >
                    <Megaphone size={24} style={{ color: ev.accent }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: ev.accentLight, color: ev.accent }}
                    >
                      {ev.badge}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        ev.isActive === "1" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ev.isActive === "1" ? "활성" : "비활성"}
                    </span>
                    {ev.targetLang === "all" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-semibold border border-purple-100">
                        🌐 전체 언어
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-[#1F2937] text-sm truncate">
                    {getLocalizedTitle(ev, activeLang)}
                  </p>
                  <p className="text-xs text-[#9CA3AF] truncate">
                    {ev.tab} · 순서 {ev.sortOrder}
                  </p>
                  {(ev.endAt || ev.startAt) && (
                    <p className="text-xs mt-0.5">
                      {ev.endAt && now > ev.endAt ? (
                        <span className="text-red-500 font-semibold">
                          ⚠️ 기간 만료 ({new Date(ev.endAt).toLocaleDateString("ko-KR")})
                        </span>
                      ) : ev.startAt && now < ev.startAt ? (
                        <span className="text-amber-500 font-semibold">
                          ⏳ {new Date(ev.startAt).toLocaleDateString("ko-KR")} 시작
                        </span>
                      ) : ev.endAt ? (
                        <span className="text-[#6B7280]">
                          ~ {new Date(ev.endAt).toLocaleDateString("ko-KR")} 종료
                        </span>
                      ) : null}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePopupActive(ev.id, ev.isActive)}
                    className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    title={ev.isActive === "1" ? "비활성화" : "활성화"}
                  >
                    {ev.isActive === "1" ? (
                      <Eye size={15} className="text-green-600" />
                    ) : (
                      <EyeOff size={15} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditPopupForm(ev)}
                    className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    title="수정"
                  >
                    <Pencil size={15} className="text-[#6B7280]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("팝업 이벤트를 삭제하시겠습니까?"))
                        deletePopupMutation.mutate({ id: ev.id });
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="삭제"
                  >
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
