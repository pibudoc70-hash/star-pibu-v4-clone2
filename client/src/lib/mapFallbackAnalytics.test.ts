import { afterEach, describe, expect, it, vi } from "vitest";
import { trackMapFallback } from "./mapFallbackAnalytics";

describe("trackMapFallback", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends only the map fallback event, locale, and surface to Umami", () => {
    const track = vi.fn();
    vi.stubGlobal("umami", { track });

    trackMapFallback({ locale: "en", surface: "directions" });

    expect(track).toHaveBeenCalledWith("map_fallback_shown", {
      locale: "en",
      surface: "directions",
    });
  });

  it("does nothing when Umami is unavailable", () => {
    expect(() => trackMapFallback({ locale: "ko", surface: "directions" })).not.toThrow();
  });
});
