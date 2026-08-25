import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const desktopSource = readFileSync(resolve(process.cwd(), "client/src/components/doctors/DoctorDesktopLayout.tsx"), "utf8");
const mobileSource = readFileSync(resolve(process.cwd(), "client/src/components/doctors/DoctorMobileLayout.tsx"), "utf8");

const APPROVED_BADGE = "/manus-storage/derm-specialist-badge_6d75896e.webp";
const LEGACY_BADGE = "/api/storage/derm-specialist-badge_9b9bcf96.png";

describe("home medical-team dermatologist-specialist badge", () => {
  it("uses the approved managed WebP in both desktop and mobile layouts", () => {
    expect(desktopSource).toContain(APPROVED_BADGE);
    expect(mobileSource).toContain(APPROVED_BADGE);
    expect(desktopSource).not.toContain(LEGACY_BADGE);
    expect(mobileSource).not.toContain(LEGACY_BADGE);
  });

  it("retains localized badge alt text and existing layout classes", () => {
    expect(desktopSource).toContain('alt={t.doctors.dermBadge.replace("\\n", " ")}');
    expect(mobileSource).toContain('alt={t.doctors.dermBadge.replace("\\n", " ")}');
    expect(desktopSource).toContain("dr-derm-badge-img-desktop");
    expect(mobileSource).toContain("dr-derm-badge-img-mobile");
  });
});
