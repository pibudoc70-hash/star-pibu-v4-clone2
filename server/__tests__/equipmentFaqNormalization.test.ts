import { describe, expect, it } from "vitest";
import { MAX_EQUIPMENT_FAQS, parseEquipmentFaqs } from "../../shared/equipmentFaq";

describe("equipment FAQ 공개 정규화", () => {
  it("빈 문항은 제외하고 공백·대소문자만 다른 중복 질문은 한 번만 공개한다", () => {
    const parsed = parseEquipmentFaqs(JSON.stringify([
      { question: "  시술 후 관리  ", answer: "  자외선 차단이 필요합니다.  " },
      { question: "시술   후 관리", answer: "다른 답변" },
      { question: "SECOND QUESTION", answer: "Answer" },
      { question: "second question", answer: "Duplicate answer" },
      { question: "", answer: "답변만 있음" },
    ]));

    expect(parsed).toEqual([
      { question: "시술 후 관리", answer: "자외선 차단이 필요합니다." },
      { question: "SECOND QUESTION", answer: "Answer" },
    ]);
  });

  it("언어별 FAQ 최대 개수 상수를 20개로 유지한다", () => {
    expect(MAX_EQUIPMENT_FAQS).toBe(20);
  });
});
