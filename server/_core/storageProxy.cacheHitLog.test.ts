import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "server/_core/storageProxy.ts"), "utf8");

describe("storage proxy cache-hit observability", () => {
  it("does not write storage keys to console for cache hits", () => {
    expect(source).not.toContain("[StorageProxy] [cache hit] key=");
  });
});
