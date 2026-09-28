import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorsSource = readFileSync(resolve(process.cwd(), "client/src/components/DoctorsSection.tsx"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("DoctorsSection upper spacing", () => {
  it("uses the shared mobile 48-pixel rhythm while preserving desktop spacing", () => {
    expect(doctorsSource).toContain('id="doctors"');
    expect(doctorsSource).toContain('className="py-16 sm:py-24 dr-section-bg scroll-mt-24 md:scroll-mt-28"');
    expect(globalCss).toContain("--home-mobile-section-padding-top: 3rem;");
    expect(globalCss).toContain("--home-mobile-section-padding-bottom: 3rem;");
    expect(globalCss).toContain("#doctors,");
    expect(globalCss).toContain("padding-top: var(--home-mobile-section-padding-top) !important;");
    expect(globalCss).toContain("@media (min-width: 768px) {\n  #doctors {\n    padding-top: 3rem !important;");
    expect(globalCss).not.toContain("#doctors {\n  padding-bottom:");
  });
});
