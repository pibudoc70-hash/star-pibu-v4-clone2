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

describe("EventCard desktop media hover", () => {
  it("uses a pointer-hover-only media wrapper without changing event link or mobile behavior", () => {
    expect(cardSource).toContain('event-card__media--hoverable');
    expect(cardSource).not.toContain('hover:scale-105');
    expect(stylesheet).toContain('@media (hover: hover) and (pointer: fine)');
    expect(stylesheet).toContain('.event-card__media--hoverable:hover .event-card__media-image');
    expect(stylesheet).toContain('transform: scale(1.04)');
  });
});
