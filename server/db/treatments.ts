import { eq, asc, and } from "drizzle-orm";
import {
  InsertTreatment, InsertTreatmentCategory,
  treatments, treatmentCategories,
} from "../../drizzle/schema";
import { getDb } from "./connection";

// ─── 시술·장비 카테고리 ────────────────────────────────────────────────────────

export async function getAllTreatmentCategories() {
  const db = await getDb();
  return db.select().from(treatmentCategories).where(eq(treatmentCategories.isActive, "1")).orderBy(asc(treatmentCategories.sortOrder));
}

export async function getTreatmentCategoryById(id: string) {
  const db = await getDb();
  const rows = await db.select().from(treatmentCategories).where(eq(treatmentCategories.id, id)).limit(1);
  return rows[0];
}

export async function createTreatmentCategory(data: InsertTreatmentCategory) {
  const db = await getDb();
  await db.insert(treatmentCategories).values(data);
}

export async function updateTreatmentCategory(id: string, data: Partial<InsertTreatmentCategory>) {
  const db = await getDb();
  await db.update(treatmentCategories).set(data).where(eq(treatmentCategories.id, id));
}

export async function deleteTreatmentCategory(id: string) {
  const db = await getDb();
  await db.delete(treatmentCategories).where(eq(treatmentCategories.id, id));
}

// ─── 시술·장비 ─────────────────────────────────────────────────────────────────

export async function getTreatmentsByCategory(categoryId: string, section?: string) {
  const db = await getDb();
  const conditions = [eq(treatments.categoryId, categoryId), eq(treatments.isActive, "1")];
  if (section && (section === "v1" || section === "v2")) {
    conditions.push(eq(treatments.section, section as "v1" | "v2"));
  }
  return db.select().from(treatments).where(and(...conditions)).orderBy(asc(treatments.sortOrder));
}

export async function getAllTreatments(section?: string) {
  const db = await getDb();
  if (section === "v2") {
    return db.select().from(treatments).where(and(eq(treatments.isActive, "1"), eq(treatments.section, "v2"))).orderBy(asc(treatments.sortOrder));
  }
  // V1 또는 섹션 미지정: 모든 시술 조회 (클라이언트에서 필터링)
  return db.select().from(treatments).where(eq(treatments.isActive, "1")).orderBy(asc(treatments.sortOrder));
}

export async function getTreatmentById(id: number) {
  const db = await getDb();
  const rows = await db.select().from(treatments).where(eq(treatments.id, id)).limit(1);
  return rows[0];
}

export async function getTreatmentBySlug(slug: string) {
  const db = await getDb();
  const rows = await db.select().from(treatments).where(eq(treatments.slug, slug)).limit(1);
  return rows[0];
}

export async function createTreatment(data: InsertTreatment) {
  const db = await getDb();
  const result = await db.insert(treatments).values(data);
  return result;
}

export async function updateTreatment(id: number, data: Partial<InsertTreatment>) {
  const db = await getDb();
  await db.update(treatments).set(data).where(eq(treatments.id, id));
}

export async function deleteTreatment(id: number) {
  const db = await getDb();
  await db.delete(treatments).where(eq(treatments.id, id));
}

export async function getTreatmentsByBest(section?: string) {
  const db = await getDb();
  const conditions = [eq(treatments.best, "1"), eq(treatments.isActive, "1")];
  if (section && (section === "v1" || section === "v2")) {
    conditions.push(eq(treatments.section, section as "v1" | "v2"));
  }
  return db.select().from(treatments).where(and(...conditions)).orderBy(asc(treatments.sortOrder));
}
