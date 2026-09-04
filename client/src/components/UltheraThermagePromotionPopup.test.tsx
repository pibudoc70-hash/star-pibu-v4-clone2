import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UltheraThermagePromotionPopup, {
  DISMISS_ANIMATION_MS,
  getLocalCalendarDateKey,
  PROMOTION_HIDE_UNTIL_DATE_KEY,
  ULTHERA_THERMAGE_PROMOTIONS,
} from "./UltheraThermagePromotionPopup";

describe("UltheraThermagePromotionPopup", () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-04T10:00:00"));
    localStorage.clear();
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    }) as typeof window.requestAnimationFrame;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.matchMedia = originalMatchMedia;
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

  it("provides a cohesive today-hide control beside the accessible close control across breakpoints", () => {
    renderVisiblePopup();

    const checkbox = screen.getByRole("checkbox", { name: "오늘 하루 보지 않기" });
    expect(checkbox).not.toBeChecked();
    expect(screen.getByTestId("promotion-hide-today-control")).toHaveClass("min-h-[52px]", "min-w-[178px]", "border-[rgba(215,181,92,0.7)]");
    expect(screen.getByTestId("promotion-popup-controls")).toHaveClass("bottom-3", "right-3", "md:-right-14", "md:top-0");
    expect(checkbox).toHaveClass("peer", "sr-only");
    expect(screen.getByRole("button", { name: "닫기" })).toHaveAttribute("data-testid", "promotion-popup-close");
    expect(screen.getByRole("button", { name: "닫기" })).toHaveClass("size-[52px]", "border-[var(--color-gold-primary)]", "bg-[var(--color-star-navy)]", "text-white", "md:size-[52px]");
    expect(screen.getByText("닫기")).toHaveClass("sr-only");
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closing");
    expect(screen.getByTestId("ulthera-thermage-promotion-popup")).toHaveClass("opacity-0", "pointer-events-none");
    act(() => vi.advanceTimersByTime(DISMISS_ANIMATION_MS));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("suppresses the popup only for the selected local calendar date", () => {
    const firstRender = renderVisiblePopup();
    fireEvent.click(screen.getByRole("checkbox", { name: "오늘 하루 보지 않기" }));
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    act(() => vi.advanceTimersByTime(DISMISS_ANIMATION_MS));

    expect(localStorage.getItem(PROMOTION_HIDE_UNTIL_DATE_KEY)).toBe(getLocalCalendarDateKey());
    firstRender.parentElement?.parentElement?.remove();

    render(<UltheraThermagePromotionPopup />);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    vi.setSystemTime(new Date("2026-09-05T10:00:00"));
    render(<UltheraThermagePromotionPopup />);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.getByRole("dialog", { name: "울쎄라피 프라임 및 써마지 FLX 이벤트" })).toBeInTheDocument();
  });

  it("skips the fade delay when the visitor prefers reduced motion", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as typeof window.matchMedia;
    renderVisiblePopup();

    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closing");
    act(() => vi.advanceTimersByTime(0));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
