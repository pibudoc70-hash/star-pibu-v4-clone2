import { readFileSync } from "node:fs";
import { createContext, runInContext, Script } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const workerSource = readFileSync("client/public/sw.js", "utf8");
const APP_ORIGIN = "https://star-pibu.test";

class MockResponse {
  constructor(
    readonly label: string,
    readonly ok = true,
  ) {}

  clone() {
    return this;
  }
}

class MockRequest {
  readonly url: string;
  readonly method = "GET";
  readonly mode = "cors";
  readonly headers = { get: () => null };

  constructor(path: string) {
    this.url = `${APP_ORIGIN}${path}`;
  }
}

type CacheEntry = { request: MockRequest; response: MockResponse };

function createCache(
  initialEntries: CacheEntry[] = [],
  options: { keysError?: boolean; deleteError?: boolean } = {},
) {
  const entries = [...initialEntries];
  const deleted: string[] = [];

  return {
    entries,
    deleted,
    async match(request: MockRequest) {
      return entries.find((entry) => entry.request.url === request.url)?.response;
    },
    async keys() {
      if (options.keysError) throw new Error("mocked cache.keys failure");
      return entries.map((entry) => entry.request);
    },
    async put(request: MockRequest, response: MockResponse) {
      const existingIndex = entries.findIndex((entry) => entry.request.url === request.url);
      if (existingIndex >= 0) entries.splice(existingIndex, 1);
      entries.push({ request, response });
    },
    async delete(request: MockRequest) {
      if (options.deleteError) throw new Error("mocked cache.delete failure");
      deleted.push(request.url);
      const index = entries.findIndex((entry) => entry.request.url === request.url);
      if (index >= 0) entries.splice(index, 1);
      return true;
    },
  };
}

function imageEntries(count: number): CacheEntry[] {
  return Array.from({ length: count }, (_, index) => ({
    request: new MockRequest(`/image-${index}.webp`),
    response: new MockResponse(`image-${index}`),
  }));
}

async function flushBackgroundWork() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function createWorkerHarness({
  initialImageEntries = [],
  imageCacheOptions,
  fetchImpl = async () => new MockResponse("network"),
}: {
  initialImageEntries?: CacheEntry[];
  imageCacheOptions?: { keysError?: boolean; deleteError?: boolean };
  fetchImpl?: (request: MockRequest) => Promise<MockResponse>;
} = {}) {
  type FetchEvent = {
    request: MockRequest;
    respondWith: (response: Promise<MockResponse> | MockResponse) => void;
    waitUntil: (promise: Promise<unknown>) => void;
  };

  const listeners = new Map<string, (event: FetchEvent) => void>();
  const imageCache = createCache(initialImageEntries, imageCacheOptions);
  const nonImageCache = createCache([
    { request: new MockRequest("/assets/app.js"), response: new MockResponse("static") },
  ]);

  const context = {
    self: {
      addEventListener: (type: string, listener: (event: FetchEvent) => void) => listeners.set(type, listener),
      location: { origin: APP_ORIGIN },
      clients: { claim: async () => undefined },
      skipWaiting: () => undefined,
    },
    caches: {
      open: async (name: string) => (name.startsWith("image-") ? imageCache : nonImageCache),
      keys: async () => ["image-test", "static-test"],
      delete: async () => true,
    },
    fetch: fetchImpl,
    Request: MockRequest,
    Response: MockResponse,
    URL,
    Promise,
    console,
    setTimeout,
    clearTimeout,
  };

  runInContext(workerSource, createContext(context), { filename: "client/public/sw.js" });

  return {
    imageCache,
    nonImageCache,
    async dispatchImageFetch(request: MockRequest) {
      let responsePromise: Promise<MockResponse> | undefined;
      const backgroundPromises: Promise<unknown>[] = [];
      const listener = listeners.get("fetch");
      if (!listener) throw new Error("Service Worker fetch listener was not registered");

      listener({
        request,
        respondWith: (response) => {
          responsePromise = Promise.resolve(response);
        },
        waitUntil: (promise) => {
          backgroundPromises.push(Promise.resolve(promise));
        },
      });

      if (!responsePromise) throw new Error("Service Worker did not respond to image fetch");
      const response = await responsePromise;
      await Promise.all(backgroundPromises);
      return response;
    },
  };
}

