/**
 * sitemap.ts — 동적 사이트맵 생성 엔드포인트
 *
 * 포함 항목:
 *   1. 고정 페이지 (홈, 다국어, 시술, 공지, 외국인 안내, 소개 등)
 *   2. equipment3 세부 페이지 (DB에서 동적으로 생성)
 *   3. 공지 상세 페이지 (DB에서 동적으로 생성, 최근 100건)
 *
 * robots.txt 선언: Sitemap: https://star-pibu.com/sitemap.xml
 *
 * 지원 언어: ko, en, ja, zh, zh-TW (5개)
 */

import type { Express, Request, Response } from "express";
import { getEquipment3List } from "./db/equipment3";
import { getRecentNoticeIdsForSitemap } from "./db/notices";
import type { Equipment3Item } from "../drizzle/schema";

const SITE_URL = "https://star-pibu.com";

// 모듈 로드 시 1회만 계산 (요청마다 계산하면 매일 수정됨으로 오해됨)
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

/** 트레일링 슬래시 정규화: /en/ → /en, 단 루트 / 는 유지 */
function normalizeTrailingSlash(url: string): string {
  // 루트 URL(https://star-pibu.com/)은 그대로 유지
  if (url === `${SITE_URL}/`) return url;
  // 그 외 트레일링 슬래시 제거
  return url.replace(/\/+$/, "");
}

/** hreflang 다국어 링크 블록 생성 (5개 언어: ko, en, ja, zh, zh-TW) */
function hreflangBlock(
  koPath: string,
  enPath?: string,
  jaPath?: string,
  zhPath?: string,
  zhTwPath?: string
): string {
  const ko   = normalizeTrailingSlash(`${SITE_URL}${koPath}`);
  const en   = normalizeTrailingSlash(enPath   ? `${SITE_URL}${enPath}`   : `${SITE_URL}/en${koPath}`);
  const ja   = normalizeTrailingSlash(jaPath   ? `${SITE_URL}${jaPath}`   : `${SITE_URL}/ja${koPath}`);
  const zh   = normalizeTrailingSlash(zhPath   ? `${SITE_URL}${zhPath}`   : `${SITE_URL}/zh${koPath}`);
  const zhTw = normalizeTrailingSlash(zhTwPath ? `${SITE_URL}${zhTwPath}` : `${SITE_URL}/zh-tw${koPath}`);
  return `    <xhtml:link rel="alternate" hreflang="ko"    href="${escapeXml(ko)}" />
    <xhtml:link rel="alternate" hreflang="en"    href="${escapeXml(en)}" />
    <xhtml:link rel="alternate" hreflang="ja"    href="${escapeXml(ja)}" />
    <xhtml:link rel="alternate" hreflang="zh"    href="${escapeXml(zh)}" />
    <xhtml:link rel="alternate" hreflang="zh-TW" href="${escapeXml(zhTw)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(ko)}" />`;
}

/** 고정 URL 목록 */
const FOREIGN_GUIDE_HREFLANG = `    <xhtml:link rel="alternate" hreflang="en"    href="${SITE_URL}/en/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="ja"    href="${SITE_URL}/ja/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh"    href="${SITE_URL}/zh/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/zh-tw/foreign-guide" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/foreign-guide" />`;

const FOREIGN_PRICE_LIST_HREFLANG = `    <xhtml:link rel="alternate" hreflang="en"    href="${SITE_URL}/en/price-list" />
    <xhtml:link rel="alternate" hreflang="ja"    href="${SITE_URL}/ja/price-list" />
    <xhtml:link rel="alternate" hreflang="zh"    href="${SITE_URL}/zh/price-list" />
    <xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/zh-tw/price-list" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/price-list" />`;

