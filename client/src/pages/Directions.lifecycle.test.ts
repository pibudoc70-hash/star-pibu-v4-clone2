import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Directions lifecycle declaration", () => {
  it("documents the active route rather than the obsolete dormant classification", () => {
    const source = readFileSync(resolve(__dirname, "Directions.tsx"), "utf8");

    expect(source).toContain("[LIVE ROUTED PAGE]");
    expect(source).toContain("App.tsx registers `/directions` and the four locale-prefixed");
    expect(source).not.toContain("[DORMANT PAGE - NOT ROUTED]");
    expect(source).not.toContain("not registered in App.tsx");
  });
});
