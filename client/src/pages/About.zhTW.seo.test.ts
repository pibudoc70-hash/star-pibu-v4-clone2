import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/About.tsx"), "utf8");

describe("About zh-TW page-local SEO copy", () => {
  it("defines Traditional Chinese metadata without extending existing medical claims", () => {
    expect(source).toContain('lang === "zh-TW" ? "診所介紹｜釜山西面STAR皮膚科"');
    expect(source).toContain('lang === "zh-TW" ? "介紹釜山西面STAR皮膚科的診療理念、醫師團隊、診療時間與交通資訊。"');
    expect(source).toContain('lang === "zh-TW" ? "釜山皮膚科, STAR皮膚科, 西面皮膚科, 皮膚科專科, 診所介紹"');
  });

  it("localizes the visible labels and Breadcrumb JSON-LD for the live zh-TW route", () => {
    expect(source).toContain('lang === "zh-TW" ? { address: "地址", subway: "地鐵", bus: "公車", parking: "停車" }');
    expect(source).toContain('lang === "zh-TW" ? "診所介紹"');
    expect(source).toContain('lang === "zh-TW" ? "查看醫師團隊 →"');
    expect(source).toContain('lang === "zh-TW" ? "首頁"');
    expect(source).toContain('buildHreflangs("/about", "/en/about", "/ja/about", "/zh/about", "/zh-tw/about")');
  });
});
