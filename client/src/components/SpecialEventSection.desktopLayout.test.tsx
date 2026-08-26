import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);

describe("SpecialEventSection conservative desktop layout", () => {
  it("uses the first event as lead and routes only following events to compact rows", () => {
    expect(source).toContain("const leadEvent = allEvents[0]");
    expect(source).toContain("allEvents.slice(1");
    expect(source).toContain('variant="lead"');
    expect(source).toContain('variant="compact"');
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
});
