import { act, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DeferredMount } from "./DeferredMount";

const { trackLazyMount } = vi.hoisted(() => ({ trackLazyMount: vi.fn() }));

vi.mock("@/lib/webVitals", () => ({ trackLazyMount }));

class IntersectionObserverMock {
  observe() {}
  disconnect() {}
}

describe("DeferredMount anchor telemetry", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 0));
    vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));
    trackLazyMount.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = "";
  });

  it("anchor request 뒤 target이 mount되면 고정 surface와 익명 duration만 기록한다", async () => {
    render(
      <DeferredMount
        fallback={<div>loading</div>}
        anchorSelectors={["#events"]}
        telemetrySurface="home_events"
      >
        <section id="events">event target</section>
      </DeferredMount>,
    );

    await act(async () => {
      window.dispatchEvent(new CustomEvent("star-pibu:mount-anchor", { detail: { selector: "#events" } }));
    });

    await waitFor(() => expect(screen.getByText("event target")).toBeInTheDocument());
    await waitFor(() => expect(trackLazyMount).toHaveBeenCalledWith("home_events", expect.any(Number)));
  });

  it("observer-driven mount는 anchor timing event를 전송하지 않는다", async () => {
    render(
      <DeferredMount fallback={<div>loading</div>} telemetrySurface="home_events">
        <section id="events">event target</section>
      </DeferredMount>,
    );

    await new Promise((resolve) => window.setTimeout(resolve, 20));

    expect(trackLazyMount).not.toHaveBeenCalled();
  });
});
