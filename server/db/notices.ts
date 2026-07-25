import { asc, desc, eq, inArray, lt } from "drizzle-orm";
import { InsertNotice, InsertNoticeImage, noticeImages, notices } from "../../drizzle/schema";
import { getDb } from "./connection";

/** 공지사항 목록 (고정글 먼저, 최신순, 언어 필터 지원) */
export async function getAllNotices(lang?: string) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(notices)
    .orderBy(desc(notices.isPinned), desc(notices.createdAt));
  if (!lang) return rows;
  // 언어 필터: all이거나 현재 언어와 일치하는 항목만
  return rows.filter((r) => r.targetLang === "all" || r.targetLang === lang);
}

/** 공지사항 단건 조회 */
export async function getNoticeById(id: number) {
  const db = await getDb();
  const rows = await db.select().from(notices).where(eq(notices.id, id)).limit(1);
  return rows[0];
}

/** 공지사항 생성 */
export async function createNotice(data: InsertNotice) {
  const db = await getDb();
  const result = await db.insert(notices).values(data);
  return result;
}

/** 공지사항 수정 */
export async function updateNotice(id: number, data: Partial<InsertNotice>) {
  const db = await getDb();
  await db.update(notices).set(data).where(eq(notices.id, id));
}

/** 공지사항 삭제 (이미지도 함께 삭제) */
export async function deleteNotice(id: number) {
  const db = await getDb();
  await db.delete(noticeImages).where(eq(noticeImages.noticeId, id));
  await db.delete(notices).where(eq(notices.id, id));
}

/** 조회수 증가 */
export async function incrementNoticeViews(id: number) {
  const db = await getDb();
  const row = await db.select({ views: notices.views }).from(notices).where(eq(notices.id, id)).limit(1);
  if (!row[0]) return;
  await db.update(notices).set({ views: row[0].views + 1 }).where(eq(notices.id, id));
}

// ─── notice_images ────────────────────────────────────────────────────────────

/** 공지사항 이미지 목록 조회 (sortOrder 순) */
export async function getNoticeImages(noticeId: number) {
  const db = await getDb();
  return db
    .select()
    .from(noticeImages)
    .where(eq(noticeImages.noticeId, noticeId))
    .orderBy(asc(noticeImages.sortOrder));
}

/** 공지사항 이미지 추가 */
export async function addNoticeImage(data: InsertNoticeImage) {
  const db = await getDb();
  const result = await db.insert(noticeImages).values(data);
  return result;
}

/** 공지사항 이미지 삭제 */
export async function deleteNoticeImage(imageId: number) {
  const db = await getDb();
  await db.delete(noticeImages).where(eq(noticeImages.id, imageId));
}

/** 공지사항 이미지 순서 업데이트 */
export async function updateNoticeImageOrder(imageId: number, sortOrder: number) {
  const db = await getDb();
  await db.update(noticeImages).set({ sortOrder }).where(eq(noticeImages.id, imageId));
}

/** 여러 공지사항의 이미지 일괄 조회 (목록 썸네일용) */
export async function getNoticeImagesByNoticeIds(noticeIds: number[]) {
  const db = await getDb();
  if (noticeIds.length === 0) return [];
  return db
    .select()
    .from(noticeImages)
    .where(inArray(noticeImages.noticeId, noticeIds))
    .orderBy(asc(noticeImages.sortOrder));
}

// ─── 트랜잭션 헬퍼 ────────────────────────────────────────────────────────────

/**
 * 공지사항 생성 + 이미지 일괄 insert 를 단일 트랜잭션으로 처리.
 * notices insert 성공 후 noticeImages insert 실패 시 notices 도 롤백된다.
 *
 * 반환: 생성된 notices 행 (라우터의 insertId 캐스팅 패턴과 동일하게 raw result 반환)
 */
export async function createNoticeWithImages(
  data: InsertNotice,
  images: { fileKey: string; url: string; sortOrder: number }[],
) {
  const db = await getDb();

  return db.transaction(async (tx) => {
    const result = await tx.insert(notices).values(data);
    // 기존 라우터가 사용하는 insertId 획득 방식 유지
    const noticeId = Number((result as any).insertId as number);

    if (images.length > 0) {
      await tx.insert(noticeImages).values(
        images.map((img) => ({
          noticeId,
          fileKey: img.fileKey,
          url: img.url,
          sortOrder: img.sortOrder,
        })),
      );
    }

    const [created] = await tx
      .select()
      .from(notices)
      .where(eq(notices.id, noticeId))
      .limit(1);

    return created;
  });
}

/**
 * 공지사항 수정 + 이미지 교체를 단일 트랜잭션으로 처리.
 * deleteImageIds 에 해당하는 이미지 삭제 → addImages insert 를 원자적으로 수행.
 *
 * 반환: void (기존 updateNotice 시그니처와 동일)
 */
export async function updateNoticeWithImages(
  id: number,
  data: Partial<InsertNotice>,
  deleteImageIds: number[],
  addImages: { fileKey: string; url: string; sortOrder: number }[],
): Promise<void> {
  const db = await getDb();

  await db.transaction(async (tx) => {
    if (Object.keys(data).length > 0) {
      await tx.update(notices).set(data).where(eq(notices.id, id));
    }

    if (deleteImageIds.length > 0) {
      await tx.delete(noticeImages).where(inArray(noticeImages.id, deleteImageIds));
    }

    if (addImages.length > 0) {
      await tx.insert(noticeImages).values(
        addImages.map((img) => ({
          noticeId: id,
          fileKey: img.fileKey,
          url: img.url,
          sortOrder: img.sortOrder,
        })),
      );
    }
  });
}

/**
 * 커서 기반 공지 목록 조회.
 *
 * OFFSET 방식의 문제: OFFSET 10000 은 10000행을 읽고 버려서 뒷페이지가 느리다.
 * 커서 방식: 마지막으로 본 id 이후만 읽으므로 페이지 위치와 무관하게 일정하다.
 *
 * @param cursor 마지막으로 조회한 공지의 id (첫 페이지는 undefined)
 * @param limit 페이지 크기 (최대 100)
 */
export async function getNoticesByCursor(params: {
  cursor?: number;
  limit?: number;
}) {
  const db = await getDb();
  const limit = Math.min(params.limit ?? 20, 100);

  const rows = await db
    .select()
    .from(notices)
    .where(params.cursor !== undefined ? lt(notices.id, params.cursor) : undefined)
    .orderBy(desc(notices.id))
    .limit(limit + 1); // 다음 페이지 존재 여부 판별용 +1

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor, hasMore };
}
