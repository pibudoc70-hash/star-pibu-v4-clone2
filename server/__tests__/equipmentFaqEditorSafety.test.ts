import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../../client/src/components/admin/EquipmentFaqEditor.tsx"),
  "utf-8",
);

describe("Equipment FAQ editor 안전장치", () => {
  it("작성 중·중복 문항 상태를 관리자에게 알린다", () => {
    expect(source).toContain('role="status"');
    expect(source).toContain("동일한 질문이 이미 있습니다");
    expect(source).toContain("질문과 답변을 모두 입력해야 공개됩니다");
  });

  it("FAQ 추가는 공통 최대 개수 제한을 따른다", () => {
    expect(source).toContain("MAX_EQUIPMENT_FAQS");
    expect(source).toContain("disabled={editFaqs.length >= MAX_EQUIPMENT_FAQS}");
  });
});
