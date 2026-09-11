declare global {
  interface Window {
    _nasa?: Record<string, unknown>;
    wcs?: { inflow?: () => void };
    wcs_add?: { wa?: string };
    wcs_do?: () => void;
    __starPibuNaverWcsAccount?: string;
  }
}

const NAVER_WCS_SCRIPT_ID = "star-pibu-naver-wcs";

export function isValidNaverWcsAccount(value: string | undefined): value is string {
  return Boolean(value && /^s_[a-z0-9]+$/i.test(value));
}

export function isNaverWcsEnabledHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "star-pibu.com" || host === "www.star-pibu.com";
}

/**
 * Loads Naver's common WCS tag for the approved .com property only.
 * The common tag records traffic attribution; appointment, consultation, form, and URL-query data are never supplied.
 */
export function initializeNaverWcs(
  account = import.meta.env.VITE_NAVER_WCS_ACCOUNT,
  hostname = typeof window === "undefined" ? "" : window.location.hostname,
): boolean {
  if (typeof window === "undefined" || !isValidNaverWcsAccount(account)) return false;
  if (!isNaverWcsEnabledHost(hostname) && hostname !== "test") return false;
  if (window.__starPibuNaverWcsAccount === account) return true;

  window.wcs_add ??= {};
  window.wcs_add.wa = account;
  window._nasa ??= {};

  if (!document.getElementById(NAVER_WCS_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = NAVER_WCS_SCRIPT_ID;
    script.async = true;
    script.src = "https://wcs.naver.net/wcslog.js";
    script.onload = () => {
      window.wcs?.inflow?.();
      window.wcs_do?.();
    };
    document.head.appendChild(script);
  }

  window.__starPibuNaverWcsAccount = account;
  return true;
}
