import { describe, expect, it } from "vitest";
import { toAbsoluteTreatmentImageUrl } from "./treatmentPrerender";

describe("treatment prerender MedicalProcedure image URL", () => {
  it("uses the site-origin HTTPS URL for a relative treatment image", () => {
    expect(toAbsoluteTreatmentImageUrl("/api/storage/ulthera-prime.png")).toBe(
      "https://star-pibu.com/api/storage/ulthera-prime.png",
    );
  });

  it("does not prefix an already absolute HTTPS treatment image", () => {
    const imageUrl = "https://cdn.example.test/thermage.png";
    expect(toAbsoluteTreatmentImageUrl(imageUrl)).toBe(imageUrl);
  });
});
