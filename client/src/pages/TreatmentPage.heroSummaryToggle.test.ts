import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(process.cwd());
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("TreatmentPage mobile hero summary toggle", () => {
  it("uses overflow measurement rather than summary length to decide whether the control is needed", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).toContain('window.matchMedia("(max-width: 639px)")');
    expect(source).toContain("summary.scrollHeight > collapsedHeight + 1");
    expect(source).toContain("setIsHeroSummaryExpandable(isOverflowing)");
    expect(source).not.toContain("treatmentDesc.length >");
  });

  it("preserves the full summary text and connects a localized native button to it", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).toContain("id={heroSummaryId}");
    expect(source).toContain("{treatmentDesc}");
    expect(source).toContain('aria-controls={heroSummaryId}');
    expect(source).toContain('aria-expanded={isHeroSummaryExpanded}');
    expect(source).toContain("heroSummaryExpand");
    expect(source).toContain("heroSummaryCollapse");
  });

  it("scopes the collapsed presentation and reduced-motion behavior to mobile hero summaries", () => {
    const css = readSource("client/src/index.css");

    expect(css).toContain('.treatment-page__hero-summary[data-collapsed="true"]');
    expect(css).toContain(".treatment-page__hero-summary-toggle");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
