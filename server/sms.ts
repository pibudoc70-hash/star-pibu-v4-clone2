/**
 * SMS Service - Manus 내장 API를 사용한 SMS 발송
 */

export interface SMSOptions {
  phone: string;
  message: string;
}

/**
 * SMS 발송 (Manus 내장 API 사용)
 * @param options SMS 옵션
 * @returns 발송 성공 여부
 */
export async function sendSMS(options: SMSOptions): Promise<boolean> {
  try {
    const { phone, message } = options;

    // Manus 내장 SMS API 호출
    const response = await fetch(
      `${process.env.BUILT_IN_FORGE_API_URL}/sms/send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          message,
          // 선택사항
          senderId: "STARPIBU", // 발신자 ID (최대 11자)
          type: "SMS", // SMS 또는 LMS
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const { logger } = await import("./_core/logger");
      logger.error("SMS", `API Error: ${JSON.stringify(error)}`);
      return false;
    }

    const result = await response.json();
    const { logger } = await import("./_core/logger");
    // 전화번호는 로그에 노출하지 않음
    logger.info("SMS", `Sent successfully: messageId=${result.messageId} status=${result.status}`);

    return true;
  } catch (error) {
    const { logger } = await import("./_core/logger");
    logger.error("SMS", "Error sending SMS", error);
    return false;
  }
}

/**
 * OTP 인증번호 SMS 템플릿
 */
export function getOTPMessage(code: string, expiryMinutes: number = 10): string {
  return `[STAR 피부과] 인증번호는 ${code}입니다. ${expiryMinutes}분 이내에 입력해주세요.`;
}

/**
 * 예약 확인 SMS 템플릿
 */
export function getReservationConfirmationSMS(data: {
  patientName: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  reservationId: number;
}): string {
  return `[STAR 피부과] ${data.patientName}님의 예약이 접수되었습니다. 시술: ${data.treatmentName}, 일시: ${data.preferredDate} ${data.preferredTime} (예약번호: #${data.reservationId})`;
}

/**
 * 예약 확정 SMS 템플릿
 */
export function getReservationConfirmedSMS(data: {
  patientName: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  reservationId: number;
}): string {
  return `[STAR 피부과] ${data.patientName}님의 예약이 확정되었습니다. ${data.preferredDate} ${data.preferredTime}에 방문해주세요. (예약번호: #${data.reservationId})`;
}

/**
 * 예약 취소 SMS 템플릿
 */
export function getReservationCancelledSMS(data: {
  patientName: string;
  reservationId: number;
}): string {
  return `[STAR 피부과] ${data.patientName}님의 예약이 취소되었습니다. 문의: 051-818-2300 (예약번호: #${data.reservationId})`;
}
