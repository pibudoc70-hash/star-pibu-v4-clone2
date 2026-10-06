import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const page = read("client/src/pages/Equipment3Detail.tsx");
const content = read("client/src/components/treatments/UltherapyPrimeDesktopContent.tsx");
const copy = read("client/src/components/treatments/ultherapyPrimeContent.ts");
const css = read("client/src/index.css");

describe("Ultherapy Prime localized authored content", () => {
  it("mounts the authored experience for the Ultherapy Prime slug in every language", () => {
    expect(page).toContain('import UltherapyPrimeDesktopContent, { UltherapyPrimeDesktopHero }');
    expect(page).toContain('const isUltherapyPrime = isUltherapyPrimeSlug(item.slug);');
    expect(page).not.toContain('const isUltherapyPrime = lang === "ko"');
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeDesktopHero lang={lang} />}');
    expect(page).toContain('{isUltherapyPrime && <UltherapyPrimeDesktopContent lang={lang} youtubeUrl={item.youtubeUrl} />}');
    expect(page).not.toContain('UltherapyPrimeProcessSeoFallback');
    expect(page).not.toContain('<UltherapyPrincipleSection />');
  });

  it("keeps FAQ and clinic-information rendering after the authored content", () => {
    const authoredInsert = page.indexOf('<UltherapyPrimeDesktopContent');
    const faq = page.indexOf('{managedFaqs.length > 0 && (');
    const quote = page.indexOf('<section className="equipment-detail__info-shell');

    expect(authoredInsert).toBeGreaterThan(-1);
    expect(faq).toBeGreaterThan(authoredInsert);
    expect(quote).toBeGreaterThan(faq);
  });

  it("contains complete Korean, English, Japanese, Simplified Chinese, and Traditional Chinese authored copy", () => {
    ["ko:", "en:", "ja:", "zh:", '"zh-TW":'].forEach((locale) => expect(copy).toContain(locale));
    [
      "What is Ultherapy Prime?",
      "Ultherapy Primeとはどのような施術ですか？",
      "Ultherapy Prime 是什么治疗？",
      "Ultherapy Prime 是什麼療程？",
      "Discover Ultherapy Prime Through Video",
      "動画で見るUltherapy Prime",
      "通过视频了解 Ultherapy Prime",
      "透過影片認識 Ultherapy Prime",
      'combinationBadges: ["BEST", "POPULAR", "", "", ""]',
      'combinationBadges: ["BEST", "人気", "", "", ""]',
      'combinationBadges: ["BEST", "热门", "", "", ""]',
      'combinationBadges: ["BEST", "熱門", "", "", ""]',
    ].forEach((translation) => expect(copy).toContain(translation));
    expect(copy).toContain('export const ULTHERAPY_PRIME_COPY: Record<Lang, UltherapyPrimeCopy>');
  });

  it("renders every authored section from the selected locale data instead of hard-coding Korean text", () => {
    expect(content).toContain('const copy = ULTHERAPY_PRIME_COPY[lang];');
    [
      'copy.heroTitle',
      'copy.whatParagraphs[0]',
      'copy.authParagraphs[0]',
      'copy.collagenStages.map',
      'copy.processDescriptions[index]',
      'copy.painOptions.map',
      'copy.combinationTitles.map',
      'copy.combinationBadges[index]',
      'copy.recommendations.map',
      'copy.strengths.map',
      'copy.certificationText',
    ].forEach((fragment) => expect(content).toContain(fragment));
    expect(content).toContain('data-lang={lang}');
  });

  it("keeps all requested supplied media and semantic sections", () => {
    [
      'ultherapy-prime-device_374d4239.png',
      'ultherapy-prime-authenticity_060bcbbe.png',
      'ultherapy-prime-specialist_15575405.png',
      'ultherapy-prime-handpiece-dsc-605_dd7aa28b.webp',
      '1_530b8674.png',
      'ultherapy-prime-depths_5f0a9424.png',
      'ultherapy-prime-procedure-depths-2026-10-06_eaa6eeae.png',
      'ultherapy-prime-collagen-stage-1_14727d05.webp',
      'ultherapy-prime-process-step-1_68a4c1b5.webp',
      'ultherapy-prime-qa-thumbnail_5bd4e1e1.webp',
      'ultherapy-prime-treatment-areas_ea4ea3ca.png',
    ].forEach((asset) => expect(content).toContain(asset));
    [
      'ultherapy-prime-desktop__what',
      'ultherapy-prime-desktop__authentic',
      'ultherapy-prime-desktop__collagen',
      'ultherapy-prime-desktop__process',
      'ultherapy-prime-desktop__pain',
      'ultherapy-prime-desktop__combination',
      'ultherapy-prime-desktop__recommend',
      'ultherapy-prime-desktop__star',
    ].forEach((section) => expect(content).toContain(section));
  });

  it("keeps four click-to-load Shorts while localizing their accessible controls", () => {
    expect(content).toContain('const [activeShortId, setActiveShortId] = useState<string | null>(null);');
    expect(content).toContain('aria-label={shortsAriaLabel}');
    expect(content).toContain('aria-label={`${playVideoLabel}: ${short.title}`}');
    expect(content).toContain('allow="autoplay; encrypted-media; picture-in-picture"');
    expect(content).toContain('allowFullScreen');
    expect(content).toContain('loading="lazy"');
    expect(content).toContain('https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1');
    expect(content).toContain('image.onerror = null;');
    expect(content).toContain('shortThumbnailUrl(short.id, "hqdefault")');
    ["uOaql94ArBQ", "SCYXRjhB9rU", "ZBeG2Ntn-kg", "I4oaLkc9eos"].forEach((videoId) => expect(content).toContain(videoId));
  });

  it("uses the authored content as the optimized phone experience and preserves responsive refinements", () => {
    const authoredStart = css.indexOf('/* ── Ultherapy Prime authored landing content');
    const authoredEnd = css.indexOf('/* Desktop equipment list:', authoredStart);
    const authoredRules = css.slice(authoredStart, authoredEnd);

    expect(authoredStart).toBeGreaterThan(-1);
    expect(authoredRules).toContain('.ultherapy-prime-desktop {\n  display: block;');
    expect(authoredRules).toContain('@media (max-width: 767px)');
    expect(authoredRules).toContain('.equipment-detail__hero--ultherapy-mobile,\n.ultherapy-prime-desktop-mobile-only {\n  display: none !important;');
    expect(authoredRules).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__shorts { display: grid;');
    expect(authoredRules).toContain('grid-template-columns: minmax(0, 1fr);');
    expect(authoredRules).toContain('@media (min-width: 768px)');
    expect(authoredRules).toContain('@media (min-width: 1024px)');
    expect(authoredRules).toContain('grid-template-columns: repeat(4, minmax(0, 1fr));');
    expect(authoredRules).toContain('aspect-ratio: 9 / 16;');
  });

  it("keeps the warm brand palette and accessibility-safe focus treatment", () => {
    const authoredStart = css.indexOf('/* ── Ultherapy Prime authored landing content');
    const authoredEnd = css.indexOf('/* Desktop equipment list:', authoredStart);
    const authoredRules = css.slice(authoredStart, authoredEnd);

    expect(authoredRules).toContain('var(--home-section-bg-a)');
    expect(authoredRules).toContain('var(--home-section-bg-b)');
    expect(authoredRules).toContain('--ultherapy-deep: #3B2B21');
    expect(authoredRules).toContain('button:focus-visible');
    expect(authoredRules).not.toContain('#111C2E');
    expect(authoredRules).not.toContain('#162033');
  });
});
