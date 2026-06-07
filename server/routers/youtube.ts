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

export const youtubeRouter = router({
  /** 모든 YouTube 영상 조회 (공개) */
  getAll: publicProcedure.query(async () => getAllYouTubeVideos()),

  /** 타입별 YouTube 영상 조회 (공개) */
  getByType: publicProcedure
    .input(z.object({ type: z.enum(["video", "shorts"]) }))
    .query(async ({ input }) => getYouTubeVideosByType(input.type)),
});
