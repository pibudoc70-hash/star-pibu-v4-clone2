import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const page = read("client/src/pages/Equipment3Detail.tsx");
const content = read("client/src/components/treatments/UltherapyPrimeDesktopContent.tsx");
const css = read("client/src/index.css");

describe("Ultherapy Prime desktop authored content", () => {
  it("mounts the replacement only for Korean Ultherapy Prime while retaining the mobile template", () => {
    expect(page).toContain('import UltherapyPrimeDesktopContent, { UltherapyPrimeDesktopHero }');
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeDesktopHero />}');
    expect(page).toContain('{ultherapySummary && <UltherapyPrimeDesktopContent summary={ultherapySummary} youtubeUrl={item.youtubeUrl} />}');
    expect(page).toContain('equipment-detail__hero--ultherapy-mobile');
    expect(page).toContain('ultherapy-prime-desktop-mobile-only');
    expect(page).toContain('<div className="ultherapy-prime-desktop-mobile-only"><UltherapyPrincipleSection /></div>');
  });

  it("keeps FAQ and clinic-information rendering after the replacement content", () => {
    const desktopInsert = page.indexOf('<UltherapyPrimeDesktopContent');
    const faq = page.indexOf('{managedFaqs.length > 0 && (');
    const quote = page.indexOf('<aside className="equipment-detail__info-card');

    expect(desktopInsert).toBeGreaterThan(-1);
    expect(faq).toBeGreaterThan(desktopInsert);
    expect(quote).toBeGreaterThan(faq);
  });

  it("uses each requested supplied-media group in the authored desktop structure", () => {
    [
      'ultherapy-prime-device_374d4239.png',
      'ultherapy-prime-authenticity_060bcbbe.png',
      'ultherapy-prime-transducer-photo_69ea0165.webp',
      'ultherapy-prime-depths_5f0a9424.png',
      'ultherapy-prime-collagen-stage-1_14727d05.webp',
      'ultherapy-prime-see_c3d3df83.webp',
      'ultherapy-prime-qa-thumbnail_5bd4e1e1.webp',
      'ultherapy-prime-treatment-areas_ea4ea3ca.png',
      'ultherapy-prime-deepsee-monitor_4757defd.png',
    ].forEach((asset) => expect(content).toContain(asset));

    expect(content).toContain('한 번의 시술로 최대 1년,');
    expect(content).toContain('한눈에 보는 울쎄라피 프라임');
    expect(content).toContain('왜 꼭 ‘정품 울쎄라피 프라임’이어야 할까요?');
    expect(content).toContain('콜라겐이 재생되는 과정');
    expect(content).toContain('3단계 시술 프로세스');
    expect(content).toContain('울쎄라피 프라임, 통증 때문에 고민이라면?');
    expect(content).toContain('울쎄라피 프라임과 함께하면 좋은 시술');
    expect(content).toContain('울쎄라피 프라임, 이런 분께 추천합니다');
    expect(content).toContain('당신의 소중한 젊음, 스타피부과가 돌려드립니다');
  });

  it("uses a text wordmark and balances the summary's long overview before its six facts", () => {
    expect(content).toContain('ultherapy-prime-desktop__wordmark');
    expect(content).toContain('Ultherapy<sup>®</sup>');
    expect(content).toContain('ultherapy-prime-desktop__summary-overview');
  });

  it("keeps authored layout rules desktop-scoped and leaves the generic mobile rules intact", () => {
    const desktopStart = css.indexOf('/* ── Ultherapy Prime authored desktop landing content');
    const desktopEnd = css.indexOf('/* Desktop equipment list:', desktopStart);
    const desktopRules = css.slice(desktopStart, desktopEnd);

    expect(desktopStart).toBeGreaterThan(-1);
    expect(desktopRules).toContain('@media (min-width: 768px)');
    expect(desktopRules).toContain('.ultherapy-prime-desktop {\n    display: block;');
    expect(desktopRules).toContain('.equipment-detail__hero--ultherapy-mobile');
    expect(desktopRules).toContain('.ultherapy-prime-desktop-mobile-only');
    expect(desktopRules).not.toContain('@media (max-width: 767px)');
  });

  it("keeps the authored desktop surfaces within the warm brand palette", () => {
    const desktopStart = css.indexOf('/* ── Ultherapy Prime authored desktop landing content');
    const desktopEnd = css.indexOf('/* Desktop equipment list:', desktopStart);
    const desktopRules = css.slice(desktopStart, desktopEnd);

    expect(desktopRules).toContain('linear-gradient(118deg, #FBF8F2');
    expect(desktopRules).toContain('--ultherapy-deep: #3B2B21');
    expect(desktopRules).not.toContain('#111C2E');
    expect(desktopRules).not.toContain('#162033');
  });
});
