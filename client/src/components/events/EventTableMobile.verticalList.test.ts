import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "client/src/components/events/EventTableMobile.tsx"),
  "utf8",
);

describe("EventTableMobile vertical list", () => {
  it("renders the original stacked event-list surface rather than a carousel", () => {
    expect(source).toContain('data-testid="mobile-event-list" className="bg-white"');
    expect(source).toContain("event-mobile-entry overflow-hidden bg-white transition-colors");
    expect(source).toContain('index > 0 ? "border-t" : ""');
    expect(source).not.toContain("snap-x snap-mandatory");
    expect(source).not.toContain('aria-roledescription="carousel"');
  });

  it("retains per-row inline detail and footer close scroll restoration", () => {
    expect(source).toContain("EventInlineDetail");
    expect(source).toContain("handleFooterClose");
    expect(source).toContain("scrollIntoView");
  });

  it("keeps all events in a unified mobile Special Event list and prioritizes the approved sequence", () => {
    expect(source).toContain("MOBILE_PRIORITY_EVENT_IDS = [300001, 360001, 10560001]");
    expect(source).toContain("orderMobileSpecialEvents");
    expect(source).not.toContain('data-testid="mobile-featured-event"');
    expect(source).not.toMatch(/OFF/i);
  });
});
