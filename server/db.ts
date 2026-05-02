import { eq, desc, asc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, events, popupEvents, reservations, guestOtps, treatments, treatmentCategories } from "../drizzle/schema";
import type { InsertEvent, InsertReservation, InsertTreatment, InsertTreatmentCategory, Treatment, TreatmentCategory } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── 예약 관련 ────────────────────────────────────────────────────────────────
export async function createReservation(data: InsertReservation) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(reservations).values(data);
  const result = await db.select().from(reservations).where(eq(reservations.phone, data.phone)).orderBy(desc(reservations.createdAt)).limit(1);
  return result[0];
}

export async function getReservationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reservations).where(eq(reservations.userId, userId)).orderBy(desc(reservations.createdAt));
}

export async function getAllReservations(page = 1, pageSize = 20) {
  const db = await getDb();
  if (!db) return { reservations: [], total: 0 };
  const offset = (page - 1) * pageSize;
  const [items, countResult] = await Promise.all([
    db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(pageSize).offset(offset),
    db.select().from(reservations),
  ]);
  return { reservations: items, total: countResult.length };
}

export async function updateReservationStatus(id: number, status: "pending" | "confirmed" | "completed" | "cancelled", adminNote?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const updateData: Record<string, unknown> = { status };
  if (adminNote !== undefined) updateData.adminNote = adminNote;
  await db.update(reservations).set(updateData).where(eq(reservations.id, id));
  const result = await db.select().from(reservations).where(eq(reservations.id, id));
  return result[0];
}

export async function cancelReservation(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(reservations).set({ status: "cancelled" }).where(and(eq(reservations.id, id), eq(reservations.userId, userId)));
  const result = await db.select().from(reservations).where(eq(reservations.id, id));
  return result[0];
}

export async function getReservationStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  const all = await db.select().from(reservations);
  return {
    total: all.length,
    pending: all.filter(r => r.status === "pending").length,
    confirmed: all.filter(r => r.status === "confirmed").length,
    completed: all.filter(r => r.status === "completed").length,
    cancelled: all.filter(r => r.status === "cancelled").length,
  };
}

// ─── OTP 관련 ────────────────────────────────────────────────────────────────
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createGuestOtp(phone: string, code: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5분
  await db.insert(guestOtps).values({ phone, code, expiresAt });
}

export async function verifyGuestOtp(phone: string, code: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const now = Date.now();
  const rows = await db.select().from(guestOtps)
    .where(and(eq(guestOtps.phone, phone), eq(guestOtps.code, code), eq(guestOtps.verified, "0")))
    .orderBy(desc(guestOtps.createdAt)).limit(1);
  if (!rows.length || rows[0].expiresAt < now) return false;
  await db.update(guestOtps).set({ verified: "1" }).where(eq(guestOtps.id, rows[0].id));
  return true;
}

export async function cancelGuestReservation(id: number, phone: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(reservations).set({ status: "cancelled" }).where(and(eq(reservations.id, id), eq(reservations.phone, phone)));
}

// ─── 이벤트 관련 ─────────────────────────────────────────────────────────────
export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(eq(events.isActive, "1")).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

export async function getFeaturedEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(and(eq(events.isActive, "1"), eq(events.isFeatured, "1"))).orderBy(asc(events.sortOrder));
}

export async function getListEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(eq(events.isActive, "1")).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return rows[0];
}

export async function createEvent(data: InsertEvent) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(events).values(data);
}

export async function updateEvent(id: number, data: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(events).set(data).where(eq(events.id, id));
}

export async function deleteEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(events).where(eq(events.id, id));
}

export async function incrementEventViews(id: number) {
  const db = await getDb();
  if (!db) return;
  const row = await getEventById(id);
  if (!row) return;
  await db.update(events).set({ views: (row.views ?? 0) + 1 }).where(eq(events.id, id));
}

// SPECIAL EVENT 관련 함수
export async function getSpecialEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(and(eq(events.isActive, "1"), eq(events.isSpecialEvent, "1"))).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

// ─── 시술·장비 카테고리 관련 ────────────────────────────────────────────────────
export async function getAllTreatmentCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(treatmentCategories).where(eq(treatmentCategories.isActive, "1")).orderBy(asc(treatmentCategories.sortOrder));
}

export async function getTreatmentCategoryById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(treatmentCategories).where(eq(treatmentCategories.id, id)).limit(1);
  return rows[0];
}

export async function createTreatmentCategory(data: InsertTreatmentCategory) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(treatmentCategories).values(data);
}

export async function updateTreatmentCategory(id: string, data: Partial<InsertTreatmentCategory>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(treatmentCategories).set(data).where(eq(treatmentCategories.id, id));
}

export async function deleteTreatmentCategory(id: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(treatmentCategories).where(eq(treatmentCategories.id, id));
}

// ─── 시술·장비 관련 ────────────────────────────────────────────────────────────
export async function getTreatmentsByCategory(categoryId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(treatments).where(and(eq(treatments.categoryId, categoryId), eq(treatments.isActive, "1"))).orderBy(asc(treatments.sortOrder));
}

export async function getAllTreatments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(treatments).where(eq(treatments.isActive, "1")).orderBy(asc(treatments.sortOrder));
}

export async function getTreatmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(treatments).where(eq(treatments.id, id)).limit(1);
  return rows[0];
}

export async function createTreatment(data: InsertTreatment) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(treatments).values(data);
  return result;
}

export async function updateTreatment(id: number, data: Partial<InsertTreatment>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(treatments).set(data).where(eq(treatments.id, id));
}

export async function deleteTreatment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(treatments).where(eq(treatments.id, id));
}

export async function getTreatmentsByBest() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(treatments).where(and(eq(treatments.best, "1"), eq(treatments.isActive, "1"))).orderBy(asc(treatments.sortOrder));
}
