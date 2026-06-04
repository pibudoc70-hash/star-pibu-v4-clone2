/**
 * reservationPath.ts
 *
 * PR-26: 예약 CTA 진입 정책 통일 (B안)
 * - 예약은 언어별 홈의 #reservation 섹션으로 진입한다.
 * - ko => /#reservation
 * - en => /en#reservation
 * - ja => /ja#reservation
 * - zh => /zh#reservation
 *
 * 이 헬퍼를 통해 모든 예약 CTA가 동일한 정책을 따른다.
 */

import type { Lang } from "@/lib/i18n";

const LANG_HOME_PREFIX: Record<Lang, string> = {
  ko: "",
  en: "/en",
  ja: "/ja",
  zh: "/zh",
};

/**
 * 현재 언어에 맞는 예약 섹션 경로를 반환한다.
 * @example
 *   getReservationPath("ko") // => "/#reservation"
 *   getReservationPath("en") // => "/en#reservation"
 *   getReservationPath("ja") // => "/ja#reservation"
 *   getReservationPath("zh") // => "/zh#reservation"
 */
export function getReservationPath(lang: Lang): string {
  const prefix = LANG_HOME_PREFIX[lang] ?? "";
  // ko: prefix="" => "/#reservation"
  // en/ja/zh: prefix="/en" => "/en#reservation" (슬래시 중복 방지)
  if (prefix === "") return "/#reservation";
  return `${prefix}#reservation`;
}
