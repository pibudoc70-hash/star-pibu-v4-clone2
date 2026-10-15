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
];

describe("public external booking CTA policy", () => {
  it("routes each migrated public booking CTA through the shared Naver destination", () => {
    for (const relativePath of publicBookingCtaFiles) {
      const source = readFileSync(join(clientRoot, relativePath), "utf8");
      expect(source).toContain("EXTERNAL_BOOKING_URLS.naver");
      expect(source).not.toContain("getReservationPath(");
    }
  });

  it("keeps the desktop header booking button on the shared external URL with safe new-tab attributes", () => {
    for (const relativePath of sharedReserveUrlConsumers) {
      const source = readFileSync(join(clientRoot, relativePath), "utf8");
      expect(source).toContain("href={reserveUrl}");
      expect(source).toContain('target="_blank"');
      expect(source).toContain('rel="noopener noreferrer"');
    }

    const configSource = readFileSync(join(clientRoot, "hooks/useChatConfig.ts"), "utf8");
    expect(configSource).toContain("const reserveUrl = EXTERNAL_BOOKING_URLS.naver");
  });

  it("routes English consultation CTAs to the requested WhatsApp destination", () => {
    const configSource = readFileSync(join(clientRoot, "hooks/useChatConfig.ts"), "utf8");
    const englishTranslations = readFileSync(join(clientRoot, "lib/i18n.en.ts"), "utf8");

    expect(configSource).toContain('englishWhatsapp: "https://api.whatsapp.com/send/?phone=%2B821045930090&text&type=phone_number&app_absent=0"');
    expect(configSource).toContain('lang === "en" ? CHAT_URLS.englishWhatsapp : CHAT_URLS.kakao');
    expect(englishTranslations).toContain('cta_kakao: "WhatsApp"');
    expect(englishTranslations).toContain('kakaoAria: "WhatsApp Consultation"');
  });

  it("uses the Chinese-style gold Naver Booking treatment only for English CTAs", () => {
    const headerSource = readFileSync(join(clientRoot, "components/header/DesktopNav.tsx"), "utf8");
    const heroSource = readFileSync(join(clientRoot, "components/hero/HeroActions.tsx"), "utf8");
    const floatingSource = readFileSync(join(clientRoot, "components/FloatingCTA.tsx"), "utf8");

    expect(headerSource).toContain('background: lang === "en" ? "var(--color-gold-primary)" : "#03C75A"');
    expect(heroSource).toContain('isZH || lang === "en" ? "hero-btn-reserve-zh" : "hero-btn-reserve"');
    expect(floatingSource).toContain('const englishReserveStyle = lang === "en"');
  });
});
