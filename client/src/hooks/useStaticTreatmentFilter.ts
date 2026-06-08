/**
 * useStaticTreatmentFilter
 * TreatmentsEquipmentSection(정적 데이터 버전)의 탭 필터 + 정렬 + 탭 자동 스크롤 로직.
 * DB 연동 버전은 useTreatmentFilter를 사용한다.
 *
 * [R15-P1-2] 정렬 로직을 private helper(sortTreatments)로 분리.
 *            setSortBy/setFilterOpen 직접 노출 → handleSortChange/toggleFilter 래핑.
 */
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { Treatment } from "@/types/treatment";
import { TREATMENTS } from "@/data/treatments/treatments-data";

// [R17-P2] defaultTab validation: TREATMENTS에 없는 탭 ID를 전달하면 콘솔 경고 + fallback
function resolveDefaultTab(tab: string): string {
  if (tab in TREATMENTS) return tab;
  const fallback = Object.keys(TREATMENTS)[0] ?? "best";
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[useStaticTreatmentFilter] defaultTab "${tab}" not found in TREATMENTS. ` +
      `Falling back to "${fallback}". Valid keys: ${Object.keys(TREATMENTS).join(", ")}`
    );
  }
  return fallback;
}

export type SortBy = "name" | "time" | "popular";

interface UseStaticTreatmentFilterReturn {
  activeId: string;
  sortBy: SortBy;
  filterOpen: boolean;
  filteredTreatments: Treatment[];
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  handleTabChange: (id: string) => void;
  /** [R15-P1-2] 직접 setState 대신 의미 있는 핸들러로 래핑 */
  handleSortChange: (sort: SortBy) => void;
  /** [R15-P1-2] 필터 드롭다운 토글 핸들러 */
  toggleFilter: () => void;
}

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * [R15-P1-2] 정렬 로직 분리: useMemo 내부 인라인 → 순수 함수
 * 원본 배열을 변경하지 않고 새 배열을 반환한다.
 */
export function sortTreatments(items: Treatment[], sortBy: SortBy): Treatment[] {
  if (sortBy === "name") {
    return [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
  if (sortBy === "time") {
    return [...items].sort((a, b) => {
      const parseMinutes = (t: string | undefined) =>
        parseInt((t ?? "").replace(/[^0-9]/g, "") || "0", 10);
      return parseMinutes(a.time) - parseMinutes(b.time);
    });
  }
  // "popular" — 데이터 원본 순서 유지
  return items;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useStaticTreatmentFilter(defaultTab = "best"): UseStaticTreatmentFilterReturn {
  // [R17-P2] defaultTab validation
  const [activeId, setActiveId] = useState(() => resolveDefaultTab(defaultTab));
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  /** 카테고리 + 정렬 필터링 */
  const filteredTreatments = useMemo(() => {
    const items: Treatment[] = TREATMENTS[activeId] ?? [];
    return sortTreatments(items, sortBy);
  }, [activeId, sortBy]);

  /** 모바일: 활성 탭이 항상 중앙에 오도록 자동 스크롤 */
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

  const handleTabChange = useCallback((id: string) => setActiveId(id), []);

  /** [R15-P1-2] 의미 있는 핸들러 래핑 */
  const handleSortChange = useCallback((sort: SortBy) => setSortBy(sort), []);
  const toggleFilter = useCallback(() => setFilterOpen((prev) => !prev), []);

  return {
    activeId,
    sortBy,
    filterOpen,
    filteredTreatments,
    tabContainerRef,
    handleTabChange,
    handleSortChange,
    toggleFilter,
  };
}
