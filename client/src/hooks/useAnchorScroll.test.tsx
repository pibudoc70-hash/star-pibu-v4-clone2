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
  let queuedFrame: FrameRequestCallback | null = null;
  let cancelAnimationFrameMock: ReturnType<typeof vi.fn>;
  const scrollTo = vi.fn(({ top }: ScrollToOptions) => {
    scrollY = Number(top ?? 0);
  });

  beforeEach(() => {
    vi.useFakeTimers();
    scrollY = 0;
    queuedFrame = null;
    Object.defineProperty(window, "scrollY", { configurable: true, get: () => scrollY });
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      queuedFrame = callback;
      return 1;
    });
    cancelAnimationFrameMock = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
  });

  afterEach(() => {
    scrollTo.mockClear();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function runAnimationToEnd() {
    const firstFrame = queuedFrame;
    expect(firstFrame).not.toBeNull();
    firstFrame?.(0);
    const finalFrame = queuedFrame;
    expect(finalFrame).not.toBeNull();
    finalFrame?.(650);
  }

  function mockScrollMargin() {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    vi.spyOn(window, "getComputedStyle").mockImplementation((element) => {
      const style = originalGetComputedStyle(element);
      return new Proxy(style, {
        get(target, property, receiver) {
          return property === "scrollMarginTop" ? "96px" : Reflect.get(target, property, receiver);
        },
      });
    });
  }

  it("시설안내 anchor가 layout shift 후에도 단일 연속 animation으로 target을 따라간다", () => {
    const { getByRole } = render(<AnchorScrollProbe />);
    const facility = document.querySelector("#facility") as HTMLElement;
    const facilityButton = getByRole("button", { name: "시설안내" });
    let facilityAbsoluteTop = 500;
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

    mockScrollMargin();
    fireEvent.click(facilityButton);
    const firstFrame = queuedFrame;
    firstFrame?.(0);
    facilityAbsoluteTop = 1600;
    const finalFrame = queuedFrame;
    finalFrame?.(650);

    facilityAbsoluteTop = 1800;
    vi.advanceTimersByTime(1450);

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 1704, behavior: "auto" });
  });

  it("EVENT anchor에도 동일한 단일 연속 animation 계약을 적용한다", () => {
    const { getByRole } = render(<AnchorScrollProbe />);
    const events = document.querySelector("#events") as HTMLElement;
    const eventButton = getByRole("button", { name: "EVENT" });
    const eventAbsoluteTop = 700;
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

    mockScrollMargin();
    fireEvent.click(eventButton);
    runAnimationToEnd();

    expect(scrollTo).toHaveBeenLastCalledWith({ top: 604, behavior: "auto" });
  });

  it.each([
    ["wheel", () => fireEvent.wheel(window)],
    ["touchstart", () => fireEvent.touchStart(window)],
    ["pointerdown", () => fireEvent.pointerDown(window)],
    ["keyboard scroll", () => fireEvent.keyDown(window, { key: "PageDown" })],
  ])("cancels animation and final pin after user %s input", (_name, interrupt) => {
    const { getByRole } = render(<AnchorScrollProbe />);
    mockScrollMargin();

    fireEvent.click(getByRole("button", { name: "시설안내" }));
    interrupt();
    const scrollCallsBeforeFinalPin = scrollTo.mock.calls.length;

    vi.advanceTimersByTime(4000);

    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
    expect(scrollTo).toHaveBeenCalledTimes(scrollCallsBeforeFinalPin);
  });
});
