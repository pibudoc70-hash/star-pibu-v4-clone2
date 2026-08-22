import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("consultation CAPTCHA removal", () => {
  it("keeps the public consultation flow free from Turnstile widgets, tokens, and server verification", () => {
    const sources = [
      read("client/src/components/ConsultationFormSection.tsx"),
      read("server/routers/consultation.ts"),
      read("server/_core/envSchema.ts"),
      read("server/_core/securityHeaders.ts"),
      read("client/src/index.css"),
      read(".github/workflows/ci.yml"),
    ].join("\n");

    expect(sources).not.toMatch(/turnstile|captcha|challenges\.cloudflare/i);
  });
});
