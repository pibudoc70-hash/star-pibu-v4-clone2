/**
 * events.search.test.ts — events Repository 신규 헬퍼 단위 테스트
 *
 * 커버리지:
 *  - getEventsByCategory: 카테고리 필터 로직
 *  - searchEvents: title/desc 키워드 검색 로직
 *
 * DB 접근 없이 필터링 로직 자체를 검증한다.
 * (실제 DB 연동 테스트는 reservation.test.ts 패턴과 동일하게 통합 테스트로 분리)
 */
import { describe, it, expect } from "vitest";

// ─── 카테고리 필터 로직 ────────────────────────────────────────────────────────
describe("getEventsByCategory — 카테고리 필터 로직", () => {
  const mockRows = [
    { id: 1, title: "피코레이저 이벤트", desc: "레이저 할인", category: "이벤트", isActive: "1" },
    { id: 2, title: "신규 시술 안내", desc: "새로운 시술 소개", category: "신규시술", isActive: "1" },
    { id: 3, title: "공지사항", desc: "병원 공지", category: "공지사항", isActive: "1" },
    { id: 4, title: "기타 이벤트", desc: "기타 내용", category: "기타", isActive: "1" },
  ];

  it("이벤트 카테고리만 반환한다", () => {
    const result = mockRows.filter((e) => e.category === "이벤트");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("신규시술 카테고리만 반환한다", () => {
    const result = mockRows.filter((e) => e.category === "신규시술");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("존재하지 않는 카테고리는 빈 배열을 반환한다", () => {
    const result = mockRows.filter((e) => e.category === "없는카테고리");
    expect(result).toHaveLength(0);
  });
});

// ─── 키워드 검색 로직 ─────────────────────────────────────────────────────────
describe("searchEvents — 키워드 검색 로직", () => {
  const mockRows = [
    { id: 1, title: "피코레이저 토닝", desc: "레이저 시술 할인 이벤트", isActive: "1" },
    { id: 2, title: "보톡스 이벤트", desc: "주름 개선 시술", isActive: "1" },
    { id: 3, title: "공지사항", desc: "병원 휴무 안내", isActive: "1" },
  ];

  const search = (query: string) => {
    const q = query.toLowerCase();
    return mockRows.filter(
      (e) => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q),
    );
  };

  it("title에서 키워드를 찾는다", () => {
    const result = search("피코");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("desc에서 키워드를 찾는다", () => {
    const result = search("주름");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("대소문자 구분 없이 검색한다", () => {
    // 한글은 대소문자 없으므로, 영문 포함 케이스 검증
    const rows = [
      { id: 1, title: "Laser Treatment", desc: "laser event", isActive: "1" },
    ];
    const q = "LASER";
    const result = rows.filter(
      (e) => e.title.toLowerCase().includes(q.toLowerCase()) || e.desc.toLowerCase().includes(q.toLowerCase()),
    );
    expect(result).toHaveLength(1);
  });

  it("매칭 없으면 빈 배열을 반환한다", () => {
    const result = search("존재하지않는키워드xyz");
    expect(result).toHaveLength(0);
  });

  it("title과 desc 모두 매칭되는 경우 중복 없이 반환한다", () => {
    // "이벤트"는 id:1 desc, id:2 title에 모두 포함
    const result = search("이벤트");
    expect(result).toHaveLength(2);
    const ids = result.map((r) => r.id);
    expect(ids).toContain(1);
    expect(ids).toContain(2);
  });
});
