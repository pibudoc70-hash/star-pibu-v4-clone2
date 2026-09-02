import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import EventTableMobile, { MOBILE_PRIORITY_EVENT_IDS, orderMobileSpecialEvents } from "./EventTableMobile";
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

describe("EventTableMobile unified special event hierarchy", () => {
  it("keeps an isFeatured event inside the same Special Event list rather than splitting it into a separate lead card", () => {
    const featured = event({ id: 300001, title: "써마지 FLX", isFeatured: "1", sortOrder: 3, normalPrice: 990000 });
    const regular = event({ id: 8, title: "일반 이벤트", sortOrder: 1 });

    render(<EventTableMobile events={[featured, regular]} getLocalizedText={localizedTitle} />);

    expect(screen.queryByTestId("mobile-featured-event")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-300001")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-8")).toBeInTheDocument();
    expect(screen.queryByText(/OFF/i)).not.toBeInTheDocument();
  });

  it("orders the requested mobile priority events as Thermage, Ultherapy, then Metacell", () => {
    const thermage = event({ id: 300001, title: "써마지 FLX", sortOrder: 2 });
    const ultherapy = event({ id: 360001, title: "울쎄라피 프라임", sortOrder: 1 });
    const metacell = event({ id: 10560001, title: "메타셀", sortOrder: 0 });
    const regular = event({ id: 11, title: "일반 이벤트", sortOrder: 0 });

    const ordered = orderMobileSpecialEvents([metacell, regular, ultherapy, thermage]);
    render(<EventTableMobile events={[metacell, regular, ultherapy, thermage]} getLocalizedText={localizedTitle} />);

    expect(ordered.map((item) => item.id).slice(0, 3)).toEqual(MOBILE_PRIORITY_EVENT_IDS);
    expect(screen.getAllByTestId(/mobile-event-row-/).slice(0, 3).map((row) => row.getAttribute("data-event-row"))).toEqual(["300001", "360001", "10560001"]);
    expect(screen.getByTestId("mobile-event-entry-300001")).toHaveAttribute("data-priority", "1");
    expect(screen.getByTestId("mobile-event-entry-360001")).toHaveAttribute("data-priority", "2");
    expect(screen.getByTestId("mobile-event-entry-10560001")).toHaveAttribute("data-priority", "3");
    expect(screen.getByTestId("mobile-event-entry-300001")).not.toHaveClass("rounded-xl", "border", "shadow-[0_8px_18px_rgba(10,18,40,0.08)]");
    expect(screen.getByTestId("mobile-event-entry-360001")).toHaveClass("border-t");
  });

  it("keeps regular events in their original sortOrder after the requested priority entries", () => {
    const first = event({ id: 20, title: "첫 일반 이벤트", sortOrder: 1 });
    const second = event({ id: 21, title: "둘째 일반 이벤트", sortOrder: 2 });

    render(<EventTableMobile events={[first, second]} getLocalizedText={localizedTitle} />);

    expect(screen.queryByTestId("mobile-featured-event")).not.toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-20")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-event-row-21")).toBeInTheDocument();
  });
});
