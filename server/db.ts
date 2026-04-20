import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, events, popupEvents, InsertEvent, InsertPopupEvent } from "../drizzle/schema";
import { ENV } from './_core/env';

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
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
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

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getAllEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).orderBy(asc(events.sortOrder), desc(events.createdAt));
}

export async function getActiveEvents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events)
    .where(eq(events.isActive, "1"))
    .orderBy(asc(events.sortOrder), desc(events.createdAt));
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result[0];
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
  const ev = await getEventById(id);
  if (ev) await db.update(events).set({ views: ev.views + 1 }).where(eq(events.id, id));
}

// ─── Popup Events ─────────────────────────────────────────────────────────────

export async function getAllPopups() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(popupEvents).orderBy(asc(popupEvents.sortOrder), desc(popupEvents.createdAt));
}

export async function getActivePopups() {
  const db = await getDb();
  if (!db) return [];
  const now = Date.now();
  const rows = await db.select().from(popupEvents)
    .where(eq(popupEvents.isActive, "1"))
    .orderBy(asc(popupEvents.sortOrder));
  return rows.filter(p => {
    if (p.startAt && now < p.startAt) return false;
    if (p.endAt && now > p.endAt) return false;
    return true;
  });
}

export async function createPopup(data: InsertPopupEvent) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(popupEvents).values(data);
}

export async function updatePopup(id: number, data: Partial<InsertPopupEvent>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(popupEvents).set(data).where(eq(popupEvents.id, id));
}

export async function deletePopup(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(popupEvents).where(eq(popupEvents.id, id));
}

// ─── Users (admin) ────────────────────────────────────────────────────────────

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(id: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(users).set({ role }).where(eq(users.id, id));
}
