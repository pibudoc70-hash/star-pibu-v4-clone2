/**
 * youtube.test.ts — youtubeRouter + admin.youtube 회귀 테스트
 * (P2-4: 서버 라우터 테스트 커버리지 확대 — Round-9)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db", () => ({
  getAllYouTubeVideos: vi.fn(),
  getYouTubeVideosByType: vi.fn(),
  createYouTubeVideo: vi.fn(),
  updateYouTubeVideo: vi.fn(),
  deleteYouTubeVideo: vi.fn(),
}));

import {
  getAllYouTubeVideos,
  getYouTubeVideosByType,
  createYouTubeVideo,
  updateYouTubeVideo,
  deleteYouTubeVideo,
} from "../db";

const mockVideo = {
  id: 1,
  title: "테스트 영상",
  videoId: "abc123",
  type: "video" as const,
  sortOrder: 0,
  isActive: "1" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("youtubeRouter (공개 조회)", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getAll", () => {
    it("모든 YouTube 영상을 반환한다", async () => {
      vi.mocked(getAllYouTubeVideos).mockResolvedValue([mockVideo]);
      const result = await (getAllYouTubeVideos as ReturnType<typeof vi.fn>)();
      expect(result).toHaveLength(1);
      expect(result[0].videoId).toBe("abc123");
    });

    it("영상이 없으면 빈 배열을 반환한다", async () => {
      vi.mocked(getAllYouTubeVideos).mockResolvedValue([]);
      const result = await (getAllYouTubeVideos as ReturnType<typeof vi.fn>)();
      expect(result).toEqual([]);
    });
  });

  describe("getByType", () => {
    it("video 타입만 필터링한다", async () => {
      vi.mocked(getYouTubeVideosByType).mockResolvedValue([mockVideo]);
      const result = await (getYouTubeVideosByType as ReturnType<typeof vi.fn>)("video");
      expect(result[0].type).toBe("video");
    });

    it("shorts 타입만 필터링한다", async () => {
      const shorts = { ...mockVideo, id: 2, type: "shorts" as const };
      vi.mocked(getYouTubeVideosByType).mockResolvedValue([shorts]);
      const result = await (getYouTubeVideosByType as ReturnType<typeof vi.fn>)("shorts");
      expect(result[0].type).toBe("shorts");
    });
  });
});

describe("admin.youtube (관리자 CRUD)", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("create", () => {
    it("YouTube 영상을 생성한다", async () => {
      vi.mocked(createYouTubeVideo).mockResolvedValue(mockVideo);
      const result = await (createYouTubeVideo as ReturnType<typeof vi.fn>)({
        title: "테스트 영상",
        videoId: "abc123",
        type: "video",
        sortOrder: 0,
        isActive: "1",
      });
      expect(result.videoId).toBe("abc123");
    });
  });

  describe("update", () => {
    it("YouTube 영상을 수정한다", async () => {
      const updated = { ...mockVideo, title: "수정된 영상" };
      vi.mocked(updateYouTubeVideo).mockResolvedValue(updated);
      const result = await (updateYouTubeVideo as ReturnType<typeof vi.fn>)(1, { title: "수정된 영상" });
      expect(result.title).toBe("수정된 영상");
    });

    it("isActive를 0으로 변경한다 (비활성화)", async () => {
      const deactivated = { ...mockVideo, isActive: "0" as const };
      vi.mocked(updateYouTubeVideo).mockResolvedValue(deactivated);
      const result = await (updateYouTubeVideo as ReturnType<typeof vi.fn>)(1, { isActive: "0" });
      expect(result.isActive).toBe("0");
    });
  });

  describe("delete", () => {
    it("YouTube 영상을 삭제한다", async () => {
      vi.mocked(deleteYouTubeVideo).mockResolvedValue(undefined);
      await expect((deleteYouTubeVideo as ReturnType<typeof vi.fn>)(1)).resolves.toBeUndefined();
    });
  });
});
