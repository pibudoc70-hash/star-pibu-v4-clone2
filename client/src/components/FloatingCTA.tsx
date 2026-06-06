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

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLang();

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

  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };

  // 언어별 라벨
  const labels = {
    call:      lang === "ja" ? "電話"      : lang === "zh" ? "电话"      : lang === "en" ? "Call"    : "전화",
    kakao:     lang === "ja" ? "LINE"      : lang === "zh" ? "WeChat"    : lang === "en" ? "Kakao"   : "카카오",
    map:       lang === "ja" ? "LINE予約"  : lang === "zh" ? "LINE"      : lang === "en" ? "Book"    : "예약",
    callAria:  lang === "ja" ? "電話相談"  : lang === "zh" ? "电话咨询"  : lang === "en" ? "Call Us" : "전화 상담",
    kakaoAria: lang === "ja" ? "LINE相談"  : lang === "zh" ? "WeChat咨询": lang === "en" ? "KakaoTalk" : "카카오톡 상담",
    mapAria:   lang === "ja" ? "LINE予約"  : lang === "zh" ? "LINE咨询"  : lang === "en" ? "Naver Booking" : "네이버 예약",
  };

  // 예약 버튼 색상 (LINE/네이버 모두 초록)
  const reserveBg = "#03C75A";

  return (
    <>
      {/* ── 모바일 하단 바 ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          background: "white",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
        }}
      >
        <div className="flex">
          {/* 전화 */}
          <a
            href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
              color: "white",
              borderRight: "1px solid rgba(255,255,255,0.3)",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              minHeight: "52px",
            }}
          >
            <Phone size={18} />
            {labels.call}
          </a>

          {/* 메신저 (카카오/LINE/WeChat) */}
          <a
            href={chatUrl}
            target={lang === "zh" ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-xs font-semibold relative"
            style={{
              background: chatBg,
              color: chatColor,
              minHeight: "52px",
            }}
          >
            <MessageCircle size={18} />
            {wechatCopied ? (lang === "zh" ? "已复制!" : labels.kakao) : labels.kakao}
            {wechatCopied && lang === "zh" && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                ID: {WECHAT_ID}
              </span>
            )}
          </a>

          {/* 예약 (네이버/LINE) */}
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 text-xs font-semibold text-white"
            style={{
              background: reserveBg,
              minHeight: "52px",
            }}
          >
            <Calendar size={18} />
            {labels.map}
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
          href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
            boxShadow: "0 4px 16px rgba(201,168,76,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          }}
          aria-label={labels.callAria}
          title={lang === "ko" ? "051-818-2300" : "+82-51-818-2300"}
        >
          <Phone size={22} className="text-white" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
        </a>

        {/* 메신저 (카카오/LINE/WeChat) */}
        <div className="relative">
          <a
            href={chatUrl}
            target={lang === "zh" ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            style={{ background: chatBg }}
            aria-label={labels.kakaoAria}
            title={labels.kakaoAria}
          >
            <MessageCircle size={22} style={{ color: chatColor }} />
          </a>
          {wechatCopied && lang === "zh" && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              已复制 WeChat ID<br />
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
          aria-label={labels.mapAria}
          title={labels.mapAria}
        >
          <Calendar size={22} className="text-white" />
        </a>
      </div>
    </>
  );
}
