/**
 * CategoryTabList
 * TreatmentsEquipmentSection의 모바일(2열 그리드) + 데스크탑(flex-wrap) 탭 렌더 중복을
 * 단일 컴포넌트로 통합한다. 반응형 표시는 Tailwind CSS 클래스로 처리한다.
 *
 * [R17-P2] WAI-ARIA tablist + roving tabindex 추가
 * - role="tablist" + aria-label
 * - 각 버튼에 role="tab", aria-selected, tabIndex (roving)
 * - Arrow Left/Right/Home/End 키보드 네비게이션
 */
import { useCallback, useRef } from "react";
import { Star } from "lucide-react";
import type { Category } from "@/types/treatment";
import CategoryTabButton from "./CategoryTabButton";
import { CATEGORY_ICON_MAP, getCatLabel } from "@/data/treatments/categories";
import type { Lang } from "@/lib/i18n.types";

interface CategoryTabListProps {
  categories: Category[];
  activeId: string;
  lang: Lang;
  onTabChange: (id: string) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  /** WAI-ARIA: tablist의 aria-label */
  ariaLabel?: string;
}

export default function CategoryTabList({
  categories,
  activeId,
  lang,
  onTabChange,
  containerRef,
  ariaLabel = "시술 카테고리",
}: CategoryTabListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // [R17-P2] roving tabindex 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
      const count = categories.length;
      let nextIdx: number | null = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIdx = (currentIdx + 1) % count;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIdx = (currentIdx - 1 + count) % count;
      } else if (e.key === "Home") {
        nextIdx = 0;
      } else if (e.key === "End") {
        nextIdx = count - 1;
      }

      if (nextIdx !== null) {
        e.preventDefault();
        const nextId = categories[nextIdx].id;
        onTabChange(nextId);
        // DOM 포커스 이동
        const container = listRef.current ?? containerRef?.current;
        if (container) {
          const nextBtn = container.querySelector<HTMLButtonElement>(
            `#cat-tab-${nextId}`
          );
          nextBtn?.focus();
        }
      }
    },
    [categories, onTabChange, containerRef]
  );

  const renderTabs = (sizeVariant: "sm" | "md") =>
    categories.map((cat, idx) => (
      <CategoryTabButton
        key={cat.id}
        id={cat.id}
        label={getCatLabel(cat, lang)}
        isActive={activeId === cat.id}
        onClick={onTabChange}
        icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
        size={sizeVariant}
        role="tab"
        aria-selected={activeId === cat.id}
        tabIndex={activeId === cat.id ? 0 : -1}
        onKeyDown={(e) => handleKeyDown(e, idx)}
      />
    ));

  return (
    <div ref={listRef} className="mb-4">
      {/* 모바일: 2열 그리드 */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="grid grid-cols-2 gap-2 sm:hidden"
      >
        {renderTabs("sm")}
      </div>
      {/* 데스크탑: flex-wrap */}
      {/* [R15-P1-1] margin inline style → Tailwind 클래스 치환 */}
      {/* mt-2 ≈ 8px (9px 근사), mr-1 ≈ 4px (5px 근사) — 표준 Tailwind 토큰 사용 */}
      <div
        ref={containerRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4"
      >
        {renderTabs("md")}
      </div>
    </div>
  );
}
