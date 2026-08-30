/**
 * JavaScript를 실행하지 않는 crawler를 위한 Doctors page의 production-only summary.
 *
 * React page와 browser interaction은 그대로 유지한다. 이 helper는 static doctor/i18n
 * source로 만든 semantic HTML·metadata·JSON-LD만 빈 SPA shell에 주입한다.
 */
import type { Express, NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { doctors, type Doctor } from "../../client/src/lib/doctors-data";
import { ko } from "../../client/src/lib/i18n.ko";
import { en } from "../../client/src/lib/i18n.en";
import { ja } from "../../client/src/lib/i18n.ja";
import { zh } from "../../client/src/lib/i18n.zh";
import { zhTW } from "../../client/src/lib/i18n.zh-TW";
import { buildPhysicianJsonLd, getDoctorsSeoContent } from "../../client/src/lib/doctorsSeo";
import { SITE_NAME_LOCALIZED } from "../../client/src/lib/seoHelpers";
import { injectPageSeoMeta } from "./seoMeta";

const BASE_URL = "https://star-pibu.com";
export const DOCTORS_PRERENDER_CACHE_CONTROL = "public, max-age=0, s-maxage=300, stale-while-revalidate=600";

type Locale = "ko" | "en" | "ja" | "zh" | "zh-TW";
type LocalizedDoctor = Omit<Doctor, "credentials" | "intro" | "specialties" | "badge"> & {
  intro: string[];
  specialties: string[];
  badge: string;
};

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
  if (pathname === "/doctors") return "ko";
  if (pathname === "/en/doctors") return "en";
  if (pathname === "/ja/doctors") return "ja";
  if (pathname === "/zh/doctors") return "zh";
  if (pathname === "/zh-tw/doctors") return "zh-TW";
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

function getLocalizedDoctors(locale: Locale): LocalizedDoctor[] {
  const content = localeContent[locale];
  return doctors.map((doctor) => {
    const localized = content.doctors.list.find((item) => item.id === doctor.id);
    const intro = Array.isArray(localized?.intro)
      ? localized.intro
      : localized?.intro
        ? [localized.intro]
        : doctor.intro;

    return {
      ...doctor,
      name: localized?.name ?? doctor.name,
      title: localized?.title ?? doctor.title,
      intro,
      specialties: localized?.specialties ?? doctor.specialties,
      badge: content.doctors.badge,
    };
  });
}

function replaceMetaContent(template: string, selector: "name" | "property", key: string, content: string): string {
  const pattern = new RegExp(`<meta\\s+${selector}="${key}"\\s+content="[^"]*"\\s*/?>`, "i");
  return template.replace(pattern, `<meta ${selector}="${key}" content="${escapeHtml(content)}" />`);
}

export function buildDoctorsPrerenderedHtml(template: string, pathname: string): string | null {
  const locale = getLocale(pathname);
  if (!locale) return null;

  const content = localeContent[locale];
  const seo = getDoctorsSeoContent(locale);
  const localizedDoctors = getLocalizedDoctors(locale);
  const siteName = SITE_NAME_LOCALIZED[locale] ?? SITE_NAME_LOCALIZED.ko;
  const canonical = `${BASE_URL}${pathname}`;
  const physicianSchemas = buildPhysicianJsonLd(localizedDoctors, siteName, BASE_URL);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: BASE_URL },
      { "@type": "ListItem", position: 2, name: seo.pageTitle, item: canonical },
    ],
  };
  const jsonLd = JSON.stringify([...physicianSchemas, breadcrumbSchema]).replace(/</g, "\\u003c");
  const doctorMarkup = localizedDoctors.map((doctor) => [
    `<article id="crawler-doctor-${escapeHtml(doctor.slug)}">`,
    `<img src="${escapeHtml(doctor.image)}" alt="${escapeHtml(doctor.name)}" loading="lazy" />`,
    `<h2>${escapeHtml(doctor.name)}</h2>`,
    `<p>${escapeHtml(doctor.title)}</p>`,
    ...doctor.intro.slice(0, 1).map((intro) => `<p>${escapeHtml(intro)}</p>`),
    `<h3>${escapeHtml(content.doctors.specialtyTitle)}</h3>`,
    `<ul>${doctor.specialties.map((specialty) => `<li>${escapeHtml(specialty)}</li>`).join("")}</ul>`,
    "</article>",
  ].join("\n")).join("\n");
  const crawlerBody = [
    `<main id="crawler-content" lang="${documentLanguages[locale]}">`,
    `<header><h1>${escapeHtml(seo.pageTitle)}</h1><p>${escapeHtml(seo.pageTagline)}</p></header>`,
    `<section aria-labelledby="crawler-doctors-heading"><h2 id="crawler-doctors-heading">${escapeHtml(content.doctors.title)}</h2>${doctorMarkup}</section>`,
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
    .replace("</head>", `    <script type="application/ld+json" data-prerender="doctors">${jsonLd}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">\n    ${crawlerBody}\n  </div>`);

  return injectPageSeoMeta(rendered, pathname);
}

export function registerDoctorsPrerender(app: Express): void {
  app.get(["/doctors", "/en/doctors", "/ja/doctors", "/zh/doctors", "/zh-tw/doctors"], (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next();

    try {
      const template = loadIndexHtml();
      const html = template ? buildDoctorsPrerenderedHtml(template, req.path) : null;
      if (!html) return next();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", DOCTORS_PRERENDER_CACHE_CONTROL);
      return res.send(html);
    } catch (error) {
      console.error("[DoctorsPrerender] failed:", error instanceof Error ? error.message : error);
      return next();
    }
  });
}
