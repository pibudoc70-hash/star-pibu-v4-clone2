import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Equipment3.tsx"),
  "utf8",
);
const cssSource = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8",
);

describe("Equipment3 visual control cleanup", () => {
  it("keeps the warm-greige listing surface without a theme-switching control", () => {
    expect(pageSource).toContain('className="equipment-list-page min-h-screen"');
    expect(pageSource).not.toContain("equipment3_color_scheme");
    expect(pageSource).not.toContain("getEquipmentListColorScheme");
    expect(pageSource).not.toContain("equipment-list-page--dark");
    expect(pageSource).not.toContain("equipment-list__appearance-control");
    expect(pageSource).not.toContain("equipment-list__appearance-toggle");
  });

  it("retains the existing light palette and card interaction rules", () => {
    expect(cssSource).toContain("--equipment-list-page-bg: #F4F1EA");
    expect(cssSource).toContain("--equipment-list-surface: #EEEBE4");
    expect(cssSource).toContain("--equipment-list-text: #202938");
    expect(cssSource).toContain(".equipment-list__card:focus-visible");
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
