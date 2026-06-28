/**
 * FloatingCTA - 하단 고정 CTA
 * - 데스크톱: 우측 하단 플로팅 버튼 (전화 + 메신저 + 예약)
 * - 모바일: 하단 바 (전화·메신저·예약)
 * - 언어별 메신저: KO/EN=카카오톡, JA=LINE, ZH=WeChat(ID복사)
 * - 언어 전환은 헤더 드롭다운으로 이동됨
 */
import { useState, useEffect } from "react";
import { MessageCircle, Calendar, Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { CLINIC_TEL, CLINIC_TEL_INTL } from "@/lib/constants";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(true);
  const { lang, t } = useLang();

  useEffect(() => {
    // 모바일 바는 항상 표시, 데스크톱 플로팅 버튼만 스크롤 후 표시
    setVisible(true);
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [])

  // useChatConfig 후으로 URL/색상 중앙화 (CTA-P2-2: chatBg/chatColor 인라인 재계산 제거)
  const { reserveUrl, chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const WECHAT_ID = "star2006beauty";
  const telHref = isZH || isJA ? `tel:${CLINIC_TEL_INTL}` : `tel:${CLINIC_TEL}`;

  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    // [P2] .catch() 추가 — HTTPS 미적용 환경·권한 거부 시 unhandled rejection 방지
    navigator.clipboard.writeText(WECHAT_ID)
      .then(() => {
        setWechatCopied(true);
        setTimeout(() => setWechatCopied(false), 2500);
      })
      .catch(() => {
        // 클립보드 접근 불가 시 조용히 무시 (UI 상태 변경 없음)
      });
  };

  const fc = t.floatingCta;

  return (
    <>
      {/* ── 모바일 하단 바 (항상 고정) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden floating-mobile-bar">
        <div className="flex items-stretch floating-mobile-row">
          {/* Primary: 예약 — 좌측, 네이버 초록 */}
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 font-normal floating-btn-reserve"
            aria-label={fc.reserveAria}
          >
            <Calendar size={18} strokeWidth={2} />
            <span className="floating-btn-label">{fc.reserve}</span>
          </a>

          {/* Secondary: 메신저 (카카오/LINE/WeChat) — 중앙 */}
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-normal relative floating-btn-chat"
            style={{ background: chatBg, color: chatColor }}
            aria-label={fc.kakaoAria}
          >
            <MessageCircle size={18} strokeWidth={2} />
            <span className="floating-btn-label">
              {wechatCopied && isZH ? t.access.copiedLabel : fc.kakao}
            </span>
            {wechatCopied && isZH && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                ID: {WECHAT_ID}
              </span>
            )}
          </a>

          {/* Tertiary: 전화 — 우측 */}
          <a
            href={telHref}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-normal floating-btn-tel"
            aria-label={fc.callAria}
          >
            <Phone size={17} strokeWidth={2} />
            <span className="floating-btn-label">{fc.call}</span>
          </a>
        </div>
      </div>

      {/* ── 데스크톱 플로팅 버튼 (우측 하단, 세로 스택) ── */}
      {/* 순서: 위 = Tertiary(전화), 중간 = Secondary(메신저), 아래 = Primary(예약) */}
      <div
        className="fixed right-5 bottom-8 z-40 hidden md:flex flex-col gap-3 items-end transition-all duration-500 floating-desktop-stack"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(120px)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Tertiary: 전화 — 최소화, 절제된 톤 */}
        <a
          href={telHref}
          className="flex items-center gap-2 pr-4 pl-3 h-9 rounded-full transition-all duration-300 hover:scale-105 floating-desktop-tel"
          aria-label={fc.callAria}
        >
          <Phone size={14} className="floating-desktop-tel-icon flex-shrink-0" />
          <span className="floating-desktop-tel-label">{fc.call}</span>
        </a>

        {/* Secondary: 메신저 (카카오/LINE/WeChat) */}
        <div className="relative">
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex items-center gap-2.5 pr-4 pl-3 h-11 rounded-full shadow-md transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: chatBg }}
            aria-label={fc.kakaoAria}
          >
            <MessageCircle size={16} style={{ color: chatColor }} className="flex-shrink-0" />
            <span className="text-xs font-normal tracking-wide" style={{ color: chatColor }}>
              {wechatCopied && isZH ? t.access.copiedLabel : fc.kakao}
            </span>
          </a>
          {wechatCopied && isZH && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              {t.access.copiedLabel}<br />
              <span className="font-normal">{WECHAT_ID}</span>
            </div>
          )}
        </div>

        {/* Primary: 예약 — 가장 눈에 띄엄, 최하단 */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 pr-5 pl-4 h-12 rounded-full transition-all hover:scale-105 floating-desktop-reserve"
          aria-label={fc.reserveAria}
        >
          <Calendar size={17} className="text-white flex-shrink-0" />
          <span className="text-white text-sm font-normal tracking-wide">{fc.reserve}</span>
        </a>
      </div>
    </>
  );
}
