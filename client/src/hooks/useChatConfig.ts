/**
 * useChatConfig — 채팅·예약 URL, 버튼 스타일, 전화번호 중앙화 훅
 *
 * [PROD-P4-2] 동일한 URL 상수가 7개 이상 파일에 분산되어 있어 유지보수 위험 발생.
 * 이 훅으로 단일 진실 소스(Single Source of Truth)를 확립한다.
 *
 * [R11-B] lang === "ko" 전화번호 분기 로직을 phoneHref/phoneDisplay/isKO 필드로 통합.
 *
 * 사용 예:
 *   const { chatUrl, reserveUrl, chatBg, chatColor, naverUrl, kakaoUrl, phoneHref, phoneDisplay } = useChatConfig();
 */
import { useLang } from "@/contexts/LangContext";
import { CLINIC_TEL, CLINIC_TEL_INTL } from "@/lib/constants";
import { EXTERNAL_BOOKING_URLS } from "@/lib/externalBooking";

/** 언어별 채팅/예약 URL 상수 */
export const CHAT_URLS = {
  kakao: EXTERNAL_BOOKING_URLS.kakao,
  kakaoOld: "http://pf.kakao.com/_xnxmKxj/chat",
  naver: EXTERNAL_BOOKING_URLS.naver,
  naverAlt: "https://booking.naver.com/booking/13/bizes/1122956",
  lineZH: "https://line.me/ti/p/~star2006derm",
  lineJA: "https://lin.ee/tyuRdUc",
  wechat: "https://u.wechat.com/star2006beauty",
} as const;

/** 채팅 버튼 스타일 */
export const CHAT_STYLES = {
  kakao: { bg: "#FEE500", color: "#1F2937" },
  wechat: { bg: "#07C160", color: "#FFFFFF" },
  line: { bg: "#06C755", color: "#FFFFFF" },
} as const;

export interface ChatConfig {
  /** 현재 언어에 맞는 전화 href (tel:051-818-2300 또는 국제번호) */
  phoneHref: string;
  /** 전화번호 표시 문자열 (한국어: 051-818-2300, 기타: +82-51-818-2300) */
  phoneDisplay: string;
  /** 현재 언어가 한국어인지 여부 */
  isKO: boolean;
  /** 현재 언어의 채팅 URL (카카오/위챗) */
  chatUrl: string;
  /** 현재 언어의 예약 URL (네이버/라인) */
  reserveUrl: string;
  /** 채팅 버튼 배경색 */
  chatBg: string;
  /** 채팅 버튼 텍스트 색 */
  chatColor: string;
  /** 카카오 URL (고정) */
  kakaoUrl: string;
  /** 네이버 예약 URL (고정) */
  naverUrl: string;
  /** 위챗 URL (고정) */
  wechatUrl: string;
  /** 현재 언어가 중국어인지 여부 */
  isZH: boolean;
  /** 현재 언어가 일본어인지 여부 */
  isJA: boolean;
}

/**
 * 현재 언어에 맞는 채팅·예약·전화 설정을 반환한다.
 *
 * @returns ChatConfig 객체
 */
export function useChatConfig(): ChatConfig {
  const { lang } = useLang();

  const isKO = lang === "ko";
  const isZH = lang === "zh" || lang === "zh-TW";
  const isJA = lang === "ja";

  // 전화번호: 한국어는 국내 번호, 그 외는 국제 번호
  const phoneHref = isKO ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`;
  const phoneDisplay = isKO ? CLINIC_TEL : CLINIC_TEL_INTL;

  const chatUrl = isZH ? CHAT_URLS.wechat : isJA ? "https://otomo-busan.com/star" : CHAT_URLS.kakao;
  // 일반 고객 예약은 언어와 관계없이 네이버 외부 예약으로만 연결한다.
  // 기존 LINE·OTOMO·WeChat 상담 채널과 내부 예약/OTP 기능은 보존한다.
  const reserveUrl = EXTERNAL_BOOKING_URLS.naver;

  const chatBg = isZH ? CHAT_STYLES.wechat.bg : isJA ? "#4A6FA5" : CHAT_STYLES.kakao.bg;
  const chatColor = isZH ? CHAT_STYLES.wechat.color : isJA ? "#FFFFFF" : CHAT_STYLES.kakao.color;

  return {
    phoneHref,
    phoneDisplay,
    isKO,
    chatUrl,
    reserveUrl,
    chatBg,
    chatColor,
    kakaoUrl: CHAT_URLS.kakao,
    naverUrl: CHAT_URLS.naver,
    wechatUrl: CHAT_URLS.wechat,
    isZH,
    isJA,
  };
}
