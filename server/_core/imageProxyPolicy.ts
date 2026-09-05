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

export const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

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

function hasWoff2Signature(value: Uint8Array | undefined): boolean {
  return Boolean(
    value &&
      value.byteLength >= 4 &&
      value[0] === 0x77 &&
      value[1] === 0x4f &&
      value[2] === 0x46 &&
      value[3] === 0x32,
  );
}

export function isAllowedStorageUrl(rawUrl: string): boolean {
  const url = parseApprovedHttpsUrl(rawUrl);
  return Boolean(url && STORAGE_HOSTS.has(url.hostname));
}

export function isAllowedPopupImageUrl(rawUrl: string): boolean {
  const url = parseApprovedHttpsUrl(rawUrl);
  return Boolean(url && POPUP_IMAGE_HOSTS.has(url.hostname));
}

export function isValidYouTubeVideoId(videoId: string): boolean {
  return YOUTUBE_VIDEO_ID_PATTERN.test(videoId);
}

export function getSafeStorageContentType(
  key: string,
  header: string | null,
  body?: Uint8Array,
): string | null {
  const extension = key.split(".").pop()?.toLowerCase() ?? "";
  const actual = normalizeContentType(header);
  const allowed = STORAGE_CONTENT_TYPES[extension];
  if (actual && allowed?.includes(actual)) return actual;

  // 일부 스토리지 객체는 정상 WOFF2 바이트를 application/octet-stream으로 반환한다.
  // 파일 확장자·매직 바이트가 모두 일치할 때만 안전한 폰트 MIME으로 정규화한다.
  if (extension === "woff2" && actual === "application/octet-stream" && hasWoff2Signature(body)) {
    return "font/woff2";
  }

  return null;
}

export function getSafeImageContentType(header: string | null): string | null {
  const actual = normalizeContentType(header);
  return actual && SAFE_IMAGE_CONTENT_TYPES.has(actual) ? actual : null;
}
