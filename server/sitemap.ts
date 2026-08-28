/**
 * Canonical sitemap index for Search Advisor and general crawlers.
 *
 * Each URL is emitted from the live public route registry or published data only.
 * Parameter, redirect, admin, login, temporary, and non-canonical paths never enter
 * these collections. Static page lastmods come from their own source files rather
 * than sitemap generation time; dynamic entries use their database updatedAt value.
 */

import { statSync } from "node:fs";
import { resolve } from "node:path";
import type { Express, Request, Response } from "express";
import type { Equipment3Item } from "../drizzle/schema";
import { getEquipment3List } from "./db/equipment3";
import { getAllNotices } from "./db/notices";
import { parseEquipmentFaqs } from "../shared/equipmentFaq";

const SITE_URL = "https://star-pibu.com";
const XML_CONTENT_TYPE = "application/xml; charset=UTF-8";
const SITEMAP_CACHE_CONTROL = "public, max-age=3600";
const MAX_URLS_PER_SITEMAP = 50_000;

type SitemapEntry = {
  path: string;
  lastmod: string;
};

type SitemapDocument = {
  path: string;
  entries: SitemapEntry[];
};

export const STATIC_TREATMENT_SLUGS = [
  "ulthera",
  "thermage",
  "under-eye-fat",
  "ulthera-classic",
  "pico-laser",
  "ruby-pico-laser",
  "rosacea",
] as const;

const KOREAN_PAGE_SOURCES: Record<string, string[]> = {
  "/": ["client/src/pages/Home.tsx"],
  "/about": ["client/src/pages/About.tsx"],
  "/doctors": ["client/src/pages/Doctors.tsx"],
  "/directions": ["client/src/pages/Directions.tsx"],
  "/research": ["client/src/pages/Research.tsx"],
  "/non-covered": ["client/src/pages/NonCoveredGuide.tsx"],
  "/privacy": ["client/src/pages/Privacy.tsx"],
  "/notice": ["client/src/pages/Notice.tsx"],
  "/equipment3": ["client/src/pages/Equipment3.tsx"],
};

const GLOBAL_CORE_PATHS = [
  "/about",
  "/doctors",
  "/directions",
  "/research",
  "/non-covered",
  "/privacy",
  "/notice",
  "/equipment3",
] as const;

const GLOBAL_PREFIXES = ["/en", "/ja", "/zh", "/zh-tw"] as const;

type EquipmentLocale = "en" | "ja" | "zh" | "zh-TW";

const EQUIPMENT_LOCALE_FIELDS: Record<EquipmentLocale, {
  prefix: (typeof GLOBAL_PREFIXES)[number];
  name: keyof Equipment3Item;
  description: keyof Equipment3Item;
  faqs: keyof Equipment3Item;
}> = {
  en: { prefix: "/en", name: "nameEn", description: "descEn", faqs: "faqsEn" },
  ja: { prefix: "/ja", name: "nameJa", description: "descJa", faqs: "faqsJa" },
  zh: { prefix: "/zh", name: "nameZh", description: "descZh", faqs: "faqsZh" },
  "zh-TW": { prefix: "/zh-tw", name: "nameZhTw", description: "descZhTw", faqs: "faqsZhTw" },
};

/**
 * Mirrors the project canonical policy: root is the only trailing-slash URL and
 * unsupported/private/query/legacy redirect paths are never sitemap candidates.
 */
export function isSitemapEligiblePath(input: string): boolean {
  if (!input.startsWith("/") || input.includes("?") || input.includes("#")) return false;
  if (input !== "/" && input.endsWith("/")) return false;
  return !(
    input.startsWith("/api/") ||
    input.startsWith("/admin") ||
    input.startsWith("/my-reservations") ||
    input.startsWith("/404") ||
    input.startsWith("/treatment/") ||
    input.startsWith("/sitemap") ||
    input.startsWith("/rss")
  );
}

function toLastmod(value: Date): string {
  return value.toISOString();
}

