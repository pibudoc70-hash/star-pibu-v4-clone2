import express from "express";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { zhTW } from "../../client/src/lib/i18n.zh-TW";
import { buildDoctorsPrerenderedHtml, DOCTORS_PRERENDER_CACHE_CONTROL, registerDoctorsPrerender } from "./doctorsPrerender";

const template = `<!doctype html><html lang="ko"><head>
<title>fallback</title>
<meta name="description" content="fallback" />
<meta name="keywords" content="fallback" />
<meta property="og:title" content="fallback" />
<meta property="og:description" content="fallback" />
<meta property="og:url" content="https://star-pibu.com" />
<meta property="og:locale" content="ko_KR" />
<meta name="twitter:title" content="fallback" />
<meta name="twitter:description" content="fallback" />
<link rel="canonical" href="https://star-pibu.com/" />
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

describe("Doctors prerender", () => {
  it("injects Korean crawler content, route metadata, Physician JSON-LD, and one canonical", () => {
    const html = buildDoctorsPrerenderedHtml(template, "/doctors");

    expect(html).toContain('id="crawler-content"');
    expect(html).toContain("피부과전문의 3인");
    expect(html).toContain("조시형 원장");
    expect(html).toContain('data-prerender="doctors"');
    expect(html).toContain('"@type":"Physician"');
    expect(html).toContain('href="https://star-pibu.com/doctors"');
    expect(html?.match(/rel="canonical"/g)).toHaveLength(1);
  });

  it("uses the Traditional Chinese view-model content and normalized locale metadata", () => {
    const html = buildDoctorsPrerenderedHtml(template, "/zh-tw/doctors");

    expect(html).toContain(`lang="zh-Hant"`);
    expect(html).toContain(zhTW.doctors.list[0].name);
    expect(html).toContain('property="og:locale" content="zh_TW"');
    expect(html).toContain('hreflang="zh-TW" href="https://star-pibu.com/zh-tw/doctors"');
  });

  it("rejects paths outside the five Doctors routes and keeps a short shared cache policy", () => {
    expect(buildDoctorsPrerenderedHtml(template, "/event/1")).toBeNull();
    expect(DOCTORS_PRERENDER_CACHE_CONTROL).toBe("public, max-age=0, s-maxage=300, stale-while-revalidate=600");
  });

  it("returns production-mode crawler HTML with one page head contract for all localized Doctors routes", async () => {
    process.env.NODE_ENV = "production";
    const app = express();
    registerDoctorsPrerender(app);

    await withServer(app, async (baseUrl) => {
      for (const path of ["/doctors", "/en/doctors", "/ja/doctors", "/zh/doctors", "/zh-tw/doctors"]) {
        const response = await fetch(`${baseUrl}${path}`);
        const html = await response.text();

        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe(DOCTORS_PRERENDER_CACHE_CONTROL);
        expect(html).toContain('id="crawler-content"');
        expect(html).toContain('data-prerender="doctors"');
        expect(html).toContain('"@type":"Physician"');
        expect(html.match(/<title>/g)).toHaveLength(1);
        expect(html.match(/rel="canonical"/g)).toHaveLength(1);
        expect(html).toContain(`href="https://star-pibu.com${path}"`);
        expect(html).toContain('hreflang="x-default" href="https://star-pibu.com/doctors"');
      }
    });
  });

  it("falls through without crawler markup outside production mode", async () => {
    process.env.NODE_ENV = "development";
    const app = express();
    registerDoctorsPrerender(app);
    app.get("/doctors", (_req, res) => res.status(299).send("development fallback"));

    await withServer(app, async (baseUrl) => {
      const response = await fetch(`${baseUrl}/doctors`);

      expect(response.status).toBe(299);
      expect(await response.text()).toBe("development fallback");
    });
  });
});
