/**
 * TreatmentsEquipmentSection 다국어 번역 완성도 회귀 방지 테스트
 *
 * 목적: 사용자에게 보이는 모든 텍스트 필드(detail/effect/sessions)에
 *       JA/ZH 번역이 누락되지 않도록 보장합니다.
 *
 * 이 테스트가 실패하면: 새로 추가된 Treatment/Equipment 항목에
 * 번역 필드가 누락된 것입니다. 해당 항목에 detailJa/detailZh,
 * effectJa/effectZh, sessionsJa/sessionsZh를 추가해야 합니다.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(
  __dirname,
  "./TreatmentsEquipmentSection.tsx"
);
const source = readFileSync(filePath, "utf-8");

/**
 * 소스 코드에서 특정 패턴의 개수를 반환합니다.
 */
function countPattern(pattern: RegExp): number {
  return (source.match(pattern) ?? []).length;
}

describe("TreatmentsEquipmentSection 다국어 번역 완성도", () => {
  describe("detail 필드 번역 완성도", () => {
    it("detailJa 개수가 detail 개수와 일치해야 한다", () => {
      const detailCount = countPattern(/\bdetail: "/g);
      const detailJaCount = countPattern(/\bdetailJa: "/g);
      expect(detailJaCount).toBe(detailCount);
    });

    it("detailZh 개수가 detail 개수와 일치해야 한다", () => {
      const detailCount = countPattern(/\bdetail: "/g);
      const detailZhCount = countPattern(/\bdetailZh: "/g);
      expect(detailZhCount).toBe(detailCount);
    });

    it("detailEn 개수가 detail 개수와 일치해야 한다", () => {
      const detailCount = countPattern(/\bdetail: "/g);
      const detailEnCount = countPattern(/\bdetailEn: "/g);
      expect(detailEnCount).toBe(detailCount);
    });
  });

  describe("effect 필드 번역 완성도", () => {
    it("effectJa 개수가 effect 개수와 일치해야 한다", () => {
      const effectCount = countPattern(/\beffect: "/g);
      const effectJaCount = countPattern(/\beffectJa: "/g);
      expect(effectJaCount).toBe(effectCount);
    });

    it("effectZh 개수가 effect 개수와 일치해야 한다", () => {
      const effectCount = countPattern(/\beffect: "/g);
      const effectZhCount = countPattern(/\beffectZh: "/g);
      expect(effectZhCount).toBe(effectCount);
    });

    it("effectEn 개수가 effect 개수와 일치해야 한다", () => {
      const effectCount = countPattern(/\beffect: "/g);
      const effectEnCount = countPattern(/\beffectEn: "/g);
      expect(effectEnCount).toBe(effectCount);
    });
  });

  describe("sessions 필드 번역 완성도", () => {
    it("sessionsJa 개수가 sessions 개수와 일치해야 한다", () => {
      const sessionsCount = countPattern(/\bsessions: "/g);
      const sessionsJaCount = countPattern(/\bsessionsJa: "/g);
      expect(sessionsJaCount).toBe(sessionsCount);
    });

    it("sessionsZh 개수가 sessions 개수와 일치해야 한다", () => {
      const sessionsCount = countPattern(/\bsessions: "/g);
      const sessionsZhCount = countPattern(/\bsessionsZh: "/g);
      expect(sessionsZhCount).toBe(sessionsCount);
    });

    it("sessionsEn 개수가 sessions 개수와 일치해야 한다", () => {
      const sessionsCount = countPattern(/\bsessions: "/g);
      const sessionsEnCount = countPattern(/\bsessionsEn: "/g);
      expect(sessionsEnCount).toBe(sessionsCount);
    });
  });

  describe("번역 필드 값 품질 검사", () => {
    it("detailJa 값이 비어있지 않아야 한다", () => {
      const emptyJa = (source.match(/\bdetailJa: ""/g) ?? []).length;
      expect(emptyJa).toBe(0);
    });

    it("detailZh 값이 비어있지 않아야 한다", () => {
      const emptyZh = (source.match(/\bdetailZh: ""/g) ?? []).length;
      expect(emptyZh).toBe(0);
    });

    it("effectJa 값이 비어있지 않아야 한다", () => {
      const emptyJa = (source.match(/\beffectJa: ""/g) ?? []).length;
      expect(emptyJa).toBe(0);
    });

    it("sessionsJa 값이 비어있지 않아야 한다", () => {
      const emptyJa = (source.match(/\bsessionsJa: ""/g) ?? []).length;
      expect(emptyJa).toBe(0);
    });
  });

  describe("고아 번역 필드 검사 (번역 필드가 원본 필드보다 많으면 안 됨)", () => {
    it("detailJa 개수가 detail 개수를 초과하지 않아야 한다", () => {
      const detailCount = countPattern(/\bdetail: "/g);
      const detailJaCount = countPattern(/\bdetailJa: "/g);
      expect(detailJaCount).toBeLessThanOrEqual(detailCount);
    });

    it("effectJa 개수가 effect 개수를 초과하지 않아야 한다", () => {
      const effectCount = countPattern(/\beffect: "/g);
      const effectJaCount = countPattern(/\beffectJa: "/g);
      expect(effectJaCount).toBeLessThanOrEqual(effectCount);
    });

    it("sessionsJa 개수가 sessions 개수를 초과하지 않아야 한다", () => {
      const sessionsCount = countPattern(/\bsessions: "/g);
      const sessionsJaCount = countPattern(/\bsessionsJa: "/g);
      expect(sessionsJaCount).toBeLessThanOrEqual(sessionsCount);
    });
  });
});
