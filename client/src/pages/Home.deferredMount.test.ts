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
      "SpecialEventSection",
      "DoctorsSection",
      "TreatmentsEquipmentSection",
      "ManagementDevicesSection",
      "PhilosophySection",
      "ResultsStatisticsSection",
      "FacilitySection",
      "YouTubeSection",
      "FAQSection",
      "RecentNoticesSection",
      "ContactSection",
    ]) {
      expect(homeSource).toMatch(
        new RegExp(`<DeferredMount[\\s\\S]*?<${section}`),
      );
    }
  });

  it("keeps the below-fold Google Maps iframe behind ContactSection's deferred mount", () => {
    expect(homeSource).toMatch(/<DeferredMount[\s\S]*?<ContactSection/);
  });

  it("mounts deferred anchor targets without a page-bottom jump", () => {
    const anchorSelectors = ["#events", "#facility", "#management-devices", "#results-statistics", "#faq"];

    expect(deferredMountSource).toContain("anchorSelectors");
    expect(deferredMountSource).toContain('"star-pibu:mount-anchor"');

    for (const selector of anchorSelectors) {
      expect(homeSource).toMatch(
        new RegExp(`anchorSelectors=\\{\\[[^\\]]*"${selector}"`),
      );
    }

    expect(homeSource).toContain('telemetrySurface="home_events"');
    expect(homeSource).toContain('telemetrySurface="home_facility"');
  });

  it("pre-mounts lazy sections above facility before the facility anchor starts scrolling", () => {
    for (const section of [
      "DoctorsSection",
      "TreatmentsEquipmentSection",
      "ManagementDevicesSection",
      "PhilosophySection",
      "ResultsStatisticsSection",
    ]) {
      expect(homeSource).toMatch(
        new RegExp(`<DeferredMount[\\s\\S]*?anchorSelectors=\\{\\[[^\\]]*"#facility"[^\\]]*\\]\\}[\\s\\S]*?<${section}`),
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

  it("mounts an anchor-targeted subtree when anchor scroll requests it", () => {
    const reactTestEnvironment = globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean;
    };
    const originalActEnvironment = reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT;
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
    const originalObserver = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
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
          {
            fallback: createElement("div", { "data-testid": "fallback" }),
            anchorSelectors: ["#faq"],
          },
          createElement("section", { id: "faq", "data-testid": "faq-content" }),
        ),
      );
    });

    act(() => {
      window.dispatchEvent(
        new CustomEvent("star-pibu:mount-anchor", { detail: { selector: "#faq" } }),
      );
    });

    expect(container.querySelector('[data-testid="faq-content"]')).not.toBeNull();
    act(() => root.unmount());
    globalThis.IntersectionObserver = originalObserver;
    reactTestEnvironment.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
  });
});
