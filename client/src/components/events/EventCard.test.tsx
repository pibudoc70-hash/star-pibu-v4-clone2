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
    expect(styles).toContain(".event-card__media-image:hover");
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

  it("is isolated to the desktop event grid while the mobile event table remains the 390px surface", () => {
    const sectionSource = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../SpecialEventSection.tsx"), "utf8");

    expect(sectionSource).toContain('<div className="md:hidden">');
    expect(sectionSource).toContain("<EventTableMobile");
    expect(sectionSource).toContain('<div className="hidden md:grid grid-cols-3 gap-12 items-start">');
    expect(sectionSource).toContain("<EventCard");
  });
});
