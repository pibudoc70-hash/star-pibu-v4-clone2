import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SpecialEventSection from "./SpecialEventSection";

const specialQuery = vi.fn();

vi.mock("@/lib/trpc", () => ({
  trpc: {
    events: {
      special: { useQuery: () => specialQuery() },
    },
  },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({ lang: "ko" }),
}));

vi.mock("@/hooks/useLocalizedEvent", () => ({
  useLocalizedEvent: () => ({ getLocalizedText: vi.fn() }),
}));

vi.mock("@/hooks/useScrollReveal", () => ({
  useSectionReveal: () => vi.fn(),
}));

vi.mock("@/components/events/EventCard", () => ({ default: () => null }));
vi.mock("@/components/events/EventTableMobile", () => ({ default: () => null }));
vi.mock("@/components/PainManagementGuide", () => ({
  default: () => <div data-testid="pain-management-guide" />,
}));

class IntersectionObserverMock {
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe() {}
  disconnect() {}
  unobserve() {}
}

describe("SpecialEventSection anchor target", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    specialQuery.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("keeps the events anchor and pain-management guide available while the lazy query is loading", () => {
    render(<SpecialEventSection />);

    const events = document.getElementById("events");

    expect(events).toHaveAttribute("aria-busy", "true");
    expect(events).toHaveAttribute("aria-label", "스페셜 이벤트");
    expect(events).toHaveClass("md:scroll-mt-40");
    expect(screen.getByTestId("pain-management-guide")).toBeInTheDocument();
  });

  it("renders a mobile list-shaped skeleton while the event query is loading", () => {
    render(<SpecialEventSection />);

    const skeleton = screen.getByTestId("mobile-event-list-skeleton");

    expect(skeleton).toHaveClass("md:hidden", "rounded-2xl", "border");
    expect(screen.getAllByTestId("mobile-event-list-skeleton-row")).toHaveLength(3);
  });

  it("keeps the pain-management guide and corrected label available after an empty event query fails", async () => {
    class VisibleIntersectionObserverMock extends IntersectionObserverMock {
      observe() {
        this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }

    vi.stubGlobal("IntersectionObserver", VisibleIntersectionObserverMock);
    specialQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("event query failed"),
      refetch: vi.fn(),
    });

    render(<SpecialEventSection />);

    await waitFor(() => {
      const events = document.getElementById("events");
      expect(events).toHaveAttribute("aria-label", "스페셜 이벤트");
      expect(screen.getByTestId("pain-management-guide")).toBeInTheDocument();
    });
  });
});
