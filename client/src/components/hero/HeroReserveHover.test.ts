import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/hero/HeroActions.tsx"),
  "utf8",
);
const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("desktop Hero reserve CTA hover", () => {
  it("keeps the existing external reservation link while adding desktop-only visual hover feedback", () => {
    expect(source).toContain("href={reserveUrl}");
    expect(source).toContain('target="_blank"');
    expect(css).toContain("@media (hover: hover) and (pointer: fine)");
    expect(css).toContain(".hero-btn-reserve:hover");
    expect(css).toContain("transition: background-color 240ms cubic-bezier(0.16, 1, 0.3, 1)");
    expect(css).toContain("background: #08d764;");
  });
});
