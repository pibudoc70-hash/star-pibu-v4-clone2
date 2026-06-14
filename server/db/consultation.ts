/**
 * server/db/consultation.ts — 상담 신청 repository
 *
 * 책임: DB CRUD + rate limit 조회
 */
import { and, count, gte, eq, desc } from "drizzle-orm";
import { consultationRequests, type InsertConsultationRequest } from "../../drizzle/schema";
import { getDb } from "./connection";

/** 상담 신청 생성 */
export async function createConsultationRequest(
  data: InsertConsultationRequest
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db
    .insert(consultationRequests)
    .values(data)
    .$returningId();
  return result;
}

/** IP 기반 rate limit 조회 — windowMs 내 제출 횟수 */
export async function countConsultationByIp(
  ipAddress: string,
  windowMs: number
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const since = new Date(Date.now() - windowMs);
  const [row] = await db
    .select({ cnt: count() })
    .from(consultationRequests)
    .where(
      and(
        eq(consultationRequests.ipAddress, ipAddress),
        gte(consultationRequests.createdAt, since)
      )
    );
  return row?.cnt ?? 0;
}

/** 연락처 기반 rate limit 조회 — windowMs 내 제출 횟수 */
export async function countConsultationByPhone(
  phone: string,
  windowMs: number
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const since = new Date(Date.now() - windowMs);
  const [row] = await db
    .select({ cnt: count() })
    .from(consultationRequests)
    .where(
      and(
        eq(consultationRequests.phone, phone),
        gte(consultationRequests.createdAt, since)
      )
    );
  return row?.cnt ?? 0;
}

/** 관리자: 상담 목록 조회 (최신순, 최대 200건) */
export async function getConsultationRequests(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(consultationRequests)
    .orderBy(desc(consultationRequests.createdAt))
    .limit(limit);
}

/** 관리자: 상태 변경 */
export async function updateConsultationStatus(
  id: number,
  status: "pending" | "contacted" | "done" | "spam"
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .update(consultationRequests)
    .set({ status })
    .where(eq(consultationRequests.id, id));
}
