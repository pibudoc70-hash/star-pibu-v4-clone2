import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "client/src/components/events/EventTableMobile.tsx"),
  "utf8",
);

describe("EventTableMobile carousel", () => {
  it("provides a swipeable native scroll-snap carousel with accessible navigation", () => {
    expect(source).toContain("overflow-x-auto snap-x snap-mandatory");
    expect(source).toContain("scrollBy");
    expect(source).toContain('aria-roledescription="carousel"');
    expect(source).toContain("mobile-event-carousel-prev");
    expect(source).toContain("mobile-event-carousel-next");
    expect(source).toContain("mobile-event-carousel-status");
  });

  it("keeps each event detail inline within its own carousel slide", () => {
    expect(source).toContain("event-mobile-carousel__slide");
    expect(source).toContain("EventInlineDetail");
    expect(source).toContain("handleFooterClose");
    expect(source).toContain("scrollIntoView");
  });
});
