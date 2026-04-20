import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ── 테스트용 컨텍스트 팩토리 ──────────────────────────────────────
function makeCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: role === "admin" ? "admin-open-id" : "user-open-id",
      name: role === "admin" ? "관리자" : "일반사용자",
      email: `${role}@example.com`,
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function makeGuestCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

// ── auth 테스트 ───────────────────────────────────────────────────
describe("auth", () => {
  it("me: 비로그인 시 null 반환", async () => {
    const caller = appRouter.createCaller(makeGuestCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me: 로그인 시 사용자 정보 반환", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.role).toBe("user");
  });

  it("logout: 성공 응답 반환", async () => {
    const clearedCookies: string[] = [];
    const ctx: TrpcContext = {
      ...makeCtx("user"),
      res: {
        clearCookie: (name: string) => { clearedCookies.push(name); },
      } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(clearedCookies.length).toBeGreaterThan(0);
  });
});

// ── events 테스트 ─────────────────────────────────────────────────
describe("events", () => {
  it("list: 공개 접근 가능 (빈 배열 또는 배열 반환)", async () => {
    const caller = appRouter.createCaller(makeGuestCtx());
    const result = await caller.events.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("create: 비관리자는 FORBIDDEN 오류 발생", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.events.create({
        title: "테스트 이벤트",
        desc: "테스트 설명",
        date: "2026-04-20",
        type: "이벤트",
        category: "이벤트",
      })
    ).rejects.toThrow();
  });

  it("delete: 비관리자는 FORBIDDEN 오류 발생", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.events.delete({ id: 9999 })).rejects.toThrow();
  });
});

// ── popup 테스트 ──────────────────────────────────────────────────
describe("popup", () => {
  it("list: 공개 접근 가능 (빈 배열 또는 배열 반환)", async () => {
    const caller = appRouter.createCaller(makeGuestCtx());
    const result = await caller.popup.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("create: 비관리자는 FORBIDDEN 오류 발생", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.popup.create({
        tab: "이벤트",
        title: "테스트 팝업",
      })
    ).rejects.toThrow();
  });
});

// ── admin 테스트 ──────────────────────────────────────────────────
describe("admin", () => {
  it("users: 비관리자는 FORBIDDEN 오류 발생", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.admin.users()).rejects.toThrow();
  });

  it("users: 비로그인은 UNAUTHORIZED 오류 발생", async () => {
    const caller = appRouter.createCaller(makeGuestCtx());
    await expect(caller.admin.users()).rejects.toThrow();
  });

  it("updateRole: 비관리자는 FORBIDDEN 오류 발생", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.admin.updateRole({ id: 1, role: "admin" })
    ).rejects.toThrow();
  });
});
