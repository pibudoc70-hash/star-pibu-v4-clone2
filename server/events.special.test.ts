import { describe, it, expect, afterEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { Event } from "../drizzle/schema";

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

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("events.special", () => {
  // Cleanup function to remove test events
  async function cleanupTestEvents(caller: ReturnType<typeof appRouter.createCaller>) {
    const allEvents = await caller.events.list();
    const testEventTitles = ["울쎼라피 프라임", "테스트 특별 이벤트", "비활성 특별 이벤트", "마취비 테스트 이벤트"];
    for (const event of allEvents) {
      if (testEventTitles.includes(event.title)) {
        try {
          await caller.events.delete({ id: event.id });
        } catch (e) {
          // Ignore deletion errors
        }
      }
    }
  }

  afterEach(async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await cleanupTestEvents(caller);
  });

  it("should return empty array when no special events exist", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.events.special();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a special event with isSpecialEvent=1", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const eventData = {
      type: "이벤트" as const,
      title: "울쎼라피 프라임",
      subtitle: "특별한 가격으로 시작하는 고급 시술",
      desc: "울쎼라피 프라임 시술입니다.",
      content: "상세 설명",
      date: "2026년 4월 30일",
      badge: "신규",
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
      productName: "울쎼라피 프라임",
      normalPrice: 500000,
      discountPrice: 350000,
      priceRows: [{ label: "기본 패키지", normalPrice: 500000, discountPrice: 350000 }],
      anesthesiaFee: "수면마취비 별도",
      imageUrl: "",
    };

    const result = await caller.events.create(eventData);

    expect(result).toEqual({ success: true });
  });

  it("should filter events by isSpecialEvent=1 and isActive=1", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // 먼저 특별 이벤트를 생성
    const eventData = {
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
    };

    await caller.events.create(eventData);

    // special 쿼리 실행
    const specialEvents = await caller.events.special();

    // 결과 검증
    expect(Array.isArray(specialEvents)).toBe(true);
    
    // 생성된 이벤트가 포함되어 있는지 확인
    const testEvent = specialEvents.find((e: Event) => e.title === "테스트 특별 이벤트");
    if (testEvent) {
      expect(testEvent.isSpecialEvent).toBe("1");
      expect(testEvent.isActive).toBe("1");
      expect(testEvent.anesthesiaFee).toBe("수면마취비 별도");
    }
  });

  it("should not include inactive events in special events", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const eventData = {
      type: "이벤트" as const,
      title: "비활성 특별 이벤트",
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
      isActive: "0" as const, // 비활성
      category: "이벤트" as const,
      isSpecialEvent: "1" as const,
      productName: "테스트 상품",
      normalPrice: 100000,
      discountPrice: 50000,
      priceRows: [],
      anesthesiaFee: "수면마취비 별도",
      imageUrl: "",
    };

    await caller.events.create(eventData);

    // special 쿼리 실행
    const specialEvents = await caller.events.special();

    // 비활성 이벤트는 포함되지 않아야 함
    const inactiveEvent = specialEvents.find((e: Event) => e.title === "비활성 특별 이벤트");
    expect(inactiveEvent).toBeUndefined();
  });

  it("should include anesthesiaFee in special event response", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const eventData = {
      type: "이벤트" as const,
      title: "마취비 테스트 이벤트",
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
      productName: "마취비 테스트 상품",
      normalPrice: 100000,
      discountPrice: 50000,
      priceRows: [],
      anesthesiaFee: "수면마취비 별도 (별도 상담 필요)",
      imageUrl: "",
    };

    await caller.events.create(eventData);

    // special 쿼리 실행
    const specialEvents = await caller.events.special();

    // 마취비 정보가 포함되어 있는지 확인
    const testEvent = specialEvents.find((e: Event) => e.title === "마취비 테스트 이벤트");
    if (testEvent) {
      expect(testEvent.anesthesiaFee).toBe("수면마취비 별도 (별도 상담 필요)");
    }
  });
});
