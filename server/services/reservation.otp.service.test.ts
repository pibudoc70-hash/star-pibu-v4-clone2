/**
 * reservation.otp.service.test.ts — OTP 발송/검증 유스케이스 단위 테스트
 * DomainError 기반 에러 규약 검증 포함
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DomainError, DOMAIN_ERROR_CODES } from "../shared/errors";

vi.mock("../db", () => ({
  isOtpCooldown: vi.fn(),
  generateOtpCode: vi.fn(),
  createGuestOtp: vi.fn(),
  verifyGuestOtp: vi.fn(),
  cancelGuestReservation: vi.fn(),
  createReservation: vi.fn(),
  getUnavailableSlots: vi.fn(),
}));

vi.mock("../sms", () => ({
  sendSMS: vi.fn(),
  getOTPMessage: vi.fn().mockReturnValue("인증번호: 123456"),
}));

vi.mock("../_core/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("../_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

vi.mock("../email", () => ({
  sendEmail: vi.fn(),
  getReservationConfirmationEmail: vi.fn(),
  getAdminNotificationEmail: vi.fn(),
}));

vi.mock("../db/connection", () => ({
  getDb: vi.fn(),
}));

import {
  sendGuestReservationOtp,
  verifyGuestReservationOtp,
} from "./reservation.service";
import {
  isOtpCooldown,
  generateOtpCode,
  createGuestOtp,
  verifyGuestOtp,
} from "../db";
import { sendSMS } from "../sms";
import { logger } from "../_core/logger";

const mockIsOtpCooldown = vi.mocked(isOtpCooldown);
const mockGenerateOtpCode = vi.mocked(generateOtpCode);
const mockCreateGuestOtp = vi.mocked(createGuestOtp);
const mockVerifyGuestOtp = vi.mocked(verifyGuestOtp);
const mockSendSMS = vi.mocked(sendSMS);
const mockLogger = vi.mocked(logger);

describe("sendGuestReservationOtp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOtpCooldown.mockResolvedValue(false as never);
    mockGenerateOtpCode.mockReturnValue("123456");
    mockCreateGuestOtp.mockResolvedValue(undefined as never);
    mockSendSMS.mockResolvedValue(true as never);
  });

  it("정상 흐름: OTP 생성 후 SMS 발송하고 success 반환", async () => {
    const result = await sendGuestReservationOtp("01012345678");
    expect(mockGenerateOtpCode).toHaveBeenCalledOnce();
    expect(mockCreateGuestOtp).toHaveBeenCalledWith("01012345678", "123456");
    expect(mockSendSMS).toHaveBeenCalledOnce();
    expect(result).toEqual({ success: true, smsSent: true });
  });

  it("cooldown 중이면 DomainError(OTP_COOLDOWN)를 던진다", async () => {
    mockIsOtpCooldown.mockResolvedValue(true as never);
    const err = await sendGuestReservationOtp("01012345678").catch((e) => e);
    expect(err).toBeInstanceOf(DomainError);
    expect((err as DomainError).code).toBe(DOMAIN_ERROR_CODES.OTP_COOLDOWN);
    expect(mockSendSMS).not.toHaveBeenCalled();
  });

  it("SMS 발송 실패 시 smsSent=false를 반환하고 경고 로그를 남긴다", async () => {
    mockSendSMS.mockResolvedValue(false as never);
    const result = await sendGuestReservationOtp("01012345678");
    expect(result.smsSent).toBe(false);
    expect(mockLogger.warn).toHaveBeenCalledWith("OTP", "SMS 발송 실패");
  });
});

describe("verifyGuestReservationOtp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("정상 검증: verified=true 반환", async () => {
    mockVerifyGuestOtp.mockResolvedValue(true as never);
    const result = await verifyGuestReservationOtp("01012345678", "123456");
    expect(result).toEqual({ verified: true });
  });

  it("OTP 불일치 시 DomainError(OTP_INVALID)를 던진다", async () => {
    mockVerifyGuestOtp.mockResolvedValue(false as never);
    const err = await verifyGuestReservationOtp("01012345678", "000000").catch((e) => e);
    expect(err).toBeInstanceOf(DomainError);
    expect((err as DomainError).code).toBe(DOMAIN_ERROR_CODES.OTP_INVALID);
  });

  it("OTP 잠금 시 DomainError(OTP_LOCKED)를 던진다", async () => {
    const futureTs = Date.now() + 5 * 60 * 1000;
    mockVerifyGuestOtp.mockRejectedValue(new Error(`OTP_LOCKED:${futureTs}`) as never);
    const err = await verifyGuestReservationOtp("01012345678", "111111").catch((e) => e);
    expect(err).toBeInstanceOf(DomainError);
    expect((err as DomainError).code).toBe(DOMAIN_ERROR_CODES.OTP_LOCKED);
  });

  it("잠금 에러의 remainMin이 양수이고 meta에 포함된다", async () => {
    const futureTs = Date.now() + 3 * 60 * 1000;
    mockVerifyGuestOtp.mockRejectedValue(new Error(`OTP_LOCKED:${futureTs}`) as never);
    const err = await verifyGuestReservationOtp("01012345678", "111111").catch((e) => e);
    expect((err as DomainError).meta?.remainMin).toBeGreaterThan(0);
  });
});
