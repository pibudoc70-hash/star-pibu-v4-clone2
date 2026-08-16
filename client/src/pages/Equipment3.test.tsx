import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import Equipment3 from "./Equipment3";

vi.mock("wouter", () => ({
  useLocation: () => ["/equipment3", vi.fn()],
  useSearch: () => "?tab=skin",
}));
vi.mock("@/lib/trpc", () => ({
  trpc: { equipment3: { list: { useQuery: () => ({ data: [{ id: 1, slug: "test-device", category: "skin", name: "Test Device", desc: "Description", imageUrl: "/test.jpg" }], isLoading: false }) } } },
}));
vi.mock("@/contexts/LangContext", () => ({ useLang: () => ({ lang: "ko", t: { about: { sectionLabels: { treatmentsEquipment: "Equipment" } } } }) }));
vi.mock("@/hooks/useLocalizedText", () => ({ useLocalizedText: () => ({ getText: (...values: Array<string | undefined>) => values.find(Boolean) ?? "" }) }));
vi.mock("@/components/SeoHead", () => ({ default: () => null, buildHreflangs: vi.fn(), buildBreadcrumbJsonLd: vi.fn(), LANG_TO_OG_LOCALE: {}, OG_IMAGE_LOCALIZED: {}, SITE_NAME_LOCALIZED: {}, BASE_URL: "" }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/ContactSection", () => ({ default: () => null }));
vi.mock("@/components/OptimizedImage", () => ({ default: () => <img alt="" /> }));
vi.mock("@/components/treatments/CategoryTabButton", () => ({ default: () => null }));
vi.mock("@/components/treatments/StemCellGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/AcneGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/LiftingGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/UnderEyeGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/ScarGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/PigmentGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/VolumeGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/BotoxGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/RosaceaGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/PsoriasisGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/NailFungusGuide", () => ({ default: () => null }));
vi.mock("@/components/treatments/HyperhidrosisGuide", () => ({ default: () => null }));

describe("Equipment3 navigation cards", () => {
  it("renders each equipment detail card as a native link with its detail path", async () => {
    render(<Equipment3 />);
    const link = await screen.findByRole("link", { name: /Test Device/ });
    expect(link).toHaveAttribute("href", "/equipment3/test-device?tab=skin");
  });
});
