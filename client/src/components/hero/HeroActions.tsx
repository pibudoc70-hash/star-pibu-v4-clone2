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
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* 팝업 카드 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl px-8 py-7 flex flex-col items-center gap-4 min-w-[300px]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "heroFadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <X size={16} />
        </button>

        {/* 전화 아이콘 */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "color-mix(in srgb, var(--color-gold-primary) 12%, white)" }}
        >
          <Phone size={24} style={{ color: "var(--color-gold-primary)" }} />
        </div>

        {/* 병원명 */}
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400">STAR DERMATOLOGY CLINIC</p>

        {/* 전화번호 */}
        <a
          href={`tel:${tel}`}
          className="text-3xl font-black tracking-tight hover:underline"
          style={{ color: "var(--color-gold-deep, #8B6914)" }}
        >
          {tel}
        </a>

        {/* 진료시간 안내 */}
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          {lang === "ko" ? (
            <>평일 10:00 – 19:00 &nbsp;|&nbsp; 토요일 10:00 – 16:00<br />일요일·공휴일 휴진</>
          ) : (
            <>Mon–Fri 10:00–19:00 &nbsp;|&nbsp; Sat 10:00–16:00<br />Closed on Sundays &amp; Holidays</>
          )}
        </p>

        {/* 복사 버튼 */}
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

  /** 모바일 여부 감지 (터치 디바이스) */
  const isMobile = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isMobile()) {
      e.preventDefault();
      setPhonePopupOpen(true);
    }
    // 모바일: href="tel:..." 그대로 동작
  };

  return (
    <>
    {phonePopupOpen && (
      <PhonePopup lang={lang} onClose={() => setPhonePopupOpen(false)} />
    )}
    <div className="flex flex-col items-center hero-actions-wrap">
      {/* Primary: 예약 버튼 — 가장 눈에 띄엄, 전체 너비 */}
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

      {/* Secondary + Tertiary: 같은 행, 좌우 동등 */}
      <div className="flex flex-row w-full hero-actions-row">
        {/* Secondary: 카카오/WeChat 버튼 */}
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

        {/* Tertiary: 전화 버튼 — PC: 팝업 / 모바일: 직접 전화 */}
        <a
          href={lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`}
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
