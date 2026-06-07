/**
 * TreatmentsEquipmentSection — STAR 피부과 (Luxury Minimal Medical Redesign)
 *
 * 디자인 원칙:
 * - Premium tab UI: 골드 언더라인 + 정제된 pill 스타일
 * - 큐레이션 쇼케이스: 카드 밀도 감소, 더 넓은 여백
 * - DS 토큰 기반: DesignSystem.tsx의 color/shadow/radius/motion 사용
 * - 기존 기능 유지: 필터, 정렬, 더보기/접기, 모달, 상세 페이지 링크
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
import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Check } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { DS } from "@/components/ui/DesignSystem";

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
    <section
      ref={sectionRef}
      id="treatments"
      className="py-16 sm:py-24"
      style={{ background: DS.color.warmWhite }}
      aria-label={tr.label}
      role="region"
    >
      <div className="container">
        <div ref={sectionTopRef} />

        {/* ── 섹션 헤더 ── */}
        <div className="text-center mb-10 sm:mb-14 reveal-heading">
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.72rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: DS.color.gold,
            fontWeight: 400,
            marginBottom: "12px",
          }}>
            TREATMENTS &amp; EQUIPMENT
          </p>
          <h2 style={{
            color: DS.color.charcoal,
            fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}>
            {tr.title}
          </h2>
          {/* 골드 룰 */}
          <div style={{
            width: "40px", height: "1.5px",
            background: `linear-gradient(90deg, transparent, ${DS.color.gold}, transparent)`,
            margin: "0 auto 14px",
          }} />
          <p style={{
            color: DS.color.gold,
            fontSize: "clamp(0.88rem, 2.2vw, 1.05rem)",
            maxWidth: "540px",
            margin: "0 auto",
            lineHeight: 1.65,
          }}>
            {tr.subtitle}
          </p>
        </div>

        {/* ── 카테고리 탭 + 필터/정렬 ── */}
        <div
          className="rounded-2xl px-4 py-4 mb-6"
          style={{
            background: DS.color.white,
            boxShadow: DS.shadow.sm,
            border: `1px solid rgba(201,168,76,0.12)`,
            marginBottom: "15px",
          }}
        >
          {/* 정렬 버튼 */}
          <div className="flex justify-end gap-2 mb-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-expanded={filterOpen}
                aria-label={tr.sortLabel}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: filterOpen ? DS.color.goldLight : DS.color.ivory,
                  color: filterOpen ? DS.color.deepGray : DS.color.midGray,
                  border: `1px solid ${filterOpen ? DS.color.gold : "rgba(201,168,76,0.25)"}`,
                  transition: `all ${DS.motion.base} ${DS.motion.ease}`,
                }}
              >
                <SlidersHorizontal size={14} />
                {tr.sortLabel}
              </button>
              {filterOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-xl z-10 overflow-hidden"
                  style={{
                    background: DS.color.white,
                    boxShadow: DS.shadow.lg,
                    border: `1px solid rgba(201,168,76,0.2)`,
                  }}
                >
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
                      className="w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors"
                      style={{
                        background: sortBy === opt.value ? DS.color.goldLight : "transparent",
                        color: sortBy === opt.value ? DS.color.deepGray : DS.color.midGray,
                        fontWeight: sortBy === opt.value ? 600 : 400,
                      }}
                    >
                      {opt.label}
                      {sortBy === opt.value && <Check size={13} style={{ color: DS.color.gold }} />}
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

        {/* ── 시술 카드 그리드 — [R11-E] IIFE → 변수 선언으로 교체 ── */}
        {CATEGORIES.find((c) => c.id === activeId) && (
          <div
            key={`content-${activeId}`}
            className="rounded-2xl mb-8 overflow-hidden"
            style={{
              background: DS.color.ivory,
              animation: "cardFadeIn 0.4s ease both",
              border: `1px solid rgba(201,168,76,0.12)`,
            }}
          >
            <div
              className="px-5 pt-6 pb-6"
              style={{ background: DS.color.white, borderRadius: "0 0 1rem 1rem" }}
            >
              <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTreatments.length === 0 ? (
                  <div className="col-span-full text-center py-16" style={{ color: DS.color.lightGray }}>
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

              {/* ── 더보기 / 접기 버튼 ── */}
              {filteredTreatments.length > INITIAL_SHOW && (
                <div className="flex justify-center" style={{ marginTop: "56px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (showAll) {
                        sectionTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                      setShowAll(!showAll);
                    }}
                    aria-label={showAll ? tr.collapseBtn : tr.moreBtn.replace("{n}", String(filteredTreatments.length - INITIAL_SHOW))}
                    className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: showAll ? DS.color.white : DS.color.gold,
                      color: showAll ? DS.color.midGray : DS.color.white,
                      border: showAll ? `1.5px solid rgba(201,168,76,0.35)` : "none",
                      boxShadow: showAll ? "none" : DS.shadow.gold,
                      transition: `all ${DS.motion.base} ${DS.motion.ease}`,
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
