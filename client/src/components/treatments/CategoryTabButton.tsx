/**
 * CategoryTabButton
 * 카테고리 탭 버튼. 모바일(compact)과 데스크탑(default) 두 가지 크기를 size prop으로 제어하여
 * 기존 코드에서 중복 렌더링되던 두 개의 버튼 블록을 하나로 통합한다.
 *
 * icon prop: CATEGORY_ICON_MAP에서 전달받은 lucide-react 아이콘 컴포넌트.
 *            미전달 시 기본 Star 아이콘 사용.
 *
 * [R17-P2] 인라인 style → CSS class-variant 재설계
 * - .cat-tab-btn / .cat-tab-btn[data-active] / .cat-tab-btn-sm / .cat-tab-btn-md (index.css)
 * - WAI-ARIA: role, aria-selected, tabIndex prop 추가 (CategoryTabList에서 roving tabindex 구현)
 */
import React from "react";
import { Star } from "lucide-react";

interface CategoryTabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  /** lucide-react 아이콘 컴포넌트 */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** "sm" = 모바일 compact, "md" = 데스크탑 default */
  size?: "sm" | "md";
  /** [R17-P2] WAI-ARIA: role="tab" 전달 시 tablist 패턴 활성화 */
  role?: "tab";
  /** [R17-P2] WAI-ARIA: aria-selected */
  "aria-selected"?: boolean;
  /** [R17-P2] roving tabindex */
  tabIndex?: number;
  /** [R17-P2] keyboard navigation */
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
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
  onKeyDown,
}: CategoryTabButtonProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      id={`cat-tab-${id}`}
      role={role}
      aria-selected={ariaSelected}
      tabIndex={tabIndex}
      data-active={isActive ? "true" : "false"}
      onClick={() => onClick(id)}
      onKeyDown={onKeyDown}
      className={`cat-tab-btn ${isSm ? "cat-tab-btn-sm" : "cat-tab-btn-md"}${isSm ? " w-full" : ""}`}
    >
      <span className="cat-tab-icon">
        <Icon size={isSm ? 12 : 13} />
      </span>
      <span>{label}</span>
    </button>
  );
}
