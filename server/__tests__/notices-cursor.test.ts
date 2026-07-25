/**
 * server/__tests__/notices-cursor.test.ts
 *
 * getNoticesByCursor 커서 기반 페이지네이션 유닛 테스트
 *
 * 검증 항목:
 * 1. cursor 없이 호출하면 첫 페이지 반환
 * 2. limit 보다 많은 데이터가 있으면 hasMore=true, nextCursor 존재
 * 3. limit 이하면 hasMore=false, nextCursor=null
 * 4. limit 최대값 100 으로 제한됨
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── DB mock ───────────────────────────────────────────────────────────────────
// getDb()가 반환하는 Drizzle 체인을 모킹한다.
// 실제 DB에 연결하지 않으며, select().from().where().orderBy().limit() 체인을 시뮬레이션한다.

const mockRows: { id: number; title: string; content: string; isPinned: "0" | "1"; views: number; targetLang: "all"; sourceNoticeId: null; createdAt: Date; updatedAt: Date }[] = Array.from(
  { length: 25 },
  (_, i) => ({
    id: 25 - i,
    title: `공지 ${25 - i}`,
    content: `내용 ${25 - i}`,
    isPinned: "0" as const,
    views: 0,
    targetLang: "all" as const,
    sourceNoticeId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
);

// select 체인 빌더 팩토리
function makeChain(rows: typeof mockRows) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(rows),
  };
  return chain;
}

vi.mock("../db/connection", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "../db/connection";
import { getNoticesByCursor } from "../db/notices";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getNoticesByCursor", () => {
  it("1. cursor 없이 호출하면 첫 페이지 반환 (limit=20 기본값)", async () => {
    // limit+1 = 21 행을 반환 → hasMore=true
    const fakeRows = mockRows.slice(0, 21);
    const chain = makeChain(fakeRows);
    vi.mocked(getDb).mockResolvedValue(chain as never);

    const result = await getNoticesByCursor({});

    expect(result.items).toHaveLength(20);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(result.items[result.items.length - 1].id);
    // where 호출 시 cursor가 undefined이면 undefined가 전달되어야 함
    expect(chain.where).toHaveBeenCalledWith(undefined);
  });

  it("2. limit 보다 많은 데이터가 있으면 hasMore=true, nextCursor 존재", async () => {
    const limit = 5;
    // limit+1 = 6 행 반환
    const fakeRows = mockRows.slice(0, 6);
    const chain = makeChain(fakeRows);
    vi.mocked(getDb).mockResolvedValue(chain as never);

    const result = await getNoticesByCursor({ limit });

    expect(result.items).toHaveLength(5);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).not.toBeNull();
    expect(result.nextCursor).toBe(fakeRows[4].id);
  });

  it("3. limit 이하면 hasMore=false, nextCursor=null", async () => {
    const limit = 20;
    // 데이터가 limit보다 적음 (10행)
    const fakeRows = mockRows.slice(0, 10);
    const chain = makeChain(fakeRows);
    vi.mocked(getDb).mockResolvedValue(chain as never);

    const result = await getNoticesByCursor({ limit });

    expect(result.items).toHaveLength(10);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it("4. limit 최대값 100으로 제한됨 (limit=200 입력 시 100으로 클램프)", async () => {
    // limit=200 요청 → 내부에서 100으로 클램프 → DB에는 101 요청
    // 101행 반환 → hasMore=true
    const fakeRows = Array.from({ length: 101 }, (_, i) => ({
      ...mockRows[0],
      id: 200 - i,
    }));
    const chain = makeChain(fakeRows);
    vi.mocked(getDb).mockResolvedValue(chain as never);

    const result = await getNoticesByCursor({ limit: 200 });

    // 클램프된 limit=100 이 적용되어 items는 100개
    expect(result.items).toHaveLength(100);
    expect(result.hasMore).toBe(true);
    // DB limit 호출 시 101(=100+1)이 전달되어야 함
    expect(chain.limit).toHaveBeenCalledWith(101);
  });
});
