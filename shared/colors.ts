/**
 * shared/colors.ts
 * 스타피부과 브랜드 색상 상수 (단일 소스)
 *
 * 사용 방법:
 *   import { STAR_COLORS } from "@/../../shared/colors";
 *   style={{ color: STAR_COLORS.navy }}
 *
 * CSS 변수 매핑:
 *   navy   → --color-star-navy   (#4A6FA5)
 *   mint   → --color-star-mint   (#81C7C9)
 *   dark   → --color-text-dark   (#1F2937)
 *   gray   → --color-text-gray   (#6B7280)
 *   muted  → --color-text-muted  (#9CA3AF)
 *   bgNavy → --color-bg-navy     (#EEF3FA)
 *   bgMint → --color-bg-mint     (#EEF7F7)
 */
export const STAR_COLORS = {
  /** 브랜드 네이비 #4A6FA5 */
  navy: "#4A6FA5",
  /** 브랜드 민트 #81C7C9 */
  mint: "#81C7C9",
  /** 본문 다크 텍스트 #1F2937 */
  dark: "#1F2937",
  /** 본문 회색 텍스트 #6B7280 */
  gray: "#6B7280",
  /** 보조 회색 텍스트 #9CA3AF */
  muted: "#9CA3AF",
  /** 네이비 배경 #EEF3FA */
  bgNavy: "#EEF3FA",
  /** 민트 배경 #EEF7F7 */
  bgMint: "#EEF7F7",
} as const;

/** 교대 색상 배열 (navy/mint 반복) */
export const ALTERNATING_COLORS = [
  STAR_COLORS.navy,
  STAR_COLORS.mint,
  STAR_COLORS.navy,
  STAR_COLORS.mint,
  STAR_COLORS.navy,
  STAR_COLORS.mint,
] as const;

/** 교대 배경 배열 (bgNavy/bgMint 반복) */
export const ALTERNATING_BG = [
  STAR_COLORS.bgNavy,
  STAR_COLORS.bgMint,
  STAR_COLORS.bgNavy,
  STAR_COLORS.bgMint,
  STAR_COLORS.bgNavy,
  STAR_COLORS.bgMint,
] as const;
