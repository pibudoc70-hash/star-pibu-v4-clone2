import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import EventTableMobile from "./EventTableMobile";
import type { SpecialEvent } from "@/hooks/useLocalizedEvent";

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({ lang: "ko" }),
}));

vi.mock("@/hooks/useChatConfig", () => ({
  useChatConfig: () => ({
    chatUrl: "https://pf.kakao.com/_HNyGC",
    chatBg: "#FEE500",
    chatColor: "#111111",
    isZH: false,
    isJA: false,
  }),
}));

vi.mock("@/components/OptimizedImage", () => ({
  default: () => <div data-testid="optimized-image" />,
}));

const event: SpecialEvent = {
  id: 1,
  title: "테스트 이벤트",
  subtitle: "테스트 부제목",
  desc: "테스트 설명",
  content: "",
  productName: "테스트 시술",
  normalPrice: 100000,
  discountPrice: 80000,
  cta: "상세보기",
  isActive: "1",
  sortOrder: 1,
};

const secondEvent: SpecialEvent = {
  ...event,
  id: 2,
  title: "두 번째 이벤트",
};

const getLocalizedText = (source: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => source[field];

describe("EventTableMobile", () => {
  it("클릭한 행 바로 아래에 상세를 펼치고 이후 행을 정상 레이아웃으로 밀어낸다", () => {
    render(<EventTableMobile events={[event, secondEvent]} getLocalizedText={getLocalizedText} />);

    const detailButton = screen.getByRole("button", { name: "테스트 이벤트 상세 펼치기" });
    fireEvent.click(detailButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(detailButton).toHaveAttribute("aria-expanded", "true");

    const list = screen.getByTestId("mobile-event-list");
    const orderedItems = list.querySelectorAll("[data-event-row], [data-event-detail]");
    expect(orderedItems[0]).toHaveAttribute("data-event-row", "1");
    expect(orderedItems[1]).toHaveAttribute("data-event-detail", "1");
    expect(orderedItems[2]).toHaveAttribute("data-event-row", "2");

    const indicator = screen.getByTestId("mobile-event-expand-indicator-1");
    expect(indicator).toHaveAttribute("data-expanded", "true");
    expect(indicator).toHaveClass("is-expanded");

    const detail = screen.getByTestId("mobile-event-detail-1");
    const detailClose = within(detail).getByRole("button", { name: "테스트 이벤트 상세 접기" });
    expect(within(detail).getByTestId("mobile-event-detail-footer")).toContainElement(detailClose);
    expect(within(detail).getAllByRole("button", { name: "테스트 이벤트 상세 접기" })).toHaveLength(1);

    fireEvent.click(detailClose);

    expect(screen.getByTestId("mobile-event-detail-1")).not.toHaveClass("is-open");
    expect(detailButton).toHaveAttribute("aria-expanded", "false");
    expect(indicator).toHaveAttribute("data-expanded", "false");
    expect(indicator).not.toHaveClass("is-expanded");
  });

  it("keeps inline detail height and opacity motion scoped to the mobile list", () => {
    const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(styles).toContain(".event-mobile-detail");
    expect(styles).toContain("grid-template-rows: 0fr");
    expect(styles).toContain(".event-mobile-detail.is-open");
    expect(styles).toContain("grid-template-rows: 1fr");
    expect(styles).toContain(".event-mobile-detail__body");
    expect(styles).toContain("opacity: 0");
    expect(styles).toContain("translateY(8px)");
    expect(styles).toContain(".event-mobile-detail.is-open .event-mobile-detail__body");
  });

  it("returns footer close to the expanded event row start with smooth scrolling", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/events/EventTableMobile.tsx"), "utf8");

    expect(source).toContain("handleFooterClose");
    expect(source).toContain("scrollIntoView");
    expect(source).toContain('behavior: "smooth"');
    expect(source).toContain('block: "start"');
    expect(source).toContain("scroll-mt-16");
    expect(source).not.toContain("scroll-mt-24 items-center");
  });

  it("keeps the expanded detail close to its clicked event row", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/events/EventTableMobile.tsx"), "utf8");

    expect(source).toContain("event-mobile-detail__body border-t border-gray-100");
    expect(source).not.toContain("event-mobile-detail__body border-t border-gray-100 bg-white/70 px-5 py-5");
  });

  it("uses a compact title-price rhythm and a distinct light-gray detail surface", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/events/EventTableMobile.tsx"), "utf8");

    expect(source).toContain("event-mobile-detail__body border-t border-gray-100 bg-slate-50/95 px-5 pt-3 pb-5");
    expect(source).toContain('<div className="mb-2">');
  });
});
