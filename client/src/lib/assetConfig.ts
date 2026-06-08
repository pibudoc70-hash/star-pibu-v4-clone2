/**
 * assetConfig.ts — 정적 에셋 URL 중앙 관리
 *
 * [R20-P2-9] constants.ts / seoHelpers.ts에 분산된 에셋 URL을 한 곳에서 관리
 * - OG 이미지 URL: seoHelpers.ts의 OG_IMAGE_LOCALIZED 동기화
 * - 클리닉 대표 이미지: constants.ts CLINIC_INFO.image 동기화
 *
 * 에셋 URL 변경 시 이 파일만 수정하면 됩니다.
 * 배포 경로: /manus-storage/{key} (Manus 내장 스토리지)
 */

/** OG 이미지 URL — SNS 공유 시 사용 (1200×630px) */
export const OG_IMAGES = {
  ko: "/manus-storage/og-image-ko_5fc1105f.jpg",
  en: "/manus-storage/og-image-en_dc8cb653.jpg",
  ja: "/manus-storage/og-image-ja_273d0e42.jpg",
  zh: "/manus-storage/og-image-zh_31a7313b.jpg",
} as const;

/**
 * 클리닉 대표 이미지 URL — JSON-LD MedicalBusiness schema의 image 필드에 사용
 *
 * TODO: 전용 클리닉 대표 이미지 업로드 후 이 경로를 업데이트하세요.
 *       현재는 ko OG 이미지를 임시 대체값으로 사용합니다.
 */
export const CLINIC_REPRESENTATIVE_IMAGE = OG_IMAGES.ko;

/** 히어로 배경 이미지 CDN 기반 URL — hero/constants.ts에서 관리 (여기서는 참조만) */
export const HERO_CDN_BASE = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";
