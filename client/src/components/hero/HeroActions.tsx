/**
 * HeroActions — Hero CTA 버튼 그룹
 *
 * 버튼 구성:
 * 1. 전화 버튼 (골드 테두리, 모바일 전체 너비)
 * 2. 예약 버튼 (네이버/WeChat 예약)
 * 3. 카카오/WeChat 버튼
 *
 * 모바일: 세로 스택 / 데스크톱: 가로 일렬
 *
 * [R18-P0-2] 인라인 style → CSS 클래스 교체
 * - .hero-actions-wrap / .hero-actions-row: 컨테이너 gap/margin
 * - .hero-btn-phone: 전화 버튼 스타일
 * - .hero-btn-action: 예약/채팅 버튼 공통 사이즈
 * - .hero-btn-reserve / .hero-btn-reserve-zh: 예약 버튼 색상
 * - animationDelay (데이터 기반) + chatBg/chatColor (동적 prop): 인라인 style 유지
 */
import { MessageCircle, Calendar, Phone } from "lucide-react";
import { CLINIC_TEL, CLINIC_TEL_INTL, WECHAT_ID } from "@/lib/constants";

interface HeroActionsProps {
  lang: string;
  t: {
    hero: { cta_call: string; cta_reserve: string; cta_kakao: string };
    access: { copiedLabel: string };
  };
  chatUrl: string;
  reserveUrl: string;
  chatBg: string;
  chatColor: string;
  chatShadow: string;
  isZH: boolean;
  wechatCopied: boolean;
  onWechatClick: (e: React.MouseEvent) => void;
  delays: {
    ctaFirst: string;
    ctaSecond: string;
    ctaPhone: string;
  };
}

export function HeroActions({
  lang,
  t,
  chatUrl,
  reserveUrl,
  chatBg,
  chatColor,
  chatShadow,
  isZH,
  wechatCopied,
  onWechatClick,
  delays,
}: HeroActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center hero-actions-wrap">
      {/* 전화 버튼 - 모바일에서 전체 너비 */}
      <a
        href={lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`}
        className="hero-fade hero-btn-phone flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full sm:w-auto"
        style={{ animationDelay: delays.ctaFirst }}
      >
        <Phone size={14} />
        {t.hero.cta_call}
      </a>

      <div className="flex flex-row w-full sm:w-auto hero-actions-row">
        {/* 예약 버튼 - 모바일에서 첫 번째 */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`hero-fade hero-btn-action flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center flex-1 sm:flex-none ${isZH ? "hero-btn-reserve-zh" : "hero-btn-reserve"}`}
          style={{ animationDelay: delays.ctaSecond }}
        >
          <Calendar size={14} />
          {t.hero.cta_reserve}
        </a>

        {/* 카카오/WeChat 버튼 */}
        <div
          className="relative hero-fade flex-1 sm:flex-none"
          style={{ animationDelay: delays.ctaPhone }}
        >
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={onWechatClick}
            className="hero-btn-action flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full"
            style={{
              background: chatBg,
              color: chatColor,
              boxShadow: chatShadow,
            }}
          >
            <MessageCircle size={14} />
            {wechatCopied && isZH ? t.access.copiedLabel : t.hero.cta_kakao}
          </a>
          {wechatCopied && isZH && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
              ID: {WECHAT_ID}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
