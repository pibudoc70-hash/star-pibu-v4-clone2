/**
 * Star Dermatology — Premium Clinic Top-Tier Design System (R13)
 *
 * 공통 컴포넌트:
 *   - EyebrowLabel   : 섹션 상단 소문자 레이블 (TREATMENTS & EQUIPMENT 등)
 *   - SectionHeader  : 섹션 헤더 (eyebrow + h2 + optional tagline)
 *   - PremiumButton  : primary / secondary / ghost 3종 CTA 버튼
 *   - SurfaceCard    : 정제된 카드 표면 (white / warm / ivory / transparent)
 *   - StatItem       : 수치 통계 아이템
 *   - CTAGroup       : CTA 버튼 그룹 (horizontal / vertical)
 *   - GoldRule       : 골드 구분선 (horizontal rule)
 *   - SectionDivider : 섹션 간 시각적 구분 여백
 *
 * 디자인 원칙 (R13 업그레이드):
 *   - Warm white / ivory / soft beige 배경 레이어
 *   - Charcoal / deep gray 텍스트 계층
 *   - Champagne gold accent — 제한적 사용 (과도한 골드 지양)
 *   - 강한 여백 (breathing room), 정제된 타이포그래피 계층
 *   - 미세한 hover elevation (scale 없이 shadow/border 변화)
 *   - motion token 기반 통일 (prefers-reduced-motion 고려)
 */
import React from "react";

// ── Design Tokens ──────────────────────────────────────────────────────────────
export const DS = {
  color: {
    // Core palette
    gold: "#C9A84C",
    goldLight: "#F5D78E",  // 카운터 완료 시 골드 색상
    goldMid: "#D4B87A",   // 중간 골드
    goldDim: "rgba(201,168,76,0.18)",
    charcoal: "#1A1A1A",
    deepGray: "#2D2D2D",
    midGray: "#6B6B6B",
    lightGray: "#9A9A9A",
    warmWhite: "#FAFAF8",
    ivory: "#F7F4EF",
    softBeige: "#F0EBE1",
    white: "#FFFFFF",
    // Border
    border: "rgba(201,168,76,0.22)",
    borderSubtle: "rgba(0,0,0,0.07)",
    borderStrong: "rgba(0,0,0,0.12)",
    // Dark editorial (for dark sections)
    darkNavy: "#0F1A30",
    darkNavyMid: "#1A2744",
  },
  motion: {
    spring: "cubic-bezier(0.16, 1, 0.3, 1)",
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "0.2s",
    base: "0.35s",
    slow: "0.55s",
    // Stagger helpers (use as inline style delay)
    stagger: (i: number, base = 0.08) => `${i * base}s`,
  },
  shadow: {
    sm: "0 1px 4px rgba(0,0,0,0.06)",
    md: "0 4px 16px rgba(0,0,0,0.07)",
    lg: "0 12px 40px rgba(0,0,0,0.08)",
    xl: "0 24px 64px rgba(0,0,0,0.10)",
    gold: "0 8px 32px rgba(201,168,76,0.18)",
    goldHover: "0 16px 48px rgba(201,168,76,0.25)",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "20px",
    xl: "28px",
    pill: "999px",
  },
  spacing: {
    // Section vertical rhythm
    sectionPy: "clamp(5rem, 10vw, 8rem)",
    sectionGap: "clamp(3rem, 6vw, 5rem)",
    headerGap: "clamp(2rem, 4vw, 3rem)",
    cardGap: "clamp(1.25rem, 2.5vw, 2rem)",
    // Inline padding
    pagePx: "clamp(1.25rem, 5vw, 4rem)",
    containerMax: "1200px",
  },
  typography: {
    eyebrow: {
      fontSize: "0.72rem",
      fontWeight: 400,
      letterSpacing: "0.28em",
      textTransform: "uppercase" as const,
    },
    h2lg: "clamp(1.8rem, 6vw, 3.2rem)",
    h2md: "clamp(1.5rem, 5vw, 2.6rem)",
    h2sm: "clamp(1.3rem, 4vw, 2rem)",
    body: "clamp(0.9rem, 2.5vw, 1.05rem)",
    bodyLg: "clamp(1rem, 2.8vw, 1.15rem)",
    caption: "clamp(0.75rem, 1.8vw, 0.875rem)",
  },
} as const;

// ── EyebrowLabel ───────────────────────────────────────────────────────────────
interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  /** 어두운 배경 위에 사용 시 true */
  onDark?: boolean;
}

