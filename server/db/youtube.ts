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
