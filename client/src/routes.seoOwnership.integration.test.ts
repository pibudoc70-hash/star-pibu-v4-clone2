import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const app = source("client/src/App.tsx");
const routes = source("client/src/routes.ts");
const home = source("client/src/pages/Home.tsx");
const about = source("client/src/pages/About.tsx");
const doctors = source("client/src/pages/Doctors.tsx");
const landingPages = ["LandingEN", "LandingJA", "LandingZH", "LandingZHTW"].map((page) => ({
  page,
  source: source(`client/src/pages/${page}.tsx`),
}));

describe("live route SEO ownership integration", () => {
  it("maps the five homepage locale routes to components that each render a route-level SeoHead", () => {
    expect(app).toMatch(/<Route\s+path="\/"\s+component=\{Home\}\s*\/>/);
    expect(app).toMatch(/<Route\s+path="\/en"\s+component=\{LandingEN\}\s*\/>/);
    expect(app).toMatch(/<Route\s+path="\/ja"\s+component=\{LandingJA\}\s*\/>/);
    expect(app).toMatch(/<Route\s+path="\/zh"\s+component=\{LandingZH\}\s*\/>/);
    expect(app).toMatch(/<Route\s+path="\/zh-tw"\s+component=\{LandingZHTW\}\s*\/>/);
    expect(home).toContain("<SeoHead");
    expect(home).toContain("{...HOME_SEO_META}");

    landingPages.forEach(({ page, source: landing }) => {
      expect(landing, `${page} must own its page-level SEO`).toContain("<SeoHead");
      expect(landing, `${page} must provide a canonical URL`).toContain("canonical=");
      expect(landing, `${page} must provide hreflangs`).toContain("hreflangs=");
      expect(landing, `${page} must provide an OG locale`).toContain("ogLocale=");
    });
  });

  it("maps all locale About and Doctors routes to components that pass route-aware SEO props", () => {
    expect(routes).toContain('path: "about",             component: About');
    expect(routes).toContain('path: "doctors",           component: Doctors');
    expect(routes).toContain('return [`/${path}`, `/en/${path}`, `/ja/${path}`, `/zh/${path}`, `/zh-tw/${path}`];');

    expect(about).toContain("canonical={pageUrl}");
    expect(about).toContain("ogUrl={pageUrl}");
    expect(about).toContain("ogLocale={LANG_TO_OG_LOCALE[lang]");
    expect(about).toContain('buildHreflangs("/about", "/en/about", "/ja/about", "/zh/about", "/zh-tw/about")');

    expect(doctors).toContain("const seo = getDoctorsSeoContent(lang);");
    expect(doctors).toContain("canonical={`${BASE_URL}${pageUrl}`}");
    expect(doctors).toContain("ogLocale={ogLocale}");
    expect(doctors).toContain('buildHreflangs("/doctors", "/en/doctors", "/ja/doctors", "/zh/doctors")');
  });
});
