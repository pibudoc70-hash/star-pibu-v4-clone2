/**
 * HeroActions — Hero CTA 버튼 그룹
 *
 * 모바일: 시안(hero-only.html) 기반 3버튼 그리드
 *   - 네이버 예약: #03c75a 배경, #0f1b17 텍스트, 네이버 N 아이콘
 *   - 카카오 상담: #fee500 배경, #3a2e00 텍스트, 카카오 말풍선 아이콘
 *   - 전화 문의: 골드 아웃라인, 전화 아이콘 + "전화 문의" + 전화번호 2줄
 *   - height 48px, borderRadius 4px, gap 6px, fontSize 11.5px
 *
 * 데스크톱: 기존 레이아웃 유지 (예약 전체너비 + 카카오/전화 2열)
 *
 * [R18-P0-2] 인라인 style → CSS 클래스 교체 (chatBg/chatColor/chatShadow/animationDelay 제외)
 */
import { MessageCircle, Calendar, Phone, X, Copy, Check } from "lucide-react";
import { useState } from "react";
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

/** 시안 기반 네이버 N 아이콘 */
function IcNaver({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true">
      <path fill={c} d="M4 4h4.2l3.6 6V4H16v12h-4.2L8.2 10v6H4V4z" />
    </svg>
  );
}

/** 시안 기반 카카오 말풍선 아이콘 */
function IcKakao({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" aria-hidden="true">
      <path fill={c} d="M10 3.4c-4.1 0-7.4 2.6-7.4 5.9 0 2.1 1.4 4 3.5 5l-0.8 3.1c-0.1 0.3 0.2 0.5 0.5 0.4l3.6-2.4c0.2 0 0.4 0 0.6 0 4.1 0 7.4-2.6 7.4-5.9S14.1 3.4 10 3.4z" />
    </svg>
  );
}

