import React from "react";
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import YouTubeSection from "./YouTubeSection";

type Video = {
  id: number;
  title: string;
  videoId: string;
  type: "video" | "shorts";
};

type QueryState = {
  data?: Video[];
  isLoading: boolean;
  isError: boolean;
  refetch: ReturnType<typeof vi.fn>;
};

let queryState: QueryState;
const queryOptions = vi.fn();
const observerCallbacks: IntersectionObserverCallback[] = [];

vi.mock("@/lib/trpc", () => ({
  trpc: {
    youtube: {
      getAll: {
        useQuery: (_input: unknown, options: { enabled: boolean }) => {
          queryOptions(options);
          if (!options.enabled) {
            return state({ refetch: queryState.refetch });
          }
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
        sectionTitle: "피부과전문의가 알려주는 피부이야기",
        sectionSubtitle: "스타피부과 유튜브 채널에서 더 많은 정보를 확인하세요",
        latestVideos: "최신 영상",
        shorts: "쇼츠",
        visitChannel: "유튜브 채널 방문하기",
        close: "닫기",
        loadingLabel: "YouTube 채널 로딩 중",
        errorLabel: "YouTube 채널 오류",
        errorMessage: "영상을 불러오지 못했습니다.",
        retry: "다시 시도",
        playVideo: "영상 재생",
        playShorts: "쇼츠 재생",
        closeModal: "모달 닫기",
      },
    },
  }),
}));

vi.mock("@/components/OptimizedImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback) {
    observerCallbacks.push(callback);
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

function state(overrides: Partial<QueryState> = {}): QueryState {
  return {
    data: undefined,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  };
}

function enterViewport() {
  const callback = observerCallbacks.at(-1);
  if (!callback) throw new Error("IntersectionObserver was not registered");

  act(() => {
    callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

describe("YouTubeSection deferred query states", () => {
  beforeEach(() => {
    queryState = state();
    queryOptions.mockReset();
    observerCallbacks.length = 0;
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("does not show error, empty, or retry UI before the query is enabled", () => {
    render(<YouTubeSection />);

    expect(queryOptions).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }));
    expect(screen.queryByText("영상을 불러오지 못했습니다.")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다시 시도" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("YouTube 채널 로딩 중")).not.toBeInTheDocument();
  });

  it("shows the loading skeleton only after viewport activation starts the query", () => {
    queryState = state({ isLoading: true });
    render(<YouTubeSection />);

    expect(screen.queryByLabelText("YouTube 채널 로딩 중")).not.toBeInTheDocument();
    enterViewport();

    expect(queryOptions).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: true }));
    expect(screen.getByLabelText("YouTube 채널 로딩 중")).toBeInTheDocument();
    expect(screen.queryByText("영상을 불러오지 못했습니다.")).not.toBeInTheDocument();
  });

  it("shows error and retry UI only for an activated query that actually fails", () => {
    queryState = state({ isError: true });
    render(<YouTubeSection />);

    expect(screen.queryByText("영상을 불러오지 못했습니다.")).not.toBeInTheDocument();
    enterViewport();

    expect(screen.getByText("영상을 불러오지 못했습니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
  });

  it("renders a successful empty result without error or retry UI", () => {
    queryState = state({ data: [] });
    render(<YouTubeSection />);
    enterViewport();

    expect(screen.getByRole("heading", { name: "피부과전문의가 알려주는 피부이야기" })).toBeInTheDocument();
    expect(screen.queryByText("영상을 불러오지 못했습니다.")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "다시 시도" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "유튜브 채널 방문하기" })).toBeInTheDocument();
  });

  it("keeps rendering successful video cards after activation", () => {
    queryState = state({
      data: [{ id: 1, title: "테스트 영상", videoId: "video-1", type: "video" }],
    });
    render(<YouTubeSection />);
    enterViewport();

    expect(screen.getByRole("button", { name: "테스트 영상 영상 재생" })).toBeInTheDocument();
    expect(screen.queryByText("영상을 불러오지 못했습니다.")).not.toBeInTheDocument();
  });
});
