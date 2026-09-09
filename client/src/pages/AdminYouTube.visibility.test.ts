import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = readFileSync(resolve(process.cwd(), "client/src/pages/AdminYouTube.tsx"), "utf8");
const adminRouter = readFileSync(resolve(process.cwd(), "server/routers/admin.ts"), "utf8");
const youtubeRepository = readFileSync(resolve(process.cwd(), "server/db/youtube.ts"), "utf8");

describe("AdminYouTube 노출 상태 제어", () => {
  it("썸네일 앞 노출·숨김 버튼이 aria 상태와 양쪽 아이콘을 제공한다", () => {
    expect(source).toContain('data-testid={`youtube-visibility-toggle-${video.id}`}');
    expect(source).toContain("aria-pressed={video.isActive === '1'}");
    expect(source).toContain("EyeOff");
    expect(source).toContain("노출 숨기기");
    expect(source).toContain("숨김 노출하기");
  });

  it("전환은 기존 admin update mutation의 isActive 값만 변경한다", () => {
    expect(source).toContain("trpc.admin.youtube.update.useMutation");
    expect(source).toContain("isActive: video.isActive === '1' ? '0' : '1'");
  });

  it("관리자는 숨김 레코드도 조회하고 공개 repository는 활성 레코드만 반환한다", () => {
    expect(adminRouter).toContain("getAllYouTubeVideosForAdmin");
    expect(adminRouter).toContain("getYouTubeVideosByTypeForAdmin");
    expect(youtubeRepository).toContain("export async function getAllYouTubeVideosForAdmin()");
    expect(youtubeRepository).toContain('where(eq(youtubeVideos.isActive, "1"))');
  });
});
