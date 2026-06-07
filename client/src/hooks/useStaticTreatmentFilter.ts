/**
 * useStaticTreatmentFilter
 * TreatmentsEquipmentSection(정적 데이터 버전)의 탭 필터 + 정렬 + 탭 자동 스크롤 로직.
 * DB 연동 버전은 useTreatmentFilter를 사용한다.
 */
import { useState, useRef, useEffect, useMemo } from "react";
import type { Treatment } from "@/types/treatment";
import { TREATMENTS } from "@/data/treatments/treatments-data";

export type SortBy = "name" | "time" | "popular";

interface UseStaticTreatmentFilterReturn {
  activeId: string;
  sortBy: SortBy;
  filterOpen: boolean;
  filteredTreatments: Treatment[];
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  handleTabChange: (id: string) => void;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useStaticTreatmentFilter(defaultTab = "best"): UseStaticTreatmentFilterReturn {
  const [activeId, setActiveId] = useState(defaultTab);
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  /** 카테고리 + 정렬 필터링 */
  const filteredTreatments = useMemo(() => {
    let items: Treatment[] = TREATMENTS[activeId] ?? [];
    if (sortBy === "name") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    } else if (sortBy === "time") {
      items = [...items].sort((a, b) => {
        const timeA = parseInt((a.time ?? "").replace(/[^0-9]/g, "") || "0");
        const timeB = parseInt((b.time ?? "").replace(/[^0-9]/g, "") || "0");
        return timeA - timeB;
      });
    }
    return items;
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

  const handleTabChange = (id: string) => setActiveId(id);

  return {
    activeId,
    sortBy,
    filterOpen,
    filteredTreatments,
    tabContainerRef,
    handleTabChange,
    setSortBy,
    setFilterOpen,
  };
}
