/**
 * HeroActions — Hero CTA 버튼 그룹
 *
 * 버튼 구성:
 * 1. 전화 버튼 (골드 테두리, 모바일 전체 너비)
 * 2. 예약 버튼 (네이버/WeChat 예약)
 * 3. 카카오/WeChat 버튼
 *
 * 모바일: 세로 스택 / 데스크톱: 가로 일렬
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
    <div
      className="flex flex-col sm:flex-row items-center justify-center w-full"
      style={{
        gap: "clamp(1rem, 1.5vw, 0.6rem)",
        marginTop: "42px",
        maxWidth: "591px",
        width: "100%",
      }}
    >
      {/* 전화 버튼 - 모바일에서 전체 너비 */}
      <a
        href={lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`}
        className="hero-fade flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full sm:w-auto"
        style={{
          background: "linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.1) 100%)",
          color: "#F5D78E",
          border: "1.5px solid rgba(201,168,76,0.55)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 12px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
          fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
          padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
          animationDelay: delays.ctaFirst,
          whiteSpace: "nowrap",
          maxWidth: "min(100%, 320px)",
          paddingRight: "19px",
        }}
      >
        <Phone size={14} />
        {t.hero.cta_call}
      </a>

      <div
        className="flex flex-row w-full sm:w-auto"
        style={{ gap: "clamp(0.4rem, 1.5vw, 0.6rem)" }}
      >
        {/* 예약 버튼 - 모바일에서 첫 번째 */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-fade flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center flex-1 sm:flex-none"
          style={{
            background: isZH ? "#06C755" : "#03C75A",
            color: "#FFFFFF",
            boxShadow: "0 4px 18px rgba(3,199,90,0.35)",
            fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
            padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
            animationDelay: delays.ctaSecond,
            whiteSpace: "nowrap",
            minWidth: "clamp(78px, 22vw, 130px)",
            paddingTop: "11px",
          }}
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
            className="flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full"
            style={{
              background: chatBg,
              color: chatColor,
              boxShadow: chatShadow,
              fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
              padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
              whiteSpace: "nowrap",
              minWidth: "clamp(78px, 22vw, 130px)",
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
