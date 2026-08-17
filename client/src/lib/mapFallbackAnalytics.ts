type MapFallbackEvent = {
  locale: string;
  surface: "directions";
};

type UmamiTracker = {
  track?: (eventName: string, data: MapFallbackEvent) => void;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

/** Emits no user identifiers, URL, or address data. */
export function trackMapFallback(data: MapFallbackEvent) {
  if (typeof window === "undefined") return;

  window.umami?.track?.("map_fallback_shown", data);
}
