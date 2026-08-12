/** 공지사항·연구 페이지의 JavaScript 비실행 크롤러용 Article 프리렌더링. */
import type { Express, NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { getNoticeById, getNoticeImages } from "../db/notices";
import type { Notice } from "../../drizzle/schema";

const BASE_URL = "https://star-pibu.com";
const RESEARCH_PUBLISHED = "2026-06-08";
const RESEARCH_MODIFIED = "2026-07-31";
const NOTICE_DEFAULT_OG_IMAGE = `${BASE_URL}/manus-storage/star-pibu-notice-default-og_ecb315e1.png`;
const RESEARCH_DEFAULT_OG_IMAGE = `${BASE_URL}/manus-storage/star-pibu-research-default-og_d1b8b02a.png`;
let cachedHtml: string | null = null;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function loadIndexHtml(): string | null {
  if (cachedHtml) return cachedHtml;
  for (const candidate of [path.resolve(process.cwd(), "dist/public/index.html"), path.resolve(process.cwd(), "client/index.html")]) {
    try { cachedHtml = fs.readFileSync(candidate, "utf8"); return cachedHtml; } catch { /* 다음 후보 */ }
  }
  return null;
}

function toIso(value: Date): string {
  return value.toISOString();
}

function absoluteImage(url: string): string {
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function injectOgImage(template: string, image: string, alt: string): string {
  const escapedImage = escapeHtml(image);
  const escapedAlt = escapeHtml(alt);
  const tags = `<meta data-rh="true" property="og:image" content="${escapedImage}" />\n    <meta data-rh="true" property="og:image:alt" content="${escapedAlt}" />\n    <meta data-rh="true" name="twitter:card" content="summary_large_image" />\n    <meta data-rh="true" name="twitter:image" content="${escapedImage}" />`;
  return template.replace("</head>", `    ${tags}\n  </head>`);
}

export function buildNoticePrerenderedHtml(template: string, notice: Notice, pathname: string, image = NOTICE_DEFAULT_OG_IMAGE): string {
  const url = `${BASE_URL}${pathname}`;
  const article = {
    "@context": "https://schema.org", "@type": "NewsArticle", headline: notice.title,
    description: notice.content.slice(0, 180), datePublished: toIso(notice.createdAt), dateModified: toIso(notice.updatedAt), mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "스타피부과", url: BASE_URL }, publisher: { "@type": "MedicalClinic", name: "스타피부과", url: BASE_URL }, image,
  };
  const jsonLd = JSON.stringify(article).replace(/</g, "\\u003c");
  const body = `<main id="crawler-content"><article><header><h1>${escapeHtml(notice.title)}</h1><time datetime="${toIso(notice.createdAt)}">${notice.createdAt.toISOString().slice(0, 10)}</time></header><figure><img src="${escapeHtml(image)}" alt="${escapeHtml(notice.title)} 대표 이미지" width="1200" height="630" /></figure><div>${escapeHtml(notice.content).replace(/\n/g, "<br />")}</div></article></main>`;
  return injectOgImage(template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeHtml(`${notice.title} | STAR DERMATOLOGY`)}</title>`)
    .replace(/<meta\s+name="description"[^>]*\/?>/i, `<meta data-rh="true" name="description" content="${escapeHtml(notice.content.slice(0, 180))}" />`)
    .replace(/<link\s+rel="canonical"[^>]*\/?>/i, `<link data-rh="true" rel="canonical" href="${url}" />`)
    .replace("</head>", `    <script type="application/ld+json" data-prerender="notice-article">${jsonLd}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`), image, notice.title);
}

export function buildResearchPrerenderedHtml(template: string, pathname: string): string {
  const url = `${BASE_URL}${pathname}`;
  const title = "연구 및 발표 활동 | 스타피부과 조시형 원장";
  const description = "피부과 전문의 조시형 원장의 국제·국내 학술지 연구 및 발표 활동을 소개합니다.";
  const article = {
    "@context": "https://schema.org", "@type": "Article", headline: title, description,
    datePublished: RESEARCH_PUBLISHED, dateModified: RESEARCH_MODIFIED, mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Physician", name: "조시형", alternateName: "Cho Si-hyung", jobTitle: "피부과 전문의 · 의학박사" },
    publisher: { "@type": "MedicalClinic", name: "스타피부과", url: BASE_URL }, image: RESEARCH_DEFAULT_OG_IMAGE,
  };
  const papers = [
    "Tumescent Liposuction with Dermal Curettage for Treatment of Axillary Osmidrosis and Hyperhidrosis — Dermatologic Surgery, 2006",
    "Six Cases of Confluent and Reticulated Papillomatosis Alleviated by Various Antibiotics — Journal of the American Academy of Dermatology, 2001",
    "Syringomas Treated by Intralesional Insulated Needles without Epidermal Damage — Annals of Dermatology, 2010",
  ];
  const body = `<main id="crawler-content"><article><header><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><time datetime="${RESEARCH_PUBLISHED}">${RESEARCH_PUBLISHED}</time></header><figure><img src="${RESEARCH_DEFAULT_OG_IMAGE}" alt="스타피부과 연구 및 발표 활동 대표 이미지" width="1200" height="630" /></figure><section><h2>주요 연구 논문</h2><ul>${papers.map((paper) => `<li>${escapeHtml(paper)}</li>`).join("")}</ul></section></article></main>`;
  return injectOgImage(template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeHtml(title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*\/?>/i, `<meta data-rh="true" name="description" content="${escapeHtml(description)}" />`)
    .replace(/<link\s+rel="canonical"[^>]*\/?>/i, `<link data-rh="true" rel="canonical" href="${url}" />`)
    .replace("</head>", `    <script type="application/ld+json" data-prerender="research-article">${JSON.stringify(article).replace(/</g, "\\u003c")}</script>\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`), RESEARCH_DEFAULT_OG_IMAGE, title);
}

export function registerContentPrerender(app: Express): void {
  app.get(["/research", "/en/research", "/ja/research", "/zh/research", "/zh-tw/research"], (req, res, next) => {
    if (process.env.NODE_ENV !== "production") return next();
    const template = loadIndexHtml();
    if (!template) return next();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.send(buildResearchPrerenderedHtml(template, req.path));
  });

  app.get(["/notice/:id", "/:lang/notice/:id"], async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== "production") return next();
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isSafeInteger(id) || id < 1) return next();
    try {
      const [template, notice] = [loadIndexHtml(), await getNoticeById(id)];
      if (!template || !notice) return next();
      const images = await getNoticeImages(id);
      const image = images[0]?.url ? absoluteImage(images[0].url) : NOTICE_DEFAULT_OG_IMAGE;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.send(buildNoticePrerenderedHtml(template, notice, req.path, image));
    } catch (error) {
      console.error("[ContentPrerender] notice failed:", error instanceof Error ? error.message : error);
      next();
    }
  });
}
