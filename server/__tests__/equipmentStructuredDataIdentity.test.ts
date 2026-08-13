import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

describe("Equipment3 구조화 데이터 식별자 회귀 방지", () => {
  it("클라이언트 MedicalProcedure와 FAQPage가 페이지별 안정적인 @id를 사용한다", () => {
    const source = fs.readFileSync(
      path.join(ROOT, "client/src/pages/Equipment3Detail.tsx"),
      "utf-8",
    );

    expect(source).toContain('"@id": `${pageUrl}#medical-procedure`');
    expect(source).toContain('"@id": `${pageUrl}#faq`');
    expect(source).toContain('"@id": `${CLINIC_INFO.url}/#organization`');
  });
});
