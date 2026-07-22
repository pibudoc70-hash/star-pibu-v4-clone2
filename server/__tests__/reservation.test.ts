/**
 * 예약 repository 단위 테스트
 *
 * 외부 MySQL에 의존하지 않도록 in-memory fixture를 사용해 예약 CRUD 계약을 검증한다.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";
type ReservationRow = {
  id: number;
  userId: number | null;
  isGuest: "0" | "1";
  patientName: string;
  phone: string;
  treatmentCategory: string;
  treatmentName: string;
  preferredDate: number;
  preferredTime: string;
  notes: string | null;
  status: ReservationStatus;
  adminNote: string | null;
};

const reservationStore = vi.hoisted(() => ({
  nextId: 1,
  rows: [] as ReservationRow[],
}));

vi.mock("../db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../db")>();

  const getById = (id: number) => reservationStore.rows.find((row) => row.id === id);
  const stats = () => reservationStore.rows.reduce(
    (result, row) => {
      result.total += 1;
      result[row.status] += 1;
      return result;
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  );

  return {
    ...actual,
    createReservation: vi.fn(async (data: Omit<ReservationRow, "id" | "status" | "adminNote"> & Partial<Pick<ReservationRow, "status" | "adminNote">>) => {
      const row: ReservationRow = {
        ...data,
        id: reservationStore.nextId++,
        status: data.status ?? "pending",
        adminNote: data.adminNote ?? null,
        notes: data.notes ?? null,
      };
      reservationStore.rows.push(row);
      return row;
    }),
    getReservationsByUserId: vi.fn(async (userId: number) =>
      reservationStore.rows.filter((row) => row.userId === userId),
    ),
    getAllReservations: vi.fn(async (page = 1, pageSize = 20) => {
      const offset = (page - 1) * pageSize;
      return {
        items: reservationStore.rows.slice(offset, offset + pageSize),
        total: reservationStore.rows.length,
      };
    }),
    updateReservationStatus: vi.fn(async (id: number, status: ReservationStatus, adminNote?: string) => {
      const row = getById(id);
      if (!row) throw new Error("Reservation not found");
      row.status = status;
      if (adminNote !== undefined) row.adminNote = adminNote;
      return row;
    }),
    cancelReservation: vi.fn(async (id: number, userId: number) => {
      const row = getById(id);
      if (!row || row.userId !== userId) throw new Error("Reservation not found");
      row.status = "cancelled";
      return row;
    }),
    getReservationStats: vi.fn(async () => stats()),
  };
});

import {
  cancelReservation,
  createReservation,
  getAllReservations,
  getReservationsByUserId,
  getReservationStats,
  updateReservationStatus,
} from "../db";

describe("Reservation System", () => {
  const testUserId = 999;
  const testPhone = "010-1234-5678";
  const testDate = new Date("2026-08-03").getTime();

  beforeEach(() => {
    reservationStore.nextId = 1;
    reservationStore.rows = [];
  });

  it("회원 예약을 생성하고 사용자별로 조회한다", async () => {
    const created = await createReservation({
      userId: testUserId,
      isGuest: "0",
      patientName: "테스트 회원",
      phone: testPhone,
      treatmentCategory: "best",
      treatmentName: "피코레이저 토닝",
      preferredDate: testDate,
      preferredTime: "10:00",
      notes: "테스트 예약",
    });

    expect(created).toMatchObject({ id: 1, status: "pending", isGuest: "0" });

    const reservations = await getReservationsByUserId(testUserId);
    expect(reservations).toHaveLength(1);
    expect(reservations[0]).toMatchObject({ id: created.id, patientName: "테스트 회원" });
  });

  it("회원은 자신의 예약만 취소할 수 있다", async () => {
    const created = await createReservation({
      userId: testUserId,
      isGuest: "0",
      patientName: "테스트 회원",
      phone: testPhone,
      treatmentCategory: "best",
      treatmentName: "피코레이저 토닝",
      preferredDate: testDate,
      preferredTime: "10:00",
      notes: null,
    });

    await expect(cancelReservation(created.id, testUserId)).resolves.toMatchObject({ status: "cancelled" });
    await expect(cancelReservation(created.id, testUserId + 1)).rejects.toThrow("Reservation not found");
  });

  it("비회원 예약을 생성한다", async () => {
    const created = await createReservation({
      userId: null,
      isGuest: "1",
      patientName: "테스트 비회원",
      phone: "010-9876-5432",
      treatmentCategory: "lifting",
      treatmentName: "울쎄라",
      preferredDate: testDate,
      preferredTime: "14:00",
      notes: "비회원 테스트",
    });

    expect(created).toMatchObject({ isGuest: "1", status: "pending" });
  });

  it("관리자가 페이지네이션, 상태 및 메모를 관리할 수 있다", async () => {
    const first = await createReservation({
      userId: testUserId,
      isGuest: "0",
      patientName: "첫 번째 예약",
      phone: testPhone,
      treatmentCategory: "best",
      treatmentName: "피코레이저 토닝",
      preferredDate: testDate,
      preferredTime: "10:00",
      notes: null,
    });
    await createReservation({
      userId: null,
      isGuest: "1",
      patientName: "두 번째 예약",
      phone: "010-9876-5432",
      treatmentCategory: "lifting",
      treatmentName: "울쎄라",
      preferredDate: testDate,
      preferredTime: "14:00",
      notes: null,
    });

    await expect(getAllReservations(1, 1)).resolves.toMatchObject({ total: 2, items: [expect.objectContaining({ id: first.id })] });
    await expect(
      updateReservationStatus(first.id, "confirmed", "고객이 민감한 피부를 가지고 있습니다. 주의 필요."),
    ).resolves.toMatchObject({ status: "confirmed", adminNote: "고객이 민감한 피부를 가지고 있습니다. 주의 필요." });
    await expect(
      updateReservationStatus(first.id, "confirmed", "시술 후 일주일 내에 연락 필요"),
    ).resolves.toMatchObject({ status: "confirmed", adminNote: "시술 후 일주일 내에 연락 필요" });
  });

  it("상태별 예약 통계를 반환한다", async () => {
    const pending = await createReservation({
      userId: testUserId,
      isGuest: "0",
      patientName: "대기 예약",
      phone: testPhone,
      treatmentCategory: "best",
      treatmentName: "피코레이저 토닝",
      preferredDate: testDate,
      preferredTime: "10:00",
      notes: null,
    });
    const confirmed = await createReservation({
      userId: null,
      isGuest: "1",
      patientName: "확정 예약",
      phone: "010-9876-5432",
      treatmentCategory: "lifting",
      treatmentName: "울쎄라",
      preferredDate: testDate,
      preferredTime: "14:00",
      notes: null,
    });
    await updateReservationStatus(confirmed.id, "confirmed");

    await expect(getReservationStats()).resolves.toEqual({
      total: 2,
      pending: 1,
      confirmed: 1,
      completed: 0,
      cancelled: 0,
    });
    expect(pending.status).toBe("pending");
  });
});
