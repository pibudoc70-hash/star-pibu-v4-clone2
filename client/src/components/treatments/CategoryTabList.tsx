/**
 * CategoryTabList
 * TreatmentsEquipmentSection의 모바일(2열 그리드) + 데스크탑(flex-wrap) 탭 렌더 중복을
 * 단일 컴포넌트로 통합한다. 반응형 표시는 Tailwind CSS 클래스로 처리한다.
 *
 * 같은 카드 collection을 필터링하는 native button group으로 렌더링한다.
 * - 선택 상태는 aria-pressed로 전달한다.
 * - native button의 Tab/Shift+Tab 및 Space/Enter 동작을 그대로 보존한다.
 */
import { Star } from "lucide-react";
import type { Category } from "@/types/treatment";
import CategoryTabButton from "./CategoryTabButton";
import { CATEGORY_ICON_MAP, getCatLabel } from "@/data/treatments/categories";
import type { Lang } from "@/lib/i18n.types";
import type { TreatmentTabId } from "@/hooks/useStaticTreatmentFilter";

interface CategoryTabListProps {
  categories: Category[];
  /** [R24-P1-6] TreatmentTabId 타입으로 강화 — string보다 의미 명확 */
  activeId: TreatmentTabId;
  lang: Lang;
  onTabChange: (id: TreatmentTabId) => void;
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
  const renderTabs = (sizeVariant: "sm" | "md") =>
    categories.map((cat) => (
      <CategoryTabButton
        key={cat.id}
        id={cat.id}
        label={getCatLabel(cat, lang)}
        isActive={activeId === cat.id}
        onClick={onTabChange}
        icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
        size={sizeVariant}
      />
    ));

  return (
    <div className="mb-4">
      {/* 모바일: 2열 그리드 */}
      <div
        role="group"
        aria-label={ariaLabel}
        className="grid grid-cols-2 gap-2 sm:hidden"
      >
        {renderTabs("sm")}
      </div>
      {/* 데스크탑: flex-wrap */}
      {/* [R15-P1-1] margin inline style → Tailwind 클래스 치환 */}
      {/* mt-2 ≈ 8px (9px 근사), mr-1 ≈ 4px (5px 근사) — 표준 Tailwind 토큰 사용 */}
      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4"
      >
        {renderTabs("md")}
      </div>
    </div>
  );
}
