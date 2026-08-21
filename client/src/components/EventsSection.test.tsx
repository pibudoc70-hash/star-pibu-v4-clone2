import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { i18n } from "@/lib/i18n";
import EventsSection from "./EventsSection";

const event = {
  id: 1,
  type: "이벤트" as const,
  category: "이벤트" as const,
  title: "테스트 이벤트",
  subtitle: "테스트 부제목",
  desc: "테스트 설명",
  badge: "추천",
  tag: "이벤트",
  hot: "0" as const,
  cta: "자세히 보기",
  accent: "#8d6b3e",
  accentDark: "#6d4d25",
  accentBg: "#f7f0e5",
  iconBg: "#f4e6d4",
  iconType: "tag",
  badgeColor: "#8d6b3e",
  date: "2026.08.16",
  views: 1,
  sortOrder: 1,
  isActive: "1" as const,
  isFeatured: "1" as const,
};

type QueryState = {
  data?: typeof event[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: ReturnType<typeof vi.fn>;
};

let featuredState: QueryState;
let listState: QueryState;

vi.mock("@/lib/trpc", () => ({
  trpc: {
    events: {
      featured: { useQuery: () => featuredState },
      listEvents: { useQuery: () => listState },
    },
  },
}));

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({
    t: {
      events: {
        eyebrow: "EVENT",
        sectionTitle: "이벤트",
        sectionSubtitle: "진행 중인 이벤트",
        filterAll: "전체",
        filterNew: "신규시술",
        filterEvent: "이벤트",
        filterNotice: "공지사항",
        filterEtc: "기타",
        loading: "로딩 중...",
        empty: "등록된 이벤트가 없습니다.",
        viewDetail: "자세히 보기",
        views: "조회",
      },
      consultation: {
        errorGeneric: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      youtube: {
        retry: "다시 시도",
      },
    },
  }),
}));

vi.mock("@/hooks/useScrollReveal", () => ({ useSectionReveal: () => vi.fn() }));
vi.mock("@/components/EventShareButton", () => ({ default: () => <button type="button">공유</button> }));
vi.mock("@/components/ui/badge", () => ({ Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span> }));

function queryState(overrides: Partial<QueryState> = {}): QueryState {
  return {
    data: undefined,
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  };
}

