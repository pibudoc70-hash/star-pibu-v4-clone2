import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const faq = readFileSync(resolve(process.cwd(), "client/src/components/FAQSection.tsx"), "utf8");

const start = css.indexOf("Homepage mobile FAQ cleanup");
const end = css.indexOf("Homepage mobile doctor-card density", start);
const mobileFaqBlock = start === -1 ? "" : css.slice(start, end);

describe("mobile homepage FAQ cleanup", () => {
  it("preserves one shared FAQ renderer for all seven treatment tabs", () => {
    expect(faq).toContain("faq-tabs-scroll");
    expect(faq).toContain("faq-tab-btn");
    expect(faq).toContain("(faq.items as FAQItem[]).map");
  });

  it("converts only the phone tab row from swipe to centered wrapping", () => {
    expect(mobileFaqBlock).toContain("@media (max-width: 767px)");
    expect(mobileFaqBlock).toContain("flex-wrap: wrap !important;");
    expect(mobileFaqBlock).toContain("justify-content: center !important;");
    expect(mobileFaqBlock).toContain("column-gap: 0.5rem !important;");
    expect(mobileFaqBlock).toContain("row-gap: 0.5625rem !important;");
    expect(mobileFaqBlock).toContain("overflow: visible !important;");
    expect(mobileFaqBlock).toContain("scroll-snap-type: none !important;");
    expect(mobileFaqBlock).toContain("white-space: normal !important;");
  });

  it("removes only mobile FAQ outer chrome and keeps internal dividers", () => {
    expect(mobileFaqBlock).toContain(".faq-accordion-wrap");
    expect(mobileFaqBlock).toContain("border: 0 !important;");
    expect(mobileFaqBlock).toContain("border-radius: 0 !important;");
    expect(mobileFaqBlock).toContain("box-shadow: none !important;");
    expect(mobileFaqBlock).toContain(".faq-accordion-item + .faq-accordion-item");
    expect(mobileFaqBlock).toContain("border-top: 1px solid");
    expect(mobileFaqBlock).toContain(".faq-answer-panel");
    expect(mobileFaqBlock).toContain("background: transparent !important;");
  });
});