describe("service worker cache policy", () => {
  it("keeps API, tRPC, admin, and auth responses outside the cache", () => {
    expect(workerSource).toContain('url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/storage/")');
    expect(workerSource).toContain('url.pathname.startsWith("/admin")');
    expect(workerSource).toContain('url.pathname.startsWith("/api/auth")');
  });

  it("keeps HTML network-first and bounds image cache writes safely", () => {
    expect(workerSource).toContain("async function handleHtml");
    expect(workerSource).toContain("const MAX_IMAGE_CACHE_ENTRIES = 60");
    expect(workerSource).toContain("async function putSafely");
    expect(workerSource).toContain("async function trimImageCache");
  });

  it("compiles the complete Service Worker source without executing it", () => {
    expect(() => new Script(workerSource, { filename: "client/public/sw.js" })).not.toThrow();
  });

  it("does not delete images while a successful image write keeps the cache at 60 entries", async () => {
    const fetchImpl = vi.fn(async () => new MockResponse("network"));
    const harness = createWorkerHarness({ initialImageEntries: imageEntries(59), fetchImpl });

    await harness.dispatchImageFetch(new MockRequest("/image-59.webp"));

    expect(harness.imageCache.entries).toHaveLength(60);
    expect(harness.imageCache.deleted).toEqual([]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("deletes the oldest image after a 61st successful image write and keeps the newest", async () => {
    const oldest = new MockRequest("/image-0.webp");
    const newest = new MockRequest("/image-60.webp");
    const harness = createWorkerHarness({ initialImageEntries: imageEntries(60) });

    await harness.dispatchImageFetch(newest);

    expect(harness.imageCache.entries).toHaveLength(60);
    expect(harness.imageCache.deleted).toEqual([oldest.url]);
    expect(harness.imageCache.entries.map((entry) => entry.request.url)).toContain(newest.url);
  });

  it("does not touch HTML or static caches while trimming images", async () => {
    const harness = createWorkerHarness({ initialImageEntries: imageEntries(60) });
    const nonImageBefore = harness.nonImageCache.entries.map((entry) => entry.request.url);

    await harness.dispatchImageFetch(new MockRequest("/image-60.webp"));

    expect(harness.nonImageCache.entries.map((entry) => entry.request.url)).toEqual(nonImageBefore);
    expect(harness.nonImageCache.deleted).toEqual([]);
  });

  it("returns a successful image response when cache maintenance keys or deletion fails", async () => {
    const keysFailure = createWorkerHarness({ imageCacheOptions: { keysError: true } });
    const deleteFailure = createWorkerHarness({
      initialImageEntries: imageEntries(60),
      imageCacheOptions: { deleteError: true },
    });

    await expect(keysFailure.dispatchImageFetch(new MockRequest("/keys-error.webp"))).resolves.toMatchObject({ ok: true });
    await expect(deleteFailure.dispatchImageFetch(new MockRequest("/delete-error.webp"))).resolves.toMatchObject({ ok: true });
  });

  it("returns a cached image immediately while using only the mocked fetch for revalidation", async () => {
    const cachedRequest = new MockRequest("/cached.webp");
    const cachedResponse = new MockResponse("cached");
    let resolveNetwork: (response: MockResponse) => void = () => undefined;
    const fetchImpl = vi.fn(
      () =>
        new Promise<MockResponse>((resolve) => {
          resolveNetwork = resolve;
        }),
    );
    const harness = createWorkerHarness({
      initialImageEntries: [{ request: cachedRequest, response: cachedResponse }],
      fetchImpl,
    });

    await expect(harness.dispatchImageFetch(cachedRequest)).resolves.toBe(cachedResponse);
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    resolveNetwork(new MockResponse("network"));
    await flushBackgroundWork();
  });
});
