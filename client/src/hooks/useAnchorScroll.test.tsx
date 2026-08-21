import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnchorScroll } from "./useAnchorScroll";

function AnchorScrollProbe() {
  const { scrollToSelector } = useAnchorScroll();

  return (
    <>
      <button onClick={() => scrollToSelector("#facility")}>시설안내</button>
      <button onClick={() => scrollToSelector("#events")}>EVENT</button>
      <section id="facility" className="scroll-mt-24" />
      <section id="events" className="scroll-mt-24" />
    </>
  );
}

describe("useAnchorScroll", () => {
  const scrollIntoView = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
  });

  afterEach(() => {
    scrollIntoView.mockClear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("시설안내 anchor를 지연 재보정 없이 한 번의 native smooth scroll로 이동한다", () => {
    const { getByRole } = render(<AnchorScrollProbe />);

    fireEvent.click(getByRole("button", { name: "시설안내" }));
    vi.advanceTimersByTime(5000);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("EVENT anchor에도 동일한 단일 native smooth scroll 계약을 적용한다", () => {
    const { getByRole } = render(<AnchorScrollProbe />);

    fireEvent.click(getByRole("button", { name: "EVENT" }));
    vi.advanceTimersByTime(5000);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });
});
