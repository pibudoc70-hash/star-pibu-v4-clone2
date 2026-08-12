import { describe, expect, it } from "vitest";
import { buildPageLanguageLinks, injectPageSeoMeta, SEO_BASE_URL } from "./seoMeta";

const template = `<!doctype html><html><head><meta property="og:locale" content="ko_KR" /><meta property="og:locale:alternate" content="en_US" /><link rel="canonical" href="https://star-pibu.com/" /><link rel="alternate" hreflang="ko" href="https://star-pibu.com/" /><link rel="alternate" hreflang="x-default" href="https://star-pibu.com/" /></head><body><div id="root"></div></body></html>`;

describe("SEO raw HTML meta injection", () => {
  it("언어별 서브페이지에 6개 상호 hreflang과 자기 canonical을 생성한다", () => {
    const links = buildPageLanguageLinks("/zh-tw/directions");
    expect(links).toHaveLength(6);
    expect(links.find((link) => link.hreflang === "ko")?.href).toBe(`${SEO_BASE_URL}/directions`);
    expect(links.find((link) => link.hreflang === "zh-TW")?.href).toBe(`${SEO_BASE_URL}/zh-tw/directions`);
    expect(links.find((link) => link.hreflang === "x-default")?.href).toBe(`${SEO_BASE_URL}/directions`);
  });

  it("원본 HTML에서 홈페이지 기본 메타를 해당 경로의 canonical과 4개 OG alternate로 교체한다", () => {
    const html = injectPageSeoMeta(template, "/ja/about");
    expect(html).toContain(`rel="canonical" href="${SEO_BASE_URL}/ja/about"`);
    expect(html).toContain(`hreflang="en" href="${SEO_BASE_URL}/en/about"`);
    expect(html).toContain(`hreflang="zh-TW" href="${SEO_BASE_URL}/zh-tw/about"`);
    expect(html).toContain('property="og:locale" content="ja_JP"');
    expect(html).toContain('property="og:locale:alternate" content="en_US"');
    expect(html).toContain('property="og:locale:alternate" content="zh_TW"');
  });
});
