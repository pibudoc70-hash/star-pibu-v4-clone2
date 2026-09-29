import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "client", "src");
const panelSource = readFileSync(resolve(root, "components/contact/ContactInfoPanel.tsx"), "utf8");
const css = readFileSync(resolve(root, "index.css"), "utf8");

describe("mobile contact information label hierarchy", () => {
  it("marks only the four primary contact icons and labels for mobile treatment", () => {
    expect(panelSource.match(/contact-info-item__icon/g)).toHaveLength(4);
    expect(panelSource.match(/contact-info-item__label/g)).toHaveLength(4);
    expect(panelSource).toContain('<Car size={20}');
    expect(panelSource).toContain('<MapPin size={14}');
  });

  it("hides only primary item icons and emphasizes labels below the mobile breakpoint", () => {
    const start = css.indexOf("/* Mobile contact hierarchy:");
    const end = css.indexOf("@media (max-width: 767px) {\n  .youtube-channel-cta-button", start);
    const rules = css.slice(start, end);

    expect(rules).toContain("@media (max-width: 767px)");
    expect(rules).toContain("#contact [data-testid=\"contact-info-panel\"] .contact-info-item__icon");
    expect(rules).toContain("display: none;");
    expect(rules).toContain(".contact-info-item__content-row");
    expect(rules).toContain("gap: 0;");
    expect(rules).toContain(".contact-info-item__label");
    expect(rules).toContain("margin-bottom: 7px !important;");
    expect(rules).toContain("font-size: 1rem;");
    expect(rules).toContain("font-weight: 700;");
  });
});
