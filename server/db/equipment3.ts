import { eq, asc } from "drizzle-orm";
import { Equipment3Item, InsertEquipment3Item, equipment3 } from "../../drizzle/schema";
import { getDb } from "./connection";

export async function getEquipment3List(): Promise<Equipment3Item[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(equipment3).where(eq(equipment3.isActive, "1")).orderBy(asc(equipment3.sortOrder));
}

export async function getEquipment3All(): Promise<Equipment3Item[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(equipment3).orderBy(asc(equipment3.sortOrder));
}

export async function getEquipment3BySlug(slug: string): Promise<Equipment3Item | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(equipment3).where(eq(equipment3.slug, slug)).limit(1);
  return rows[0];
}

export async function getEquipment3ById(id: number): Promise<Equipment3Item | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(equipment3).where(eq(equipment3.id, id)).limit(1);
  return rows[0];
}

export async function createEquipment3Item(data: InsertEquipment3Item): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(equipment3).values(data);
  return { id: result[0].insertId };
}

export async function updateEquipment3Item(id: number, data: Partial<InsertEquipment3Item>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(equipment3).set(data).where(eq(equipment3.id, id));
}

export async function deleteEquipment3Item(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(equipment3).where(eq(equipment3.id, id));
}

/**
 * 순서 변경: [{id, sortOrder}] 배열을 받아 일괄 업데이트
 */
export async function reorderEquipment3Items(items: Array<{ id: number; sortOrder: number }>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await Promise.all(
    items.map(({ id, sortOrder }) =>
      db.update(equipment3).set({ sortOrder }).where(eq(equipment3.id, id))
    )
  );
}
