import React from "react";
import { render } from "@testing-library/react";
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

class IntersectionObserverMock {
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

  it("keeps the events anchor available while the lazy query is loading", () => {
    render(<SpecialEventSection />);

    expect(document.getElementById("events")).toHaveAttribute("aria-busy", "true");
  });
});
