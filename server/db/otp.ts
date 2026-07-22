import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { guestOtps } from "../../drizzle/schema";
import { ENV } from "../_core/env";
import { logger } from "../_core/logger";
import { getDb } from "./connection";

const OTP_MAX_ATTEMPTS = 5;
const OTP_LOCK_MS = 30 * 60 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000;

function hashOtp(code: string): string {
  return createHmac("sha256", ENV.cookieSecret).update(code).digest("hex");
}

function hashesMatch(storedHash: string, code: string) {
  const expected = Buffer.from(storedHash, "hex");
  const actual = Buffer.from(hashOtp(code), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Cryptographically secure six-digit OTP. Never persist the returned plaintext. */
export function generateOtpCode(): string {
  return randomInt(100000, 1_000_000).toString();
}

export async function createGuestOtp(phone: string, code: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const expiresAt = Date.now() + OTP_TTL_MS;
  await db.insert(guestOtps).values({ phone, codeHash: hashOtp(code), expiresAt });
}

export async function isOtpCooldown(phone: string, cooldownMs = 60 * 1000): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select({ id: guestOtps.id }).from(guestOtps).where(and(
    eq(guestOtps.phone, phone),
    gt(guestOtps.expiresAt, Date.now() + OTP_TTL_MS - cooldownMs),
  )).limit(1);
  return rows.length > 0;
}

export async function isOtpLocked(phone: string): Promise<{ locked: boolean; remainMs: number }> {
  const db = await getDb();
  if (!db) return { locked: false, remainMs: 0 };
  const now = Date.now();
  const rows = await db.select().from(guestOtps).where(eq(guestOtps.phone, phone)).orderBy(desc(guestOtps.createdAt)).limit(1);
  const lockedUntil = rows[0]?.lockedUntil;
  return lockedUntil && lockedUntil > now ? { locked: true, remainMs: lockedUntil - now } : { locked: false, remainMs: 0 };
}

/** Verifies the newest unused OTP and marks it verified, but does not consume it. */
export async function verifyGuestOtp(phone: string, code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const now = Date.now();
  const latest = await db.select().from(guestOtps).where(and(
    eq(guestOtps.phone, phone), eq(guestOtps.verified, "0"), isNull(guestOtps.consumedAt),
  )).orderBy(desc(guestOtps.createdAt)).limit(1);
  const row = latest[0];
  if (!row || row.expiresAt < now) return false;
  if (row.lockedUntil && row.lockedUntil > now) throw new Error(`OTP_LOCKED:${row.lockedUntil}`);

  if (!hashesMatch(row.codeHash, code)) {
    const attempts = (row.attemptCount ?? 0) + 1;
    const lockedUntil = attempts >= OTP_MAX_ATTEMPTS ? now + OTP_LOCK_MS : null;
    await db.update(guestOtps).set({ attemptCount: attempts, ...(lockedUntil ? { lockedUntil } : {}) }).where(eq(guestOtps.id, row.id));
    if (lockedUntil) {
      logger.warn("OTP", `Phone ${phone.slice(0, 4)}**** locked after ${attempts} failed attempts`);
      throw new Error(`OTP_LOCKED:${lockedUntil}`);
    }
    return false;
  }

  await db.update(guestOtps).set({ verified: "1" }).where(and(eq(guestOtps.id, row.id), eq(guestOtps.verified, "0")));
  return true;
}

/** Consume one verified code so an OTP cannot authorize multiple reservations. */
export async function consumeGuestOtp(phone: string, code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const now = Date.now();
  const rows = await db.select().from(guestOtps).where(and(
    eq(guestOtps.phone, phone), eq(guestOtps.verified, "1"), isNull(guestOtps.consumedAt), gt(guestOtps.expiresAt, now),
  )).orderBy(desc(guestOtps.createdAt)).limit(1);
  const row = rows[0];
  if (!row || !hashesMatch(row.codeHash, code)) return false;
  const result = await db.update(guestOtps).set({ consumedAt: new Date() }).where(and(eq(guestOtps.id, row.id), isNull(guestOtps.consumedAt)));
  return Number(result[0]?.affectedRows ?? 0) === 1;
}
