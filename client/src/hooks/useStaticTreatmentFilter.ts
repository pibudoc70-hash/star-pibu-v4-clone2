/**
 * useStaticTreatmentFilter
 * TreatmentsEquipmentSection(정적 데이터 버전)의 탭 필터 + 정렬 + 탭 자동 스크롤 로직.
 * DB 연동 버전은 useTreatmentFilter를 사용한다.
 *
 * [R15-P1-2] 정렬 로직을 private helper(sortTreatments)로 분리.
 *            setSortBy/setFilterOpen 직접 노출 → handleSortChange/toggleFilter 래핑.
 * [R21-P1-6] TreatmentTabId 타입 export + resolveDefaultTab 반환 타입 명시화.
 * [R22-P0-3] hook public API 정리:
 *   - closeFilter 핸들러 노출 (TreatmentsEquipmentSection에서 직접 사용)
 *   - UseStaticTreatmentFilterReturn 인터페이스 export (테스트/외부 타입 참조용)
 *   - validTabIds 배열 노출 (테스트에서 fallback 검증용)
 *   - activeId 타입을 TreatmentTabId로 명시화
 */
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { Treatment } from "@/types/treatment";
import { TREATMENTS } from "@/data/treatments/treatments-data";
// [R20-P2-7] sortTreatments / parseMinutes → lib/treatmentSortUtils.ts로 이동
import { sortTreatments } from "@/lib/treatmentSortUtils";

// ─────────────────────────────────────────────────────────────────────────────
// TreatmentTabId 타입
// ─────────────────────────────────────────────────────────────────────────────
// [R21-P1-6] TREATMENTS가 Record<string, Treatment[]>로 선언되어 keyof typeof TREATMENTS = string이므로
// 런타임 검증으로 타입 안전성을 보완한다.
// 타입 레벨 리터럴 유니온은 treatments-data.ts를 as const로 수정해야 하므로
// 현재는 string 타입을 유지하되 런타임 검증으로 안전성을 보장한다.
export type TreatmentTabId = string;

// [R22-P0-3] 유효한 탭 ID 배열 — 테스트에서 fallback 검증용으로 노출
// [R23-P0] readonly TreatmentTabId[]로 타입 강화 (string[]보다 의미 명확)
export const VALID_TAB_IDS: readonly TreatmentTabId[] = Object.keys(TREATMENTS) as TreatmentTabId[];

// ─────────────────────────────────────────────────────────────────────────────
// resolveDefaultTab
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// SortBy 타입 re-export
// ─────────────────────────────────────────────────────────────────────────────
// [R20-P2-7] SortBy 타입은 treatmentSortUtils.ts에서 re-export
export type { SortBy } from "@/lib/treatmentSortUtils";
import type { SortBy } from "@/lib/treatmentSortUtils";

// ─────────────────────────────────────────────────────────────────────────────
// Hook Return Interface
// ─────────────────────────────────────────────────────────────────────────────
// [R22-P0-3] export로 변경 — 테스트/외부 타입 참조용
export interface UseStaticTreatmentFilterReturn {
  /** 현재 활성 탭 ID */
  activeId: TreatmentTabId;
  sortBy: SortBy;
  filterOpen: boolean;
  filteredTreatments: Treatment[];
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  /** 탭 변경 핸들러 */
  handleTabChange: (id: TreatmentTabId) => void;
  /** [R15-P1-2] 직접 setState 대신 의미 있는 핸들러로 래핑 */
  handleSortChange: (sort: SortBy) => void;
  /** [R15-P1-2] 필터 드롭다운 토글 핸들러 */
  toggleFilter: () => void;
  /** [R22-P0-3] 필터 드롭다운 닫기 전용 핸들러 (toggleFilter와 달리 항상 닫기) */
  closeFilter: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
// [R20-P2-7] sortTreatments는 lib/treatmentSortUtils.ts로 이동됨
// 하위 호환성 re-export: 이전 import 경로(useStaticTreatmentFilter에서 sortTreatments import)를 사용하는 코드가 있다면 계속 동작
export { sortTreatments } from "@/lib/treatmentSortUtils";

export function useStaticTreatmentFilter(defaultTab = "best"): UseStaticTreatmentFilterReturn {
  // [R17-P2] defaultTab validation
  const [activeId, setActiveId] = useState<TreatmentTabId>(() => resolveDefaultTab(defaultTab));
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  /** 카테고리 + 정렬 필터링 */
  const filteredTreatments = useMemo(() => {
    const items: Treatment[] = TREATMENTS[activeId] ?? [];
    return sortTreatments(items, sortBy);
  }, [activeId, sortBy]);

  /** 모바일: 활성 탭이 항상 중앙에 오도록 자동 스크롤
   * [R23-P0] offsetLeft 기반 계산 → scrollIntoView 방식으로 교체
   * offsetLeft는 offsetParent 기준이므로 중첩 컨테이너에서 오계산 가능.
   * scrollIntoView({ inline: "center" })는 브라우저가 직접 계산하므로 더 안정적.
   */
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    // scrollIntoView는 부모 스크롤 컨테이너 기준으로 정확히 계산
    activeBtn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  const handleTabChange = useCallback((id: TreatmentTabId) => setActiveId(id), []);

  /** [R15-P1-2] 의미 있는 핸들러 래핑 */
  const handleSortChange = useCallback((sort: SortBy) => setSortBy(sort), []);
  const toggleFilter = useCallback(() => setFilterOpen((prev) => !prev), []);
  /** [R22-P0-3] 닫기 전용 핸들러 — filterOpen 상태에 관계없이 항상 닫기 */
  const closeFilter = useCallback(() => setFilterOpen(false), []);

  return {
    activeId,
    sortBy,
    filterOpen,
    filteredTreatments,
    tabContainerRef,
    handleTabChange,
    handleSortChange,
    toggleFilter,
    closeFilter,
  };
}
