/**
 * rss.ts — 네이버·구글 웹마스터 도구용 RSS 2.0 피드
 *
 * 엔드포인트: GET /rss.xml
 * 포함 항목: equipment3 (시술·장비) 활성화된 페이지 전체
 * 규격: RSS 2.0 (https://www.rssboard.org/rss-specification)
 * 네이버 웹마스터 도구 제출 URL: https://star-pibu.com/rss.xml
 */

import type { Express, Request, Response } from "express";
import { getEquipment3List } from "./db/equipment3";
import type { Equipment3Item } from "../drizzle/schema";

const SITE_URL = "https://star-pibu.com";
const SITE_TITLE = "스타피부과 | 부산 서면 피부과 전문의";
const SITE_DESCRIPTION =
  "부산 서면 스타피부과의 시술·장비 안내. 피부과 전문의가 직접 시술합니다.";
const SITE_LANGUAGE = "ko";
const SITE_LOGO = `${SITE_URL}/favicon.ico`;

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

/** RFC-822 날짜 형식 변환 (RSS pubDate 규격) */
function toRfc822(date: Date): string {
  return date.toUTCString();
}

export function registerRssFeed(app: Express): void {
  app.get("/rss.xml", async (_req: Request, res: Response) => {
    try {
      const items = await getEquipment3List();

      const now = new Date();

      // 각 아이템의 RSS <item> 생성
      const rssItems = items
        .map((item: Equipment3Item) => {
          const url = `${SITE_URL}/equipment3/${escapeXml(item.slug)}`;
          const title = escapeXml(
            item.seoTitle ||
              `${item.name} | 부산 서면 스타피부과`
          );
          const description = escapeXml(
            item.seoDescription ||
              `부산 서면 스타피부과의 ${item.name} 시술 안내. 피부과 전문의가 직접 시술합니다.`
          );
          const category = escapeXml(item.category || "시술·장비");
          const imageUrl = item.ogImageUrl || item.imageUrl || "";
          const pubDate = toRfc822(
            item.updatedAt ? new Date(item.updatedAt) : now
          );

          return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <category>${category}</category>${
        imageUrl
          ? `
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0"/>`
          : ""
      }
    </item>`;
        })
        .join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${toRfc822(now)}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_LOGO}</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}</link>
    </image>${rssItems}
  </channel>
</rss>`;

      res.setHeader("Content-Type", "application/rss+xml; charset=UTF-8");
      res.setHeader("Cache-Control", "public, max-age=3600"); // 1시간 캐시
      res.status(200).send(xml);
    } catch (err) {
      console.error("[RSS] Feed generation error:", err);
      res.status(500).send("RSS feed generation failed");
    }
  });
}
