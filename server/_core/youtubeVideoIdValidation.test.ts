import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { YOUTUBE_VIDEO_ID_PATTERN, isValidYouTubeVideoId } from "./imageProxyPolicy";

const projectRoot = resolve(process.cwd());
const indexSource = readFileSync(resolve(projectRoot, "server/_core/index.ts"), "utf8");
const adminSource = readFileSync(resolve(projectRoot, "server/routers/admin.ts"), "utf8");

describe("YouTube video ID validation policy", () => {
  it("accepts only canonical 11-character YouTube IDs", () => {
    expect(YOUTUBE_VIDEO_ID_PATTERN).toEqual(/^[A-Za-z0-9_-]{11}$/);
    expect(isValidYouTubeVideoId("dQw4w9WgXcQ")).toBe(true);
    expect(isValidYouTubeVideoId("Ab_Cd-Ef123")).toBe(true);
  });

  it.each([
    "dQw4w9WgXc",
    "dQw4w9WgXcQ1",
    "dQw4 w9WgXcQ",
    "dQw4w9/WgXc",
    "dQw4w9.WgXc",
    "dQw4w9WgXcQ?x=1",
    "dQw4w9WgXcQ#fragment",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "%2Fetc%2Fpass",
    "한글비디오아이디",
  ])("rejects invalid ID before it can become a thumbnail resource: %s", (videoId) => {
    expect(isValidYouTubeVideoId(videoId)).toBe(false);
  });

  it("places the thumbnail proxy validation before cache key construction and upstream URL/fetch work", () => {
    const validation = indexSource.indexOf("isValidYouTubeVideoId(videoId)");
    const cacheKey = indexSource.indexOf("const cacheKey = `yt:${videoId}`");
    const upstreamUrl = indexSource.indexOf("https://img.youtube.com/vi/${videoId}/maxresdefault.jpg");
    const upstreamFetch = indexSource.indexOf("const resp = await fetch(url");

    expect(validation).toBeGreaterThan(-1);
    expect(validation).toBeLessThan(cacheKey);
    expect(validation).toBeLessThan(upstreamUrl);
    expect(validation).toBeLessThan(upstreamFetch);
  });

  it("uses the same strict policy for non-reservation YouTube admin create and update inputs", () => {
    expect(adminSource).toContain('import { YOUTUBE_VIDEO_ID_PATTERN } from "../_core/imageProxyPolicy"');
    expect(adminSource).toContain("videoId: z.string().regex(YOUTUBE_VIDEO_ID_PATTERN)");
    expect(adminSource).toContain("videoId: z.string().regex(YOUTUBE_VIDEO_ID_PATTERN).optional()");
  });
});
