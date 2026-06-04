/**
 * CategoryTabButton
 * TreatmentsEquipmentSectionV2의 카테고리 탭 버튼.
 * 모바일(compact)과 데스크탑(default) 두 가지 크기를 size prop으로 제어하여
 * 기존 코드에서 중복 렌더링되던 두 개의 버튼 블록을 하나로 통합한다.
 */
import { Star } from "lucide-react";

interface CategoryTabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
  /** "sm" = 모바일 compact, "md" = 데스크탑 default */
  size?: "sm" | "md";
}

const ACTIVE_STYLE = {
  background: "#d1ab67",
  color: "white",
  border: "1.5px solid #d1ab67",
  boxShadow: "0 4px 12px rgba(209,171,103,0.30)",
  transform: "translateY(-1px)",
} as const;

const INACTIVE_STYLE = {
  background: "#fafaf8",
  color: "#6B7280",
  border: "1.5px solid #E5E7EB",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  transform: "none",
} as const;

export default function CategoryTabButton({
  id,
  label,
  isActive,
  onClick,
  size = "md",
}: CategoryTabButtonProps) {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      data-active={isActive ? "true" : "false"}
      onClick={() => onClick(id)}
      className={`flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-250${
        isSm ? " w-full" : ""
      }`}
      style={{
        padding: isSm ? "6px 12px" : "6px 14px",
        borderRadius: "999px",
        fontSize: isSm ? "0.78rem" : "0.85rem",
        fontWeight: isActive ? 700 : 500,
        ...(isActive ? ACTIVE_STYLE : INACTIVE_STYLE),
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          color: isActive ? "white" : "#9CA3AF",
        }}
      >
        <Star size={12} />
      </span>
      <span>{label}</span>
    </button>
  );
}
