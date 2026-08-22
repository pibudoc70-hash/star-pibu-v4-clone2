import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
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

    const detailButton = screen.getByRole("button", { name: "테스트 이벤트 자세히 보기" });
    fireEvent.click(detailButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(detailButton).toHaveAttribute("aria-expanded", "true");

    const list = screen.getByTestId("mobile-event-list");
    const orderedItems = list.querySelectorAll("[data-event-row], [data-event-detail]");
    expect(orderedItems[0]).toHaveAttribute("data-event-row", "1");
    expect(orderedItems[1]).toHaveAttribute("data-event-detail", "1");
    expect(orderedItems[2]).toHaveAttribute("data-event-row", "2");

    fireEvent.click(screen.getByRole("button", { name: "테스트 이벤트 상세 접기" }));

    expect(screen.getByTestId("mobile-event-detail-1")).not.toHaveClass("is-open");
    expect(detailButton).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps inline detail height and opacity motion scoped to the mobile list", () => {
    const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(styles).toContain(".event-mobile-detail");
    expect(styles).toContain("grid-template-rows: 0fr");
    expect(styles).toContain(".event-mobile-detail.is-open");
    expect(styles).toContain("grid-template-rows: 1fr");
  });
});
