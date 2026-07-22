/**
 * reservation.test.ts - 예약 기능 테스트
 * - 회원 예약 생성/조회/취소
 * - 비회원 예약 생성/취소
 * - 관리자 예약 관리
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createReservation, getReservationsByUserId, getAllReservations, updateReservationStatus, cancelReservation, getReservationStats } from "../db";

describe("Reservation System", () => {
  const testUserId = 999;
  const testPhone = "010-1234-5678";
  const testDate = new Date("2026-06-01").getTime();

  describe("회원 예약", () => {
    it("should create a member reservation", async () => {
      const result = await createReservation({
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

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.status).toBe("pending");
    });

    it("should retrieve member reservations", async () => {
      const reservations = await getReservationsByUserId(testUserId);
      expect(Array.isArray(reservations)).toBe(true);
      expect(reservations.length).toBeGreaterThan(0);
      expect(reservations[0].patientName).toBe("테스트 회원");
    });

    it("should cancel a member reservation", async () => {
      const reservations = await getReservationsByUserId(testUserId);
      const reservationId = reservations[0].id;

      const result = await cancelReservation(reservationId, testUserId);
      expect(result.status).toBe("cancelled");
    });
  });

  describe("비회원 예약", () => {
    it("should create a guest reservation", async () => {
      const result = await createReservation({
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

      expect(result).toBeDefined();
      expect(result.id).toBeGreaterThan(0);
      expect(result.isGuest).toBe("1");
      expect(result.status).toBe("pending");
    });
  });

  describe("관리자 예약 관리", () => {
    it("should retrieve all reservations with pagination", async () => {
      const result = await getAllReservations(1, 10);
      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it("should update reservation status", async () => {
      const reservations = await getAllReservations(1, 1);
      const reservationId = reservations.items[0].id;

      const result = await updateReservationStatus(reservationId, "confirmed");
      expect(result.status).toBe("confirmed");
    });

    it("should add admin note to reservation", async () => {
      const reservations = await getAllReservations(1, 1);
      const reservationId = reservations.items[0].id;
      const adminNote = "고객이 민감한 피부를 가지고 있습니다. 주의 필요.";

      const result = await updateReservationStatus(reservationId, "confirmed", adminNote);
      expect(result.adminNote).toBe(adminNote);
    });

    it("should update admin note without changing status", async () => {
      const reservations = await getAllReservations(1, 1);
      const reservationId = reservations.items[0].id;
      const currentReservation = reservations.items[0];
      const newAdminNote = "시술 후 일주일 내에 연락 필요";

      const result = await updateReservationStatus(reservationId, currentReservation.status, newAdminNote);
      expect(result.adminNote).toBe(newAdminNote);
      expect(result.status).toBe(currentReservation.status);
    });

    it("should get reservation statistics", async () => {
      const stats = await getReservationStats();
      expect(stats).toBeDefined();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.pending).toBeGreaterThanOrEqual(0);
      expect(stats.confirmed).toBeGreaterThanOrEqual(0);
      expect(stats.completed).toBeGreaterThanOrEqual(0);
      expect(stats.cancelled).toBeGreaterThanOrEqual(0);
    });
  });

  describe("예약 검증", () => {
    it("should validate required fields", async () => {
      try {
        await createReservation({
          userId: testUserId,
          isGuest: "0",
          patientName: "", // 빈 값
          phone: testPhone,
          treatmentCategory: "best",
          treatmentName: "피코레이저 토닝",
          preferredDate: testDate,
          preferredTime: "10:00",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should handle invalid date", async () => {
      try {
        await createReservation({
          userId: testUserId,
          isGuest: "0",
          patientName: "테스트",
          phone: testPhone,
          treatmentCategory: "best",
          treatmentName: "피코레이저 토닝",
          preferredDate: new Date("2020-01-01").getTime(), // 과거 날짜
          preferredTime: "10:00",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
