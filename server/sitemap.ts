/**
 * sitemap.ts — 동적 사이트맵 생성 엔드포인트
 *
 * 엔드포인트: GET /sitemap-dynamic.xml
 * 포함 항목:
 *   1. 고정 페이지 (홈, 다국어, 시술, 공지, 외국인 안내, 소개 등)
 *   2. equipment3 세부 페이지 (DB에서 동적으로 생성)
 *
 * 네이버/구글 웹마스터 도구 제출 URL: https://star-pibu.com/sitemap-dynamic.xml
 *
 * NOTE: 기존 정적 /sitemap.xml (client/public/sitemap.xml)은 그대로 유지됩니다.
 *       이 동적 사이트맵은 equipment3 세부 페이지를 포함한 완전한 버전입니다.
 */

import type { Express, Request, Response } from "express";
import { getEquipment3List } from "./db/equipment3";
import type { Equipment3Item } from "../drizzle/schema";

const SITE_URL = "https://star-pibu.com";

/** XML 특수문자 이스케이프 */
function escapeXml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** YYYY-MM-DD 형식 날짜 반환 */
function toDateStr(date: Date | null | undefined): string {
  if (!date) return new Date().toISOString().split("T")[0];
  return new Date(date).toISOString().split("T")[0];
}

/** hreflang 다국어 링크 블록 생성 */
function hreflangBlock(koPath: string, enPath?: string, jaPath?: string, zhPath?: string): string {
  const ko = `${SITE_URL}${koPath}`;
  const en = enPath ? `${SITE_URL}${enPath}` : `${SITE_URL}/en${koPath}`;
  const ja = jaPath ? `${SITE_URL}${jaPath}` : `${SITE_URL}/ja${koPath}`;
  const zh = zhPath ? `${SITE_URL}${zhPath}` : `${SITE_URL}/zh${koPath}`;
  return `    <xhtml:link rel="alternate" hreflang="ko"        href="${escapeXml(ko)}" />
    <xhtml:link rel="alternate" hreflang="en"        href="${escapeXml(en)}" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${escapeXml(ja)}" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${escapeXml(zh)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(ko)}" />`;
}

/** 고정 URL 목록 */
const STATIC_URLS = [
  // 홈 (다국어)
  {
    loc: `${SITE_URL}/`,
    lastmod: "2026-06-23",
    changefreq: "weekly",
    priority: "1.0",
    hreflang: hreflangBlock("/"),
  },
  { loc: `${SITE_URL}/en`, lastmod: "2026-06-23", changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/") },
  { loc: `${SITE_URL}/ja`, lastmod: "2026-06-23", changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/") },
  { loc: `${SITE_URL}/zh`, lastmod: "2026-06-23", changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/") },

  // 시술 상세 페이지 (legacy slug)
  { loc: `${SITE_URL}/treatments/ulthera`,        lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/thermage`,       lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/under-eye-fat`,  lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/pico-laser`,     lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/rosacea`,        lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/ruby-pico-laser`,lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/ulthera-classic`,lastmod: "2026-06-23", changefreq: "monthly", priority: "0.8" },

  // 장비 소개 목록
  {
    loc: `${SITE_URL}/equipment3`,
    lastmod: "2026-06-23",
    changefreq: "weekly",
    priority: "0.9",
    hreflang: hreflangBlock("/equipment3"),
  },

  // 공지사항
  {
    loc: `${SITE_URL}/notice`,
    lastmod: "2026-06-23",
    changefreq: "weekly",
    priority: "0.8",
    hreflang: hreflangBlock("/notice"),
  },

  // 외국인 안내
  {
    loc: `${SITE_URL}/en/foreign-guide`,
    lastmod: "2026-06-23",
    changefreq: "monthly",
    priority: "0.8",
    hreflang: `    <xhtml:link rel="alternate" hreflang="en"        href="${SITE_URL}/en/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${SITE_URL}/ja/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${SITE_URL}/zh/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/foreign-guide" />`,
  },
  {
    loc: `${SITE_URL}/ja/foreign-guide`,
    lastmod: "2026-06-23",
    changefreq: "monthly",
    priority: "0.8",
    hreflang: `    <xhtml:link rel="alternate" hreflang="en"        href="${SITE_URL}/en/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${SITE_URL}/ja/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${SITE_URL}/zh/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/foreign-guide" />`,
  },
  {
    loc: `${SITE_URL}/zh/foreign-guide`,
    lastmod: "2026-06-23",
    changefreq: "monthly",
    priority: "0.8",
    hreflang: `    <xhtml:link rel="alternate" hreflang="en"        href="${SITE_URL}/en/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${SITE_URL}/ja/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${SITE_URL}/zh/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/foreign-guide" />`,
  },

  // 병원 소개
  {
    loc: `${SITE_URL}/about`,
    lastmod: "2026-06-23",
    changefreq: "monthly",
    priority: "0.7",
    hreflang: hreflangBlock("/about"),
  },

  // 연구 및 발표
  {
    loc: `${SITE_URL}/research`,
    lastmod: "2026-06-23",
    changefreq: "monthly",
    priority: "0.6",
    hreflang: `    <xhtml:link rel="alternate" hreflang="ko"        href="${SITE_URL}/research" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/research" />`,
  },

  // 비급여 진료안내
  {
    loc: `${SITE_URL}/non-covered`,
    lastmod: "2026-06-23",
    changefreq: "monthly",
    priority: "0.5",
    hreflang: hreflangBlock("/non-covered"),
  },
];

function buildUrlEntry(entry: {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  hreflang?: string;
}): string {
  return `
  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${
      entry.hreflang
        ? `\n${entry.hreflang}`
        : ""
    }
  </url>`;
}

export function registerSitemapDynamic(app: Express): void {
  app.get("/sitemap-dynamic.xml", async (_req: Request, res: Response) => {
    try {
      const items = await getEquipment3List();
      const today = toDateStr(new Date());

      // 고정 URL 섹션
      const staticSection = STATIC_URLS.map(buildUrlEntry).join("");

      // equipment3 세부 페이지 동적 섹션
      const dynamicSection = items
        .map((item: Equipment3Item) => {
          const slug = escapeXml(item.slug);
          const lastmod = toDateStr(item.updatedAt ? new Date(item.updatedAt) : null);
          const koPath = `/equipment3/${slug}`;
          return `
  <!-- ${escapeXml(item.name)} -->
  <url>
    <loc>${SITE_URL}${koPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ko"        href="${SITE_URL}${koPath}" />
    <xhtml:link rel="alternate" hreflang="en"        href="${SITE_URL}/en${koPath}" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${SITE_URL}/ja${koPath}" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${SITE_URL}/zh${koPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${koPath}" />
  </url>`;
        })
        .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap-dynamic.xml — 스타피부과 동적 사이트맵
  생성일시: ${today}
  포함: 고정 페이지 + equipment3 세부 페이지 (DB 동적 생성)
  네이버/구글 웹마스터 도구 제출 URL: https://star-pibu.com/sitemap-dynamic.xml
-->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticSection}
  <!-- ── equipment3 세부 페이지 (DB 동적 생성) ── -->${dynamicSection}
</urlset>`;

      res.setHeader("Content-Type", "application/xml; charset=UTF-8");
      res.setHeader("Cache-Control", "public, max-age=3600"); // 1시간 캐시
      res.status(200).send(xml);
    } catch (err) {
      console.error("[Sitemap] Generation error:", err);
      res.status(500).send("Sitemap generation failed");
    }
  });
}
