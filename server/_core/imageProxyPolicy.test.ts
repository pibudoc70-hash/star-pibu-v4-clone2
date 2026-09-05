import { describe, expect, it } from "vitest";
import {
  getSafeImageContentType,
  getSafeStorageContentType,
  isAllowedPopupImageUrl,
  isAllowedStorageUrl,
} from "./imageProxyPolicy";

describe("image proxy policy", () => {
  it("실제 presigned 스토리지 host의 HTTPS URL만 허용한다", () => {
    expect(isAllowedStorageUrl("https://d36hbw14aib5lz.cloudfront.net/file.webp")).toBe(true);
    expect(isAllowedStorageUrl("http://d36hbw14aib5lz.cloudfront.net/file.webp")).toBe(false);
    expect(isAllowedStorageUrl("https://d36hbw14aib5lz.cloudfront.net.evil.example/file.webp")).toBe(false);
    expect(isAllowedStorageUrl("https://user@d36hbw14aib5lz.cloudfront.net/file.webp")).toBe(false);
  });

  it("팝업은 실제 CloudFront와 YouTube 호스트만 HTTPS로 허용한다", () => {
    expect(isAllowedPopupImageUrl("https://d2xsxph8kpxj0f.cloudfront.net/popup.webp")).toBe(true);
    expect(isAllowedPopupImageUrl("https://img.youtube.com/vi/id/hqdefault.jpg")).toBe(true);
    expect(isAllowedPopupImageUrl("https://other.cloudfront.net/popup.webp")).toBe(false);
    expect(isAllowedPopupImageUrl("https://d2xsxph8kpxj0f.cloudfront.net.evil.example/popup.webp")).toBe(false);
  });

  it("스토리지 응답은 확장자와 일치하는 안전 MIME만 허용한다", () => {
    expect(getSafeStorageContentType("photo.webp", "image/webp; charset=binary")).toBe("image/webp");
    expect(getSafeStorageContentType("photo.webp", "text/html")).toBeNull();
    expect(getSafeStorageContentType("photo.png", "image/jpeg")).toBeNull();
    expect(getSafeStorageContentType("document.pdf", "application/pdf")).toBe("application/pdf");
    expect(getSafeStorageContentType("PretendardVariable.woff2", "font/woff2")).toBe("font/woff2");
    expect(getSafeStorageContentType("PretendardVariable.woff2", "application/octet-stream")).toBeNull();
    expect(
      getSafeStorageContentType(
        "PretendardVariable.woff2",
        "application/octet-stream",
        Uint8Array.from([0x77, 0x4f, 0x46, 0x32, 0x00]),
      ),
    ).toBe("font/woff2");
    expect(
      getSafeStorageContentType(
        "PretendardVariable.woff2",
        "application/octet-stream",
        Uint8Array.from([0x3c, 0x68, 0x74, 0x6d, 0x6c]),
      ),
    ).toBeNull();
    expect(getSafeStorageContentType("asset.svg", "image/svg+xml")).toBeNull();
  });

  it("팝업·YouTube upstream은 안전한 래스터 이미지 MIME만 허용한다", () => {
    expect(getSafeImageContentType("image/jpeg")).toBe("image/jpeg");
    expect(getSafeImageContentType("image/webp; charset=binary")).toBe("image/webp");
    expect(getSafeImageContentType("text/html")).toBeNull();
    expect(getSafeImageContentType("image/svg+xml")).toBeNull();
  });
});
