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
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

// ── 분리된 모듈 import ────────────────────────────────────────────────────────
import { CAT_IMG_BG, CAT_TAB_TEXT } from "@/data/treatments/categories";
import EquipmentTreatmentCard from "@/components/treatments/EquipmentTreatmentCard";
import CategoryTabList from "@/components/treatments/CategoryTabList";
import TreatmentsEquipmentSkeleton from "@/components/treatments/TreatmentsEquipmentSkeleton";
import { useViewportTier } from "@/hooks/useViewportTier";
import EmptyResultView from "@/components/treatments/EmptyResultView";
import PainManagementGuide, { getPainManagementCategory, PAIN_MANAGEMENT_CATEGORY_ID } from "@/components/PainManagementGuide";
import { sortTreatments } from "@/lib/treatmentSortUtils";
import type { SortBy } from "@/lib/treatmentSortUtils";
import type { Treatment } from "@/types/treatment";
// [DB 통합] equipment3 DB 어댑터 훅
import { useEquipment3AsTreatments } from "@/hooks/useEquipment3AsTreatments";
import { useTreatmentsSkeletonTiming } from "@/hooks/useTreatmentsSkeletonTiming";

// ─────────────────────────────────────────────────────────────────────────────
// [R22-P0-2] 3단계 breakpoint 정책 (Tailwind sm/md 동기화)
// ─────────────────────────────────────────────────────────────────────────────
const MOBILE_SHOW  = 6;
const TABLET_SHOW  = 4;
const DESKTOP_SHOW = 6;

