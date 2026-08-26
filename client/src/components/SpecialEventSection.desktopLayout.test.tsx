import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);

describe("SpecialEventSection conservative desktop layout", () => {
  it("uses a hover and focus controlled desktop selection state for the left detail panel", () => {
    expect(source).toContain("selectedEventId");
    expect(source).toContain("setSelectedEventId");
    expect(source).toContain("selectedEvent");
    expect(source).toContain('variant="selector"');
    expect(source).toContain('variant="lead"');
    expect(source).toContain("onPreview={() => setSelectedEventId(event.id)}");
  });

  it("preserves the frozen mobile surface and removes the equal desktop three-card grid", () => {
    expect(source).toContain('<div className="md:hidden">');
    expect(source).toContain("<EventTableMobile");
    expect(source).not.toContain("grid-cols-3");
  });

  it("keeps lazy-fetch accessibility contracts and shows one desktop VAT notice", () => {
    expect(source).toContain('id="events"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain("md:scroll-mt-40");
    expect(source).toContain('data-testid="event-vat-notice"');
    expect(source).not.toContain("hover:scale-105");
  });

  it("adds a localized compact-list comparison hint without changing the mobile table", () => {
    expect(source).toContain("compactHintMap");
    expect(source).toContain('data-testid="event-compact-hint"');
    expect(source).toContain("모든 이벤트 금액은 VAT 포함");
  });

  it("keys the selected preview so each desktop event change replays its fade transition", () => {
    expect(source).toContain('className="event-card__preview"');
    expect(source).toContain("key={selectedEvent.id}");
  });
});
