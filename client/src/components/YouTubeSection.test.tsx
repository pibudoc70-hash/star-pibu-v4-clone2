import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import YouTubeSection from "./YouTubeSection";

const youtubeSectionSource = readFileSync(resolve(process.cwd(), "client/src/components/YouTubeSection.tsx"), "utf8");

type QueryState = {
  data?: Array<{ id: number; title: string; videoId: string; type: "video" | "shorts" }>;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
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
    isFetching: false,
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

  it("does not retain production debug logging for YouTube query responses", () => {
    expect(youtubeSectionSource).not.toContain("[YouTubeSection]");
    expect(youtubeSectionSource).not.toMatch(/console\.(log|debug|info|warn|error)\s*\(/);
  });

  it("does not retain unused modal position state or calculations", () => {
    expect(youtubeSectionSource).not.toContain("interface ModalPosition");
    expect(youtubeSectionSource).not.toContain("modalPosition");
    expect(youtubeSectionSource).not.toContain("setModalPosition");
    expect(youtubeSectionSource).not.toContain("calculateModalPosition");
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

  it("closes an opened video dialog when Escape is pressed", async () => {
    queryState = state({
      data: [{ id: 1, title: "Test video", videoId: "dQw4w9WgXcQ", type: "video" }],
    });
    render(<YouTubeSection />);

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    const trigger = await screen.findByRole("button", { name: "Test video Play video" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTitle("Test video")).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not create a playable card or iframe for an invalid video ID", async () => {
    queryState = state({
      data: [{ id: 1, title: "Unsafe video", videoId: "https://evil.example/iframe", type: "video" }],
    });
    render(<YouTubeSection />);

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    await waitFor(() => expect(queryOptions.at(-1)).toMatchObject({ enabled: true }));
    expect(screen.queryByRole("button", { name: "Unsafe video Play video" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector('iframe[src*="evil.example"]')).toBeNull();
  });

  it("disables retry and announces progress while a YouTube retry request is active", async () => {
    queryState = state({ isError: true, isFetching: true });
    render(<YouTubeSection />);

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    const retry = await screen.findByRole("button", { name: "YouTube loading" });
    fireEvent.click(retry);

    expect(retry).toBeDisabled();
    expect(retry).toHaveAttribute("aria-busy", "true");
    expect(queryState.refetch).not.toHaveBeenCalled();
  });

  it("recovers from a retry error to normal content without repeating the request", async () => {
    queryState = state({ isError: true });
    const { rerender } = render(<YouTubeSection />);

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    const retry = await screen.findByRole("button", { name: "Retry" });
    fireEvent.click(retry);
    expect(queryState.refetch).toHaveBeenCalledTimes(1);

    queryState = state({
      data: [{ id: 1, title: "Recovered video", videoId: "dQw4w9WgXcQ", type: "video" }],
    });
    rerender(<YouTubeSection />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Recovered video Play video" })).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
    expect(queryState.refetch).toHaveBeenCalledTimes(0);
  });
});
