/**
 * Email Service
 *
 * CURRENT STATUS: sendEmail() is a no-op stub.
 *   Manus does not provide a built-in outbound email API.
 *   notifyOwner() (server/_core/notification.ts) is the only
 *   built-in notification channel, but it targets the site owner only.
 *
 * TO ENABLE REAL EMAIL DELIVERY:
 *   1. Choose an external SMTP provider (e.g. SendGrid, AWS SES, Resend).
 *   2. Add the provider's API key via webdev_request_secrets
 *      (e.g. SENDGRID_API_KEY or SMTP_HOST / SMTP_USER / SMTP_PASS).
 *   3. Replace the stub body in sendEmail() with the provider's SDK call.
 *   4. Expose the new env var in server/_core/env.ts.
 *
 * Until then, customer-facing emails are silently skipped; only
 * notifyOwner() alerts reach the owner via the Manus notification channel.
 */


export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 이메일 발송 (no-op stub)
 *
 * NOTE: This function currently does nothing.
 *   See the file-level JSDoc above for integration steps.
 *   Replace the stub body once an external SMTP provider is configured.
 *
 * @param options 이메일 옵션
 * @returns 발송 성공 여부 (stub: 항상 true)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // logger는 _core/logger를 사용하지만, 순환 import 방지를 위해 dynamic import 사용
  const { logger } = await import("./_core/logger");
  try {
    // 이메일 주소는 로그에 노출하지 않음
    logger.info("Email", `[STUB] 이메일 발송 시도 (no-op): ${options.subject}`);
    // STUB: no-op until external SMTP provider is configured.
    // See file-level JSDoc for integration steps.
    return true;
  } catch (error) {
    logger.error("Email", "Error sending email", error);
    return false;
  }
}

/**
 * 예약 확인 이메일 템플릿
 */
