import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);
const styles = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
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

  it("keeps lazy-fetch accessibility contracts without the removable desktop instruction copy", () => {
    expect(source).toContain('id="events"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain("md:scroll-mt-40");
    expect(source).not.toContain('data-testid="event-vat-notice"');
    expect(source).not.toContain('data-testid="event-compact-hint"');
    expect(source).not.toContain('data-testid="event-compact-context"');
    expect(source).not.toContain("모든 이벤트 금액은 VAT 포함");
    expect(source).not.toContain("hover:scale-105");
  });

  it("keys the selected preview so each desktop event change replays its fade transition", () => {
    expect(source).toContain('className="event-card__preview"');
    expect(source).toContain("key={selectedEvent.id}");
  });

  it("reserves one consistent desktop preview-media frame so event image changes do not move the next section", () => {
    expect(source).toContain("event-card__desktop-preview-frame");
    expect(styles).toContain(".event-card__desktop-preview-frame .event-card__media--lead.event-card__media--natural");
    expect(styles).toContain("aspect-ratio: 3 / 2;");
    expect(styles).toContain(".event-card__desktop-preview-frame .event-card__media--natural .event-card__media-image");
  });

  it("shows the full desktop event selector list by default and keeps the preview aligned while scanning", () => {
    expect(source).toContain("const desktopEvents = allEvents;");
    expect(source).toContain("md:sticky md:top-28 md:self-start");
    expect(source).not.toContain("const [showMore");
    expect(source).not.toContain("hasMoreDesktop");
  });

  it("keeps the preview and first selector on the same shared desktop grid top edge", () => {
    expect(source).toContain('hidden md:grid md:grid-cols-12');
    expect(source).not.toContain('data-testid="event-compact-context"');
  });

  it("keeps the Korean section subtitle on one desktop line while preserving mobile wrapping", () => {
    expect(source).toContain("md:whitespace-nowrap");
    expect(source).toContain("md:hidden");
  });

  it("keeps every locale subtitle on one desktop line and gives the event header more breathing room", () => {
    expect(source).toContain("section-subtitle !mx-0 mt-5 md:whitespace-nowrap");
    expect(source).toContain("Experience premium skin care at Star's exclusive prices.");
    expect(source).toContain("スターの特別価格で、ワンランク上のスキンケアを。");
  });
});
