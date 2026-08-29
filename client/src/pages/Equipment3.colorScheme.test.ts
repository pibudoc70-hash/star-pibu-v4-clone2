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

describe("Equipment3 colour-scheme control", () => {
  it("uses a page-scoped, persisted light/dark preference with an accessible toggle", () => {
    expect(pageSource).toContain('EQUIPMENT_LIST_COLOR_SCHEME_KEY = "equipment3_color_scheme"');
    expect(pageSource).toContain("getEquipmentListColorScheme");
    expect(pageSource).toContain("window.localStorage.setItem(EQUIPMENT_LIST_COLOR_SCHEME_KEY, next)");
    expect(pageSource).toContain("equipment-list-page--dark");
    expect(pageSource).toContain('type="button"');
    expect(pageSource).toContain("aria-pressed={isDarkMode}");
    expect(pageSource).toContain("aria-label={colorSchemeAction}");
  });

  it("defines the dark palette, contrast-focused text, focus, and motion-safe rules inside the listing scope", () => {
    expect(cssSource).toContain(".equipment-list-page--dark");
    expect(cssSource).toContain("--equipment-list-page-bg: #121A2D");
    expect(cssSource).toContain("--equipment-list-surface: #1C2943");
    expect(cssSource).toContain("--equipment-list-text: #F6F1E8");
    expect(cssSource).toContain("--equipment-list-accent: #D7B56D");
    expect(cssSource).toContain("--equipment-list-focus: #FFD54A");
    expect(cssSource).toContain('.equipment-list-page--dark header[role="banner"]');
    expect(cssSource).toContain("rgba(18, 26, 45, 0.97) !important");
    expect(cssSource).toContain(".equipment-list__appearance-toggle:focus-visible");
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
