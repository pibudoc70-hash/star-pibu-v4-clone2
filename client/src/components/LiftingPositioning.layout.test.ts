import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/LiftingPositioning.tsx"), "utf8");
const globalStyles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("LiftingPositioningSummary EVENT container alignment", () => {
  it("uses the same desktop container width and horizontal padding as SPECIAL EVENT", () => {
    expect(source).toContain('className="container px-5 md:px-6 lg:px-8"');
    expect(source).not.toContain("max-w-5xl");
    expect(globalStyles).toContain("max-width: 1120px;");
  });

  it("preserves the existing 20px mobile introduction inset", () => {
    expect(source).toContain("container px-5 md:px-6 lg:px-8");
  });
});
