import { describe, expect, it } from "vitest";
import { getLocalizedEquipmentFaqs, isEquipmentFaqJson, parseEquipmentFaqDrafts, parseEquipmentFaqs } from "../../shared/equipmentFaq";

describe("equipment FAQ helpers", () => {
  it("공개 FAQ에서는 완전한 질문·답변만 반환한다", () => {
    expect(parseEquipmentFaqs(JSON.stringify([
      { question: " 질문 ", answer: " 답변 " },
      { question: "미완성", answer: "" },
    ]))).toEqual([{ question: "질문", answer: "답변" }]);
  });

  it("관리자 초안에서는 비어 있는 질문·답변도 유지한다", () => {
    expect(parseEquipmentFaqDrafts(JSON.stringify([{ question: "", answer: "" }]))).toEqual([{ question: "", answer: "" }]);
  });

  it("유효하지 않은 FAQ JSON을 저장 요청에서 거부할 수 있다", () => {
    expect(isEquipmentFaqJson("[]")).toBe(true);
    expect(isEquipmentFaqJson(JSON.stringify([{ question: "질문", answer: "답변" }]))).toBe(true);
    expect(isEquipmentFaqJson(JSON.stringify([{ question: "질문", answer: "" }]))).toBe(false);
  });

  it("해당 언어 FAQ가 없으면 한국어 FAQ로 폴백한다", () => {
    const item = { faqs: JSON.stringify([{ question: "한국어 질문", answer: "한국어 답변" }]), faqsEn: "[]" };
    expect(getLocalizedEquipmentFaqs(item, "en")).toEqual([{ question: "한국어 질문", answer: "한국어 답변" }]);
  });
});
