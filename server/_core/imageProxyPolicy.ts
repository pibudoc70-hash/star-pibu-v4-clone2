const STORAGE_HOSTS = new Set([
  "d36hbw14aib5lz.cloudfront.net",
]);

const POPUP_IMAGE_HOSTS = new Set([
  "d2xsxph8kpxj0f.cloudfront.net",
  "img.youtube.com",
]);

const SAFE_IMAGE_CONTENT_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/vnd.microsoft.icon",
  "image/webp",
  "image/x-icon",
]);

const STORAGE_CONTENT_TYPES: Record<string, readonly string[]> = {
  avif: ["image/avif"],
  gif: ["image/gif"],
  ico: ["image/x-icon", "image/vnd.microsoft.icon"],
  jpeg: ["image/jpeg"],
  jpg: ["image/jpeg"],
  mp4: ["video/mp4"],
  pdf: ["application/pdf"],
  png: ["image/png"],
  woff2: ["font/woff2"],
  webm: ["video/webm"],
  webp: ["image/webp"],
};

function parseApprovedHttpsUrl(rawUrl: string): URL | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || url.port || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function normalizeContentType(value: string | null): string | null {
  const type = value?.split(";", 1)[0]?.trim().toLowerCase();
  return type || null;
}

export function isAllowedStorageUrl(rawUrl: string): boolean {
  const url = parseApprovedHttpsUrl(rawUrl);
  return Boolean(url && STORAGE_HOSTS.has(url.hostname));
}

export function isAllowedPopupImageUrl(rawUrl: string): boolean {
  const url = parseApprovedHttpsUrl(rawUrl);
  return Boolean(url && POPUP_IMAGE_HOSTS.has(url.hostname));
}

export function getSafeStorageContentType(key: string, header: string | null): string | null {
  const extension = key.split(".").pop()?.toLowerCase() ?? "";
  const actual = normalizeContentType(header);
  const allowed = STORAGE_CONTENT_TYPES[extension];
  return actual && allowed?.includes(actual) ? actual : null;
}

export function getSafeImageContentType(header: string | null): string | null {
  const actual = normalizeContentType(header);
  return actual && SAFE_IMAGE_CONTENT_TYPES.has(actual) ? actual : null;
}
