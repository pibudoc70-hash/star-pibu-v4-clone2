import React from "react";
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

const getLocalizedText = (source: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => source[field];

describe("EventTableMobile", () => {
  it("상세보기 버튼이 접근 가능한 dialog를 열고 배경 닫기 버튼으로 닫는다", () => {
    render(<EventTableMobile events={[event]} getLocalizedText={getLocalizedText} />);

    fireEvent.click(screen.getByRole("button", { name: "테스트 이벤트 자세히 보기" }));

    expect(screen.getByRole("dialog", { name: "테스트 이벤트" })).toBeInTheDocument();
    const backdropCloseButton = screen.getByRole("button", { name: "이벤트 상세 닫기" });
    expect(backdropCloseButton).toBeInTheDocument();

    fireEvent.click(backdropCloseButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
