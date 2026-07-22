import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type EventRow = Record<string, unknown> & {
  id: number;
  title: string;
  isActive: "0" | "1";
  isSpecialEvent: "0" | "1";
  targetLang: string;
};

const eventStore = vi.hoisted(() => ({
  nextId: 1,
  rows: [] as EventRow[],
}));

vi.mock("../db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../db")>();
  return {
    ...actual,
    getAllEvents: vi.fn(async () => eventStore.rows.filter((event) => event.isActive === "1")),
    getSpecialEventsByLang: vi.fn(async (lang: string) =>
      eventStore.rows.filter(
        (event) => event.isActive === "1" && event.isSpecialEvent === "1" && event.targetLang === lang,
      ),
    ),
    createEvent: vi.fn(async (data: Record<string, unknown>) => {
      eventStore.rows.push({
        ...data,
        id: eventStore.nextId++,
        title: String(data.title),
        isActive: data.isActive === "0" ? "0" : "1",
        isSpecialEvent: data.isSpecialEvent === "1" ? "1" : "0",
        targetLang: String(data.targetLang ?? "ko"),
      });
    }),
    deleteEvent: vi.fn(async (id: number) => {
      eventStore.rows = eventStore.rows.filter((event) => event.id !== id);
    }),
  };
});

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function eventInput(overrides: Record<string, unknown> = {}) {
  return {
    type: "이벤트" as const,
    title: "테스트 특별 이벤트",
    subtitle: "테스트",
    desc: "테스트 설명",
    content: "테스트 내용",
    date: "2026년 4월 30일",
    badge: "테스트",
    badgeColor: "#4A6FA5",
    accent: "#4A6FA5",
    accentDark: "#2D4A7A",
    accentBg: "#EEF3FA",
    iconBg: "#E0EBF7",
    iconType: "tag",
    tag: "",
    hot: "0" as const,
    cta: "자세히 보기",
    views: 0,
    isFeatured: "0" as const,
    sortOrder: 0,
    isActive: "1" as const,
    category: "이벤트" as const,
    isSpecialEvent: "1" as const,
    productName: "테스트 상품",
    normalPrice: 100000,
    discountPrice: 50000,
    priceRows: [],
    anesthesiaFee: "수면마취비 별도",
    imageUrl: "",
    ...overrides,
  };
}

describe("events.special", () => {
  beforeEach(() => {
    eventStore.nextId = 1;
    eventStore.rows = [];
  });

  it("특별 이벤트가 없으면 빈 배열을 반환한다", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.events.special()).resolves.toEqual([]);
  });

  it("관리자가 특별 이벤트를 생성할 수 있다", async () => {
    const caller = appRouter.createCaller(createAdminContext());

    await expect(caller.events.create(eventInput({ title: "울쎼라피 프라임" }))).resolves.toEqual({ success: true });
    expect(eventStore.rows).toHaveLength(1);
    expect(eventStore.rows[0]).toMatchObject({
      title: "울쎼라피 프라임",
      isSpecialEvent: "1",
      isActive: "1",
      targetLang: "ko",
    });
  });

  it("활성화된 특별 이벤트만 조회한다", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await caller.events.create(eventInput({ title: "활성 특별 이벤트" }));
    await caller.events.create(eventInput({ title: "일반 이벤트", isSpecialEvent: "0" }));

    const specialEvents = await caller.events.special();

    expect(specialEvents).toHaveLength(1);
    expect(specialEvents[0]).toMatchObject({
      title: "활성 특별 이벤트",
      isSpecialEvent: "1",
      isActive: "1",
    });
  });

  it("비활성 특별 이벤트는 조회하지 않는다", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await caller.events.create(eventInput({ title: "비활성 특별 이벤트", isActive: "0" }));

    await expect(caller.events.special()).resolves.toEqual([]);
  });

  it("특별 이벤트 응답에 마취비 정보를 포함한다", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await caller.events.create(
      eventInput({
        title: "마취비 테스트 이벤트",
        anesthesiaFee: "수면마취비 별도 (별도 상담 필요)",
      }),
    );

    const [event] = await caller.events.special();
    expect(event).toMatchObject({ anesthesiaFee: "수면마취비 별도 (별도 상담 필요)" });
  });
});
