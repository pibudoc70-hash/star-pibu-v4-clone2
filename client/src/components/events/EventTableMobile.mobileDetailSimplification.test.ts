import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const source = readFileSync(resolve(root, "client/src/components/events/EventTableMobile.tsx"), "utf8");
const css = readFileSync(resolve(root, "client/src/index.css"), "utf8");

describe("EventTableMobile mobile detail simplification", () => {
  it("retains shared detail data while exposing CSS-only mobile hide hooks", () => {
    expect(source).toContain('className="event-mobile-detail__intro mb-1.5"');
    expect(source).toContain('className="event-mobile-detail__pricing-heading px-3.5 py-2 bg-gray-50 border-b border-gray-100"');
    expect(source).toContain('className="event-mobile-detail__image mb-3 block overflow-hidden');
    expect(source).toContain('className="event-mobile-detail__pricing rounded-xl overflow-hidden border border-gray-100"');
    expect(source).toContain('{event.desc && <p className="event-mobile-detail__supplemental');
    expect(source).toContain('{event.content && <p className="event-mobile-detail__supplemental');
  });

  it("hides only the mobile detail intro and pricing heading inside a phone media query", () => {
    const blockStart = css.indexOf("Mobile special-event detail simplification");
    const block = blockStart === -1 ? "" : css.slice(blockStart);

    expect(block).toContain("@media (max-width: 767px)");
    expect(block).toContain("#main-content.home-main .event-mobile-detail__intro,");
    expect(block).toContain("#main-content.home-main .event-mobile-detail__pricing-heading");
    expect(block).toContain("display: none !important;");
    expect(block).not.toContain("@media (min-width");
    expect(block).toContain("margin-bottom: 0.875rem !important;");
  });
});
