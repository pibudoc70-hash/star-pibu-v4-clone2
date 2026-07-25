/**
 * reservation.service.ts — 예약 비즈니스 로직
 *
 * 책임:
 *  - 예약 가능 여부 검증 (날짜·요일·전화번호 형식)
 *  - OTP 발송 유스케이스 (sendGuestReservationOtp)
 *  - OTP 검증 및 lock 해석 유스케이스 (verifyGuestReservationOtp)
 *  - OTP 인증 완료 여부 확인 (verifyOtpForReservation + verified 행 재확인)
 *  - 예약 생성 후 이메일·알림 발송 오케스트레이션
 *
 * 의존 방향: service → db/*, _core/*, email, sms
 * 라우터는 입력 파싱·권한 검사·TRPCError 변환만 담당하고 이 service를 호출한다.
 */
import { eq, and } from "drizzle-orm";
import { guestOtps } from "../../drizzle/schema";
import {
  createReservation,
  verifyGuestOtp,
  cancelGuestReservation,
  getUnavailableSlots,
  generateOtpCode,
  createGuestOtp,
  isOtpCooldown,
} from "../db";
import { DomainError, DOMAIN_ERROR_CODES } from "../shared/errors";
import { notifyOwner } from "../_core/notification";
import { sendEmail, getReservationConfirmationEmail, getAdminNotificationEmail } from "../email";
import { sendSMS, getOTPMessage } from "../sms";
import { logger } from "../_core/logger";
import { getDb } from "../db/connection";

// ─── 상수 ────────────────────────────────────────────────────────────────────
const PHONE_REGEX = /^01[0-9]-\d{3,4}-\d{4}$|^01[0-9]\d{7,8}$/;
/** OTP 인증 완료 후 예약 생성까지 허용하는 유예 시간 (10분) */
const OTP_GRACE_MS = 10 * 60 * 1000;

// ─── 날짜 검증 ────────────────────────────────────────────────────────────────
export function validateReservationDate(preferredDate: number): void {
  const preferredDateObj = new Date(preferredDate);
  const koNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const koToday = new Date(koNow.getFullYear(), koNow.getMonth(), koNow.getDate());
  const koTomorrow = new Date(koToday);
  koTomorrow.setDate(koTomorrow.getDate() + 1);
  const dateOnly = new Date(
    preferredDateObj.getFullYear(),
    preferredDateObj.getMonth(),
    preferredDateObj.getDate(),
  );
  if (dateOnly < koTomorrow) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.RESERVATION_DATE_INVALID,
      "당일 예약은 불가합니다. 내일 이후 날짜를 선택해주세요.",
    );
  }
  if (preferredDateObj.getDay() === 0) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.RESERVATION_DATE_INVALID,
      "일요일은 예약이 불가합니다.",
    );
  }
}

export function validatePhone(phone: string): void {
  if (!PHONE_REGEX.test(phone)) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.VALIDATION,
      "올바른 휴대폰 번호 형식이 아닙니다. (010-1234-5678 또는 01012345678 형식)",
    );
  }
}

export async function validateDateNotUnavailable(preferredDate: number): Promise<void> {
  const d = new Date(preferredDate);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const unavailableSlots = await getUnavailableSlots(undefined);
  if (unavailableSlots.some((s: { date: string }) => s.date === dateStr)) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.RESERVATION_DATE_UNAVAILABLE,
      "해당 날짜는 예약이 불가합니다. 다른 날짜를 선택해주세요.",
    );
  }
}

// ─── OTP 발송 유스케이스 ──────────────────────────────────────────────────────
export interface SendGuestReservationOtpResult {
  success: true;
  smsSent: boolean;
}

/**
 * 비회원 예약 OTP 발송 유스케이스.
 *
 * 흐름: cooldown 체크 → OTP 코드 생성 → DB 저장 → SMS 발송 → 실패 로깅
 *
 * cooldown 위반 시 Error("OTP_COOLDOWN") 던짐 → 라우터가 TRPCError로 변환.
 */
export async function sendGuestReservationOtp(
  phone: string,
): Promise<SendGuestReservationOtpResult> {
  const onCooldown = await isOtpCooldown(phone);
  if (onCooldown) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.OTP_COOLDOWN,
      "인증번호는 60초 후에 다시 요청할 수 있습니다.",
    );
  }

  const code = generateOtpCode();
  await createGuestOtp(phone, code);

  const message = getOTPMessage(code, 10);
  const smsSent = await sendSMS({ phone, message });
  if (!smsSent) logger.warn("OTP", "SMS 발송 실패");

  return { success: true, smsSent };
}

// ─── OTP 검증 유스케이스 ──────────────────────────────────────────────────────
export interface VerifyGuestReservationOtpResult {
  verified: true;
}

/**
 * 비회원 예약 OTP 검증 유스케이스.
 *
 * 흐름: OTP 검증 → lock 상태 해석 → 잠금 시 남은 시간 계산
 *
 * 에러 종류:
 *  - Error("OTP_INVALID") — 코드 불일치 또는 만료
 *  - Error("OTP_LOCKED:<remainMin>") — 시도 횟수 초과, 잠금 시간(분) 포함
 */
export async function verifyGuestReservationOtp(
  phone: string,
  code: string,
): Promise<VerifyGuestReservationOtpResult> {
  try {
    const ok = await verifyGuestOtp(phone, code);
    if (!ok) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.OTP_INVALID,
        "인증번호가 올바르지 않거나 만료되었습니다.",
      );
    }
    return { verified: true };
  } catch (err) {
    // repository가 던지는 문자열 기반 OTP_LOCKED 에러를 DomainError로 변환
    if (err instanceof Error && err.message.startsWith("OTP_LOCKED:")) {
      const lockedUntil = parseInt(err.message.split(":")[1], 10);
      const remainMin = Math.ceil((lockedUntil - Date.now()) / 60000);
      throw new DomainError(
        DOMAIN_ERROR_CODES.OTP_LOCKED,
        `인증 시도 횟수를 초과했습니다. ${remainMin}분 후 다시 시도해주세요.`,
        { remainMin },
      );
    }
    // DomainError는 그대로 전파
    throw err;
  }
}

