import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const liftingGuideSource = readFileSync(resolve(process.cwd(), "client/src/components/treatments/LiftingGuide.tsx"), "utf8");

describe("Equipment3 category guide placement", () => {
  it("centralizes every category guide in one active-tab selection path", () => {
    expect(pageSource).toContain("const renderActiveCategoryGuide = () => {");

    [
      'activeId === "리프팅·탄력"',
      'activeId === "눈밑지방재배치"',
      'activeId === "여드름"',
      'activeId === "흉터·모공"',
      'activeId === "색소·문신"',
      'activeId === "볼륨·부스터"',
      'activeId === "보톡스·필러"',
      'activeId === "홍조·혈관"',
      'activeId === "건선·아토피"',
      'activeId === "손·발톱무좀"',
      'activeId === "액취증·다한증"',
      'activeId === "stem_cell" || activeId === "줄기세포 치료"',
    ].forEach((condition) => expect(pageSource).toContain(condition));
  });

  it("keeps the existing mobile guide-before-cards flow and renders desktop guides after the card panel", () => {
    const mobileGuideIndex = pageSource.indexOf('className="equipment-list__category-guide sm:hidden');
    const cardPanelIndex = pageSource.indexOf('className="equipment-list__card-panel');
    const desktopGuideIndex = pageSource.indexOf('className="equipment-list__category-guide hidden sm:block');

    expect(mobileGuideIndex).toBeGreaterThan(-1);
    expect(cardPanelIndex).toBeGreaterThan(mobileGuideIndex);
    expect(desktopGuideIndex).toBeGreaterThan(cardPanelIndex);
  });

  it("removes only desktop guide hero outlines and retains feature-card styling", () => {
    const desktopCleanupStart = cssSource.indexOf("/* Desktop equipment list: retain individual tabs/cards");
    const desktopCleanup = cssSource.slice(
      desktopCleanupStart,
      cssSource.indexOf("/* `/doctors` direct-page header", desktopCleanupStart),
    );

    expect(desktopCleanup).toContain(".equipment-list__category-guide > div > section:first-child > .rounded-2xl");
    expect(desktopCleanup).toContain("border: none !important");
    expect(desktopCleanup).toContain("0 2px 16px rgba(0, 0, 0, 0.05)");
    expect(liftingGuideSource).toContain('style={{ background: f.bg, border: `1.5px solid ${f.color}22` }}');
  });
});
