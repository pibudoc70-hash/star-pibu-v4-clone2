import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import EventTableMobile, { partitionMobileFeaturedEvent } from "./EventTableMobile";
import type { SpecialEvent } from "@/hooks/useLocalizedEvent";

vi.mock("@/contexts/LangContext", () => ({ useLang: () => ({ lang: "ko" }) }));
vi.mock("@/hooks/useChatConfig", () => ({ useChatConfig: () => ({ chatUrl: "https://example.com/chat", chatBg: "#fee500", chatColor: "#191919", isZH: false, isJA: false }) }));
vi.mock("@/components/OptimizedImage", () => ({ default: (props: { alt: string }) => <img alt={props.alt} /> }));

function event(overrides: Partial<SpecialEvent>): SpecialEvent {
  return {
    id: 1,
    title: "기본 이벤트",
    subtitle: "이벤트 안내",
    desc: "",
    content: "",
    productName: "시술",
    normalPrice: 0,
    discountPrice: 490000,
    cta: "",
    isActive: "1",
    isFeatured: "0",
    sortOrder: 1,
    ...overrides,
  };
}

const localizedTitle = (item: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => item[field];

describe("EventTableMobile featured event hierarchy", () => {
  it("renders one featured record above the regular list and excludes that record from the list", () => {
    const featured = event({ id: 7, title: "대표 이벤트", isFeatured: "1", sortOrder: 3, normalPrice: 990000 });
    const regular = event({ id: 8, title: "일반 이벤트", sortOrder: 1 });

    render(<EventTableMobile events={[featured, regular]} getLocalizedText={localizedTitle} />);

    expect(within(screen.getByTestId("mobile-featured-event")).getAllByText("대표 이벤트")).not.toHaveLength(0);
    expect(screen.queryByTestId("mobile-event-row-7")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-8")).toBeInTheDocument();
    expect(within(screen.getByTestId("mobile-featured-event")).getAllByText("990,000원").some((element) => element.classList.contains("line-through"))).toBe(true);
    expect(screen.queryByText(/OFF/i)).not.toBeInTheDocument();
  });

  it("selects the sortOrder-first record as the only featured card and leaves additional featured records in the list", () => {
    const laterFeatured = event({ id: 10, title: "후순위 대표", isFeatured: "1", sortOrder: 9 });
    const firstFeatured = event({ id: 9, title: "우선 대표", isFeatured: "1", sortOrder: 2 });
    const regular = event({ id: 11, title: "일반 이벤트", sortOrder: 1 });

    const partition = partitionMobileFeaturedEvent([laterFeatured, firstFeatured, regular]);
    render(<EventTableMobile events={[laterFeatured, firstFeatured, regular]} getLocalizedText={localizedTitle} />);

    expect(partition.featuredEvent?.id).toBe(9);
    expect(within(screen.getByTestId("mobile-featured-event")).getAllByText("우선 대표")).not.toHaveLength(0);
    expect(screen.getByTestId("mobile-event-row-10")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-11")).toBeInTheDocument();
  });

  it("renders no featured-card region when there are no featured records", () => {
    const first = event({ id: 20, title: "첫 일반 이벤트", sortOrder: 1 });
    const second = event({ id: 21, title: "둘째 일반 이벤트", sortOrder: 2 });

    render(<EventTableMobile events={[first, second]} getLocalizedText={localizedTitle} />);

    expect(screen.queryByTestId("mobile-featured-event")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-20")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-21")).toBeInTheDocument();
  });
});
