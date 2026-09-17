import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("Equipment3Detail mobile density contract", () => {
  it("keeps shared detail-density overrides inside the mobile breakpoint only", () => {
    const start = css.indexOf("/* ── Equipment detail mobile density: shared detail template only ── */");
    const block = css.slice(start);

    expect(start).toBeGreaterThan(-1);
    expect(block).toContain("@media (max-width: 767px)");
    expect(block).toContain(".equipment-detail__main");
    expect(block).toContain(".equipment-detail__primary");
    expect(block).toContain(".equipment-detail__main > section");
    expect(block).toContain(".equipment-detail__caution");
    expect(block).toContain(".equipment-detail__info-card");
    expect(block).toContain(".equipment-detail__positioning-faq");
    expect(block).toContain("min-height: 0 !important");
    expect(block).toContain("height: auto !important");
  });

  it("does not modify desktop breakpoint rules in the mobile density block", () => {
    const start = css.indexOf("/* ── Equipment detail mobile density: shared detail template only ── */");
    const block = css.slice(start);

    expect(block).not.toContain("min-width:");
    expect(block).not.toContain("@media (min-width");
  });
});
