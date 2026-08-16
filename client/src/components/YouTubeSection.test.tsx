import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import YouTubeSection from "./YouTubeSection";

type QueryState = {
  data?: Array<{ id: number; title: string; videoId: string; type: "video" | "shorts" }>;
  isLoading: boolean;
  isError: boolean;
  refetch: ReturnType<typeof vi.fn>;
};

let queryState: QueryState;
let observerCallback: IntersectionObserverCallback | undefined;
const queryOptions: Array<{ enabled?: boolean }> = [];

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "0px";
  thresholds = [];
}

vi.mock("@/lib/trpc", () => ({
  trpc: {
    youtube: {
      getAll: {
        useQuery: (_input: undefined, options: { enabled?: boolean }) => {
          queryOptions.push(options);
          return queryState;
        },
      },
    },
  },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    t: {
      youtube: {
        loadingLabel: "YouTube loading",
        errorLabel: "YouTube error",
        errorMessage: "Unable to load YouTube videos.",
        retry: "Retry",
        visitChannel: "Visit channel",
        sectionTitle: "YouTube",
        sectionSubtitle: "Latest videos",
        latestVideos: "Latest videos",
        shorts: "Shorts",
        playVideo: "Play video",
        playShorts: "Play short",
        closeModal: "Close video",
      },
    },
  }),
}));

vi.mock("@/components/OptimizedImage", () => ({ default: () => <img alt="" /> }));

function state(overrides: Partial<QueryState> = {}): QueryState {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe("YouTubeSection viewport query states", () => {
  beforeEach(() => {
    queryState = state();
    queryOptions.length = 0;
    observerCallback = undefined;
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("keeps a neutral loading state and disables the query before the section is visible", () => {
    render(<YouTubeSection />);

    expect(queryOptions.at(-1)).toMatchObject({ enabled: false });
    expect(screen.getByLabelText("YouTube loading")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("Unable to load YouTube videos.")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
  });

  it("shows the query error UI only after the section becomes visible", async () => {
    queryState = state({ isError: true });
    render(<YouTubeSection />);

    expect(screen.queryByText("Unable to load YouTube videos.")).not.toBeInTheDocument();
    expect(observerCallback).toBeDefined();

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => expect(queryOptions.at(-1)).toMatchObject({ enabled: true }));
    expect(screen.getByText("Unable to load YouTube videos.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled();
  });
});
