/**
 * CategoryTabButton — STAR 피부과 (Luxury Minimal Medical Redesign)
 *
 * 디자인 원칙:
 * - 활성 탭: 골드 배경 pill + 흰색 텍스트 + 골드 그림자
 * - 비활성 탭: ivory 배경 + 미드그레이 텍스트 + 골드 테두리(subtle)
 * - hover: 골드 라이트 배경 + 딥그레이 텍스트
 * - 전환: 300ms ease (모든 속성 통일)
 *
 * icon prop: CATEGORY_ICON_MAP에서 전달받은 lucide-react 아이콘 컴포넌트.
 *            미전달 시 기본 Star 아이콘 사용.
 *
 * data-active: useStaticTreatmentFilter의 auto-scroll 로직이 의존하므로 반드시 유지.
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
      className={`flex items-center justify-center gap-1.5 whitespace-nowrap${isSm ? " w-full" : ""}`}
      style={{
        padding: isSm ? "6px 12px" : "7px 16px",
        borderRadius: "999px",
        fontSize: isSm ? "0.78rem" : "0.85rem",
        fontWeight: isActive ? 700 : 500,
        /* 배경 */
        backgroundColor: isActive ? "#C9A84C" : "#FAFAF8",
        /* 텍스트 */
        color: isActive ? "#FFFFFF" : "#6B6B6B",
        /* 테두리 */
        border: `1.5px solid ${isActive ? "#C9A84C" : "rgba(201,168,76,0.25)"}`,
        /* 그림자 */
        boxShadow: isActive
          ? "0 4px 16px rgba(201,168,76,0.32)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        /* 미세 상승 */
        transform: isActive ? "translateY(-1px)" : "translateY(0)",
        /* 부드러운 전환 */
        transition: TRANSITION,
        cursor: "pointer",
        outline: "none",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          color: isActive ? "rgba(255,255,255,0.85)" : "#9A9A9A",
          transition: "color 300ms ease",
        }}
      >
        <Icon size={isSm ? 12 : 13} />
      </span>
      <span>{label}</span>
    </button>
  );
}
