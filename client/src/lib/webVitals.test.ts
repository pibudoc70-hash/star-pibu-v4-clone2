import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEventSkeleton, trackLazyMount, trackTreatmentsSkeleton, trackWebVital } from "./webVitals";

describe("trackWebVital", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.lang = "";
  });

  it("metric·rounded value·locale만 Umami web_vital event로 전송한다", () => {
    const track = vi.fn();
    document.documentElement.lang = "ko";
    vi.stubGlobal("umami", { track });

    trackWebVital("lcp", 1234.7);

    expect(track).toHaveBeenCalledWith("web_vital", {
      metric: "lcp",
      value: 1235,
      locale: "ko",
    });
  });

  it("Umami가 없거나 metric value가 유효하지 않으면 예외 없이 무시한다", () => {
    expect(() => trackWebVital("inp", Number.NaN)).not.toThrow();
    expect(() => trackWebVital("inp", 32)).not.toThrow();
  });

  it("lazy mount는 표면 이름·반올림한 시간·locale만 전송하고 selector나 URL을 포함하지 않는다", () => {
    const track = vi.fn();
    document.documentElement.lang = "zh-Hant";
    vi.stubGlobal("umami", { track });

    trackLazyMount("home_events", 47.6);

    expect(track).toHaveBeenCalledWith("lazy_mount", {
      metric: "lazy_mount",
      value: 48,
      locale: "zh-Hant",
      surface: "home_events",
    });
  });

  it("EVENT skeleton은 고정 surface·반올림한 시간·locale만 전송한다", () => {
    const track = vi.fn();
    document.documentElement.lang = "ko";
    vi.stubGlobal("umami", { track });

    trackEventSkeleton(81.2);

    expect(track).toHaveBeenCalledWith("event_skeleton", {
      metric: "event_skeleton",
      value: 81,
      locale: "ko",
      surface: "home_special_event",
    });
  });

  it("시술·장비 skeleton은 고정 surface·반올림한 시간·locale만 전송한다", () => {
    const track = vi.fn();
    document.documentElement.lang = "ja";
    vi.stubGlobal("umami", { track });

    trackTreatmentsSkeleton(205.8);

    expect(track).toHaveBeenCalledWith("treatments_skeleton", {
      metric: "treatments_skeleton",
      value: 206,
      locale: "ja",
      surface: "home_treatments_equipment",
    });
  });
});
