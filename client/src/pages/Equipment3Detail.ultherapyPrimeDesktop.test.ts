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
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeDesktopContent youtubeUrl={item.youtubeUrl} />}');
    expect(page).toContain('equipment-detail__hero--ultherapy-mobile');
    expect(page).toContain('ultherapy-prime-desktop-mobile-only');
    expect(page).toContain('<div className="ultherapy-prime-desktop-mobile-only"><UltherapyPrincipleSection /></div>');
  });

  it("keeps FAQ and clinic-information rendering after the replacement content", () => {
    const desktopInsert = page.indexOf('<UltherapyPrimeDesktopContent');
    const faq = page.indexOf('{managedFaqs.length > 0 && (');
    const quote = page.indexOf('<section className="equipment-detail__info-shell');

    expect(desktopInsert).toBeGreaterThan(-1);
    expect(faq).toBeGreaterThan(desktopInsert);
    expect(quote).toBeGreaterThan(faq);
  });

  it("uses each requested supplied-media group in the authored desktop structure", () => {
    [
      'ultherapy-prime-device_374d4239.png',
      'ultherapy-prime-authenticity_060bcbbe.png',
      'ultherapy-prime-specialist_15575405.png',
      'ultherapy-prime-handpiece-dsc-605_dd7aa28b.webp',
      '1_530b8674.png',
      'ultherapy-prime-depths_5f0a9424.png',
      'ultherapy-prime-procedure-depths-3_16754c9f.png',
      'ultherapy-prime-collagen-stage-1_14727d05.webp',
      'ultherapy-prime-see_c3d3df83.webp',
      'ultherapy-prime-qa-thumbnail_5bd4e1e1.webp',
      'ultherapy-prime-treatment-areas_ea4ea3ca.png',
    ].forEach((asset) => expect(content).toContain(asset));

    expect(content).toContain('부산 서면 스타피부과에서,<br />정품 울쎄라피 프라임을 경험하세요');
    expect(content).not.toContain('한눈에 보는 울쎄라피 프라임');
    expect(content).toContain('왜 꼭 ‘정품 울쎄라피 프라임’이어야 할까요?');
    expect(content).toContain('콜라겐이 재생되는 과정');
    expect(content).toContain('3단계 시술 프로세스');
    expect(content).toContain('울쎄라피 프라임,<br />통증 때문에 고민이라면?');
    expect(content).toContain('울쎄라피 프라임과 함께하면 좋은 시술');
    expect(content).toContain('울쎄라피 프라임,<br />이런 분께 추천합니다');
    expect(content).toContain('당신의 소중한 젊음,<br />스타피부과가 돌려드립니다');
  });

  it("uses the requested PC-only hierarchy, media pairings, and compact certification bar", () => {
    expect(content).toContain('ultherapy-prime-desktop__wordmark');
    expect(content).toContain('Ultherapy<sup>®</sup>');
    expect(content).toContain('울쎄라피 프라임은<br />어떤 시술인가요?');
    expect(content).toContain('울쎄라피 프라임은 서로 다른 종류의 트랜스듀서로 피부층별 깊이');
    expect(content).toContain('ultherapy-prime-desktop__authentic-equipment');
    expect(content).toContain('ultherapy-prime-desktop__authentic-depth');
    expect(content).toContain('ASSET.handpiece');
    expect(content).not.toContain('ASSET.transducerPhoto');
    expect(content).toContain('내 피부 속의 노화된 콜라겐은 점차적으로 재생되고, 건강한 콜라겐이 더 생겨나면서');
    expect(content).not.toContain('재생되고,<br />건강한 콜라겐');
    expect(content).toContain('ultherapy-prime-desktop__pain-options');
    expect(content).toContain('마취크림');
    expect(content).toContain('국소마취주사');
    expect(content).toContain('수면마취');
    expect(content).toContain('ultherapy-prime-desktop__star-certification');
    expect(content).toContain('title={<>울쎄라피 프라임,<br />통증 때문에 고민이라면?</>}');
    expect(content).toContain('title={<>울쎄라피 프라임,<br />이런 분께 추천합니다</>}');
    expect(content).toContain('title={<>당신의 소중한 젊음,<br />스타피부과가 돌려드립니다</>}');
    expect(content).toContain('대한민국 의사의<br />단 2% 피부과전문의');
    expect(content).toContain('대학병원 교수출신 의료진,<br />20년 이상의 수많은 시술 경험');
    expect(content).toContain('ultherapy-prime-desktop__trust-badge--authentic');
    expect(content).toContain('ultherapy-prime-desktop__principle-diagram--tablet');
    expect(content).toContain('ultherapy-prime-desktop__principle-diagram--pc');
    expect(content).toContain('ultherapy-prime-desktop__what-heading--tablet');
    expect(content).toContain('ultherapy-prime-desktop__what-heading--pc');
    expect(content).toContain('ultherapy-prime-desktop__authentic-equipment--pc-hidden');
    expect(content).not.toContain('ultherapy-prime-desktop__hero-certificates');
    expect(content).not.toContain('ultherapy-prime-desktop__summary');
    expect(content).not.toContain('ultherapy-prime-deepsee-monitor_4757defd.png');

    const treatmentPrinciple = content.indexOf('ultherapy-prime-desktop__what');
    const authenticity = content.indexOf('ultherapy-prime-desktop__authentic');
    expect(treatmentPrinciple).toBeGreaterThan(-1);
    expect(authenticity).toBeGreaterThan(treatmentPrinciple);
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

    expect(desktopRules).toContain('var(--home-section-bg-a)');
    expect(desktopRules).toContain('--ultherapy-deep: #3B2B21');
    expect(desktopRules).toContain('padding-inline: 1.5rem');
    expect(desktopRules).not.toContain('#111C2E');
    expect(desktopRules).not.toContain('#162033');
  });

  it("uses the established section alternation and desktop-only alignment refinements", () => {
    const desktopStart = css.indexOf('/* ── Ultherapy Prime authored desktop landing content');
    const desktopEnd = css.indexOf('/* Desktop equipment list:', desktopStart);
    const desktopRules = css.slice(desktopStart, desktopEnd);

    expect(desktopRules).toContain('var(--home-section-bg-a)');
    expect(desktopRules).toContain('var(--home-section-bg-b)');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__principle-grid');
    expect(desktopRules).toContain('align-items: start;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__principle-diagram');
    expect(desktopRules).toContain('background: transparent;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__star-certification { width: 100%;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__collagen-grid li { text-align: center;');
  });

  it("keeps the requested visual corrections in a PC-only 1024px override", () => {
    const desktopStart = css.indexOf('/* ── Ultherapy Prime authored desktop landing content');
    const desktopEnd = css.indexOf('/* Desktop equipment list:', desktopStart);
    const desktopRules = css.slice(desktopStart, desktopEnd);

    expect(page).toContain('equipment-detail__faq-shell');
    expect(page).toContain('equipment-detail__faq-inner');
    expect(page).toContain('equipment-detail__info-shell');
    expect(desktopRules).toContain('@media (min-width: 1024px)');
    expect(desktopRules).toContain('transform: translate(-50%, -50%);');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__trust-badges');
    expect(desktopRules).toContain('align-items: center;');
    expect(desktopRules).toContain('white-space: nowrap;');
    expect(desktopRules).toContain('.equipment-detail__faq-shell');
    expect(desktopRules).toContain('box-shadow: 0 0 0 100vmax var(--home-section-bg-b);');
  });

  it("restores the three trust badges and keeps follow-up surfaces PC-only", () => {
    const desktopStart = css.indexOf('/* ── Ultherapy Prime authored desktop landing content');
    const desktopEnd = css.indexOf('/* Desktop equipment list:', desktopStart);
    const desktopRules = css.slice(desktopStart, desktopEnd);

    expect(desktopRules).toContain('grid-template-columns: repeat(3, minmax(0, 1fr));');
    expect(desktopRules).not.toContain('.ultherapy-prime-desktop__trust-badge--authentic {\n    display: none;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__what-heading--pc');
    expect(desktopRules).toContain('margin-bottom: 1.5rem;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__authentic-equipment--pc-hidden');
    expect(desktopRules).toContain('.equipment-detail__info-shell');
    expect(desktopRules).toContain('box-shadow: 0 0 0 100vmax var(--home-section-bg-a);');
  });
});
