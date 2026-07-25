import { eq, asc, and } from "drizzle-orm";
import { InsertYouTubeVideo, YouTubeVideo, youtubeVideos } from "../../drizzle/schema";
import { logger } from "../_core/logger";
import { getDb } from "./connection";

export async function getAllYouTubeVideos() {
  const db = await getDb();
  try {
    return db.select().from(youtubeVideos).where(eq(youtubeVideos.isActive, "1")).orderBy(asc(youtubeVideos.sortOrder));
  } catch (error) {
    logger.error("Database", "Failed to get YouTube videos", error);
    return [];
  }
}

export async function getYouTubeVideosByType(type: "video" | "shorts") {
  const db = await getDb();
  try {
    return db.select().from(youtubeVideos).where(and(eq(youtubeVideos.type, type), eq(youtubeVideos.isActive, "1"))).orderBy(asc(youtubeVideos.sortOrder));
  } catch (error) {
    logger.error("Database", "Failed to get YouTube videos by type", error);
    return [];
  }
}

export async function createYouTubeVideo(data: InsertYouTubeVideo): Promise<YouTubeVideo | null> {
  const db = await getDb();
  try {
    const result = await db.insert(youtubeVideos).values(data);
    const id = result[0].insertId;
    return db.select().from(youtubeVideos).where(eq(youtubeVideos.id, id)).then(rows => rows[0] || null);
  } catch (error) {
    logger.error("Database", "Failed to create YouTube video", error);
    return null;
  }
}

export async function updateYouTubeVideo(id: number, data: Partial<InsertYouTubeVideo>): Promise<YouTubeVideo | null> {
  const db = await getDb();
  try {
    await db.update(youtubeVideos).set(data).where(eq(youtubeVideos.id, id));
    return db.select().from(youtubeVideos).where(eq(youtubeVideos.id, id)).then(rows => rows[0] || null);
  } catch (error) {
    logger.error("Database", "Failed to update YouTube video", error);
    return null;
  }
}

export async function deleteYouTubeVideo(id: number): Promise<void> {
  const db = await getDb();
  try {
    await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));
  } catch (error) {
    logger.error("Database", "Failed to delete YouTube video", error);
  }
}

/**
 * YouTube 영상 순서 일괄 변경을 단일 트랜잭션으로 처리.
 * 중간 실패 시 전체 롤백 보장.
 * 트랜잭션 내 병렬 쿼리는 커넥션 문제를 일으킬 수 있으므로 순차 실행 유지.
 *
 * 참고: 현재 admin.ts 라우터는 updateYouTubeVideo 를 Promise.all 로 직접 호출하고 있어
 * 이 함수는 향후 라우터 리팩토링 시 사용 예정이다. (라우터 수정 금지 조건에 따라 현재 미연결)
 */
export async function reorderYouTubeVideos(items: Array<{ id: number; sortOrder: number }>): Promise<void> {
  const db = await getDb();
  await db.transaction(async (tx) => {
    for (const { id, sortOrder } of items) {
      await tx.update(youtubeVideos).set({ sortOrder }).where(eq(youtubeVideos.id, id));
    }
  });
}
