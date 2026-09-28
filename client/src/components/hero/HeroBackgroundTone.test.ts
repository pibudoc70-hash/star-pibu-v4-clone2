import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("shared hero background tone", () => {
  it("keeps blur, tone-down, and overscan values in one shared variable set", () => {
    expect(css).toContain("--hero-background-blur: 3.5px;");
    expect(css).toContain("--hero-background-brightness: 0.66;");
    expect(css).toContain("--hero-background-saturation: 0.85;");
    expect(css).toContain("--hero-background-sepia: 0.24;");
    expect(css).toContain("--hero-background-scale: 1.05;");
    expect(css).toContain("--hero-overlay-gradient:");
  });

  it("applies the treatment only to the common background image layer", () => {
    const imageRule = css.slice(css.indexOf(".hero-bg-img {"), css.indexOf("/* 모바일 hero 이미지"));
    expect(imageRule).toContain("filter: blur(var(--hero-background-blur)) brightness(var(--hero-background-brightness)) saturate(var(--hero-background-saturation)) sepia(var(--hero-background-sepia));");
    expect(imageRule).toContain("transform: scale(var(--hero-background-scale));");
    expect(imageRule).toContain("transform-origin: center;");
  });
});
