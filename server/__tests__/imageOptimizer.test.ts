/**
 * imageOptimizer.test.ts
 * server/_core/imageOptimizer.ts 유닛 테스트
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// sharp mock
vi.mock("sharp", () => {
  const mockInstance = {
    metadata: vi.fn().mockResolvedValue({ width: 2000, height: 1500, format: "jpeg" }),
    resize: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("webp-data")),
  };
  const sharpFn = vi.fn(() => mockInstance);
  return { default: sharpFn };
});

import { optimizeImage } from "../_core/imageOptimizer";

describe("optimizeImage", () => {
  const LARGE_BUFFER = Buffer.alloc(100 * 1024, 0xff); // 100KB

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("PNG 파일을 WebP로 변환하고 파일명 확장자를 .webp로 교체한다", async () => {
    const result = await optimizeImage(LARGE_BUFFER, "photo.png", "image/png");
    expect(result.mimeType).toBe("image/webp");
    expect(result.fileName).toBe("photo.webp");
    expect(result.buffer).toBeDefined();
  });

  it("JPEG 파일을 WebP로 변환한다", async () => {
    const result = await optimizeImage(LARGE_BUFFER, "photo.jpg", "image/jpeg");
    expect(result.mimeType).toBe("image/webp");
    expect(result.fileName).toBe("photo.webp");
  });

  it("이미 WebP인 파일은 포맷 유지 (리사이즈만)", async () => {
    const result = await optimizeImage(LARGE_BUFFER, "photo.webp", "image/webp");
    expect(result.mimeType).toBe("image/webp");
    expect(result.fileName).toBe("photo.webp");
  });

  it("SVG 파일은 pass-through (변환 없음)", async () => {
    const svgBuffer = Buffer.from("<svg></svg>");
    const result = await optimizeImage(svgBuffer, "icon.svg", "image/svg+xml");
    expect(result.mimeType).toBe("image/svg+xml");
    expect(result.fileName).toBe("icon.svg");
    expect(result.buffer).toBe(svgBuffer);
  });

  it("GIF 파일은 pass-through (변환 없음)", async () => {
    const gifBuffer = Buffer.alloc(100 * 1024, 0x47);
    const result = await optimizeImage(gifBuffer, "anim.gif", "image/gif");
    expect(result.mimeType).toBe("image/gif");
    expect(result.fileName).toBe("anim.gif");
    expect(result.buffer).toBe(gifBuffer);
  });

  it("50KB 미만 파일은 pass-through", async () => {
    const smallBuffer = Buffer.alloc(30 * 1024, 0xff); // 30KB
    const result = await optimizeImage(smallBuffer, "small.png", "image/png");
    expect(result.mimeType).toBe("image/png");
    expect(result.buffer).toBe(smallBuffer);
  });

  it("originalSize와 optimizedSize를 반환한다", async () => {
    const result = await optimizeImage(LARGE_BUFFER, "photo.png", "image/png");
    expect(result.originalSize).toBe(LARGE_BUFFER.length);
    expect(result.optimizedSize).toBeGreaterThan(0);
  });

  it("sharp 실패 시 원본 buffer를 그대로 반환한다 (throw 없음)", async () => {
    const { default: sharp } = await import("sharp");
    (sharp as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error("sharp 로드 실패");
    });
    const result = await optimizeImage(LARGE_BUFFER, "photo.png", "image/png");
    expect(result.buffer).toBe(LARGE_BUFFER);
    expect(result.mimeType).toBe("image/png");
  });

  it("파일명에 점이 여러 개 있어도 마지막 확장자만 교체한다", async () => {
    const result = await optimizeImage(LARGE_BUFFER, "photo.2024.01.jpg", "image/jpeg");
    expect(result.fileName).toBe("photo.2024.01.webp");
  });
});
