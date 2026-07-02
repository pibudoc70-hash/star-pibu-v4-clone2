/**
 * AdminEventsTab - 이벤트 관리 탭 (언어별 탭 구조)
 * 각 언어(한국어, 일본어, 영어, 중국어)별로 독립적으로 이벤트를 관리할 수 있습니다.
 */
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { EventListItem, EventFormState, PriceRow } from "@/types/admin";

interface CurrentUser {
  role: string;
}

interface Props {
  currentUser: CurrentUser;
}

type TargetLang = "ko" | "en" | "ja" | "zh";

const LANG_LABELS: Record<TargetLang, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

const LANG_TABS: TargetLang[] = ["ko", "en", "ja", "zh"];

const EMPTY_EVENT_FORM: EventFormState = {
  type: "이벤트",
  title: "",
  subtitle: "",
  desc: "",
  content: "",
  date: "",
  badge: "",
  badgeColor: "#4A6FA5",
  accent: "#4A6FA5",
  accentDark: "#2D4A7A",
  accentBg: "#EEF3FA",
  iconBg: "#E0EBF7",
  iconType: "tag",
  tag: "",
  hot: "0",
  cta: "자세히 보기",
  views: 0,
  isFeatured: "0",
  sortOrder: 0,
  isActive: "1",
  category: "이벤트",
  imageUrl: "",
  productName: "",
  normalPrice: 0,
  discountPrice: 0,
  priceRows: [],
  isSpecialEvent: "0",
  anesthesiaFee: "",
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
  productNameEn: "",
  productNameJa: "",
  productNameZh: "",
};

function SortableEventItem({
  event,
  onEdit,
  onDelete,
}: {
  event: EventListItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: event.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="font-bold text-[#1F2937]">{event.title}</h4>
          {event.featured && (
            <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] text-xs font-semibold rounded">
              Featured
            </span>
          )}
          {event.isActive === "1" && (
            <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded">
              활성화
            </span>
          )}
          {event.isActive === "0" && (
            <span className="px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold rounded">
              비활성화
            </span>
          )}
        </div>
        <p className="text-sm text-[#6B7280]">{event.subtitle}</p>
        <div className="flex gap-4 text-xs text-[#9CA3AF] mt-2 flex-wrap">
          <span>{event.date}</span>
          <span>카테고리: {event.category || "이벤트"}</span>
          <span>조회수: {event.views || 0}</span>
        </div>
      </div>
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          onPointerDownCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDownCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
        >
          <Pencil size={16} className="text-[#6B7280]" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          onPointerDownCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDownCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-2 rounded-lg hover:bg-[#FEE2E2] transition-colors"
        >
          <Trash2 size={16} className="text-[#EF4444]" />
        </button>
      </div>
    </div>
  );
}

