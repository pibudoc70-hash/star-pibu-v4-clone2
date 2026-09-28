import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("homepage management-device surface separation", () => {
  it("places Management Devices on shared surface A between treatment and philosophy surface B", () => {
    const treatmentIndex = home.indexOf('home-section-surface home-section-surface--b', home.indexOf('/* 4. Treatments + Equipment'));
    const managementIndex = home.indexOf('home-section-surface home-section-surface--a', home.indexOf('/* 5. Management Devices'));
    const philosophyIndex = home.indexOf('home-section-surface home-section-surface--b', home.indexOf('/* 6. Philosophy'));

    expect(treatmentIndex).toBeGreaterThan(-1);
    expect(managementIndex).toBeGreaterThan(treatmentIndex);
    expect(philosophyIndex).toBeGreaterThan(managementIndex);
    expect(css).toContain("--home-section-bg-a: #FAF8F5;");
    expect(css).toContain("--home-section-bg-b: #F3EEE7;");
  });

  it("uses one quiet divider for shared homepage surface handoffs", () => {
    expect(css).toContain("--home-section-divider:");
    expect(css).toContain(".home-page .home-section-surface:not(.lifting-positioning-summary),");
    expect(css).toContain("border-top: 1px solid var(--home-section-divider);");
  });
});
