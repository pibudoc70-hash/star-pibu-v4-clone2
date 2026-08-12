/**
 * assetConfig.ts — 정적 에셋 URL 중앙 관리
 *
 * [R20-P2-9] constants.ts / seoHelpers.ts에 분산된 에셋 URL을 한 곳에서 관리
 * - OG 이미지 URL: seoHelpers.ts의 OG_IMAGE_LOCALIZED 동기화
 * - 클리닉 대표 이미지: constants.ts CLINIC_INFO.image 동기화
 *
 * 에셋 URL 변경 시 이 파일만 수정하면 됩니다.
 * 배포 경로: /api/storage/{key} (Manus 내장 스토리지)
 */

/** OG 이미지 URL — SNS 공유 시 사용 (1200×630px) */
export const OG_IMAGES = {
  ko: "/api/storage/og-image-ko_5fc1105f.jpg",
  en: "/api/storage/og-image-en_dc8cb653.jpg",
  ja: "/api/storage/og-image-ja_273d0e42.jpg",
  zh: "/api/storage/og-image-zh_31a7313b.jpg",
} as const;

/**
 * 클리닉 대표 이미지 URL — JSON-LD MedicalBusiness schema의 image 필드에 사용
 *
 * TODO: 전용 클리닉 대표 이미지 업로드 후 이 경로를 업데이트하세요.
 *       현재는 ko OG 이미지를 임시 대체값으로 사용합니다.
 */
export const CLINIC_REPRESENTATIVE_IMAGE = OG_IMAGES.ko;

/** 공지·연구 콘텐츠에 첨부 이미지가 없을 때 사용하는 기본 대표 이미지 (1200×630px) */
export const CONTENT_OG_IMAGES = {
  notice: "/manus-storage/star-pibu-notice-default-og_ecb315e1.png",
  research: "/manus-storage/star-pibu-research-default-og_d1b8b02a.png",
} as const;

/** 히어로 배경 이미지 CDN 기반 URL — hero/constants.ts에서 관리 (여기서는 참조만) */
