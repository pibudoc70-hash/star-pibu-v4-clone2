import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

vi.mock("@/components/events/EventCard", () => ({
  default: ({
    event,
    variant,
    isSelected,
    onPreview,
  }: {
    event: { id: number; title: string };
    variant?: string;
    isSelected?: boolean;
    onPreview?: () => void;
  }) => {
    if (variant !== "selector") return null;
    return (
      <button type="button" aria-pressed={isSelected} onClick={onPreview}>
        {event.title}
      </button>
    );
  },
}));
vi.mock("@/components/events/EventTableMobile", () => ({ default: () => null }));
vi.mock("@/components/PainManagementGuide", () => ({
  default: ({ presentation }: { presentation?: string }) => <section data-testid={presentation ? "pain-management-event-accordion" : "pain-management-guide-desktop"} data-presentation={presentation} />,
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

  it("keeps the events anchor but does not mount the unrelated pain-management guide while the lazy query is loading", () => {
    render(<SpecialEventSection />);

    const events = document.getElementById("events");

    expect(events).toHaveAttribute("aria-busy", "true");
    expect(events).toHaveAttribute("aria-label", "스페셜 이벤트");
    expect(events).toHaveClass("md:scroll-mt-40");
    expect(screen.queryByTestId("pain-management-guide")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "안전한 관리를 위한 안내" })).not.toBeInTheDocument();
  });

  it("renders a mobile list-shaped skeleton while the event query is loading", () => {
    render(<SpecialEventSection />);

    const skeleton = screen.getByTestId("mobile-event-list-skeleton");

    expect(skeleton).toHaveClass("md:hidden", "rounded-2xl", "border");
    expect(screen.getAllByTestId("mobile-event-list-skeleton-row")).toHaveLength(3);
  });

  it("does not mount a pain-management guide after an empty event query fails", async () => {
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
      expect(screen.queryByTestId("pain-management-guide")).not.toBeInTheDocument();
    });
  });

  it("mounts the compact pain-management accordion only after events load", async () => {
    class VisibleIntersectionObserverMock extends IntersectionObserverMock {
      observe() {
        this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }

    vi.stubGlobal("IntersectionObserver", VisibleIntersectionObserverMock);
    specialQuery.mockReturnValue({
      data: [{ id: 101, title: "이벤트 A" }],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<SpecialEventSection />);

    const accordion = await screen.findByTestId("pain-management-event-accordion");
    expect(accordion).toHaveAttribute("data-presentation", "event-accordion");
    expect(screen.getByTestId("pain-management-guide-desktop")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "안전한 관리를 위한 안내" })).not.toBeInTheDocument();
  });

  it("clears a removed selected event so the refreshed selector falls back to the first available event", async () => {
    class VisibleIntersectionObserverMock extends IntersectionObserverMock {
      observe() {
        this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }

    const eventA = { id: 101, title: "이벤트 A" };
    const eventB = { id: 202, title: "이벤트 B" };
    const queryResult = { isLoading: false, error: null, refetch: vi.fn() };

    vi.stubGlobal("IntersectionObserver", VisibleIntersectionObserverMock);
    specialQuery.mockReturnValue({ ...queryResult, data: [eventA, eventB] });

    const { rerender } = render(<SpecialEventSection />);

    await waitFor(() => expect(screen.getByRole("button", { name: "이벤트 A" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "이벤트 A" }));
    expect(screen.getByRole("button", { name: "이벤트 A" })).toHaveAttribute("aria-pressed", "true");

    specialQuery.mockReturnValue({ ...queryResult, data: [eventB] });
    rerender(<SpecialEventSection />);

    await waitFor(() => {
      const refreshedRows = screen.getAllByRole("button");
      expect(refreshedRows).toHaveLength(1);
      expect(refreshedRows[0]).toHaveAttribute("aria-pressed", "true");
    });

    specialQuery.mockReturnValue({ ...queryResult, data: [eventB, eventA] });
    rerender(<SpecialEventSection />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "이벤트 B" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "이벤트 A" })).toHaveAttribute("aria-pressed", "false");
    });
  });
});
