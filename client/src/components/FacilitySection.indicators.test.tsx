import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FacilitySection from "./FacilitySection";

vi.mock("@/hooks/useScrollReveal", () => ({ useSectionReveal: () => vi.fn() }));
vi.mock("@/components/OptimizedImage", () => ({ default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} /> }));
vi.mock("lucide-react", () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Pause: () => null,
  Play: () => null,
  X: () => null,
}));
vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    t: {
      facility: {
        sectionTitle: "시설안내",
        sectionSubtitle: "클리닉 시설",
        highlights: [],
        images: Array.from({ length: 6 }, (_, index) => ({ label: `시설 ${index + 1}`, desc: "" })),
        zoomHint: "확대",
        prevSlideLabel: "이전",
        nextSlideLabel: "다음",
        pauseAutoplayLabel: "일시정지",
        playAutoplayLabel: "재생",
        goToSlideLabel: "슬라이드 {n}",
        closeLightboxLabel: "닫기",
      },
    },
  }),
}));

describe("FacilitySection carousel indicators", () => {
  it("uses 44px native buttons with an accessible current-slide state", () => {
    render(<FacilitySection />);

    const indicators = Array.from({ length: 6 }, (_, index) =>
      screen.getByRole("button", { name: `슬라이드 ${index + 1}` }),
    );

    expect(indicators[0].getAttribute("aria-current")).toBe("true");
    expect(indicators.slice(1).every((indicator) => !indicator.hasAttribute("aria-current"))).toBe(true);
    for (const indicator of indicators) {
      expect(indicator.className).toContain("w-11");
      expect(indicator.className).toContain("h-11");
      expect(indicator.className).toContain("focus-visible:ring-2");
      expect(indicator.className).toContain("focus-visible:ring-[var(--focus-ring)]");
      expect(indicator.className).not.toContain("focus-visible:ring-[#C9A961]");
    }
  });

  it("keeps the indicator order aligned with the selected slide", () => {
    render(<FacilitySection />);

    fireEvent.click(screen.getByRole("button", { name: "슬라이드 3" }));

    expect(screen.getByRole("button", { name: "슬라이드 3" }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByRole("button", { name: "슬라이드 1" }).hasAttribute("aria-current")).toBe(false);
  });
});
