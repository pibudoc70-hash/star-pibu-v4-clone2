import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PAIN_MANAGEMENT_KO_FAQS } from "./painManagementFaq";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

describe("pain-management FAQ structured data", () => {
  it("adds the dedicated pain-management FAQ collection to the home FAQPage input", () => {
    expect(homeSource).toContain('import { PAIN_MANAGEMENT_KO_FAQS } from "@/lib/painManagementFaq"');
    expect(homeSource).toContain("...PAIN_MANAGEMENT_KO_FAQS,");
  });

  it("uses the approved short Korean question while preserving its existing medical answer", () => {
    const anesthesiaAdjustmentFaq = PAIN_MANAGEMENT_KO_FAQS.find((faq) => faq.question === "시술 중간에 마취를 추가할 수 있나요?");

    expect(anesthesiaAdjustmentFaq?.answer).toBe("시술 중 통증 반응을 지속적으로 확인하며, 필요한 경우 의료진 판단에 따라 마취 방식을 추가하거나 조정할 수 있습니다. 시술 전 상담 시 통증에 대한 우려를 충분히 말씀해 주시면 계획에 반영됩니다.");
    expect(PAIN_MANAGEMENT_KO_FAQS.some((faq) => faq.question === "통증이 심하면 시술 중간에 마취를 추가할 수 있나요?")).toBe(false);
  });
});
