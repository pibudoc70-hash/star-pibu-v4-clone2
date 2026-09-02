import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PAIN_MANAGEMENT_CONTENT } from "./PainManagementGuide";
import { PAIN_MANAGEMENT_KO_FAQS } from "@/lib/painManagementFaq";

const guideSource = readFileSync(
  resolve(process.cwd(), "client/src/components/PainManagementGuide.tsx"),
  "utf8",
);

const treatmentSectionSource = readFileSync(
  resolve(process.cwd(), "client/src/components/TreatmentsEquipmentSection.tsx"),
  "utf8",
);

const eventSectionSource = readFileSync(
  resolve(process.cwd(), "client/src/components/SpecialEventSection.tsx"),
  "utf8",
);

const globalCssSource = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8",
);

describe("PainManagementGuide content and placement", () => {
  it("keeps the approved three-stage approach and makes sedation conditional on medical evaluation", () => {
    expect(guideSource).toContain("연고마취");
    expect(guideSource).toContain("주사 진통");
    expect(guideSource).toContain("수면진정/수면마취");
    expect(guideSource).toContain("사전 문진과 건강 상태 평가를 거친 후");
    expect(guideSource).toContain("대부분의 시술에서 기본으로 적용됩니다");
    expect(guideSource).not.toContain("안전이 보장됩니다");
    expect(guideSource).not.toContain("치료 효과가 더 좋");
  });

  it("uses the provided 20-year operating-history and monitoring badge copy", () => {
    expect(guideSource).toContain("수면마취 운영 경험 20년 이상");
    expect(guideSource).toContain("장기간 축적된 마취 관리 노하우");
    expect(guideSource).toContain("의료진이 상태를 지속적으로 확인");
    expect(guideSource).toContain("Kohden SpO₂ 모니터");
    expect(guideSource).toContain("혈압측정기");
    expect(guideSource).toContain("환자 상태를 지속적으로 살핍니다");
  });

  it("includes the required pre/post guidance and four user-provided patient-focused FAQs", () => {
    expect(guideSource).toContain("건강상태·복용약·알레르기·과거력 확인");
    expect(guideSource).toContain("운전·중요 의사결정 제한");
    expect(PAIN_MANAGEMENT_KO_FAQS.map(({ question }) => question)).toContain("수면마취는 누구나 받을 수 있나요?");
    expect(PAIN_MANAGEMENT_KO_FAQS.map(({ question }) => question)).toContain("마취 후 회복 시간은 얼마나 걸리나요?");
    expect(PAIN_MANAGEMENT_KO_FAQS.map(({ question }) => question)).toContain("통증이 심하면 시술 중간에 마취를 추가할 수 있나요?");
    expect(PAIN_MANAGEMENT_KO_FAQS.map(({ question }) => question)).toContain("마취 방식은 누가, 어떻게 결정하나요?");
  });

  it("keeps the Korean 20-year experience body and each FAQ answer within the requested length", () => {
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceBody.length).toBeGreaterThanOrEqual(150);
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceBody.length).toBeLessThanOrEqual(200);
    expect(PAIN_MANAGEMENT_CONTENT.ko.faqs).toHaveLength(4);
    PAIN_MANAGEMENT_CONTENT.ko.faqs.forEach(({ answer }) => {
      expect(answer.length).toBeGreaterThanOrEqual(40);
    });
  });

  it("puts the fear-aware core message first and retains native hook-free disclosure for FAQs", () => {
    expect(guideSource).toContain("heroTitle");
    expect(guideSource).toContain("통증에 대한 부담까지 고려하는 것이 시술 계획의 중요한 시작입니다");
    expect(guideSource).not.toContain("@/components/ui/accordion");
    expect(guideSource).not.toContain("AccordionCollectionProvider");
    expect(guideSource).toContain("<details");
    expect(guideSource).toContain("<summary");
    expect(guideSource).toContain("pain-stage-");
    expect(guideSource).not.toContain("pain-experience");
    expect(guideSource).not.toContain("pain-monitoring");
    expect(guideSource).not.toContain("pain-guidance");
    expect(guideSource).toContain("pain-faq");
  });

  it("animates native disclosure content while respecting reduced-motion preferences", () => {
    expect(guideSource).toContain("pain-management-disclosure");
    expect(globalCssSource).toContain(".pain-management-disclosure::details-content");
    expect(globalCssSource).toContain(".pain-management-disclosure[open]::details-content");
    expect(globalCssSource).toContain("interpolate-size: allow-keywords");
    expect(globalCssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps the concise supporting caption without introducing unsupported medical claims", () => {
    expect(guideSource).toContain("pain-management-summary-caption");
    expect(guideSource).toContain("visualCaption");
    expect(PAIN_MANAGEMENT_CONTENT.ko.visualHeading).toContain("3단계");
    expect(PAIN_MANAGEMENT_CONTENT.ko.careCheckpoints).toHaveLength(3);
  });

  it("keeps the approved localized care-checkpoint data for detailed guidance", () => {
    expect(guideSource).toContain("type Checkpoint");
    expect(guideSource).not.toContain("checkpoint-detail-");
    expect(PAIN_MANAGEMENT_CONTENT.ko.careCheckpoints[0].label).toBe("사전 확인");
    expect(PAIN_MANAGEMENT_CONTENT.ko.careCheckpoints[0].detail).toContain("건강상태·복용약·알레르기·과거력");
    expect(PAIN_MANAGEMENT_CONTENT.ko.careCheckpoints[1].detail).toContain("Kohden SpO₂ 모니터");
    expect(PAIN_MANAGEMENT_CONTENT.ko.careCheckpoints[2].detail).toContain("운전·중요 의사결정 제한");
    Object.values(PAIN_MANAGEMENT_CONTENT).forEach(({ careCheckpoints }) => {
      expect(careCheckpoints).toHaveLength(3);
      careCheckpoints.forEach((checkpoint) => expect(checkpoint.detail.length).toBeGreaterThan(30));
    });
  });

  it("uses the concise pain-management label for the category while preserving the three-step guide title", () => {
    expect(guideSource).toContain("categoryLabel");
    expect(PAIN_MANAGEMENT_CONTENT.ko.categoryLabel).toBe("통증관리");
    expect(PAIN_MANAGEMENT_CONTENT.ko.title).toBe("개인별 통증관리 3단계");
    expect(guideSource).toContain("label: copy.categoryLabel");
  });

  it("uses mobile-specific spacing and typography so the remaining guide stays balanced on narrow screens", () => {
    expect(guideSource).toContain("bg-[#fffdfa] p-4 shadow");
    expect(guideSource).toContain("sm:p-8");
    expect(guideSource).toContain("h-24");
    expect(guideSource).toContain("sm:h-40");
    expect(guideSource).toContain("text-[1.45rem]");
    expect(guideSource).toContain("sm:text-3xl");
    expect(guideSource).toContain("text-[11px]");
    expect(guideSource).toContain("text-[11px]");
  });

  it("uses the user-provided Korean sedation-operation experience title", () => {
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceHeading).toBe("수면마취 운영 경험 20년 이상");
    expect(guideSource).toContain("Moon");
    expect(guideSource).toContain("TRUST_BADGE_ICONS");
    expect(guideSource).toContain("data-testid=\"pain-trust-strip\"");
  });

  it("keeps direct mobile stage cards while giving trust badges and FAQ headings matching icons", () => {
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceBody).toContain("20여년 동안");
    expect(guideSource).toContain("FileText");
    expect(guideSource).toContain("CircleHelp");
    expect(guideSource).toContain("회복 및 관리 방법을 상세히 설명");
    expect(guideSource).toContain("data-testid=\"pain-faq\"");
  });

  it("balances the mobile core heading and gives each FAQ question a semantic icon with stronger heading contrast", () => {
    expect(guideSource).toContain("max-w-[21ch] break-keep text-balance");
    expect(guideSource).toContain("leading-[1.34]");
    expect(guideSource).toContain("FAQ_ICONS");
    expect(guideSource).toContain("const Icon = FAQ_ICONS[index]");
    expect(guideSource).toContain("<Icon size={17}");
    expect(guideSource).toContain("text-[var(--color-gold-deep)]");
  });

  it("uses direct premium stage cards while retaining animated native disclosures for supporting guidance", () => {
    expect(guideSource).not.toContain("pain-management-stage");
    expect(guideSource).toContain("rounded-2xl border border-[var(--color-gold-light)] bg-[var(--color-star-navy)]");
    expect(globalCssSource).toContain(".pain-management-disclosure::details-content");
    expect(globalCssSource).toContain("transform: translateY(-4px)");
    expect(guideSource).toContain("min-h-11");
  });

  it("ships complete localized content and is surfaced in both requested homepage sections", () => {
    expect(guideSource).toContain('type PainManagementLang = "ko" | "en" | "ja" | "zh" | "zh-TW"');
    expect(guideSource).toContain('"zh-TW"');
    expect(treatmentSectionSource).toContain("PAIN_MANAGEMENT_CATEGORY_ID");
    expect(treatmentSectionSource).toContain("PainManagementGuide");
    expect(eventSectionSource).toContain("PainManagementGuide");
    expect(eventSectionSource).toContain("<PainManagementGuide lang={lang} />");
    expect(eventSectionSource).not.toContain('mode="summary"');
  });

  it("reintroduces an accessible premium three-stage card flow and trust-badge strip", () => {
    expect(guideSource).toContain('data-testid="pain-management-summary"');
    expect(guideSource).toContain('aria-describedby="pain-management-summary-caption"');
    expect(guideSource).toContain("copy.steps.map");
    expect(guideSource).toContain("md:grid-cols-3");
    expect(guideSource).toContain('data-testid="pain-trust-strip"');
    expect(guideSource).toContain("copy.careCheckpoints.map");
    expect(guideSource).toContain("bg-[var(--color-star-navy)]");
  });
  it("uses four Korean patient-facing pain-management FAQs with a personal-variation notice", () => {
    expect(PAIN_MANAGEMENT_CONTENT.ko.faqs).toHaveLength(4);
    expect(PAIN_MANAGEMENT_CONTENT.ko.faqs.map(({ question }) => question)).toContain("마취 후 회복 시간은 얼마나 걸리나요?");
    expect(PAIN_MANAGEMENT_CONTENT.ko.faqs.map(({ question }) => question)).toContain("통증이 심하면 시술 중간에 마취를 추가할 수 있나요?");
    expect(PAIN_MANAGEMENT_CONTENT.ko.closing).toBe("통증 정도와 마취 방식은 개인의 건강 상태 및 시술 부위에 따라 다르며, 상담을 통해 최종 결정됩니다.");
    expect(guideSource).toContain("data-testid={`pain-faq-item-${index + 1}`}");
  });

  it("uses a deliberate desktop reading measure for the heading and disclosure list", () => {
    expect(guideSource).toContain('className="relative mx-auto w-full max-w-6xl"');
    expect(guideSource).toContain("lg:p-10");
  });

  it("constrains the outer desktop card instead of only its inner reading axis", () => {
    expect(guideSource).toContain("lg:mx-auto lg:max-w-5xl");
  });
});
