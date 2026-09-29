import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/events/EventPageMobileCards.tsx"), "utf8");

describe("EventPageMobileCards", () => {
  it("uses the shared event query and showcase card renderer without importing the homepage accordion", () => {
    expect(source).toContain("trpc.events.special.useQuery");
    expect(source).toContain("const events = specialEvents as SpecialEvent[];");
    expect(source).toContain('<EventCard event={event} getLocalizedText={getLocalizedText} variant="showcase" />');
    expect(source).not.toContain("EventTableMobile");
    expect(source).not.toContain("useState");
  });

  it("keeps all cards expanded by rendering the showcase image, price, VAT, and option contract", () => {
    const cardSource = readFileSync(resolve(process.cwd(), "client/src/components/events/EventCard.tsx"), "utf8");

    expect(source).toContain('data-testid="event-page-mobile-card-list"');
    expect(source).toContain("event-page-mobile-card-${event.id}");
    expect(cardSource).toContain('variant === "showcase"');
    expect(cardSource).toContain("event-card__showcase-media");
    expect(cardSource).toContain("event-card__vat-badge");
    expect(cardSource).toContain("event-card__showcase-options");
  });
});
