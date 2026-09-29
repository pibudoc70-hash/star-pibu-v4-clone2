import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3.tsx"), "utf8");
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const liftingGuideSource = readFileSync(resolve(process.cwd(), "client/src/components/treatments/LiftingGuide.tsx"), "utf8");
const stemCellGuideSource = readFileSync(resolve(process.cwd(), "client/src/components/treatments/StemCellGuide.tsx"), "utf8");

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

  it("renders the shared mobile guide after cards and keeps the desktop guide after the card panel", () => {
    const mobileGuideIndex = pageSource.indexOf('className="equipment-list__category-guide equipment-list__category-guide--mobile sm:hidden');
    const cardPanelIndex = pageSource.indexOf('className="equipment-list__card-panel');
    const desktopGuideIndex = pageSource.indexOf('className="equipment-list__category-guide hidden sm:block');

    expect(mobileGuideIndex).toBeGreaterThan(-1);
    expect(mobileGuideIndex).toBeGreaterThan(cardPanelIndex);
    expect(desktopGuideIndex).toBeGreaterThan(cardPanelIndex);
  });

  it("keeps every mobile guide preview source intact behind one accessible text toggle", () => {
    expect(pageSource).toContain('const [mobileGuideExpanded, setMobileGuideExpanded] = useState(false);');
    expect(pageSource).toContain('setMobileGuideExpanded(false);');
    expect(pageSource).toContain('className="equipment-list__category-guide-toggle');
    expect(pageSource).toContain('aria-expanded={mobileGuideExpanded}');
    expect(cssSource).toContain('.equipment-list__category-guide--mobile:not([data-expanded="true"])');
    expect(cssSource).toContain('-webkit-line-clamp: 3;');
    expect(cssSource).toContain('#root .equipment-list-page .equipment-list__category-guide--mobile');
    expect(cssSource).toContain('padding-block: 0 !important;');
  });

  it("removes only desktop guide hero outlines and retains feature-card styling", () => {
    const desktopCleanupStart = cssSource.indexOf("/* Desktop equipment list: retain individual tabs/cards");
    const desktopCleanup = cssSource.slice(
      desktopCleanupStart,
      cssSource.indexOf("/* `/doctors` direct-page header", desktopCleanupStart),
    );

    expect(desktopCleanup).toContain(".equipment-list__category-guide section:first-child > .rounded-2xl");
    expect(desktopCleanup).toContain("border: none !important");
    expect(desktopCleanup).toContain("0 2px 16px rgba(0, 0, 0, 0.05)");
    expect(liftingGuideSource).toContain('style={{ background: f.bg, border: `1.5px solid ${f.color}22` }}');
    expect(stemCellGuideSource).toContain('className="stemcell-guide space-y-10 mb-10"');
    expect(stemCellGuideSource).toContain('className="stemcell-guide__intro"');
    expect(stemCellGuideSource).toContain('className="stemcell-guide__intro-card rounded-2xl p-5"');
    expect(desktopCleanup).toContain(".equipment-list__category-guide > div,");
    expect(desktopCleanup).toContain(".equipment-list__category-guide .stemcell-guide,");
    expect(desktopCleanup).toContain(".equipment-list__category-guide .stemcell-guide__intro-card {");
    expect(desktopCleanup).toContain("outline: none !important;");
    expect(desktopCleanup).toContain("box-shadow: none !important;");
  });
});
