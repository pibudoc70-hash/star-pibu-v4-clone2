import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(process.cwd());
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("TreatmentPage warm-greige theme", () => {
  it("keeps the theme page-scoped while styling canonical treatment surfaces and actions", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).toContain('className="treatment-page min-h-screen"');
    expect(source).toContain("treatment-page__hero");
    expect(source).toContain("treatment-page__faq-item");
    expect(source).toContain("treatment-page__related-card");
    expect(source).toContain("treatment-page__contact-action");
    expect(source).toContain("treatment-page__medical-notice");
    expect(source).toContain('background: "linear-gradient(135deg, #1a2a4a 0%, #2D4A7A 60%, #4A6FA5 100%)"');
  });

  it("uses the treatment-only palette with keyboard focus and reduced-motion safeguards", () => {
    const css = readSource("client/src/index.css");

    expect(css).toContain(".treatment-page {");
    expect(css).toContain("--treatment-page-bg: #F4F1EA;");
    expect(css).toContain("--treatment-page-surface: #EEEBE4;");
    expect(css).toContain("--treatment-page-accent: #7A5C35;");
    expect(css).toContain(".treatment-page__related-card:focus-visible");
    expect(css).toContain(".treatment-page__contact-action:focus-visible");
    expect(css).toContain("@media (hover: hover)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("does not reuse equipment dark-mode contracts on canonical treatment pages", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).not.toContain("equipment3_color_scheme");
    expect(source).not.toContain("equipment-detail-page--dark");
    expect(source).not.toContain("equipment-list-page--dark");
  });
});
