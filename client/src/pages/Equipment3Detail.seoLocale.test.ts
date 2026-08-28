import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Equipment3Detail.tsx"), "utf8");
const seoBlockStart = source.indexOf("const pageUrl = getLocalizedUrl");
const seoBlock = source.slice(seoBlockStart, source.indexOf("      <Header", seoBlockStart));

describe("Equipment3Detail localized canonical and hreflang contract", () => {
  it("derives the canonical from the locale and slug without a display-tab query", () => {
    expect(seoBlock).toContain("const pageUrl = getLocalizedUrl(lang, `/equipment3/${slug}`);");
    expect(seoBlock).toContain("canonical={pageUrl}");
    expect(seoBlock).toContain("ogUrl={pageUrl}");
    expect(seoBlock).not.toContain("tabFromUrl");
  });

  it("preserves all five locale detail alternates independently of translated content", () => {
    expect(seoBlock).toContain("hreflangs={buildHreflangs(");
    expect(seoBlock).toContain("`/equipment3/${slug}`");
    expect(seoBlock).toContain("`/en/equipment3/${slug}`");
    expect(seoBlock).toContain("`/ja/equipment3/${slug}`");
    expect(seoBlock).toContain("`/zh/equipment3/${slug}`");
    expect(seoBlock).not.toContain("`/zh-tw/equipment3/${slug}`");
  });

  it("passes locale-aware BreadcrumbList and FAQPage schema with the same self URL to SeoHead", () => {
    expect(seoBlock).toContain("buildBreadcrumbJsonLd");
    expect(seoBlock).toContain("buildFAQPageJsonLd");
    expect(seoBlock).toContain('"@id": `${pageUrl}#breadcrumb`');
    expect(seoBlock).toContain('"@id": `${pageUrl}#faq`');
    expect(seoBlock).toContain("withSchemaLanguage");
    expect(seoBlock).toContain("breadcrumbJsonLd,");
    expect(seoBlock).toContain("...(faqJsonLd ? [faqJsonLd] : [])");
  });
});
