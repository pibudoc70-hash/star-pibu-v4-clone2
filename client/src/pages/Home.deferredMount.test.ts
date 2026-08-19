import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { DeferredMount } from "../components/DeferredMount";

const homeSource = readFileSync(join(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const deferredMountSource = readFileSync(
  join(process.cwd(), "client/src/components/DeferredMount.tsx"),
  "utf8",
);

describe("Home below-the-fold deferred mount contract", () => {
  it("defers non-anchor sections behind an intersection observer while preserving fallbacks", () => {
    expect(deferredMountSource).toContain("IntersectionObserver");
    expect(deferredMountSource).toContain('rootMargin = "400px 0px"');
    expect(deferredMountSource).toContain("shouldMount ? children : fallback");

    for (const section of [
      "ManagementDevicesSection",
      "PhilosophySection",
      "ResultsStatisticsSection",
      "YouTubeSection",
      "FAQSection",
      "RecentNoticesSection",
    ]) {
      expect(homeSource).toMatch(
        new RegExp(`<DeferredMount fallback=\\{<SectionFallback \\{\\.\\.\\.HOME_SECTION_FALLBACKS\\.[^}]+\\} />\\}>[\\s\\S]*?<${section}`),
      );
    }
  });

  it("mounts a subtree only after its observer enters the viewport margin", () => {
    let callback: IntersectionObserverCallback | undefined;
    const originalObserver = globalThis.IntersectionObserver;
    const reactTestEnvironment = globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean;
    };
    const originalActEnvironment = reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT;
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.IntersectionObserver = class {
      constructor(nextCallback: IntersectionObserverCallback) {
        callback = nextCallback;
      }
      disconnect() {}
      observe() {}
      root = null;
      rootMargin = "400px 0px";
      thresholds = [];
      takeRecords() { return []; }
      unobserve() {}
    } as typeof IntersectionObserver;

    const container = document.createElement("div");
    const root = createRoot(container);

    act(() => {
      root.render(
        createElement(
          DeferredMount,
          { fallback: createElement("div", { "data-testid": "fallback" }) },
          createElement("div", { "data-testid": "deferred-content" }),
        ),
      );
    });

    expect(container.querySelector('[data-testid="fallback"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="deferred-content"]')).toBeNull();

    act(() => {
      callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(container.querySelector('[data-testid="deferred-content"]')).not.toBeNull();
    act(() => root.unmount());
    globalThis.IntersectionObserver = originalObserver;
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
  });
});
