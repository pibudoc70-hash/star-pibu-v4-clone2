import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { isEventLinkUrl, normalizeEventLinkUrl } from "../../shared/eventLinkUrl";

const routerSource = readFileSync(resolve(process.cwd(), "server/routers/events.ts"), "utf8");

describe("SPECIAL EVENT connection URL", () => {
  it("accepts only trimmed absolute http(s) URLs", () => {
    expect(normalizeEventLinkUrl("  https://star-pibu.co.kr/equipment3?tab=best ")).toBe("https://star-pibu.co.kr/equipment3?tab=best");
    expect(isEventLinkUrl("https://star-pibu.co.kr/equipment3?tab=best")).toBe(true);
    expect(isEventLinkUrl("http://www.star-pibu.co.kr/event/01.html")).toBe(true);
    expect(isEventLinkUrl("/equipment3?tab=best")).toBe(false);
    expect(isEventLinkUrl("javascript:alert(1)")).toBe(false);
    expect(isEventLinkUrl("ftp://example.com")).toBe(false);
  });

  it("enforces the same validation in both create and update input contracts", () => {
    expect(routerSource).toContain("const eventLinkUrlInput");
    expect(routerSource).toContain("연결 URL은 http:// 또는 https://로 시작해야 합니다.");
    expect(routerSource.match(/linkUrl: eventLinkUrlInput/g)).toHaveLength(2);
  });
});
