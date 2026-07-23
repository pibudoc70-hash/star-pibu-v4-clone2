import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";

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
        width: z.number().int().min(100).max(1280).default(640),
        height: z.number().int().min(100).max(1280).default(480),
        scale: z.number().int().min(1).max(2).default(1),
      })
    )
    .query(async ({ input }) => {
      const { width, height, scale } = input;
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

      // 이미지를 직접 fetch하여 base64로 인코딩 후 data URL로 반환
      // 이렇게 하면 클라이언트에서 API 키 없이 이미지를 표시할 수 있음
      try {
        const response = await fetch(staticMapUrl);
        if (!response.ok) {
          throw new Error(`Static Maps API returned ${response.status}`);
        }
        const contentType = response.headers.get("content-type") || "image/png";
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const dataUrl = `data:${contentType};base64,${base64}`;
        return { dataUrl, success: true };
      } catch (error) {
        console.error("[locationRouter] Static Maps API error:", error);
        return { dataUrl: null, success: false };
      }
    }),
});
