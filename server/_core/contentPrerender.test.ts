import { describe, expect, it } from "vitest";
import { buildNoticePrerenderedHtml, buildResearchPrerenderedHtml } from "./contentPrerender";

const template = `<!doctype html><html><head><title>스타피부과</title><meta name="description" content="" /><link rel="canonical" href="https://star-pibu.com" /></head><body><div id="root"></div></body></html>`;
const notice = { id: 1, title: "진료 안내", content: "공지 본문입니다.", isPinned: "0" as const, views: 0, targetLang: "all" as const, sourceNoticeId: null, createdAt: new Date("2026-01-01T00:00:00.000Z"), updatedAt: new Date("2026-02-01T00:00:00.000Z") };

describe("contentPrerender", () => {
  it("공지 원본 HTML에 NewsArticle 작성일·수정일·작성자를 주입한다", () => {
    const html = buildNoticePrerenderedHtml(template, notice, "/notice/1");
    expect(html).toContain("NewsArticle");
    expect(html).toContain("datePublished");
    expect(html).toContain("dateModified");
    expect(html).toContain("공지 본문입니다.");
    expect(html).toContain("star-pibu-notice-default-og");
    expect(html).toContain('property="og:image"');
  });

  it("연구 원본 HTML에 Article과 연구 본문을 주입한다", () => {
    const html = buildResearchPrerenderedHtml(template, "/research");
    expect(html).toContain('"@type":"Article"');
    expect(html).toContain("Tumescent Liposuction");
    expect(html).toContain("datePublished");
    expect(html).toContain("star-pibu-research-default-og");
    expect(html).toContain('property="og:image"');
  });
});
