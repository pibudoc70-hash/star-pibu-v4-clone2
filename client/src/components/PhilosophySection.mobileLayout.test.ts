import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const source = read("client/src/components/PhilosophySection.tsx");
const css = read("client/src/index.css");
const mobileBlock = css.split("Homepage mobile philosophy layout")[1] ?? "";

describe("PhilosophySection mobile layout", () => {
  it("places a mobile-only consultation image between the shared title and narrative", () => {
    const header = source.indexOf("philosophy-mobile-header");
    const image = source.indexOf("philosophy-mobile-image");
    const body = source.indexOf("philosophy-body");
    const values = source.indexOf("philosophy-values mt-8");

    expect(header).toBeGreaterThan(-1);
    expect(image).toBeGreaterThan(header);
    expect(body).toBeGreaterThan(image);
    expect(values).toBeGreaterThan(body);
    expect(source).toContain("ESTABLISHED");
    expect(source).toContain("2006");
  });

  it("keeps desktop image markup separate and scopes all new layout styles to mobile", () => {
    expect(source).toContain('className="hidden lg:block reveal-right relative overflow-hidden"');
    expect(mobileBlock).toContain("@media (max-width: 767px)");
    expect(mobileBlock).not.toContain("@media (min-width");
    expect(mobileBlock).toContain(".philosophy-mobile-image");
    expect(mobileBlock).toContain(".philosophy-values-grid");
    expect(mobileBlock).toContain("grid-template-columns: 1fr !important;");
    expect(mobileBlock).toContain("word-break: keep-all !important;");
  });
});
