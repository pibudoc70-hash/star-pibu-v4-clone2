/**
 * youtube.ts — YouTube 공개 조회 라우터
 *
 * 공개 조회(getAll, getByType)만 담당합니다.
 * CRUD(create/update/delete)는 admin.youtube 서브라우터로 통합되었습니다.
 * (P2-2: admin.youtube 중복 제거 — Round-9 리팩터)
 */
import { z } from "zod/v4";
import { publicProcedure, router } from "../_core/trpc";
import { getAllYouTubeVideos, getYouTubeVideosByType } from "../db";
import { withCache, invalidateCache } from "../_core/cache";

export const youtubeRouter = router({
  /** 모든 YouTube 영상 조회 (공개) — 5분 캐시 (영상 목록은 자주 변경되지 않음) */
  getAll: publicProcedure.query(async () =>
    withCache("youtube:all", () => getAllYouTubeVideos(), 5 * 60 * 1000)
  ),

  /** 타입별 YouTube 영상 조회 (공개) — 5분 캐시 */
  getByType: publicProcedure
    .input(z.object({ type: z.enum(["video", "shorts"]) }))
    .query(async ({ input }) =>
      withCache(`youtube:type:${input.type}`, () => getYouTubeVideosByType(input.type), 5 * 60 * 1000)
    ),

  /** 캐시 무효화 (개발/테스트용) */
  clearCache: publicProcedure.mutation(async () => {
    invalidateCache("youtube:");
    return { success: true, message: "YouTube cache cleared" };
  }),
});
