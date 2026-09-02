import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const seoHeadSource = readFileSync(resolve(process.cwd(), "client/src/components/SeoHead.tsx"), "utf8");
const indexHtml = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");

describe("SeoHead homepage fallback ownership", () => {
  it("removes only the static homepage fallback after a route-level SeoHead mounts", () => {
    expect(seoHeadSource).toContain('useLayoutEffect(() => {');
    expect(seoHeadSource).toContain("document.head.querySelectorAll('[data-seo-fallback=\"home\"]')");
    expect(seoHeadSource).toContain("window.requestAnimationFrame");
    expect(seoHeadSource).toContain("keepLastByKey('link[rel=\"alternate\"][hreflang]'"
    );
    expect(seoHeadSource).toContain("node.remove()");
  });

  it("marks the managed static metadata and alternate links as homepage fallbacks", () => {
    expect(indexHtml).toContain('data-seo-fallback="home" name="description"');
    expect(indexHtml).toContain('rel="canonical" data-rh="true" data-seo-fallback="home"');
    expect(indexHtml).toContain('rel="alternate" data-rh="true" data-seo-fallback="home" hreflang="zh-TW"');
    expect(indexHtml).toContain('<meta property="kakao:title"');
    expect(indexHtml).not.toContain('data-seo-fallback="home" property="kakao:title"');
    expect(indexHtml).toContain('<meta name="naver-site-verification" content="d4d01bc7ce16cb93c07f7431b57a3fdcfbfaeebe" />');
  });
});
