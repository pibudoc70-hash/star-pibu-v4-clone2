import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeGa4, isGa4EnabledHost, isValidGa4MeasurementId, trackGa4PageView } from "./ga4";

afterEach(() => {
  document.head.querySelector("#star-pibu-ga4")?.remove();
  delete window.dataLayer;
  delete window.gtag;
  delete window.__starPibuGa4MeasurementId;
});

describe("GA4 browser tracker", () => {
  it("accepts only GA4 measurement IDs", () => {
    expect(isValidGa4MeasurementId("G-3CFK5RHK4T")).toBe(true);
    expect(isValidGa4MeasurementId("AW-123456")).toBe(false);
    expect(isValidGa4MeasurementId(undefined)).toBe(false);
  });

  it("enables the .com stream only on configured public hostnames", () => {
    expect(isGa4EnabledHost("star-pibu.com")).toBe(true);
    expect(isGa4EnabledHost("www.star-pibu.com")).toBe(true);
    expect(isGa4EnabledHost("star-pibu.co.kr")).toBe(false);
    expect(isGa4EnabledHost("starpibu-qdq7tysk.manus.space")).toBe(false);
  });

  it("queues one no-auto-pageview config and one tag script", () => {
    expect(initializeGa4("G-TEST123", "test")).toBe(true);
    expect(initializeGa4("G-TEST123", "test")).toBe(true);

    expect(document.querySelectorAll("#star-pibu-ga4")).toHaveLength(1);
    expect(document.querySelector<HTMLScriptElement>("#star-pibu-ga4")?.src).toContain("id=G-TEST123");
    expect(window.dataLayer?.filter(([command]) => command === "config")).toHaveLength(1);
    expect(window.dataLayer).toContainEqual([
      "config",
      "G-TEST123",
      {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      },
    ]);
  });

  it("sends page routes without query strings or hashes", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    trackGa4PageView("/zh/treatments/ulthera?phone=secret#faq", "zh");

    expect(gtag).toHaveBeenCalledWith("event", "page_view", expect.objectContaining({
      page_path: "/zh/treatments/ulthera",
      page_location: `${window.location.origin}/zh/treatments/ulthera`,
      language: "zh",
    }));
  });
});
