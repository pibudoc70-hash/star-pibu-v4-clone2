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
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

/** 히어로 배경 이미지 URL 모음 */
export const HERO_IMAGES = {
  /** 데스크톱 배경 (WebP, min-width: 641px) */
  desktopWebp: `${CDN}/hero-bg-new-desktop_2f8a8ccf.webp`,
  /** 데스크톱 배경 (JPEG 폴백) */
  desktopJpg: `${CDN}/hero-bg-new-desktop.jpg`,
  /** 모바일 세로 배경 (WebP, max-width: 640px) */
  mobilePortraitWebp: `${CDN}/hero-mobile-new-mobile_f9bea0c7.webp`,
  /** 모바일 세로 배경 (JPEG 폴백) */
  mobilePortraitJpg: `${CDN}/hero-mobile-new-mobile.jpg`,
} as const;

/** 스타피부과 AI 로고 이미지 URL */
export const HERO_LOGO_IMAGE = `${CDN}/star_ai_logo_1_73172f49.png`;
