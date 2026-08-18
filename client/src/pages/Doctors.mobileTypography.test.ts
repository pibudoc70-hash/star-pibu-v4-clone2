import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Doctors direct-page mobile typography", () => {
  it("uses a mobile-readable introduction scale, line height, and paragraph rhythm", () => {
    expect(globalCss).toMatch(/\.dr-intro-mobile\s*\{[\s\S]*?font-size:\s*clamp\(0\.95rem, 3\.9vw, 1rem\)/);
    expect(globalCss).toMatch(/\.dr-intro-mobile\s*\{[\s\S]*?line-height:\s*1\.75/);
    expect(globalCss).toMatch(/\.dr-intro-mobile \.dr-intro-para:not\(:last-child\)\s*\{[\s\S]*?margin-bottom:\s*0\.75em/);
  });
});
