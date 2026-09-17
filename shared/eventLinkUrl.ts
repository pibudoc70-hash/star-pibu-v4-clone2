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
