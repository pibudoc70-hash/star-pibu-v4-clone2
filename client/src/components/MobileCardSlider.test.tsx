import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MobileCardSlider from "./MobileCardSlider";

const scrollTo = vi.fn();
const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
const sliderSource = readFileSync(resolve(process.cwd(), "client/src/components/MobileCardSlider.tsx"), "utf8");

describe("MobileCardSlider", () => {
  beforeEach(() => {
    scrollTo.mockReset();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("shares arrow and indicator navigation across native snap rows", () => {
    render(
      <MobileCardSlider itemCount={3} label="테스트 카드">
        <button type="button">첫 카드</button>
        <button type="button">둘째 카드</button>
        <button type="button">셋째 카드</button>
      </MobileCardSlider>,
    );

    const previous = screen.getByRole("button", { name: "테스트 카드 이전 카드" });
    const next = screen.getByRole("button", { name: "테스트 카드 다음 카드" });
    const indicators = [1, 2, 3].map((index) =>
      screen.getByRole("button", { name: `테스트 카드 ${index}번 카드로 이동` }),
    );

    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
    expect(indicators[0]).toHaveAttribute("aria-current", "true");

    fireEvent.click(next);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(indicators[1]).toHaveAttribute("aria-current", "true");

    fireEvent.click(indicators[2]);
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(next).toBeDisabled();
    expect(previous).toBeEnabled();
  });

  it("marks all direct children as snap targets without changing their card content", () => {
    const { container } = render(
      <MobileCardSlider itemCount={2} label="쇼츠 카드" variant="shorts">
        <button type="button">첫 쇼츠</button>
        <button type="button">둘째 쇼츠</button>
      </MobileCardSlider>,
    );

    expect(container.querySelectorAll("[data-mobile-card-slider-item]")).toHaveLength(2);
    expect(container.querySelector(".mobile-card-slider--shorts")).toBeInTheDocument();
    expect(screen.getByText("첫 쇼츠")).toBeInTheDocument();
    expect(screen.getByText("둘째 쇼츠")).toBeInTheDocument();
  });

  it("uses one mobile-only centered snap and hidden-scrollbar policy", () => {
    expect(styles).toContain("@media (max-width: 767px) {\n  .mobile-card-slider");
    expect(styles).toContain("--mobile-slider-card-width: calc(100vw - 2rem);");
    expect(styles).toContain("scroll-snap-align: center;");
    expect(styles).toContain(".mobile-card-slider__viewport--shorts");
    expect(styles).toContain("--mobile-slider-card-width: calc(72vw - 1.44rem);");
    expect(styles).toContain("scrollbar-width: none;");
    expect(styles).toContain("-ms-overflow-style: none;");
    expect(styles).toContain("#faq .faq-tabs-scroll::-webkit-scrollbar");
  });

  it("lets vertical mobile touches scroll the page while retaining horizontal card drags", () => {
    expect(styles).toContain("overflow-y: visible;");
    expect(styles).toContain("overscroll-behavior-y: auto;");
    expect(styles).toContain("touch-action: pan-y;");
    expect(sliderSource).toContain("const handleTouchStart");
    expect(sliderSource).toContain("const handleTouchMove");
    expect(sliderSource).toContain('Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical"');
    expect(sliderSource).toContain('if (gesture.axis === "vertical") return;');
    expect(sliderSource).toContain("if (event.cancelable) event.preventDefault();");
    expect(sliderSource).toContain("onTouchMove={handleTouchMove}");
  });

  it("keeps compact visible controls with expanded mobile touch targets", () => {
    expect(styles).toContain("width: 1.75rem;");
    expect(styles).toContain("height: 1.75rem;");
    expect(styles).toContain("min-height: 1.75rem !important;");
    expect(styles).toContain(".mobile-card-slider__arrow::after");
    expect(styles).toContain("inset: -0.5rem;");
    expect(styles).toContain("width: 0.375rem;");
    expect(styles).toContain("height: 0.375rem;");
    expect(styles).toContain("height: 1.75rem;");
    expect(styles).toContain("transition: width 0.25s ease;");
    expect(styles).toContain("width: 1.125rem;");
    expect(styles).toContain("background: #C9A96E;");
  });
});
