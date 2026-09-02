import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "client/src/components/events/EventTableMobile.tsx"),
  "utf8",
);

describe("EventTableMobile vertical list", () => {
  it("renders the original stacked event-list surface rather than a carousel", () => {
    expect(source).toContain('data-testid="mobile-event-list" className="space-y-2.5 p-2.5"');
    expect(source).toContain('className="event-mobile-entry overflow-hidden rounded-xl border bg-white"');
    expect(source).not.toContain("snap-x snap-mandatory");
    expect(source).not.toContain('aria-roledescription="carousel"');
  });

  it("retains per-row inline detail and footer close scroll restoration", () => {
    expect(source).toContain("EventInlineDetail");
    expect(source).toContain("handleFooterClose");
    expect(source).toContain("scrollIntoView");
  });

  it("uses the existing isFeatured field to make only the sortOrder-first featured event a mobile lead card", () => {
    expect(source).toContain('event.isFeatured === "1"');
    expect(source).toContain("left.sortOrder - right.sortOrder || left.id - right.id");
    expect(source).toContain('data-testid="mobile-featured-event"');
    expect(source).not.toMatch(/OFF/i);
  });
});
