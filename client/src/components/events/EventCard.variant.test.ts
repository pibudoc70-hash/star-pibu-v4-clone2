import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cardSource = readFileSync(
  resolve(process.cwd(), "client/src/components/events/EventCard.tsx"),
  "utf8",
);
const stylesheet = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8",
);

describe("EventCard layout variants", () => {
  it("supports lead, compact, and legacy variants while preserving legacy as the default", () => {
    expect(cardSource).toContain('export type EventCardVariant = "lead" | "compact" | "legacy"');
    expect(cardSource).toContain('variant?: EventCardVariant');
    expect(cardSource).toContain('variant = "legacy"');
    expect(cardSource).toContain('variant === "lead"');
    expect(cardSource).toContain('variant === "compact"');
  });

  it("retains the existing hoverable 3:2 media for the lead card and keeps compact rows image-free", () => {
    expect(cardSource).toContain("event-card__media event-card__media--hoverable");
    expect(cardSource).toContain("event-card__media--lead");
    expect(stylesheet).toContain(".event-card__media--lead");
    expect(stylesheet).toContain("aspect-ratio: 3 / 2");
    expect(cardSource).toContain("CompactEventRow");
    expect(cardSource).toContain("event-card__compact-row");
    expect(cardSource).not.toContain("hover:scale-105");
  });

  it("keeps disclosure controls accessible in both desktop variants", () => {
    expect(cardSource).toContain("aria-expanded={isExpanded}");
    expect(cardSource).toContain("aria-controls={`special-event-detail-${event.id}`}");
    expect(cardSource).toContain("aria-controls={`special-event-compact-detail-${event.id}`}");
  });
});
