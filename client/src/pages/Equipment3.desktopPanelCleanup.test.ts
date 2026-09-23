import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Equipment3 desktop outer panel cleanup", () => {
  it("keeps the category and card wrapper hooks scoped to the equipment list", () => {
    expect(pageSource).toContain("equipment-list__tab-panel");
    expect(pageSource).toContain("equipment-list__card-panel");
    expect(pageSource).toContain("equipment-list__card-grid");
    expect(pageSource).toContain("equipment-list__card treatment-card");
  });

  it("removes only the desktop wrapper treatments and preserves mobile panel styling", () => {
    const cleanupStart = cssSource.indexOf("/* Desktop equipment list: retain individual tabs/cards");
    const desktopCleanup = cssSource.slice(
      cleanupStart,
      cssSource.indexOf("/* ── Equipment detail mobile density", cleanupStart),
    );

    expect(cleanupStart).toBeGreaterThan(-1);
    expect(desktopCleanup).toContain("@media (min-width: 768px)");
    expect(desktopCleanup).toContain(".equipment-list__tab-panel");
    expect(desktopCleanup).toContain(".equipment-list__card-panel");
    expect(desktopCleanup).toContain(".equipment-list__card-grid");
    expect(desktopCleanup).toContain("background: transparent !important");
    expect(desktopCleanup).toContain("border-color: transparent !important");
    expect(desktopCleanup).toContain("box-shadow: none !important");
    expect(desktopCleanup).toContain(".equipment-list-page .equipment-list__card");
    expect(desktopCleanup).toContain("border: none !important");
    expect(cssSource).toContain("@media (max-width: 639px)");
    expect(cssSource).toContain(".equipment-list__card-grid {\n    padding: 0.75rem;");
  });

  it("keeps the transparent desktop search and filter override inside the desktop-only cleanup boundary", () => {
    const cleanupStart = cssSource.indexOf("/* Desktop equipment list: retain individual tabs/cards");
    const desktopCleanup = cssSource.slice(
      cleanupStart,
      cssSource.indexOf("/* ── Equipment detail mobile density", cleanupStart),
    );

    expect(cleanupStart).toBeGreaterThan(-1);
    expect(desktopCleanup).toContain(".equipment-list__search-shell");
    expect(desktopCleanup).toContain(".equipment-list__tab-panel");
    expect(desktopCleanup).toContain(".equipment-list__search");
    expect(desktopCleanup).toContain("background: transparent !important");
    expect(desktopCleanup).toContain("border-color: transparent !important");
    expect(desktopCleanup).toContain("box-shadow: none !important");
    expect(pageSource).toContain("className=\"flex-1 py-3.5 pr-4 bg-transparent");
  });

  it("uses borderless desktop equipment cards and softened category tab outlines", () => {
    const cleanupStart = cssSource.indexOf("/* Desktop equipment list: retain individual tabs/cards");
    const desktopCleanup = cssSource.slice(
      cleanupStart,
      cssSource.indexOf("/* ── Equipment detail mobile density", cleanupStart),
    );

    expect(desktopCleanup).toContain(".equipment-list-page .equipment-list__card");
    expect(desktopCleanup).toContain("border: none !important");
    expect(desktopCleanup).toContain("0 2px 16px rgba(0, 0, 0, 0.05)");
    expect(desktopCleanup).toContain(".equipment-list-page .equipment-list__card:hover");
    expect(desktopCleanup).toContain("border-color: transparent !important");
    expect(desktopCleanup).toContain(".equipment-list-page .equipment-list__tab-panel .cat-tab-btn");
    expect(desktopCleanup).toContain("border-color: #E9E1D8");
    expect(desktopCleanup).toContain("box-shadow: 0 1px 3px rgba(47, 38, 27, 0.04)");
    expect(desktopCleanup).toContain(".equipment-list-page .equipment-list__tab-panel .cat-tab-btn[data-active=\"true\"]");
    expect(desktopCleanup).toContain("border-color: transparent;");
    expect(desktopCleanup).toContain("box-shadow: none;");
  });
});
