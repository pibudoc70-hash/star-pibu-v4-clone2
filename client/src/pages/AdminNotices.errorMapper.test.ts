import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminNotices.tsx"), "utf8");

describe("AdminNotices error mapper", () => {
  it("uses the shared safe mapper for automatic translation errors without rendering err.message", () => {
    expect(source).toContain('getAdminErrorDetails(err, "notices.translate")');
    expect(source).not.toMatch(/번역 실패:\s*\$\{err\.message\}/);
    expect(source).toContain("오류 코드:");
  });
});
