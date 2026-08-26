import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cardSource = readFileSync(
  resolve(process.cwd(), "client/src/components/events/EventCard.tsx"),
  "utf8",
);
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("EventCard desktop variants", () => {
  it("adds explicit lead, compact, and legacy variants without changing the legacy default", () => {
    expect(cardSource).toContain('EventCardVariant = "lead" | "compact" | "legacy"');
    expect(cardSource).toContain('variant = "legacy"');
    expect(cardSource).toContain('variant === "lead"');
    expect(cardSource).toContain('variant === "compact"');
  });

  it("keeps media only in the lead presentation and exposes an accessible compact disclosure", () => {
    expect(cardSource).toContain("event-card__media--hoverable");
    expect(cardSource).toContain("event-card__media--lead");
    expect(cssSource).toContain(".event-card__media--lead");
    expect(cssSource).toContain("aspect-ratio: 3 / 2");
    expect(cardSource).toContain("CompactEventRow");
    expect(cardSource).toContain('aria-expanded={isExpanded}');
    expect(cardSource).toContain('aria-controls={`special-event-compact-detail-${event.id}`}');
  });

  it("does not introduce scale or translate hover effects into the compact flow", () => {
    const compactSource = cardSource.slice(
      cardSource.indexOf("function CompactEventRow"),
      cardSource.indexOf("function LegacyEventCard"),
    );

    expect(compactSource).not.toContain("hover:scale");
    expect(compactSource).not.toContain("hover:-translate");
  });

  it("gives compact rows an explicit disclosure icon and visible keyboard focus treatment", () => {
    const compactSource = cardSource.slice(
      cardSource.indexOf("function CompactEventRow"),
      cardSource.indexOf("function LegacyEventCard"),
    );

    expect(compactSource).toContain("ChevronDown");
    expect(compactSource).toContain("focus-visible:outline-2");
    expect(compactSource).toContain("focus-visible:outline-[var(--color-gold-primary)]");
  });

  it("exposes a non-mobile selector row that previews its event on mouse and keyboard focus", () => {
    expect(cardSource).toContain('"selector"');
    expect(cardSource).toContain("function SelectorEventRow");
    expect(cardSource).toContain("onMouseEnter={onPreview}");
    expect(cardSource).toContain("onFocus={onPreview}");
    expect(cardSource).toContain("aria-pressed={isSelected}");
    expect(cardSource).toContain("id={previewPanelId}");
  });
});
