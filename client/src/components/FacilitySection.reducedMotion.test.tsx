import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import FacilitySection from "./FacilitySection";

const listeners = new Map<string, Set<() => void>>();
let mobileMatches = true;
let reducedMotionMatches = false;

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

function dispatchMediaChange(query: string) {
  for (const listener of listeners.get(query) ?? []) listener();
}

describe("FacilitySection reduced motion autoplay", () => {
  beforeEach(() => {
    mobileMatches = true;
    reducedMotionMatches = false;
    listeners.clear();
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => ({
      get matches() {
        return query.includes("max-width") ? mobileMatches : reducedMotionMatches;
      },
      media: query,
      addEventListener: (_event: string, listener: () => void) => {
        const queryListeners = listeners.get(query) ?? new Set();
        queryListeners.add(listener);
        listeners.set(query, queryListeners);
      },
      removeEventListener: (_event: string, listener: () => void) => listeners.get(query)?.delete(listener),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("keeps autoplay for a mobile user without reduced-motion preference", () => {
    const intervalSpy = vi.spyOn(globalThis, "setInterval");
    render(<FacilitySection />);

    expect(intervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it("does not create autoplay while reduced motion is preferred and cleans up media listeners", () => {
    reducedMotionMatches = true;
    const intervalSpy = vi.spyOn(globalThis, "setInterval");
    const { unmount } = render(<FacilitySection />);

    expect(intervalSpy).not.toHaveBeenCalled();
    unmount();
    expect([...listeners.values()].every((queryListeners) => queryListeners.size === 0)).toBe(true);
  });

  it("stops autoplay when the reduced-motion preference changes", () => {
    const { container } = render(<FacilitySection />);
    const mobileHeading = container.querySelector(".md\\:hidden h3");
    expect(mobileHeading?.textContent).toBe("시설 1");

    reducedMotionMatches = true;
    act(() => dispatchMediaChange("(prefers-reduced-motion: reduce)"));
    act(() => vi.advanceTimersByTime(5000));

    expect(mobileHeading?.textContent).toBe("시설 1");
  });

  it("does not create mobile carousel autoplay on desktop", () => {
    mobileMatches = false;
    const intervalSpy = vi.spyOn(globalThis, "setInterval");
    render(<FacilitySection />);

    expect(intervalSpy).not.toHaveBeenCalled();
  });
});
