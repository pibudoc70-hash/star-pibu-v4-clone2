import type { Request } from "express";

export const SEO_BASE_URL = "https://star-pibu.com";

type SeoLocale = "ko" | "en" | "ja" | "zh" | "zh-TW";

const LANGUAGE_PREFIXES: Array<[SeoLocale, string]> = [
  ["ko", ""],
  ["en", "/en"],
  ["ja", "/ja"],
  ["zh", "/zh"],
  ["zh-TW", "/zh-tw"],
];

const OG_LOCALES: Record<SeoLocale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
  "zh-TW": "zh_TW",
};

/** Raw crawler HTML 문서 언어는 공용 SEO injector만 소유한다. */
const DOCUMENT_LANGUAGES: Record<SeoLocale, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-Hans",
  "zh-TW": "zh-Hant",
};

function normalizePathname(value: string): string {
  const pathname = value.split("?")[0].split("#")[0] || "/";
  if (pathname === "/") return "/";
  return pathname.replace(/\/+$/, "") || "/";
}

function splitLocale(pathname: string): { locale: SeoLocale; contentPath: string } {
  for (const [locale, prefix] of LANGUAGE_PREFIXES.slice(1)) {
    if (pathname === prefix) return { locale, contentPath: "/" };
    if (pathname.startsWith(`${prefix}/`)) {
      return { locale, contentPath: pathname.slice(prefix.length) || "/" };
    }
  }
  return { locale: "ko", contentPath: pathname };
}

function isPublicSeoPath(pathname: string): boolean {
  return !(
    pathname.startsWith("/api/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/my-reservations") ||
    pathname === "/404"
  );
}

export function buildPageLanguageLinks(pathname: string) {
  const normalized = normalizePathname(pathname);
  const { contentPath } = splitLocale(normalized);
  const hrefFor = (prefix: string) => `${SEO_BASE_URL}${prefix}${contentPath === "/" ? "" : contentPath}`;

  return [
    ...LANGUAGE_PREFIXES.map(([hreflang, prefix]) => ({ hreflang, href: hrefFor(prefix) })),
    { hreflang: "x-default", href: hrefFor("") },
  ];
}

/**
 * SPA fallback 및 기존 프리렌더러가 공유하는 head 메타 주입기.
 * React Helmet은 hydration 이후 동일 태그를 최신 클라이언트 메타로 교체한다.
 */
export function injectPageSeoMeta(template: string, pathname: string): string {
  const normalized = normalizePathname(pathname);
  if (!isPublicSeoPath(normalized)) return template;

  const { locale } = splitLocale(normalized);
  const canonical = `${SEO_BASE_URL}${normalized === "/" ? "" : normalized}`;
  const hreflangMarkup = buildPageLanguageLinks(normalized)
    .map(({ hreflang, href }) => `<link data-server-seo="true" rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join("\n    ");
  const alternateLocaleMarkup = (Object.keys(OG_LOCALES) as SeoLocale[])
    .filter((candidate) => candidate !== locale)
    .map((candidate) => `<meta data-server-seo="true" property="og:locale:alternate" content="${OG_LOCALES[candidate]}" />`)
    .join("\n    ");

  return template
    .replace(/<html\b([^>]*)>/i, (_match, attributes: string) => {
      const withoutLang = attributes.replace(/\s+lang\s*=\s*(?:"[^"]*"|'[^']*')/i, "");
      return `<html${withoutLang} lang="${DOCUMENT_LANGUAGES[locale]}">`;
    })
    .replace(/<link\b(?=[^>]*\brel="canonical")[^>]*\/?>\s*/gi, "")
    .replace(/<link\b(?=[^>]*\brel="alternate")(?=[^>]*\bhreflang="[^"]+")[^>]*\/?>(\s*)/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty="og:locale:alternate")[^>]*\/?>(\s*)/gi, "")
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:locale")[^>]*\/?>(\s*)/i,
      `<meta data-server-seo="true" property="og:locale" content="${OG_LOCALES[locale]}" />$1`,
    )
    .replace(
      "</head>",
      `    <link data-server-seo="true" rel="canonical" href="${canonical}" />\n    ${alternateLocaleMarkup}\n    ${hreflangMarkup}\n  </head>`,
    );
}

export function getRequestPathname(req: Pick<Request, "path" | "originalUrl">): string {
  return normalizePathname(req.path || req.originalUrl || "/");
}
