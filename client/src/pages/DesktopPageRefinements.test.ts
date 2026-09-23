import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

const aboutSource = read("client/src/pages/About.tsx");
const equipmentSource = read("client/src/pages/Equipment3.tsx");
const managementSource = read("client/src/pages/ManagementDeviceFaq.tsx");
const directionsSource = read("client/src/pages/Directions.tsx");
const contactSource = read("client/src/components/ContactSection.tsx");
const cssSource = read("client/src/index.css");

describe("2026-09-23 desktop page refinements", () => {
  it("keeps About mobile markup intact while using one desktop composition", () => {
    const mobileBranch = aboutSource.slice(aboutSource.indexOf("{/* Mobile is intentionally retained unchanged. */}"));

    expect(aboutSource).toContain('lang === "ko" ? "스타피부과 소개"');
    expect(aboutSource).toContain("보이는 아름다움 그 너머, 피부의 본질까지 생각합니다.");
    expect(aboutSource).toContain("t.about.title}</p>");
    expect(aboutSource).toContain("t.about.philosophyTagline}</p>");
    expect(aboutSource).toContain("스타피부과가 지키는 네 가지 약속");
    expect(aboutSource).not.toContain('className="bg-[var(--brand-bg-alt)] py-20 lg:py-24"');
    expect(aboutSource).toContain('className="md:hidden py-16 md:py-24 bg-white"');
    expect(mobileBranch).toContain('<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{t.about.title}</h1>');
  });

  it("keeps Equipment3 search width while aligning only the desktop card grid", () => {
    expect(equipmentSource).toContain("피부 고민에 맞춘 프리미엄 장비 시스템");
    expect(equipmentSource).toContain('className="equipment-list__search-shell mb-4"');
    expect(equipmentSource).toContain('className="equipment-list__card-grid px-5 pt-5 pb-5 rounded-b-2xl"');

    const desktopBlock = cssSource.slice(cssSource.indexOf("@media (min-width: 768px)"), cssSource.indexOf("/* `/doctors` direct-page header"));
    expect(desktopBlock).toContain(".equipment-list__card-grid {");
    expect(desktopBlock).toContain("padding-inline: 0;");
    expect(cssSource).toContain(".equipment-list__card-grid {\n    padding: 0.75rem;");
  });

  it("uses the peer subpage label and subtitle only on the management desktop header", () => {
    expect(managementSource).toContain('md:hidden">MANAGEMENT DEVICES</p>');
    expect(managementSource).toContain('hidden font-montserrat text-xs tracking-[0.3em] uppercase md:block">STAR DERMATOLOGY</p>');
    expect(managementSource).toContain("다양한 장비, 더 세밀한 맞춤 케어");
    expect(managementSource).toContain('dr-page-header-tagline mt-3 hidden text-base md:block');
  });

  it("uses the Doctors surface and a reduced desktop boundary on Directions only", () => {
    expect(directionsSource).toContain('<ContactSection showHeader={false} desktopTone="doctors" />');
    expect(directionsSource).toContain('directions-transport-section py-16 md:py-16');
    expect(contactSource).toContain('desktopTone?: "default" | "doctors"');
    expect(contactSource).toContain('contact-section--doctors');

    const desktopPalette = cssSource.slice(cssSource.indexOf("/* Desktop public-subpage palette"), cssSource.indexOf("/* ── Equipment detail mobile density"));
    expect(desktopPalette).toContain("#contact.contact-section--doctors");
    expect(desktopPalette).toContain("--contact-section-bg: #FAF8F5;");
    expect(desktopPalette).toContain("padding-bottom: 4rem;");
    expect(desktopPalette).toContain(".directions-transport-section {\n    background: #FAF8F5;");
  });
});
