import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/hooks/useHeaderState.ts"), "utf8");

describe("Header language navigation", () => {
  it("keeps language changes inside the SPA and retains detail query parameters", () => {
    expect(source).toContain("setLocation(buildLocalizedPath(option.lang));");
    expect(source).not.toContain("window.location.replace(buildLocalizedPath(option.lang));");
    expect(source).toContain("return `${localizedPath}${window.location.search}`;");
  });
});
