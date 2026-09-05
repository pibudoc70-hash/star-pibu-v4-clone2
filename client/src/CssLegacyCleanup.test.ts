import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "../..");
const indexCss = readFileSync(resolve(projectRoot, "client/src/index.css"), "utf8");
const homeSource = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
const scrollAnimationCss = readFileSync(resolve(projectRoot, "client/src/styles/scroll-animations.css"), "utf8");

describe("CSS Coverage legacy cleanup", () => {
  it("removes unused review, legacy filter, discontinued popup, and skeleton selector families", () => {
    for (const selector of [
      ".review-card",
      ".review-dot",
      ".review-slide-item",
      ".review-quote-icon",
      ".card--review",
      ".treatment-filter-btn",
      ".treatment-filter-overlay",
      ".treatment-filter-dropdown",
      ".event-skeleton-",
      ".popup-tab-content",
      ".lightbox-overlay",
      ".floating-cta",
      ".header-scrolled",
      ".before-after-container",
      ".brand-card",
      ".facility-img-label",
      ".philosophy-stat-num",
      ".philosophy-dark-interlude",
      ".section-fade-in",
      ".animate-fade-in-up",
      ".content-appear",
      ".img-zoom",
      ".ds-img-zoom",
      ".card-glow",
    ]) {
      if (indexCss.includes(selector)) {
        throw new Error(`legacy selector must stay removed: ${selector}`);
      }
    }
  });

  it("retains the live scroll reveal path rather than removing it based on a partial coverage sample", () => {
    expect(indexCss).toContain('@import "./styles/scroll-animations.css"');
    expect(scrollAnimationCss).toContain(".scroll-fade-in");
    expect(homeSource).toContain("ScrollAnimationWrapper");
    expect(indexCss).toContain(".reveal.visible");
  });
});
