import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("homepage management-device surface separation", () => {
  it("uses one variable-driven off-white surface and quiet gold divider at every viewport", () => {
    expect(home).toContain("home-surface-b section-bg-dark-brown");
    expect(css).toContain("--home-management-section-bg: #FBF9F5;");
    expect(css).toContain("--home-management-section-divider: rgba(168, 137, 94, 0.26);");
    expect(css).toContain("@media (min-width: 768px)");
    expect(css).toContain("@media (max-width: 767px)");
    expect(css).toContain(".home-page .home-surface-b.section-bg-dark-brown");
    expect(css).toContain("#main-content.home-main .home-surface-b.section-bg-dark-brown");
    expect(css).toContain("background: var(--home-management-section-bg) !important;");
    expect(css).toContain("border-top: 1px solid var(--home-management-section-divider) !important;");
  });

  it("does not change the Treatments & Equipment surface token", () => {
    expect(css).toContain(".home-surface-a > section {\n    background: #FAF8F5 !important;");
    expect(css).not.toContain("#treatments {\n      background: var(--home-management-section-bg)");
  });
});
