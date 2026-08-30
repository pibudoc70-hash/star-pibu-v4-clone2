/**
 * JavaScript를 실행하지 않는 crawler를 위한 About page의 production-only summary.
 *
 * React page와 browser interaction은 그대로 유지한다. 이 helper는 기존 About page와
 * 같은 static i18n source로 semantic HTML·metadata·Breadcrumb JSON-LD만 주입한다.
 */
import type { Express, NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { ko } from "../../client/src/lib/i18n.ko";
import { en } from "../../client/src/lib/i18n.en";
import { ja } from "../../client/src/lib/i18n.ja";
import { zh } from "../../client/src/lib/i18n.zh";
import { zhTW } from "../../client/src/lib/i18n.zh-TW";
import { SITE_NAME_LOCALIZED } from "../../client/src/lib/seoHelpers";
import { injectPageSeoMeta } from "./seoMeta";

const BASE_URL = "https://star-pibu.com";
export const ABOUT_PRERENDER_CACHE_CONTROL = "public, max-age=0, s-maxage=300, stale-while-revalidate=600";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";

const localeContent = { ko, en, ja, zh, "zh-TW": zhTW } as const;
const documentLanguages: Record<Locale, string> = {
  ko: "ko",
  en: "en",
  ja: "ja",
  zh: "zh-Hans",
  "zh-TW": "zh-Hant",
};

let cachedHtml: string | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getLocale(pathname: string): Locale | null {
  if (pathname === "/about") return "ko";
  if (pathname === "/en/about") return "en";
  if (pathname === "/ja/about") return "ja";
  if (pathname === "/zh/about") return "zh";
  if (pathname === "/zh-tw/about") return "zh-TW";
  return null;
}

function loadIndexHtml(): string | null {
  if (cachedHtml) return cachedHtml;
  for (const candidate of [
    path.resolve(process.cwd(), "dist/public/index.html"),
    path.resolve(process.cwd(), "client/index.html"),
  ]) {
    try {
      cachedHtml = fs.readFileSync(candidate, "utf8");
      return cachedHtml;
    } catch {
      // 다음 template 후보를 확인한다.
    }
  }
  return null;
}

function getSeo(locale: Locale) {
  if (locale === "ja") return {
    title: "クリニック紹介 | 釜山西面スター皮膚科 - 20年の経験を持つ皮膚科専門医",
    description: "釜山西面スター皮膚科をご紹介します。20年の経験を持つ皮膚科専門医が直接診療し、ウルセラピー・サーマジ・リフティング・色素治療などプレミアム治療を提供しています。",
    keywords: "釜山皮膚科, スター皮膚科, 皮膚科専門医, 西面皮膚科, 釜山リフティング",
    label: "クリニック紹介",
    homeLabel: "ホーム",
  };
  if (locale === "zh") return {
    title: "诊所介绍 | 釜山西面星皮肤科 - 20年经验皮肤科专科医生",
    description: "介绍釜山西面星皮肤科。拥有20年经验的皮肤科专科医生亲自诊疗，提供热玛吉、提升、色素治疗等高端治疗项目。",
    keywords: "釜山皮肤科, 星皮肤科, 皮肤科专科, 西面皮肤科, 釜山提升",
    label: "关于我们",
    homeLabel: "首页",
  };
  if (locale === "zh-TW") return {
    title: "診所介紹｜釜山西面STAR皮膚科",
    description: "介紹釜山西面STAR皮膚科的診療理念、醫師團隊、診療時間與交通資訊。",
    keywords: "釜山皮膚科, STAR皮膚科, 西面皮膚科, 皮膚科專科, 診所介紹",
    label: "診所介紹",
    homeLabel: "首頁",
  };
  if (locale === "en") return {
    title: "About Us | Star Dermatology Clinic Busan - 20 Years of Expert Care",
    description: "About Star Dermatology Clinic in Seomyeon, Busan. A board-certified dermatologist with 20+ years of experience provides Ultherapy, Thermage, lifting, pigmentation treatments and more.",
    keywords: "Busan dermatology, Star Dermatology Clinic, dermatologist Busan, Seomyeon skin clinic, about us",
    label: "About",
    homeLabel: "Home",
  };
  return {
    title: "피부과 소개 | 부산 서면 스타피부과 - 20년 경력 피부과 전문의",
    description: "부산 서면 스타피부과를 소개합니다. 20년 경력의 피부과 전문의가 직접 진료하며, 울쎄라, 써마지, 리프팅, 색소질환 등 프리미엄 시술을 제공합니다.",
    keywords: "부산피부과, 피부과소개, 피부과전문의, 스타피부과, 서면피부과, 부산리프팅",
    label: "병원 소개",
    homeLabel: "홈",
  };
}

function replaceMetaContent(template: string, selector: "name" | "property", key: string, content: string): string {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${selector}="${key}")(?=[^>]*\\bcontent="[^"]*")[^>]*\\/?>`, "i");
  return template.replace(pattern, `<meta data-server-seo="true" ${selector}="${key}" content="${escapeHtml(content)}" />`);
}

