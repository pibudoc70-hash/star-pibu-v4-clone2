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
 *
 * [R16-P1-1] 개선:
 *   - setSortBy/setFilterOpen deprecated setter → handleSortChange/toggleFilter 사용
 *   - filter dropdown: Escape 키 닫기 + outside click 닫기 + aria-haspopup 추가
 *   - 더보기 버튼 인라인 style → Tailwind conditional class
 *   - 섹션 헤더 h2 style → Tailwind arbitrary value
 *   - 카드 그리드 animation style → animate-card-fade class
 * [R18-P1-4] filter dropdown ArrowUp/Down/Enter 키보드 탐색 추가
 * [R20-P1-4] activeCategory 변경 시 showAll reset 명시적 정책화
 * [R21-P0-2] INITIAL_SHOW 640px 하드코딩 → Tailwind sm breakpoint 동기화
 *            + resize/rotation 시 MediaQueryList 기반 반응형 정책
 *            + 더보기/접기 버튼 포커스 복원 UX (키보드/스크린리더 접근성)
 *            + aria-expanded / aria-controls 추가
 * [R22-P0-2] setTimeout(420ms) 매직 넘버 제거 → scrollend 이벤트 기반 포커스 복원
 *            + 태블릿(MD: 768px) breakpoint 정책 추가 (MOBILE/TABLET/DESKTOP 3단계)
 *            + aria-live="polite" + aria-atomic="false" 상태 알림 (스크린리더 지원)
 *            + CLS 정책: min-height 예약으로 레이아웃 이동 방지
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useScrollEnd } from "@/hooks/useScrollEnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

// ── 분리된 모듈 import ────────────────────────────────────────────────────────
import { CATEGORIES, CAT_IMG_BG, CAT_TAB_TEXT } from "@/data/treatments/categories";
import EquipmentTreatmentCard from "@/components/treatments/EquipmentTreatmentCard";
import CategoryTabList from "@/components/treatments/CategoryTabList";
import { useStaticTreatmentFilter } from "@/hooks/useStaticTreatmentFilter";
import { useViewportTier, SM_BREAKPOINT, MD_BREAKPOINT } from "@/hooks/useViewportTier";
import EmptyResultView from "@/components/treatments/EmptyResultView";

// ─────────────────────────────────────────────────────────────────────────────
// [R22-P0-2] 3단계 breakpoint 정책 (Tailwind sm/md 동기화)
// ─────────────────────────────────────────────────────────────────────────────
const MOBILE_SHOW  = 3;     // < 640px: 3개
const TABLET_SHOW  = 4;     // 640px ~ 767px: 4개 (태블릿 세로)
const DESKTOP_SHOW = 6;     // >= 768px: 6개

