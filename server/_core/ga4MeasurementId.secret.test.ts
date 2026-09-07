import { describe, expect, it } from "vitest";

describe("configured GA4 measurement ID", () => {
  it("loads the Google tag script through the configured measurement ID", async () => {
    const measurementId = process.env.VITE_GA4_MEASUREMENT_ID;

    expect(measurementId).toMatch(/^G-[A-Z0-9]+$/);

    const response = await fetch(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId!)}`,
    );

    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toContain("javascript");
  }, 15_000);
});
