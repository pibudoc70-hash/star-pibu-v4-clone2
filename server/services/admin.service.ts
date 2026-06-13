/**
 * admin.service.ts — 관리자 유스케이스 비즈니스 로직
 *
 * 책임:
 *  - 예약 상태 변경 유스케이스 (조회 → 상태변경 → 후처리 오케스트레이션)
 *  - YouTube 영상 생성 payload 정규화 (normalizeYouTubeCreatePayload)
 *
 * 의존 방향: service → db/*, _core/*
 * 라우터는 입력 파싱·권한 검사·TRPCError 변환만 담당하고 이 service를 호출한다.
 */
import { getReservationById, updateReservationStatus } from "../db";
import { logger } from "../_core/logger";

export interface UpdateAdminReservationStatusInput {
  id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  adminNote?: string;
  sendAlimtalk?: boolean;
}

/**
 * 관리자 예약 상태 변경 유스케이스.
 *
 * 흐름: 예약 조회 → 상태 변경 → 후처리(이메일 발송 지점 로깅)
 *
 * NOTE (PR-39): 예약 상태 변경 시 회원/비회원 이메일 발송은 아직 비활성화 상태.
 * 활성화 방법: server/email.ts의 TO ENABLE 절차 후 아래 주석 해제.
 */
export async function updateAdminReservationStatus(
  input: UpdateAdminReservationStatusInput,
): Promise<void> {
  const reservation = await getReservationById(input.id);

  await updateReservationStatus(input.id, input.status, input.adminNote);

  if (reservation) {
    try {
      if (reservation.isGuest === "1") {
        logger.info("Email", "비회원 예약 상태 변경 처리");
      } else {
        logger.info("Email", "회원 예약 상태 변경 처리");
        // NOTE (PR-39): 예약 상태 변경 시 회원에게 이메일 발송 지점
        // 활성화 방법: server/email.ts의 TO ENABLE 절차 후 아래 코드 주석 해제
        // const user = await getUserById(reservation.userId);
        // if (user?.email) {
        //   await sendEmail(getReservationStatusEmail({ ... }));
        // }
      }
    } catch (emailErr) {
      logger.error("Email", "상태 변경 이메일 발송 중 오류", emailErr);
    }
  }
}

// ─── YouTube 영상 생성 payload 정규화 ─────────────────────────────────────────
export interface YouTubeCreateInput {
  title: string;
  videoId: string;
  type: "video" | "shorts";
  sortOrder?: number;
}

export interface YouTubeCreatePayload {
  title: string;
  videoId: string;
  type: "video" | "shorts";
  sortOrder: number;
  isActive: "1";
}

/**
 * YouTube 영상 생성 payload 정규화.
 *
 * 기본값 정책:
 *  - sortOrder: 미지정 시 0
 *  - isActive: 항상 "1" (생성 시 즉시 활성화)
 */
export function normalizeYouTubeCreatePayload(input: YouTubeCreateInput): YouTubeCreatePayload {
  return {
    title: input.title,
    videoId: input.videoId,
    type: input.type,
    sortOrder: input.sortOrder ?? 0,
    isActive: "1",
  };
}
