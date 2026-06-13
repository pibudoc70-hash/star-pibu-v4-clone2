/**
 * treatments.service.test.ts — treatments.service 유스케이스 단위 테스트
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── 모킹 ─────────────────────────────────────────────────────────────────────
vi.mock("../storage", () => ({
  storagePut: vi.fn(),
}));

import { normalizeTreatmentCreatePayload, uploadTreatmentImage } from "./treatments.service";
import { storagePut } from "../storage";

const mockStoragePut = vi.mocked(storagePut);

// ── normalizeTreatmentCreatePayload ───────────────────────────────────────────
describe("normalizeTreatmentCreatePayload", () => {
  const minimalInput = {
    categoryId: "cat-1",
    name: "테스트 시술",
    nameEn: "Test Treatment",
    desc: "설명",
    time: "30분",
    recovery: "없음",
  };

  it("badge 미입력 시 빈 문자열로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.badge).toBe("");
  });

  it("badgeColor 미입력 시 기본 색상 #4A6FA5로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.badgeColor).toBe("#4A6FA5");
  });

  it("images 미입력 시 빈 문자열로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.images).toBe("");
  });

  it("best 미입력 시 '0'으로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.best).toBe("0");
  });

  it("section 미입력 시 'v1'으로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.section).toBe("v1");
  });

  it("sortOrder 미입력 시 0으로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.sortOrder).toBe(0);
  });

  it("isActive 미입력 시 '1'로 보정한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.isActive).toBe("1");
  });

  it("명시적으로 입력한 값은 덮어쓰지 않는다", () => {
    const result = normalizeTreatmentCreatePayload({
      ...minimalInput,
      badge: "추천",
      badgeColor: "#FF0000",
      best: "1",
      section: "v2",
      sortOrder: 5,
      isActive: "0",
    });
    expect(result.badge).toBe("추천");
    expect(result.badgeColor).toBe("#FF0000");
    expect(result.best).toBe("1");
    expect(result.section).toBe("v2");
    expect(result.sortOrder).toBe(5);
    expect(result.isActive).toBe("0");
  });

  it("원본 입력 필드를 그대로 포함한다", () => {
    const result = normalizeTreatmentCreatePayload(minimalInput);
    expect(result.categoryId).toBe("cat-1");
    expect(result.name).toBe("테스트 시술");
    expect(result.desc).toBe("설명");
  });
});

// ── uploadTreatmentImage ──────────────────────────────────────────────────────
describe("uploadTreatmentImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("유효한 base64 이미지를 업로드하고 url을 반환한다", async () => {
    // 1×1 투명 PNG (base64)
    const tinyPng =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockStoragePut.mockResolvedValue({ key: "treatments/test.png", url: "/manus-storage/test.png" } as never);

    const result = await uploadTreatmentImage({
      base64: tinyPng,
      fileName: "test.png",
      mimeType: "image/png",
    });

    expect(result.url).toBe("/manus-storage/test.png");
    expect(mockStoragePut).toHaveBeenCalledOnce();
    const [key, , mime] = mockStoragePut.mock.calls[0];
    expect(key).toMatch(/^treatments\//);
    expect(mime).toBe("image/png");
  });

  it("data URL 접두사(data:image/jpeg;base64,...)를 자동으로 제거한다", async () => {
    const tinyPng =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockStoragePut.mockResolvedValue({ key: "treatments/t.jpg", url: "/manus-storage/t.jpg" } as never);

    await uploadTreatmentImage({
      base64: `data:image/jpeg;base64,${tinyPng}`,
      fileName: "photo.jpg",
      mimeType: "image/jpeg",
    });

    expect(mockStoragePut).toHaveBeenCalledOnce();
  });

  it("5MB 초과 이미지는 에러를 던진다", async () => {
    // 6MB 상당의 base64 문자열 생성
    const oversizedBase64 = "A".repeat(6 * 1024 * 1024 * 4 / 3);

    await expect(
      uploadTreatmentImage({
        base64: oversizedBase64,
        fileName: "big.jpg",
        mimeType: "image/jpeg",
      }),
    ).rejects.toThrow("이미지 파일 크기는 5MB 이하여야 합니다.");

    expect(mockStoragePut).not.toHaveBeenCalled();
  });

  it("mimeType 미입력 시 image/jpeg를 기본값으로 사용한다", async () => {
    const tinyPng =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockStoragePut.mockResolvedValue({ key: "treatments/t.jpg", url: "/manus-storage/t.jpg" } as never);

    await uploadTreatmentImage({ base64: tinyPng, fileName: "photo.jpg" });

    const [, , mime] = mockStoragePut.mock.calls[0];
    expect(mime).toBe("image/jpeg");
  });

  it("storagePut 실패 시 에러를 전파한다", async () => {
    const tinyPng =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockStoragePut.mockRejectedValue(new Error("Storage unavailable") as never);

    await expect(
      uploadTreatmentImage({ base64: tinyPng, fileName: "photo.jpg" }),
    ).rejects.toThrow("Storage unavailable");
  });
});
