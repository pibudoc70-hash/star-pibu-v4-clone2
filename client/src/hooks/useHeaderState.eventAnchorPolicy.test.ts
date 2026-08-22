import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  resolve(process.cwd(), "client/src/hooks/useHeaderState.ts"),
  "utf8",
);

describe("Header EVENT anchor policy", () => {
  it("uses instant navigation only for desktop EVENT while retaining smooth behavior elsewhere", () => {
    expect(source).toContain('href === "#events"');
    expect(source).toContain('window.matchMedia("(min-width: 768px)").matches');
    expect(source).toContain('behavior: isDesktopEvent ? "instant" : "smooth"');
  });
});
