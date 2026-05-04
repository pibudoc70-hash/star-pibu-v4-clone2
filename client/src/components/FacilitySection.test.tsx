import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FacilitySection from "./FacilitySection";
import { LangProvider } from "@/contexts/LangContext";

// Mock the useScrollReveal hook
vi.mock("@/hooks/useScrollReveal", () => ({
  useSectionReveal: () => ({
    ref: { current: null },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  ChevronLeft: () => <div data-testid="chevron-left">←</div>,
  ChevronRight: () => <div data-testid="chevron-right">→</div>,
  Pause: () => <div data-testid="pause-icon">⏸</div>,
  Play: () => <div data-testid="play-icon">▶</div>,
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

  it("displays all 4 highlights", () => {
    renderWithLang(<FacilitySection />);
    
    expect(screen.getByText("50+")).toBeInTheDocument();
    expect(screen.getByText("3인")).toBeInTheDocument();
    expect(screen.getByText("2·4층")).toBeInTheDocument();
    expect(screen.getByText("전체")).toBeInTheDocument();
  });

  it("displays highlight labels correctly", () => {
    renderWithLang(<FacilitySection />);
    
    expect(screen.getByText("최신 레이저 장비")).toBeInTheDocument();
    expect(screen.getByText("피부과 전문의 경력 20년 이상")).toBeInTheDocument();
    expect(screen.getByText("청결한 시술실")).toBeInTheDocument();
    expect(screen.getByText("편안한 대기실")).toBeInTheDocument();
  });

  it("renders carousel with 6 slides", () => {
    renderWithLang(<FacilitySection />);
    
    // Check for slide indicators (6 buttons for 6 slides)
    const slideButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.startsWith("Go to slide")
    );
    expect(slideButtons).toHaveLength(6);
  });

  it("displays initial slide information correctly", () => {
    renderWithLang(<FacilitySection />);
    
    // First slide should be displayed
    expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
    expect(screen.getByText("외관")).toBeInTheDocument();
    expect(screen.getByText("부산 서면 아이온시티빌딩")).toBeInTheDocument();
  });

  it("navigates to next slide when next button is clicked", async () => {
    renderWithLang(<FacilitySection />);
    
    const nextButton = screen.getByLabelText("Next slide");
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText("시설 2 / 6")).toBeInTheDocument();
      expect(screen.getByText("대기실")).toBeInTheDocument();
    });
  });

  it("navigates to previous slide when previous button is clicked", async () => {
    renderWithLang(<FacilitySection />);
    
    // First go to slide 2
    const nextButton = screen.getByLabelText("Next slide");
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText("시설 2 / 6")).toBeInTheDocument();
    });
    
    // Then go back to slide 1
    const prevButton = screen.getByLabelText("Previous slide");
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
    });
  });

  it("navigates directly to slide when indicator is clicked", async () => {
    renderWithLang(<FacilitySection />);
    
    const slideButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.startsWith("Go to slide")
    );
    
    // Click on slide 3
    fireEvent.click(slideButtons[2]!);
    
    await waitFor(() => {
      expect(screen.getByText("시설 3 / 6")).toBeInTheDocument();
      expect(screen.getByText("상담실")).toBeInTheDocument();
    });
  });

  it("wraps around when navigating past the last slide", async () => {
    renderWithLang(<FacilitySection />);
    
    const slideButtons = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.startsWith("Go to slide")
    );
    
    // Click on slide 6 (last slide)
    fireEvent.click(slideButtons[5]!);
    
    await waitFor(() => {
      expect(screen.getByText("시설 6 / 6")).toBeInTheDocument();
    });
    
    // Click next to wrap around to slide 1
    const nextButton = screen.getByLabelText("Next slide");
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
    });
  });

  it("wraps around when navigating before the first slide", async () => {
    renderWithLang(<FacilitySection />);
    
    // Click previous on first slide to wrap to last slide
    const prevButton = screen.getByLabelText("Previous slide");
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText("시설 6 / 6")).toBeInTheDocument();
    });
  });

  it("toggles autoplay when play/pause button is clicked", async () => {
    renderWithLang(<FacilitySection />);
    
    const playPauseButton = screen.getByLabelText("Pause autoplay");
    expect(playPauseButton).toBeInTheDocument();
    
    // Click to pause
    fireEvent.click(playPauseButton);
    
    await waitFor(() => {
      const updatedButton = screen.getByLabelText("Play autoplay");
      expect(updatedButton).toBeInTheDocument();
    });
  });

  it("auto-advances slides every 5 seconds when autoplay is enabled", async () => {
    renderWithLang(<FacilitySection />);
    
    expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
    
    // Advance timer by 5 seconds
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(screen.getByText("시설 2 / 6")).toBeInTheDocument();
    });
    
    // Advance another 5 seconds
    vi.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(screen.getByText("시설 3 / 6")).toBeInTheDocument();
    });
  });

  it("stops auto-advancing when autoplay is paused", async () => {
    renderWithLang(<FacilitySection />);
    
    // Pause autoplay
    const playPauseButton = screen.getByLabelText("Pause autoplay");
    fireEvent.click(playPauseButton);
    
    // Advance timer
    vi.advanceTimersByTime(5000);
    
    // Should still be on slide 1
    expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
  });

  it("stops auto-advancing when hovering over carousel", async () => {
    renderWithLang(<FacilitySection />);
    
    const carousel = screen.getByLabelText("Previous slide").closest("div")?.parentElement;
    
    if (carousel) {
      fireEvent.mouseEnter(carousel);
      
      // Advance timer
      vi.advanceTimersByTime(5000);
      
      // Should still be on slide 1
      expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
    }
  });

  it("resumes auto-advancing when mouse leaves carousel", async () => {
    renderWithLang(<FacilitySection />);
    
    const carousel = screen.getByLabelText("Previous slide").closest("div")?.parentElement;
    
    if (carousel) {
      fireEvent.mouseEnter(carousel);
      fireEvent.mouseLeave(carousel);
      
      // Advance timer
      vi.advanceTimersByTime(5000);
      
      // Should advance to slide 2
      await waitFor(() => {
        expect(screen.getByText("시설 2 / 6")).toBeInTheDocument();
      });
    }
  });

  it("handles touch swipe to next slide", async () => {
    renderWithLang(<FacilitySection />);
    
    const carousel = screen.getByLabelText("Previous slide").closest("div")?.parentElement;
    
    if (carousel) {
      // Simulate swipe left (to next slide)
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100 }],
      });
      
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 50 }],
      });
      
      await waitFor(() => {
        expect(screen.getByText("시설 2 / 6")).toBeInTheDocument();
      });
    }
  });

  it("handles touch swipe to previous slide", async () => {
    renderWithLang(<FacilitySection />);
    
    // First go to slide 2
    const nextButton = screen.getByLabelText("Next slide");
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText("시설 2 / 6")).toBeInTheDocument();
    });
    
    const carousel = screen.getByLabelText("Previous slide").closest("div")?.parentElement;
    
    if (carousel) {
      // Simulate swipe right (to previous slide)
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 50 }],
      });
      
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 100 }],
      });
      
      await waitFor(() => {
        expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
      });
    }
  });

  it("ignores small touch movements", async () => {
    renderWithLang(<FacilitySection />);
    
    const carousel = screen.getByLabelText("Previous slide").closest("div")?.parentElement;
    
    if (carousel) {
      // Simulate small swipe (less than 40px)
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100 }],
      });
      
      fireEvent.touchEnd(carousel, {
        changedTouches: [{ clientX: 95 }],
      });
      
      // Should still be on slide 1
      expect(screen.getByText("시설 1 / 6")).toBeInTheDocument();
    }
  });

  it("renders all 6 slide descriptions correctly", () => {
    renderWithLang(<FacilitySection />);
    
    // Check that all slide descriptions are in the document (even if not visible)
    expect(screen.getByText("부산 서면 아이온시티빌딩")).toBeInTheDocument();
    expect(screen.getByText("호텔식 인테리어의 쾌적한 대기실")).toBeInTheDocument();
    expect(screen.getByText("프라이빗한 상담 공간")).toBeInTheDocument();
    expect(screen.getByText("최신 의료 장비가 갖춰진 시술실")).toBeInTheDocument();
    expect(screen.getByText("고급 의료 장비 구성")).toBeInTheDocument();
    expect(screen.getByText("편안한 휴식 공간")).toBeInTheDocument();
  });

  it("renders navigation buttons with correct aria labels", () => {
    renderWithLang(<FacilitySection />);
    
    expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
  });

  it("renders play/pause button with correct initial aria label", () => {
    renderWithLang(<FacilitySection />);
    
    expect(screen.getByLabelText("Pause autoplay")).toBeInTheDocument();
  });

  it("renders all 6 slide indicator buttons", () => {
    renderWithLang(<FacilitySection />);
    
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByLabelText(`Go to slide ${i}`)).toBeInTheDocument();
    }
  });
});
