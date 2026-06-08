/**
 * CategoryTabList
 * TreatmentsEquipmentSection의 모바일(2열 그리드) + 데스크탑(flex-wrap) 탭 렌더 중복을
 * 단일 컴포넌트로 통합한다. 반응형 표시는 Tailwind CSS 클래스로 처리한다.
 */
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
}

export default function CategoryTabList({
  categories,
  activeId,
  lang,
  onTabChange,
  containerRef,
}: CategoryTabListProps) {
  return (
    <div ref={containerRef} className="mb-4">
      {/* 모바일: 2열 그리드 */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        {categories.map((cat) => (
          <CategoryTabButton
            key={cat.id}
            id={cat.id}
            label={getCatLabel(cat, lang)}
            isActive={activeId === cat.id}
            onClick={onTabChange}
            icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
            size="sm"
          />
        ))}
      </div>
      {/* 데스크탑: flex-wrap */}
      {/* [R15-P1-1] margin inline style → Tailwind 클래스 치환 */}
      {/* mt-2 ≈ 8px (9px 근사), mr-1 ≈ 4px (5px 근사) — 표준 Tailwind 토큰 사용 */}
      <div className="hidden sm:flex sm:flex-wrap gap-2 mt-2 mr-1 -mb-1 ml-4">
        {categories.map((cat) => (
          <CategoryTabButton
            key={cat.id}
            id={cat.id}
            label={getCatLabel(cat, lang)}
            isActive={activeId === cat.id}
            onClick={onTabChange}
            icon={CATEGORY_ICON_MAP[cat.id] ?? Star}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}
