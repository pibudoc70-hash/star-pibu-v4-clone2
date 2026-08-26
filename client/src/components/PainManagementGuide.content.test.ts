import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PAIN_MANAGEMENT_CONTENT } from "./PainManagementGuide";

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
    expect(guideSource).toContain("필요 시 의료진의 사전 평가 후");
    expect(guideSource).not.toContain("안전이 보장됩니다");
    expect(guideSource).not.toContain("치료 효과가 더 좋");
  });

  it("uses only the confirmed 20-year operating history and monitoring devices", () => {
    expect(guideSource).toContain("수면마취 운영경험 20여년");
    expect(guideSource).toContain("Kohden SpO₂ 모니터");
    expect(guideSource).toContain("혈압측정기");
    expect(guideSource).toContain("환자 상태를 지속적으로 살핍니다");
  });

  it("includes the required pre/post guidance and four patient-focused FAQs", () => {
    expect(guideSource).toContain("건강상태·복용약·알레르기·과거력 확인");
    expect(guideSource).toContain("운전·중요 의사결정 제한");
    expect(guideSource).toContain("모든 시술에 수면진정/수면마취가 필요한가요?");
    expect(guideSource).toContain("연고마취와 주사 진통은 어떻게 결정되나요?");
    expect(guideSource).toContain("모니터링은 어떻게 이뤄지나요?");
    expect(guideSource).toContain("시술 전 무엇을 알려야 하나요?");
  });

  it("keeps the Korean 20-year experience body and each FAQ answer within the requested length", () => {
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceBody.length).toBeGreaterThanOrEqual(150);
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceBody.length).toBeLessThanOrEqual(200);
    expect(PAIN_MANAGEMENT_CONTENT.ko.faqs).toHaveLength(4);
    PAIN_MANAGEMENT_CONTENT.ko.faqs.forEach(({ answer }) => {
      expect(answer.length).toBeGreaterThanOrEqual(70);
      expect(answer.length).toBeLessThanOrEqual(110);
    });
  });

  it("puts the fear-aware core message first and keeps every detail behind native hook-free disclosure", () => {
    expect(guideSource).toContain("heroTitle");
    expect(guideSource).toContain("통증에 대한 두려움까지 고려하는 것이 시술 계획의 중요한 시작입니다");
    expect(guideSource).not.toContain("@/components/ui/accordion");
    expect(guideSource).not.toContain("AccordionCollectionProvider");
    expect(guideSource).toContain("<details");
    expect(guideSource).toContain("<summary");
    expect(guideSource).toContain("pain-stage-");
    expect(guideSource).toContain("pain-experience");
    expect(guideSource).toContain("pain-monitoring");
    expect(guideSource).toContain("pain-guidance");
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
    expect(guideSource).toContain("p-4 sm:p-7");
    expect(guideSource).toContain("text-[1.65rem]");
    expect(guideSource).toContain("text-[11px]");
    expect(guideSource).toContain("text-[11px]");
  });

  it("keeps a clear Korean anesthesia-experience disclosure title with icon after removing the visual summary", () => {
    expect(guideSource).not.toContain('data-testid="pain-management-summary"');
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceHeading).toBe("수면마취 운영경험 20여년");
    expect(guideSource).toContain("Moon");
    expect(guideSource).toContain("data-testid=\"pain-experience\"");
  });

  it("keeps mobile stage details while giving guidance and FAQ headings matching icons", () => {
    expect(PAIN_MANAGEMENT_CONTENT.ko.experienceBody).toContain("20여년 동안");
    expect(guideSource).toContain("FileText");
    expect(guideSource).toContain("CircleHelp");
    expect(guideSource).toContain("data-testid=\"pain-guidance\"");
    expect(guideSource).toContain("data-testid=\"pain-faq\"");
  });

  it("balances the mobile core heading and gives each FAQ question a semantic icon with stronger heading contrast", () => {
    expect(guideSource).toContain("max-w-[18ch] break-keep text-balance");
    expect(guideSource).toContain("leading-[1.42]");
    expect(guideSource).toContain("FAQ_ICONS");
    expect(guideSource).toContain("const Icon = FAQ_ICONS[index]");
    expect(guideSource).toContain("<Icon size={17}");
    expect(guideSource).toContain("text-[var(--color-gold-deep)]");
  });

  it("adds a distinct stage-detail reveal with readable mobile typography", () => {
    expect(guideSource).toContain("pain-management-stage");
    expect(globalCssSource).toContain(".pain-management-stage::details-content");
    expect(globalCssSource).toContain("transform: translateY(-4px)");
    expect(guideSource).toContain("text-[13px] leading-5");
    expect(guideSource).toContain("text-[15px] leading-7");
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

  it("removes the visible three-stage and care-flow summary while keeping staged disclosures", () => {
    expect(guideSource).not.toContain('data-testid="pain-management-summary"');
    expect(guideSource).not.toContain('aria-describedby="pain-management-summary-caption"');
    expect(guideSource).not.toContain("copy.careCheckpoints.map");
    expect(guideSource).toContain("data-testid={`pain-stage-${index + 1}`}");
    expect(guideSource).not.toContain('<p className="mt-3 text-sm font-semibold text-[var(--color-gold-primary)]">{copy.title}</p>');
  });
});