// ─── OTP 검증 (예약 생성 시점) ────────────────────────────────────────────────
/**
 * 예약 생성 시점의 OTP 검증.
 * verifyGuestOtp()가 false를 반환하면 verified=1 행을 재확인한다.
 * (이미 verified된 OTP로 예약하는 경우 허용)
 */
export async function verifyOtpForReservation(phone: string, otpCode: string): Promise<void> {
  const ok = await verifyGuestOtp(phone, otpCode);
  if (!ok) {
    const db = await getDb();
      const rows = await db
      .select()
      .from(guestOtps)
      .where(
        and(
          eq(guestOtps.phone, phone),
          eq(guestOtps.code, otpCode),
          eq(guestOtps.verified, "1"),
        ),
      )
      .limit(1);
    if (rows.length === 0 || rows[0].expiresAt < Date.now() - OTP_GRACE_MS) {
      throw new DomainError(
        DOMAIN_ERROR_CODES.OTP_EXPIRED,
        "인증이 만료되었습니다. 다시 인증해주세요.",
      );
    }
  }
}

// ─── 예약 생성 + 알림 오케스트레이션 ─────────────────────────────────────────
interface CreateMemberReservationInput {
  userId: number;
  userEmail: string | null | undefined;
  patientName: string;
  phone: string;
  treatmentCategory: string;
  treatmentName: string;
  preferredDate: number;
  preferredTime: string;
  notes?: string | null;
}

export async function createMemberReservation(input: CreateMemberReservationInput) {
  const reservation = await createReservation({
    userId: input.userId,
    patientName: input.patientName,
    phone: input.phone,
    treatmentCategory: input.treatmentCategory,
    treatmentName: input.treatmentName,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    notes: input.notes ?? null,
    status: "pending",
  });
  if (!reservation) throw new Error("Failed to create reservation");

  const reservationId = reservation.id;
  const preferredDateStr = new Date(input.preferredDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  // 고객 이메일
  if (input.userEmail) {
    try {
      await sendEmail({
        to: input.userEmail,
        subject: `[STAR 피부과] 예약 접수 알림 - #${reservationId}`,
        html: getReservationConfirmationEmail({
          patientName: input.patientName,
          treatmentName: input.treatmentName,
          preferredDate: preferredDateStr,
          preferredTime: input.preferredTime,
          phone: input.phone,
          notes: input.notes ?? undefined,
          reservationId,
        }),
      });
    } catch (emailErr) {
      logger.error("Email", "예약 확인 이메일 발송 중 오류", emailErr);
    }
  } else {
    logger.warn("Email", "User email not available, skipping customer email");
  }

  // 오너 알림
  await notifyOwner({
    title: "새 예약 신청",
    content: `${input.patientName}님이 [${input.treatmentName}] 예약을 신청했습니다.\n희망일시: ${preferredDateStr} ${input.preferredTime}\n연락처: ${input.phone}`,
  });

  // 관리자 이메일
  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@star-pibu.com",
      subject: `[관리자] 새로운 예약 신청 - #${reservationId}`,
      html: getAdminNotificationEmail({
        patientName: input.patientName,
        phone: input.phone,
        treatmentName: input.treatmentName,
        preferredDate: preferredDateStr,
        preferredTime: input.preferredTime,
        notes: input.notes ?? undefined,
        reservationId,
      }),
    });
  } catch (emailErr) {
    logger.error("Email", "관리자 알림 이메일 발송 중 오류", emailErr);
  }

  return { success: true };
}

interface CreateGuestReservationInput {
  patientName: string;
  phone: string;
  otpCode: string;
  treatmentCategory: string;
  treatmentName: string;
  preferredDate: number;
  preferredTime: string;
  notes?: string | null;
}

export async function createGuestReservation(input: CreateGuestReservationInput) {
  validatePhone(input.phone);
  validateReservationDate(input.preferredDate);
  await validateDateNotUnavailable(input.preferredDate);
  await verifyOtpForReservation(input.phone, input.otpCode);

  await createReservation({
    userId: null,
    isGuest: "1",
    patientName: input.patientName,
    phone: input.phone,
    treatmentCategory: input.treatmentCategory,
    treatmentName: input.treatmentName,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    notes: input.notes ?? null,
    status: "pending",
  });

  await notifyOwner({
    title: "새 예약 신청 (비회원)",
    content: `${input.patientName}님(비회원)이 [${input.treatmentName}] 예약을 신청했습니다.\n희망일시: ${new Date(input.preferredDate).toLocaleDateString("ko-KR")} ${input.preferredTime}\n연락처: ${input.phone}`,
  });

  return { success: true };
}

export async function cancelGuestReservationWithOtp(
  id: number,
  phone: string,
  otpCode: string,
) {
  const ok = await verifyGuestOtp(phone, otpCode);
  if (!ok) throw new DomainError(
    DOMAIN_ERROR_CODES.OTP_INVALID,
    "인증번호가 올바르지 않거나 만료되었습니다.",
  );
  const affected = await cancelGuestReservation(id, phone);
  if (affected === 0) {
    throw new DomainError(
      DOMAIN_ERROR_CODES.RESERVATION_NOT_FOUND,
      "해당 예약을 찾을 수 없거나 이미 취소된 예약입니다.",
    );
  }
}
