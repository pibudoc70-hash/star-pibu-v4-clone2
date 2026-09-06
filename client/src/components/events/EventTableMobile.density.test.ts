import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/events/EventTableMobile.tsx"),
  "utf8",
);

describe("EventTableMobile density contract", () => {
  it("keeps compact mobile event rows while preserving an accessible touch-target floor", () => {
    expect(source).toContain('isPriority ? "!h-auto !min-h-[5rem] !py-4" : "!h-auto !min-h-[4.75rem] !py-3.5"');
    expect(source).not.toContain('!min-h-[5.5rem] !py-5');
    expect(source).toContain("aria-expanded={isOpen}");
    expect(source).toContain("aria-controls={`mobile-event-detail-${event.id}`}");
  });
});
