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

  // 예약 버튼 색상 (LINE/네이버 모두 초록)
  const reserveBg = "#03C75A";

  return (
    <>
      {/* ── 모바일 하단 바 (항상 고정) ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{
          background: "#0a1228",
          boxShadow: "0 -6px 24px rgba(0,0,0,0.28), 0 -1px 0 rgba(201,168,76,0.22)",
          paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
        }}
      >
        <div className="flex items-stretch" style={{ minHeight: "56px" }}>
          {/* Primary: 예약 — 좌측, 골드 */}
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 font-bold"
            style={{
              background: "linear-gradient(160deg, #D4B87A 0%, #C9A84C 40%, #A8892A 100%)",
              color: "#1a1208",
              textShadow: "none",
              paddingTop: "10px",
              paddingBottom: "10px",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
              borderRight: "1px solid rgba(255,255,255,0.12)",
              minHeight: "56px",
            }}
            aria-label={fc.reserveAria}
          >
            <Calendar size={18} strokeWidth={2} />
            <span style={{ fontSize: "0.72rem", marginTop: "2px", letterSpacing: "0.03em", fontWeight: 700 }}>{fc.reserve}</span>
          </a>

          {/* Secondary: 메신저 (카카오/LINE/WeChat) — 중앙 */}
          <a
            href={chatUrl}
            target={isZH ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-semibold relative"
            style={{
              background: chatBg,
              color: chatColor,
              borderRight: "1px solid rgba(255,255,255,0.08)",
              paddingTop: "10px",
              paddingBottom: "10px",
              minHeight: "56px",
            }}
            aria-label={fc.kakaoAria}
          >
            <MessageCircle size={18} strokeWidth={1.8} />
            <span style={{ fontSize: "0.73rem", marginTop: "2px", letterSpacing: "0.01em" }}>
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
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium"
            style={{
              color: "rgba(255,255,255,0.72)",
              paddingTop: "10px",
              paddingBottom: "10px",
              minHeight: "56px",
            }}
            aria-label={fc.callAria}
          >
            <Phone size={17} strokeWidth={1.8} />
            <span style={{ fontSize: "0.73rem", marginTop: "2px", letterSpacing: "0.01em" }}>{fc.call}</span>
          </a>
        </div>
      </div>

      {/* ── 데스크톱 플로팅 버튼 (우측 하단, 세로 스택) ── */}
      {/* 순서: 위 = Tertiary(전화), 중간 = Secondary(메신저), 아래 = Primary(예약) */}
      <div
        className="fixed right-5 bottom-8 z-40 hidden md:flex flex-col gap-2.5 items-end transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(100px)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Tertiary: 전화 — 절제된 톤, 최상단 */}
        <a
          href={telHref}
          className="flex items-center gap-2 pr-4 pl-3 h-10 rounded-full transition-all hover:scale-105 group"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(201,168,76,0.30)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          aria-label={fc.callAria}
        >
          <Phone size={15} style={{ color: "rgba(245,215,142,0.85)", flexShrink: 0 }} />
          <span style={{ color: "rgba(245,215,142,0.85)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.04em" }}>{fc.call}</span>
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
            <span className="text-xs font-semibold tracking-wide" style={{ color: chatColor }}>
              {wechatCopied && isZH ? t.access.copiedLabel : fc.kakao}
            </span>
          </a>
          {wechatCopied && isZH && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              {t.access.copiedLabel}<br />
              <span className="font-bold">{WECHAT_ID}</span>
            </div>
          )}
        </div>

        {/* Primary: 예약 — 가장 눈에 띄엄, 최하단 */}
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 pr-5 pl-4 h-12 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          style={{
            background: reserveBg,
            boxShadow: "0 4px 18px rgba(3,199,90,0.40), 0 2px 8px rgba(0,0,0,0.12)",
          }}
          aria-label={fc.reserveAria}
        >
          <Calendar size={17} className="text-white flex-shrink-0" />
          <span className="text-white text-sm font-bold tracking-wide">{fc.reserve}</span>
        </a>
      </div>
    </>
  );
}
