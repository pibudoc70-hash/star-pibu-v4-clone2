import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const contactSource = read("./ContactSection.tsx");
const panelSource = read("./contact/ContactInfoPanel.tsx");
const cssSource = read("../index.css");
const appSource = read("../App.tsx");
const homeSource = read("../pages/Home.tsx");
const landingSources = [
  read("../pages/LandingEN.tsx"),
  read("../pages/LandingJA.tsx"),
  read("../pages/LandingZH.tsx"),
  read("../pages/LandingZHTW.tsx"),
];

describe("Contact section layout and notice visibility", () => {
  it("uses one responsive desktop surface for the map and information panel", () => {
    expect(contactSource).toContain("pt-12 pb-16 sm:pt-16 sm:pb-24");
    expect(contactSource).toContain("lg:grid-cols-12");
    expect(contactSource).toContain("overflow-hidden rounded-2xl");
    expect(contactSource).toContain('backgroundColor: "var(--brand-bg-warm)"');
    expect(contactSource).toContain("lg:col-span-7");
    expect(panelSource).toContain("lg:col-span-5");
    expect(panelSource).toContain("integrated?: boolean");
    expect(panelSource).toContain("borderBottom: dividerColor");
    expect(panelSource).toContain("bg-[var(--brand-bg-card)]");
    expect(contactSource).toContain("lg:items-stretch");
    expect(cssSource).toMatch(/#contact\s*\{\s*padding-top:\s*3rem\s*!important;/);
  });

  it("can suppress only the reusable location heading for a dedicated location page", () => {
    expect(contactSource).toContain("showHeader?: boolean");
    expect(contactSource).toContain("ContactSection({ showHeader = true }");
    expect(contactSource).toContain("{showHeader && (");
  });

  it("keeps notices off every home landing while retaining dedicated notice routes", () => {
    expect(homeSource).not.toContain("RecentNoticesSection");
    expect(homeSource).not.toContain("useNewNoticeToast");
    landingSources.forEach((source) => expect(source).not.toContain("RecentNoticesSection"));
    expect(appSource).toContain('path="/notice"');
    expect(appSource).toContain('path={`/${prefix}/notice`}');
  });
});
