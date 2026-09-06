/**
 * CategoryTabButton
 * 카테고리 탭 버튼. 모바일(compact)과 데스크탑(default) 두 가지 크기를 size prop으로 제어하여
 * 기존 코드에서 중복 렌더링되던 두 개의 버튼 블록을 하나로 통합한다.
 *
 * icon prop: CATEGORY_ICON_MAP에서 전달받은 lucide-react 아이콘 컴포넌트.
 *            미전달 시 기본 Star 아이콘 사용.
 *
 * 인라인 style → CSS class-variant 재설계
 * - .cat-tab-btn / .cat-tab-btn[data-active] / .cat-tab-btn-sm / .cat-tab-btn-md (index.css)
 * - WAI-ARIA: filter button의 선택 상태는 aria-pressed로 제공
 */
import React from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

interface CategoryTabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  /** lucide-react 아이콘 컴포넌트 */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** "sm" = 모바일 compact, "md" = 데스크탑 default */
  size?: "sm" | "md";
  /** 독립된 legacy tab UI에서만 명시적으로 전달하는 역할 */
  role?: "tab";
  /** legacy tab UI의 선택 상태 */
  "aria-selected"?: boolean;
  /** legacy tab UI의 roving tabindex */
  tabIndex?: number;
}

export default function CategoryTabButton({
  id,
  label,
  isActive,
  onClick,
  icon: Icon = Star,
  size = "md",
  role,
  "aria-selected": ariaSelected,
  tabIndex,
}: CategoryTabButtonProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      role={role}
      aria-selected={ariaSelected}
      tabIndex={tabIndex}
      aria-pressed={isActive}
      aria-expanded={isSm ? isActive : undefined}
      aria-controls={isSm && isActive ? `mobile-category-detail-${id}` : undefined}
      data-active={isActive ? "true" : "false"}
      onClick={() => onClick(id)}
      className={`cat-tab-btn ${isSm ? "cat-tab-btn-sm" : "cat-tab-btn-md"}${isSm ? " w-full" : ""}`}
    >
      <span className="cat-tab-icon">
        <Icon size={isSm ? 12 : 13} />
      </span>
      <span>{label}</span>
      {isSm && (
        <span className="ml-auto flex shrink-0 opacity-75 transition-transform duration-200" aria-hidden="true">
          {isActive ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      )}
    </button>
  );
}
