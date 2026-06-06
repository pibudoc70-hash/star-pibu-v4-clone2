/**
 * TreatmentsEquipmentSection - 시술 안내 + 장비 소개 통합 섹션
 *
 * 구조 분해 (2026-06-06):
 *   - 타입: @/types/treatment
 *   - 카테고리 상수: @/data/treatments/categories
 *   - 시술 데이터: @/data/treatments/treatments-data
 *   - 장비 데이터: @/data/treatments/equipment-data
 *   - EquipmentPanel: @/components/treatments/EquipmentPanel
 */
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Clock, RefreshCw, ChevronDown, ChevronUp, AlertCircle,
  Repeat, Sparkles, ExternalLink, Star,
} from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";

// ── 분리된 모듈 import ────────────────────────────────────────────────────────
import type { Treatment } from "@/types/treatment";
import {
  CATEGORIES,
  CATEGORY_ICON_MAP,
  CAT_IMG_BG,
  CAT_TAB_TEXT,
  DETAIL_PAGE_SLUGS,
  getCatLabel,
} from "@/data/treatments/categories";
import { TREATMENTS } from "@/data/treatments/treatments-data";
import EquipmentPanel from "@/components/treatments/EquipmentPanel";

// ─────────────────────────────────────────────────────────────────────────────
// TreatmentCard (V1 정적 데이터 전용)
// V2 DB 연동 카드는 @/components/treatments/TreatmentCard 사용
// ─────────────────────────────────────────────────────────────────────────────
function TreatmentCard({ item, index, imgBg, catTextColor }: { item: Treatment; index: number; imgBg: string; catTextColor: string }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { t, lang } = useLang();
  const tr = t.treatments;
  const detailSlug = DETAIL_PAGE_SLUGS[item.name];
  const { getText } = useLocalizedText();
  return (
    <>
      <div
        className="treatment-card group cursor-pointer"
        style={{ animation: `cardFadeIn 0.35s ease ${Math.min(index * 0.07, 0.42)}s both` }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`${item.name} 상세 보기`}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {/* 이미지 */}
        <div className="relative overflow-hidden" style={{ height: item.cardBannerImage ? "auto" : "192px", background: item.cardBannerImage ? "transparent" : "#f6efe0" }}>
          {item.cardBannerImage ? (
            <OptimizedImage src={item.cardBannerImage} alt={item.name} className="w-full object-cover" />
          ) : item.images && item.images.length > 1 ? (
            <div className="flex h-full">
              {item.images.map((img, idx) => (
                <div key={idx} className="flex-1 overflow-hidden" style={{ background: imgBg }}>
                  <OptimizedImage src={img} alt={`${item.name} ${idx + 1}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          ) : (
            <OptimizedImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              style={{ background: imgBg }}
            />
          )}
          {item.badge && (
            <span
              className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
              style={{ background: item.badgeColor ?? catTextColor }}
            >
              {item.badge}
            </span>
          )}
        </div>
        {/* 텍스트 */}
        <div className="p-3">
          <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">
            {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">
            {getText(item.desc, item.descEn, item.descJa, item.descZh)}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <Clock size={10} />
              {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}
            </span>
            <span className="flex items-center gap-0.5">
              <RefreshCw size={10} />
              {tr.recoveryPrefix} {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}
            </span>
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">{item.name} 상세 정보</DialogTitle>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                <OptimizedImage src={item.image} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {getText(item.name, item.nameEn, item.nameJa, item.nameZh)}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Clock size={12} />{tr.modalTime}: {getText(item.time, item.timeEn, item.timeJa, item.timeZh)}</span>
                  <span className="flex items-center gap-1"><RefreshCw size={12} />{tr.modalRecovery}: {getText(item.recovery, item.recoveryEn, item.recoveryJa, item.recoveryZh)}</span>
                </div>
              </div>
            </div>
            {item.youtubeUrl && (
              <div className="rounded-xl overflow-hidden aspect-video">
                <iframe src={item.youtubeUrl} title={item.name} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            )}
            {!item.youtubeUrl && item.modalImage && (
              <div className="rounded-xl overflow-hidden">
                <OptimizedImage src={item.modalImage} alt={`${item.name} 상세`} className="w-full object-contain" />
              </div>
            )}
            {getText(item.detail, item.detailEn, item.detailJa, item.detailZh) && (
              <p className="text-sm text-slate-600 leading-relaxed">{getText(item.detail, item.detailEn, item.detailJa, item.detailZh)}</p>
            )}
            {getText(item.effect, item.effectEn, item.effectJa, item.effectZh) && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-500" />{tr.modalEffect}
                </h4>
                <p className="text-sm text-slate-600">{getText(item.effect, item.effectEn, item.effectJa, item.effectZh)}</p>
              </div>
            )}
            {getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh) && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Repeat size={14} className="text-blue-500" />{tr.modalSessions}
                </h4>
                <p className="text-sm text-slate-600">{getText(item.sessions, item.sessionsEn, item.sessionsJa, item.sessionsZh)}</p>
              </div>
            )}
            {item.caution && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <AlertCircle size={14} className="text-red-400" />주의사항
                </h4>
                <p className="text-sm text-slate-600">{item.caution}</p>
              </div>
            )}
            {detailSlug && (
              <button
                onClick={() => { setOpen(false); setLocation(`/treatment/${detailSlug}`); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: catTextColor }}
              >
                <ExternalLink size={14} />{tr.modalDetailBtn}
              </button>
            )}
            <a
              href="tel:051-818-7582"
              className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {tr.modalConsultBtn}
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
export default function TreatmentsEquipmentSection() {
  const { t, lang } = useLang();
  const tr = t.treatments;
  const [activeId, setActiveId] = useState("best");
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "time" | "popular">("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const INITIAL_SHOW = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 6;
  const sectionRef = useSectionReveal(60);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const sectionTopRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (id: string) => setActiveId(id);

  // 활성 탭 자동 스크롤 (모바일)
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    container.scrollTo({
      left: activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const filteredTreatments = useMemo(() => {
    let items = TREATMENTS[activeId] ?? [];
    if (sortBy === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    else if (sortBy === "time") items = [...items].sort((a, b) => parseInt(a.time?.replace(/[^0-9]/g, "") || "0") - parseInt(b.time?.replace(/[^0-9]/g, "") || "0"));
    return items;
  }, [activeId, sortBy]);

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
      <div className="container">
        <div ref={sectionTopRef} />

        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p className="text-sm tracking-widest mb-3 font-montserrat" style={{ color: "#d1ab67", fontWeight: 300, fontSize: "12px" }}>
            TREATMENTS & EQUIPMENT
          </p>
          <h2 className="mb-4" style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}>
            {tr.title}
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal" style={{ color: "#d1ab67", paddingTop: "7px" }}>
            <span style={{ fontSize: "18px" }}>{tr.subtitle}</span>
          </p>
        </div>

        {/* 카테고리 탭 + 필터/정렬 */}
        <div className="rounded-2xl px-4 py-4 mb-6" style={{ background: "#ffffff", marginBottom: "15px" }}>
          <div className="flex justify-end gap-2 mb-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {tr.sortLabel}
              </button>
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                  {([
                    { value: "popular", label: tr.sortPopular },
                    { value: "name",    label: tr.sortName },
                    { value: "time",    label: tr.sortTime },
                  ] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 탭 — 모바일: 2열 그리드, 데스크탑: flex-wrap */}
          <div ref={tabContainerRef} className="mb-4">
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {CATEGORIES.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleTabChange(cat.id)}
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250 w-full"
                    style={{
                      padding: "6px 12px", borderRadius: "999px", fontSize: "0.78rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "#d1ab67" : "#fafaf8",
                      color: isActive ? "white" : "#6B7280",
                      border: isActive ? "1.5px solid #d1ab67" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 4px 12px rgba(209,171,103,0.30)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "white" : "#9CA3AF" }}>
                      {React.createElement(CATEGORY_ICON_MAP[cat.id] ?? Star, { size: 12 })}
                    </span>
                    <span>{getCatLabel(cat, lang)}</span>
                  </button>
                );
              })}
            </div>
            <div className="hidden sm:flex sm:flex-wrap gap-2" style={{ marginTop: "9px", marginRight: "5px", marginBottom: "-4px", marginLeft: "16px" }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleTabChange(cat.id)}
                    className="flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250"
                    style={{
                      padding: "6px 14px", borderRadius: "999px", fontSize: "0.82rem",
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? "#d1ab67" : "#fafaf8",
                      color: isActive ? "white" : "#6B7280",
                      border: isActive ? "1.5px solid #d1ab67" : "1.5px solid #E5E7EB",
                      boxShadow: isActive ? "0 4px 12px rgba(209,171,103,0.30)" : "0 1px 3px rgba(0,0,0,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", color: isActive ? "white" : "#9CA3AF" }}>
                      {React.createElement(CATEGORY_ICON_MAP[cat.id] ?? Star, { size: 13 })}
                    </span>
                    <span>{getCatLabel(cat, lang)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 시술 카드 그리드 */}
        {(() => {
          const cat = CATEGORIES.find((c) => c.id === activeId);
          if (!cat) return null;
          return (
            <div
              key={`content-${activeId}`}
              className="rounded-2xl mb-8 overflow-hidden"
              style={{ background: "#FAF6EF", animation: "cardFadeIn 0.4s ease both" }}
            >
              <div className="px-5 pt-5 pb-5" style={{ background: "white", borderRadius: "0 0 1rem 1rem" }}>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTreatments.length === 0 ? (
                    <div className="col-span-full text-center py-16" style={{ color: "#9CA3AF" }}>
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">{tr.noResults}</p>
                      <p className="text-xs mt-1">{tr.noResultsHint}</p>
                    </div>
                  ) : (
                    (showAll ? filteredTreatments : filteredTreatments.slice(0, INITIAL_SHOW)).map((item, i) => (
                      <TreatmentCard
                        key={`${activeId}-t-${i}`}
                        item={item}
                        index={i}
                        imgBg={CAT_IMG_BG[activeId] ?? "#F0F6F8"}
                        catTextColor={CAT_TAB_TEXT[activeId] ?? "#3730A3"}
                      />
                    ))
                  )}
                </div>
                {/* 더보기 / 접기 버튼 */}
                {filteredTreatments.length > INITIAL_SHOW && (
                  <div className="flex justify-center" style={{ marginTop: "68px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (showAll) {
                          sectionTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                        setShowAll(!showAll);
                      }}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-95"
                      style={{
                        background: showAll ? "white" : "#d1ab67",
                        color: showAll ? "#6B7280" : "white",
                        border: showAll ? "1.5px solid #e8dfc8" : "none",
                      }}
                    >
                      {showAll ? (
                        <><ChevronUp size={16} />{tr.collapseBtn}</>
                      ) : (
                        <><ChevronDown size={16} />{tr.moreBtn.replace("{n}", String(filteredTreatments.length - INITIAL_SHOW))}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
