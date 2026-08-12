/**
 * localizedPath.ts
 *
 * [R11-F] langPrefix 패턴 중앙화
 * 5개 파일에서 반복되던 `lang === "ko" ? "" : `/${lang}`` 패턴을 단일 유틸로 추출.
 *
 * 사용 예:
 *   const pageUrl = getLocalizedUrl(lang, "/equipment2/" + slug);
 *   // ko → "https://star-pibu.com/equipment2/laser"
 *   // en → "https://star-pibu.com/en/equipment2/laser"
 */

import type { Lang } from "@/lib/i18n.types";

export const SITE_ORIGIN = "https://star-pibu.com";

/**
 * 언어 코드에 따른 URL 경로 접두사를 반환합니다.
 * - ko: "" (접두사 없음)
 * - en/ja/zh: "/{lang}", zh-TW: "/zh-tw"
 */
export function getLangPrefix(lang: Lang): string {
  if (lang === "ko") return "";
  return lang === "zh-TW" ? "/zh-tw" : `/${lang}`;
}

/**
 * 언어별 전체 URL을 반환합니다.
 * @param lang - 현재 언어 코드
 * @param path - 슬래시(/)로 시작하는 경로 (예: "/equipment2/laser")
 */
export function getLocalizedUrl(lang: Lang, path: string): string {
  return `${SITE_ORIGIN}${getLangPrefix(lang)}${path}`;
}
