import { describe, expect, it } from "vitest";
import { thermage } from "./thermage";
import { ulthera } from "./ulthera";

describe("Ultherapy and Thermage Korean FAQ safety coverage", () => {
  it("adds twelve Ultherapy FAQs that explain planning without promising individualized outcomes", () => {
    expect(ulthera.faq.ko).toHaveLength(12);
    expect(ulthera.faq.ko.map((item) => item.question)).toEqual(expect.arrayContaining([
      "울쎄라피 프라임은 어떤 원리로 설명하나요?",
      "울쎄라피 프라임의 실시간 시각화 기능은 무엇을 뜻하나요?",
      "울쎄라피 프라임 시술 중 통증은 효과가 있다는 신호인가요?",
      "울쎄라피 프라임의 1.5·3.0·4.5mm는 무엇을 뜻하나요?",
      "울쎄라피 프라임 시술 뒤 회복 일정은 어떻게 계획하나요?",
    ]));
    expect(ulthera.faq.ko.map((item) => item.answer).join(" ")).toContain("개인 상태");
  });

  it("adds twelve Thermage FAQs that distinguish planning, expected reactions, and contact criteria", () => {
    expect(thermage.faq.ko).toHaveLength(12);
    expect(thermage.faq.ko.map((item) => item.question)).toEqual(expect.arrayContaining([
      "써마지 FLX는 어떤 원리로 설명하나요?",
      "써마지 FLX 시술 중에는 어떤 감각을 느낄 수 있나요?",
      "써마지 FLX의 팁과 펄스 수는 무엇을 뜻하나요?",
      "써마지 FLX 에너지 레벨이 높을수록 효과가 더 좋은가요?",
      "써마지 FLX 시술 뒤 언제 의료기관에 연락해야 하나요?",
    ]));
    expect(thermage.faq.ko.map((item) => item.answer).join(" ")).toContain("개인 상태");
  });
});
