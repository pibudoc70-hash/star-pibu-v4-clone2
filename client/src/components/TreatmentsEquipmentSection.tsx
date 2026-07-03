/**
 * TreatmentsEquipmentSection - 시술 안내 + 장비 소개 통합 섹션
 *
 * [DB 통합] equipment3 DB를 단일 데이터 소스로 사용
 *   - useEquipment3AsTreatments 훅으로 trpc.equipment3.list 데이터를 Treatment 타입으로 변환
 *   - /equipment3 관리자에서 등록·수정하면 이 섹션에도 자동 반영
 *   - 정적 데이터 파일(treatments-data, equipment-data) 의존성 제거
 *
 * 구조 개선 이력:
 *   - Round-10: filter/sort/scroll 로직 → 훅으로 추출
 *   - Round-16~24: 다양한 접근성·UX 개선
 *   - 2026-07-03: equipment3 DB 통합 (useEquipment3AsTreatments)
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useScrollEnd } from "@/hooks/useScrollEnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

// ── 분리된 모듈 import ────────────────────────────────────────────────────────
import { CAT_IMG_BG, CAT_TAB_TEXT } from "@/data/treatments/categories";
import EquipmentTreatmentCard from "@/components/treatments/EquipmentTreatmentCard";
import CategoryTabList from "@/components/treatments/CategoryTabList";
import { useViewportTier } from "@/hooks/useViewportTier";
import EmptyResultView from "@/components/treatments/EmptyResultView";
import { sortTreatments } from "@/lib/treatmentSortUtils";
import type { SortBy } from "@/lib/treatmentSortUtils";
import type { Treatment } from "@/types/treatment";
// [DB 통합] equipment3 DB 어댑터 훅
import { useEquipment3AsTreatments } from "@/hooks/useEquipment3AsTreatments";

// ─────────────────────────────────────────────────────────────────────────────
// [R22-P0-2] 3단계 breakpoint 정책 (Tailwind sm/md 동기화)
// ─────────────────────────────────────────────────────────────────────────────
const MOBILE_SHOW  = 6;
const TABLET_SHOW  = 4;
const DESKTOP_SHOW = 6;

const SCROLL_COMPLETE_FALLBACK_MS = 500;

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSection() {
  const { t, lang } = useLang();
  const tr = t.treatments;

  const [showAll, setShowAll] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // [DB 통합] equipment3 DB에서 데이터 로드
  const { tabs, treatmentsByTab, isLoading } = useEquipment3AsTreatments();

  // 첫 탭 자동 선택 (DB 로드 후)
  useEffect(() => {
    if (tabs.length > 0 && !activeId) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId]);

  // [R22-P0-2] 3단계 breakpoint: mobile(<640) / tablet(640~767) / desktop(>=768)
  const viewportTier = useViewportTier();

  const INITIAL_SHOW = useMemo(() => {
    if (viewportTier === "mobile") return MOBILE_SHOW;
    if (viewportTier === "tablet") return TABLET_SHOW;
    return DESKTOP_SHOW;
  }, [viewportTier]);

  const sectionRef = useSectionReveal(60);
  const sectionTopRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const showAllBtnRef = useRef<HTMLButtonElement>(null);

  // 현재 탭의 시술 목록 (정렬 적용)
  const filteredTreatments = useMemo<Treatment[]>(() => {
    const items = treatmentsByTab[activeId] ?? [];
    return sortTreatments(items, sortBy);
  }, [treatmentsByTab, activeId, sortBy]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback((id: string) => {
    setActiveId(id);
    setShowAll(false);
  }, []);

  const handleSortChange = useCallback((sort: SortBy) => {
    setSortBy(sort);
  }, []);

  const toggleFilter = useCallback(() => {
    setFilterOpen((prev) => !prev);
  }, []);

  const closeFilter = useCallback(() => {
    setFilterOpen(false);
  }, []);

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

  const scrollToTopAndFocus = useScrollEnd(
    sectionTopRef,
    useCallback(() => { showAllBtnRef.current?.focus(); }, []),
    SCROLL_COMPLETE_FALLBACK_MS,
  );

  const handleCollapseClick = useCallback(() => {
    setShowAll(false);
    scrollToTopAndFocus();
  }, [scrollToTopAndFocus]);

  // Category[] 타입으로 변환 (CategoryTabList 호환)
  const categoriesForTabList = useMemo(
    () => tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      labelEn: tab.labelEn,
      labelJa: tab.labelJa,
      labelZh: tab.labelZh,
      // Category 타입 호환 (desc 필드 필수)
      desc: "",
      descEn: "",
      descJa: "",
      descZh: "",
    })),
    [tabs],
  );

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24" style={{ background: 'var(--brand-bg, #FAF8F5)' }} aria-label={tr.label} role="region">
      {/* [UX개선] 모바일 필터 오픈 시 딥 오버레이 */}
      {filterOpen && (
        <div
          className="treatment-filter-overlay"
          onClick={closeFilter}
          aria-hidden="true"
        />
      )}
      <div className="container">
        <div ref={sectionTopRef} />

        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <span className="section-eyebrow text-[12px]">TREATMENTS &amp; EQUIPMENT</span>
          <h2 className="section-title mb-4">{tr.title}</h2>
          <p className="section-subtitle">{tr.subtitle}</p>
        </div>

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="rounded-2xl px-4 py-8 mb-4 bg-white text-center text-sm text-gray-400">
            시술·장비 정보를 불러오는 중...
          </div>
        )}

        {/* 카테고리 탭 + 필터/정렬 */}
        {!isLoading && tabs.length > 0 && (
          <>
            <div className="rounded-2xl px-4 py-4 mb-4 bg-white">
              <div className="flex justify-end gap-2 mb-4">
                <div className="relative" ref={filterRef} onKeyDown={handleFilterKeyDown}>
                  <button
                    type="button"
                    onClick={toggleFilter}
                    aria-expanded={filterOpen}
                    aria-haspopup="listbox"
                    aria-label={tr.sortLabel}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors treatment-filter-btn"
                    style={{ background: "color-mix(in srgb, var(--color-gold-primary) 8%, transparent)", color: "var(--brand-text-mid, #666666)", border: "1px solid color-mix(in srgb, var(--color-gold-primary) 20%, transparent)" }}
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
                      className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 treatment-filter-dropdown"
                      style={{ border: "1px solid color-mix(in srgb, var(--color-gold-primary) 20%, transparent)" }}
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
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt.value ? "font-semibold" : "hover:bg-gray-50"}`}
                          style={sortBy === opt.value
                            ? { background: "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)", color: "var(--color-gold-deep)" }
                            : { color: "var(--brand-text, #2C2C2C)" }
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 탭 — CategoryTabList */}
              <CategoryTabList
                categories={categoriesForTabList}
                activeId={activeId}
                lang={lang}
                onTabChange={handleTabChange}
                containerRef={tabContainerRef}
              />
            </div>

            {/* 시술 카드 그리드 */}
            {activeId && (
              <div
                key={`content-${activeId}`}
                className="rounded-2xl mb-8 overflow-hidden bg-[var(--color-gold-pale)] animate-card-fade"
              >
                <div className="px-5 pt-5 pb-5 bg-white rounded-b-2xl">
                  <div
                    id="treatments-grid"
                    aria-live="polite"
                    aria-atomic="false"
                    aria-label="시술 목록"
                    className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {filteredTreatments.length === 0 ? (
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
          </>
        )}
      </div>
    </section>
  );
}
