import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const about = read("client/src/pages/About.tsx");
const styles = read("client/src/index.css");
const mobileBranch = about.slice(about.indexOf("{/* Mobile: mirrors the shared public-subpage title rhythm"));
const mobileCss = styles.slice(styles.indexOf("/* Shared public-subpage mobile header rhythm"));

describe("About mobile editorial layout", () => {
  it("uses the common public-subpage header rather than a page-specific title rhythm", () => {
    expect(mobileBranch).toContain('className="dr-page-header about-mobile-header text-center"');
    expect(mobileBranch).toContain("STAR DERMATOLOGY");
    expect(mobileBranch).toContain("t.about.title");
    expect(mobileBranch).toContain("t.about.philosophyTagline");
    expect(mobileCss).toContain(".dr-page-header:not(#contact)");
    expect(mobileCss).not.toContain(".about-mobile-header {");
  });

  it("places the consultation image before the mobile body copy and keeps its original source", () => {
    const imageIndex = mobileBranch.indexOf('className="about-mobile-image relative overflow-hidden rounded-[var(--card-radius)]"');
    const bodyIndex = mobileBranch.indexOf('className="about-mobile-body mt-7"');
    expect(imageIndex).toBeGreaterThan(-1);
    expect(bodyIndex).toBeGreaterThan(imageIndex);
    expect(mobileBranch).toContain('src="/api/storage/patient-consultation-mobile_e2474e05_fb420943_2114c946.webp"');
  });

  it("keeps values as a shared border-led editorial list and confines its layout to mobile CSS", () => {
    expect(mobileBranch).toContain('className="subpage-mobile-editorial-list about-mobile-values mt-8"');
    expect(mobileBranch).toContain('className="subpage-mobile-editorial-row about-mobile-value"');
    expect(mobileCss).toContain(".subpage-mobile-editorial-list");
    expect(mobileCss).toContain(".about-mobile-body p");
    expect(mobileCss).toContain("word-break: keep-all;");
    expect(mobileCss).toContain("line-height: 1.75;");
  });

  it("keeps each mobile statistic number and unit as one baseline-aligned value", () => {
    expect(mobileBranch).toContain("splitStatisticValue(stat.num)");
    expect(mobileBranch).toContain('className="about-mobile-stat__value stat-inline-value"');
    expect(mobileBranch).toContain('className="about-mobile-stat__number"');
    expect(mobileBranch).toContain('className="about-mobile-stat__unit stat-inline-value__unit"');
    expect(mobileCss).toContain(".stat-inline-value,");
    expect(mobileCss).toContain("align-items: baseline !important;");
    expect(mobileCss).toContain("white-space: nowrap !important;");
    expect(mobileCss).toContain("#home .hero-mobile-layout .hero-stat-value");
    expect(mobileCss).toContain("#home .hero-mobile-layout .hero-stat-unit");
    expect(mobileCss).toContain(".about-mobile-stat__unit {");
    expect(mobileCss).toContain("font-weight: 400;");
  });
});
