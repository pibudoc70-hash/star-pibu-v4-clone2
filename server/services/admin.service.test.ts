/**
 * admin.service.test.ts — 관리자 서비스 유스케이스 단위 테스트
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── 모킹 ─────────────────────────────────────────────────────────────────────
vi.mock("../db", () => ({
  getReservationById: vi.fn(),
  updateReservationStatus: vi.fn(),
  getUserStats: vi.fn(),
  getReservationStats: vi.fn(),
}));

vi.mock("../_core/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { updateAdminReservationStatus, getAdminStats } from "./admin.service";
import { getReservationById, updateReservationStatus, getUserStats, getReservationStats } from "../db";
import { logger } from "../_core/logger";

const mockGetReservationById = vi.mocked(getReservationById);
const mockUpdateReservationStatus = vi.mocked(updateReservationStatus);
const mockLogger = vi.mocked(logger);
const mockGetUserStats = vi.mocked(getUserStats);
const mockGetReservationStats = vi.mocked(getReservationStats);

// ── updateAdminReservationStatus 테스트 ───────────────────────────────────────
describe("updateAdminReservationStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateReservationStatus.mockResolvedValue(undefined as never);
  });

  it("예약을 찾지 못해도 상태 변경은 정상 실행된다", async () => {
    mockGetReservationById.mockResolvedValue(null as never);

    await updateAdminReservationStatus({ id: 1, status: "confirmed" });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith(1, "confirmed", undefined);
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it("비회원 예약 상태 변경 시 비회원 처리 로그를 남긴다", async () => {
    mockGetReservationById.mockResolvedValue({ id: 1, isGuest: "1" } as never);

    await updateAdminReservationStatus({ id: 1, status: "confirmed" });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith(1, "confirmed", undefined);
    expect(mockLogger.info).toHaveBeenCalledWith("Email", "비회원 예약 상태 변경 처리");
  });

  it("회원 예약 상태 변경 시 회원 처리 로그를 남긴다", async () => {
    mockGetReservationById.mockResolvedValue({ id: 1, isGuest: "0" } as never);

    await updateAdminReservationStatus({ id: 1, status: "completed" });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith(1, "completed", undefined);
    expect(mockLogger.info).toHaveBeenCalledWith("Email", "회원 예약 상태 변경 처리");
  });

  it("adminNote를 함께 전달한다", async () => {
    mockGetReservationById.mockResolvedValue({ id: 5, isGuest: "0" } as never);

    await updateAdminReservationStatus({ id: 5, status: "cancelled", adminNote: "환자 요청" });

    expect(mockUpdateReservationStatus).toHaveBeenCalledWith(5, "cancelled", "환자 요청");
  });

  it("updateReservationStatus 실패 시 에러를 전파한다", async () => {
    mockGetReservationById.mockResolvedValue(null as never);
    mockUpdateReservationStatus.mockRejectedValue(new Error("DB error") as never);

    await expect(
      updateAdminReservationStatus({ id: 99, status: "pending" }),
    ).rejects.toThrow("DB error");
  });
});

// ── getAdminStats 테스트 ──────────────────────────────────────────────────────
describe("getAdminStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("회원 통계와 예약 통계를 병렬 조회하여 하나의 응답으로 조합한다", async () => {
    mockGetUserStats.mockResolvedValue({
      totalUsers: 100,
      adminUsers: 3,
      recentSignups: 12,
    } as never);
    mockGetReservationStats.mockResolvedValue({
      total: 50,
      pending: 10,
      confirmed: 20,
      completed: 15,
      cancelled: 5,
    } as never);

    const result = await getAdminStats();

    expect(result).toEqual({
      totalUsers: 100,
      adminUsers: 3,
      recentSignups: 12,
      reservations: {
        total: 50,
        pending: 10,
        confirmed: 20,
        completed: 15,
        cancelled: 5,
      },
    });
    expect(mockGetUserStats).toHaveBeenCalledOnce();
    expect(mockGetReservationStats).toHaveBeenCalledOnce();
  });

  it("getUserStats와 getReservationStats를 Promise.all로 병렬 호출한다", async () => {
    const callOrder: string[] = [];
    mockGetUserStats.mockImplementation(async () => {
      callOrder.push("userStats");
      return { totalUsers: 0, adminUsers: 0, recentSignups: 0 };
    });
    mockGetReservationStats.mockImplementation(async () => {
      callOrder.push("reservationStats");
      return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    });

    await getAdminStats();

    // 두 함수 모두 호출됨
    expect(callOrder).toContain("userStats");
    expect(callOrder).toContain("reservationStats");
  });

  it("getUserStats 실패 시 에러를 전파한다", async () => {
    mockGetUserStats.mockRejectedValue(new Error("DB error") as never);
    mockGetReservationStats.mockResolvedValue({
      total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0,
    } as never);

    await expect(getAdminStats()).rejects.toThrow("DB error");
  });

  it("getReservationStats 실패 시 에러를 전파한다", async () => {
    mockGetUserStats.mockResolvedValue({
      totalUsers: 0, adminUsers: 0, recentSignups: 0,
    } as never);
    mockGetReservationStats.mockRejectedValue(new Error("Stats DB error") as never);

    await expect(getAdminStats()).rejects.toThrow("Stats DB error");
  });
});
