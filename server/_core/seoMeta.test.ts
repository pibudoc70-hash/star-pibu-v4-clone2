import { describe, expect, it } from "vitest";
import { buildPageLanguageLinks, injectPageSeoMeta, SEO_BASE_URL } from "./seoMeta";

const template = `<!doctype html><html><head><meta property="og:locale" content="ko_KR" /><meta property="og:locale:alternate" content="en_US" /><link rel="canonical" href="https://star-pibu.com/" /><link rel="alternate" hreflang="ko" href="https://star-pibu.com/" /><link rel="alternate" hreflang="x-default" href="https://star-pibu.com/" /></head><body><div id="root"></div></body></html>`;

describe("SEO raw HTML meta injection", () => {
  it.each([
    ["/", "콘텐츠를 불러오는 중입니다"],
    ["/en", "Loading..."],
    ["/ja", "読み込み中..."],
    ["/zh", "加载中..."],
    ["/zh-tw", "載入中..."],
    ["/zh/treatments/ulthera", "加载中..."],
  ])("%s raw HTML uses the existing locale loading label", (pathname, expectedLabel) => {
    const html = injectPageSeoMeta(
      '<!doctype html><html lang="ko"><head><link rel="canonical" href="https://star-pibu.com/" /></head><body><div id="initial-loading"><p class="initial-loading-label">콘텐츠를 불러오는 중입니다</p></div><div id="root"></div></body></html>',
      pathname,
    );
    expect(html).toContain(`<p class="initial-loading-label">${expectedLabel}</p>`);
  });

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
    expect(html).toContain('property="og:site_name" content="釜山スター皮膚科"');
  });

  it("영어 raw HTML에는 canonical 브랜드 표기의 OG site name을 한 번만 출력한다", () => {
    const html = injectPageSeoMeta(`${template}<meta property="og:site_name" content="legacy" />`, "/en/equipment3/rejuran");
    expect(html.match(/property="og:site_name"/g)).toHaveLength(1);
    expect(html).toContain('property="og:site_name" content="STAR Dermatology Busan"');
  });

  it.each([
    ["/", "ko"],
    ["/en/treatments/ulthera", "en"],
    ["/ja/treatments/ulthera", "ja"],
    ["/zh/treatments/ulthera", "zh-Hans"],
    ["/zh-tw/treatments/ulthera", "zh-Hant"],
  ])("%s raw HTML의 lang은 공용 locale owner가 %s로 한 번만 설정한다", (pathname, expectedLang) => {
    const html = injectPageSeoMeta(
      '<!doctype html><html data-shell="true" lang="ko"><head><link rel="canonical" href="https://star-pibu.com/" /></head><body></body></html>',
      pathname,
    );

    expect(html).toContain(`<html data-shell="true" lang="${expectedLang}">`);
    expect(html.match(/<html\b[^>]*\blang=/gi)).toHaveLength(1);
  });
});
