/**
 * TreatmentsEquipmentSection - 시술 안내 + 장비 소개 통합 섹션
 *
 * 구조 분해 (2026-06-06):
 *   - 타입: @/types/treatment
 *   - 카테고리 상수: @/data/treatments/categories
 *   - 시술 데이터: @/data/treatments/treatments-data
 *   - 장비 데이터: @/data/treatments/equipment-data
 *
 * 구조 개선 (Round-10):
 *   - filter/sort/scroll 로직 → useStaticTreatmentFilter hook으로 추출
 *   - 모바일/데스크탑 탭 중복 렌더 → CategoryTabList 컴포넌트로 통합
 */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useRef } from "react";

// ── 분리된 모듈 import ────────────────────────────────────────────────────────
import { CATEGORIES, CAT_IMG_BG, CAT_TAB_TEXT } from "@/data/treatments/categories";
import EquipmentTreatmentCard from "@/components/treatments/EquipmentTreatmentCard";
import CategoryTabList from "@/components/treatments/CategoryTabList";
import { useStaticTreatmentFilter } from "@/hooks/useStaticTreatmentFilter";

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSection() {
  const { t, lang } = useLang();
  const tr = t.treatments;

  const [showAll, setShowAll] = useState(false);
  // [R5-P1] INITIAL_SHOW: 렌더마다 window.innerWidth 직접 접근 → useState lazy initializer로 교체
  const [INITIAL_SHOW] = useState(() => typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 6);

  const sectionRef = useSectionReveal(60);
  const sectionTopRef = useRef<HTMLDivElement>(null);

  const {
    activeId,
    sortBy,
    filterOpen,
    filteredTreatments,
    tabContainerRef,
    handleTabChange,
    setSortBy,
    setFilterOpen,
  } = useStaticTreatmentFilter();

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24 bg-white" aria-label={tr.label} role="region">
      <div className="container">
        <div ref={sectionTopRef} />

        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p className="text-[12px] tracking-widest mb-3 font-montserrat text-[var(--color-gold-primary)] font-light">
            TREATMENTS & EQUIPMENT
          </p>
          <h2 className="mb-4 text-gray-800 font-extrabold" style={{ fontSize: "clamp(1.4rem, 5vw, 2.6rem)" }}>
            {tr.title}
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal text-[var(--color-gold-primary)] pt-2">
            <span className="text-lg">{tr.subtitle}</span>
          </p>
        </div>

        {/* 카테고리 탭 + 필터/정렬 */}
        <div className="rounded-2xl px-4 py-4 mb-4 bg-white">
          <div className="flex justify-end gap-2 mb-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-expanded={filterOpen}
                aria-label={tr.sortLabel}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-500 border border-gray-200"
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

          {/* 탭 — CategoryTabList로 모바일/데스크탑 중복 제거 */}
          <CategoryTabList
            categories={CATEGORIES}
            activeId={activeId}
            lang={lang}
            onTabChange={handleTabChange}
            containerRef={tabContainerRef}
          />
        </div>

        {/* 시술 카드 그리드 — [R11-E] IIFE → 변수 선언으로 교체 */}
        {CATEGORIES.find((c) => c.id === activeId) && (
            <div
              key={`content-${activeId}`}
              className="rounded-2xl mb-8 overflow-hidden bg-[var(--color-gold-pale)]"
              style={{ animation: "cardFadeIn 0.4s ease both" }}
            >
              <div className="px-5 pt-5 pb-5 bg-white rounded-b-2xl">
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTreatments.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-gray-400">
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
                        imgBg={CAT_IMG_BG[activeId] ?? "var(--color-star-mint-pale)"}
                        catTextColor={CAT_TAB_TEXT[activeId] ?? "var(--color-star-navy)"}
                      />
                    ))
                  )}
                </div>
                {/* 더보기 / 접기 버튼 */}
                {filteredTreatments.length > INITIAL_SHOW && (
                  <div className="flex justify-center mt-16">
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
                        background: showAll ? "white" : "var(--color-gold-primary)",
                        color: showAll ? "var(--color-star-text-mid)" : "white",
                        border: showAll ? "1.5px solid var(--color-gold-light)" : "none",
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
        )}
      </div>
    </section>
  );
}
