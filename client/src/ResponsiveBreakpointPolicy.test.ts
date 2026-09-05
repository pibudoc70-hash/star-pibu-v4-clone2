import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = join(process.cwd(), "client", "src");
const css = readFileSync(join(sourceRoot, "index.css"), "utf8");
const painGuide = readFileSync(join(sourceRoot, "components", "PainManagementGuide.tsx"), "utf8");

describe("responsive breakpoint policy", () => {
  it("uses Tailwind md as the global mobile-to-desktop CSS boundary without a 640/641 gap", () => {
    expect(css).not.toContain("@media (max-width: 640px)");
    expect(css).not.toContain("@media (min-width: 641px)");
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain("@media (min-width: 768px)");
  });

  it("preserves narrow-phone refinements separately from the mobile-to-desktop layout boundary", () => {
    expect(css).toContain("@media (max-width: 360px)");
    expect(css).toContain("@media (max-width: 639px)");
  });

  it("keeps Pain Management’s alternate mobile and desktop markup aligned to Tailwind md", () => {
    expect(painGuide).toContain('className="md:hidden"');
    expect(painGuide).toContain('className="hidden md:block"');
  });
});
