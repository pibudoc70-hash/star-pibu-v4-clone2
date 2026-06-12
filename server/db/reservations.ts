import { eq, desc, and } from "drizzle-orm";
import { InsertReservation, reservations } from "../../drizzle/schema";
import { getDb } from "./connection";

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1);
  return result[0] ?? undefined;
}

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
  if (!db) return { items: [], total: 0 };
  const offset = (page - 1) * pageSize;
  const [items, countResult] = await Promise.all([
    db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(pageSize).offset(offset),
    db.select().from(reservations),
  ]);
  return { items, total: countResult.length };
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

export async function cancelGuestReservation(id: number, phone: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(reservations).set({ status: "cancelled" }).where(and(eq(reservations.id, id), eq(reservations.phone, phone)));
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
