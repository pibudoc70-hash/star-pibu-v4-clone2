import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");

describe("Directions map provider fallback", () => {
  it("renders the official shared Google Maps embed when the Maps Proxy canvas is unavailable", () => {
    expect(source).toContain('https://www.google.com/maps/embed?pb=');
    expect(source).toContain('<iframe');
    expect(source).toContain('title={t.directions.mapTitle}');
    expect(source).toContain('referrerPolicy="strict-origin-when-cross-origin"');
    expect(source).not.toContain('loading="lazy"');
    expect(source).toMatch(/<iframe[\s\S]*?style=\{\{ height: '100%' \}\}/);
  });
});
