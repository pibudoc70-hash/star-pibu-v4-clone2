/**
 * server/db/popup.ts — 팝업 이벤트 Repository
 *
 * popup router가 직접 getDb()를 호출하던 패턴을 Repository 계층으로 이동.
 * priceItems JSON 직렬화/역직렬화는 이 계층에서 처리한다.
 */
import { eq, asc } from "drizzle-orm";
import { popupEvents } from "../../drizzle/schema";
import type { InferInsertModel } from "drizzle-orm";
import { getDb } from "./connection";

export type InsertPopup = InferInsertModel<typeof popupEvents>;
export type PopupRow = typeof popupEvents.$inferSelect;

/** priceItems 엔트리 타입 */
export interface PopupPriceItem {
  label: string;
  original: string;
  price: string;
}

/** priceItems JSON 파싱 헬퍼 (파싱 실패 시 빈 배열 반환) */
function parsePriceItems(raw: string | null | undefined): PopupPriceItem[] {
  try {
    return JSON.parse(raw ?? "[]") as PopupPriceItem[];
  } catch {
    return [];
  }
}

function withParsedPriceItems(row: PopupRow) {
  return { ...row, priceItems: parsePriceItems(row.priceItems) };
}

/** 공개: 현재 활성 팝업 목록 (기간 필터 + 언어 필터 포함) */
export async function getActivePopups(lang?: string) {
  const db = await getDb();
  const now = Date.now();
  const rows = await db
    .select()
    .from(popupEvents)
    .where(eq(popupEvents.isActive, "1"))
    .orderBy(asc(popupEvents.sortOrder));
  return rows
    .filter((r) => {
      if (r.startAt != null && now < r.startAt) return false;
      if (r.endAt != null && now > r.endAt) return false;
      // 언어 필터: targetLang이 'all'이거나 현재 언어와 일치하는 항목만 표시
      if (lang && r.targetLang !== "all" && r.targetLang !== lang) return false;
      return true;
    })
    .map(withParsedPriceItems);
}

/** 관리자: 전체 목록 (비활성 포함) */
export async function getAllPopups() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(popupEvents)
    .orderBy(asc(popupEvents.sortOrder));
  return rows.map(withParsedPriceItems);
}

/** 관리자: 팝업 생성 */
export async function createPopup(data: Omit<InsertPopup, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  await db.insert(popupEvents).values(data);
  return { success: true };
}

/** 관리자: 팝업 수정 */
export async function updatePopup(id: number, data: Partial<Omit<InsertPopup, "id">>) {
  const db = await getDb();
  await db.update(popupEvents).set(data).where(eq(popupEvents.id, id));
  return { success: true };
}

/** 관리자: 팝업 삭제 */
export async function deletePopup(id: number) {
  const db = await getDb();
  await db.delete(popupEvents).where(eq(popupEvents.id, id));
  return { success: true };
}
