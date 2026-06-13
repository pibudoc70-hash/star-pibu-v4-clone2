/**
 * admin.service.test.ts — updateAdminReservationStatus 유스케이스 단위 테스트
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── 모킹 ─────────────────────────────────────────────────────────────────────
vi.mock("../db", () => ({
  getReservationById: vi.fn(),
  updateReservationStatus: vi.fn(),
}));

vi.mock("../_core/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { updateAdminReservationStatus } from "./admin.service";
import { getReservationById, updateReservationStatus } from "../db";
import { logger } from "../_core/logger";

const mockGetReservationById = vi.mocked(getReservationById);
const mockUpdateReservationStatus = vi.mocked(updateReservationStatus);
const mockLogger = vi.mocked(logger);

// ── 테스트 ────────────────────────────────────────────────────────────────────
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
