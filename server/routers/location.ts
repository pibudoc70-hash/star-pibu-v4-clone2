import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { staticMapCache } from "../_core/mapCache"; // [Step66-B]

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

      // [Step66-B] 지도 좌표는 고정값이므로 결과가 바뀌지 않는다.
      // LRU 캐시(mapCache.ts)로 분리해 메모리 상한·만료 스윕을 보장한다.
      // 성공 응답만 저장, 실패는 저장하지 않아 일시 장애가 하루 고정되는 것을 방지한다.
      const cacheKey = `staticmap:${width}x${height}@${scale}`;

      // 1) 캐시 히트
      const hit = staticMapCache.get(cacheKey);
      if (hit) return { dataUrl: hit, success: true };

      // 2) 캐시 미스 → Google Static Maps API 호출
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
        const dataUrl = `data:${contentType};base64,${base64}`;

        // 3) 성공 시에만 LRU 캐시에 저장
        staticMapCache.set(cacheKey, dataUrl);
        return { dataUrl, success: true };
      } catch (error) {
        const isTimeout =
          error instanceof Error &&
          (error.name === "TimeoutError" || error.name === "AbortError");
        console.error(
          `[locationRouter] Static Maps API ${isTimeout ? "timeout" : "error"}:`,
          error instanceof Error ? error.message : error,
        );
        // 4) 실패 시 캐시에 아무것도 쓰지 않고 반환
        return { dataUrl: null, success: false };
      }
    }),
});
