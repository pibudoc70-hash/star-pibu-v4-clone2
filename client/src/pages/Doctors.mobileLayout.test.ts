import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorsPage = readFileSync(resolve(process.cwd(), "client/src/pages/Doctors.tsx"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Doctors direct-page mobile layout", () => {
  it("keeps stacked doctor images out of document flow with a stable mobile viewport", () => {
    expect(doctorsPage).toContain('className="relative dr-mobile-photo-wrap"');
    expect(globalCss).toContain(".dr-mobile-photo-wrap");
    expect(globalCss).toMatch(/\.dr-mobile-photo-wrap\s*\{[\s\S]*?height:\s*clamp\(/);
    expect(globalCss).toMatch(/\.dr-mobile-photo-img\s*\{[\s\S]*?position:\s*absolute/);
    expect(globalCss).toMatch(/\.dr-mobile-photo-img\s*\{[\s\S]*?inset:\s*0/);
  });
});
