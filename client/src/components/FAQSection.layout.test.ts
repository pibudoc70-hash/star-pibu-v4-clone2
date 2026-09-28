import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const faqSource = readFileSync(
  resolve(process.cwd(), "client/src/components/FAQSection.tsx"),
  "utf8",
);
const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("homepage FAQ layout", () => {
  it("uses the shared section container without a narrower FAQ width cap", () => {
    expect(faqSource).toContain('<div className="container">');
    expect(faqSource).not.toContain('className="container max-w-4xl"');
  });

  it("removes the FAQ subtitle and keeps a scoped title-to-tabs spacing rule", () => {
    expect(faqSource).not.toContain("{faq.sectionSubtitle}");
    expect(faqSource).toContain("section-header-block mobile-home-section-header faq-section__header reveal-heading");
    expect(cssSource).toContain(".faq-section__header {");
    expect(cssSource).toContain("margin-bottom: 2.5rem;");
    expect(cssSource).toContain("margin-bottom: 1.75rem;");
  });
});
