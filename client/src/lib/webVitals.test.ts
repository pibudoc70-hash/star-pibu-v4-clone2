import { afterEach, describe, expect, it, vi } from "vitest";
import { trackWebVital } from "./webVitals";

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
});
