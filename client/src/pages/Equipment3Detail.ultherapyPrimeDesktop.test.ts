import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const page = read("client/src/pages/Equipment3Detail.tsx");
const content = read("client/src/components/treatments/UltherapyPrimeDesktopContent.tsx");
const css = read("client/src/index.css");

describe("Ultherapy Prime desktop authored content", () => {
  it("mounts the replacement only for Korean Ultherapy Prime while retaining the mobile template", () => {
    expect(page).toContain('import UltherapyPrimeDesktopContent, { UltherapyPrimeDesktopHero, UltherapyPrimeProcessSeoFallback }');
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeDesktopHero />}');
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeDesktopContent youtubeUrl={item.youtubeUrl} />}');
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeProcessSeoFallback />}');
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
      'ultherapy-prime-process-step-1_68a4c1b5.webp',
      'ultherapy-prime-process-step-2_e11de918.webp',
      'ultherapy-prime-process-step-3_6fc8187f.webp',
    ].forEach((asset) => expect(content).toContain(asset));

    expect(content).toContain('부산 서면 스타피부과에서,<br />정품 울쎄라피 프라임을 경험하세요');
    expect(content).not.toContain('한눈에 보는 울쎄라피 프라임');
    expect(content).toContain('ultherapy-prime-desktop__auth-heading--tablet');
    expect(content).toContain('ultherapy-prime-desktop__auth-heading--pc');
    expect(content).toContain('정품 <span className="ultherapy-prime-desktop__auth-title-brand">울쎄라피&nbsp;프라임</span>');
    expect(content).toContain('<span className="ultherapy-prime-desktop__auth-title-line">중요한 이유</span>');
    expect(content).toContain('콜라겐이 재생되는 과정');
    expect(content).toContain('3단계 시술 프로세스');
    expect(content).toContain('같은 시술이라도 피부 상태에 따라 달라야 하기에, 피부 깊이와 상태를 확인해 개인별 맞춤 시술을 진행합니다.');
    expect(content).toContain('ultherapy-prime-desktop__process-grid--composite');
    expect(content).toContain('ultherapy-prime-desktop__process-grid--pc');
    expect(content).toContain('ultherapy-prime-desktop__process-seo-fallback');
    expect(content).toContain('STEP. 01');
    expect(content).toContain('피부 속 조직층을<br />실시간으로<br />정확히 확인<sup>41, 42</sup>');
    expect(content).toContain('alt="" aria-hidden="true" loading="lazy"');
    expect(content).toContain('통증 때문에 고민이라면?</span>');
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
    expect(content).toContain('ultherapy-prime-desktop__process-note');
    expect(content).toContain('ultherapy-prime-desktop__pain-title-line');
    expect(content).toContain('ultherapy-prime-desktop__auth-title-brand');
    expect(content).toContain('ultherapy-prime-desktop__star-certification');
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
    expect(css).toContain('.ultherapy-prime-desktop__process-note {\n  display: none;');
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
    expect(page).toContain('equipment-detail__lower-surface');
    expect(desktopRules).toContain('@media (min-width: 1024px)');
    expect(desktopRules).toContain('transform: translate(-50%, -50%);');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__trust-badges');
    expect(desktopRules).toContain('align-items: center;');
    expect(desktopRules).toContain('white-space: nowrap;');
    expect(desktopRules).toContain('.equipment-detail__faq-shell');
    expect(desktopRules).toContain('equipment-detail__back-surface');
    expect(desktopRules).toContain('background: transparent;');
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
    expect(desktopRules).toContain('padding: 3rem 0 0;');
    expect(desktopRules).toContain('.equipment-detail__positioning-faq');
    expect(page).toContain('equipment-detail__back-surface mt-8');
    expect(desktopRules).toContain('.equipment-detail__lower-surface');
    expect(desktopRules).toContain('width: 100vw;');
    expect(desktopRules).toContain('padding: 4rem max(1.5rem, calc((100vw - 1120px) / 2 + 1rem));');
    expect(desktopRules).toContain('padding: 2.5rem 0 0;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__process-note');
    expect(desktopRules).toContain('line-height: 1.7;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__process-grid--pc');
    expect(desktopRules).toContain('clip: rect(0 0 0 0);');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__process-grid--composite {\n    display: none;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__process-card {');
    expect(desktopRules).toContain('grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);');
    expect(desktopRules).toContain('aspect-ratio: 1024 / 578;');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__pain-title-line');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__auth-heading--pc');
    expect(desktopRules).toContain('.ultherapy-prime-desktop__recommend');
    expect(desktopRules).toContain('grid-template-columns: minmax(460px, 0.96fr) minmax(0, 1.04fr);');
    expect(desktopRules).toContain('border-radius: 0;');
  });

  it("keeps the expanded hero-to-badge handoff and subtle gold waves PC-only", () => {
    const desktopStart = css.indexOf('/* ── Ultherapy Prime authored desktop landing content');
    const desktopEnd = css.indexOf('/* Desktop equipment list:', desktopStart);
    const desktopRules = css.slice(desktopStart, desktopEnd);

    expect(desktopRules).toContain('.ultherapy-prime-desktop__hero::before');
    expect(desktopRules).toContain('repeating-radial-gradient');
    expect(desktopRules).toContain('color-mix(in srgb, var(--ultherapy-gold) 9%, transparent)');
    expect(desktopRules).toContain('mask-image: radial-gradient');
    expect(desktopRules).toContain('min-height: 678px;');
    expect(desktopRules).toContain('margin-top: 3.75rem;');
  });
});
