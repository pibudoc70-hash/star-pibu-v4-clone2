import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollReveal, useSectionReveal } from "./useScrollReveal";

let observerCallback: IntersectionObserverCallback | null = null;
let observedElement: Element | null = null;
let unobserveSpy: ReturnType<typeof vi.fn>;
let disconnectSpy: ReturnType<typeof vi.fn>;

function ScrollRevealHarness() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 50 });

  return (
    <div ref={ref}>
      <div className="reveal-card" data-testid="stagger-card" />
    </div>
  );
}

function SectionRevealHarness() {
  const ref = useSectionReveal(50);

  return (
    <section ref={ref}>
      <div className="reveal-card" data-testid="section-card" style={{ transitionDelay: "125ms" }} />
    </section>
  );
}

function intersectObservedElement() {
  if (!observerCallback || !observedElement) {
    throw new Error("IntersectionObserver가 관찰 대상을 등록하지 않았습니다.");
  }

  act(() => {
    observerCallback(
      [{ isIntersecting: true, target: observedElement } as IntersectionObserverEntry],
      { unobserve: unobserveSpy } as unknown as IntersectionObserver
    );
  });
}

describe("useScrollReveal", () => {
  beforeEach(() => {
    unobserveSpy = vi.fn();
    disconnectSpy = vi.fn();
    observerCallback = null;
    observedElement = null;

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin = "";
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe = vi.fn((element: Element) => {
        observedElement = element;
      });
      unobserve = unobserveSpy;
      disconnect = disconnectSpy;
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("stagger timer가 unmount 뒤 카드 class를 변경하지 않도록 정리한다", () => {
    vi.useFakeTimers();
    const { unmount } = render(<ScrollRevealHarness />);
    const card = observedElement?.querySelector("[data-testid='stagger-card']") as HTMLElement;

    intersectObservedElement();
    unmount();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(card.classList.contains("visible")).toBe(false);
    expect(disconnectSpy).toHaveBeenCalledOnce();
  });

  it("기존 transition delay를 보존하며 section reveal은 단일 animation frame에 완료한다", () => {
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      })
    );

    render(<SectionRevealHarness />);
    const card = observedElement?.querySelector("[data-testid='section-card']") as HTMLElement;

    intersectObservedElement();
    expect(card.style.transitionDelay).toBe("125ms");
    expect(frames).toHaveLength(1);

    act(() => {
      frames[0](0);
    });

    expect(card.classList.contains("visible")).toBe(true);
  });

  it("unmount 시 대기 중인 section animation frame을 취소한다", () => {
    const frames: FrameRequestCallback[] = [];
    const cancelAnimationFrameSpy = vi.fn();
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        frames.push(callback);
        return frames.length;
      })
    );
    vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameSpy);

    const { unmount } = render(<SectionRevealHarness />);
    const card = observedElement?.querySelector("[data-testid='section-card']") as HTMLElement;

    intersectObservedElement();
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1);
    act(() => {
      frames[0](0);
    });
    expect(card.classList.contains("visible")).toBe(false);
  });
});