export const STATIC_URLS = [
  // ── 홈 (다국어) ──────────────────────────────────────────────
  {
    loc: `${SITE_URL}/`,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: "1.0",
    hreflang: hreflangBlock("/"),
  },
  { loc: `${SITE_URL}/en`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/", "/en", "/ja", "/zh", "/zh-tw") },
  { loc: `${SITE_URL}/ja`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/", "/en", "/ja", "/zh", "/zh-tw") },
  { loc: `${SITE_URL}/zh`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/", "/en", "/ja", "/zh", "/zh-tw") },
  { loc: `${SITE_URL}/zh-tw`, lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.9", hreflang: hreflangBlock("/", "/en", "/ja", "/zh", "/zh-tw") },

  // ── 장비·시술 소개 목록 ───────────────────────────────────────
  {
    loc: `${SITE_URL}/equipment3`,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: "0.9",
    hreflang: hreflangBlock("/equipment3"),
  },
  { loc: `${SITE_URL}/en/equipment3`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.8", hreflang: hreflangBlock("/equipment3") },
  { loc: `${SITE_URL}/ja/equipment3`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.8", hreflang: hreflangBlock("/equipment3") },
  { loc: `${SITE_URL}/zh/equipment3`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.8", hreflang: hreflangBlock("/equipment3") },
  { loc: `${SITE_URL}/zh-tw/equipment3`, lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.8", hreflang: hreflangBlock("/equipment3") },

  // ── 공지사항 ─────────────────────────────────────────────────
  {
    loc: `${SITE_URL}/notice`,
    lastmod: BUILD_DATE,
    changefreq: "weekly",
    priority: "0.8",
    hreflang: hreflangBlock("/notice"),
  },
  { loc: `${SITE_URL}/en/notice`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.7", hreflang: hreflangBlock("/notice") },
  { loc: `${SITE_URL}/ja/notice`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.7", hreflang: hreflangBlock("/notice") },
  { loc: `${SITE_URL}/zh/notice`,    lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.7", hreflang: hreflangBlock("/notice") },
  { loc: `${SITE_URL}/zh-tw/notice`, lastmod: BUILD_DATE, changefreq: "weekly", priority: "0.7", hreflang: hreflangBlock("/notice") },

  // ── 외국인 안내 ──────────────────────────────────────────────
  {
    loc: `${SITE_URL}/en/foreign-guide`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.8",
    hreflang: FOREIGN_GUIDE_HREFLANG,
  },
  { loc: `${SITE_URL}/ja/foreign-guide`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8", hreflang: FOREIGN_GUIDE_HREFLANG },
  { loc: `${SITE_URL}/zh/foreign-guide`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8", hreflang: FOREIGN_GUIDE_HREFLANG },
  { loc: `${SITE_URL}/zh-tw/foreign-guide`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.8", hreflang: FOREIGN_GUIDE_HREFLANG },

  // ── 외국인 시술 금액 안내 ─────────────────────────────────────
  { loc: `${SITE_URL}/en/price-list`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: FOREIGN_PRICE_LIST_HREFLANG },
  { loc: `${SITE_URL}/ja/price-list`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: FOREIGN_PRICE_LIST_HREFLANG },
  { loc: `${SITE_URL}/zh/price-list`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: FOREIGN_PRICE_LIST_HREFLANG },
  { loc: `${SITE_URL}/zh-tw/price-list`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: FOREIGN_PRICE_LIST_HREFLANG },

  // ── 병원 소개 ────────────────────────────────────────────────
  {
    loc: `${SITE_URL}/about`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.7",
    hreflang: hreflangBlock("/about"),
  },
  { loc: `${SITE_URL}/en/about`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/about") },
  { loc: `${SITE_URL}/ja/about`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/about") },
  { loc: `${SITE_URL}/zh/about`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/about") },
  { loc: `${SITE_URL}/zh-tw/about`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/about") },

  // ── 연구 및 발표 ─────────────────────────────────────────────
  {
    loc: `${SITE_URL}/research`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.6",
    hreflang: hreflangBlock("/research"),
  },
  { loc: `${SITE_URL}/en/research`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6", hreflang: hreflangBlock("/research") },
  { loc: `${SITE_URL}/ja/research`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6", hreflang: hreflangBlock("/research") },
  { loc: `${SITE_URL}/zh/research`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6", hreflang: hreflangBlock("/research") },
  { loc: `${SITE_URL}/zh-tw/research`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.6", hreflang: hreflangBlock("/research") },

  // ── 비급여 진료안내 ──────────────────────────────────────────
  {
    loc: `${SITE_URL}/non-covered`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.5",
    hreflang: hreflangBlock("/non-covered"),
  },
  { loc: `${SITE_URL}/en/non-covered`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.5", hreflang: hreflangBlock("/non-covered") },
  { loc: `${SITE_URL}/ja/non-covered`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.5", hreflang: hreflangBlock("/non-covered") },
  { loc: `${SITE_URL}/zh/non-covered`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.5", hreflang: hreflangBlock("/non-covered") },
  { loc: `${SITE_URL}/zh-tw/non-covered`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.5", hreflang: hreflangBlock("/non-covered") },

  // ── 개인정보처리방침 ─────────────────────────────────────────
  {
    loc: `${SITE_URL}/privacy`,
    lastmod: BUILD_DATE,
    changefreq: "yearly",
    priority: "0.3",
    hreflang: hreflangBlock("/privacy"),
  },
  { loc: `${SITE_URL}/en/privacy`,    lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2", hreflang: hreflangBlock("/privacy") },
  { loc: `${SITE_URL}/ja/privacy`,    lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2", hreflang: hreflangBlock("/privacy") },
  { loc: `${SITE_URL}/zh/privacy`,    lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2", hreflang: hreflangBlock("/privacy") },
  { loc: `${SITE_URL}/zh-tw/privacy`, lastmod: BUILD_DATE, changefreq: "yearly", priority: "0.2", hreflang: hreflangBlock("/privacy") },

  // ── 의료진 소개 ───────────────────────────────────────────────
  {
    loc: `${SITE_URL}/doctors`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.7",
    hreflang: hreflangBlock("/doctors"),
  },
  { loc: `${SITE_URL}/en/doctors`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/doctors") },
  { loc: `${SITE_URL}/ja/doctors`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/doctors") },
  { loc: `${SITE_URL}/zh/doctors`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/doctors") },
  { loc: `${SITE_URL}/zh-tw/doctors`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/doctors") },

  // ── 찾아오시는 길 ─────────────────────────────────────────────
  {
    loc: `${SITE_URL}/directions`,
    lastmod: BUILD_DATE,
    changefreq: "monthly",
    priority: "0.7",
    hreflang: hreflangBlock("/directions"),
  },
  { loc: `${SITE_URL}/en/directions`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/directions") },
  { loc: `${SITE_URL}/ja/directions`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/directions") },
  { loc: `${SITE_URL}/zh/directions`,    lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/directions") },
  { loc: `${SITE_URL}/zh-tw/directions`, lastmod: BUILD_DATE, changefreq: "monthly", priority: "0.7", hreflang: hreflangBlock("/directions") },
];

/** client/src/data/treatments/index.ts의 정적 시술 상세 라우트와 동기화한다. */
export const STATIC_TREATMENT_SLUGS = [
  "ulthera",
  "thermage",
  "under-eye-fat",
  "ulthera-classic",
  "pico-laser",
  "ruby-pico-laser",
  "rosacea",
] as const;

export function buildStaticTreatmentSection(): string {
  return STATIC_TREATMENT_SLUGS.map((slug) => {
    const koPath = `/treatments/${slug}`;
    return `
  <url>
    <loc>${SITE_URL}${koPath}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
${hreflangBlock(koPath)}
  </url>`;
  }).join("");
}

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
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      const [items, noticeRows] = await Promise.all([
        getEquipment3List(),
        getRecentNoticeIdsForSitemap(100),
      ]);

      // 고정 URL 섹션
      const staticSection = STATIC_URLS.map(buildUrlEntry).join("");
      const staticTreatmentSection = buildStaticTreatmentSection();

      // equipment3 세부 페이지 동적 섹션 (5개 언어 hreflang 포함)
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
    <xhtml:link rel="alternate" hreflang="ko"    href="${SITE_URL}${koPath}" />
    <xhtml:link rel="alternate" hreflang="en"    href="${SITE_URL}/en${koPath}" />
    <xhtml:link rel="alternate" hreflang="ja"    href="${SITE_URL}/ja${koPath}" />
    <xhtml:link rel="alternate" hreflang="zh"    href="${SITE_URL}/zh${koPath}" />
    <xhtml:link rel="alternate" hreflang="zh-TW" href="${SITE_URL}/zh-tw${koPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${koPath}" />
  </url>`;
        })
        .join("");

      // 공지 상세 페이지 동적 섹션
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
  지원 언어: ko, en, ja, zh, zh-TW (5개)
  robots.txt: Sitemap: https://star-pibu.com/sitemap.xml
-->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticSection}
  <!-- ── 정적 시술 상세 페이지 ── -->${staticTreatmentSection}
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

  // 하위 호환 리다이렉트: 기존 /sitemap-dynamic.xml → /sitemap.xml
  app.get("/sitemap-dynamic.xml", (_req: Request, res: Response) => {
    res.redirect(301, "/sitemap.xml");
  });
}
