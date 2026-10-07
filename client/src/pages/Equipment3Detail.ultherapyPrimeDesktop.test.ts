import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");
const page = read("client/src/pages/Equipment3Detail.tsx");
const content = read("client/src/components/treatments/UltherapyPrimeDesktopContent.tsx");
const copy = read("client/src/components/treatments/ultherapyPrimeContent.ts");
const css = read("client/src/index.css");
const liftingPositioning = read("client/src/components/LiftingPositioning.tsx");

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
    const quote = page.indexOf('equipment-detail__info-shell ${isUltherapyPrime ? "mb-0" : "mb-12"}');

    expect(authoredInsert).toBeGreaterThan(-1);
    expect(faq).toBeGreaterThan(authoredInsert);
    expect(quote).toBeGreaterThan(faq);
  });

  it("contains complete Korean, English, Japanese, Simplified Chinese, and Traditional Chinese authored copy", () => {
    ["ko:", "en:", "ja:", "zh:", '"zh-TW":'].forEach((locale) => expect(copy).toContain(locale));
    [
      "What is Ultherapy Prime?",
      "Ultherapy Primeとは\\nどのような施術ですか？",
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
    expect(content).toContain('text.split("\\n").map');
    expect(content).toContain('function KoreanMobileLineBreak');
    expect(content).toContain('function KoreanMobileOnlyLineBreak');
    expect(copy).toContain('"대한민국 의사의\\n단 2% 피부과전문의"');
    expect(copy).toContain('"대학병원 교수출신,\\n20년 이상의 시술 경험"');
  });

  it("keeps all requested supplied media and semantic sections", () => {
    [
      'ultherapy-prime-device_374d4239.png',
      'ultherapy-prime-mobile-control-unit_bc826791.png',
      'ultherapy-prime-authenticity_060bcbbe.png',
      'ultherapy-prime-specialist_15575405.png',
      'ultherapy-prime-handpiece-dsc-605_dd7aa28b.webp',
      '1_530b8674.png',
      'ultherapy-prime-depths_5f0a9424.png',
      'ultherapy-prime-procedure-depths-2026-10-06_eaa6eeae.png',
      'ultherapy-prime-collagen-stage-1_14727d05.webp',
      'ultherapy-prime-process-step-1_68a4c1b5.webp',
      'ultherapy-prime-qa-thumbnail_5bd4e1e1.webp',
      'ultherapy-prime-xerf-body-arm-l45_12cffff1.webp',
      'ultherapy-prime-v-ro_37ba6e49.png',
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
    expect(content).not.toContain('ultherapy-prime-oligiox_6c01bdc5.webp');
    expect(content).toContain('{ image: ASSET.onda, secondaryImage: ASSET.vro }');
  });

  it("uses localized XERF titles and descriptions in the second combination card", () => {
    [
      '+ 세르프',
      '+ XERF',
      "피부 속 콜라겐 재생을 돕고",
      "support collagen renewal",
      "コラーゲン再生を促し",
      "促进胶原蛋白再生",
      "促進膠原蛋白再生",
    ].forEach((fragment) => expect(copy).toContain(fragment));
    expect(content).toContain('title.split("\\n").map');
    expect(copy).not.toContain('Oligio X');
    expect(copy).not.toContain('올리지오X');
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

  it("keeps Korean phone visuals aligned with the current PC image selection", () => {
    const authoredStart = css.indexOf('/* ── Ultherapy Prime authored landing content');
    const authoredEnd = css.indexOf('/* Desktop equipment list:', authoredStart);
    const authoredRules = css.slice(authoredStart, authoredEnd);

    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero .ultherapy-prime-desktop__eyebrow { display: none; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero h1 { font-size: clamp(0.96rem, 4.5vw, 1.08rem);');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-description { font-size: clamp(1.08rem, 5.05vw, 1.28rem);');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-description .ultherapy-prime-desktop__title-line { white-space: nowrap; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-copy { display: contents; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__wordmark { align-self: center; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-description { text-align: center; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-visual { order: 2; min-height: 205px; margin-top: 0.25rem; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__trust-badges { order: 3; margin-top: 0.35rem; padding-bottom: 0.7rem; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-device { height: min(250px, 64vw); }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-mobile-control-unit { display: block; width: min(100%, 295px);');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__hero-visual { min-height: 0; margin-top: 1.4rem; padding: 0.7rem 0 1.05rem; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__heading { text-align: center; }');
    expect(content).toContain('ultherapy-prime-desktop__principle-diagram--mobile-inline');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__principle-grid > .ultherapy-prime-desktop__principle-diagram { display: none; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__principle-diagram--mobile-inline { display: flex !important; justify-content: center; margin: 1.1rem 0 0.6rem; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__authentic-emphasis { color: var(--ultherapy-ink); font-weight: 700; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__authentic-depth .ultherapy-prime-desktop__mobile-break { display: initial; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__mobile-korean-break { display: initial; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__combination-grid article { grid-template-columns: 124px minmax(0, 1fr); grid-template-rows: 1fr auto auto 1fr;');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__combination-image img { flex: 1 1 0; width: auto; min-width: 0; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__pain-shorts h3 { text-align: center; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__combination-grid article:nth-child(4) h3 { font-size: 0.84rem; letter-spacing: -0.035em; }');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__recommend-copy li { align-items: center; justify-content: center; gap: 0.3rem; font-size: clamp(0.64rem, 3.35vw, 0.78rem);');
    expect(authoredRules).toContain('body.font-lang-ko .ultherapy-prime-desktop__recommend-copy li svg { width: 0.72rem; height: 0.72rem; margin-top: 0; }');
    expect(authoredRules).toContain('body.font-lang-ko .equipment-detail-page:has(.ultherapy-prime-desktop) .equipment-detail__lower-surface {\n    display: flex;\n    flex-direction: column;\n    gap: 2rem;');
    expect(css).toContain('.equipment-detail-page:has(.ultherapy-prime-desktop) #main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__faq-shell {\n      padding: 2rem 0 0 !important;\n    }');
    expect(css).toContain('.equipment-detail-page:has(.ultherapy-prime-desktop) #main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__info-shell {\n      padding: 0 !important;\n      border-top: 0 !important;\n    }');
    expect(authoredRules).toContain('body.font-lang-ko #main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__back-surface {\n    padding-top: 0;\n  }');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__principle-diagram img.ultherapy-prime-desktop__principle-diagram--tablet { display: none; }');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__principle-diagram img.ultherapy-prime-desktop__principle-diagram--pc { display: block; }');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__authentic-equipment--pc-hidden,');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ko"] .ultherapy-prime-desktop__authentic .ultherapy-prime-desktop__auth-seal { display: none; }');
  });

  it("keeps foreign-language phones on the same approved image sequence as Korean", () => {
    const authoredStart = css.indexOf('/* ── Ultherapy Prime authored landing content');
    const authoredEnd = css.indexOf('/* Desktop equipment list:', authoredStart);
    const authoredRules = css.slice(authoredStart, authoredEnd);

    expect(content).toContain('alt={copy.mobileControlUnitAlt}');
    [
      'mobileControlUnitAlt: "Ultherapy Prime control unit"',
      'mobileControlUnitAlt: "Ultherapy Prime コントロールユニット"',
      'mobileControlUnitAlt: "Ultherapy Prime 控制主机"',
      'mobileControlUnitAlt: "Ultherapy Prime 控制主機"',
    ].forEach((translation) => expect(copy).toContain(translation));
    expect(authoredRules).toContain('body:is(.font-lang-en, .font-lang-ja, .font-lang-zh) .ultherapy-prime-desktop__hero-mobile-control-unit { display: block; width: min(100%, 295px);');
    expect(content).toContain('function ForeignMobileHeadingLineBreak');
    expect(content).toContain('type ForeignMobileHeading = "what" | "auth" | "pain" | "combination" | "recommend" | "star";');
    expect(content).toContain('className="ultherapy-prime-desktop__foreign-mobile-break"');
    expect(content).toContain('className="ultherapy-prime-desktop__foreign-mobile-heading-desktop"');
    expect(content).toContain('className="ultherapy-prime-desktop__foreign-mobile-heading-mobile"');
    expect(content).toContain('auth: "正規品のUltherapy Primeが"');
    expect(content).toContain('pain: "Ultherapy Primeの"');
    expect(content).toContain('combination: "Ultherapy Primeと"');
    expect(content).toContain('recommend: "Ultherapy Primeは"');
    expect(content).toContain('star: "あなたの大切な若々しさを、"');
    expect(content).toContain('star: "您的珍贵青春，"');
    expect(content).toContain('star: "您珍貴的青春，"');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__foreign-mobile-break {\n  display: none;\n}');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__foreign-mobile-heading-mobile {\n  display: none;\n}');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ja"] .ultherapy-prime-desktop__foreign-mobile-break,\n  .ultherapy-prime-desktop__content[data-lang="zh"] .ultherapy-prime-desktop__foreign-mobile-break,\n  .ultherapy-prime-desktop__content[data-lang="zh-TW"] .ultherapy-prime-desktop__foreign-mobile-break { display: initial; }');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ja"] .ultherapy-prime-desktop__foreign-mobile-heading-desktop,\n  .ultherapy-prime-desktop__content[data-lang="zh"] .ultherapy-prime-desktop__foreign-mobile-heading-desktop,\n  .ultherapy-prime-desktop__content[data-lang="zh-TW"] .ultherapy-prime-desktop__foreign-mobile-heading-desktop { display: none; }');
    expect(authoredRules).toContain('.ultherapy-prime-desktop__content[data-lang="ja"] .ultherapy-prime-desktop__foreign-mobile-heading-mobile,\n  .ultherapy-prime-desktop__content[data-lang="zh"] .ultherapy-prime-desktop__foreign-mobile-heading-mobile,\n  .ultherapy-prime-desktop__content[data-lang="zh-TW"] .ultherapy-prime-desktop__foreign-mobile-heading-mobile { display: inline; }');
    expect(authoredRules).toContain('body:is(.font-lang-en, .font-lang-ja, .font-lang-zh) .ultherapy-prime-desktop__content:not([data-lang="ko"]) .ultherapy-prime-desktop__principle-diagram--mobile-inline { display: flex !important; justify-content: center; margin: 1.1rem 0 0.6rem; }');
    expect(authoredRules).toContain('body:is(.font-lang-en, .font-lang-ja, .font-lang-zh) .ultherapy-prime-desktop__content:not([data-lang="ko"]) .ultherapy-prime-desktop__authentic-equipment--pc-hidden,');
    expect(authoredRules).toContain('body:is(.font-lang-en, .font-lang-ja, .font-lang-zh) .ultherapy-prime-desktop__content:not([data-lang="ko"]) .ultherapy-prime-desktop__authentic-media { grid-template-columns: minmax(0, 1fr); }');
    expect(authoredRules).toContain('body:is(.font-lang-en, .font-lang-ja, .font-lang-zh) .ultherapy-prime-desktop__content:not([data-lang="ko"]) .ultherapy-prime-desktop__combination-image { grid-column: 1; grid-row: 1 / -1; gap: 0.2rem; min-height: 0; padding: 0.25rem; overflow: hidden; }');
    expect(authoredRules).toContain('body:is(.font-lang-en, .font-lang-ja, .font-lang-zh) .ultherapy-prime-desktop__content:not([data-lang="ko"]) .ultherapy-prime-desktop__combination-image img { flex: 1 1 0; width: auto; min-width: 0; }');
    expect(authoredRules).toContain('.equipment-detail-page:has(.ultherapy-prime-desktop) .equipment-detail__lower-surface {\n    display: flex;\n    flex-direction: column;\n    gap: 2rem;');
    expect(authoredRules).toContain('#main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__faq-shell {\n    padding: 2rem 0 0 !important;');
    expect(authoredRules).toContain('#main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__info-shell {\n    padding: 0 !important;');
    expect(authoredRules).toContain('#main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__positioning-faq,');
    expect(authoredRules).toContain('#main-content.equipment-detail__main .equipment-detail__lower-surface > .equipment-detail__back-surface {\n    padding-top: 0 !important;');
    expect(page).toContain('equipment-detail__faq-shell ${isUltherapyPrime ? "mb-0" : "mb-12"}');
    expect(page).toContain('<LiftingFaqSection lang={lang} compact={isUltherapyPrime} />');
    expect(page).toContain('equipment-detail__info-shell ${isUltherapyPrime ? "mb-0" : "mb-12"}');
    expect(page).toContain('equipment-detail__back-surface ${isUltherapyPrime ? "mt-0" : "mt-8"}');
    expect(liftingPositioning).toContain('compact = false');
    expect(liftingPositioning).toContain('equipment-detail__positioning-faq ${compact ? "mb-0" : "mb-12"}');
    expect(authoredRules).toContain('@media (max-width: 767px)');
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
