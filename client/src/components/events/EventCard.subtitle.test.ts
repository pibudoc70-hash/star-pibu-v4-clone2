import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/components/events/EventCard.tsx"),
  "utf8",
);

describe("EventCard subtitle layout", () => {
  it("does not render an empty subtitle paragraph with vertical margins", () => {
    expect(source).toContain('const subtitle = getLocalizedText(event, "subtitle");');
    expect(source).toContain('{subtitle && <p className="event-card__subtitle leading-relaxed mb-3">');
  });
});