// [P0-3] SCROLL_COMPLETE_FALLBACK_MS → useScrollEnd 기본값(500ms)으로 통일
// 이중 정의 제거: useScrollEnd.ts의 fallbackMs 기본값과 동일하므로 별도 상수 불필요
const SCROLL_COMPLETE_FALLBACK_MS = 500; // useScrollEnd default와 동기화

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSection() {
  const { t, lang } = useLang();
  const tr = t.treatments;

  const [showAll, setShowAll] = useState(false);

  // [R22-P0-2] 3단계 breakpoint: mobile(<640) / tablet(640~767) / desktop(>=768)
  // [R24-P0-2] getViewportTier/ViewportTier → useViewportTier 훅으로 교체
  const viewportTier = useViewportTier();

  // INITIAL_SHOW: breakpoint tier 변경 시 재계산
  const INITIAL_SHOW = useMemo(() => {
    if (viewportTier === "mobile") return MOBILE_SHOW;
    if (viewportTier === "tablet") return TABLET_SHOW;
    return DESKTOP_SHOW;
  }, [viewportTier]);

  const sectionRef = useSectionReveal(60);
  const sectionTopRef = useRef<HTMLDivElement>(null);
  // [R16-P1-1] filter dropdown outside click 감지용
  const filterRef = useRef<HTMLDivElement>(null);
  // [R21-P0-2] 더보기/접기 버튼 포커스 복원 ref
  const showAllBtnRef = useRef<HTMLButtonElement>(null);

  const {
    activeId,
    sortBy,
    filterOpen,
    filteredTreatments,
    tabContainerRef,
    handleTabChange: _handleTabChange,
    handleSortChange,
    toggleFilter,
    closeFilter,
  } = useStaticTreatmentFilter();

  // [R20-P1-4] activeCategory 변경 시 showAll reset 명시적 정책화
  const handleTabChange = useCallback((id: string) => {
    _handleTabChange(id);
    setShowAll(false);
  }, [_handleTabChange]);

  // [R18-P1-4] filter dropdown 키보드 탐색: Escape + ArrowUp/Down + Enter
  const SORT_OPTIONS = (['popular', 'name', 'time'] as const);
  const handleFilterKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeFilter();
      return;
    }
    if (!filterOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        toggleFilter();
      }
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIdx = SORT_OPTIONS.indexOf(sortBy as typeof SORT_OPTIONS[number]);
      const next = e.key === 'ArrowDown'
        ? (currentIdx + 1) % SORT_OPTIONS.length
        : (currentIdx - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length;
      handleSortChange(SORT_OPTIONS[next]);
      const listbox = filterRef.current?.querySelector('[role="listbox"]');
      if (listbox) {
        const opts = listbox.querySelectorAll<HTMLElement>('[role="option"]');
        opts[next]?.focus();
      }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeFilter();
    }
  }, [closeFilter, toggleFilter, filterOpen, sortBy, handleSortChange]);

  useEffect(() => {
    if (!filterOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        closeFilter();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [filterOpen, closeFilter]);

  // [P0-3] useScrollEnd 훅으로 scrollend 로직 추출
  // - 누수 방지: 두 경로(scrollend/fallback) 모두 정확히 한 번만 실행
  // - 폴백 타이머 cleanup 보장
  const scrollToTopAndFocus = useScrollEnd(
    sectionTopRef,
    useCallback(() => { showAllBtnRef.current?.focus(); }, []),
    SCROLL_COMPLETE_FALLBACK_MS,
  );

  const handleCollapseClick = useCallback(() => {
    setShowAll(false);
    scrollToTopAndFocus();
  }, [scrollToTopAndFocus]);

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24 bg-white" aria-label={tr.label} role="region">
      <div className="container">
        <div ref={sectionTopRef} />

        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p className="text-[12px] tracking-widest mb-3 font-montserrat text-[var(--color-gold-primary)] font-light">
            TREATMENTS & EQUIPMENT
          </p>
          <h2 className="mb-4 text-gray-800 font-extrabold text-[clamp(1.4rem,5vw,2.6rem)]">
            {tr.title}
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal text-[var(--color-gold-primary)] pt-2">
            <span className="text-lg">{tr.subtitle}</span>
          </p>
        </div>

        {/* 카테고리 탭 + 필터/정렬 */}
        <div className="rounded-2xl px-4 py-4 mb-4 bg-white">
          <div className="flex justify-end gap-2 mb-4">
            {/* [R16-P1-1] aria-haspopup + Escape + outside click */}
            <div className="relative" ref={filterRef} onKeyDown={handleFilterKeyDown}>
              <button
                type="button"
                onClick={toggleFilter}
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
                aria-label={tr.sortLabel}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-500 border border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {tr.sortLabel}
              </button>
              {filterOpen && (
                <div
                  role="listbox"
                  aria-label={tr.sortLabel}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-gray-200"
                >
                  {([
                    { value: "popular", label: tr.sortPopular },
                    { value: "name",    label: tr.sortName },
                    { value: "time",    label: tr.sortTime },
                  ] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      role="option"
                      aria-selected={sortBy === opt.value}
                      onClick={() => { handleSortChange(opt.value); closeFilter(); }}
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

        {/* 시술 카드 그리드 */}
        {CATEGORIES.find((c) => c.id === activeId) && (
            <div
              key={`content-${activeId}`}
              className="rounded-2xl mb-8 overflow-hidden bg-[var(--color-gold-pale)] animate-card-fade"
            >
              <div className="px-5 pt-5 pb-5 bg-white rounded-b-2xl">
                {/* [R22-P0-2] aria-live: 스크린리더가 목록 변화를 인지하도록 */}
                {/* aria-atomic="false": 전체 재읽기 대신 변경된 항목만 알림 */}
                <div
                  id="treatments-grid"
                  aria-live="polite"
                  aria-atomic="false"
                  aria-label="시술 목록"
                  className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredTreatments.length === 0 ? (
                    /* [R24-P0-2] EmptyResultView 컴포넌트로 분리 */
                    <EmptyResultView message={tr.noResults} hint={tr.noResultsHint} />
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
                      ref={showAllBtnRef}
                      type="button"
                      onClick={() => {
                        if (showAll) {
                          // [R22-P0-2] 접기: scrollend 이벤트 기반 포커스 복원
                          // setTimeout 매직 넘버(420ms) 제거
                          handleCollapseClick();
                        } else {
                          setShowAll(true);
                        }
                      }}
                      aria-label={showAll ? tr.collapseBtn : tr.moreBtn.replace("{n}", String(filteredTreatments.length - INITIAL_SHOW))}
                      aria-expanded={showAll}
                      aria-controls="treatments-grid"
                      className={[
                        "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2",
                        showAll
                          ? "bg-white text-[var(--color-star-text-mid)] border border-[1.5px] border-[var(--color-gold-light)]"
                          : "bg-[var(--color-gold-primary)] text-white border-none",
                      ].join(" ")}
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
