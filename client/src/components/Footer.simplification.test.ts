import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(
  resolve(process.cwd(), "client/src/components/Footer.tsx"),
  "utf8",
);

describe("shared footer simplification", () => {
  it("removes the middle quick-link, treatment, and contact columns", () => {
    expect(footerSource).not.toContain("const quickLinks =");
    expect(footerSource).not.toContain("const treatmentItems =");
    expect(footerSource).not.toContain("t.footer.quickMenu");
    expect(footerSource).not.toContain("t.footer.mainTreatments");
    expect(footerSource).not.toContain("t.footer.contactInfo");
    expect(footerSource).not.toContain("CLINIC_TEL");
  });

  it("retains the brand, all four social links, and legal information", () => {
    expect(footerSource).toContain("STAR DERMATOLOGY");
    expect(footerSource).toContain("{t.footer.brandDesc}");
    expect(footerSource).toContain("sns.map");
    expect(footerSource).toContain("{t.footer.bizInfo}");
    expect(footerSource).toContain("{t.footer.nonCovered}");
    expect(footerSource).toContain("{t.footer.privacy}");
    expect(footerSource).toContain("{t.footer.copyright}");
  });

  it("keeps a single border between the compact brand bar and legal bar", () => {
    expect(footerSource).toContain('padding: "32px 1.25rem 24px"');
    expect(footerSource).toContain('borderBottom: "1px solid rgba(255,255,255,0.07)"');
    expect((footerSource.match(/borderBottom: "1px solid rgba\(255,255,255,0\.07\)"/g) ?? []).length).toBe(1);
  });
});