describe("EventsSection query states", () => {
  beforeEach(() => {
    featuredState = queryState();
    listState = queryState();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps the existing loading skeleton for an initial request", () => {
    featuredState = queryState({ isLoading: true });
    listState = queryState({ isLoading: true });

    const { container } = render(<EventsSection />);

    expect(container.querySelectorAll(".skeleton-shimmer")).toHaveLength(12);
  });

  it("shows an accessible retry UI instead of the empty state when both queries fail without data", () => {
    featuredState = queryState({ error: new Error("failed") });
    listState = queryState({ error: new Error("failed") });

    render(<EventsSection />);

    expect(screen.getByRole("alert")).toHaveTextContent("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    expect(screen.queryByText("등록된 이벤트가 없습니다.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeEnabled();
  });

  it("keeps successful general event cards when only the featured query fails", async () => {
    featuredState = queryState({ error: new Error("featured failed") });
    listState = queryState({
      data: [{ ...event, id: 2, title: "일반 이벤트", isFeatured: "0" }],
    });

    render(<EventsSection />);

    await waitFor(() => expect(screen.getByText("일반 이벤트")).toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("등록된 이벤트가 없습니다.")).not.toBeInTheDocument();
  });

  it("keeps successful featured cards when only the general events query fails", () => {
    featuredState = queryState({ data: [event] });
    listState = queryState({ error: new Error("list failed") });

    render(<EventsSection />);

    expect(screen.getByText("테스트 이벤트")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("등록된 이벤트가 없습니다.")).not.toBeInTheDocument();
  });

  it("calls each existing query refetch exactly once and disables the retry button while fetching", () => {
    featuredState = queryState({ error: new Error("failed") });
    listState = queryState({ error: new Error("failed") });

    const { rerender } = render(<EventsSection />);
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(featuredState.refetch).toHaveBeenCalledTimes(1);
    expect(listState.refetch).toHaveBeenCalledTimes(1);

    featuredState = queryState({ error: new Error("failed"), isFetching: true });
    listState = queryState({ error: new Error("failed"), isFetching: true });
    rerender(<EventsSection />);

    expect(screen.getByRole("button", { name: "로딩 중..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "로딩 중..." })).toHaveAttribute("aria-busy", "true");
  });

  it("keeps the error UI without exposing refetch failure details", async () => {
    const featuredRefetch = vi.fn().mockResolvedValue({ error: new Error("featured retry failed") });
    const listRefetch = vi.fn().mockResolvedValue({ error: new Error("list retry failed") });
    const onUnhandledRejection = vi.fn();
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    featuredState = queryState({ error: new Error("failed"), refetch: featuredRefetch });
    listState = queryState({ error: new Error("failed"), refetch: listRefetch });

    render(<EventsSection />);
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    await waitFor(() => {
      expect(featuredRefetch).toHaveBeenCalledTimes(1);
      expect(listRefetch).toHaveBeenCalledTimes(1);
    });
    await Promise.resolve();

    expect(onUnhandledRejection).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("featured retry failed")).not.toBeInTheDocument();
    expect(screen.queryByText("list retry failed")).not.toBeInTheDocument();
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  });

  it("does not call refetch again while the retry button is disabled during an active request", () => {
    featuredState = queryState({ error: new Error("failed"), isFetching: true });
    listState = queryState({ error: new Error("failed"), isFetching: true });

    render(<EventsSection />);
    const retryButton = screen.getByRole("button", { name: "로딩 중..." });
    fireEvent.click(retryButton);

    expect(retryButton).toBeDisabled();
    expect(featuredState.refetch).not.toHaveBeenCalled();
    expect(listState.refetch).not.toHaveBeenCalled();
  });

  it("uses a non-empty generic error message and retry label for every supported locale", () => {
    for (const locale of ["ko", "en", "ja", "zh", "zh-TW"] as const) {
      expect(i18n[locale].consultation.errorGeneric.trim()).not.toBe("");
      expect(i18n[locale].youtube.retry.trim()).not.toBe("");
      expect(i18n[locale].events.loading.trim()).not.toBe("");
    }
  });

  it("shows the empty state only after a successful empty result", () => {
    featuredState = queryState({ data: [] });
    listState = queryState({ data: [] });

    render(<EventsSection />);

    expect(screen.getByText("등록된 이벤트가 없습니다.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps existing cards as native detail links when stale data has a refetch error", async () => {
    featuredState = queryState({ data: [event], error: new Error("background refresh failed") });
    listState = queryState({ data: [event], error: new Error("background refresh failed") });

    render(<EventsSection />);

    await waitFor(() => expect(screen.getAllByText("테스트 이벤트")).toHaveLength(2));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "테스트 이벤트 자세히 보기" })).toHaveLength(2);
    for (const link of screen.getAllByRole("link", { name: "테스트 이벤트 자세히 보기" })) {
      expect(link).toHaveAttribute("href", "/events/1");
    }
  });

  it("keeps featured and list detail links separate from their share controls", async () => {
    featuredState = queryState({ data: [event] });
    listState = queryState({ data: [event] });

    render(<EventsSection />);

    await waitFor(() => expect(screen.getAllByRole("link", { name: "테스트 이벤트 자세히 보기" })).toHaveLength(2));
    for (const link of screen.getAllByRole("link", { name: "테스트 이벤트 자세히 보기" })) {
      expect(link).toHaveAttribute("href", "/events/1");
    }
    for (const shareButton of screen.getAllByRole("button", { name: "공유" })) {
      expect(shareButton.closest("a")).toBeNull();
    }
  });
});
