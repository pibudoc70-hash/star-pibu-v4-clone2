import { describe, expect, it, vi } from "vitest";
import { createPopupImageProxyHandler } from "./popupImageProxy";
import type { CachedImage } from "./imageCache";

function createCaches() {
  const positive = new Map<string, CachedImage>();
  const negative = new Map<string, true>();
  return {
    positive: { get: (key: string) => positive.get(key), set: (key: string, value: CachedImage) => positive.set(key, value) },
    negative: { has: (key: string) => negative.has(key), set: (key: string, value: true) => negative.set(key, value) },
    positiveEntries: positive,
    negativeEntries: negative,
  };
}

function request(url: string, etag?: string) {
  return { query: { url }, get: vi.fn((name: string) => name === "If-None-Match" ? etag : undefined) } as any;
}

function response() {
  const state = { statusCode: 200, headers: new Map<string, string>(), body: undefined as unknown, ended: false };
  const res = {
    status: vi.fn((code: number) => { state.statusCode = code; return res; }),
    set: vi.fn((name: string, value: string) => { state.headers.set(name, value); return res; }),
    type: vi.fn(() => res),
    send: vi.fn((body: unknown) => { state.body = body; return res; }),
    end: vi.fn(() => { state.ended = true; return res; }),
  };
  return { res: res as any, state };
}

const popupA = "https://d2xsxph8kpxj0f.cloudfront.net/a.webp";
const popupB = "https://d2xsxph8kpxj0f.cloudfront.net/b.webp";
const image = (body: string, status = 200, type = "image/webp") => new Response(body, { status, headers: { "content-type": type, "content-length": String(Buffer.byteLength(body)) } });

describe("popup image proxy cache behavior", () => {
  it("stores a successful image once and reuses the positive cache with preserved response metadata", async () => {
    const caches = createCaches();
    const fetchImpl = vi.fn().mockResolvedValue(image("first"));
    const handler = createPopupImageProxyHandler({ fetchImpl, positiveCache: caches.positive, negativeCache: caches.negative });
    const first = response();
    await handler(request(popupA), first.res, vi.fn());
    const second = response();
    await handler(request(popupA), second.res, vi.fn());
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(caches.positiveEntries.has(`popup:${popupA}`)).toBe(true);
    expect(caches.negativeEntries.size).toBe(0);
    expect(second.state.body).toEqual(Buffer.from("first"));
    expect(second.state.headers.get("Content-Type")).toBe("image/webp");
    expect(second.state.headers.get("Cache-Control")).toBe("public, max-age=3600, stale-while-revalidate=86400");
  });

  it("returns 304 from a positive cache entry without another upstream fetch", async () => {
    const caches = createCaches();
    const fetchImpl = vi.fn().mockResolvedValue(image("etag-body"));
    const handler = createPopupImageProxyHandler({ fetchImpl, positiveCache: caches.positive, negativeCache: caches.negative });
    await handler(request(popupA), response().res, vi.fn());
    const etag = caches.positiveEntries.get(`popup:${popupA}`)?.etag;
    const conditional = response();
    await handler(request(popupA, `"${etag}"`), conditional.res, vi.fn());
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(conditional.state.statusCode).toBe(304);
    expect(conditional.state.ended).toBe(true);
  });

  it("uses distinct positive cache keys for distinct URLs", async () => {
    const caches = createCaches();
    const fetchImpl = vi.fn().mockResolvedValueOnce(image("a")).mockResolvedValueOnce(image("b"));
    const handler = createPopupImageProxyHandler({ fetchImpl, positiveCache: caches.positive, negativeCache: caches.negative });
    await handler(request(popupA), response().res, vi.fn());
    await handler(request(popupB), response().res, vi.fn());
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(caches.positiveEntries.get(`popup:${popupA}`)?.buffer).toEqual(Buffer.from("a"));
    expect(caches.positiveEntries.get(`popup:${popupB}`)?.buffer).toEqual(Buffer.from("b"));
  });

  it("does not cache blocked MIME responses and retries upstream", async () => {
    const caches = createCaches();
    const fetchImpl = vi.fn().mockResolvedValue(image("<html>", 200, "text/html"));
    const handler = createPopupImageProxyHandler({ fetchImpl, positiveCache: caches.positive, negativeCache: caches.negative });
    await handler(request(popupA), response().res, vi.fn());
    await handler(request(popupA), response().res, vi.fn());
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(caches.positiveEntries.size).toBe(0);
    expect(caches.negativeEntries.size).toBe(0);
  });

  it("negative-caches only upstream 404 responses", async () => {
    const caches = createCaches();
    const fetchImpl = vi.fn().mockResolvedValue(new Response("missing", { status: 404 }));
    const handler = createPopupImageProxyHandler({ fetchImpl, positiveCache: caches.positive, negativeCache: caches.negative });
    await handler(request(popupA), response().res, vi.fn());
    const cached = response();
    await handler(request(popupA), cached.res, vi.fn());
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(caches.negativeEntries.has(`popup:${popupA}`)).toBe(true);
    expect(cached.state.statusCode).toBe(404);
  });

  it("does not negative-cache upstream 500 responses or blocked URLs", async () => {
    const caches = createCaches();
    const fetchImpl = vi.fn().mockResolvedValue(new Response("error", { status: 500 }));
    const handler = createPopupImageProxyHandler({ fetchImpl, positiveCache: caches.positive, negativeCache: caches.negative });
    await handler(request(popupA), response().res, vi.fn());
    await handler(request(popupA), response().res, vi.fn());
    await handler(request("http://d2xsxph8kpxj0f.cloudfront.net/a.webp"), response().res, vi.fn());
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(caches.negativeEntries.size).toBe(0);
  });
});
