import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const clientSource = readFileSync(resolve(process.cwd(), "client/src/pages/TreatmentPage.tsx"), "utf8");
const prerenderSource = readFileSync(resolve(process.cwd(), "server/_core/treatmentPrerender.ts"), "utf8");

describe("Treatment MedicalProcedure JSON-LD parity", () => {
  it("uses an organization @id reference instead of duplicating provider facts", () => {
    expect(clientSource).toContain('"provider": { "@id": `${CLINIC_INFO.url}/#organization` }');
    expect(prerenderSource).toContain('provider: { "@id": `${BASE_URL}/#organization` }');
    expect(clientSource).not.toContain('"provider": {\n      "@type": "MedicalBusiness"');
  });

  it("keeps only localized recovery and caution in optional followup fields", () => {
    const expression = '[recovery, caution].filter(Boolean).join(" ") || undefined';
    expect(clientSource).toContain(`"followup": ${expression}`);
    expect(prerenderSource).toContain(`followup: ${expression}`);
    expect(clientSource).not.toContain("회복 기간:");
    expect(prerenderSource).not.toContain("회복 기간:");
  });

  it("omits unsupported status and makes client root-relative images crawler-resolvable", () => {
    expect(clientSource).not.toContain('"status": "https://schema.org/ActiveActionStatus"');
    expect(prerenderSource).not.toContain('status: "https://schema.org/ActiveActionStatus"');
    expect(clientSource).toContain('t.image.startsWith("/") ? new URL(t.image, BASE_URL).toString() : t.image');
    expect(prerenderSource).toContain("toAbsoluteTreatmentImageUrl(t.image)");
  });
});
