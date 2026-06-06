/**
 * useChatConfig — 채팅·예약 URL 및 버튼 스타일 중앙화 훅
 *
 * [PROD-P4-2] 동일한 URL 상수가 7개 이상 파일에 분산되어 있어 유지보수 위험 발생.
 * 이 훅으로 단일 진실 소스(Single Source of Truth)를 확립한다.
 *
 * 사용 예:
 *   const { chatUrl, reserveUrl, chatBg, chatColor, naverUrl, kakaoUrl } = useChatConfig();
 */
import { useLang } from "@/contexts/LangContext";

/** 언어별 채팅/예약 URL 상수 */
export const CHAT_URLS = {
  kakao: "https://pf.kakao.com/_HNyGC",
  kakaoOld: "http://pf.kakao.com/_xnxmKxj/chat",
  naver: "https://booking.naver.com/booking/13/bizes/209080",
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
 * 현재 언어에 맞는 채팅·예약 설정을 반환한다.
 *
 * @returns ChatConfig 객체
 */
export function useChatConfig(): ChatConfig {
  const { lang } = useLang();

  const isZH = lang === "zh";
  const isJA = lang === "ja";

  const chatUrl = isZH ? CHAT_URLS.wechat : isJA ? CHAT_URLS.lineJA : CHAT_URLS.kakao;
  const reserveUrl = isZH
    ? CHAT_URLS.lineZH
    : isJA
    ? CHAT_URLS.lineJA
    : CHAT_URLS.naver;

  const chatBg = isZH ? CHAT_STYLES.wechat.bg : isJA ? CHAT_STYLES.line.bg : CHAT_STYLES.kakao.bg;
  const chatColor = isZH ? CHAT_STYLES.wechat.color : isJA ? CHAT_STYLES.line.color : CHAT_STYLES.kakao.color;

  return {
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
