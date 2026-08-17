import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/Directions.tsx"), "utf8");

describe("Directions map provider fallback", () => {
  it("renders an accessible Google Maps embed when the Maps Proxy canvas is unavailable", () => {
    expect(source).toContain('output=embed');
    expect(source).toContain('<iframe');
    expect(source).toContain('title={t.directions.mapTitle}');
    expect(source).toContain('https://maps.google.com/maps?');
    expect(source).toContain('referrerPolicy="no-referrer-when-downgrade"');
    expect(source).not.toContain('loading="lazy"');
    expect(source).toMatch(/<iframe[\s\S]*?style=\{\{ height: '100%' \}\}/);
  });
});
