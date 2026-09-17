import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/admin/AdminEventsTab.tsx"), "utf8");

describe("AdminEventsTab connection URL editor", () => {
  it("provides an editable URL field and validates it before save", () => {
    expect(source).toContain('id="event-link-url"');
    expect(source).toContain("연결 URL");
    expect(source).toContain("isEventLinkUrl(linkUrl)");
    expect(source).toContain("연결 URL은 http:// 또는 https://로 시작해야 합니다.");
  });

  it("restores and sends the link URL for both create and update", () => {
    expect(source).toContain("linkUrl: \"\"");
    expect(source).toContain("linkUrl: event.linkUrl || \"\"");
    expect(source.match(/linkUrl,/g)?.length).toBeGreaterThanOrEqual(2);
  });
});
