/**
 * server/routers/keywords.ts — 키워드 트렌드 tRPC 라우터
 */
import { router, publicProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  saveKeywordTrend,
  getLatestKeywordTrends,
  getKeywordTrendsByDate,
  getTopTrendingKeywords,
  deleteOldKeywordTrends,
} from "../db/keywords";
import { TRPCError } from "@trpc/server";

export const keywordsRouter = router({
  // 최신 키워드 트렌드 조회 (관리자 전용)
  getLatest: adminProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const trends = await getLatestKeywordTrends(input.limit, input.category);
        return trends;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch keyword trends",
        });
      }
    }),

  // 상위 트렌딩 키워드 조회 (관리자 전용)
  getTopTrending: adminProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const trends = await getTopTrendingKeywords(input.limit, input.category);
        return trends;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch top trending keywords",
        });
      }
    }),

  // 날짜 범위별 키워드 트렌드 조회 (관리자 전용)
  getByDateRange: adminProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date().optional(),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        if (input.endDate && input.startDate > input.endDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Start date must be before end date",
          });
        }

        const trends = await getKeywordTrendsByDate(
          input.startDate,
          input.endDate,
          input.category
        );
        return trends;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch keyword trends by date range",
        });
      }
    }),

  // 키워드 트렌드 저장 (관리자 전용 - 스케줄러에서 호출)
  save: adminProcedure
    .input(
      z.object({
        keyword: z.string().min(1).max(100),
        searchVolume: z.number().int().min(0).max(100),
        trendScore: z.number().min(-100).max(100),
        category: z.string().optional(),
        source: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await saveKeywordTrend({
          keyword: input.keyword,
          searchVolume: input.searchVolume,
          trendScore: input.trendScore,
          category: input.category,
          source: input.source,
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save keyword trend",
        });
      }
    }),

  // 오래된 데이터 삭제 (관리자 전용)
  deleteOld: adminProcedure
    .input(
      z.object({
        daysOld: z.number().int().min(1).default(90),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await deleteOldKeywordTrends(input.daysOld);
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete old keyword trends",
        });
      }
    }),
});
