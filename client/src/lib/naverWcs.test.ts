import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeNaverWcs, isNaverWcsEnabledHost, isValidNaverWcsAccount } from "./naverWcs";

afterEach(() => {
  document.head.querySelector("#star-pibu-naver-wcs")?.remove();
  delete window._nasa;
  delete window.wcs;
  delete window.wcs_add;
  delete window.wcs_do;
  delete window.__starPibuNaverWcsAccount;
});

describe("Naver WCS browser tracker", () => {
  it("accepts a Naver WCS account ID only", () => {
    expect(isValidNaverWcsAccount("s_248ada83bcd2")).toBe(true);
    expect(isValidNaverWcsAccount("G-3CFK5RHK4T")).toBe(false);
    expect(isValidNaverWcsAccount(undefined)).toBe(false);
  });

  it("enables the .com tracker only on configured public hostnames", () => {
    expect(isNaverWcsEnabledHost("star-pibu.com")).toBe(true);
    expect(isNaverWcsEnabledHost("www.star-pibu.com")).toBe(true);
    expect(isNaverWcsEnabledHost("star-pibu.co.kr")).toBe(false);
    expect(isNaverWcsEnabledHost("starpibu-qdq7tysk.manus.space")).toBe(false);
  });

  it("sets the approved account and inserts one common script only", () => {
    expect(initializeNaverWcs("s_248ada83bcd2", "test")).toBe(true);
    expect(initializeNaverWcs("s_248ada83bcd2", "test")).toBe(true);

    expect(window.wcs_add).toEqual({ wa: "s_248ada83bcd2" });
    expect(document.querySelectorAll("#star-pibu-naver-wcs")).toHaveLength(1);
    expect(document.querySelector<HTMLScriptElement>("#star-pibu-naver-wcs")?.src).toBe("https://wcs.naver.net/wcslog.js");
  });

  it("runs the official inflow and common tracking calls only after the script loads", () => {
    const inflow = vi.fn();
    const wcsDo = vi.fn();
    window.wcs = { inflow };
    window.wcs_do = wcsDo;

    initializeNaverWcs("s_248ada83bcd2", "test");
    document.querySelector<HTMLScriptElement>("#star-pibu-naver-wcs")?.onload?.(new Event("load"));

    expect(inflow).toHaveBeenCalledOnce();
    expect(wcsDo).toHaveBeenCalledOnce();
  });
});
