/**
 * PR-44 / PR-45 회귀 방지 테스트
 *
 * 이 테스트는 소스코드 정적 검사 방식으로 PR-44에서 확립된 정책을 보호합니다.
 * 기능 변경 없이 정책 회귀를 조기에 감지하는 것이 목적입니다.
 *
 * 검사 대상:
 *   1. ForeignGuide SEO — ko hreflang 없음, x-default = /en/foreign-guide
 *   2. Email template — fallback host = https://star-pibu.com
 *   3. Sitemap 정책 — /foreign-guide alias 없음, localized URLs 있음,
 *                     /privacy 없음, /treatment/* 없음
 *
 * [Step56-A] 정적 sitemap.xml 삭제 후 동적 server/sitemap.ts 소스를 검사한다.
 * STATIC_URLS 배열에 URL 문자열이 있는지 확인하는 방식으로 동일한 정책을 보호한다.
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
// [Step56-A] 정적 sitemap.xml 삭제 → 동적 sitemap.ts 소스 검사
const sitemapSource = readFileSync(
  path.resolve(root, "server/sitemap.ts"),
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
// 3. Sitemap 정책 (PR-43/44) — [Step56-A] 동적 sitemap.ts 소스 검사
// ─────────────────────────────────────────────────────────────────────────────
describe("Sitemap 정책 (PR-43) — server/sitemap.ts 소스 검사", () => {
  it("/foreign-guide alias URL이 STATIC_URLS에 없어야 한다", () => {
    // /foreign-guide (단수, 비로컬라이즈드) 형태가 없어야 함
    // /en/foreign-guide, /ja/foreign-guide, /zh/foreign-guide 는 허용
    expect(sitemapSource).not.toMatch(
      /`\$\{SITE_URL\}\/foreign-guide`/,
    );
  });

  it("/en/foreign-guide canonical URL이 STATIC_URLS에 있어야 한다", () => {
    expect(sitemapSource).toMatch(/\/en\/foreign-guide/);
  });

  it("/ja/foreign-guide canonical URL이 STATIC_URLS에 있어야 한다", () => {
    expect(sitemapSource).toMatch(/\/ja\/foreign-guide/);
  });

  it("/zh/foreign-guide canonical URL이 STATIC_URLS에 있어야 한다", () => {
    expect(sitemapSource).toMatch(/\/zh\/foreign-guide/);
  });

  it("/privacy URL이 STATIC_URLS에 있어야 한다 ([Step56b-A] 의료기관 필수 페이지)", () => {
    // [Step56b-A] 개인정보처리방침은 의료기관 필수 페이지이므로 sitemap에 포함한다.
    expect(sitemapSource).toMatch(
      /loc:\s*`\$\{SITE_URL\}\/privacy`/,
    );
  });

  it("/treatment/ legacy bridge URL이 STATIC_URLS에 없어야 한다", () => {
    // /treatment/ (단수) 경로는 legacy bridge이므로 sitemap에 없어야 함
    // /treatments/ (복수)는 허용
    expect(sitemapSource).not.toMatch(
      /`\$\{SITE_URL\}\/treatment\/[^`]+`/,
    );
  });

  it("모든 loc URL이 https://star-pibu.com으로 시작해야 한다 (non-www 정책)", () => {
    // SITE_URL 상수가 https://star-pibu.com 이어야 함 (www 없음)
    expect(sitemapSource).toMatch(
      /const SITE_URL\s*=\s*["']https:\/\/star-pibu\.com["']/,
    );
    // www 형태가 없어야 함
    expect(sitemapSource).not.toMatch(/https:\/\/www\.star-pibu\.com/);
  });
});
