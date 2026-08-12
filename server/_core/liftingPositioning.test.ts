import { describe, expect, it } from "vitest";
import { LIFTING_ANESTHESIA_PREPARATION, LIFTING_FAQS, LIFTING_HOME_SUMMARY, isPainSensitiveLifting } from "../../shared/liftingPositioning";
import { buildHomePrerenderedHtml } from "./homePrerender";

const template = `<!doctype html><html><head><link rel="canonical" href="https://star-pibu.com" /></head><body><div id="root"></div></body></html>`;

describe("lifting positioning content", () => {
  it("keeps approved direct-care and anesthesia options without an anesthesiologist-residency claim", () => {
    const prohibitedClaim = ["마취과전문의", "상주"].join(" ");
    expect(LIFTING_HOME_SUMMARY.ko).toContain("피부과 전문의가 직접 리프팅 시술");
    expect(LIFTING_ANESTHESIA_PREPARATION.ko).toContain("크림마취·국소마취·수면마취(진정)");
    expect(LIFTING_ANESTHESIA_PREPARATION.ko).not.toContain(prohibitedClaim);
    expect(LIFTING_FAQS.ko).toHaveLength(3);
  });

  it("limits the pain-sensitive lifting rule to Ultherapy and Thermage", () => {
    expect(isPainSensitiveLifting("ulthera")).toBe(true);
    expect(isPainSensitiveLifting("써마지-flx")).toBe(true);
    expect(isPainSensitiveLifting("pico-laser")).toBe(false);
  });

  it("places the positioning summary and FAQ in JavaScript-free home HTML", () => {
    const html = buildHomePrerenderedHtml(template, "/");
    expect(html).toContain("피부과 전문의 직접 리프팅 진료");
    expect(html).toContain("리프팅 시술할 때 수면마취(수면진정)가 가능한가요?");
    expect(html).toContain("FAQPage");
  });
});
