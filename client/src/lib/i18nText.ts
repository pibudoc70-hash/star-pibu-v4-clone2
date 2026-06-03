/**
 * i18nText - 다국어 문자열 헬퍼
 *
 * 사용처: 시술 상세 페이지, 장비 상세 페이지, 기타 다국어 콘텐츠
 *
 * fallback 정책:
 *   ko → ko
 *   en → en → ko
 *   ja → ja → en → ko
 *   zh → zh → en → ko
 */

export type SupportedLang = "ko" | "en" | "ja" | "zh";

export type LocalizedString = {
  ko: string;
  en?: string;
  ja?: string;
  zh?: string;
};

export type LocalizedFaq = {
  ko: { question: string; answer: string }[];
  en?: { question: string; answer: string }[];
  ja?: { question: string; answer: string }[];
  zh?: { question: string; answer: string }[];
};

export function pickLocalized(value: LocalizedString, lang: SupportedLang): string {
  if (lang === "ko") return value.ko;
  if (lang === "en") return value.en?.trim() ? value.en : value.ko;
  if (lang === "ja") return value.ja?.trim() ? value.ja : value.en?.trim() ? value.en : value.ko;
  if (lang === "zh") return value.zh?.trim() ? value.zh : value.en?.trim() ? value.en : value.ko;
  return value.ko;
}

export function pickLocalizedFaq(
  faq: LocalizedFaq | undefined,
  lang: SupportedLang
): { question: string; answer: string }[] {
  if (!faq) return [];
  if (lang === "ko") return faq.ko ?? [];
  if (lang === "en") return faq.en?.length ? faq.en : faq.ko ?? [];
  if (lang === "ja") return faq.ja?.length ? faq.ja : faq.en?.length ? faq.en : faq.ko ?? [];
  if (lang === "zh") return faq.zh?.length ? faq.zh : faq.en?.length ? faq.en : faq.ko ?? [];
  return faq.ko ?? [];
}
