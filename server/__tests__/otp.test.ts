/**
 * otpCleanup.test.ts — OTP 만료 레코드 정리 함수 단위 테스트
 * (P2-4: 서버 라우터 테스트 커버리지 확대 — Round-9)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── DB 모킹 (vi.mock factory는 호이스팅되므로 외부 변수 참조 금지) ──────────
vi.mock("../db", () => ({
  getDb: vi.fn(),
}));

vi.mock("../../drizzle/schema", () => ({
  guestOtps: { verified: "verified", expiresAt: "expiresAt", createdAt: "createdAt" },
}));

vi.mock("drizzle-orm", () => ({
  lt: vi.fn((col, val) => ({ type: "lt", col, val })),
  or: vi.fn((...args: unknown[]) => ({ type: "or", args })),
  eq: vi.fn((col, val) => ({ type: "eq", col, val })),
}));

vi.mock("../_core/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { getDb } from "../db";
import { logger } from "../_core/logger";
import { cleanupExpiredOtps } from "../otpCleanup";

// ─── DB 스텁 헬퍼 ─────────────────────────────────────────────────────────────
function makeDb(rowsAffected: number) {
  const where = vi.fn().mockResolvedValue({ rowsAffected });
  const del = vi.fn().mockReturnValue({ where });
  return { delete: del, _where: where };
}

describe("cleanupExpiredOtps", () => {
  beforeEach(() => vi.clearAllMocks());

  it("만료된 OTP를 삭제하고 삭제 수를 반환한다", async () => {
    const db = makeDb(3);
    vi.mocked(getDb).mockResolvedValue(db as never);
    const deleted = await cleanupExpiredOtps();
    expect(deleted).toBe(3);
    expect(db.delete).toHaveBeenCalledTimes(1);
    expect(db._where).toHaveBeenCalledTimes(1);
  });

  it("DB가 없으면 0을 반환한다", async () => {
    vi.mocked(getDb).mockResolvedValue(null as never);
    const deleted = await cleanupExpiredOtps();
    expect(deleted).toBe(0);
  });

  it("삭제된 레코드가 없으면 0을 반환한다", async () => {
    const db = makeDb(0);
    vi.mocked(getDb).mockResolvedValue(db as never);
    const deleted = await cleanupExpiredOtps();
    expect(deleted).toBe(0);
  });

  it("DB 오류 발생 시 0을 반환하고 에러를 로깅한다", async () => {
    const where = vi.fn().mockRejectedValue(new Error("DB error"));
    const del = vi.fn().mockReturnValue({ where });
    vi.mocked(getDb).mockResolvedValue({ delete: del } as never);
    const deleted = await cleanupExpiredOtps();
    expect(deleted).toBe(0);
    expect(vi.mocked(logger.error)).toHaveBeenCalledWith(
      "OTP_CLEANUP",
      expect.stringContaining("DB error"),
    );
  });
});
