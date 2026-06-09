/**
 * PR-44 / PR-45 회귀 방지 테스트
 *
 * 이 테스트는 소스코드 정적 검사 방식으로 PR-44에서 확립된 정책을 보호합니다.
 * 기능 변경 없이 정책 회귀를 조기에 감지하는 것이 목적입니다.
 *
 * 검사 대상:
 *   1. ForeignGuide SEO — ko hreflang 없음, x-default = /en/foreign-guide
 *   2. Email template — fallback host = https://star-pibu.com
 *   3. Static sitemap — /foreign-guide alias 없음, localized URLs 있음,
 *                       /privacy 없음, /treatment/* 없음
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const foreignGuideSource = readFileSync(
  path.resolve(root, "client/src/pages/ForeignGuide.tsx"),
  "utf8",
);
const emailSource = readFileSync(
  path.resolve(root, "server/email.ts"),
  "utf8",
);
const sitemapSource = readFileSync(
  path.resolve(root, "client/public/sitemap.xml"),
  "utf8",
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. ForeignGuide SEO 정책
// ─────────────────────────────────────────────────────────────────────────────
describe("ForeignGuide SEO hreflang 정책 (PR-44)", () => {
  it("ko hreflang이 hreflangs 배열에 없어야 한다", () => {
    // hreflangs 배열 블록 추출 (JSX 내 배열 리터럴)
    const hreflangsBlock = foreignGuideSource.match(
      /hreflangs=\{\[([\s\S]*?)\]\}/,
    )?.[1] ?? "";
    // ko hreflang 항목이 없어야 함
    expect(hreflangsBlock).not.toMatch(/hreflang:\s*["']ko["']/);
  });

  it("en hreflang href = https://star-pibu.com/en/foreign-guide", () => {
    expect(foreignGuideSource).toMatch(
      /hreflang:\s*["']en["'][\s\S]*?href:\s*[`"'].*\/en\/foreign-guide[`"']/,
    );
  });

  it("ja hreflang href = https://star-pibu.com/ja/foreign-guide", () => {
    expect(foreignGuideSource).toMatch(
      /hreflang:\s*["']ja["'][\s\S]*?href:\s*[`"'].*\/ja\/foreign-guide[`"']/,
    );
  });

  it("zh hreflang href = https://star-pibu.com/zh/foreign-guide", () => {
    expect(foreignGuideSource).toMatch(
      /hreflang:\s*["']zh["'][\s\S]*?href:\s*[`"'].*\/zh\/foreign-guide[`"']/,
    );
  });

  it("x-default href = https://star-pibu.com/en/foreign-guide", () => {
    expect(foreignGuideSource).toMatch(
      /hreflang:\s*["']x-default["'][\s\S]*?href:\s*[`"'].*\/en\/foreign-guide[`"']/,
    );
  });

  it("buildHreflangs helper를 사용하지 않아야 한다 (custom 배열 직접 전달)", () => {
    // ForeignGuide는 subset locale이므로 buildHreflangs를 사용하면 안 됨
    expect(foreignGuideSource).not.toMatch(/buildHreflangs\s*\(/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Email template fallback host 정책 (PR-44)
// ─────────────────────────────────────────────────────────────────────────────
describe("Email template fallback host 정책 (PR-44)", () => {
  it("getReservationConfirmationEmail의 fallback host = https://star-pibu.com", () => {
    // /my-reservations 링크의 fallback이 non-www이어야 함
    expect(emailSource).toMatch(
      /VITE_OAUTH_PORTAL_URL.*\|\|.*['"](https:\/\/star-pibu\.com)['"].*\/my-reservations/,
    );
  });

  it("getAdminNotificationEmail의 fallback host = https://star-pibu.com", () => {
    // /admin?tab=reservations 링크의 fallback이 non-www이어야 함
    expect(emailSource).toMatch(
      /VITE_OAUTH_PORTAL_URL.*\|\|.*['"](https:\/\/star-pibu\.com)['"].*\/admin\?tab=reservations/,
    );
  });

  it("www fallback(https://www.star-pibu.com)이 없어야 한다 (non-www 정책)", () => {
    // 'https://www.star-pibu.com' (www 포함) 형태가 없어야 함
    const wwwMatches = emailSource.match(
      /['"](https:\/\/www\.star-pibu\.com)['"]\s*/g,
    );
    expect(wwwMatches).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Static sitemap 정책 (PR-43/44)
// ─────────────────────────────────────────────────────────────────────────────
describe("Static sitemap 정책 (PR-43)", () => {
  it("/foreign-guide alias URL이 <loc>에 없어야 한다", () => {
    // <loc>https://star-pibu.com/foreign-guide</loc> 형태가 없어야 함
    expect(sitemapSource).not.toMatch(
      /<loc>https:\/\/star-pibu\.com\/foreign-guide<\/loc>/,
    );
  });

  it("/en/foreign-guide canonical URL이 <loc>에 있어야 한다", () => {
    expect(sitemapSource).toMatch(
      /<loc>https:\/\/star-pibu\.com\/en\/foreign-guide<\/loc>/,
    );
  });

  it("/ja/foreign-guide canonical URL이 <loc>에 있어야 한다", () => {
    expect(sitemapSource).toMatch(
      /<loc>https:\/\/star-pibu\.com\/ja\/foreign-guide<\/loc>/,
    );
  });

  it("/zh/foreign-guide canonical URL이 <loc>에 있어야 한다", () => {
    expect(sitemapSource).toMatch(
      /<loc>https:\/\/star-pibu\.com\/zh\/foreign-guide<\/loc>/,
    );
  });

  it("/privacy URL이 <loc>에 없어야 한다 (noindex 정책)", () => {
    expect(sitemapSource).not.toMatch(
      /<loc>https:\/\/star-pibu\.com\/privacy<\/loc>/,
    );
  });

  it("/treatment/ legacy bridge URL이 <loc>에 없어야 한다", () => {
    // /treatment/ (단수) 경로는 legacy bridge이므로 sitemap에 없어야 함
    // /treatments/ (복수)는 허용
    expect(sitemapSource).not.toMatch(
      /<loc>https:\/\/star-pibu\.com\/treatment\/[^<]+<\/loc>/,
    );
  });

  it("모든 <loc> URL이 https://star-pibu.com으로 시작해야 한다 (non-www 정책)", () => {
    const locMatches = sitemapSource.match(/<loc>(.*?)<\/loc>/g) ?? [];
    expect(locMatches.length).toBeGreaterThan(0);
    for (const loc of locMatches) {
      expect(loc).toMatch(/^<loc>https:\/\/star-pibu\.com/);
    }
  });
});
