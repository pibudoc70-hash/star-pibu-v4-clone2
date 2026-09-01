import { cleanup, render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildHreflangs, LANG_TO_OG_LOCALE, SITE_NAME_LOCALIZED } from "@/lib/seoHelpers";
import SeoHead from "./SeoHead";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";
type SeoSurface = "home" | "about" | "doctors" | "equipment";

const equipmentSlug = "ultherapy-prime";

const localeRoutes: Array<{ surface: SeoSurface; locale: Locale; path: string }> = [
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
  ...(["ko", "en", "ja", "zh", "zh-TW"] as Locale[]).map((locale) => ({
    surface: "equipment" as const,
    locale,
    path: locale === "ko"
      ? `/equipment3/${equipmentSlug}`
      : `/${locale === "zh-TW" ? "zh-tw" : locale}/equipment3/${equipmentSlug}`,
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
    const routePaths = path.includes(`/equipment3/${equipmentSlug}`)
      ? {
          ko: `/equipment3/${equipmentSlug}`,
          en: `/en/equipment3/${equipmentSlug}`,
          ja: `/ja/equipment3/${equipmentSlug}`,
          zh: `/zh/equipment3/${equipmentSlug}`,
          zhTW: `/zh-tw/equipment3/${equipmentSlug}`,
        }
      : path.endsWith("/about")
        ? { ko: "/about", en: "/en/about", ja: "/ja/about", zh: "/zh/about", zhTW: "/zh-tw/about" }
        : path.endsWith("/doctors")
          ? { ko: "/doctors", en: "/en/doctors", ja: "/ja/doctors", zh: "/zh/doctors", zhTW: "/zh-tw/doctors" }
          : { ko: "/", en: "/en", ja: "/ja", zh: "/zh", zhTW: "/zh-tw" };
    const hreflangs = buildHreflangs(
      routePaths.ko,
      routePaths.en,
      routePaths.ja,
      routePaths.zh,
      routePaths.zhTW,
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
      expect(document.head.querySelectorAll('meta[property="og:site_name"]')).toHaveLength(1);
      expect(document.head.querySelector('meta[property="og:site_name"]')?.getAttribute("content")).toBe(SITE_NAME_LOCALIZED[locale]);

      hreflangs.forEach(({ hreflang, href }) => {
        const alternate = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
        expect(alternate?.getAttribute("href")).toBe(href);
        expect(href).not.toContain("?");
        expect(href).not.toContain("#");
      });
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
