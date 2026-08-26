import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);

describe("SpecialEventSection desktop lead and compact layout", () => {
  it("uses the first event as a lead card and routes remaining events to compact rows", () => {
    expect(source).toContain('variant="lead"');
    expect(source).toContain('variant="compact"');
    expect(source).toContain("allEvents[0]");
    expect(source).toContain("allEvents.slice(1");
  });

  it("removes the equal three-column desktop grid and retains the frozen mobile surface", () => {
    expect(source).not.toContain("grid-cols-3");
    expect(source).toContain('<div className="md:hidden">');
    expect(source).toContain("<EventTableMobile");
  });

  it("uses a section-level VAT notice once and removes scale hover from the desktop more button", () => {
    expect(source).toContain('data-testid="event-vat-notice"');
    expect(source).not.toContain("hover:scale-105");
  });

  it("keeps the lazy anchor, busy state, and desktop scroll offset contracts", () => {
    expect(source).toContain('id="events"');
    expect(source).toContain('aria-busy="true"');
    expect(source).toContain("md:scroll-mt-40");
  });
});
