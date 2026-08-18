import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");

describe("MapView rendered-map detection", () => {
  it("treats the Google Maps vector root as a successful map render", () => {
    expect(source).toMatch(/querySelector\(["']\.gm-style, img, canvas["']\)/);
  });
});
