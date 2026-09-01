import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const viteConfig = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");

describe("home lazy-route chunking contract", () => {
  it("does not force lazy locale or admin routes and their shared dependencies into one manual chunk", () => {
    expect(viteConfig).not.toContain('return "page-landings"');
    expect(viteConfig).not.toContain('"page-landings",   // /en, /ja, /zh 진입 시에만 필요');
    expect(viteConfig).not.toContain('return "page-admin"');
    expect(viteConfig).not.toContain('"page-admin",      // 관리자 페이지 (일반 방문자는 접근 안 함)');
  });

  it("does not use an explicit-manual-chunk workaround that can recreate chunk cycles", () => {
    expect(viteConfig).not.toContain("onlyExplicitManualChunks: true");
    expect(viteConfig).not.toContain('return "data-treatments"');
  });
});
