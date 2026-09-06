import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const robots = readFileSync(resolve(process.cwd(), "client/public/robots.txt"), "utf8");
const googlebotGroup = robots.match(/User-agent: Googlebot\n([\s\S]*?)(?=\n# ── 3\.|$)/)?.[0] ?? "";

describe("Googlebot robots group", () => {
  it("inherits the same API and admin exclusions explicitly", () => {
    expect(googlebotGroup).toContain("Allow: /");
    expect(googlebotGroup).toContain("Disallow: /api/");
    expect(googlebotGroup).toContain("Disallow: /admin/");
    expect(googlebotGroup).toContain("Disallow: /api/trpc/");
  });

  it("does not add crawl-delay or public-page exclusions for Googlebot", () => {
    expect(googlebotGroup).not.toContain("Crawl-delay");
    expect(googlebotGroup).not.toContain("Disallow: /treatments");
    expect(googlebotGroup).not.toContain("Disallow: /equipment3");
  });
});
