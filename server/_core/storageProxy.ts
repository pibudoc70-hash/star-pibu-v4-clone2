import type { Express } from "express";
import { ENV } from "./env";

// 파일 확장자 → MIME 타입 매핑
const MIME_MAP: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  pdf: "application/pdf",
};

function getMimeType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return MIME_MAP[ext] ?? "application/octet-stream";
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      // 1. presigned URL 발급
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      // 2. 이미지 바이트를 직접 가져와서 스트리밍 (리다이렉트 대신)
      //    → Cloudflare가 Cache-Control 헤더를 덮어쓰는 문제 우회
      //    → 브라우저가 /manus-storage/ URL 자체를 캐시하므로 시크릿 모드·쿠키 초기화 후에도 정상 표시
      const imgResp = await fetch(url);
      if (!imgResp.ok) {
        console.error(`[StorageProxy] image fetch error: ${imgResp.status}`);
        res.status(502).send("Failed to fetch image from storage");
        return;
      }

      // 3. 브라우저에 1시간 캐시 설정
      const mimeType = getMimeType(key);
      res.set("Content-Type", mimeType);
      res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
      res.set("Access-Control-Allow-Origin", "*");

      // 4. 바이트 직접 전송
      const buffer = await imgResp.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
