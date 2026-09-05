import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const viteServerSource = fs.readFileSync(path.join(projectRoot, "server/_core/vite.ts"), "utf8");
const buildManifest = fs.readFileSync(path.join(projectRoot, "package.json"), "utf8");
const precompressScript = fs.readFileSync(path.join(projectRoot, "scripts/precompress-static-assets.mjs"), "utf8");

describe("production precompressed static assets", () => {
  it("resolves the function-form Vite config in serve mode so the client root and development asset base remain valid", () => {
    expect(viteServerSource).toContain('typeof viteConfig === "function"');
    expect(viteServerSource).toContain('viteConfig({ command: "serve", mode: "development", isSsrBuild: false, isPreview: false })');
    expect(viteServerSource).toContain("...resolvedViteConfig");
  });

  it("builds Brotli variants for hashed JavaScript and CSS before bundling the server", () => {
    expect(buildManifest).toContain("vite build && node scripts/precompress-static-assets.mjs && esbuild");
    expect(precompressScript).toContain("dist", "public", "assets");
    expect(precompressScript).toContain("/\\.(?:js|css)$/i");
    expect(precompressScript).toContain("brotliCompressSync");
  });

  it("negotiates available Brotli assets while preserving source MIME, Vary, cache, and SPA fallback behavior", () => {
    expect(viteServerSource).toContain('app.use("/__static", precompressedStatic)');
    expect(viteServerSource).toContain('enableBrotli: true');
    expect(viteServerSource).toContain('orderPreference: ["br"]');
    expect(viteServerSource).toContain('index: false');
    expect(viteServerSource).toContain('filePath.endsWith(".br") ? filePath.slice(0, -3) : filePath');
    expect(viteServerSource).toContain('res.setHeader(\n            "Content-Type",\n            sourcePath.endsWith(".css") ? "text/css; charset=utf-8" : "text/javascript; charset=utf-8",');
    expect(viteServerSource).toContain('res.setHeader("Vary", "Accept-Encoding")');
    expect(viteServerSource).toContain('"public, max-age=7776000, immutable"');
    expect(viteServerSource).toContain('"no-cache, must-revalidate"');
  });
});