export function getReservationConfirmationEmail(data: {
  patientName: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  phone: string;
  notes?: string;
  reservationId: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: linear-gradient(135deg, #4A6FA5 0%, #2d3e50 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: #f3f4f6; padding: 15px; border-left: 4px solid #4A6FA5; margin: 15px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #6b7280; }
          .value { color: #1f2937; }
          .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
          .button { display: inline-block; background: #4A6FA5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>스타피부과</h1>
            <p>예약 신청이 접수되었습니다</p>
          </div>
          
          <div class="content">
            <p>안녕하세요, ${data.patientName}님!</p>
            <p>스타피부과에 예약을 신청해주셔서 감사합니다.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">예약 정보</h3>
              <div class="info-row">
                <span class="label">예약 번호</span>
                <span class="value">#${data.reservationId}</span>
              </div>
              <div class="info-row">
                <span class="label">시술명</span>
                <span class="value">${data.treatmentName}</span>
              </div>
              <div class="info-row">
                <span class="label">희망 날짜</span>
                <span class="value">${data.preferredDate}</span>
              </div>
              <div class="info-row">
                <span class="label">희망 시간</span>
                <span class="value">${data.preferredTime}</span>
              </div>
              <div class="info-row">
                <span class="label">연락처</span>
                <span class="value">${data.phone}</span>
              </div>
              ${data.notes ? `
              <div class="info-row">
                <span class="label">추가 사항</span>
                <span class="value">${data.notes}</span>
              </div>
              ` : ''}
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              ✓ 예약이 접수되었으며, 곧 관리자가 확인 후 연락드리겠습니다.<br>
              ✓ 예약 변경이나 취소가 필요하신 경우 051-818-2300으로 연락주세요.
            </p>
            
            <a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://star-pibu.com'}/my-reservations" class="button">예약 상태 확인</a>
          </div>
          
          <div class="footer">
            <p>스타피부과 | 부산 서면 | 051-818-2300</p>
            <p>이 이메일은 자동으로 발송되었습니다.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 예약 상태 변경 이메일 템플릿
 */
export function getReservationStatusEmail(data: {
  patientName: string;
  treatmentName: string;
  status: string;
  statusLabel: string;
  preferredDate: string;
  preferredTime: string;
  adminNote?: string;
  reservationId: number;
}): string {
  const statusMessages: Record<string, string> = {
    confirmed: '예약이 확정되었습니다. 예약하신 날짜와 시간에 방문해주세요.',
    completed: '시술이 완료되었습니다. 이용해주셔서 감사합니다.',
    cancelled: '예약이 취소되었습니다. 문의사항은 051-818-2300으로 연락주세요.',
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: linear-gradient(135deg, #4A6FA5 0%, #2d3e50 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin: 15px 0; }
          .status-confirmed { background: #d1fae5; color: #065f46; }
          .status-completed { background: #f3f4f6; color: #6b7280; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .info-box { background: #f3f4f6; padding: 15px; border-left: 4px solid #4A6FA5; margin: 15px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #6b7280; }
          .value { color: #1f2937; }
          .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>스타피부과</h1>
            <p>예약 상태 변경 알림</p>
          </div>
          
          <div class="content">
            <p>안녕하세요, ${data.patientName}님!</p>
            
            <div class="status-badge status-${data.status}">
              ${data.statusLabel}
            </div>
            
            <p>${statusMessages[data.status] || '예약 상태가 변경되었습니다.'}</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">예약 정보</h3>
              <div class="info-row">
                <span class="label">예약 번호</span>
                <span class="value">#${data.reservationId}</span>
              </div>
              <div class="info-row">
                <span class="label">시술명</span>
                <span class="value">${data.treatmentName}</span>
              </div>
              <div class="info-row">
                <span class="label">희망 날짜</span>
                <span class="value">${data.preferredDate}</span>
              </div>
              <div class="info-row">
                <span class="label">희망 시간</span>
                <span class="value">${data.preferredTime}</span>
              </div>
            </div>
            
            ${data.adminNote ? `
            <div class="info-box">
              <h3 style="margin-top: 0;">관리자 메모</h3>
              <p>${data.adminNote}</p>
            </div>
            ` : ''}
            
            <p style="color: #6b7280; font-size: 14px;">
              문의사항이 있으신 경우 051-818-2300으로 연락주세요.
            </p>
          </div>
          
          <div class="footer">
            <p>스타피부과 | 부산 서면 | 051-818-2300</p>
            <p>이 이메일은 자동으로 발송되었습니다.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * 관리자 알림 이메일 템플릿
 */
export function getAdminNotificationEmail(data: {
  patientName: string;
  phone: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  reservationId: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
          .info-box { background: #f3f4f6; padding: 15px; margin: 15px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #6b7280; }
          .value { color: #1f2937; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 새로운 예약 신청</h1>
          </div>
          
          <div class="content">
            <div class="alert">
              <strong>⚠️ 새로운 예약이 접수되었습니다.</strong>
            </div>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">예약 정보</h3>
              <div class="info-row">
                <span class="label">예약 번호</span>
                <span class="value">#${data.reservationId}</span>
              </div>
              <div class="info-row">
                <span class="label">환자명</span>
                <span class="value">${data.patientName}</span>
              </div>
              <div class="info-row">
                <span class="label">연락처</span>
                <span class="value">${data.phone}</span>
              </div>
              <div class="info-row">
                <span class="label">시술명</span>
                <span class="value">${data.treatmentName}</span>
              </div>
              <div class="info-row">
                <span class="label">희망 날짜</span>
                <span class="value">${data.preferredDate}</span>
              </div>
              <div class="info-row">
                <span class="label">희망 시간</span>
                <span class="value">${data.preferredTime}</span>
              </div>
              ${data.notes ? `
              <div class="info-row">
                <span class="label">추가 사항</span>
                <span class="value">${data.notes}</span>
              </div>
              ` : ''}
            </div>
            
            <p>관리자 대시보드에서 예약을 확인하고 상태를 변경해주세요.</p>
            
            <a href="${process.env.VITE_OAUTH_PORTAL_URL || 'https://star-pibu.com'}/admin?tab=reservations" class="button">관리자 대시보드 이동</a>
          </div>
        </div>
      </body>
    </html>
  `;
}
