import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const viteConfig = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");

describe("Pretendard web subset policy", () => {
  it("uses a Latin subset plus the audited primary and deferred Korean fallback CSS", () => {
    expect(css).toContain('font-family: "Pretendard Web"');
    expect(css).toContain('/manus-storage/PretendardVariable-latin-subset_b24be58a.woff2');
    expect(viteConfig).toContain('auditedPretendardSegmentsPlugin');
    expect(viteConfig).toContain('/manus-storage/PretendardVariable-korean-primary_693508b2.woff2');
    expect(viteConfig).toContain('/manus-storage/PretendardVariable-korean-secondary_441758ac.woff2');
    expect(css).toContain('unicode-range: U+0000-2BFF, U+3000-303F;');
    expect((css.match(/font-display: swap;/g) ?? []).length).toBeGreaterThanOrEqual(1);
    expect(css).not.toContain('PretendardVariable-korean-segment_87dfcb73.woff2');
  });

  it("does not keep the original multi-megabyte Pretendard URL in active CSS", () => {
    expect(css).not.toContain("PretendardVariable_1ede78f7.woff2");
    expect(css).not.toContain("Pretendard Variable");
  });

  it("keeps Noto Sans KR after the web subset as the sparse-glyph fallback", () => {
    expect(css).toContain("'Pretendard Web', 'Noto Sans KR', sans-serif");
  });
});
