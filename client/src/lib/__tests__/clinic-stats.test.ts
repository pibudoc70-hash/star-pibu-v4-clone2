/**
 * clinic-stats.test.ts
 * CLINIC_STATS 단일 소스 검증 테스트 (Step 58 → Step 68 갱신)
 *
 * 목적:
 *   1. CLINIC_STATS_CANONICAL 값이 constants.ts CLINIC_STATS 와 일치하는지 확인 (T1)
 *   2. openedYear + yearsExperience 가 현재 연도와 ±1 이내인지 확인 (T2)
 *   3. specialistCount === 3 (T3)
 *   4. formatStat(4000) === "4,000" (T4)
 *   5. 핵심 숫자 범위 유효성 검사 (음수/0 방지)
 */
import { describe, it, expect } from "vitest";
import { CLINIC_STATS_CANONICAL, formatStat } from "../clinic-stats";
import { CLINIC_STATS as STATS_FROM_CONSTANTS } from "../constants";

describe("CLINIC_STATS 단일 소스 일치 검증", () => {
  it("T1: CLINIC_STATS_CANONICAL 과 constants.ts CLINIC_STATS 의 공통 필드(yearsExperience, eyeBagCases, laserTypes)가 완전히 일치해야 한다", () => {
    // constants.ts에 존재하는 3개 필드만 비교 (나머지는 clinic-stats.ts에만 있음)
    expect(CLINIC_STATS_CANONICAL.yearsExperience).toBe(STATS_FROM_CONSTANTS.yearsExperience);
    expect(CLINIC_STATS_CANONICAL.eyeBagCases).toBe(STATS_FROM_CONSTANTS.eyeBagCases);
    expect(CLINIC_STATS_CANONICAL.laserTypes).toBe(STATS_FROM_CONSTANTS.laserTypes);
  });

  it("T2: openedYear + yearsExperience 가 현재 연도와 ±1 이내여야 한다 (방치 감지)", () => {
    const currentYear = new Date().getFullYear();
    const derivedYear = CLINIC_STATS_CANONICAL.openedYear + CLINIC_STATS_CANONICAL.yearsExperience;
    expect(Math.abs(derivedYear - currentYear)).toBeLessThanOrEqual(1);
  });

  it("T3: specialistCount === 3 (조시형·우혜진·이기욱)", () => {
    expect(CLINIC_STATS_CANONICAL.specialistCount).toBe(3);
  });

  it("T4: formatStat(4000) === '4,000'", () => {
    expect(formatStat(4000)).toBe("4,000");
  });

  it("specialistCount는 3 이상이어야 한다", () => {
    expect(CLINIC_STATS_CANONICAL.specialistCount).toBeGreaterThanOrEqual(3);
  });

  it("yearsExperience는 1 이상이어야 한다", () => {
    expect(CLINIC_STATS_CANONICAL.yearsExperience).toBeGreaterThanOrEqual(1);
  });

  it("eyeBagCases는 1 이상이어야 한다", () => {
    expect(CLINIC_STATS_CANONICAL.eyeBagCases).toBeGreaterThanOrEqual(1);
  });

  it("laserTypes는 1 이상이어야 한다", () => {
    expect(CLINIC_STATS_CANONICAL.laserTypes).toBeGreaterThanOrEqual(1);
  });

  it("openedYear는 2000 이상 현재 연도 이하여야 한다", () => {
    const currentYear = new Date().getFullYear();
    expect(CLINIC_STATS_CANONICAL.openedYear).toBeGreaterThanOrEqual(2000);
    expect(CLINIC_STATS_CANONICAL.openedYear).toBeLessThanOrEqual(currentYear);
  });

  it("paperCount는 0 이상이어야 한다", () => {
    expect(CLINIC_STATS_CANONICAL.paperCount).toBeGreaterThanOrEqual(0);
  });
});

describe("CLINIC_STATS 파생 값 검증", () => {
  it("eyeBagCases를 ko-KR 형식으로 포맷하면 쉼표 포함 문자열이어야 한다", () => {
    const formatted = CLINIC_STATS_CANONICAL.eyeBagCases.toLocaleString("ko-KR");
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
    // 1000 이상이면 쉼표 포함
    if (CLINIC_STATS_CANONICAL.eyeBagCases >= 1000) {
      expect(formatted).toContain(",");
    }
  });

  it("yearsExperience를 문자열로 표기하면 숫자가 포함되어야 한다", () => {
    const str = `${CLINIC_STATS_CANONICAL.yearsExperience}년+`;
    expect(str).toMatch(/\d+년\+/);
  });
});
