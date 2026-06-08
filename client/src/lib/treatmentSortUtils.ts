/**
 * treatmentSortUtils.ts — 시술 정렬 관련 순수 유틸리티 함수
 *
 * [R20-P2-7] useStaticTreatmentFilter.ts에서 sortTreatments / parseMinutes를 분리
 * - 순수 함수 → 단위 테스트 가능
 * - locale 비교(localeCompare)와 시간 파싱(parseMinutes)을 독립적으로 테스트 가능
 */
import type { Treatment } from "@/types/treatment";

export type SortBy = "name" | "time" | "popular";

/**
 * parseMinutes — 시술 시간 문자열에서 분(minute) 단위 숫자를 추출
 *
 * @example
 * parseMinutes("30분")   // → 30
 * parseMinutes("1시간")  // → 1  (숫자만 추출, 단위 무관)
 * parseMinutes(undefined) // → 0
 */
export function parseMinutes(timeStr: string | undefined): number {
  return parseInt((timeStr ?? "").replace(/[^0-9]/g, "") || "0", 10);
}

/**
 * sortTreatments — 시술 목록을 지정된 기준으로 정렬
 *
 * - "name": 한국어 locale 기준 오름차순 (localeCompare "ko")
 * - "time": parseMinutes 기준 오름차순
 * - "popular": 데이터 원본 순서 유지 (정렬 없음)
 *
 * 원본 배열을 변경하지 않고 새 배열을 반환한다.
 */
export function sortTreatments(items: Treatment[], sortBy: SortBy): Treatment[] {
  if (sortBy === "name") {
    return [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
  if (sortBy === "time") {
    return [...items].sort((a, b) => parseMinutes(a.time) - parseMinutes(b.time));
  }
  // "popular" — 데이터 원본 순서 유지
  return items;
}
