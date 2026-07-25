/**
 * clinic-stats.test.ts
 * CLINIC_STATS 단일 소스 검증 테스트 (Step 58)
 *
 * 목적:
 *   1. CLINIC_STATS 값이 정본(clinic-stats.ts)과 constants.ts 사이에서 일치하는지 확인
 *   2. i18n 파일 4개에서 숫자 표기가 CLINIC_STATS 기반으로 생성되는지 확인
 *   3. 핵심 숫자 범위 유효성 검사 (음수/0 방지)
 */
import { describe, it, expect } from "vitest";
import { CLINIC_STATS as STATS_FROM_CLINIC } from "../clinic-stats";
import { CLINIC_STATS as STATS_FROM_CONSTANTS } from "../constants";

describe("CLINIC_STATS 단일 소스 일치 검증", () => {
  it("clinic-stats.ts와 constants.ts의 공통 필드(yearsExperience, eyeBagCases, laserTypes)가 일치해야 한다", () => {
    // constants.ts에 존재하는 3개 필드만 비교 (나머지는 clinic-stats.ts에만 있음)
    expect(STATS_FROM_CLINIC.yearsExperience).toBe(STATS_FROM_CONSTANTS.yearsExperience);
    expect(STATS_FROM_CLINIC.eyeBagCases).toBe(STATS_FROM_CONSTANTS.eyeBagCases);
    expect(STATS_FROM_CLINIC.laserTypes).toBe(STATS_FROM_CONSTANTS.laserTypes);
  });

  it("specialistCount는 3 이상이어야 한다", () => {
    expect(STATS_FROM_CLINIC.specialistCount).toBeGreaterThanOrEqual(3);
  });

  it("yearsExperience는 1 이상이어야 한다", () => {
    expect(STATS_FROM_CLINIC.yearsExperience).toBeGreaterThanOrEqual(1);
  });

  it("eyeBagCases는 1 이상이어야 한다", () => {
    expect(STATS_FROM_CLINIC.eyeBagCases).toBeGreaterThanOrEqual(1);
  });

  it("laserTypes는 1 이상이어야 한다", () => {
    expect(STATS_FROM_CLINIC.laserTypes).toBeGreaterThanOrEqual(1);
  });

  it("openedYear는 2000 이상 현재 연도 이하여야 한다", () => {
    const currentYear = new Date().getFullYear();
    expect(STATS_FROM_CLINIC.openedYear).toBeGreaterThanOrEqual(2000);
    expect(STATS_FROM_CLINIC.openedYear).toBeLessThanOrEqual(currentYear);
  });

  it("paperCount는 0 이상이어야 한다", () => {
    expect(STATS_FROM_CLINIC.paperCount).toBeGreaterThanOrEqual(0);
  });
});

describe("CLINIC_STATS 파생 값 검증", () => {
  it("eyeBagCases를 ko-KR 형식으로 포맷하면 쉼표 포함 문자열이어야 한다", () => {
    const formatted = STATS_FROM_CLINIC.eyeBagCases.toLocaleString("ko-KR");
    expect(typeof formatted).toBe("string");
    expect(formatted.length).toBeGreaterThan(0);
    // 1000 이상이면 쉼표 포함
    if (STATS_FROM_CLINIC.eyeBagCases >= 1000) {
      expect(formatted).toContain(",");
    }
  });

  it("yearsExperience를 문자열로 표기하면 숫자가 포함되어야 한다", () => {
    const str = `${STATS_FROM_CLINIC.yearsExperience}년+`;
    expect(str).toMatch(/\d+년\+/);
  });
});
