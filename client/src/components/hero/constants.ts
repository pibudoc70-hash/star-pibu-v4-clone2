/**
 * hero/constants.ts — HeroSection 전용 정적 상수
 *
 * [R13-P1-1] HeroSection.tsx에서 이미지 URL 상수를 별도 파일로 분리
 * - 이미지 URL 변경 시 이 파일만 수정하면 됨
 * - HeroSection 컴포넌트는 표현(렌더링)만 담당
 *
 * CDN 기반 이미지 URL 구조:
 * - desktop: WebP + JPEG 폴백 (min-width: 641px)
 * - mobile portrait: WebP + JPEG 폴백 (max-width: 640px)
 * - logo: PNG (AI 로고)
 *
 * [R20-P0-3] HERO_DELAYS 상수를 HeroSection.tsx에서 이 파일로 이동
 * - 애니메이션 타이밍 변경 시 이 파일만 수정하면 됨
 */


/** 히어로 배경 이미지 URL 모음 */
export const HERO_IMAGES = {
  /** 데스크톱 배경 (WebP, min-width: 641px) */
  desktopWebp: "/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp",
  /** 데스크톱 배경 (JPEG 폴백) */
  desktopJpg: "/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp",
  /** 모바일 세로 배경 (WebP, max-width: 640px) — 데스크탑 이미지 공용 사용 (STAR DERMATOLOGY 글자 노출) */
  mobilePortraitWebp: "/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp",
  /** 모바일 세로 배경 (JPEG 폴백) */
  mobilePortraitJpg: "/api/storage/hero-bg-new-desktop_2f8a8ccf_482fcfca.webp",
} as const;

/** 스타피부과 AI 로고 이미지 URL */
// [P0-OPT] PNG (118 KB) → WebP (42.5 KB) 변환으로 73.3 KB 절감
export const HERO_LOGO_IMAGE = "/api/storage/star_logo_d0ae8bbf.webp";

/**
 * HERO_DELAYS — HeroSection 애니메이션 딜레이 상수
 *
 * 애니메이션 시스템 타임라인:
 * - 로고: heroFadeUp (0.0s)
 * - 병원명 "스타피부과": 글자별 charReveal stagger (0.3s~)
 * - 개원 배지: heroFadeUp (0.75s)
 * - 슬로건 단어별: wordReveal stagger (0.9s~)
 * - 층별 안내: heroFadeUp (1.25s)
 * - 수치 통계: heroFadeUp stagger (1.4s~)
 * - CTA 버튼: heroFadeUp stagger (1.7s~)
 * - 스크롤 인디케이터: heroFadeUp (2.1s)
 *
 * 모두 cubic-bezier(0.16, 1, 0.3, 1) spring easing — 팝업/섹션과 동일
 */
export const HERO_DELAYS = {
  floorBadge: "1250ms",
  statBase: 1000,
  statStep: 120,
  ctaFirst: "1350ms",
  ctaSecond: "1470ms",
  ctaPhone: "1590ms",
  ctaScroll: "1700ms",
} as const;
