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
// [R20-P2-7] sortTreatments / parseMinutes → lib/treatmentSortUtils.ts로 이동
import { sortTreatments } from "@/lib/treatmentSortUtils";

// [R21-P1-6] TreatmentTabId: TREATMENTS 키 유니온 타입
// TREATMENTS가 Record<string, Treatment[]>로 선언되어 keyof typeof TREATMENTS = string이므로
// 런타임 검증으로 타입 안전성을 보완한다.
// 타입 레벨 리터럴 유니온은 treatments-data.ts를 as const로 수정해야 하므로
// 현재는 string 타입을 유지하되 런타임 검증으로 안전성을 보장한다.
export type TreatmentTabId = string;

// [R17-P2] defaultTab validation: TREATMENTS에 없는 탭 ID를 전달하면 콘솔 경고 + fallback
// [R21-P1-6] 반환 타입을 TreatmentTabId로 명시화
function resolveDefaultTab(tab: string): TreatmentTabId {
  if (tab in TREATMENTS) return tab as TreatmentTabId;
  const fallback = (Object.keys(TREATMENTS)[0] ?? "best") as TreatmentTabId;
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[useStaticTreatmentFilter] defaultTab "${tab}" not found in TREATMENTS. ` +
      `Falling back to "${fallback}". Valid keys: ${Object.keys(TREATMENTS).join(", ")}`
    );
  }
  return fallback;
}

// [R20-P2-7] SortBy 타입은 treatmentSortUtils.ts에서 re-export
export type { SortBy } from "@/lib/treatmentSortUtils";
import type { SortBy } from "@/lib/treatmentSortUtils";

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

// ── Hook ──────────────────────────────────────────────────────────────────────
// [R20-P2-7] sortTreatments는 lib/treatmentSortUtils.ts로 이동됨
// 하위 호환성 re-export: 이전 import 경로(useStaticTreatmentFilter에서 sortTreatments import)를 사용하는 코드가 있다면 계속 동작
export { sortTreatments } from "@/lib/treatmentSortUtils";

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
