/**
 * 일반 고객에게 노출되는 외부 예약·상담 채널의 공통 원본이다.
 * 내부 예약/OTP 기능은 보존하며, 이 파일은 공개 CTA 목적지만 관리한다.
 */
import { KAKAO_URL, NAVER_BOOK_URL } from "@/lib/constants";

export const EXTERNAL_BOOKING_URLS = {
  naver: NAVER_BOOK_URL,
  kakao: KAKAO_URL,
} as const;

export function isSafeExternalBookingUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
