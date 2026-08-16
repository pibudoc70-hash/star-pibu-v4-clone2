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
const navigate = vi.fn();

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

vi.mock("wouter", () => ({ useLocation: () => ["/", navigate] }));
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
    navigate.mockReset();
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

  it("shows an accessible retry UI instead of the empty state when the API fails without data", () => {
    featuredState = queryState({ error: new Error("failed") });
    listState = queryState({ error: new Error("failed") });

    render(<EventsSection />);

    expect(screen.getByRole("alert")).toHaveTextContent("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    expect(screen.queryByText("등록된 이벤트가 없습니다.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeEnabled();
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

  it("keeps existing cards and event navigation when stale data has a refetch error", async () => {
    featuredState = queryState({ data: [event], error: new Error("background refresh failed") });
    listState = queryState({ data: [event], error: new Error("background refresh failed") });

    render(<EventsSection />);

    await waitFor(() => expect(screen.getAllByText("테스트 이벤트")).toHaveLength(2));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByText("테스트 이벤트")[0]!);
    expect(navigate).toHaveBeenCalledWith("/events/1");
  });
});
