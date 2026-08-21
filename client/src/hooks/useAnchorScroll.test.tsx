import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnchorScroll } from "./useAnchorScroll";

function AnchorScrollProbe() {
  const { scrollToSelector } = useAnchorScroll();

  return (
    <>
      <header role="banner" />
      <button onClick={() => scrollToSelector("#facility")}>시설안내</button>
      <button onClick={() => scrollToSelector("#events")}>EVENT</button>
      <section id="facility" />
      <section id="events" />
    </>
  );
}

describe("useAnchorScroll", () => {
  let scrollY = 0;
  let facilityAbsoluteTop = 500;
  let eventAbsoluteTop = 700;
  const scrollTo = vi.fn(({ top }: ScrollToOptions) => {
    scrollY = Number(top ?? 0);
  });

  beforeEach(() => {
    vi.useFakeTimers();
    scrollY = 0;
    facilityAbsoluteTop = 500;
    eventAbsoluteTop = 700;
    Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
    const requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    };
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrame);
  });

  afterEach(() => {
    scrollTo.mockClear();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("lazy layout shift 뒤 한 번의 부드러운 final settle로 target을 정렬한다", () => {
    const { getByRole } = render(<AnchorScrollProbe />);
    const header = document.querySelector('header[role="banner"]') as HTMLElement;
    const facility = document.querySelector("#facility") as HTMLElement;

    Object.defineProperty(header, "offsetHeight", { configurable: true, value: 60 });
    vi.spyOn(facility, "getBoundingClientRect").mockImplementation(() => ({
      top: facilityAbsoluteTop - scrollY,
      bottom: facilityAbsoluteTop - scrollY + 400,
      height: 400,
      left: 0,
      right: 0,
      width: 100,
      x: 0,
      y: facilityAbsoluteTop - scrollY,
      toJSON: () => ({}),
    }));

    fireEvent.click(getByRole("button", { name: "시설안내" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 432, behavior: "smooth" });

    facilityAbsoluteTop = 1000;
    vi.advanceTimersByTime(1999);

    expect(scrollTo).toHaveBeenCalledTimes(1);

    facilityAbsoluteTop = 1600;
    vi.advanceTimersByTime(1);

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1532, behavior: "smooth" });
  });

  it("EVENT anchor에도 동일한 단일 smooth final settle 계약을 적용한다", () => {
    const { getByRole } = render(<AnchorScrollProbe />);
    const header = document.querySelector('header[role="banner"]') as HTMLElement;
    const events = document.querySelector("#events") as HTMLElement;

    Object.defineProperty(header, "offsetHeight", { configurable: true, value: 60 });
    vi.spyOn(events, "getBoundingClientRect").mockImplementation(() => ({
      top: eventAbsoluteTop - scrollY,
      bottom: eventAbsoluteTop - scrollY + 400,
      height: 400,
      left: 0,
      right: 0,
      width: 100,
      x: 0,
      y: eventAbsoluteTop - scrollY,
      toJSON: () => ({}),
    }));

    fireEvent.click(getByRole("button", { name: "EVENT" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 632, behavior: "smooth" });

    eventAbsoluteTop = 1400;
    vi.advanceTimersByTime(2000);

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1332, behavior: "smooth" });
  });
});
