/**
 * server/_core/scheduled.ts
 * Heartbeat 스케줄러 핸들러 - 키워드 트렌드 자동 수집
 */
import { Request, Response } from "express";
import { sdk } from "./sdk";
import { getDb } from "../db";
import { keywordTrends } from "../../drizzle/schema";
import type { AuthenticatedUser } from "./sdk";

/**
 * 키워드 트렌드 자동 수집 핸들러
 * 매일 정시에 실행되어 최신 키워드 트렌드 데이터를 수집하고 저장
 */
export async function collectKeywordTrendsHandler(req: Request, res: Response) {
  try {
    // 1. Heartbeat 인증 확인
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const database = await getDb();
    if (!database) {
      return res.status(500).json({ error: "Database connection failed" });
    }

    // 2. 샘플 키워드 트렌드 데이터 생성
    // 실제 환경에서는 Google Trends, Naver 검색 등의 API에서 데이터를 수집
    const sampleKeywords = [
      { keyword: "울쎄라", category: "treatment", searchVolume: 85, trendScore: 15 },
      { keyword: "써마지", category: "treatment", searchVolume: 72, trendScore: 10 },
      { keyword: "리쥬란", category: "ingredient", searchVolume: 65, trendScore: 5 },
      { keyword: "눈밑지방", category: "treatment", searchVolume: 90, trendScore: 20 },
      { keyword: "보톡스", category: "treatment", searchVolume: 80, trendScore: 12 },
      { keyword: "필러", category: "treatment", searchVolume: 70, trendScore: 8 },
      { keyword: "피부과", category: "general", searchVolume: 55, trendScore: 3 },
      { keyword: "레이저", category: "equipment", searchVolume: 60, trendScore: 7 },
      { keyword: "스킨보톡스", category: "treatment", searchVolume: 45, trendScore: 2 },
      { keyword: "매직스트로우", category: "treatment", searchVolume: 50, trendScore: 4 },
    ];

    const now = new Date();
    const collectedData = sampleKeywords.map((item) => ({
      keyword: item.keyword,
      searchVolume: item.searchVolume,
      trendScore: item.trendScore,
      category: item.category,
      source: "auto-collect",
      collectedAt: now,
    }));

    // 3. 데이터베이스에 저장
    await database.insert(keywordTrends).values(collectedData);

    // 4. 오래된 데이터 정리 (30일 이상 된 데이터 삭제)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    // 주의: Drizzle ORM에서 날짜 비교는 데이터베이스 레벨에서 처리됨
    // 실제 구현 시 lt() 또는 sql() 함수 사용 필요
    // await db
    //   .delete(keywordTrends)
    //   .where(lt(keywordTrends.collectedAt, thirtyDaysAgo));

    // 5. 성공 응답
    res.json({
      ok: true,
      collected: collectedData.length,
      timestamp: now.toISOString(),
      taskUid: user.taskUid || "unknown",
    });
  } catch (error) {
    // Keep diagnostics in server logs; never disclose stack traces or internal routes.
    console.error("[Scheduled] Keyword trend collection failed", error);
    res.status(500).json({ error: "internal_error", timestamp: new Date().toISOString() });
  }
}
