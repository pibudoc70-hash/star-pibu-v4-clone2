/**
 * clinic-stats.ts — 병원 홍보 통계 단일 소스
 *
 * ⚠️ 의료광고 심의 대응
 *    아래 숫자는 모두 근거 자료가 확보된 값이다 (2026-07 원장 확인).
 *    값을 변경할 때는 반드시 원장 확인을 받고 근거를 주석에 기록할 것.
 *    이 파일 외의 곳에 숫자를 새로 하드코딩하지 말고 여기서 import 한다.
 *
 * [Step58-A] 여러 파일에 흩어진 숫자를 한 곳으로 모았다.
 *
 * ⚠️ 기존 CLINIC_STATS (client/src/lib/constants.ts) 와의 관계:
 *    constants.ts 의 CLINIC_STATS 는 useCountUp 애니메이션 + JSON-LD 스키마 전용으로
 *    이미 16개 파일에서 참조 중이다. 이 파일은 그것을 대체하지 않고,
 *    specialistCount / paperCount / openedYear 등 누락된 값을 보완하며
 *    회귀 테스트의 단일 정본 역할을 한다.
 */

export const CLINIC_STATS = {
  /** 개원 연도 — 근거: 개원 기록 */
  openedYear: 2006,
  /** 임상 경력(년) — 근거: 개원 연도 기준 */
  yearsExperience: 20,
  /** 피부과 전문의 수 — 근거: 조시형·우혜진·이기욱 */
  specialistCount: 3,
  /** 눈밑지방재배치 누적 시술 건수 — 근거: 원내 시술 대장 */
  eyeBagCases: 4000,
  /** 보유 레이저·시술 장비 종류 수 — 근거: 원내 장비 목록 (원장 확인 완료) */
  deviceTypes: 50,
  /** constants.ts CLINIC_STATS.laserTypes 호환 필드 (50종 동일) */
  laserTypes: 50,
  /** 대표원장 논문 편수 — 근거: PubMed/KCI 검색 결과 */
  paperCount: 11,
} as const;

export type ClinicStats = typeof CLINIC_STATS;

/** 표시용 포맷 헬퍼 — "4,000" 처럼 천단위 구분 */
export function formatStat(n: number): string {
  return n.toLocaleString("ko-KR");
}