export function buildAboutPrerenderedHtml(template: string, pathname: string): string | null {
  const locale = getLocale(pathname);
  if (!locale) return null;

  const content = localeContent[locale];
  const seo = getSeo(locale);
  const canonical = `${BASE_URL}${pathname}`;
  const siteName = SITE_NAME_LOCALIZED[locale] ?? SITE_NAME_LOCALIZED.ko;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: seo.homeLabel, item: BASE_URL },
      { "@type": "ListItem", position: 2, name: seo.label, item: canonical },
    ],
  }).replace(/</g, "\\u003c");
  const statsMarkup = content.about.stats.slice(0, 3)
    .map((stat) => `<li><strong>${escapeHtml(stat.num)}</strong> ${escapeHtml(stat.label)}</li>`)
    .join("");
  const valuesMarkup = content.about.values
    .map((value) => `<article><h3>${escapeHtml(value.title)}</h3><p>${escapeHtml(value.desc)}</p></article>`)
    .join("");
  const hoursMarkup = content.hours.rows
    .map((row) => `<tr><th scope="row">${escapeHtml(row.day)}</th><td>${escapeHtml(row.time)}</td></tr>`)
    .join("");
  const accessMarkup = [content.access.address, content.access.subway, content.access.bus]
    .filter(Boolean)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const crawlerBody = [
    `<main id="crawler-content" lang="${documentLanguages[locale]}">`,
    `<header><p>${escapeHtml(siteName)}</p><h1>${escapeHtml(content.about.title)}</h1><p>${escapeHtml(content.about.desc)}</p></header>`,
    `<section aria-labelledby="crawler-about-stats"><h2 id="crawler-about-stats">${escapeHtml(seo.label)}</h2><ul>${statsMarkup}</ul></section>`,
    `<section aria-labelledby="crawler-about-values"><h2 id="crawler-about-values">${escapeHtml(content.about.title)}</h2>${valuesMarkup}</section>`,
    `<section aria-labelledby="crawler-hours"><h2 id="crawler-hours">${escapeHtml(content.hours.title)}</h2><table><tbody>${hoursMarkup}</tbody></table>${content.hours.note ? `<p>${escapeHtml(content.hours.note)}</p>` : ""}</section>`,
    `<section aria-labelledby="crawler-access"><h2 id="crawler-access">${escapeHtml(content.access.title)}</h2><ul>${accessMarkup}</ul></section>`,
    "</main>",
  ].join("\n");

  const withPageMeta = replaceMetaContent(
    replaceMetaContent(
      replaceMetaContent(
        replaceMetaContent(
          replaceMetaContent(
            replaceMetaContent(
              template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`),
              "name", "description", seo.description,
            ),
            "name", "keywords", seo.keywords,
          ),
          "property", "og:title", seo.title,
        ),
        "property", "og:description", seo.description,
      ),
      "property", "og:url", canonical,
    ),
    "name", "twitter:title", seo.title,
  );
  const rendered = replaceMetaContent(withPageMeta, "name", "twitter:description", seo.description)
    .replace("</head>", `    <script type="application/ld+json" data-prerender="about">${jsonLd}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">\n    ${crawlerBody}\n  </div>`);

  return injectPageSeoMeta(rendered, pathname);
}

export function registerAboutPrerender(app: Express): void {
  app.get(["/about", "/en/about", "/ja/about", "/zh/about", "/zh-tw/about"], (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next();

    try {
      const template = loadIndexHtml();
      const html = template ? buildAboutPrerenderedHtml(template, req.path) : null;
      if (!html) return next();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", ABOUT_PRERENDER_CACHE_CONTROL);
      return res.send(html);
    } catch (error) {
      console.error("[AboutPrerender] failed:", error instanceof Error ? error.message : error);
      return next();
    }
  });
}
