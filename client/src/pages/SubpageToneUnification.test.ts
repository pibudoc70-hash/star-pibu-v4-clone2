import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

const aboutSource = read("client/src/pages/About.tsx");
const equipmentSource = read("client/src/pages/Equipment3.tsx");
const doctorsSource = read("client/src/pages/Doctors.tsx");
const directionsSource = read("client/src/pages/Directions.tsx");
const eventSource = read("client/src/pages/Event.tsx");
const noticeSource = read("client/src/pages/Notice.tsx");
const managementSource = read("client/src/pages/ManagementDeviceFaq.tsx");
const foreignGuideSource = read("client/src/pages/ForeignGuide.tsx");
const foreignPriceListSource = read("client/src/pages/ForeignPriceList.tsx");
const researchSource = read("client/src/pages/Research.tsx");
const cssSource = read("client/src/index.css");
const koI18n = read("client/src/lib/i18n.ko.ts");
const enI18n = read("client/src/lib/i18n.en.ts");
const jaI18n = read("client/src/lib/i18n.ja.ts");
const zhI18n = read("client/src/lib/i18n.zh.ts");
const zhTwI18n = read("client/src/lib/i18n.zh-TW.ts");

describe("desktop-first public subpage tone unification", () => {
  it("uses the shared warm title band for each top-navigation subpage", () => {
    for (const source of [equipmentSource, directionsSource, eventSource, noticeSource, managementSource, researchSource, foreignPriceListSource]) {
      expect(source).toContain("dr-page-header");
    }
    expect(foreignGuideSource).toContain("#FAF8F3");
    expect(foreignGuideSource).not.toContain("#1a3a5c");
    expect(researchSource).not.toContain("#1a1a2e");
  });

  it("keeps Equipment3 inside its existing page container while aligning the search shell", () => {
    expect(equipmentSource).toContain('className="equipment-list__search-shell mb-4"');
    expect(cssSource).toContain(".equipment-list__search-shell");
    expect(cssSource).toContain("--equipment-list-page-bg: #FAF8F5");
    expect(cssSource).toContain("--equipment-list-button: #A8895E");
  });

  it("removes the direct-consultation callout while retaining the responsive Doctors layouts", () => {
    expect(doctorsSource).not.toContain("전문의 직접 상담");
    expect(doctorsSource).toContain('className="hidden lg:block space-y-10"');
    expect(doctorsSource).toContain('className="grid grid-cols-[420px_minmax(0,1fr)]');
    expect(doctorsSource).toContain("dr-mobile-tabbar");
  });

  it("renames the management-device navigation without changing its route", () => {
    expect(koI18n).toContain('managementDeviceFaq: "관리장비 소개"');
    expect(enI18n).toContain('managementDeviceFaq: "Management Devices"');
    expect(jaI18n).toContain('managementDeviceFaq: "管理機器紹介"');
    expect(zhI18n).toContain('managementDeviceFaq: "管理设备介绍"');
    expect(zhTwI18n).toContain('managementDeviceFaq: "管理設備介紹"');
    expect(managementSource).toContain('md:hidden">MANAGEMENT DEVICES</p>');
    expect(managementSource).toContain('hidden font-montserrat text-xs tracking-[0.3em] uppercase md:block">STAR DERMATOLOGY</p>');
  });

  it("adds the desktop About title and editorial composition while retaining a mobile-only legacy layout", () => {
    expect(aboutSource).toContain('className="hidden md:block bg-[var(--brand-bg)] text-[var(--brand-text)]"');
    expect(aboutSource).toContain('id="about-page-title"');
    expect(aboutSource).toContain("const VALUE_ICONS = [HeartHandshake, Sparkles, ShieldCheck, CalendarDays]");
    expect(aboutSource).toContain('href="/doctors"');
    expect(aboutSource).toContain('className="md:hidden py-16 md:py-24 bg-white"');
  });
});
