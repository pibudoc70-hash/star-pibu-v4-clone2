import { describe, expect, it } from "vitest";

describe("Naver WCS account configuration", () => {
  it("loads the official WCS script with the configured account context", async () => {
    const account = process.env.VITE_NAVER_WCS_ACCOUNT;
    expect(account).toMatch(/^s_[a-z0-9]+$/i);

    const response = await fetch(`https://wcs.naver.net/wcslog.js?wa=${encodeURIComponent(account!)}`);
    expect(response.ok).toBe(true);
    expect(response.headers.get("content-type")).toMatch(/javascript|text\/plain/i);
  }, 20_000);
});
