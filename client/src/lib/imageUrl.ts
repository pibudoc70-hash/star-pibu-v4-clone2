/**
 * 이미지 URL 캐시 무효화 유틸.
 *
 * 관리자가 이미지를 수정/재업로드하면 DB의 updatedAt(timestamp)이 갱신된다.
 * 이 값을 URL 쿼리스트링 ?v= 로 붙이면 브라우저·CDN·서버 캐시가 새 URL로 인식하여
 * 즉시 새 이미지를 가져온다.
 *
 * 서버(storageProxy)는 ?v= 가 붙은 URL을 immutable(1년) 로 캐시하고,
 * 없는 URL은 짧게(1분) 캐시하도록 설정되어 있다.
 */

/**
 * 이미지 URL에 버전 파라미터를 부착한다.
 * @param url 원본 이미지 URL. null/undefined/빈문자열이면 빈문자열 반환.
 * @param version DB의 updatedAt(number) 또는 임의 문자열. falsy면 원본 그대로 반환.
 * @returns 예: "/api/storage/foo.webp?v=lqz3k1"
 */
export function withVersion(
  url: string | null | undefined,
  version: number | string | Date | null | undefined,
): string {
  if (!url) return "";
  if (version === null || version === undefined || version === "" || version === 0) {
    return url;
  }
  const separator = url.includes("?") ? "&" : "?";
  const v =
    version instanceof Date
      ? Math.floor(version.getTime()).toString(36)
      : typeof version === "number"
      ? Math.floor(version).toString(36) // 짧은 문자열로 변환
      : String(version);
  return `${url}${separator}v=${encodeURIComponent(v)}`;
}

/**
 * srcSet 문자열의 각 URL에 버전을 부착한다.
 * 예: "img1.webp 1x, img2.webp 2x" → "img1.webp?v=abc 1x, img2.webp?v=abc 2x"
 */
export function withVersionSrcSet(
  srcSet: string | null | undefined,
  version: number | string | Date | null | undefined,
): string {
  if (!srcSet) return "";
  return srcSet
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const [url, ...descriptors] = trimmed.split(/\s+/);
      const versioned = withVersion(url, version);
      return descriptors.length ? `${versioned} ${descriptors.join(" ")}` : versioned;
    })
    .join(", ");
}
