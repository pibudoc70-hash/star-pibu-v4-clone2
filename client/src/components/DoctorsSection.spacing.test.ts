import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const doctorsSource = readFileSync(resolve(process.cwd(), "client/src/components/DoctorsSection.tsx"), "utf8");
const globalCss = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("DoctorsSection upper spacing", () => {
  it("limits only the medical team section's top padding to half of its former responsive values", () => {
    expect(doctorsSource).toContain('id="doctors"');
    expect(doctorsSource).toContain('className="py-16 sm:py-24 dr-section-bg scroll-mt-24 md:scroll-mt-28"');
    expect(globalCss).toContain("section#doctors {\n      padding-top: 2.5rem !important;");
    expect(globalCss).toContain("@media (min-width: 640px) {\n  #doctors {\n    padding-top: 3rem !important;");
    expect(globalCss).not.toContain("#doctors {\n  padding-bottom:");
  });
});