function sourceLastmod(sourcePaths: string[]): string {
  const dates = sourcePaths.flatMap((sourcePath) => {
    try {
      return [statSync(resolve(process.cwd(), sourcePath)).mtime];
    } catch {
      return [];
    }
  });

  // The source lists above are committed project files. This fallback applies only
  // to an unavailable local source file and is deliberately stable, never "now".
  return toLastmod(dates.sort((a, b) => b.getTime() - a.getTime())[0] ?? new Date("2026-01-01T00:00:00.000Z"));
}

function absoluteUrl(path: string): string {
  return encodeURI(path === "/" ? SITE_URL : `${SITE_URL}${path}`);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dedupeEligibleEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const deduped = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    if (!isSitemapEligiblePath(entry.path)) continue;
    const existing = deduped.get(entry.path);
    if (!existing || new Date(entry.lastmod) > new Date(existing.lastmod)) {
      deduped.set(entry.path, entry);
    }
  }
  return Array.from(deduped.values()).sort((a, b) => a.path.localeCompare(b.path));
}

function renderUrlset(entries: SitemapEntry[]): string {
  const eligibleEntries = dedupeEligibleEntries(entries).slice(0, MAX_URLS_PER_SITEMAP);
  if (eligibleEntries.length === 0) {
    throw new Error("Refusing to emit an empty sitemap document");
  }

  const body = eligibleEntries
    .map(
      ({ path, lastmod }) => `  <url>
    <loc>${escapeXml(absoluteUrl(path))}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

function renderSitemapIndex(documents: SitemapDocument[]): string {
  const body = documents
    .map(({ path, entries }) => {
      const latest = entries.reduce(
        (newest, entry) => (new Date(entry.lastmod) > new Date(newest) ? entry.lastmod : newest),
        entries[0]?.lastmod ?? "2026-01-01T00:00:00.000Z",
      );
      return `  <sitemap>
    <loc>${escapeXml(absoluteUrl(path))}</loc>
    <lastmod>${escapeXml(latest)}</lastmod>
  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export function buildPagesEntries(): SitemapEntry[] {
  return Object.entries(KOREAN_PAGE_SOURCES)
    .filter(([path]) => path !== "/notice" && path !== "/equipment3")
    .map(([path, sourcePaths]) => ({ path, lastmod: sourceLastmod(sourcePaths) }));
}

export function buildTreatmentEntries(): SitemapEntry[] {
  const lastmod = sourceLastmod(["client/src/data/treatments/index.ts"]);
  return STATIC_TREATMENT_SLUGS.map((slug) => ({
    path: `/treatments/${slug}`,
    lastmod,
  }));
}

export function buildEquipmentEntries(items: Equipment3Item[]): SitemapEntry[] {
  return [
    { path: "/equipment3", lastmod: sourceLastmod(KOREAN_PAGE_SOURCES["/equipment3"]) },
    ...items.map((item) => ({
      path: `/equipment3/${item.slug}`,
      lastmod: toLastmod(new Date(item.updatedAt)),
    })),
  ];
}

function hasLocalizedText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** 한국어 fallback 없이 제목·소개·FAQ가 모두 있는 현지화 장비 상세만 색인 후보로 만든다. */
export function buildLocalizedEquipmentEntries(items: Equipment3Item[]): SitemapEntry[] {
  return (Object.keys(EQUIPMENT_LOCALE_FIELDS) as EquipmentLocale[]).flatMap((locale) => {
    const fields = EQUIPMENT_LOCALE_FIELDS[locale];
    return items.flatMap((item) => {
      const faqRaw = item[fields.faqs];
      const hasLocalizedFaqs = typeof faqRaw === "string" && parseEquipmentFaqs(faqRaw).length > 0;
      if (!hasLocalizedText(item[fields.name]) || !hasLocalizedText(item[fields.description]) || !hasLocalizedFaqs) {
        return [];
      }
      return [{ path: `${fields.prefix}/equipment3/${item.slug}`, lastmod: toLastmod(new Date(item.updatedAt)) }];
    });
  });
}

export function buildNoticeEntries(notices: Array<{ id: number; updatedAt: Date }>): SitemapEntry[] {
  return [
    { path: "/notice", lastmod: sourceLastmod(KOREAN_PAGE_SOURCES["/notice"]) },
    ...notices.map((notice) => ({
      path: `/notice/${notice.id}`,
      lastmod: toLastmod(new Date(notice.updatedAt)),
    })),
  ];
}

export function buildGlobalEntries(items: Equipment3Item[] = []): SitemapEntry[] {
  const coreEntries = GLOBAL_PREFIXES.flatMap((prefix) => {
    const landingSource = prefix === "/en"
      ? "client/src/pages/LandingEN.tsx"
      : prefix === "/ja"
        ? "client/src/pages/LandingJA.tsx"
        : prefix === "/zh"
          ? "client/src/pages/LandingZH.tsx"
          : "client/src/pages/LandingZHTW.tsx";
    const localePages = [
      { path: prefix, sources: [landingSource] },
      ...GLOBAL_CORE_PATHS.map((path) => ({ path: `${prefix}${path}`, sources: KOREAN_PAGE_SOURCES[path] })),
      { path: `${prefix}/foreign-guide`, sources: ["client/src/pages/ForeignGuide.tsx"] },
      { path: `${prefix}/price-list`, sources: ["client/src/pages/ForeignPriceList.tsx"] },
    ];
    return localePages.map(({ path, sources }) => ({ path, lastmod: sourceLastmod(sources) }));
  });
  return [...coreEntries, ...buildLocalizedEquipmentEntries(items)];
}

/** Backward-compatible test helper for the static treatment urlset. */
export function buildStaticTreatmentSection(): string {
  return renderUrlset(buildTreatmentEntries());
}

/** Backward-compatible public static-page view without meta-value inflation. */
export const STATIC_URLS = buildPagesEntries().map((entry) => ({
  loc: absoluteUrl(entry.path),
  lastmod: entry.lastmod,
}));

async function buildSitemapDocuments(): Promise<SitemapDocument[]> {
  const [equipment, notices] = await Promise.all([
    getEquipment3List(),
    getAllNotices("ko"),
  ]);

  return [
    { path: "/sitemap-pages.xml", entries: buildPagesEntries() },
    { path: "/sitemap-treatments.xml", entries: buildTreatmentEntries() },
    { path: "/sitemap-equipment.xml", entries: buildEquipmentEntries(equipment) },
    { path: "/sitemap-notice.xml", entries: buildNoticeEntries(notices) },
    { path: "/sitemap-global.xml", entries: buildGlobalEntries(equipment) },
  ];
}

function sendXml(res: Response, xml: string): void {
  res.setHeader("Content-Type", XML_CONTENT_TYPE);
  res.setHeader("Cache-Control", SITEMAP_CACHE_CONTROL);
  res.status(200).send(xml);
}

export function registerSitemapDynamic(app: Express): void {
  app.get("/sitemap.xml", async (_req: Request, res: Response) => {
    try {
      sendXml(res, renderSitemapIndex(await buildSitemapDocuments()));
    } catch (error) {
      console.error("[Sitemap] Index generation error:", error);
      res.status(500).send("Sitemap generation failed");
    }
  });

  const childRoute = (path: SitemapDocument["path"], select: (documents: SitemapDocument[]) => SitemapDocument) => {
    app.get(path, async (_req: Request, res: Response) => {
      try {
        const document = select(await buildSitemapDocuments());
        sendXml(res, renderUrlset(document.entries));
      } catch (error) {
        console.error(`[Sitemap] ${path} generation error:`, error);
        res.status(500).send("Sitemap generation failed");
      }
    });
  };

  childRoute("/sitemap-pages.xml", (documents) => documents[0]!);
  childRoute("/sitemap-treatments.xml", (documents) => documents[1]!);
  childRoute("/sitemap-equipment.xml", (documents) => documents[2]!);
  childRoute("/sitemap-notice.xml", (documents) => documents[3]!);
  childRoute("/sitemap-global.xml", (documents) => documents[4]!);
}