/** 시안 기반 전화 아이콘 */
function IcPhone({ c }: { c: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4.5 4.5C4.5 4.5 6 4 7 4c0.6 0 1 0.4 1.2 1L9 7c0.2 0.5 0 1-0.4 1.3L7.5 9c0.8 1.7 2.2 3 3.8 3.8l0.7-1.1c0.3-0.4 0.8-0.6 1.3-0.4L15.2 12c0.5 0.2 1 0.6 1 1.2 0 1-0.5 2.5-0.5 2.5s-1 1-2.5 1c-3 0-8.7-5.7-8.7-8.7 0-1.5 1-2.5 1-2.5z"
        stroke={c}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** PC에서 전화번호 안내 팝업 */
function PhonePopup({ lang, onClose }: { lang: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const tel = lang === "ko" ? CLINIC_TEL : CLINIC_TEL_INTL;

  const handleCopy = () => {
    navigator.clipboard.writeText(tel).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl px-8 py-7 flex flex-col items-center gap-4 min-w-[300px]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "heroFadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <X size={16} />
        </button>
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--color-gold-primary) 12%, white)" }}
        >
          <Phone size={24} style={{ color: "var(--color-gold-primary)" }} />
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">STAR DERMATOLOGY CLINIC</p>
        <a
          href={`tel:${tel}`}
          className="text-3xl font-black tracking-tight hover:underline"
          style={{ color: "var(--color-gold-deep, #8B6914)" }}
        >
          {tel}
        </a>
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          {lang === "ko" ? (
            <>평일 10:00 – 19:00 &nbsp;|&nbsp; 토요일 10:00 – 16:00<br />일요일·공휴일 휴진</>
          ) : (
            <>Mon–Fri 10:00–19:00 &nbsp;|&nbsp; Sat 10:00–16:00<br />Closed on Sundays &amp; Holidays</>
          )}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: copied ? "color-mix(in srgb, var(--color-gold-primary) 15%, white)" : "#f5f5f5",
            color: copied ? "var(--color-gold-deep)" : "#555",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? (lang === "ko" ? "복사됨" : "Copied!") : (lang === "ko" ? "번호 복사" : "Copy number")}
        </button>
      </div>
    </div>
  );
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
  const [phonePopupOpen, setPhonePopupOpen] = useState(false);

  const isMobile = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isMobile()) {
      e.preventDefault();
      setPhonePopupOpen(true);
    }
  };

  const tel = lang === "ko" ? CLINIC_TEL : CLINIC_TEL_INTL;

  return (
    <>
      {phonePopupOpen && (
        <PhonePopup lang={lang} onClose={() => setPhonePopupOpen(false)} />
      )}

      {/* ── 모바일 전용: 시안 기반 3버튼 그리드 ── */}
      <div className="md:hidden hero-mobile-cta-grid">
        {/* 네이버 예약 */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`hero-fade hero-mobile-btn hero-mobile-btn--naver ${isZH ? "hero-mobile-btn--wechat" : ""}`}
          style={{ animationDelay: delays.ctaFirst }}
        >
          {isZH ? (
            <MessageCircle size={13} strokeWidth={2} />
          ) : (
            <IcNaver c="#0f1b17" />
          )}
          {t.hero.cta_reserve}
        </a>

        {/* 카카오/WeChat 상담 */}
        <div className="relative hero-fade" style={{ animationDelay: delays.ctaSecond }}>
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={onWechatClick}
            className="hero-mobile-btn hero-mobile-btn--kakao"
            style={{
              background: chatBg,
              color: chatColor,
            }}
          >
            {isZH ? (
              <MessageCircle size={13} strokeWidth={2} />
            ) : (
              <IcKakao c="#3a2e00" />
            )}
            {wechatCopied && isZH ? t.access.copiedLabel : t.hero.cta_kakao}
          </a>
          {wechatCopied && isZH && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
              ID: {WECHAT_ID}
            </div>
          )}
        </div>

        {/* 전화 문의 */}
        <a
          href={`tel:${tel}`}
          onClick={handlePhoneClick}
          className="hero-fade hero-mobile-btn hero-mobile-btn--phone"
          style={{ animationDelay: delays.ctaPhone }}
        >
          <span className="hero-mobile-btn-phone-label">
            <IcPhone c="rgba(229,201,138,0.75)" />
            {t.hero.cta_call}
          </span>
          <span className="hero-mobile-btn-phone-number">{tel}</span>
        </a>
      </div>

      {/* ── 데스크톱 전용: 기존 레이아웃 ── */}
      <div className="hidden md:flex flex-col items-center hero-actions-wrap">
        {/* Primary: 예약 버튼 (전체 너비) */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`hero-fade hero-btn-action flex items-center gap-2 rounded-full font-normal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full ${isZH ? "hero-btn-reserve-zh" : "hero-btn-reserve"}`}
          style={{ animationDelay: delays.ctaFirst }}
        >
          <Calendar size={15} strokeWidth={2} />
          {t.hero.cta_reserve}
        </a>

        {/* Secondary + Tertiary 행 */}
        <div className="flex flex-row w-full hero-actions-row">
          <div
            className="relative hero-fade flex-1"
            style={{ animationDelay: delays.ctaSecond }}
          >
            <a
              href={chatUrl}
              target={isZH ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={onWechatClick}
              className="hero-btn-action flex items-center gap-1.5 rounded-full font-normal transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full"
              style={{
                background: chatBg,
                color: chatColor,
                boxShadow: chatShadow,
              }}
            >
              <MessageCircle size={14} strokeWidth={2} />
              {wechatCopied && isZH ? t.access.copiedLabel : t.hero.cta_kakao}
            </a>
            {wechatCopied && isZH && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                ID: {WECHAT_ID}
              </div>
            )}
          </div>
          <a
            href={`tel:${tel}`}
            onClick={handlePhoneClick}
            className="hero-fade hero-btn-phone flex items-center gap-1.5 rounded-full transition-all duration-300 justify-center flex-1"
            style={{ animationDelay: delays.ctaPhone }}
          >
            <Phone size={14} strokeWidth={2} />
            {t.hero.cta_call}
          </a>
        </div>
      </div>
    </>
  );
}
