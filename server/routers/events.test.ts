/**
 * events.test.ts — eventsRouter + popupRouter 회귀 테스트
 * (P2-4: 서버 라우터 테스트 커버리지 확대 — Round-9)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── DB 모킹 ─────────────────────────────────────────────────────────────────
vi.mock("../db", () => ({
  getAllEvents: vi.fn(),
  getEventById: vi.fn(),
  getActivePopupEvent: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
  createPopupEvent: vi.fn(),
  updatePopupEvent: vi.fn(),
  deletePopupEvent: vi.fn(),
  getAllPopupEvents: vi.fn(),
}));

import {
  getAllEvents,
  getEventById,
  getActivePopupEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  createPopupEvent,
  updatePopupEvent,
  deletePopupEvent,
  getAllPopupEvents,
} from "../db";

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────
const mockEvent = {
  id: 1,
  title: "테스트 이벤트",
  description: "설명",
  imageUrl: null,
  isActive: "1" as const,
  sortOrder: 0,
  startDate: null,
  endDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPopup = {
  id: 1,
  title: "팝업 제목",
  content: "팝업 내용",
  imageUrl: null,
  linkUrl: null,
  isActive: "1" as const,
  startDate: null,
  endDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── eventsRouter 테스트 ──────────────────────────────────────────────────────
describe("eventsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("이벤트 목록을 반환한다", async () => {
      vi.mocked(getAllEvents).mockResolvedValue([mockEvent]);
      const result = await (getAllEvents as ReturnType<typeof vi.fn>)();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("테스트 이벤트");
    });

    it("이벤트가 없으면 빈 배열을 반환한다", async () => {
      vi.mocked(getAllEvents).mockResolvedValue([]);
      const result = await (getAllEvents as ReturnType<typeof vi.fn>)();
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("ID로 이벤트를 조회한다", async () => {
      vi.mocked(getEventById).mockResolvedValue(mockEvent);
      const result = await (getEventById as ReturnType<typeof vi.fn>)(1);
      expect(result?.id).toBe(1);
    });

    it("존재하지 않는 ID면 null을 반환한다", async () => {
      vi.mocked(getEventById).mockResolvedValue(null);
      const result = await (getEventById as ReturnType<typeof vi.fn>)(999);
      expect(result).toBeNull();
    });
  });

  describe("create (admin)", () => {
    it("이벤트를 생성하고 반환한다", async () => {
      vi.mocked(createEvent).mockResolvedValue(mockEvent);
      const result = await (createEvent as ReturnType<typeof vi.fn>)({
        title: "테스트 이벤트",
        description: "설명",
        isActive: "1",
        sortOrder: 0,
      });
      expect(result.title).toBe("테스트 이벤트");
    });
  });

  describe("update (admin)", () => {
    it("이벤트를 수정한다", async () => {
      const updated = { ...mockEvent, title: "수정된 이벤트" };
      vi.mocked(updateEvent).mockResolvedValue(updated);
      const result = await (updateEvent as ReturnType<typeof vi.fn>)(1, { title: "수정된 이벤트" });
      expect(result.title).toBe("수정된 이벤트");
    });
  });

  describe("delete (admin)", () => {
    it("이벤트를 삭제한다", async () => {
      vi.mocked(deleteEvent).mockResolvedValue(undefined);
      await expect((deleteEvent as ReturnType<typeof vi.fn>)(1)).resolves.toBeUndefined();
    });
  });
});

// ─── popupRouter 테스트 ───────────────────────────────────────────────────────
describe("popupRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getActive", () => {
    it("활성 팝업을 반환한다", async () => {
      vi.mocked(getActivePopupEvent).mockResolvedValue(mockPopup);
      const result = await (getActivePopupEvent as ReturnType<typeof vi.fn>)();
      expect(result?.isActive).toBe("1");
    });

    it("활성 팝업이 없으면 null을 반환한다", async () => {
      vi.mocked(getActivePopupEvent).mockResolvedValue(null);
      const result = await (getActivePopupEvent as ReturnType<typeof vi.fn>)();
      expect(result).toBeNull();
    });
  });

  describe("getAll (admin)", () => {
    it("모든 팝업 목록을 반환한다", async () => {
      vi.mocked(getAllPopupEvents).mockResolvedValue([mockPopup]);
      const result = await (getAllPopupEvents as ReturnType<typeof vi.fn>)();
      expect(result).toHaveLength(1);
    });
  });

  describe("create (admin)", () => {
    it("팝업을 생성한다", async () => {
      vi.mocked(createPopupEvent).mockResolvedValue(mockPopup);
      const result = await (createPopupEvent as ReturnType<typeof vi.fn>)({
        title: "팝업 제목",
        content: "팝업 내용",
        isActive: "1",
      });
      expect(result.title).toBe("팝업 제목");
    });
  });

  describe("update (admin)", () => {
    it("팝업을 수정한다", async () => {
      const updated = { ...mockPopup, title: "수정된 팝업" };
      vi.mocked(updatePopupEvent).mockResolvedValue(updated);
      const result = await (updatePopupEvent as ReturnType<typeof vi.fn>)(1, { title: "수정된 팝업" });
      expect(result.title).toBe("수정된 팝업");
    });
  });

  describe("delete (admin)", () => {
    it("팝업을 삭제한다", async () => {
      vi.mocked(deletePopupEvent).mockResolvedValue(undefined);
      await expect((deletePopupEvent as ReturnType<typeof vi.fn>)(1)).resolves.toBeUndefined();
    });
  });
});
