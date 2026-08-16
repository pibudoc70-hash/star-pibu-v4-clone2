import { readFileSync } from "node:fs";
import { Script } from "node:vm";
import { describe, expect, it } from "vitest";

const workerSource = readFileSync("client/public/sw.js", "utf8");

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
});
