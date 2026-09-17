export function normalizeEventLinkUrl(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

/** Returns true only for non-empty absolute http(s) URLs. */
export function isEventLinkUrl(value: string | null | undefined): boolean {
  const normalized = normalizeEventLinkUrl(value);
  if (!normalized) return false;

  try {
    const parsed = new URL(normalized);
    return (parsed.protocol === "http:" || parsed.protocol === "https:") && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

const STAR_PIBU_HOSTS = new Set([
  "star-pibu.com",
  "www.star-pibu.com",
  "star-pibu.co.kr",
  "www.star-pibu.co.kr",
]);

/**
 * Keeps saved internal links on the visitor's current verified site origin.
 * External URLs remain absolute, while saved star-pibu.com/.co.kr notice links
 * become same-origin paths to avoid crossing between equivalent public domains.
 */
export function getEventLinkHref(value: string | null | undefined): string {
  const normalized = normalizeEventLinkUrl(value);
  if (!isEventLinkUrl(normalized)) return "";

  const parsed = new URL(normalized);
  if (STAR_PIBU_HOSTS.has(parsed.hostname.toLowerCase())) {
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  return normalized;
}
