import { eq, desc, asc, and, like, or } from "drizzle-orm";
import { InsertEvent, events } from "../../drizzle/schema";
import { getDb } from "./connection";

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

/** SPECIAL EVENT 조회 (한국어 기본) */
export async function getSpecialEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(and(eq(events.isActive, "1"), eq(events.isSpecialEvent, "1"), eq(events.targetLang, "ko"))).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

/** 언어별 SPECIAL EVENT 조회 */
export async function getSpecialEventsByLang(lang: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(and(eq(events.isActive, "1"), eq(events.isSpecialEvent, "1"), eq(events.targetLang, lang))).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

/** 언어별 일반 이벤트 조회 */
export async function getAllEventsByLang(lang: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(and(eq(events.isActive, "1"), eq(events.targetLang, lang))).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

/** 카테고리별 이벤트 조회 */
export async function getEventsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.isActive, "1"))
    .orderBy(asc(events.sortOrder), desc(events.createdAt));
  return rows.filter((e) => e.category === category);
}

/** 이벤트 키워드 검색 (title + desc) */
export async function searchEvents(query: string) {
  const db = await getDb();
  if (!db) return [];
  const pattern = `%${query}%`;
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.isActive, "1"),
        or(like(events.title, pattern), like(events.desc, pattern)),
      ),
    )
    .orderBy(asc(events.sortOrder), desc(events.createdAt));
}
