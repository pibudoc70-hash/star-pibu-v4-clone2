import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const animationStyles = readFileSync("client/src/styles/scroll-animations.css", "utf8");
const globalStyles = readFileSync("client/src/index.css", "utf8");

describe("scroll animation style module", () => {
  it("keeps the global stylesheet import and all public animation selectors", () => {
    expect(globalStyles).toContain('@import "./styles/scroll-animations.css";');
    expect(animationStyles).toContain(".scroll-fade-in");
    expect(animationStyles).toContain(".scroll-stagger");
    expect(animationStyles).toContain(".scroll-fade-in-slow");
  });

  it("preserves reduced-motion and mobile timing fallbacks", () => {
    expect(animationStyles).toContain("prefers-reduced-motion: reduce");
    expect(animationStyles).toContain("max-width: 768px");
    expect(animationStyles).toContain("transition: none");
  });
});
