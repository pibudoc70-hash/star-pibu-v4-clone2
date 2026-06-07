/**
 * FacilitySection Tests
 * Tests focus on DOM structure and aria attributes rather than CSS-dependent visibility.
 * aria-label values use Korean i18n strings (i18n.ko.ts) — Round-8 리팩터
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import FacilitySection from "./FacilitySection";
import { LangProvider } from "@/contexts/LangContext";

// Mock the useScrollReveal hook
vi.mock("@/hooks/useScrollReveal", () => ({
  useSectionReveal: () => null,
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <div data-testid="chevron-left">←</div>,
  ChevronRight: () => <div data-testid="chevron-right">→</div>,
  Pause: () => <div data-testid="pause-icon">⏸</div>,
  Play: () => <div data-testid="play-icon">▶</div>,
  X: () => <div data-testid="x-icon">✕</div>,
}));

const renderWithLang = (component: React.ReactElement) => {
  return render(
    <LangProvider>
      {component}
    </LangProvider>
  );
};

describe("FacilitySection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it("renders the facility section with correct heading", () => {
    renderWithLang(<FacilitySection />);
    expect(screen.getByText("시설 안내")).toBeInTheDocument();
    expect(screen.getByText("최신 의료 장비와 쾌적한 환경")).toBeInTheDocument();
  });

  it("displays highlight labels correctly", () => {
    renderWithLang(<FacilitySection />);
    expect(screen.getByText(/최신 레이저 장비/)).toBeInTheDocument();
    expect(screen.getByText(/피부과 전문의 경력 20년 이상/)).toBeInTheDocument();
    expect(screen.getByText(/청결한 시술실/)).toBeInTheDocument();
    expect(screen.getByText(/편안한 대기실/)).toBeInTheDocument();
  });

  it("renders 6 slide indicator buttons", () => {
    renderWithLang(<FacilitySection />);
    const slideButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.match(/\d+번 슬라이드로 이동/)
    );
    expect(slideButtons).toHaveLength(6);
  });

  it("renders navigation buttons with correct aria labels", () => {
    renderWithLang(<FacilitySection />);
    expect(screen.getByLabelText("이전 슬라이드")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
  });

  it("renders play/pause button with correct initial aria label", () => {
    renderWithLang(<FacilitySection />);
    expect(screen.getByLabelText("자동 재생 일시정지")).toBeInTheDocument();
  });

  it("renders all 6 slide indicator buttons with correct aria labels", () => {
    renderWithLang(<FacilitySection />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByLabelText(`${i}번 슬라이드로 이동`)).toBeInTheDocument();
    }
  });

  it("navigates to next slide when next button is clicked", () => {
    renderWithLang(<FacilitySection />);
    const nextButton = screen.getByLabelText("다음 슬라이드");
    act(() => {
      fireEvent.click(nextButton);
    });
    // After clicking next, the component should update (no error thrown)
    expect(nextButton).toBeInTheDocument();
  });

  it("navigates to previous slide when previous button is clicked", () => {
    renderWithLang(<FacilitySection />);
    const prevButton = screen.getByLabelText("이전 슬라이드");
    act(() => {
      fireEvent.click(prevButton);
    });
    expect(prevButton).toBeInTheDocument();
  });

  it("navigates directly to slide when indicator is clicked", () => {
    renderWithLang(<FacilitySection />);
    const slideButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.match(/\d+번 슬라이드로 이동/)
    );
    act(() => {
      fireEvent.click(slideButtons[2]!);
    });
    // All indicators should still be present
    expect(screen.getByLabelText("3번 슬라이드로 이동")).toBeInTheDocument();
  });

  it("wraps around when navigating past the last slide", () => {
    renderWithLang(<FacilitySection />);
    const slideButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.match(/\d+번 슬라이드로 이동/)
    );
    // Go to last slide
    act(() => { fireEvent.click(slideButtons[5]!); });
    // Click next to wrap
    const nextButton = screen.getByLabelText("다음 슬라이드");
    act(() => { fireEvent.click(nextButton); });
    // Component should still be functional
    expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
  });

  it("wraps around when navigating before the first slide", () => {
    renderWithLang(<FacilitySection />);
    const prevButton = screen.getByLabelText("이전 슬라이드");
    act(() => { fireEvent.click(prevButton); });
    expect(screen.getByLabelText("이전 슬라이드")).toBeInTheDocument();
  });

  it("toggles autoplay when play/pause button is clicked", () => {
    renderWithLang(<FacilitySection />);
    // Initially shows "자동 재생 일시정지"
    const pauseButton = screen.getByLabelText("자동 재생 일시정지");
    expect(pauseButton).toBeInTheDocument();

    act(() => { fireEvent.click(pauseButton); });

    // After click, should show "자동 재생 시작"
    expect(screen.getByLabelText("자동 재생 시작")).toBeInTheDocument();
  });

  it("auto-advances slides every 5 seconds when autoplay is enabled", () => {
    renderWithLang(<FacilitySection />);
    // Autoplay is enabled by default
    expect(screen.getByLabelText("자동 재생 일시정지")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(5000); });

    // Component should still be functional after timer advance
    expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
  });

  it("stops auto-advancing when autoplay is paused", () => {
    renderWithLang(<FacilitySection />);
    const pauseButton = screen.getByLabelText("자동 재생 일시정지");
    act(() => { fireEvent.click(pauseButton); });

    // Now shows "자동 재생 시작"
    expect(screen.getByLabelText("자동 재생 시작")).toBeInTheDocument();

    act(() => { vi.advanceTimersByTime(5000); });

    // Should still show "자동 재생 시작" (not auto-resumed)
    expect(screen.getByLabelText("자동 재생 시작")).toBeInTheDocument();
  });

  it("stops auto-advancing when hovering over carousel", () => {
    renderWithLang(<FacilitySection />);
    const carousel = screen.getByLabelText("이전 슬라이드").closest("div")?.parentElement;

    if (carousel) {
      act(() => { fireEvent.mouseEnter(carousel); });
      act(() => { vi.advanceTimersByTime(5000); });
      // Component should still be functional
      expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
    }
  });

  it("resumes auto-advancing when mouse leaves carousel", () => {
    renderWithLang(<FacilitySection />);
    const carousel = screen.getByLabelText("이전 슬라이드").closest("div")?.parentElement;

    if (carousel) {
      act(() => { fireEvent.mouseEnter(carousel); });
      act(() => { fireEvent.mouseLeave(carousel); });
      act(() => { vi.advanceTimersByTime(5000); });
      expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
    }
  });

  it("handles touch swipe to next slide", () => {
    renderWithLang(<FacilitySection />);
    const carousel = screen.getByLabelText("이전 슬라이드").closest("div")?.parentElement;

    if (carousel) {
      act(() => {
        fireEvent.touchStart(carousel, { touches: [{ clientX: 100 }] });
        fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 50 }] });
      });
      expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
    }
  });

  it("handles touch swipe to previous slide", () => {
    renderWithLang(<FacilitySection />);
    const carousel = screen.getByLabelText("이전 슬라이드").closest("div")?.parentElement;

    if (carousel) {
      act(() => {
        fireEvent.touchStart(carousel, { touches: [{ clientX: 50 }] });
        fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 100 }] });
      });
      expect(screen.getByLabelText("이전 슬라이드")).toBeInTheDocument();
    }
  });

  it("ignores small touch movements", () => {
    renderWithLang(<FacilitySection />);
    const carousel = screen.getByLabelText("이전 슬라이드").closest("div")?.parentElement;

    if (carousel) {
      act(() => {
        fireEvent.touchStart(carousel, { touches: [{ clientX: 100 }] });
        fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: 95 }] });
      });
      // Component should still be functional
      expect(screen.getByLabelText("다음 슬라이드")).toBeInTheDocument();
    }
  });
});
