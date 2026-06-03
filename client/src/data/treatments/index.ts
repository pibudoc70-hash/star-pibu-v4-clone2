/**
 * treatments/index.ts
 *
 * 시술 상세 페이지에서 사용하는 다국어 시술 데이터의 단일 진입점.
 * 새 시술 추가 시:
 *   1) ./<slug>.ts 파일을 만든다
 *   2) 이 파일에서 import 한 뒤 TREATMENT_DATA 에 등록한다
 */

import type { LocalizedString, LocalizedFaq } from "@/lib/i18nText";
import { ulthera } from "./ulthera";
import { thermage } from "./thermage";
import { underEyeFat } from "./under-eye-fat";

export interface TreatmentI18n {
  slug: string;

  category: LocalizedString;

  badge?: LocalizedString;
  badgeColor?: string;

  image: string;
  cardBannerImage?: string;

  name: LocalizedString;
  nameEn: string;

  desc: LocalizedString;

  detail: LocalizedString;
  effect: LocalizedString;
  caution: LocalizedString;

  time: LocalizedString;
  recovery: LocalizedString;
  sessions: LocalizedString;

  youtubeUrl?: string;

  seoTitle: LocalizedString;
  seoDescription: LocalizedString;
  seoKeywords: LocalizedString;

  schemaBodyLocation?: LocalizedString;

  faq?: LocalizedFaq;
}

export const TREATMENT_DATA: Record<string, TreatmentI18n> = {
  ulthera,
  thermage,
  "under-eye-fat": underEyeFat,
};

export function getTreatmentBySlug(slug: string | undefined): TreatmentI18n | undefined {
  if (!slug) return undefined;
  return TREATMENT_DATA[slug];
}

export function getAllTreatments(): TreatmentI18n[] {
  return Object.values(TREATMENT_DATA);
}
