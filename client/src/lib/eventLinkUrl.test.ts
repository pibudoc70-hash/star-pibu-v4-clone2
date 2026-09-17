import { describe, expect, it } from "vitest";
import { getEventLinkHref, isEventLinkUrl, normalizeEventLinkUrl } from "@shared/eventLinkUrl";

describe("event link URL policy", () => {
  it("continues to accept only absolute http(s) URLs for saved values", () => {
    expect(isEventLinkUrl("https://star-pibu.com/notice/390001")).toBe(true);
    expect(isEventLinkUrl("http://example.com/page")).toBe(true);
    expect(isEventLinkUrl("/notice/390001")).toBe(false);
    expect(isEventLinkUrl("javascript:alert(1)")).toBe(false);
  });

  it("preserves a normalized external destination", () => {
    expect(normalizeEventLinkUrl("  https://example.com/event?ref=card#details  ")).toBe("https://example.com/event?ref=card#details");
    expect(getEventLinkHref("https://example.com/event?ref=card#details")).toBe("https://example.com/event?ref=card#details");
  });

  it.each([
    ["https://star-pibu.com/notice/390001", "/notice/390001"],
    ["https://www.star-pibu.com/notice/270001?from=event", "/notice/270001?from=event"],
    ["https://star-pibu.co.kr/notice/300001#price", "/notice/300001#price"],
    ["https://www.star-pibu.co.kr/notice/420001", "/notice/420001"],
  ])("uses a current-origin path for internal saved link %s", (savedUrl, expectedHref) => {
    expect(getEventLinkHref(savedUrl)).toBe(expectedHref);
  });

  it("keeps missing or invalid saved values non-clickable", () => {
    expect(getEventLinkHref("")).toBe("");
    expect(getEventLinkHref("/notice/390001")).toBe("");
    expect(getEventLinkHref("javascript:alert(1)")).toBe("");
  });
});