export function EyebrowLabel({
  children,
  className = "",
  align = "center",
  onDark = false,
}: EyebrowLabelProps) {
  return (
    <p
      className={`font-montserrat ${className}`}
      style={{
        color: onDark ? "rgba(201,168,76,0.85)" : DS.color.gold,
        fontSize: DS.typography.eyebrow.fontSize,
        fontWeight: DS.typography.eyebrow.fontWeight,
        letterSpacing: DS.typography.eyebrow.letterSpacing,
        textTransform: DS.typography.eyebrow.textTransform,
        textAlign: align,
      }}
    >
      {children}
    </p>
  );
}

// ── GoldRule ───────────────────────────────────────────────────────────────────
interface GoldRuleProps {
  align?: "left" | "center" | "right";
  width?: string;
  className?: string;
}

export function GoldRule({ align = "center", width = "40px", className = "" }: GoldRuleProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height: "1.5px",
        background: `linear-gradient(90deg, ${DS.color.gold}, transparent)`,
        borderRadius: "2px",
        marginLeft: align === "center" ? "auto" : align === "right" ? "auto" : undefined,
        marginRight: align === "center" ? "auto" : align === "left" ? "auto" : undefined,
      }}
    />
  );
}

// ── SectionHeader ──────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  tagline?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  titleSize?: "sm" | "md" | "lg";
  /** 어두운 배경 위에 사용 시 true */
  onDark?: boolean;
  /** GoldRule 표시 여부 (기본 true) */
  showRule?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  tagline,
  align = "center",
  className = "",
  titleSize = "md",
  onDark = false,
  showRule = true,
}: SectionHeaderProps) {
  const titleFontSize =
    titleSize === "sm" ? DS.typography.h2sm :
    titleSize === "lg" ? DS.typography.h2lg :
    DS.typography.h2md;

  const titleColor = onDark ? "rgba(255,255,255,0.95)" : DS.color.charcoal;
  const taglineColor = onDark ? "rgba(255,255,255,0.55)" : DS.color.midGray;

  return (
    <div
      className={`reveal-heading ${className}`}
      style={{ textAlign: align }}
    >
      {eyebrow && (
        <EyebrowLabel align={align} className="mb-3" onDark={onDark}>
          {eyebrow}
        </EyebrowLabel>
      )}
      <h2
        style={{
          color: titleColor,
          fontSize: titleFontSize,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          marginBottom: tagline ? "0.75rem" : 0,
        }}
      >
        {title}
      </h2>
      {tagline && (
        <p
          style={{
            color: taglineColor,
            fontSize: DS.typography.body,
            lineHeight: 1.7,
            maxWidth: align === "center" ? "560px" : undefined,
            margin: align === "center" ? "0 auto" : undefined,
            marginTop: "0.5rem",
          }}
        >
          {tagline}
        </p>
      )}
      {/* Gold rule */}
      {showRule && (
        <GoldRule
          align={align}
          width="40px"
          className="mt-5"
        />
      )}
    </div>
  );
}

// ── PremiumButton ──────────────────────────────────────────────────────────────
interface PremiumButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

const BUTTON_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  fontWeight: 600,
  letterSpacing: "0.02em",
  borderRadius: DS.radius.pill,
  transition: `all ${DS.motion.base} ${DS.motion.ease}`,
  cursor: "pointer",
  whiteSpace: "nowrap",
  textDecoration: "none",
};

const BUTTON_VARIANTS: Record<string, React.CSSProperties> = {
  primary: {
    background: DS.color.charcoal,
    color: DS.color.white,
    border: `1.5px solid ${DS.color.charcoal}`,
    boxShadow: DS.shadow.md,
  },
  secondary: {
    background: "transparent",
    color: DS.color.charcoal,
    border: `1.5px solid rgba(26,26,26,0.25)`,
    boxShadow: "none",
  },
  ghost: {
    background: "transparent",
    color: DS.color.gold,
    border: `1.5px solid ${DS.color.border}`,
    boxShadow: "none",
  },
  gold: {
    background: DS.color.gold,
    color: DS.color.white,
    border: `1.5px solid ${DS.color.gold}`,
    boxShadow: DS.shadow.gold,
  },
};

const BUTTON_SIZES: Record<string, React.CSSProperties> = {
  sm: { fontSize: "0.78rem", padding: "0.5rem 1.1rem" },
  md: { fontSize: "0.875rem", padding: "0.65rem 1.5rem" },
  lg: { fontSize: "0.95rem", padding: "0.8rem 2rem" },
};

const BUTTON_HOVER: Record<string, Partial<React.CSSProperties>> = {
  primary: { background: "#333333", boxShadow: DS.shadow.lg, transform: "translateY(-1px)" },
  secondary: { background: "rgba(26,26,26,0.05)", transform: "translateY(-1px)" },
  ghost: { background: DS.color.goldDim, transform: "translateY(-1px)" },
  gold: { background: "#B89640", boxShadow: DS.shadow.goldHover, transform: "translateY(-1px)" },
};

