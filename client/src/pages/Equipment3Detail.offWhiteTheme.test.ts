import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const detailSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3Detail.tsx"), "utf8");
const positioningSource = readFileSync(resolve(process.cwd(), "client/src/components/LiftingPositioning.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Equipment3Detail off-white pilot theme", () => {
  it("scopes off-white FAQ and information-card surfaces to equipment details", () => {
    expect(detailSource).toContain("equipment-detail__faq-item");
    expect(detailSource).toContain("equipment-detail__info-card");
    expect(cssSource).toContain(".equipment-detail__faq-item");
    expect(cssSource).toContain("background: #F7F5F0;");
    expect(cssSource).toContain(".equipment-detail__info-card");
  });

  it("provides navy and gold hover feedback while retaining visible focus and reduced-motion support", () => {
    expect(detailSource).toContain("equipment-detail__contact-action");
    expect(detailSource).toContain("equipment-detail__back-button");
    expect(cssSource).toContain(".equipment-detail__contact-action:hover");
    expect(cssSource).toContain(".equipment-detail__back-button:hover");
    expect(cssSource).toContain("background: #7A5C35;");
    expect(cssSource).toContain(".equipment-detail__contact-action:focus-visible");
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("retains the existing off-white surface while providing a page-scoped dark detail palette", () => {
    expect(detailSource).toContain("equipment-detail-page--dark");
    expect(detailSource).toContain("equipment3_color_scheme");
    expect(detailSource).toContain("equipment-detail__appearance-toggle");
    expect(cssSource).toContain(".equipment-detail-page--dark");
    expect(cssSource).toContain("--equipment-detail-page-bg: #121A2D");
    expect(cssSource).toContain("--equipment-detail-surface: #1C2943");
    expect(cssSource).toContain("--equipment-detail-accent: #D7B56D");
    expect(cssSource).toContain("--equipment-detail-focus: #FFD54A");
    expect(cssSource).toContain(".equipment-detail__appearance-toggle:focus-visible");
  });

  it("keeps the detail fallback FAQ inside the same dark-mode surface and localizes the toggle", () => {
    expect(positioningSource).toContain("equipment-detail__positioning-faq");
    expect(cssSource).toContain(".equipment-detail-page--dark .equipment-detail__positioning-faq");
    expect(detailSource).toContain('lightMode: getText("라이트 모드"');
    expect(detailSource).toContain('darkMode:  getText("다크 모드"');
    expect(detailSource).toContain('"淺色模式"');
    expect(detailSource).toContain('"切換至深色模式"');
  });
});
