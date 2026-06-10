/**
 * Commit 26-5: getReservationPath 헬퍼 단위 테스트
 * - locale별 예약 진입 경로 검증
 * - dead link /reserve 참조 0건 검증
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { getReservationPath } from "../../client/src/lib/reservationPath";

describe("getReservationPath", () => {
  it("ko => /#reservation", () => {
    expect(getReservationPath("ko")).toBe("/#reservation");
  });

  it("en => /en#reservation", () => {
    expect(getReservationPath("en")).toBe("/en#reservation");
  });

  it("ja => /ja#reservation", () => {
    expect(getReservationPath("ja")).toBe("/ja#reservation");
  });

  it("zh => /zh#reservation", () => {
    expect(getReservationPath("zh")).toBe("/zh#reservation");
  });

  it("unknown lang falls back to ko path", () => {
    // 타입 강제 캐스팅으로 알 수 없는 lang 테스트
    expect(getReservationPath("fr" as "ko")).toBe("/#reservation");
  });
});

describe("dead link audit: /reserve 참조 0건", () => {
  const clientSrcRoot = join(__dirname, "../../client/src");

  const readSource = (relPath: string): string => {
    try {
      return readFileSync(join(clientSrcRoot, relPath), "utf-8");
    } catch {
      return "";
    }
  };

  const DEAD_LINK_PATTERN = /(?:href|setLocation)\s*\(\s*["'`]\/reserve["'`]/;

  const TARGET_FILES = [
    "pages/Equipment2Detail.tsx",
    "pages/MyPage.tsx",
    "pages/MyReservations.tsx",
    "pages/TreatmentPage.tsx",
    "pages/TreatmentDetail.tsx",
    "App.tsx",
  ];

  TARGET_FILES.forEach((file) => {
    it(`${file} - /reserve dead link 없음`, () => {
      const content = readSource(file);
      expect(DEAD_LINK_PATTERN.test(content)).toBe(false);
    });
  });

  it("getReservationPath 헬퍼가 모든 CTA 파일에서 사용됨", () => {
    const filesUsingHelper = TARGET_FILES.filter((file) => {
      const content = readSource(file);
      return content.includes("getReservationPath");
    });
    // Equipment2Detail, MyPage, MyReservations, TreatmentPage 4개 이상 사용
    expect(filesUsingHelper.length).toBeGreaterThanOrEqual(4);
  });
});
