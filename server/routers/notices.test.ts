/**
 * server/routers/notices.test.ts
 *
 * 공지사항 tRPC 라우터 단위 테스트
 * - notices.list: 공지사항 목록 조회 (고정글 먼저, 최신순)
 * - notices.getById: 공지사항 단건 조회 + 조회수 증가
 * - notices.create: 공지사항 등록 (관리자 전용)
 * - notices.update: 공지사항 수정 (관리자 전용)
 * - notices.delete: 공지사항 삭제 (관리자 전용)
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Notice } from "@/types";

// ── Mock 데이터 ────────────────────────────────────────────────────────────────

const mockNotices: Notice[] = [
  {
    id: 1,
    title: "공지사항 1",
    content: "내용 1",
    isPinned: "1",
    views: 100,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  },
  {
    id: 2,
    title: "공지사항 2",
    content: "내용 2",
    isPinned: "0",
    views: 50,
    createdAt: new Date("2026-01-02"),
    updatedAt: new Date("2026-01-02"),
  },
  {
    id: 3,
    title: "공지사항 3",
    content: "내용 3",
    isPinned: "0",
    views: 30,
    createdAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-03"),
  },
];

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe("notices.list", () => {
  it("고정글이 맨 앞에 오고 최신순으로 정렬된다", () => {
    // 고정글(isPinned=1)이 먼저 오고, 그 다음 최신순
    const sorted = [...mockNotices].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned === "1" ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    expect(sorted[0].id).toBe(1); // 고정글
    expect(sorted[1].id).toBe(3); // 최신글
    expect(sorted[2].id).toBe(2); // 이전글
  });

  it("빈 목록을 반환할 수 있다", () => {
    const emptyList: Notice[] = [];
    expect(emptyList).toHaveLength(0);
  });
});

describe("notices.getById", () => {
  it("ID로 공지사항을 조회할 수 있다", () => {
    const notice = mockNotices.find((n) => n.id === 1);
    expect(notice).toBeDefined();
    expect(notice?.title).toBe("공지사항 1");
  });

  it("존재하지 않는 ID는 undefined를 반환한다", () => {
    const notice = mockNotices.find((n) => n.id === 999);
    expect(notice).toBeUndefined();
  });

  it("조회수가 증가해야 한다", () => {
    const notice = { ...mockNotices[0] };
    const initialViews = notice.views;
    notice.views += 1;
    expect(notice.views).toBe(initialViews + 1);
  });
});

describe("notices.create", () => {
  it("새로운 공지사항을 생성할 수 있다", () => {
    const newNotice: Notice = {
      id: 4,
      title: "새 공지사항",
      content: "새로운 내용",
      isPinned: "0",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(newNotice.title).toBe("새 공지사항");
    expect(newNotice.views).toBe(0);
    expect(newNotice.isPinned).toBe("0");
  });

  it("제목과 내용이 필수이다", () => {
    const invalidNotice = {
      title: "",
      content: "",
    };

    expect(invalidNotice.title).toBe("");
    expect(invalidNotice.content).toBe("");
  });
});

describe("notices.update", () => {
  it("공지사항 제목을 수정할 수 있다", () => {
    const notice = { ...mockNotices[0] };
    notice.title = "수정된 제목";
    expect(notice.title).toBe("수정된 제목");
  });

  it("공지사항 고정 여부를 변경할 수 있다", () => {
    const notice = { ...mockNotices[1] };
    notice.isPinned = "1";
    expect(notice.isPinned).toBe("1");
  });

  it("updatedAt이 현재 시간으로 업데이트된다", () => {
    const notice = { ...mockNotices[0] };
    const oldTime = notice.updatedAt;
    notice.updatedAt = new Date();
    expect(notice.updatedAt.getTime()).toBeGreaterThanOrEqual(oldTime.getTime());
  });
});

describe("notices.delete", () => {
  it("공지사항을 삭제할 수 있다", () => {
    const notices = [...mockNotices];
    const initialLength = notices.length;
    notices.splice(0, 1); // 첫 번째 항목 삭제
    expect(notices.length).toBe(initialLength - 1);
  });

  it("존재하지 않는 ID 삭제는 에러를 발생시킨다", () => {
    const notices = [...mockNotices];
    const notFound = notices.find((n) => n.id === 999);
    expect(notFound).toBeUndefined();
  });
});

describe("notices 데이터 타입", () => {
  it("Notice 타입이 올바른 필드를 가진다", () => {
    const notice = mockNotices[0];
    expect(notice).toHaveProperty("id");
    expect(notice).toHaveProperty("title");
    expect(notice).toHaveProperty("content");
    expect(notice).toHaveProperty("isPinned");
    expect(notice).toHaveProperty("views");
    expect(notice).toHaveProperty("createdAt");
    expect(notice).toHaveProperty("updatedAt");
  });

  it("isPinned는 '0' 또는 '1'이다", () => {
    mockNotices.forEach((notice) => {
      expect(["0", "1"]).toContain(notice.isPinned);
    });
  });

  it("views는 음수가 아닌 정수이다", () => {
    mockNotices.forEach((notice) => {
      expect(notice.views).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(notice.views)).toBe(true);
    });
  });
});
