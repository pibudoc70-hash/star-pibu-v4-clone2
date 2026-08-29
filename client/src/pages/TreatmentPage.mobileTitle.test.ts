import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(process.cwd());
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("TreatmentPage mobile multilingual title wrapping", () => {
  it("retains the complete canonical H1 while providing explicit mobile wrapping hooks", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).toContain('className="treatment-page__hero-title text-3xl md:text-4xl font-bold mb-3">{treatmentH1}</h1>');
    expect(source).toContain("treatment-page__hero-eyebrow");
    expect(source).toContain("treatment-page__hero-summary");
    expect(source).toContain("treatment-page__hero-badge");
  });

  it("does not truncate related-treatment names that are part of each button's accessible text", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");
    const relatedTitleLine = source.split("\n").find((line) => line.includes("treatment-page__related-title"));

    expect(relatedTitleLine).toBeDefined();
    expect(relatedTitleLine).not.toContain("line-clamp");
    expect(relatedTitleLine).not.toContain("truncate");
  });

  it("uses the 390px mobile breakpoint with balanced, emergency-safe wrapping rather than ellipsis", () => {
    const css = readSource("client/src/index.css");

    expect(css).toContain(".treatment-page__hero-title");
    expect(css).toContain(".treatment-page__related-title");
    expect(css).toContain("text-wrap: balance;");
    expect(css).toContain("overflow-wrap: anywhere;");
    expect(css).toContain("@media (max-width: 639px)");
  });
});
