import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const clientRoot = join(process.cwd(), "client", "src");
const publicBookingCtaFiles = [
  "pages/Equipment2Detail.tsx",
  "pages/MyPage.tsx",
  "pages/MyReservations.tsx",
  "pages/TreatmentPage.tsx",
  "pages/TreatmentDetail.tsx",
  "pages/ForeignGuide.tsx",
];
const sharedReserveUrlConsumers = [
  "components/header/DesktopNav.tsx",
  "components/header/MobileMenu.tsx",
];

describe("public external booking CTA policy", () => {
  it("routes each migrated public booking CTA through the shared Naver destination", () => {
    for (const relativePath of publicBookingCtaFiles) {
      const source = readFileSync(join(clientRoot, relativePath), "utf8");
      expect(source).toContain("EXTERNAL_BOOKING_URLS.naver");
      expect(source).not.toContain("getReservationPath(");
    }
  });

  it("keeps desktop and mobile header booking buttons on the shared external URL with safe new-tab attributes", () => {
    for (const relativePath of sharedReserveUrlConsumers) {
      const source = readFileSync(join(clientRoot, relativePath), "utf8");
      expect(source).toContain("href={reserveUrl}");
      expect(source).toContain('target="_blank"');
      expect(source).toContain('rel="noopener noreferrer"');
    }

    const configSource = readFileSync(join(clientRoot, "hooks/useChatConfig.ts"), "utf8");
    expect(configSource).toContain("const reserveUrl = EXTERNAL_BOOKING_URLS.naver");
  });
});
