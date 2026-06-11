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
  const [visible, setVisible] = useState(false);
  const { lang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // 예약 버튼 색상 (LINE/네이버 모두 초록)
  const reserveBg = "#03C75A";

  return (
    <>
      {/* ── 모바일 하단 바 (Primary/Secondary/Tertiary 위계) ── */}
      {/* [M2] 예약(Primary) > 카카오(Secondary) > 전화(Tertiary) 위계 재정립 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          background: "#0a1228",
          boxShadow: "0 -2px 24px rgba(0,0,0,0.22), 0 -1px 0 rgba(201,168,76,0.18)",
          paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
        }}
      >
        <div className="flex items-stretch" style={{ minHeight: "58px" }}>
          {/* Tertiary: 전화 — 좌측, 좁게, 아이콘 중심 */}
          <a
            href={telHref}
            className="flex flex-col items-center justify-center gap-0.5 text-xs font-medium"
            style={{
              width: "64px",
              flexShrink: 0,
              color: "rgba(255,255,255,0.7)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
            aria-label={fc.callAria}
          >
            <Phone size={17} strokeWidth={1.8} />
            <span style={{ fontSize: "0.65rem", marginTop: "2px", letterSpacing: "0.01em" }}>{fc.call}</span>
          </a>

          {/* Secondary: 메신저 (카카오/LINE/WeChat) — 중앙, 중간 너비 */}
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex flex-col items-center justify-center gap-0.5 text-xs font-semibold relative"
            style={{
              flex: "1",
              background: chatBg,
              color: chatColor,
              borderRight: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
            aria-label={fc.kakaoAria}
          >
            <MessageCircle size={18} strokeWidth={1.8} />
            <span style={{ fontSize: "0.72rem", marginTop: "2px", letterSpacing: "0.01em" }}>
              {wechatCopied && isZH ? t.access.copiedLabel : fc.kakao}
            </span>
            {wechatCopied && isZH && (
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                ID: {WECHAT_ID}
              </span>
            )}
          </a>

          {/* Primary: 예약 — 우측, 가장 넓게, 골드 강조 */}
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 font-bold"
            style={{
              flex: "1.4",
              background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
              color: "white",
              textShadow: "0 1px 3px rgba(0,0,0,0.25)",
              paddingTop: "10px",
              paddingBottom: "10px",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
            aria-label={fc.reserveAria}
          >
            <Calendar size={18} strokeWidth={2} />
            <span style={{ fontSize: "0.75rem", marginTop: "2px", letterSpacing: "0.02em" }}>{fc.reserve}</span>
          </a>
        </div>
      </div>

      {/* ── 데스크톱 플로팅 버튼 (우측 하단, 세로 스택) ── */}
      <div
        className="fixed right-4 bottom-8 z-40 hidden md:flex flex-col gap-3 transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(80px)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* 전화 - 금색 그라디언트 */}
        <a
          href={telHref}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
            boxShadow: "0 4px 16px rgba(201,168,76,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          }}
          aria-label={fc.callAria}
          title={fc.callAria}
        >
          <Phone size={22} className="text-white" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
        </a>

        {/* 메신저 (카카오/LINE/WeChat) */}
        <div className="relative">
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            style={{ background: chatBg }}
            aria-label={fc.kakaoAria}
            title={fc.kakaoAria}
          >
            <MessageCircle size={22} style={{ color: chatColor }} />
          </a>
          {wechatCopied && isZH && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              {t.access.copiedLabel}<br />
              <span className="font-bold">{WECHAT_ID}</span>
            </div>
          )}
        </div>

        {/* 예약 (네이버/LINE) */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          style={{ background: reserveBg }}
          aria-label={fc.reserveAria}
          title={fc.reserveAria}
        >
          <Calendar size={22} className="text-white" />
        </a>
      </div>
    </>
  );
}
