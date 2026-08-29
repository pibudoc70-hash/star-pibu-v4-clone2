import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(process.cwd());
const readSource = (relativePath: string) => fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("TreatmentPage mobile FAQ answer toggle", () => {
  it("measures real four-line mobile overflow instead of guessing from localized string length", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).toContain('window.matchMedia("(max-width: 639px)")');
    expect(source).toContain("lineHeight * 4");
    expect(source).toContain("answerElement.scrollHeight > collapsedHeight + 1");
    expect(source).not.toContain("item.answer.length >");
  });

  it("preserves complete FAQ answers and connects each localized control with unique ARIA state", () => {
    const source = readSource("client/src/pages/TreatmentPage.tsx");

    expect(source).toContain("function FaqAnswerWithToggle");
    expect(source).toContain("{answer}");
    expect(source).toContain('contentId={`treatment-faq-answer-${slug}-${i}`}');
    expect(source).toContain("aria-controls={contentId}");
    expect(source).toContain("aria-expanded={isExpanded}");
    expect(source).toContain("faqAnswerExpand");
    expect(source).toContain("faqAnswerCollapse");
  });

  it("scopes FAQ clamp, focus feedback, hover feedback, and reduced motion to the mobile answer control", () => {
    const css = readSource("client/src/index.css");

    expect(css).toContain('.treatment-page__faq-answer[data-collapsed="true"]');
    expect(css).toContain("-webkit-line-clamp: 4;");
    expect(css).toContain(".treatment-page__faq-answer-toggle:focus-visible");
    expect(css).toContain(".treatment-page__faq-answer-toggle:hover");
    expect(css).toContain(".treatment-page__faq-answer-toggle svg");
  });
});
