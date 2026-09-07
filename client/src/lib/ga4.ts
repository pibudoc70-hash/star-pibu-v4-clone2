type GtagCommand = "config" | "event" | "js" | "set";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (command: GtagCommand, ...args: unknown[]) => void;
    __starPibuGa4MeasurementId?: string;
  }
}

const GOOGLE_TAG_SCRIPT_ID = "star-pibu-ga4";

export function isValidGa4MeasurementId(value: string | undefined): value is string {
  return Boolean(value && /^G-[A-Z0-9]+$/.test(value));
}

export function isGa4EnabledHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "star-pibu.com" || host === "www.star-pibu.com";
}

/**
 * Initializes GA4 without collecting form values, contact details, query strings, or hashes.
 * Google Signals and ad-personalization signals stay disabled until a separate Ads consent scope
 * is approved and implemented.
 */
export function initializeGa4(
  measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID,
  hostname = typeof window === "undefined" ? "" : window.location.hostname,
): boolean {
  if (typeof window === "undefined" || !isValidGa4MeasurementId(measurementId)) return false;
  if (!isGa4EnabledHost(hostname) && hostname !== "test") return false;

  if (window.__starPibuGa4MeasurementId === measurementId) return true;

  window.dataLayer ??= [];
  window.gtag ??= (command, ...args) => {
    window.dataLayer?.push([command, ...args]);
  };

  if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_TAG_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  window.__starPibuGa4MeasurementId = measurementId;
  return true;
}

/** Sends only route-level context for SPA navigation; query strings and hashes are deliberately excluded. */
export function trackGa4PageView(location: string, locale: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  const pagePath = location.split(/[?#]/, 1)[0] || "/";

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
    language: locale,
  });
}
