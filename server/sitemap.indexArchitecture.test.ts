import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "server/sitemap.ts"), "utf8");

describe("Naver sitemap index architecture", () => {
  it("registers one sitemap index and the five required non-empty child sitemap routes", () => {
    expect(source).toContain('app.get("/sitemap.xml"');
    for (const path of [
      "/sitemap-pages.xml",
      "/sitemap-treatments.xml",
      "/sitemap-equipment.xml",
      "/sitemap-notice.xml",
      "/sitemap-global.xml",
    ]) {
      expect(source).toContain(`childRoute("${path}"`);
    }

    expect(source).toContain("<sitemapindex");
    expect(source).toContain("<urlset");
  });

  it("keeps canonical absolute URLs while omitting priority and default changefreq", () => {
    expect(source).toContain('const SITE_URL = "https://star-pibu.com"');
    expect(source).not.toContain("<priority>");
    expect(source).not.toContain("<changefreq>");
    expect(source).toContain("isSitemapEligiblePath");
    expect(source).toContain("lastmod");
    expect(source).toContain("return encodeURI(");
  });

  it("partitions static, treatment, equipment, notice, and global URL classes", () => {
    for (const token of [
      "buildPagesEntries",
      "buildTreatmentEntries",
      "buildEquipmentEntries",
      "buildNoticeEntries",
      "buildGlobalEntries",
    ]) {
      expect(source).toContain(token);
    }
  });
});
