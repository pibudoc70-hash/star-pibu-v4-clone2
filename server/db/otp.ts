import { eq, desc, and } from "drizzle-orm";
import { guestOtps } from "../../drizzle/schema";
import { logger } from "../_core/logger";
import { getDb } from "./connection";

const OTP_MAX_ATTEMPTS = 5;
const OTP_LOCK_MS = 30 * 60 * 1000; // 30분

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createGuestOtp(phone: string, code: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5분
  await db.insert(guestOtps).values({ phone, code, expiresAt });
}

/** OTP 잠금 여부 확인 (lockedUntil 기준) */
export async function isOtpLocked(phone: string): Promise<{ locked: boolean; remainMs: number }> {
  const db = await getDb();
  if (!db) return { locked: false, remainMs: 0 };
  const now = Date.now();
  const rows = await db.select().from(guestOtps)
    .where(eq(guestOtps.phone, phone))
    .orderBy(desc(guestOtps.createdAt)).limit(1);
  if (!rows.length) return { locked: false, remainMs: 0 };
  const row = rows[0];
  if (row.lockedUntil && row.lockedUntil > now) {
    return { locked: true, remainMs: row.lockedUntil - now };
  }
  return { locked: false, remainMs: 0 };
}

export async function verifyGuestOtp(phone: string, code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const now = Date.now();

  // 가장 최근 OTP 레코드 조회 (코드 일치 여부 무관하게)
  const latest = await db.select().from(guestOtps)
    .where(and(eq(guestOtps.phone, phone), eq(guestOtps.verified, "0")))
    .orderBy(desc(guestOtps.createdAt)).limit(1);

  if (!latest.length) return false;
  const row = latest[0];

  // 잠금 상태 확인
  if (row.lockedUntil && row.lockedUntil > now) {
    throw new Error(`OTP_LOCKED:${row.lockedUntil}`);
  }

  // 만료 확인
  if (row.expiresAt < now) return false;

  // 코드 일치 확인
  if (row.code !== code) {
    const newAttempts = (row.attemptCount ?? 0) + 1;
    if (newAttempts >= OTP_MAX_ATTEMPTS) {
      const lockUntil = now + OTP_LOCK_MS;
      await db.update(guestOtps)
        .set({ attemptCount: newAttempts, lockedUntil: lockUntil })
        .where(eq(guestOtps.id, row.id));
      logger.warn("OTP", `Phone ${phone.slice(0, 4)}**** locked after ${newAttempts} failed attempts`);
      throw new Error(`OTP_LOCKED:${lockUntil}`);
    }
    await db.update(guestOtps)
      .set({ attemptCount: newAttempts })
      .where(eq(guestOtps.id, row.id));
    return false;
  }

  // 성공: verified 설정
  await db.update(guestOtps).set({ verified: "1" }).where(eq(guestOtps.id, row.id));
  return true;
}
