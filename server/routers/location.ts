import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { fetchStaticMap } from "../_core/mapCache"; // [Step67-D]

export const locationRouter = router({
  /**
   * @deprecated Step67 — GET /api/staticmap.png 사용 권장. 하위호환 목적으로만 유지.
   *
   * 서버 사이드에서 Google Static Maps API 이미지를 프록시하여
   * base64 data URL을 반환합니다.
   * BUILT_IN_FORGE_API_KEY를 사용하므로 클라이언트에 키가 노출되지 않습니다.
   */
  getStaticMapUrl: publicProcedure
    .input(
      z.object({
        // [Step65-A] 실제 사용 조합만 허용해 캐시 오염을 막는다.
        // ContactSection: 모바일 700x400, 데스크탑 900x560, 기본값 640x480
        width: z.union([z.literal(700), z.literal(900), z.literal(640)]).default(640),
        height: z.union([z.literal(400), z.literal(560), z.literal(480)]).default(480),
        scale: z.union([z.literal(1), z.literal(2)]).default(1),
      })
    )
    .query(async ({ input }) => {
      const { width, height, scale } = input;

      // [Step67-D] 공용 fetchStaticMap 재사용 (캐시 + fetch 로직 통합)
      const cached = await fetchStaticMap(width, height, scale);

      if (!cached) {
        return { dataUrl: null, success: false };
      }

      // 하위호환: Buffer → base64 data URL 변환
      const dataUrl = `data:${cached.contentType};base64,${cached.buffer.toString("base64")}`;
      return { dataUrl, success: true };
    }),
});
