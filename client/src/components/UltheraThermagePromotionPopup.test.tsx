import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UltheraThermagePromotionPopup, {
  DISMISS_ANIMATION_MS,
  getLocalCalendarDateKey,
  PROMOTION_HIDE_UNTIL_DATE_KEY,
  ULTHERA_THERMAGE_PROMOTIONS,
} from "./UltheraThermagePromotionPopup";

const globalStyles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

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
    return screen.getByRole("dialog", { name: "울쎄라피 프라임 및 써마지 FLX 이벤트" });
  }

  it("shows both promotions in one responsive popup and points each half to its specified new-tab URL", () => {
    const dialog = renderVisiblePopup();

    expect(dialog).toHaveClass("ulthera-thermage-promotion-dialog");
    expect(dialog).toHaveClass("max-w-[420px]", "md:max-w-[720px]", "lg:max-w-[960px]");
    expect(screen.getByTestId("ulthera-promotion-link")).toHaveAttribute("href", ULTHERA_THERMAGE_PROMOTIONS.ultheraUrl);
    expect(screen.getByTestId("thermage-promotion-link")).toHaveAttribute("href", ULTHERA_THERMAGE_PROMOTIONS.thermageUrl);
    expect(screen.getByTestId("ulthera-promotion-link")).toHaveAttribute("target", "_blank");
    expect(screen.getByTestId("thermage-promotion-link")).toHaveAttribute("rel", "noopener noreferrer");
    expect(document.querySelector("picture img")).toHaveAttribute("src", ULTHERA_THERMAGE_PROMOTIONS.mobileImage);
    expect(document.querySelector("picture img")).toHaveClass("h-full", "w-full", "object-cover");
    expect(document.querySelector(`source[srcset="${ULTHERA_THERMAGE_PROMOTIONS.desktopImage}"]`)).toHaveAttribute("media", "(min-width: 768px)");
  });

  it("keeps mobile controls on the creative while placing PC controls below the popup", () => {
    renderVisiblePopup();

    expect(screen.getByTestId("ulthera-thermage-promotion-popup")).toHaveClass(
      "items-start",
      "pt-[max(3rem,env(safe-area-inset-top))]",
      "md:items-center",
      "md:py-6",
    );
    const checkbox = screen.getByRole("checkbox", { name: "오늘 하루 보지 않기" });
    expect(checkbox).not.toBeChecked();
    expect(screen.getByTestId("promotion-hide-today-control")).toHaveClass("min-h-[52px]", "min-w-[178px]", "shadow-[0_8px_20px_rgba(0,0,0,0.42)]");
    expect(screen.getByTestId("promotion-hide-today-control")).not.toHaveClass("border", "border-[rgba(215,181,92,0.7)]", "hover:border-[var(--color-gold-primary)]");
    expect(screen.getByTestId("promotion-popup-controls")).toHaveClass(
      "bottom-3",
      "right-3",
      "z-30",
      "md:bottom-auto",
      "md:right-0",
      "md:top-[calc(100%+0.75rem)]",
    );
    expect(screen.getByTestId("promotion-popup-controls")).not.toHaveClass("md:-right-14", "md:top-0");
    expect(checkbox).toHaveClass("peer", "sr-only");
    expect(screen.getByRole("button", { name: "닫기" })).toHaveAttribute("data-testid", "promotion-popup-close");
    expect(screen.getByRole("button", { name: "닫기" })).toHaveClass("size-[52px]", "bg-[var(--color-star-navy)]", "text-white", "md:size-[52px]", "md:rounded-none", "md:bg-transparent", "md:shadow-none", "md:hover:bg-transparent", "md:hover:text-[var(--color-gold-primary)]");
    expect(screen.getByRole("button", { name: "닫기" })).not.toHaveClass("border-2", "border-[var(--color-gold-primary)]", "md:hover:border-white");
    expect(screen.getByText("닫기")).toHaveClass("sr-only");
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closing");
    expect(screen.getByTestId("promotion-popup-overlay")).toHaveClass("opacity-0", "pointer-events-none");
    act(() => vi.advanceTimersByTime(DISMISS_ANIMATION_MS));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses a dimmed overlay that dismisses only from the background", () => {
    renderVisiblePopup();

    const overlay = screen.getByTestId("promotion-popup-overlay");
    expect(overlay).toHaveAttribute("aria-label", "이벤트 팝업 닫기");
    expect(overlay).toHaveClass("absolute", "inset-0", "bg-[rgba(5,12,28,0.72)]", "backdrop-blur-[2px]");

    fireEvent.click(screen.getByTestId("promotion-hide-today-control"));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "open");

    fireEvent.click(overlay);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "closing");
    expect(overlay).toHaveClass("pointer-events-none", "opacity-0");

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
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    vi.setSystemTime(new Date("2026-09-05T10:00:00"));
    render(<UltheraThermagePromotionPopup />);
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

  it("mounts immediately and transitions into the popup on its first rendered frame", () => {
    const frames: FrameRequestCallback[] = [];
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    }) as typeof window.requestAnimationFrame;

    render(<UltheraThermagePromotionPopup />);

    const popup = screen.getByTestId("ulthera-thermage-promotion-popup");
    const overlay = screen.getByTestId("promotion-popup-overlay");
    expect(popup).toHaveAttribute("data-state", "opening");
    expect(overlay).toHaveClass("opacity-0", "transition-opacity", "motion-reduce:transition-none");
    expect(screen.getByRole("dialog")).toHaveAttribute("data-state", "opening");

    act(() => frames.forEach((callback) => callback(0)));

    expect(popup).toHaveAttribute("data-state", "open");
    expect(overlay).toHaveClass("opacity-100");
  });

  it("keeps the shared hit area while removing close-button chrome in desktop and mobile-specific styles", () => {
    renderVisiblePopup();
    const closeButton = screen.getByRole("button", { name: "닫기" });

    expect(closeButton).toHaveClass("promotion-popup-close", "size-[52px]", "rounded-full", "bg-[var(--color-star-navy)]", "shadow-[0_8px_20px_rgba(0,0,0,0.5)]");
    expect(closeButton).toHaveClass("md:rounded-none", "md:bg-transparent", "md:shadow-none", "md:hover:bg-transparent", "md:hover:shadow-none", "md:active:scale-100");
    expect(closeButton).not.toHaveAttribute("data-hovered");
    expect(globalStyles).toContain("@media (min-width: 768px) {");
    expect(globalStyles).toContain(".promotion-popup-close:focus-visible");
    expect(globalStyles).toContain("border: 0 !important;");
    expect(globalStyles).toContain("outline: 0 !important;");
    expect(globalStyles).toContain("box-shadow: none !important;");
    expect(globalStyles).toContain("@media (max-width: 767px) {");
    expect(globalStyles).toContain("background: transparent !important;");
  });
});
