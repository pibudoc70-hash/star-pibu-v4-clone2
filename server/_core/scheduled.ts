/**
 * server/_core/scheduled.ts
 * Heartbeat 스케줄러 핸들러 - 키워드 트렌드 자동 수집
 */
import { Request, Response } from "express";
import { lt } from "drizzle-orm";
import { sdk } from "./sdk";
import { getDb } from "../db";
import { keywordTrends } from "../../drizzle/schema";

/**
 * 키워드 트렌드 자동 수집 핸들러
 * 매일 정시에 실행되어 최신 키워드 트렌드 데이터를 수집하고 저장
 */
export async function collectKeywordTrendsHandler(req: Request, res: Response) {
  try {
    // 1. Heartbeat 인증 확인
    // [Step56-B] authenticateRequest 는 실패 시 throw 하므로
    // 현재 구조에서는 403 대신 500(+스택)이 나간다. try/catch 로 분리한다.
    let user;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      return res.status(403).json({ error: "cron-only" });
    }
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    // Placeholder values must never become production data. Keep the authenticated
    // handler inert there until a verified external trend source replaces this sample.
    if (process.env.NODE_ENV === "production") {
      return res.json({
        ok: true,
        skipped: "sample-placeholder-production",
        taskUid: user.taskUid,
      });
    }

    // [Step56-B] getDb 는 실패 시 throw 한다. 위 try/catch 가 처리한다.
    // if (!database) 도달 불가 널체크 제거.
    const database = await getDb();

    // 2. 샘플 키워드 트렌드 데이터 생성
    // [Step56-B] ⚠️ 실제 검색량이 아니라 하드코딩된 샘플이다.
    // Google Trends / Naver DataLab 연동 전까지 대시보드 값은 실제 트렌드가 아니다.
    // 나중에 실제 API 를 붙일 때 source 로 구분해 샘플만 삭제할 수 있도록 표시한다.
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
      source: "sample-placeholder", // [Step56-B] "auto-collect" → "sample-placeholder"
      collectedAt: now,
    }));

    // 3. 데이터베이스에 저장
    await database.insert(keywordTrends).values(collectedData);

    // 4. 오래된 데이터 정리 (30일 이상 된 데이터 삭제)
    // [Step56-B] 30일 초과 데이터 삭제 활성화 (주석 처리되어 무한 누적 중이었음)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    await database
      .delete(keywordTrends)
      .where(lt(keywordTrends.collectedAt, thirtyDaysAgo));

    // 5. 성공 응답
    res.json({
      ok: true,
      collected: collectedData.length,
      timestamp: now.toISOString(),
      taskUid: user.taskUid || "unknown",
    });
  } catch (error) {
    // [Step56-B] 스택 트레이스·요청 경로를 외부 응답에서 제거.
    // 상세는 서버 로그에만 남긴다 (파일 경로·의존성 구조 노출 방지).
    console.error("[Scheduled] collectKeywordTrends failed:", error);
    res.status(500).json({ error: "Internal error" });
  }
}
