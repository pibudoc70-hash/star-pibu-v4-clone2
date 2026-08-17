import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/pages/Equipment3.tsx"),
  "utf8",
);

describe("Equipment3 loading status", () => {
  it("provides a polite, locale-aware loading status instead of a spinner alone", () => {
    expect(source).toContain('role="status"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain('"시술·장비 정보를 불러오는 중입니다."');
    expect(source).toContain('"Loading treatments and equipment."');
  });
});