export default function AdminEventsTab({ currentUser }: Props) {
  const [activeLang, setActiveLang] = useState<TargetLang>("ko");
  const [eventForm, setEventForm] = useState<EventFormState | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [sortedEventsList, setSortedEventsList] = useState<EventListItem[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const utils = trpc.useUtils();

  // 언어별 이벤트 목록 조회
  const { data: eventsList } = trpc.events.listByLang.useQuery(
    { lang: activeLang },
    {
      enabled: currentUser.role === "admin",
    }
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (eventsList) setSortedEventsList([...eventsList]);
  }, [eventsList]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const createEventMutation = trpc.events.create.useMutation({
    onSuccess: () => {
      utils.events.listByLang.invalidate({ lang: activeLang });
      toast.success("이벤트가 추가되었습니다.");
      setEventForm(null);
    },
    onError: () => toast.error("추가에 실패했습니다."),
  });

  const updateEventMutation = trpc.events.update.useMutation({
    onSuccess: () => {
      utils.events.listByLang.invalidate({ lang: activeLang });
      toast.success("이벤트가 수정되었습니다.");
      setEventForm(null);
      setEditingEventId(null);
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const deleteEventMutation = trpc.events.delete.useMutation({
    onSuccess: () => {
      utils.events.listByLang.invalidate({ lang: activeLang });
      toast.success("이벤트가 삭제되었습니다.");
    },
    onError: () => toast.error("삭제에 실패했습니다."),
  });

  const uploadEventImageMutation = trpc.events.uploadImage.useMutation({
    onError: () => toast.error("이미지 업로드에 실패했습니다."),
  });

  const translateEventMutation = trpc.events.translate.useMutation({
    onError: () => toast.error("번역에 실패했습니다."),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedEventsList.findIndex((e) => e.id === active.id);
      const newIndex = sortedEventsList.findIndex((e) => e.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newList = arrayMove(sortedEventsList, oldIndex, newIndex);
        setSortedEventsList(newList);
        newList.forEach((ev, index) => {
          if (ev.sortOrder !== index) {
            updateEventMutation.mutate({ id: ev.id, sortOrder: index });
          }
        });
      }
    }
  };

  const handleAutoTranslate = async (targetLang: "en" | "ja" | "zh") => {
    if (!eventForm?.title) {
      toast.error("제목을 먼저 입력해주세요.");
      return;
    }
    setTranslating(targetLang);
    try {
      const langSuffix = targetLang.charAt(0).toUpperCase() + targetLang.slice(1);
      const fields: Record<string, string> = {
        [`title${langSuffix}`]: eventForm.title || "",
        [`subtitle${langSuffix}`]: eventForm.subtitle || "",
        [`desc${langSuffix}`]: eventForm.desc || "",
        [`productName${langSuffix}`]: eventForm.productName || "",
      };
      const updates: Record<string, string> = {};
      for (const [key, text] of Object.entries(fields)) {
        if (text.trim()) {
          const res = await translateEventMutation.mutateAsync({ text, targetLang, field: key });
          updates[key] = res.translated;
        }
      }
      setEventForm((prev) => (prev ? { ...prev, ...updates } : null));
      toast.success(`${targetLang.toUpperCase()} 번역 완료!`);
    } finally {
      setTranslating(null);
    }
  };

  const handleSubmitEvent = () => {
    if (!eventForm?.title || !eventForm.date) {
      toast.error("제목과 날짜를 입력해주세요.");
      return;
    }
    if (editingEventId) {
      const { id: _id, type: _type, category: _cat, ...rest } = { id: editingEventId, ...eventForm };
      updateEventMutation.mutate({
        id: editingEventId,
        type: _type as "이벤트" | "공지" | undefined,
        category: _cat as "신규시술" | "이벤트" | "공지사항" | "기타" | undefined,
        ...rest,
        priceRows: Array.isArray(rest.priceRows) ? rest.priceRows : [],
      });
    } else {
      createEventMutation.mutate({
        title: eventForm.title,
        date: eventForm.date,
        type: (eventForm.type as "이벤트" | "공지") ?? "이벤트",
        subtitle: eventForm.subtitle ?? "",
        desc: eventForm.desc ?? "",
        content: eventForm.content ?? "",
        isFeatured: eventForm.isFeatured ?? "0",
        badge: eventForm.badge ?? "",
        tag: eventForm.tag ?? "",
        hot: eventForm.hot ?? "0",
        cta: eventForm.cta ?? "자세히 보기",
        accent: eventForm.accent ?? "#4A6FA5",
        accentDark: eventForm.accentDark ?? "#2D4A7B",
        accentBg: eventForm.accentBg ?? "#EEF3FA",
        iconBg: eventForm.iconBg ?? "#E0EBF7",
        iconType: eventForm.iconType ?? "tag",
        badgeColor: eventForm.badgeColor ?? "#4A6FA5",
        imageUrl: eventForm.imageUrl,
        sortOrder: eventForm.sortOrder ?? 0,
        isActive: eventForm.isActive ?? "1",
        category: (eventForm.category as "신규시술" | "이벤트" | "공지사항" | "기타") ?? "이벤트",
        isSpecialEvent: eventForm.isSpecialEvent ?? "0",
        productName: eventForm.productName ?? "",
        normalPrice: eventForm.normalPrice ?? 0,
        discountPrice: eventForm.discountPrice ?? 0,
        priceRows: Array.isArray(eventForm.priceRows) ? eventForm.priceRows : [],
        anesthesiaFee: eventForm.anesthesiaFee ?? "",
        targetLang: activeLang,
        titleEn: eventForm.titleEn ?? "",
        titleJa: eventForm.titleJa ?? "",
        titleZh: eventForm.titleZh ?? "",
        subtitleEn: eventForm.subtitleEn ?? "",
        subtitleJa: eventForm.subtitleJa ?? "",
        subtitleZh: eventForm.subtitleZh ?? "",
        descEn: eventForm.descEn ?? "",
        descJa: eventForm.descJa ?? "",
        descZh: eventForm.descZh ?? "",
        productNameEn: eventForm.productNameEn ?? "",
        productNameJa: eventForm.productNameJa ?? "",
        productNameZh: eventForm.productNameZh ?? "",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* 언어 탭 */}
      <div className="px-8 py-6 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="flex gap-2">
          {LANG_TABS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setActiveLang(lang);
                setEventForm(null);
                setEditingEventId(null);
              }}
              className="px-4 py-2 rounded-lg font-semibold transition-all text-sm"
              style={{
                background: activeLang === lang ? "#4A6FA5" : "#E5E7EB",
                color: activeLang === lang ? "white" : "#6B7280",
              }}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setEventForm({ ...EMPTY_EVENT_FORM, targetLang: activeLang });
            setEditingEventId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all"
          style={{ background: "#4A6FA5" }}
        >
          <Plus size={16} />
          새 이벤트 추가
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          {/* 이벤트 추가/수정 폼 */}
          {eventForm && (
            <div className="bg-white border-2 border-[#4A6FA5] rounded-xl p-6 space-y-4 mb-6">
              <h3 className="font-bold text-[#1F2937]">
                {editingEventId ? "이벤트 수정" : "새 이벤트 추가"} ({LANG_LABELS[activeLang]})
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="부제목"
                  value={eventForm.subtitle}
                  onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                />
              </div>
              <textarea
                placeholder="설명"
                value={eventForm.desc}
                onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                rows={3}
              />
              <textarea
                placeholder="내용 (상세 설명, 선택사항)"
                value={eventForm.content}
                onChange={(e) => setEventForm({ ...eventForm, content: e.target.value })}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="날짜 (예: 2026년 3월 28일) *필수"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                />
                <select
                  value={eventForm.category || "이벤트"}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                >
                  <option value="신규시술">신규시술</option>
                  <option value="이벤트">이벤트</option>
                  <option value="공지사항">공지사항</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              {/* 가격 행 관리 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#1F2937]">가격 정보</label>
                  <button
                    type="button"
                    onClick={() =>
                      setEventForm({
                        ...eventForm,
                        priceRows: [
                          ...(eventForm.priceRows || []),
                          { label: "", normalPrice: 0, discountPrice: 0 },
                        ],
                      })
                    }
                    className="text-xs px-2 py-1 rounded bg-[#4A6FA5] text-white"
                  >
                    + 행 추가
                  </button>
                </div>
                {(eventForm.priceRows || []).map((row: PriceRow, idx: number) => (
                  <div key={idx} className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="항목명"
                      value={row.label}
                      onChange={(e) => {
                        const newRows = [...(eventForm.priceRows || [])];
                        newRows[idx] = { ...row, label: e.target.value };
                        setEventForm({ ...eventForm, priceRows: newRows });
                      }}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="정가"
                      value={row.normalPrice}
                      onChange={(e) => {
                        const newRows = [...(eventForm.priceRows || [])];
                        newRows[idx] = { ...row, normalPrice: parseInt(e.target.value) || 0 };
                        setEventForm({ ...eventForm, priceRows: newRows });
                      }}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="할인가"
                      value={row.discountPrice}
                      onChange={(e) => {
                        const newRows = [...(eventForm.priceRows || [])];
                        newRows[idx] = { ...row, discountPrice: parseInt(e.target.value) || 0 };
                        setEventForm({ ...eventForm, priceRows: newRows });
                      }}
                      className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newRows = eventForm.priceRows?.filter((_: PriceRow, i: number) => i !== idx) || [];
                        setEventForm({ ...eventForm, priceRows: newRows });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1F2937]">이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={imageUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUploading(true);
                    try {
                      const reader = new FileReader();
                      reader.onload = async (ev) => {
                        const fileData = ev.target?.result as string;
                        try {
                          const result = await uploadEventImageMutation.mutateAsync({
                            fileData,
                            fileName: file.name,
                            mimeType: file.type || "image/jpeg",
                          });
                          if (result.url) {
                            setEventForm({ ...eventForm, imageUrl: result.url });
                            toast.success("이미지가 업로드되었습니다.");
                          }
                        } catch (err) {
                          if (import.meta.env.DEV) console.error("[Upload Error]", err);
                        } finally {
                          setImageUploading(false);
                        }
                      };
                      reader.onerror = () => {
                        toast.error("파일 읽기에 실패했습니다.");
                        setImageUploading(false);
                      };
                      reader.readAsDataURL(file);
                    } catch {
                      toast.error("이미지 업로드에 실패했습니다.");
                      setImageUploading(false);
                    }
                  }}
                  className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                />
                {eventForm.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={eventForm.imageUrl}
                      alt="미리보기"
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      onClick={() => setEventForm({ ...eventForm, imageUrl: "" })}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      이미지 제거
                    </button>
                  </div>
                )}
              </div>

              {/* 이벤트 유형 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1F2937]">이벤트 유형</label>
                <select
                  value={
                    eventForm.isSpecialEvent === "1"
                      ? "special"
                      : eventForm.isFeatured === "1"
                      ? "featured"
                      : "normal"
                  }
                  onChange={(e) => {
                    if (e.target.value === "special") {
                      setEventForm({ ...eventForm, isSpecialEvent: "1", isFeatured: "0" });
                    } else if (e.target.value === "featured") {
                      setEventForm({ ...eventForm, isSpecialEvent: "0", isFeatured: "1" });
                    } else {
                      setEventForm({ ...eventForm, isSpecialEvent: "0", isFeatured: "0" });
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                >
                  <option value="normal">일반 이벤트</option>
                  <option value="featured">Featured 이벤트</option>
                  <option value="special">SPECIAL EVENT</option>
                </select>
              </div>

              {/* 수면마취비 */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1F2937]">수면마취비 정보</label>
                <input
                  type="text"
                  placeholder="예: 수면마취비 별도"
                  value={eventForm.anesthesiaFee || ""}
                  onChange={(e) => setEventForm({ ...eventForm, anesthesiaFee: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm"
                />
              </div>

              {/* 다국어 설정 (다른 언어 필드) */}
              {activeLang === "ko" && (
                <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4 bg-[#F9FAFB]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1F2937]">다국어 번역</h4>
                    <div className="flex gap-2">
                      {(["en", "ja", "zh"] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          disabled={translating === lang}
                          onClick={() => handleAutoTranslate(lang)}
                          className="px-3 py-1 text-xs font-semibold rounded-full border transition-colors"
                          style={{
                            background: translating === lang ? "#E5E7EB" : "#4A6FA5",
                            color: translating === lang ? "#9CA3AF" : "#fff",
                            borderColor: "#4A6FA5",
                          }}
                        >
                          {translating === lang ? "번역중..." : `AI ${lang.toUpperCase()} 번역`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#9CA3AF]">
                    한국어로 작성 후 AI 번역 버튼을 클릭하면 자동으로 다국어 필드가 채워집니다.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eventForm.isActive === "1"}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, isActive: e.target.checked ? "1" : "0" })
                  }
                  className="w-4 h-4"
                />
                <label className="text-sm text-[#6B7280]">활성화</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEventForm(null);
                    setEditingEventId(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-[#6B7280] border border-[#D1D5DB] transition-colors hover:bg-[#F3F4F6]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmitEvent}
                  disabled={createEventMutation.isPending || updateEventMutation.isPending}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-60"
                  style={{ background: "#4A6FA5" }}
                >
                  {editingEventId ? "수정" : "추가"}
                </button>
              </div>
            </div>
          )}

          {/* 이벤트 목록 */}
          {sortedEventsList.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedEventsList.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {sortedEventsList.map((event: EventListItem) => (
                    <SortableEventItem
                      key={event.id}
                      event={event}
                      onEdit={() => {
                        const formData: EventFormState = {
                          type: event.type || "이벤트",
                          title: event.title,
                          subtitle: event.subtitle || "",
                          desc: event.desc || "",
                          content: (event.content as string) || "",
                          date: event.date,
                          badge: (event.badge as string) || "",
                          badgeColor: (event.badgeColor as string) || "#4A6FA5",
                          accent: (event.accent as string) || "#4A6FA5",
                          accentDark: (event.accentDark as string) || "#2D4A7B",
                          accentBg: (event.accentBg as string) || "#EEF3FA",
                          iconBg: (event.iconBg as string) || "#E0EBF7",
                          iconType: (event.iconType as string) || "tag",
                          tag: (event.tag as string) || "",
                          hot: (event.hot as "0" | "1") || "0",
                          cta: (event.cta as string) || "자세히 보기",
                          views: event.views || 0,
                          isFeatured: (event.isFeatured as "0" | "1") || "0",
                          sortOrder: event.sortOrder || 0,
                          isActive: (event.isActive as "0" | "1") || "1",
                          category: event.category || "이벤트",
                          imageUrl: event.imageUrl || "",
                          productName: event.productName || "",
                          normalPrice: (event.normalPrice as number) || 0,
                          discountPrice: (event.discountPrice as number) || 0,
                          priceRows: (typeof event.priceRows === 'string' ? JSON.parse(event.priceRows) : event.priceRows) || [],
                          isSpecialEvent: (event.isSpecialEvent as "0" | "1") || "0",
                          anesthesiaFee: event.anesthesiaFee || "",
                          targetLang: event.targetLang || "ko",
                          titleEn: event.titleEn || "",
                          titleJa: event.titleJa || "",
                          titleZh: event.titleZh || "",
                          subtitleEn: event.subtitleEn || "",
                          subtitleJa: event.subtitleJa || "",
                          subtitleZh: event.subtitleZh || "",
                          descEn: event.descEn || "",
                          descJa: event.descJa || "",
                          descZh: event.descZh || "",
                          productNameEn: event.productNameEn || "",
                          productNameJa: event.productNameJa || "",
                          productNameZh: event.productNameZh || "",
                        };
                        setEventForm(formData);
                        setEditingEventId(event.id);
                      }}
                      onDelete={() => {
                        if (confirm("정말 삭제하시겠습니까?")) {
                          deleteEventMutation.mutate({ id: event.id });
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#9CA3AF] text-sm">
                {LANG_LABELS[activeLang]} 언어로 등록된 이벤트가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
