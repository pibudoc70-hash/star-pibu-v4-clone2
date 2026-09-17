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
    expect(block).toContain("#main-content.equipment-detail__main > section");
    expect(block).toContain("#main-content .equipment-detail__caution");
    expect(block).toContain(".equipment-detail__info-card");
    expect(block).toContain(".equipment-detail__positioning-faq");
    expect(block).toContain("min-height: 0 !important");
    expect(block).toContain("height: auto !important");
    expect(block).toContain("padding-top: 0 !important");
    expect(block).toContain("padding-bottom: 0 !important");
    expect(block).toContain(".equipment-detail__ultherapy-principle > .space-y-12");
    expect(block).toContain("gap: 1.5rem !important");
    expect(block).toContain("#main-content .equipment-detail__ultherapy-principle .space-y-12 > *");
    expect(block).toContain("flex: none !important");
    expect(block).toContain("ultherapy-timeline-heading");
    expect(block).toContain("padding: 1.25rem !important");
  });

  it("wins over the legacy 80px generic section padding inside the same mobile layer", () => {
    const genericStart = css.indexOf("/* 섹션 패딩 — 프리미엄 무드를 위한 상하 여백 확보 (mobile 80px 기준) */");
    const genericBlock = css.slice(genericStart, css.indexOf("/* supplied mobile promotion", genericStart));

    expect(genericStart).toBeGreaterThan(-1);
    expect(genericBlock).toContain("#main-content.equipment-detail__main > section:not(#contact)");
    expect(genericBlock).toContain("padding-top: 0 !important");
    expect(genericBlock).toContain("padding-bottom: 0 !important");
    expect(genericBlock).toContain("ultherapy-timeline-heading");
  });

  it("does not modify desktop breakpoint rules in the mobile density block", () => {
    const start = css.indexOf("/* ── Equipment detail mobile density: shared detail template only ── */");
    const block = css.slice(start);

    expect(block).not.toContain("min-width:");
    expect(block).not.toContain("@media (min-width");
  });
});
