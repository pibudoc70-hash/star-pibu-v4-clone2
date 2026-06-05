/**
 * useTreatmentFilter
 * TreatmentsEquipmentSectionV2에서 추출한 탭 필터 + 정렬 + 탭 자동 스크롤 로직.
 * 비즈니스 로직을 UI와 분리하여 테스트 가능성과 재사용성을 높인다.
 */
import { useState, useRef, useEffect, useMemo } from "react";

export type SortBy = "name" | "time" | "popular";

interface FilterableTreatment {
  categoryId: string;
  best?: string | null;
  isActive?: string | null;
  section?: string | null;
  name: string;
  time?: string | null;
  sortOrder?: number;
}

interface UseTreatmentFilterOptions {
  /** tRPC 또는 외부에서 받아온 시술 목록 */
  treatments: FilterableTreatment[];
  /** 초기 활성 탭 ID (기본값: "best") */
  defaultTab?: string;
}

interface UseTreatmentFilterReturn<T extends FilterableTreatment> {
  activeId: string;
  sortBy: SortBy;
  filterOpen: boolean;
  filteredTreatments: T[];
  tabContainerRef: React.RefObject<HTMLDivElement | null>;
  handleTabChange: (id: string) => void;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useTreatmentFilter<T extends FilterableTreatment>({
  treatments,
  defaultTab = "best",
}: UseTreatmentFilterOptions): UseTreatmentFilterReturn<T> {
  const [activeId, setActiveId] = useState(defaultTab);
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  /** 카테고리 + 정렬 필터링 */
  const filteredTreatments = useMemo(() => {
    let items = (treatments as T[]).filter((t) => {
      if (activeId === "best") {
        return t.best === "1" && t.isActive !== "0" && t.section === "v2";
      }
      return t.categoryId === activeId && t.isActive !== "0" && t.section === "v2";
    });

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
  }, [activeId, sortBy, treatments]);

  /** 모바일: 활성 탭이 항상 중앙에 오도록 자동 스크롤 */
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const containerWidth = container.offsetWidth;
    const btnLeft = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;
    container.scrollTo({
      left: btnLeft - containerWidth / 2 + btnWidth / 2,
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
