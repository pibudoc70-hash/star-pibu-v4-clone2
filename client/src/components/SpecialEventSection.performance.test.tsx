import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SpecialEventSection from "./SpecialEventSection";

const specialUseQuery = vi.fn(() => ({
  data: [],
  isLoading: false,
  error: null,
  refetch: vi.fn(),
}));

let observeCallback: IntersectionObserverCallback | undefined;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    events: {
      special: {
        useQuery: (...args: unknown[]) => specialUseQuery(...args),
      },
    },
  },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({ lang: "ko", t: {} }),
}));

vi.mock("@/hooks/useLocalizedEvent", () => ({
  useLocalizedEvent: () => ({ getLocalizedText: () => "" }),
}));

vi.mock("@/hooks/useScrollReveal", () => ({
  useSectionReveal: () => ({ current: null }),
}));

vi.mock("./events/EventCard", () => ({ default: () => <div /> }));
vi.mock("./events/EventTableMobile", () => ({ default: () => <div /> }));

describe("SpecialEventSection viewport fetch", () => {
  beforeEach(() => {
    specialUseQuery.mockClear();
    observeCallback = undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observeCallback = callback;
        }

        observe() {}
        disconnect() {}
        unobserve() {}
        takeRecords() { return []; }
        readonly root = null;
        readonly rootMargin = "300px 0px";
        readonly thresholds = [];
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("뷰포트 근접 전에는 이벤트 조회를 비활성화하고, 근접 후 활성화한다", async () => {
    render(<SpecialEventSection />);

    expect(specialUseQuery).toHaveBeenLastCalledWith(
      { lang: "ko" },
      expect.objectContaining({ enabled: false }),
    );

    act(() => {
      observeCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => {
      expect(specialUseQuery).toHaveBeenLastCalledWith(
        { lang: "ko" },
        expect.objectContaining({ enabled: true }),
      );
    });
  });
});
