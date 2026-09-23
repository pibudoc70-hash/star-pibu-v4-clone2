import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const doctorsSource = read("client/src/pages/Doctors.tsx");
const directionsSource = read("client/src/pages/Directions.tsx");
const koI18nSource = read("client/src/lib/i18n.ko.ts");
const headerStateSource = read("client/src/hooks/useHeaderState.ts");
const managementSource = read("client/src/pages/ManagementDeviceFaq.tsx");
const noticeSource = read("client/src/pages/Notice.tsx");

describe("requested page interface cleanup", () => {
  it("uses the established navy palette for the Doctors direct-consultation CTA", () => {
    expect(doctorsSource).toContain('background: "linear-gradient(135deg, #1A2744 0%, #2D4A7B 100%)"');
    expect(doctorsSource).toContain("text-white/80");
    expect(doctorsSource).toContain("border-white/80");
    expect(doctorsSource).toContain("hover:border-[#F6E4B0]");
  });

  it("uses the Korean Directions title and intro while hiding only the repeated contact header", () => {
    expect(directionsSource).toContain("{t.directions.title}");
    expect(directionsSource).toContain("<ContactSection showHeader={false} />");
    expect(koI18nSource).toContain('subtitle: "스타피부과 쉽게 찾아보세요."');
  });

  it("removes Facilities from More while retaining the management-device FAQ menu item", () => {
    expect(headerStateSource).not.toContain('label: t.nav.facility');
    expect(headerStateSource).toContain('label: t.nav.managementDeviceFaq');
    expect(headerStateSource).toContain('href: "/management-device-faq"');
  });

  it("renames only the management-device page heading", () => {
    expect(managementSource).toContain('getText("관리장비 소개", "Management Devices"');
    expect(managementSource).toContain("<h1");
    expect(managementSource).toContain("{pageTitle}</h1>");
    expect(managementSource).not.toContain("{t.nav.managementDeviceFaq}</h1>");
  });

  it("removes the visible notice subtitle while retaining it for metadata", () => {
    expect(noticeSource).toContain("description={pageSubtitle}");
    expect(noticeSource).not.toContain('<p className="text-white/60 text-sm">{pageSubtitle}</p>');
  });
});