export function PremiumButton({
  variant = "primary",
  size = "md",
  children,
  onClick,
  href,
  target,
  rel,
  className = "",
  style,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
}: PremiumButtonProps) {
  const combinedStyle: React.CSSProperties = {
    ...BUTTON_BASE,
    ...BUTTON_VARIANTS[variant],
    ...BUTTON_SIZES[size],
    ...style,
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : undefined,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const hover = BUTTON_HOVER[variant];
    if (hover.background) el.style.background = hover.background as string;
    if (hover.boxShadow) el.style.boxShadow = hover.boxShadow as string;
    if (hover.transform) el.style.transform = hover.transform as string;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.background = BUTTON_VARIANTS[variant].background as string;
    el.style.boxShadow = (BUTTON_VARIANTS[variant].boxShadow as string) ?? "none";
    el.style.transform = "translateY(0)";
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={className}
        style={combinedStyle}
        aria-label={ariaLabel}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={combinedStyle}
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}

// ── SurfaceCard ────────────────────────────────────────────────────────────────
interface SurfaceCardProps {
  variant?: "white" | "warm" | "ivory" | "beige" | "transparent";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  radius?: keyof typeof DS.radius;
}

export function SurfaceCard({
  variant = "white",
  children,
  className = "",
  style,
  onClick,
  hoverable = false,
  radius = "lg",
}: SurfaceCardProps) {
  const bg =
    variant === "warm" ? DS.color.warmWhite :
    variant === "ivory" ? DS.color.ivory :
    variant === "beige" ? DS.color.softBeige :
    variant === "transparent" ? "transparent" :
    DS.color.white;

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: bg,
        borderRadius: DS.radius[radius],
        border: `1px solid ${DS.color.borderSubtle}`,
        boxShadow: DS.shadow.sm,
        transition: hoverable ? `all ${DS.motion.base} ${DS.motion.ease}` : undefined,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onMouseEnter={hoverable ? (e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = DS.shadow.gold;
        el.style.borderColor = DS.color.border;
        el.style.transform = "translateY(-2px)";
      } : undefined}
      onMouseLeave={hoverable ? (e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = DS.shadow.sm;
        el.style.borderColor = DS.color.borderSubtle;
        el.style.transform = "translateY(0)";
      } : undefined}
    >
      {children}
    </div>
  );
}

// ── StatItem ───────────────────────────────────────────────────────────────────
interface StatItemProps {
  value: React.ReactNode;
  unit?: string;
  label: string;
  isDone?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function StatItem({ value, unit, label, isDone = false, className = "", style }: StatItemProps) {
  return (
    <div className={`text-center ${className}`} style={style}>
      <div
        style={{
          color: isDone ? DS.color.gold : "rgba(255,255,255,0.95)",
          fontSize: "clamp(1.2rem, 4.5vw, 2.2rem)",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          lineHeight: 1,
          transition: `color ${DS.motion.slow} ${DS.motion.ease}`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: "60%", fontWeight: 300, opacity: 0.8, marginLeft: "2px" }}>
            {unit}
          </span>
        )}
      </div>
      <div
        style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${DS.color.gold}, transparent)`,
          marginTop: "6px",
          transform: isDone ? "scaleX(1)" : "scaleX(0)",
          transition: `transform ${DS.motion.slow} ${DS.motion.spring}`,
          transformOrigin: "center",
        }}
      />
      <div
        style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: DS.typography.caption,
          letterSpacing: "0.05em",
          marginTop: "6px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── CTAGroup ───────────────────────────────────────────────────────────────────
interface CTAGroupProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  className?: string;
  style?: React.CSSProperties;
}

export function CTAGroup({ children, direction = "row", className = "", style }: CTAGroupProps) {
  return (
    <div
      className={`flex ${direction === "col" ? "flex-col" : "flex-row flex-wrap"} items-center justify-center ${className}`}
      style={{ gap: "0.75rem", ...style }}
    >
      {children}
    </div>
  );
}

// ── SectionDivider ─────────────────────────────────────────────────────────────
/**
 * 섹션 간 시각적 구분 — 미니멀 여백 + 선택적 골드 라인
 */
interface SectionDividerProps {
  showLine?: boolean;
  className?: string;
}

export function SectionDivider({ showLine = false, className = "" }: SectionDividerProps) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={{ gap: "0" }}>
      {showLine && (
        <div
          style={{
            width: "1px",
            height: "48px",
            background: `linear-gradient(180deg, transparent, ${DS.color.border}, transparent)`,
          }}
        />
      )}
    </div>
  );
}
