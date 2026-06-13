import { eq, desc, and, count, sql } from "drizzle-orm";
import { InsertReservation, reservations } from "../../drizzle/schema";
import { getDb } from "./connection";

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1);
  return result[0] ?? undefined;
}

/**
 * 예약 생성.
 *
 * insert 후 lastInsertId로 단건 재조회하여 race condition 제거.
 * (이전: phone 기준 최신 1건 재조회 → 동시 예약 시 타인 행 반환 가능성)
 */
export async function createReservation(data: InsertReservation) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(reservations).values(data);
  const insertId = result[0].insertId;
  const rows = await db.select().from(reservations).where(eq(reservations.id, insertId)).limit(1);
  return rows[0];
}

export async function getReservationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.select().from(reservations).where(eq(reservations.userId, userId)).orderBy(desc(reservations.createdAt));
}

/**
 * 예약 목록 조회 (관리자 페이지네이션).
 *
 * total count를 count() 쿼리로 처리하여 full table scan 제거.
 * (이전: db.select().from(reservations) 전체 로드 후 .length)
 */
export async function getAllReservations(page = 1, pageSize = 20) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const offset = (page - 1) * pageSize;
  const [items, countResult] = await Promise.all([
    db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(pageSize).offset(offset),
    db.select({ total: count() }).from(reservations),
  ]);
  return { items, total: countResult[0]?.total ?? 0 };
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
  const result = await db
    .update(reservations)
    .set({ status: "cancelled" })
    .where(and(eq(reservations.id, id), eq(reservations.phone, phone)));
  return (result[0] as { affectedRows?: number }).affectedRows ?? 0;
}

/**
 * 예약 통계.
 *
 * GROUP BY SQL 집계로 변경하여 full table scan + JS memory filter 제거.
 * (이전: db.select().from(reservations) 전체 로드 후 .filter(r => r.status === ...))
 */
export async function getReservationStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  const rows = await db
    .select({
      status: reservations.status,
      cnt: count(),
    })
    .from(reservations)
    .groupBy(reservations.status);

  const stats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  for (const row of rows) {
    const n = Number(row.cnt);
    stats.total += n;
    if (row.status === "pending") stats.pending = n;
    else if (row.status === "confirmed") stats.confirmed = n;
    else if (row.status === "completed") stats.completed = n;
    else if (row.status === "cancelled") stats.cancelled = n;
  }
  return stats;
}
