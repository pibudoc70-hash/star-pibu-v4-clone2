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
const eventCardSource = readFileSync(
  resolve(process.cwd(), "client/src/components/events/EventCard.tsx"),
  "utf8",
);

describe("SpecialEventSection desktop showcase layout", () => {
  it("uses a three-column grid of equal-density showcase cards only on desktop", () => {
    expect(source).toContain('data-testid="special-event-desktop-grid"');
    expect(source).toContain("hidden md:grid md:auto-rows-fr md:grid-cols-3 md:gap-6");
    expect(source).toContain('variant="showcase"');
    expect(source).not.toContain("selectedEventId");
    expect(source).not.toContain('variant="selector"');
  });

  it("preserves the frozen mobile event surface", () => {
    expect(source).toContain('<div className="md:hidden">');
    expect(source).toContain("<EventTableMobile");
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

  it("centers only the desktop header while preserving mobile wrapping", () => {
    expect(source).toContain("section-header-block !text-left md:!mx-auto md:!max-w-[720px] md:!text-center");
    expect(source).toContain("section-subtitle body-text !mx-0 mt-5 md:!mx-auto md:whitespace-nowrap");
    expect(source).toContain("md:whitespace-nowrap");
    expect(source).toContain("md:hidden");
  });

  it("can omit only its introduction when a standalone page provides the title", () => {
    expect(source).toContain("showHeader?: boolean");
    expect(source).toContain("showHeader = true");
    expect(source).toContain("{showHeader && <SectionHeader lang={lang} />}");
    expect(source).toContain('const sectionSpacing = showHeader ? "py-20 md:py-28" : "pt-12 pb-20 md:pt-16 md:pb-28"');
    expect(source).toContain('className={`${sectionSpacing} scroll-mt-24 md:scroll-mt-40`}');
  });

  it("keeps every locale subtitle on one desktop line", () => {
    expect(source).toContain("Experience premium skin care at Star's exclusive prices.");
    expect(source).toContain("スターの特別価格で、ワンランク上のスキンケアを。");
  });

  it("uses a native-ratio, edge-to-edge thumbnail and every existing option price for showcase cards", () => {
    expect(eventCardSource).toContain("event-card__showcase-media");
    expect(eventCardSource).toContain('className="block h-auto w-full"');
    expect(eventCardSource).not.toContain("object-contain");
    expect(eventCardSource).not.toContain("bg-white p-0");
    expect(eventCardSource).toContain("event-card__discount-price");
    expect(eventCardSource).toContain("event-card__normal-price line-through");
    expect(eventCardSource).toContain("priceRows.map((row)");
    expect(eventCardSource).toContain("옵션별 가격");
    expect(eventCardSource).not.toContain("event-card__showcase-phone");
    expect(styles).not.toContain(".event-card__showcase-media {");
  });
});
