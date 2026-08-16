import type { RequestHandler } from "express";
import crypto from "crypto";
import { imageCache, imageNotFoundCache, type CachedImage } from "./imageCache";
import { getSafeImageContentType, isAllowedPopupImageUrl } from "./imageProxyPolicy";

const MAX_POPUP_BYTES = 5 * 1024 * 1024;

type PositiveCache = Pick<typeof imageCache, "get" | "set">;
type NegativeCache = Pick<typeof imageNotFoundCache, "has" | "set">;

export interface PopupImageProxyDependencies {
  fetchImpl?: typeof fetch;
  positiveCache?: PositiveCache;
  negativeCache?: NegativeCache;
}

/** Existing popup image proxy policy, isolated only to make cache behavior testable. */
export function createPopupImageProxyHandler({
  fetchImpl = fetch,
  positiveCache = imageCache,
  negativeCache = imageNotFoundCache,
}: PopupImageProxyDependencies = {}): RequestHandler {
  return async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      res.status(400).send("Missing or invalid url parameter");
      return;
    }
    if (!isAllowedPopupImageUrl(url)) {
      res.status(400).send("URL host not allowed");
      return;
    }

    const cacheKey = `popup:${url}`;
    try {
      if (negativeCache.has(cacheKey)) {
        res.status(404).send("Not found (cached)");
        return;
      }

      const cached = positiveCache.get(cacheKey);
      if (cached) {
        const ifNoneMatch = req.get("If-None-Match");
        if (ifNoneMatch === `"${cached.etag}"`) {
          res.status(304).end();
          return;
        }
        res.set("Content-Type", cached.contentType);
        res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
        res.set("ETag", `"${cached.etag}"`);
        res.set("Vary", "Accept, Accept-Encoding");
        res.set("Access-Control-Allow-Origin", "*");
        res.send(cached.buffer);
        return;
      }

      const response = await fetchImpl(url, {
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        if (response.status === 404) negativeCache.set(cacheKey, true);
        res.status(response.status).send("Failed to fetch image");
        return;
      }

      const declaredLength = Number(response.headers.get("content-length") || 0);
      if (declaredLength > MAX_POPUP_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }
      const contentType = getSafeImageContentType(response.headers.get("content-type"));
      if (!contentType) {
        res.status(415).type("text/plain").send("Unsupported image content type");
        return;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.byteLength > MAX_POPUP_BYTES) {
        res.status(413).type("text/plain").send("Payload too large");
        return;
      }
      const etag = crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 16);
      positiveCache.set(cacheKey, { buffer, contentType, etag } satisfies CachedImage);

      if (req.get("If-None-Match") === `"${etag}"`) {
        res.status(304).end();
        return;
      }
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
      res.set("ETag", `"${etag}"`);
      res.set("Vary", "Accept, Accept-Encoding");
      res.set("Access-Control-Allow-Origin", "*");
      res.send(buffer);
    } catch (error) {
      console.error("[PopupImageProxy] error:", error);
      res.status(502).send("Failed to fetch image");
    }
  };
}
