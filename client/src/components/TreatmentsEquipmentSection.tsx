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
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

// ── 분리된 모듈 import ────────────────────────────────────────────────────────
import {
  CATEGORIES,
  CATEGORY_ICON_MAP,
  CAT_IMG_BG,
  CAT_TAB_TEXT,
  getCatLabel,
} from "@/data/treatments/categories";
import { TREATMENTS } from "@/data/treatments/treatments-data";
import EquipmentPanel from "@/components/treatments/EquipmentPanel";
import CategoryTabButton from "@/components/treatments/CategoryTabButton";
import EquipmentTreatmentCard from "@/components/treatments/EquipmentTreatmentCard";

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
  // [R5-P1] INITIAL_SHOW: 렌더마다 window.innerWidth 직접 접근 → useState lazy initializer로 교체
  const [INITIAL_SHOW] = useState(() => typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 6);
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
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24" style={{ background: "#ffffff" }} aria-label={tr.label} role="region">
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
                aria-expanded={filterOpen}
                aria-label={tr.sortLabel}
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
                      aria-pressed={sortBy === opt.value}
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
              {CATEGORIES.map((cat) => (
                <CategoryTabButton
                  key={cat.id}
                  id={cat.id}
                  label={getCatLabel(cat, lang)}
                  isActive={activeId === cat.id}
                  onClick={handleTabChange}
                  icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
                  size="sm"
                />
              ))}
            </div>
            <div className="hidden sm:flex sm:flex-wrap gap-2" style={{ marginTop: "9px", marginRight: "5px", marginBottom: "-4px", marginLeft: "16px" }}>
              {CATEGORIES.map((cat) => (
                <CategoryTabButton
                  key={cat.id}
                  id={cat.id}
                  label={getCatLabel(cat, lang)}
                  isActive={activeId === cat.id}
                  onClick={handleTabChange}
                  icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
                  size="md"
                />
              ))}
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
                      <EquipmentTreatmentCard
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
                      aria-label={showAll ? tr.collapseBtn : tr.moreBtn.replace("{n}", String(filteredTreatments.length - INITIAL_SHOW))}
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
