/**
 * otp.cooldown.test.ts — isOtpCooldown Repository 헬퍼 단위 테스트
 *
 * 검증 대상:
 *  - 최근 60초 이내 OTP가 있으면 true 반환
 *  - 60초 초과 OTP만 있으면 false 반환
 *  - DB 연결 실패 시 예외를 던진다 (getDb()가 이제 Db를 반환하므로 null 반환 불가)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// DB 모듈 모킹
vi.mock("../db/connection", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "../db/connection";
import { isOtpCooldown } from "../db/otp";

const mockGetDb = vi.mocked(getDb);

describe("isOtpCooldown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("DB 연결 실패 시 예외를 던진다 (getDb throws)", async () => {
    mockGetDb.mockRejectedValue(new Error("DB connection failed"));
    await expect(isOtpCooldown("01012345678")).rejects.toThrow("DB connection failed");
  });

  it("최근 60초 이내 OTP가 있으면 true를 반환한다", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([{ id: 1 }]),
    };
    mockGetDb.mockResolvedValue(mockDb as never);

    const result = await isOtpCooldown("01012345678", 60 * 1000);
    expect(result).toBe(true);
  });

  it("60초 초과 OTP만 있으면 false를 반환한다", async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    };
    mockGetDb.mockResolvedValue(mockDb as never);

    const result = await isOtpCooldown("01012345678", 60 * 1000);
    expect(result).toBe(false);
  });
});
