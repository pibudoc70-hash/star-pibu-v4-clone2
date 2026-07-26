import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { withCache, invalidateCache } from "../_core/cache"; // [Step65-A]

const STAR_LAT = 35.1572312;
const STAR_LNG = 129.0581932;

export const locationRouter = router({
  /**
   * 서버 사이드에서 Google Static Maps API 이미지를 프록시하여
   * 서명된 URL을 반환합니다.
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

      // [Step65-A] 지도 좌표는 고정값이므로 결과가 바뀌지 않는다.
      // 크기 조합별로 캐시해 Google Static Maps 왕복을 제거한다.
      // TTL 24시간: 지도 이미지는 사실상 불변이다.
      const cacheKey = `staticmap:${width}x${height}@${scale}`;

      const result = await withCache(
        cacheKey,
        async () => {
          const forgeApiUrl = ENV.forgeApiUrl || "https://forge.manus.ai";
          const forgeApiKey = ENV.forgeApiKey;

          const params = new URLSearchParams({
            center: `${STAR_LAT},${STAR_LNG}`,
            zoom: "17",
            size: `${width}x${height}`,
            scale: String(scale),
            maptype: "roadmap",
            markers: `color:red|label:S|${STAR_LAT},${STAR_LNG}`,
            language: "ko",
            key: forgeApiKey,
          });

          const staticMapUrl = `${forgeApiUrl}/v1/maps/proxy/maps/api/staticmap?${params.toString()}`;

          try {
            // [Step65-A] 타임아웃·리다이렉트 방어 추가.
            // 업스트림이 응답하지 않으면 커넥션이 무한 점유되는 것을 막는다.
            const response = await fetch(staticMapUrl, {
              redirect: "error",
              signal: AbortSignal.timeout(8000),
            });

            if (!response.ok) {
              console.error(`[locationRouter] Static Maps API returned ${response.status}`);
              return { dataUrl: null, success: false };
            }

            // [Step65-A] 응답 크기 상한 3MB.
            // base64 인코딩 시 약 33% 증가하므로 원본 기준으로 제한한다.
            const MAX_MAP_BYTES = 3 * 1024 * 1024;
            const declaredLen = Number(response.headers.get("content-length") || 0);
            if (declaredLen > MAX_MAP_BYTES) {
              console.error("[locationRouter] Static map too large (declared)");
              return { dataUrl: null, success: false };
            }

            const contentType = response.headers.get("content-type") || "image/png";
            const buffer = await response.arrayBuffer();

            if (buffer.byteLength > MAX_MAP_BYTES) {
              console.error("[locationRouter] Static map too large (actual)");
              return { dataUrl: null, success: false };
            }

            const base64 = Buffer.from(buffer).toString("base64");
            return { dataUrl: `data:${contentType};base64,${base64}`, success: true };
          } catch (error) {
            const isTimeout =
              error instanceof Error &&
              (error.name === "TimeoutError" || error.name === "AbortError");
            console.error(
              `[locationRouter] Static Maps API ${isTimeout ? "timeout" : "error"}:`,
              error instanceof Error ? error.message : error,
            );
            return { dataUrl: null, success: false };
          }
        },
        24 * 60 * 60 * 1000, // 24시간
      );

      // [Step65-A] 실패 응답은 캐시에 남기지 않는다 (일시 장애가 하루 고정되는 것 방지)
      if (!result.success) {
        invalidateCache(cacheKey);
      }
      return result;
    }),
});
