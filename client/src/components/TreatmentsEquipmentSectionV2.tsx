/**
 * TreatmentsEquipmentSectionV2 - 시술·장비소개2 (DB 연동)
 * 관리자가 등록한 시술을 기존 시술·장비소개와 동일한 레이아웃으로 표시
 * 카테고리 탭 + 시술 카드 그리드 + 상세 모달
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Clock, RefreshCw, ChevronDown, ChevronUp, Sparkles, ChevronRight, Star } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Treatment {
  id: number;
  categoryId: string;
  name: string;
  nameEn: string;
  desc: string;
  time: string;
  recovery: string;
  badge?: string | null;
  badgeColor?: string | null;
  image?: string | null;
  detail?: string | null;
  caution?: string | null;
  youtubeUrl?: string | null;
  best?: string | null;
  isActive?: string | null;
  images?: string | null;
  imgBg?: string | null;
  cardBannerImage?: string | null;
  sessions?: string | null;
  effect?: string | null;
  related?: string | null;
  steps?: string | null;
  section?: string | null;
  sortOrder?: number;
  modalImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 카테고리 정의
const CATEGORIES = [
  { id: "best", label: "Best 시술", labelEn: "BEST" },
  { id: "lifting", label: "리프팅·탄력", labelEn: "LIFTING" },
  { id: "eye", label: "눈밑지방", labelEn: "EYE" },
  { id: "vitiligo", label: "백반증", labelEn: "VITILIGO" },
  { id: "pigment", label: "색소·문신", labelEn: "PIGMENT" },
  { id: "scar", label: "흉터·모공", labelEn: "SCAR" },
  { id: "acne_laser", label: "여드름", labelEn: "ACNE" },
  { id: "rosacea", label: "홍조·혈관", labelEn: "ROSACEA" },
  { id: "acne", label: "액취증·다한증", labelEn: "HYPERHIDROSIS" },
  { id: "fungus", label: "손·발톱무좀", labelEn: "NAIL FUNGUS" },
  { id: "psoriasis", label: "건선·아토피", labelEn: "PSORIASIS" },
  { id: "volume", label: "볼륨·부스터", labelEn: "VOLUME" },
  { id: "botox", label: "보톡스·필러", labelEn: "BOTOX" },
];

// 카테고리별 배경색
const CAT_IMG_BG: Record<string, string> = {
  best: "#F0F6F8",
  lifting: "#F0F6F8",
  eye: "#F0F6F8",
  rosacea: "#FFFFFF",
  pigment: "#F0F6F8",
  scar: "#F0F6F8",
  volume: "#F0F6F8",
  botox: "#F0F6F8",
  acne_laser: "#F0F6F8",
  acne: "#F0F6F8",
  fungus: "#F0F6F8",
  vitiligo: "#F0F6F8",
  psoriasis: "#F0F6F8",
};

// ─────────────────────────────────────────────────────────────────────────────
// YouTube URL 변환 함수
// ─────────────────────────────────────────────────────────────────────────────
function convertYoutubeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // 이미 embed 형식이면 그대로 반환
  if (url.includes('youtube.com/embed/')) return url;
  
  // 표준 YouTube URL 형식 처리
  // https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // 이미 embed 형식이거나 다른 형식이면 그대로 반환
  return url;
}

// ─────────────────────────────────────────────────────────────────────────────
// 시술 카드 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
function TreatmentCard({ item, index, imgBg }: { item: Treatment; index: number; imgBg: string }) {
  const [open, setOpen] = useState(false);

  // images 필드가 JSON 문자열이면 파싱
  let imageArray: string[] = [];
  if (item.images) {
    try {
      imageArray = typeof item.images === "string" ? JSON.parse(item.images) : [];
    } catch {
      imageArray = [];
    }
  }

  return (
    <>
      <div
        className="treatment-card group cursor-pointer flex flex-col"
        style={{ animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both`, minHeight: "380px" }}
        onClick={() => setOpen(true)}
      >
        {/* 이미지 */}
        <div
          className="relative overflow-hidden"
          style={{
            height: item.cardBannerImage ? "auto" : "200px",
            background: item.cardBannerImage ? "transparent" : (item.imgBg || imgBg),
          }}
        >
          {item.cardBannerImage ? (
            <img
              src={item.cardBannerImage}
              alt={item.name}
              className="w-full h-full object-contain block transition-transform duration-400 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.5";
              }}
            />
          ) : imageArray.length >= 2 ? (
            // 두 이미지 나란히 표시
            <div
              className="w-full h-full flex items-center justify-center gap-2 transition-transform duration-400 group-hover:scale-105"
              style={{ padding: "8px 6px" }}
            >
              {imageArray.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${item.name} ${i + 1}`}
                  className="object-contain flex-none"
                  style={{
                    height: "85%",
                    maxWidth: "48%",
                    filter: "drop-shadow(1px 2px 4px rgba(0,0,0,0.08))",
                  }}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.5";
                  }}
                />
              ))}
            </div>
          ) : item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
              style={{}}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.5";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: "#d1ab67" }}>
              <span className="text-sm">이미지 없음</span>
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <p className="text-xs font-normal mb-0.5 font-montserrat" style={{ color: "#d1ab67" }}>
            {item.nameEn || "TREATMENT"}
          </p>
          <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: "#1F2937" }}>
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3" style={{ color: "#6B7280" }}>
            {item.desc}
          </p>
          <div className="flex gap-3 flex-wrap items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
                <Clock size={11} /> {item.time}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
                <RefreshCw size={11} /> 회복 {item.recovery}
              </span>
            </div>
            <span
              className="inline-flex items-center justify-center rounded-full transition-all duration-200 group-hover:bg-[#d1ab67] group-hover:text-white"
              style={{ width: 22, height: 22, background: "#f6efe0", color: "#d1ab67" }}
            >
              <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" style={{ borderRadius: "1.25rem" }} showCloseButton={false}>
          <DialogTitle className="sr-only">{item.name}</DialogTitle>
          <div className="p-6 flex flex-col" style={{ maxHeight: "90vh", overflow: "hidden" }}>
            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto pr-2">
              {/* YouTube 영상 또는 배너 이미지 */}
              {!item.youtubeUrl && item.cardBannerImage && (
                <div className="mb-5">
                  <img
                    src={item.cardBannerImage}
                    alt={`${item.name} 베너`}
                    className="w-full rounded-xl shadow-md object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              {item.youtubeUrl && (
                <div className="mb-4">
                  <div
                    className="relative w-full rounded-xl overflow-hidden shadow-md"
                    style={{ paddingBottom: "56.25%", height: 0 }}
                  >
                    <iframe
                      src={convertYoutubeUrl(item.youtubeUrl) || item.youtubeUrl}
                      title={`${item.name} 소개 영상`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ border: 0 }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs font-normal mb-1 font-montserrat" style={{ color: "#d1ab67" }}>
                {item.nameEn || "TREATMENT"}
              </p>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#1F2937" }}>
                {item.name}
              </h2>

              {/* 기본 정보 */}
              <div className="flex gap-4 mb-4 p-3 rounded-xl" style={{ background: "#f6efe0" }}>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} style={{ color: "#d1ab67" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      시술 시간
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#374151" }}>
                      {item.time}
                    </p>
                  </div>
                </div>
                <div className="w-px" style={{ background: "#E5E7EB" }} />
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={14} style={{ color: "#d1ab67" }} />
                  <div>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      회복 기간
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "#374151" }}>
                      {item.recovery}
                    </p>
                  </div>
                </div>
                {item.sessions && (
                  <>
                    <div className="w-px" style={{ background: "#E5E7EB" }} />
                    <div className="flex items-center gap-1.5">
                      <RefreshCw size={14} style={{ color: "#d1ab67" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>
                          권장 횟수
                        </p>
                        <p className="text-sm font-semibold" style={{ color: "#374151" }}>
                          {item.sessions}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 상세 설명 */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#4B5563" }}>
                {item.detail || item.desc}
              </p>

              {/* 기대 효과 */}
              {item.effect && (
                <div className="mb-4" style={{ borderTop: "1px solid #f0e8d4", paddingTop: "14px" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles size={12} style={{ color: "#d1ab67" }} />
                    <p className="text-xs font-bold" style={{ color: "#d1ab67" }}>
                      기대 효과
                    </p>
                  </div>
                  <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>
                    {item.effect}
                  </p>
                </div>
              )}

              {/* 기대효과 */}
              {item.caution && (
                <div className="mb-4" style={{ borderTop: "1px solid #f0e8d4", paddingTop: "14px" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-bold" style={{ color: "#d1ab67" }}>
                      ✨ 기대효과
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#374151", lineHeight: 1.6 }}>
                    {item.caution}
                  </p>
                </div>
              )}
            </div>

            {/* CTA 버튼 */}
            <a
              href="https://pf.kakao.com/_HNyGC"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:brightness-95 active:scale-95 mt-4 flex-shrink-0"
              style={{ background: "#FEE500", color: "#191919" }}
              onClick={() => setOpen(false)}
            >
              카카오톡으로 상담하기
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSectionV2() {
  const [activeId, setActiveId] = useState("best");
  const [sortBy, setSortBy] = useState<"name" | "time" | "popular">("popular");
  const [filterOpen, setFilterOpen] = useState(false);

  const sectionRef = useSectionReveal(60);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const sectionTopRef = useRef<HTMLDivElement>(null);

  // DB에서 V2 섹션의 모든 시술 조회
  const { data: treatments = [], isLoading } = trpc.treatments.all.useQuery({ section: "v2" });

  // 카테고리별 필터링 및 정렬
  const filteredTreatments = useMemo(() => {
    let items = treatments.filter((t: Treatment) => {
      if (activeId === "best") {
        // Best 시술: best='1'인 모든 시술 표시
        return t.best === "1" && t.isActive !== "0" && t.section === "v2";
      } else {
        // 다른 탭: categoryId 필터링
        return t.categoryId === activeId && t.isActive !== "0" && t.section === "v2";
      }
    });

    // 정렬 적용
    if (sortBy === "name") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortBy === "time") {
      items = [...items].sort((a, b) => {
        const timeA = parseInt(a.time?.replace(/[^0-9]/g, "") || "0");
        const timeB = parseInt(b.time?.replace(/[^0-9]/g, "") || "0");
        return timeA - timeB;
      });
    }

    return items;
  }, [activeId, sortBy, treatments]);

  // 모바일: 활성 탭이 항상 중앙에 오도록 자동 스크롤
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const containerWidth = container.offsetWidth;
    const btnLeft = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;
    container.scrollTo({
      left: btnLeft - containerWidth / 2 + btnWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const handleTabChange = (id: string) => {
    setActiveId(id);
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="text-center">
            <p style={{ color: "#9CA3AF" }}>로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="treatments-v2" className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
      <div className="container">
        <div ref={sectionTopRef} />

        {/* ── 섹션 헤더 ── */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p className="text-sm tracking-widest mb-3 font-montserrat" style={{ color: "#d1ab67", fontWeight: 300, fontSize: "12px" }}>
            TREATMENTS & EQUIPMENT 2
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}
          >
            부산 서면 스타피부과 시술 프로그램
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal" style={{ color: "#d1ab67", paddingTop: "7px" }}>
            <span className="sm:hidden" style={{ fontSize: "18px" }}>
              최신 시술 정보를 관리자에서<br />직접 등록하고 관리합니다
            </span>
            <span className="hidden sm:inline" style={{ fontSize: "18px" }}>
              최신 시술 정보를 관리자에서 직접 등록하고 관리합니다
            </span>
          </p>
        </div>

        {/* ── 카테고리 탭 + 필터/정렬 ── */}
        <div
          className="rounded-2xl px-4 py-4 mb-6"
          style={{
            background: "#fafafa",
            marginBottom: "15px",
            backgroundColor: "#ffffff",
          }}
        >
          {/* 필터/정렬 버튼 (상단 우측) */}
          <div className="flex justify-end gap-2 mb-4">
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  border: "1px solid #e5e7eb",
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                정렬
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200"
                >
                  {[
                    { value: "popular", label: "인기도순" },
                    { value: "name", label: "이름순" },
                    { value: "time", label: "시간순" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value as "name" | "time" | "popular");
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 탭 컨테이너 */}
          <div ref={tabContainerRef} className="mb-4">
            {/* 모바일: 2열 그리드 */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {CATEGORIES.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleTabChange(cat.id)}
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250 w-full"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "#d1ab67" : "#fafaf8",
                      color: isActive ? "white" : "#6B7280",
                      border: isActive ? "1.5px solid #d1ab67" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 4px 12px rgba(209,171,103,0.30)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "white" : "#9CA3AF" }}>
                      <Star size={12} />
                    </span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 데스크탑: flex-wrap 가로 배열 */}
            <div className="hidden sm:flex sm:flex-wrap gap-2" style={{ marginTop: "9px", marginRight: "5px", marginBottom: "-4px", marginLeft: "16px" }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleTabChange(cat.id)}
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250"
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "#d1ab67" : "#fafaf8",
                      color: isActive ? "white" : "#6B7280",
                      border: isActive ? "1.5px solid #d1ab67" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 4px 12px rgba(209,171,103,0.30)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "white" : "#9CA3AF" }}>
                      <Star size={12} />
                    </span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 시술 카드 그리드 ── */}
        {(() => {
          const cat = CATEGORIES.find((c) => c.id === activeId);
          if (!cat) return null;
          return (
            <div
              key={`content-${activeId}`}
              className="rounded-2xl mb-8 overflow-hidden"
              style={{
                background: "#FAF6EF",
                animation: "cardFadeIn 0.4s ease both",
              }}
            >
              <div className="px-5 pt-5 pb-5" style={{ background: "white", borderRadius: "0 0 1rem 1rem" }}>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTreatments.length === 0 ? (
                    <div className="col-span-full text-center py-16" style={{ color: "#9CA3AF" }}>
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">등록된 시술이 없습니다</p>
                      <p className="text-xs mt-1">관리자에서 시술을 추가해주세요</p>
                    </div>
                  ) : (
                    filteredTreatments.map((item, i) => (
                      <TreatmentCard key={`${activeId}-t-${i}`} item={item} index={i} imgBg={CAT_IMG_BG[activeId] ?? "#F0F6F8"} />
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
