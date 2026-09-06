import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const treatmentsSection = readFileSync(
  resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"),
  "utf8",
);

describe("mobile contrast theme", () => {
  it("keeps the approved A contrast refinement within the mobile breakpoint", () => {
    expect(css).toContain("@media (max-width: 767px) {");
    expect(css).toContain("--brand-bg: #FAF8F5;");
    expect(css).toContain("--brand-bg-alt: #F5F0EB;");
    expect(css).toContain("--brand-bg-card: #FFFDF9;");
    expect(css).toContain("--card: #FFFDF9;");
    expect(css).toContain("--brand-text-mid: #4F4B47;");
    expect(css).toContain("--brand-text-muted: #625B54;");
    expect(css).toContain("--color-star-text-mid: #4F4B47;");
    expect(css).toContain(".cat-tab-btn[data-active=\"true\"],");
    expect(css).toContain("color: var(--color-star-text);");
  });

  it("uses the mobile-aware card surface for expanded category details", () => {
    expect(treatmentsSection).toContain("treatment-mobile-category-detail overflow-hidden rounded-xl bg-[var(--card)]");
  });
});
