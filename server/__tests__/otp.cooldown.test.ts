/**
 * otp.cooldown.test.ts — isOtpCooldown Repository 헬퍼 단위 테스트
 *
 * 검증 대상:
 *  - 최근 60초 이내 OTP가 있으면 true 반환
 *  - 60초 초과 OTP만 있으면 false 반환
 *  - DB가 없으면 false 반환 (graceful degradation)
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

  it("DB가 없으면 false를 반환한다 (graceful degradation)", async () => {
    mockGetDb.mockResolvedValue(null as never);
    const result = await isOtpCooldown("01012345678");
    expect(result).toBe(false);
  });

  it("최근 60초 이내 OTP가 있으면 true를 반환한다", async () => {
    const now = Date.now();
    // expiresAt = now + 5분 (방금 발급된 OTP)
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
