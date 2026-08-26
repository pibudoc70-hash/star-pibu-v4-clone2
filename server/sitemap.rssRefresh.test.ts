import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildGlobalEntries } from "./sitemap";

const root = process.cwd();
const sitemapSource = readFileSync(join(root, "server/sitemap.ts"), "utf8");
const rssSource = readFileSync(join(root, "server/rss.ts"), "utf8");

describe("Naver Search Advisor sitemap and RSS refresh", () => {
  it("includes live foreign price-list and localized notice listing URLs in the sitemap", () => {
    const globalPaths = buildGlobalEntries().map((entry) => entry.path);
    for (const path of [
      "/en/price-list",
      "/ja/price-list",
      "/zh/price-list",
      "/zh-tw/price-list",
      "/en/notice",
      "/ja/notice",
      "/zh/notice",
      "/zh-tw/notice",
    ]) {
      expect(globalPaths).toContain(path);
    }
  });

  it("keeps the RSS feed on the canonical domain and includes latest public notices as well as equipment", () => {
    expect(rssSource).toContain('const SITE_URL = "https://star-pibu.com"');
    expect(rssSource).toContain('import { getAllNotices } from "./db/notices"');
    expect(rssSource).toContain('getAllNotices("ko")');
    expect(rssSource).toContain('`[공지] ${notice.title}`');
    expect(rssSource).toContain('${SITE_URL}/notice/${notice.id}');
  });

  it("emits the actual enclosure MIME type rather than labeling every image as JPEG", () => {
    expect(rssSource).toContain("function imageMimeType");
    expect(rssSource).toContain("const imageType = imageMimeType(imageUrl);");
    expect(rssSource).toContain('type="${imageType}"');
  });
});
