/**
 * MobileBottomCTA — 모바일 전용 하단 고정 CTA 바
 *
 * 네이버 예약 | 카카오 상담 | 전화 세 버튼을 얇은 바 형태로 화면 최하단에 고정.
 * - 데스크톱(641px+)에서는 완전히 숨김
 * - 높이: 52px (내용을 가리지 않을 정도로 얇게)
 * - 안전 영역(safe-area-inset-bottom) 대응
 */
import { Calendar, MessageCircle, Phone } from "lucide-react";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useLang } from "@/contexts/LangContext";
import { useState } from "react";
import { WECHAT_ID } from "@/lib/constants";

export default function MobileBottomCTA() {
  const { t, lang } = useLang();
  const {
    chatUrl: rawChatUrl,
    reserveUrl,
    chatBg,
    chatColor,
    isZH,
    phoneHref,
  } = useChatConfig();
  const chatUrl = isZH ? "#" : rawChatUrl;
  const [wechatCopied, setWechatCopied] = useState(false);

  const handleChatClick = (e: React.MouseEvent) => {
    if (!isZH) return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID)
      .then(() => {
        setWechatCopied(true);
        setTimeout(() => setWechatCopied(false), 2500);
      })
      .catch(() => {});
  };

  return (
    <div className="mobile-bottom-cta">
      {/* 네이버 예약 — Primary */}
      <a
        href={reserveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-bottom-btn mobile-bottom-btn--reserve"
        aria-label={t.hero.cta_reserve}
      >
        <Calendar size={14} strokeWidth={2.2} />
        <span>{t.hero.cta_reserve}</span>
      </a>

      {/* 카카오/위챗 — Secondary */}
      <div className="relative">
        <a
          href={chatUrl}
          target={isZH ? undefined : "_blank"}
          rel="noopener noreferrer"
          onClick={handleChatClick}
          className="mobile-bottom-btn"
          style={{ background: chatBg, color: chatColor }}
          aria-label={t.hero.cta_kakao}
        >
          <MessageCircle size={14} strokeWidth={2} />
          <span>{wechatCopied && isZH ? t.access.copiedLabel : t.hero.cta_kakao}</span>
        </a>
        {wechatCopied && isZH && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
            ID: {WECHAT_ID}
          </div>
        )}
      </div>

      {/* 전화 — Tertiary */}
      <a
        href={phoneHref}
        className="mobile-bottom-btn mobile-bottom-btn--phone"
        aria-label={t.hero.cta_call}
      >
        <Phone size={14} strokeWidth={1.8} />
        <span>{t.hero.cta_call}</span>
      </a>
    </div>
  );
}
