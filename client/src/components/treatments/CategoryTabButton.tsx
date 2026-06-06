/**
 * CategoryTabButton
 * 카테고리 탭 버튼. 모바일(compact)과 데스크탑(default) 두 가지 크기를 size prop으로 제어하여
 * 기존 코드에서 중복 렌더링되던 두 개의 버튼 블록을 하나로 통합한다.
 *
 * icon prop: CATEGORY_ICON_MAP에서 전달받은 lucide-react 아이콘 컴포넌트.
 *            미전달 시 기본 Star 아이콘 사용.
 *
 * 애니메이션: CSS custom property를 이용해 background-color, color, border-color,
 *             box-shadow, transform을 300ms ease로 부드럽게 전환한다.
 *             Tailwind의 transition-all은 inline style 변수에 적용되지 않으므로
 *             style 태그 대신 CSS-in-JS 방식의 transition 속성을 직접 지정한다.
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
}

/** 전환에 사용할 CSS transition 값 — 모든 변화 속성을 300ms ease로 통일 */
const TRANSITION =
  "background-color 300ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease, font-weight 150ms ease";

export default function CategoryTabButton({
  id,
  label,
  isActive,
  onClick,
  icon: Icon = Star,
  size = "md",
}: CategoryTabButtonProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      data-active={isActive ? "true" : "false"}
      onClick={() => onClick(id)}
      className={`flex items-center justify-center gap-1.5 whitespace-nowrap${
        isSm ? " w-full" : ""
      }`}
      style={{
        padding: isSm ? "6px 12px" : "6px 14px",
        borderRadius: "999px",
        fontSize: isSm ? "0.78rem" : "0.85rem",
        fontWeight: isActive ? 700 : 500,
        /* 배경 */
        backgroundColor: isActive ? "#d1ab67" : "#fafaf8",
        /* 텍스트 */
        color: isActive ? "#ffffff" : "#6B7280",
        /* 테두리 */
        border: `1.5px solid ${isActive ? "#d1ab67" : "#E5E7EB"}`,
        /* 그림자 */
        boxShadow: isActive
          ? "0 4px 14px rgba(209,171,103,0.38)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        /* 미세 상승 */
        transform: isActive ? "translateY(-2px)" : "translateY(0)",
        /* 부드러운 전환 */
        transition: TRANSITION,
        /* 클릭 피드백 */
        cursor: "pointer",
        outline: "none",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          color: isActive ? "#ffffff" : "#9CA3AF",
          transition: "color 300ms ease",
        }}
      >
        <Icon size={isSm ? 12 : 13} />
      </span>
      <span>{label}</span>
    </button>
  );
}
