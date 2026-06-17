import { asc, desc, eq } from "drizzle-orm";
import { InsertNotice, notices } from "../../drizzle/schema";
import { getDb } from "./connection";

/** 공지사항 목록 (고정글 먼저, 최신순) */
export async function getAllNotices() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(notices)
    .orderBy(desc(notices.isPinned), desc(notices.createdAt));
}

/** 공지사항 단건 조회 */
export async function getNoticeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(notices).where(eq(notices.id, id)).limit(1);
  return rows[0];
}

/** 공지사항 생성 */
export async function createNotice(data: InsertNotice) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(notices).values(data);
  return result;
}

/** 공지사항 수정 */
export async function updateNotice(id: number, data: Partial<InsertNotice>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(notices).set(data).where(eq(notices.id, id));
}

/** 공지사항 삭제 */
export async function deleteNotice(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(notices).where(eq(notices.id, id));
}

/** 조회수 증가 */
export async function incrementNoticeViews(id: number) {
  const db = await getDb();
  if (!db) return;
  const row = await db.select({ views: notices.views }).from(notices).where(eq(notices.id, id)).limit(1);
  if (!row[0]) return;
  await db.update(notices).set({ views: row[0].views + 1 }).where(eq(notices.id, id));
}
