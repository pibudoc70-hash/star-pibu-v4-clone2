import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const collector = readFileSync(resolve(projectRoot, "client/public/__manus__/debug-collector.js"), "utf8");
const viteConfig = readFileSync(resolve(projectRoot, "vite.config.ts"), "utf8");

describe("Manus debug collector bfcache contract", () => {
  it("uses bfcache-safe pagehide beacon reporting rather than blocking unload events", () => {
    expect(collector).toContain('window.addEventListener("pagehide"');
    expect(collector).toContain("navigator.sendBeacon(CONFIG.reportEndpoint");
    expect(collector).not.toMatch(/addEventListener\(\s*["'](?:beforeunload|unload)["']/);
  });

  it("is injected only by the development-only Vite plugin", () => {
    expect(viteConfig).toContain("developmentOnly(vitePluginManusDebugCollector())");
    expect(viteConfig).toContain('src: "/__manus__/debug-collector.js"');
  });
});