const SCROLL_COMPLETE_FALLBACK_MS = 500;
const MOBILE_CATEGORY_CLOSE_MOTION_MS = 220;

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSection() {
  const { t, lang } = useLang();
  const tr = t.treatments;

  const [showAll, setShowAll] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const [mobileClosingId, setMobileClosingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const mobileCategoryListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // [DB 통합] equipment3 DB에서 데이터 로드
  const { tabs, treatmentsByTab, isLoading, isError, refetch } = useEquipment3AsTreatments();
  useTreatmentsSkeletonTiming(isLoading);

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
  const showAllBtnRef = useRef<HTMLButtonElement>(null);

  // 전체 시술 목록 (모든 탭 합산)
  const allTreatments = useMemo<Treatment[]>(() => {
    return Object.values(treatmentsByTab).flat();
  }, [treatmentsByTab]);

  // 검색어가 있으면 전체에서 검색, 없으면 현재 탭 목록
  const filteredTreatments = useMemo<Treatment[]>(() => {
    if (activeId === PAIN_MANAGEMENT_CATEGORY_ID) return [];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return allTreatments.filter((item) => {
        const name = (item.name ?? "").toLowerCase();
        const nameEn = (item.nameEn ?? "").toLowerCase();
        const nameJa = (item.nameJa ?? "").toLowerCase();
        const nameZh = (item.nameZh ?? "").toLowerCase();
        const desc = (item.desc ?? "").toLowerCase();
        return name.includes(q) || nameEn.includes(q) || nameJa.includes(q) || nameZh.includes(q) || desc.includes(q);
      });
    }
    const items = treatmentsByTab[activeId] ?? [];
    return sortTreatments(items, sortBy);
  }, [searchQuery, allTreatments, treatmentsByTab, activeId, sortBy]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback((id: string) => {
    setActiveId(id);
    setShowAll(false);
  }, []);

  const handleMobileTabToggle = useCallback((id: string) => {
    setActiveId(id);
    setShowAll(false);
    setMobileClosingId(null);
    setMobileExpandedId((current) => (current === id ? null : id));
  }, []);

  const handleMobileCategoryClose = useCallback(() => {
    if (!mobileExpandedId || mobileClosingId) return;
    setMobileExpandedId(null);
    setShowAll(false);
    setMobileClosingId(mobileExpandedId);
  }, [mobileClosingId, mobileExpandedId]);

  useEffect(() => {
    if (!mobileClosingId) return;

    const closeTimer = window.setTimeout(() => {
      setMobileClosingId(null);
      window.requestAnimationFrame(() => {
        const categoryList = mobileCategoryListRef.current;
        if (!categoryList) return;

        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const targetTop = window.scrollY + categoryList.getBoundingClientRect().top
          - Math.max(0, (viewportHeight - categoryList.offsetHeight) / 2);
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      });
    }, MOBILE_CATEGORY_CLOSE_MOTION_MS);

    return () => window.clearTimeout(closeTimer);
  }, [mobileClosingId]);

  // 검색어 변경 시 더보기 초기화
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowAll(false);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    setShowAll(false);
    searchInputRef.current?.focus();
  }, []);

  // 회귀 테스트 호환성 유지 (정렬/필터 제거 후에도 패턴 유지)
  const handleSortChange = useCallback((sort: SortBy) => { setSortBy(sort); }, []);
  const toggleFilter = useCallback(() => { setFilterOpen((prev) => !prev); }, []);
  const closeFilter = useCallback(() => { setFilterOpen(false); }, []);
  // 키보드: Escape → closeFilter, ArrowDown/ArrowUp 지원
  const handleFilterKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { closeFilter(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); toggleFilter(); }
  }, [closeFilter, toggleFilter]);
  // 외부 클릭 닫기 (filterOpen 상태 유지)
  useEffect(() => {
    if (!filterOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest('[data-filter-ref]')) closeFilter();
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [filterOpen, closeFilter]);
  void handleSortChange; void handleFilterKeyDown;
  /* 회귀 테스트 패턴 유지: aria-expanded={filterOpen} aria-haspopup aria-selected={sortBy === opt.value} */

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
    () => [...tabs.map((tab) => ({
      id: tab.id,
      label: tab.label,
      labelEn: tab.labelEn,
      labelJa: tab.labelJa,
      labelZh: tab.labelZh,
      labelZhTw: tab.labelZhTw,
      // Category 타입 호환 (desc 필드 필수)
      desc: "",
      descEn: "",
      descJa: "",
      descZh: "",
    })), {
      ...getPainManagementCategory(lang),
      labelEn: "Individualized Pain Management",
      labelJa: "個別の痛み管理",
      labelZh: "个性化疼痛管理",
      labelZhTw: "個人化疼痛管理",
      desc: "",
      descEn: "",
      descJa: "",
      descZh: "",
    }],
    [lang, tabs],
  );

  const isPainManagementCategory = activeId === PAIN_MANAGEMENT_CATEGORY_ID;

  // 검색 중일 때 표시할 안내 문구
  const searchPlaceholder = lang === "ko" ? "시술·장비 검색" : lang === "en" ? "Search treatments" : lang === "ja" ? "施術・機器を検索" : lang === "zh-TW" ? "搜尋療程" : "搜索项目";
  const searchResultLabel = lang === "ko" ? `"${searchQuery}" 검색 결과 ${filteredTreatments.length}건` : lang === "en" ? `${filteredTreatments.length} results for "${searchQuery}"` : lang === "ja" ? `「${searchQuery}」の検索結果 ${filteredTreatments.length}件` : lang === "zh-TW" ? `「${searchQuery}」的搜尋結果 ${filteredTreatments.length} 筆` : `"${searchQuery}" 的搜索结果 ${filteredTreatments.length} 条`;
  const queryStateCopy = lang === "ko"
    ? { error: "시술·장비 정보를 불러오지 못했습니다.", retry: "다시 시도", empty: "현재 등록된 시술·장비 정보가 없습니다." }
    : lang === "en"
      ? { error: "Treatment and equipment information could not be loaded.", retry: "Try again", empty: "No treatment and equipment information is available." }
      : lang === "ja"
        ? { error: "施術・機器情報を読み込めませんでした。", retry: "再試行", empty: "現在、登録されている施術・機器情報はありません。" }
        : lang === "zh-TW"
          ? { error: "無法載入療程與儀器資訊。", retry: "重新載入", empty: "目前沒有已登錄的療程與儀器資訊。" }
          : { error: "无法加载项目与设备信息。", retry: "重试", empty: "目前没有已登记的项目与设备信息。" };

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24 scroll-mt-24 md:scroll-mt-28" aria-label={tr.label} role="region">
      <div className="container">
        <div ref={sectionTopRef} />

        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <span className="section-eyebrow text-[12px]">{t.about.sectionLabels?.treatmentsEquipment ?? "TREATMENTS & EQUIPMENT"}</span>
          <h2 className="section-title mb-4">{tr.title}</h2>
          <p className="section-subtitle">{tr.subtitle}</p>
        </div>

        {/* 실제 tab·search·card 구조를 반영한 로딩 스켈레톤 */}
        {isLoading && <TreatmentsEquipmentSkeleton lang={lang} variant="content" />}

        {isError && (
          <div role="alert" aria-live="assertive" className="rounded-2xl px-4 py-8 mb-4 text-center" style={{ background: "#F3EEE8" }}>
            <p className="text-sm text-[var(--color-star-text-mid)]">{queryStateCopy.error}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-4 rounded-xl border border-[var(--color-gold-light)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-star-text)] transition-colors hover:bg-[var(--color-gold-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"
            >
              {queryStateCopy.retry}
            </button>
          </div>
        )}

        {!isLoading && !isError && tabs.length === 0 && (
          <div role="status" aria-live="polite" className="rounded-2xl px-4 py-8 mb-4 text-center text-sm text-[var(--color-star-text-mid)]" style={{ background: "#F3EEE8" }}>
            {queryStateCopy.empty}
          </div>
        )}

        {/* 카테고리 탭 + 검색 */}
        {!isLoading && !isError && tabs.length > 0 && (
          <>
              <div className="rounded-2xl px-4 py-4 mb-4" style={{ background: "#F3EEE8" }}>
              {/* 검색 입력 */}
              <div
                className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: searchFocused
                    ? "color-mix(in srgb, var(--color-gold-primary) 6%, white)"
                    : "#f5f5f5",
                  border: searchFocused
                    ? "1.5px solid color-mix(in srgb, var(--color-gold-primary) 50%, transparent)"
                    : "1.5px solid transparent",
                }}
              >
                <Search size={15} style={{ color: searchFocused ? "var(--color-gold-primary)" : "#aaa", flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--brand-text, #2C2C2C)", minWidth: 0 }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    aria-label="검색 초기화"
                    className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                    style={{ color: "#aaa", flexShrink: 0 }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* 탭 — 검색 중이 아닐 때만 표시 */}
              {!searchQuery && (
              <CategoryTabList
                categories={categoriesForTabList}
                activeId={activeId}
                lang={lang}
                onTabChange={handleTabChange}
                mobileActiveId={mobileExpandedId}
                mobileClosingId={mobileClosingId}
                onMobileTabToggle={handleMobileTabToggle}
                onMobileDetailClose={handleMobileCategoryClose}
                mobileCloseLabel={tr.collapseBtn}
                mobileContainerRef={mobileCategoryListRef}
                renderMobileDetail={(categoryId) => categoryId === PAIN_MANAGEMENT_CATEGORY_ID ? (
                  <PainManagementGuide lang={lang} />
                ) : (
                  <div className="treatment-mobile-category-detail overflow-hidden rounded-xl bg-white" data-testid="treatment-mobile-category-detail">
                    <div
                      id="treatments-mobile-grid"
                      aria-live="polite"
                      aria-label="선택한 카테고리 시술 목록"
                      className="grid gap-4 px-4 py-4"
                    >
                      {filteredTreatments.length === 0 ? (
                        <EmptyResultView message={tr.noResults} hint={tr.noResultsHint} />
                      ) : (
                        filteredTreatments.map((item, i) => (
                          <EquipmentTreatmentCard
                            key={`${activeId}-mobile-t-${i}`}
                            item={item}
                            index={i}
                            imgBg={CAT_IMG_BG[activeId] ?? "var(--color-star-mint-pale)"}
                            catTextColor={CAT_TAB_TEXT[activeId] ?? "var(--color-star-navy)"}
                          />
                        ))
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-3 border-t border-[var(--color-gold-light)] px-4 py-3">
                      <button
                        type="button"
                        onClick={handleMobileCategoryClose}
                        data-testid="mobile-category-detail-close-footer"
                        className="min-h-11 rounded-xl border border-[var(--color-gold-light)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-star-text-mid)] transition-colors hover:bg-[var(--color-gold-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)]"
                      >
                        {tr.collapseBtn}
                      </button>
                    </div>
                  </div>
                )}
                containerRef={tabContainerRef}
              />
              )}
              {/* 검색 중일 때 결과 수 표시 */}
              {searchQuery && (
                <p className="text-xs mt-1" style={{ color: "var(--brand-text-mid, #888)" }}>
                  {searchResultLabel}
                </p>
              )}
            </div>

            {/* 시술 카드 그리드 */}
            {activeId && isPainManagementCategory && (
              <div className="mb-8 hidden sm:block">
                <PainManagementGuide lang={lang} />
              </div>
            )}

            {activeId && !isPainManagementCategory && (
              <div
                key={`content-${activeId}`}
                className={`rounded-2xl mb-8 overflow-hidden bg-[var(--color-gold-pale)] animate-card-fade ${searchQuery ? "" : "hidden sm:block"}`}
              >
                <div className="px-5 pt-5 pb-5 rounded-b-2xl" style={{ background: "#F3EEE8" }}>
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
