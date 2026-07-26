/**
 * sitemap.ts — 동적 사이트맵 생성 엔드포인트
 *
 * [Step56-A] 동적 sitemap 을 표준 경로 /sitemap.xml 로 승격.
 * robots.txt 가 /sitemap.xml 만 선언하므로 이 경로여야 검색엔진에 전달된다.
 *
 * 포함 항목:
 *   1. 고정 페이지 (홈, 다국어, 시술, 공지, 외국인 안내, 소개 등)
 *   2. equipment3 세부 페이지 (DB에서 동적으로 생성)
 *   3. 공지 상세 페이지 (DB에서 동적으로 생성, 최근 100건)
 *
 * robots.txt 선언: Sitemap: https://star-pibu.com/sitemap.xml
 */

import type { Express, Request, Response } from "express";
import { getEquipment3List } from "./db/equipment3";
import { getRecentNoticeIdsForSitemap } from "./db/notices";
import type { Equipment3Item } from "../drizzle/schema";

const SITE_URL = "https://star-pibu.com";

// [Step56-A] lastmod 하드코딩 제거. 모듈 로드 시 1회만 계산한다
// (요청마다 계산하면 매일 값이 바뀌어 "매일 수정됨"으로 오해된다).
const BUILD_DATE = new Date().toISOString().slice(0, 10);

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
  if (!date) return BUILD_DATE;
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
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: "1.0",
    hreflang: hreflangBlock("/"),
  },
  { loc: `${SITE_URL}/en`, lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/") },
  { loc: `${SITE_URL}/ja`, lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/") },
  { loc: `${SITE_URL}/zh`, lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/") },

  // 시술 상세 페이지 (legacy slug)
  { loc: `${SITE_URL}/treatments/ulthera`,        lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/thermage`,       lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/under-eye-fat`,  lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/pico-laser`,     lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/rosacea`,        lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/ruby-pico-laser`,lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },
  { loc: `${SITE_URL}/treatments/ulthera-classic`,lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8" },

  // 장비 소개 목록
  {
    loc: `${SITE_URL}/equipment3`,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: "0.9",
    hreflang: hreflangBlock("/equipment3"),
  },
  // [Step56-A] 다국어 equipment3 목록
  { loc: `${SITE_URL}/en/equipment3`, lastmod: BUILD_DATE, changefreq: "weekly",   priority: "0.8" },
  { loc: `${SITE_URL}/ja/equipment3`, lastmod: BUILD_DATE, changefreq: "weekly",   priority: "0.8" },
  { loc: `${SITE_URL}/zh/equipment3`, lastmod: BUILD_DATE, changefreq: "weekly",   priority: "0.8" },

  // 공지사항
  {
    loc: `${SITE_URL}/notice`,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: "0.8",
    hreflang: hreflangBlock("/notice"),
  },

  // 외국인 안내
  {
    loc: `${SITE_URL}/en/foreign-guide`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.8",
    hreflang: `    <xhtml:link rel="alternate" hreflang="en"        href="${SITE_URL}/en/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${SITE_URL}/ja/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${SITE_URL}/zh/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/foreign-guide" />`,
  },
  {
    loc: `${SITE_URL}/ja/foreign-guide`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.8",
    hreflang: `    <xhtml:link rel="alternate" hreflang="en"        href="${SITE_URL}/en/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="ja"        href="${SITE_URL}/ja/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh"        href="${SITE_URL}/zh/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/foreign-guide" />`,
  },
  {
    loc: `${SITE_URL}/zh/foreign-guide`,
    lastmod: BUILD_DATE,
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
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.7",
    hreflang: hreflangBlock("/about"),
  },
  // [Step56-A] 다국어 about
  { loc: `${SITE_URL}/en/about`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/ja/about`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7" },
  { loc: `${SITE_URL}/zh/about`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7" },

  // 연구 및 발표
  {
    loc: `${SITE_URL}/research`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.6",
    // [Step56b-B] /research hreflang 4개 언어+x-default 보완 (/en|ja|zh/research HTTP 200 확인)
    hreflang: hreflangBlock("/research"),
  },
  // [Step56-A] 다국어 research (JSON-LD 는 en/ja/zh 이미 대응 완료)
  { loc: `${SITE_URL}/en/research`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE_URL}/ja/research`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6" },
  { loc: `${SITE_URL}/zh/research`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6" },

  // 비급여 진료안내
  {
    loc: `${SITE_URL}/non-covered`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.5",
    hreflang: hreflangBlock("/non-covered"),
  },
  // [Step56b-A] 개인정보처리방침 — 의료기관 필수 페이지. LANG_ROUTES에 { path: "privacy" }로 등록되어 4개 언어 경로가 모두 유효하다.
  {
    loc: `${SITE_URL}/privacy`,
    lastmod: BUILD_DATE,
    changefreq: "yearly",
    priority: "0.3",
    hreflang: hreflangBlock("/privacy"),
  },
  { loc: `${SITE_URL}/en/privacy`, lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2" },
  { loc: `${SITE_URL}/ja/privacy`, lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2" },
  { loc: `${SITE_URL}/zh/privacy`, lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2" },
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
  // [Step56-A] 동적 sitemap 을 표준 경로로 승격.
  // robots.txt 가 /sitemap.xml 만 선언하므로 이 경로여야 검색엔진에 전달된다.
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const [items, noticeRows] = await Promise.all([
        getEquipment3List(),
        getRecentNoticeIdsForSitemap(100),
      ]);

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

      // [Step56-A] 공지 상세 페이지 동적 섹션
      const noticeSection = noticeRows
        .map((n) => {
          const lastmod = toDateStr(n.updatedAt ? new Date(n.updatedAt) : null);
          return `
  <url>
    <loc>${SITE_URL}/notice/${n.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
        })
        .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap.xml — 스타피부과 동적 사이트맵
  빌드일자: ${BUILD_DATE}
  포함: 고정 페이지 + equipment3 세부 페이지 + 공지 상세 페이지 (DB 동적 생성)
  robots.txt: Sitemap: https://star-pibu.com/sitemap.xml
-->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticSection}
  <!-- ── equipment3 세부 페이지 (DB 동적 생성) ── -->${dynamicSection}
  <!-- ── 공지 상세 페이지 (DB 동적 생성, 최근 100건) ── -->${noticeSection}
</urlset>`;

      res.setHeader("Content-Type", "application/xml; charset=UTF-8");
      res.setHeader("Cache-Control", "public, max-age=3600"); // 1시간 캐시
      res.status(200).send(xml);
    } catch (err) {
      console.error("[Sitemap] Generation error:", err);
      res.status(500).send("Sitemap generation failed");
    }
  });

  // [Step56-A] 하위 호환 리다이렉트: 기존 /sitemap-dynamic.xml → /sitemap.xml
  app.get("/sitemap-dynamic.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemap.xml");
  });
}
