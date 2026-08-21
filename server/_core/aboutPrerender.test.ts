import express from "express";
import type { AddressInfo } from "node:net";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { zhTW } from "../../client/src/lib/i18n.zh-TW";
import { ABOUT_PRERENDER_CACHE_CONTROL, buildAboutPrerenderedHtml, registerAboutPrerender } from "./aboutPrerender";

const template = `<!doctype html><html lang="ko"><head>
<title>fallback</title>
<meta data-rh="true" data-seo-fallback="home" name="description" content="fallback" />
<meta data-rh="true" data-seo-fallback="home" name="keywords" content="fallback" />
<meta property="og:title" content="fallback" />
<meta property="og:description" content="fallback" />
<meta property="og:url" content="https://star-pibu.com" />
<meta property="og:locale" content="ko_KR" />
<meta name="twitter:title" content="fallback" />
<meta name="twitter:description" content="fallback" />
<link rel="canonical" href="https://star-pibu.com/" />
<link rel="alternate" data-rh="true" data-seo-fallback="home" hreflang="zh-TW" href="https://star-pibu.com/zh-tw" />
</head><body><div id="root"></div></body></html>`;

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

async function withServer(app: express.Express, callback: (baseUrl: string) => Promise<void>) {
  const server = await new Promise<ReturnType<express.Express["listen"]>>((resolve) => {
    const listener = app.listen(0, () => resolve(listener));
  });
  const { port } = server.address() as AddressInfo;

  try {
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

describe("About prerender", () => {
  it("injects Korean crawler content, localized metadata, Breadcrumb JSON-LD, and one canonical", () => {
    const html = buildAboutPrerenderedHtml(template, "/about");

    expect(html).toContain('id="crawler-content"');
    expect(html).toContain("피부과 소개");
    expect(html).toContain('data-prerender="about"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('href="https://star-pibu.com/about"');
    expect(html?.match(/rel="canonical"/g)).toHaveLength(1);
  });

  it("uses the Traditional Chinese locale content and normalized page metadata", () => {
    const html = buildAboutPrerenderedHtml(template, "/zh-tw/about");

    expect(html).toContain('lang="zh-Hant"');
    expect(html).toContain(zhTW.about.title);
    expect(html).toContain("診所介紹｜釜山西面STAR皮膚科");
    expect(html).toContain('name="description" content="介紹釜山西面STAR皮膚科的診療理念、醫師團隊、診療時間與交通資訊。"');
    expect(html).not.toContain('data-seo-fallback="home"');
    expect(html).toContain('property="og:locale" content="zh_TW"');
    expect(html).toContain('hreflang="zh-TW" href="https://star-pibu.com/zh-tw/about"');
    expect(html).not.toContain('href="https://star-pibu.com/zh-tw"');
  });

  it("rejects paths outside the five About routes and keeps a short shared cache policy", () => {
    expect(buildAboutPrerenderedHtml(template, "/directions")).toBeNull();
    expect(ABOUT_PRERENDER_CACHE_CONTROL).toBe("public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  });

  it("keeps content, About, and Doctors prerender registration in one ordered server boot chain", () => {
    const serverSource = readFileSync(resolve(process.cwd(), "server/_core/index.ts"), "utf8");
    const contentIndex = serverSource.indexOf("registerContentPrerender(app);");
    const aboutIndex = serverSource.indexOf("registerAboutPrerender(app);");
    const doctorsIndex = serverSource.indexOf("registerDoctorsPrerender(app);");

    expect(contentIndex).toBeGreaterThan(-1);
    expect(aboutIndex).toBeGreaterThan(contentIndex);
    expect(doctorsIndex).toBeGreaterThan(aboutIndex);
    expect(serverSource.match(/registerDoctorsPrerender\(app\);/g)).toHaveLength(1);
  });

  it("returns production-mode crawler HTML with one page head contract for all localized About routes", async () => {
    process.env.NODE_ENV = "production";
    const app = express();
    registerAboutPrerender(app);

    await withServer(app, async (baseUrl) => {
      for (const route of ["/about", "/en/about", "/ja/about", "/zh/about", "/zh-tw/about"]) {
        const response = await fetch(`${baseUrl}${route}`);
        const html = await response.text();

        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe(ABOUT_PRERENDER_CACHE_CONTROL);
        expect(html).toContain('id="crawler-content"');
        expect(html).toContain('data-prerender="about"');
        expect(html).toContain('"@type":"BreadcrumbList"');
        expect(html.match(/<title>/g)).toHaveLength(1);
        expect(html.match(/name="description"/g)).toHaveLength(1);
        expect(html.match(/rel="canonical"/g)).toHaveLength(1);
        expect(html.match(/<link\b(?=[^>]*\bhreflang=)[^>]*>/g)).toHaveLength(6);
        expect(html).not.toMatch(/data-seo-fallback="home"[^>]*name="description"/);
        expect(html).toContain(`href="https://star-pibu.com${route}"`);
        expect(html).toContain('hreflang="x-default" href="https://star-pibu.com/about"');
      }
    });
  });

  it("falls through without crawler markup outside production mode", async () => {
    process.env.NODE_ENV = "development";
    const app = express();
    registerAboutPrerender(app);
    app.get("/about", (_req, res) => res.status(299).send("development fallback"));

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/about`);

      expect(response.status).toBe(299);
      expect(await response.text()).toBe("development fallback");
    });
  });
});
