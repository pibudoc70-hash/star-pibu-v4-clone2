import { cleanup, render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildHreflangs, LANG_TO_OG_LOCALE } from "@/lib/seoHelpers";
import SeoHead from "./SeoHead";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";

const localeRoutes: Array<{ surface: "home" | "about" | "doctors"; locale: Locale; path: string }> = [
  ...(["ko", "en", "ja", "zh", "zh-TW"] as Locale[]).map((locale) => ({
    surface: "home" as const,
    locale,
    path: locale === "ko" ? "/" : `/${locale === "zh-TW" ? "zh-tw" : locale}`,
  })),
  ...(["ko", "en", "ja", "zh", "zh-TW"] as Locale[]).map((locale) => ({
    surface: "about" as const,
    locale,
    path: locale === "ko" ? "/about" : `/${locale === "zh-TW" ? "zh-tw" : locale}/about`,
  })),
  ...(["ko", "en", "ja", "zh", "zh-TW"] as Locale[]).map((locale) => ({
    surface: "doctors" as const,
    locale,
    path: locale === "ko" ? "/doctors" : `/${locale === "zh-TW" ? "zh-tw" : locale}/doctors`,
  })),
];

const BASE_URL = "https://star-pibu.com";
const originalHead = document.head.innerHTML;

function appendHomeFallback() {
  document.head.insertAdjacentHTML(
    "beforeend",
    `
      <meta data-seo-fallback="home" name="description" content="fallback" />
      <meta data-seo-fallback="home" property="og:locale" content="ko_KR" />
      <link data-seo-fallback="home" rel="canonical" href="${BASE_URL}/" />
      ${buildHreflangs("/", "/en", "/ja", "/zh", "/zh-tw")
        .map(({ hreflang, href }) => `<link data-seo-fallback="home" rel="alternate" hreflang="${hreflang}" href="${href}" />`)
        .join("\n")}
    `,
  );
}

function appendHomePrerenderSchema() {
  document.head.insertAdjacentHTML(
    "beforeend",
    '<script type="application/ld+json" data-prerender="home-schema">{"@type":"MedicalClinic"}</script>',
  );
}

describe("SeoHead hydrated locale ownership", () => {
  beforeEach(() => {
    document.head.innerHTML = originalHead;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.head.innerHTML = originalHead;
  });

  it.each(localeRoutes)("keeps one localized head contract after $surface $locale hydrates", async ({ locale, path }) => {
    appendHomeFallback();
    const canonical = `${BASE_URL}${path === "/" ? "" : path}`;
    const hreflangs = buildHreflangs(
      path.endsWith("/about") ? "/about" : path.endsWith("/doctors") ? "/doctors" : "/",
      path.endsWith("/about") ? "/en/about" : path.endsWith("/doctors") ? "/en/doctors" : "/en",
      path.endsWith("/about") ? "/ja/about" : path.endsWith("/doctors") ? "/ja/doctors" : "/ja",
      path.endsWith("/about") ? "/zh/about" : path.endsWith("/doctors") ? "/zh/doctors" : "/zh",
      path.endsWith("/about") ? "/zh-tw/about" : path.endsWith("/doctors") ? "/zh-tw/doctors" : "/zh-tw",
    );

    render(
      <HelmetProvider>
        <SeoHead
          title={`SEO ${locale}`}
          description={`Description ${locale}`}
          canonical={canonical}
          ogUrl={canonical}
          ogLocale={LANG_TO_OG_LOCALE[locale]}
          hreflangs={hreflangs}
        />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.head.querySelectorAll('[data-seo-fallback="home"]')).toHaveLength(0);
      expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(canonical);
      expect(document.head.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(6);
      expect(document.head.querySelectorAll('meta[property="og:locale"]')).toHaveLength(1);
      expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute("content")).toBe(LANG_TO_OG_LOCALE[locale]);
    });
  });

  it("replaces server-injected home schema with the shared client schema after hydration", async () => {
    appendHomeFallback();
    appendHomePrerenderSchema();

    render(
      <HelmetProvider>
        <SeoHead title="SEO ko" description="Description ko" pageType="home" />
      </HelmetProvider>,
    );

    await waitFor(() => {
      expect(document.head.querySelectorAll('[data-prerender="home-schema"]')).toHaveLength(0);
    });
  });
});
