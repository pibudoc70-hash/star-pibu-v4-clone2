import type { Express } from "express";
import crypto from "crypto";
import { ENV } from "./env";
import { imageCache } from "./imageCache";

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
  // /manus-storage/* 경로도 하위 호환성을 위해 유지
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (key) {
      res.redirect(307, `/api/storage/${key}`);
    } else {
      res.status(400).send("Missing storage key");
    }
  });

  // /api/storage/* 경로: Cloudflare 규칙 우회 (origin 서버 직접 도달)
  app.get("/api/storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    const cacheKey = `storage:${key}`;

    try {
      // 1. LRU 캐시 조회
      const cached = imageCache.get(cacheKey);
      if (cached) {
        console.log(`[StorageProxy] [cache hit] key=${key}`);

        // If-None-Match 헤더 확인 (캐시 유효성 검사)
        const ifNoneMatch = req.get("If-None-Match");
        if (ifNoneMatch === `"${cached.etag}"`) {
          res.status(304).end();
          return;
        }

        const hasVersionParam = req.query.v !== undefined;
        const cacheControl = hasVersionParam
          ? "public, max-age=31536000, immutable"
          : "public, max-age=60, stale-while-revalidate=300";

        res.set("Content-Type", cached.contentType);
        res.set("Cache-Control", cacheControl);
        res.set("ETag", `"${cached.etag}"`);
        res.set("Vary", "Accept, Accept-Encoding");
        res.set("Access-Control-Allow-Origin", "*");
        res.send(cached.buffer);
        return;
      }

      // 2. presigned URL 발급
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

      // 3. 이미지 바이트를 직접 가져와서 스트리밍 (리다이렉트 대신)
      const imgResp = await fetch(url);
      if (!imgResp.ok) {
        console.error(`[StorageProxy] image fetch error: ${imgResp.status} key=${key}`);
        res.status(502).send("Failed to fetch image from storage");
        return;
      }

      // 4. 이미지 바이트 가져오기
      const buffer = await imgResp.arrayBuffer();
      const bufferData = Buffer.from(buffer);

      // 5. ETag 생성 (SHA1 해시의 첫 16자)
      const etag = crypto.createHash("sha1").update(bufferData).digest("hex").slice(0, 16);

      // 6. LRU 캐시에 저장
      const mimeType = getMimeType(key);
      imageCache.set(cacheKey, { buffer: bufferData, contentType: mimeType, etag });

      // 7. If-None-Match 헤더 확인 (캐시 유효성 검사)
      const ifNoneMatch = req.get("If-None-Match");
      if (ifNoneMatch === `"${etag}"`) {
        res.status(304).end();
        return;
      }

      // 8. Cache-Control 헤더 조건 분기
      const hasVersionParam = req.query.v !== undefined;
      const cacheControl = hasVersionParam
        ? "public, max-age=31536000, immutable"
        : "public, max-age=60, stale-while-revalidate=300";

      // 9. 응답 헤더 설정
      res.set("Content-Type", mimeType);
      res.set("Cache-Control", cacheControl);
      res.set("ETag", `"${etag}"`);
      res.set("Vary", "Accept, Accept-Encoding");
      res.set("Access-Control-Allow-Origin", "*");

      // 10. 바이트 직접 전송
      res.send(bufferData);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
