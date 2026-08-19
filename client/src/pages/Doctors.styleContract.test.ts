import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorsPage = readFileSync(resolve(process.cwd(), "client/src/pages/Doctors.tsx"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Doctors direct-page header style contract", () => {
  it("정적 header style을 page-scoped class로 위임한다", () => {
    expect(doctorsPage).toContain('className="dr-page-header py-12 sm:py-16 text-center"');
    expect(doctorsPage).toContain('className="dr-page-header-eyebrow font-montserrat text-xs tracking-[0.3em] uppercase mb-3"');
    expect(doctorsPage).toContain('className="dr-page-header-title text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"');
    expect(doctorsPage).toContain('className="dr-page-header-tagline text-sm sm:text-base"');
    expect(doctorsPage).not.toContain('style={{ background: "linear-gradient(135deg, #faf8f3 0%, #f5efe0 100%)" }}');
  });

  it("기존 색상과 background를 !important 없이 동일한 CSS class로 보존한다", () => {
    expect(globalCss).toContain('background: linear-gradient(135deg, #faf8f3 0%, #f5efe0 100%);');
    expect(globalCss).toContain('color: #b89a5a;');
    expect(globalCss).toContain('color: #1a1a1a;');
    expect(globalCss).toContain('color: #6b5c3e;');
    expect(globalCss).not.toMatch(/\.dr-page-header[\s\S]*!important/);
  });
});
