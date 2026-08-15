import { describe, expect, it } from "vitest";
import { EXTERNAL_BOOKING_URLS, isSafeExternalBookingUrl } from "./externalBooking";

describe("externalBooking", () => {
  it("uses HTTPS external booking and consultation destinations only", () => {
    expect(EXTERNAL_BOOKING_URLS.naver).toBe("https://booking.naver.com/booking/13/bizes/209080");
    expect(isSafeExternalBookingUrl(EXTERNAL_BOOKING_URLS.naver)).toBe(true);
    expect(isSafeExternalBookingUrl(EXTERNAL_BOOKING_URLS.kakao)).toBe(true);
  });

  it("rejects non-HTTPS and internal reservation paths", () => {
    expect(isSafeExternalBookingUrl("http://example.com")).toBe(false);
    expect(isSafeExternalBookingUrl("#reservation")).toBe(false);
  });
});
