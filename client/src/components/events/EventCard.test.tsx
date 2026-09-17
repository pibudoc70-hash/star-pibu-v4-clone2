import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import EventCard from "./EventCard";
import type { SpecialEvent } from "@/hooks/useLocalizedEvent";

vi.mock("@/contexts/LangContext", () => ({
  useLang: () => ({ lang: "ko" }),
}));

vi.mock("@/hooks/useChatConfig", () => ({
  useChatConfig: () => ({
    chatUrl: "https://example.com/chat",
    chatBg: "#fee500",
    chatColor: "#191919",
    isZH: false,
    isJA: false,
  }),
}));

vi.mock("@/components/OptimizedImage", () => ({
  default: ({ priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => <img {...props} />,
}));

vi.mock("@/lib/imageUrl", () => ({
  withVersion: (url: string) => url,
}));

const event: SpecialEvent = {
  id: 42,
  title: "울쎄라피 프라임",
  subtitle: "탄력 케어 이벤트",
  desc: "상세 설명",
  content: "상세 콘텐츠",
  productName: "리프팅",
  normalPrice: 500000,
  discountPrice: 390000,
  priceRows: JSON.stringify([
    { label: "300샷", normalPrice: 500000, discountPrice: 390000 },
    { label: "600샷", normalPrice: 900000, discountPrice: 720000 },
  ]),
  imageUrl: "https://example.com/event.webp",
  cta: "자세히 보기",
  isActive: "1",
  sortOrder: 1,
};

describe("EventCard design pilot", () => {
  it("keeps event data, price rows, and disclosure behavior while using scoped static style classes", () => {
    render(<EventCard event={event} getLocalizedText={(item, field) => item[field]} />);

    const detailsButton = screen.getByRole("button", { name: "울쎄라피 프라임 자세히 보기" });
    expect(detailsButton).toHaveClass("event-card__toggle");
    expect(detailsButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("390,000원")).toHaveClass("event-card__discount-price");
    expect(screen.getByText("VAT 포함")).toHaveClass("event-card__vat-badge");

    fireEvent.click(detailsButton);

    expect(screen.getByRole("button", { name: "울쎄라피 프라임 접기" })).toHaveClass("event-card__collapse");
    expect(screen.getByText("600샷")).toHaveClass("event-card__extra-label");
    expect(screen.getByText("720,000원")).toHaveClass("event-card__discount-price--row");
    expect(screen.getByRole("link", { name: "카카오 상담" })).toHaveAttribute("href", "https://example.com/chat");
    expect(screen.getByRole("link", { name: "051-818-2300" })).toHaveAttribute("href", "tel:051-818-2300");
  });

  it("moves static presentation rules to scoped classes while retaining only dynamic chat colors inline", () => {
    const source = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "EventCard.tsx"), "utf8");
    const styles = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../index.css"), "utf8");

    expect(source).toContain("event-card__toggle");
    expect(source).toContain("event-card__media");
    expect(source).toContain("style={{ background: chatBg, color: chatColor }}");
    expect(source).not.toContain('fontSize: "0.82rem"');
    expect(source).not.toContain('aspectRatio: "10/6"');
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toContain(".event-card__media--hoverable:hover .event-card__media-image");
  });

  it("keeps the collapsed mobile card compact and supports keyboard disclosure", async () => {
    const user = userEvent.setup();
    render(<EventCard event={event} getLocalizedText={(item, field) => item[field]} />);

    const media = screen.getByRole("img", { name: "울쎄라피 프라임" }).parentElement;
    expect(media).toHaveClass("event-card__media", "hidden", "md:block");

    await user.tab();
    const detailsButton = screen.getByRole("button", { name: "울쎄라피 프라임 자세히 보기" });
    expect(detailsButton).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(screen.getByRole("button", { name: "울쎄라피 프라임 접기" })).toHaveClass("event-card__collapse");
    expect(screen.getByRole("link", { name: "카카오 상담" }).parentElement).toHaveClass("hidden", "md:flex");
  });

  it("renders the desktop showcase with an edge-to-edge thumbnail and all registered price options", () => {
    render(<EventCard event={event} getLocalizedText={(item, field) => item[field]} variant="showcase" />);

    const showcase = screen.getByTestId("event-card-showcase");
    expect(showcase).toHaveAttribute("data-event-id", "42");
    expect(screen.getByRole("img", { name: "울쎄라피 프라임" })).toHaveClass("block", "h-auto", "w-full");
    expect(screen.getByText("탄력 케어 이벤트")).toHaveClass("line-clamp-1");
    expect(screen.getAllByText("390,000원")[0]).toHaveClass("event-card__discount-price");
    expect(screen.getAllByText("500,000원")[0]).toHaveClass("event-card__normal-price", "line-through");
    expect(screen.getByRole("list", { name: "울쎄라피 프라임 옵션별 가격" })).toHaveTextContent("300샷");
    expect(screen.getByRole("list", { name: "울쎄라피 프라임 옵션별 가격" })).toHaveTextContent("600샷");
    expect(screen.getByText("720,000원")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "카카오 상담" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "051-818-2300" })).not.toBeInTheDocument();
  });

  it("opens only a showcase card with a valid saved connection URL in the current window", () => {
    render(<EventCard event={{ ...event, linkUrl: "https://example.com/ultherapy" }} getLocalizedText={(item, field) => item[field]} variant="showcase" />);

    const link = screen.getByRole("link", { name: "울쎄라피 프라임 현재 창에서 열기" });
    expect(link).toHaveAttribute("href", "https://example.com/ultherapy");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("keeps saved star-pibu notice links on the current site origin", () => {
    render(<EventCard event={{ ...event, linkUrl: "https://star-pibu.com/notice/390001" }} getLocalizedText={(item, field) => item[field]} variant="showcase" />);

    expect(screen.getByRole("link", { name: "울쎄라피 프라임 현재 창에서 열기" })).toHaveAttribute("href", "/notice/390001");
  });

  it("is isolated to the desktop event grid while the mobile event table remains the 390px surface", () => {
    const sectionSource = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../SpecialEventSection.tsx"), "utf8");

    expect(sectionSource).toContain('<div className="md:hidden">');
    expect(sectionSource).toContain("<EventTableMobile");
    expect(sectionSource).toContain('data-testid="special-event-desktop-grid"');
    expect(sectionSource).toContain("hidden md:grid md:auto-rows-fr md:grid-cols-3 md:gap-6");
    expect(sectionSource).toContain('variant="showcase"');
    expect(sectionSource).not.toContain("setSelectedEventId");
    expect(sectionSource).toContain("<EventCard");
  });
});
