/**
 * server/db/keywords.ts — 키워드 트렌드 repository
 */
import { getDb } from "./connection";
import { keywordTrends } from "../../drizzle/schema";
import { eq, desc, and, gte, lt } from "drizzle-orm";

export async function saveKeywordTrend(data: {
  keyword: string;
  searchVolume: number;
  trendScore: number;
  category?: string;
  source?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const result = await db.insert(keywordTrends).values({
    keyword: data.keyword,
    searchVolume: data.searchVolume,
    trendScore: data.trendScore,
    category: data.category || "general",
    source: data.source || "google",
  });
  return result;
}

export async function getLatestKeywordTrends(limit: number = 20, category?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const query = category
    ? await db
        .select()
        .from(keywordTrends)
        .where(eq(keywordTrends.category, category))
        .orderBy(desc(keywordTrends.collectedAt))
        .limit(limit)
    : await db
        .select()
        .from(keywordTrends)
        .orderBy(desc(keywordTrends.collectedAt))
        .limit(limit);

  return query;
}

export async function getKeywordTrendsByDate(startDate: Date, endDate?: Date, category?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const conditions: any[] = [gte(keywordTrends.collectedAt, startDate)];

  if (endDate) {
    conditions.push(lt(keywordTrends.collectedAt, endDate));
  }

  if (category) {
    conditions.push(eq(keywordTrends.category, category));
  }

  const query = await db
    .select()
    .from(keywordTrends)
    .where(and(...conditions.filter(Boolean)))
    .orderBy(desc(keywordTrends.collectedAt));

  return query;
}

export async function getTopTrendingKeywords(limit: number = 10, category?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const query = category
    ? await db
        .select()
        .from(keywordTrends)
        .where(eq(keywordTrends.category, category))
        .orderBy(desc(keywordTrends.trendScore))
        .limit(limit)
    : await db
        .select()
        .from(keywordTrends)
        .orderBy(desc(keywordTrends.trendScore))
        .limit(limit);

  return query;
}

export async function deleteOldKeywordTrends(daysOld: number = 90) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);

  // 90일 이상 된 데이터 삭제
  const result = await db
    .delete(keywordTrends)
    .where(lt(keywordTrends.collectedAt, cutoffDate));

  return result;
}
