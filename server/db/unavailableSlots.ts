import { eq } from "drizzle-orm";
import { InsertUnavailableSlot, UnavailableSlot, unavailableSlots } from "../../drizzle/schema";
import { logger } from "../_core/logger";
import { getDb } from "./connection";

export async function createUnavailableSlot(data: InsertUnavailableSlot): Promise<UnavailableSlot | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(unavailableSlots).values(data);
    const id = result[0].insertId;
    return db.select().from(unavailableSlots).where(eq(unavailableSlots.id, id)).then(rows => rows[0] || null);
  } catch (error) {
    logger.error("Database", "Failed to create unavailable slot", error);
    return null;
  }
}

export async function getUnavailableSlots(date?: string): Promise<UnavailableSlot[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    if (date) {
      return db.select().from(unavailableSlots).where(eq(unavailableSlots.date, date));
    }
    return db.select().from(unavailableSlots);
  } catch (error) {
    logger.error("Database", "Failed to get unavailable slots", error);
    return [];
  }
}

export async function deleteUnavailableSlot(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  try {
    await db.delete(unavailableSlots).where(eq(unavailableSlots.id, id));
  } catch (error) {
    logger.error("Database", "Failed to delete unavailable slot", error);
  }
}

export async function updateUnavailableSlot(id: number, data: Partial<InsertUnavailableSlot>): Promise<UnavailableSlot | null> {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.update(unavailableSlots).set(data).where(eq(unavailableSlots.id, id));
    return db.select().from(unavailableSlots).where(eq(unavailableSlots.id, id)).then(rows => rows[0] || null);
  } catch (error) {
    logger.error("Database", "Failed to update unavailable slot", error);
    return null;
  }
}
