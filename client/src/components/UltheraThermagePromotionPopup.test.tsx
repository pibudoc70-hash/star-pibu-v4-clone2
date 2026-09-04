import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UltheraThermagePromotionPopup, { ULTHERA_THERMAGE_PROMOTIONS } from "./UltheraThermagePromotionPopup";

describe("UltheraThermagePromotionPopup", () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof window.requestAnimationFrame;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.requestAnimationFrame = originalRequestAnimationFrame;
  });

  function renderVisiblePopup() {
    render(<UltheraThermagePromotionPopup />);
    act(() => vi.advanceTimersByTime(700));
    return screen.getByRole("dialog", { name: "울쎄라피 프라임 및 써마지 FLX 이벤트" });
  }

  it("shows both promotions in one responsive popup and points each half to its specified new-tab URL", () => {
    const dialog = renderVisiblePopup();

    expect(dialog).toHaveClass("ulthera-thermage-promotion-dialog");
    expect(screen.getByTestId("ulthera-promotion-link")).toHaveAttribute("href", ULTHERA_THERMAGE_PROMOTIONS.ultheraUrl);
    expect(screen.getByTestId("thermage-promotion-link")).toHaveAttribute("href", ULTHERA_THERMAGE_PROMOTIONS.thermageUrl);
    expect(screen.getByTestId("ulthera-promotion-link")).toHaveAttribute("target", "_blank");
    expect(screen.getByTestId("thermage-promotion-link")).toHaveAttribute("rel", "noopener noreferrer");
    expect(document.querySelector("picture img")).toHaveAttribute("src", ULTHERA_THERMAGE_PROMOTIONS.mobileImage);
    expect(document.querySelector(`source[srcset="${ULTHERA_THERMAGE_PROMOTIONS.desktopImage}"]`)).toHaveAttribute("media", "(min-width: 768px)");
  });

  it("provides an accessible close control without a today-hide checkbox", () => {
    renderVisiblePopup();

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByText("오늘은 보지 않음")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "닫기" })).toHaveAttribute("data-testid", "promotion-popup-close");
    expect(screen.getByRole("button", { name: "닫기" })).toHaveClass("bottom-3", "right-3", "size-[52px]", "border-[var(--color-gold-primary)]", "bg-[var(--color-star-navy)]", "text-white", "md:bottom-auto", "md:right-auto", "md:-right-14", "md:top-0");
    expect(screen.getByText("닫기")).toHaveClass("sr-only");
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
