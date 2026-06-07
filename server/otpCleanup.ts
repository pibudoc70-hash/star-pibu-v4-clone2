/**
 * OTP 만료 레코드 정리 모듈
 *
 * guestOtps 테이블은 인증 시도마다 레코드가 쌓입니다.
 * 서버 시작 시 이 모듈을 호출하면 6시간마다 만료된 OTP를 일괄 삭제합니다.
 *
 * 정리 기준:
 *   - verified = "1" (이미 사용된 OTP)
 *   - expiresAt < now (만료된 미사용 OTP)
 *   - createdAt < now - 24h (24시간 이상 된 모든 레코드)
 */
import { lt, or, eq, sql } from "drizzle-orm";
import { getDb } from "./db";
import { guestOtps } from "../drizzle/schema";
import { logger } from "./_core/logger";

const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6시간
const MAX_AGE_MS = 24 * 60 * 60 * 1000;          // 24시간

export async function cleanupExpiredOtps(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const now = Date.now();
  const cutoffDate = new Date(now - MAX_AGE_MS);
  try {
    const result = await db.delete(guestOtps).where(
      or(
        eq(guestOtps.verified, "1"),                    // 사용 완료
        lt(guestOtps.expiresAt, now),                   // 만료됨 (bigint)
        lt(guestOtps.createdAt, cutoffDate),            // 24시간 초과 (timestamp)
      )
    );
    const deleted = (result as { rowsAffected?: number }).rowsAffected ?? 0;
    if (deleted > 0) {
      logger.info("OTP_CLEANUP", `Deleted ${deleted} expired OTP records`);
    }
    return deleted;
  } catch (err) {
    logger.error("OTP_CLEANUP", `Failed to clean up OTPs: ${err}`);
    return 0;
  }
}

/** 서버 시작 시 호출: 즉시 1회 실행 후 6시간 간격으로 반복 */
export function startOtpCleanupScheduler(): void {
  // 즉시 1회 실행
  cleanupExpiredOtps().catch(() => {});
  // 이후 6시간마다 반복
  setInterval(() => {
    cleanupExpiredOtps().catch(() => {});
  }, CLEANUP_INTERVAL_MS).unref(); // .unref() → 이 타이머만 남아도 프로세스가 종료되지 않도록
}
