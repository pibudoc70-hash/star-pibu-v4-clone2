/**
 * DesignSystem.tsx — 스타피부과 디자인 시스템 컴포넌트
 *
 * [R22-P0-1] 선언형 CSS class/variant 기반 재설계
 *   - PremiumButton: onMouseEnter/Leave DOM style mutation 완전 제거
 *     → hover:/active:/focus-visible:/disabled: Tailwind pseudo-class + CSS custom property 기반
 *   - SurfaceCard: onMouseEnter/Leave DOM style mutation 완전 제거
 *     → group/hover: Tailwind 기반 선언형 상태 관리
 *   - 상호작용 상태(hover/active/focus-visible/disabled/onDark)를 디자인 시스템이 선언적으로 소유
 *   - variant prop으로 재사용 가능한 상태 규칙 정의
 *
 * 사용 예시:
 *   <PremiumButton variant="gold">카카오톡 상담</PremiumButton>
 *   <PremiumButton variant="outline" onDark>전화 상담</PremiumButton>
 *   <SurfaceCard variant="elevated">...</SurfaceCard>
 */
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens (CSS custom property 기반)
// ─────────────────────────────────────────────────────────────────────────────
// 모든 색상 토큰은 index.css의 @theme / :root에서 관리됩니다.
// 이 파일에서는 Tailwind arbitrary value [var(--token)] 형태로만 참조합니다.

// ─────────────────────────────────────────────────────────────────────────────
// PremiumButton
// ─────────────────────────────────────────────────────────────────────────────

export type PremiumButtonVariant = "gold" | "outline" | "ghost" | "dark";

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 스타일 variant
   * - "gold"    : 골드 배경 + 흰 텍스트 (기본 CTA)
   * - "outline" : 투명 배경 + 골드 테두리 (보조 CTA)
   * - "ghost"   : 테두리 없음 + 골드 텍스트 (최소 강조)
   * - "dark"    : 다크 배경 + 골드 텍스트 (어두운 섹션용)
   */
  variant?: PremiumButtonVariant;
  /**
   * 어두운 배경 위에서 사용할 때 true로 설정
   * outline/ghost variant에서 테두리/텍스트 색상을 밝게 조정
   */
  onDark?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 버튼 크기 */
  size?: "sm" | "md" | "lg";
}

const PREMIUM_BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold " +
  "transition-all duration-200 select-none " +
  // focus-visible: 키보드 접근성 (WCAG 2.4.7)
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-[var(--color-gold-primary)] " +
  // disabled: 상태 (DOM mutation 없이 CSS만으로 처리)
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
  // active: 피드백
  "active:scale-95 ";

const PREMIUM_BUTTON_SIZES: Record<NonNullable<PremiumButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const PREMIUM_BUTTON_VARIANTS: Record<PremiumButtonVariant, string> = {
  gold:
    "bg-[var(--color-gold-primary)] text-white border-none " +
    "hover:bg-[var(--color-gold-deep)] hover:shadow-lg hover:shadow-[var(--color-gold-primary)]/30",
  outline:
    "bg-transparent text-[var(--color-gold-primary)] " +
    "border border-[var(--color-gold-primary)] " +
    "hover:bg-[var(--color-gold-pale)] hover:shadow-md",
  ghost:
    "bg-transparent text-[var(--color-gold-primary)] border-none " +
    "hover:bg-[var(--color-gold-pale)]",
  dark:
    "bg-[var(--color-star-navy)] text-[var(--color-gold-primary)] border-none " +
    "hover:bg-[var(--color-star-navy-deep)] hover:shadow-lg",
};

const PREMIUM_BUTTON_ON_DARK: Partial<Record<PremiumButtonVariant, string>> = {
  outline:
    "text-white border-white/60 hover:bg-white/10 hover:border-white",
  ghost:
    "text-white/80 hover:text-white hover:bg-white/10",
};

/**
 * PremiumButton — 스타피부과 디자인 시스템 버튼
 *
 * 모든 상호작용 상태(hover/active/focus-visible/disabled)를
 * Tailwind pseudo-class + CSS custom property로 선언적으로 처리합니다.
 * onMouseEnter/Leave DOM style mutation을 사용하지 않습니다.
 */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      variant = "gold",
      onDark = false,
      fullWidth = false,
      size = "md",
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const variantClass =
      onDark && PREMIUM_BUTTON_ON_DARK[variant]
        ? PREMIUM_BUTTON_ON_DARK[variant]!
        : PREMIUM_BUTTON_VARIANTS[variant];

    const classes = [
      PREMIUM_BUTTON_BASE,
      PREMIUM_BUTTON_SIZES[size],
      variantClass,
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    );
  }
);
PremiumButton.displayName = "PremiumButton";

// ─────────────────────────────────────────────────────────────────────────────
// SurfaceCard
// ─────────────────────────────────────────────────────────────────────────────

export type SurfaceCardVariant = "flat" | "elevated" | "bordered" | "gold-accent";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 카드 스타일 variant
   * - "flat"        : 그림자 없음 + 흰 배경 (기본)
   * - "elevated"    : 부드러운 그림자 + hover 시 그림자 강화
   * - "bordered"    : 골드 테두리 + hover 시 골드 강화
   * - "gold-accent" : 골드 상단 액센트 라인 + elevated 그림자
   */
  variant?: SurfaceCardVariant;
  /** 클릭 가능한 카드 (role="button" + 키보드 접근성 추가) */
  interactive?: boolean;
}

const SURFACE_CARD_BASE =
  "rounded-2xl bg-white transition-all duration-200 ";

const SURFACE_CARD_VARIANTS: Record<SurfaceCardVariant, string> = {
  flat: "shadow-none",
  elevated:
    "shadow-sm hover:shadow-md hover:-translate-y-0.5",
  bordered:
    "border border-[var(--color-gold-light)] " +
    "hover:border-[var(--color-gold-primary)] hover:shadow-sm",
  "gold-accent":
    "border-t-2 border-t-[var(--color-gold-primary)] " +
    "shadow-sm hover:shadow-md hover:-translate-y-0.5",
};

const SURFACE_CARD_INTERACTIVE =
  "cursor-pointer " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-[var(--color-gold-primary)] " +
  "active:scale-[0.99]";

/**
 * SurfaceCard — 스타피부과 디자인 시스템 카드
 *
 * 모든 상호작용 상태(hover/focus-visible/active)를
 * Tailwind group/hover pseudo-class로 선언적으로 처리합니다.
 * onMouseEnter/Leave DOM style mutation을 사용하지 않습니다.
 */
export const SurfaceCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  (
    {
      variant = "flat",
      interactive = false,
      className = "",
      children,
      ...rest
    },
    ref
  ) => {
    const classes = [
      SURFACE_CARD_BASE,
      SURFACE_CARD_VARIANTS[variant],
      interactive ? SURFACE_CARD_INTERACTIVE : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        // interactive 카드에 키보드 접근성 추가
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? "button" : undefined}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
SurfaceCard.displayName = "SurfaceCard";

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports (디자인 시스템 단일 진입점)
// ─────────────────────────────────────────────────────────────────────────────
export type { PremiumButtonProps, SurfaceCardProps };
