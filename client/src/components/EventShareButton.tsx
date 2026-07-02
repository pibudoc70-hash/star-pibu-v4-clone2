/**
 * EventShareButton — 이벤트 공유 버튼 컴포넌트
 * 링크 복사 + 카카오톡 / LINE / X(트위터) / 페이스북 공유
 * 카드 클릭 이벤트와 충돌 방지: stopPropagation 처리
 */
import { useState, useRef, useEffect } from "react";
import { Link2, Check, Share2, X } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

interface EventShareButtonProps {
  eventId: number;
  eventTitle: string;
  /** 버튼 크기 변형 */
  size?: "sm" | "md";
}

export default function EventShareButton({ eventId, eventTitle, size = "md" }: EventShareButtonProps) {
  const { t } = useLang();
  const ev_t = t.events;
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const eventUrl = `${window.location.origin}/events/${eventId}`;
  const encodedUrl = encodeURIComponent(eventUrl);
  const encodedTitle = encodeURIComponent(eventTitle);

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function stopAndToggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setOpen((v) => !v);
  }

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: execCommand
      const el = document.createElement("textarea");
      el.value = eventUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleSocial(e: React.MouseEvent, url: string) {
    e.stopPropagation();
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    setOpen(false);
  }

  const shareLinks = [
    {
      key: "kakao",
      label: ev_t.shareKakao,
      // 카카오톡 공유: 카카오 공유 SDK 없이 카카오링크 URL 스킴 사용
      // 모바일에서는 앱이 열리고, 데스크탑에서는 카카오 웹 공유 페이지로 이동
      url: `https://sharer.kakao.com/talk/friends/picker/link?app_key=NONE&validation_action=default&validation_params=%7B%7D`,
      // 카카오 SDK 없이 단순 링크 복사 + 안내 방식으로 대체
      fallbackAction: "kakao",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.6 5.1 4 6.6l-1 3.6 4.2-2.8c.9.2 1.8.3 2.8.3 5.523 0 10-3.477 10-7.7S17.523 3 12 3z"/>
        </svg>
      ),
      color: "#FEE500",
      textColor: "#3C1E1E",
    },
    {
      key: "line",
      label: ev_t.shareLine,
      url: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
      ),
      color: "#06C755",
      textColor: "#fff",
    },
    {
      key: "twitter",
      label: ev_t.shareTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: "#000",
      textColor: "#fff",
    },
    {
      key: "facebook",
      label: ev_t.shareFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: "#1877F2",
      textColor: "#fff",
    },
  ];

  const iconSize = size === "sm" ? 14 : 16;
  const btnClass =
    size === "sm"
      ? "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-normal transition-all"
      : "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal transition-all";

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* 공유 토글 버튼 */}
      <button
        ref={btnRef}
        type="button"
        onClick={stopAndToggle}
        className={btnClass}
        style={{
          background: "var(--brand-bg-alt, #F5F0EB)",
          color: "var(--brand-text-mid, #666666)",
          border: "1px solid color-mix(in srgb, var(--color-gold-primary) 25%, transparent)",
        }}
        aria-label={ev_t.shareTitle}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Share2 size={iconSize} />
        <span>{ev_t.shareTitle}</span>
      </button>

      {/* 공유 패널 */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={ev_t.shareTitle}
          className="absolute z-50 bottom-full mb-2 left-0 min-w-[220px] rounded-xl shadow-xl border p-3"
          style={{
            background: "#fff",
            borderColor: "color-mix(in srgb, var(--color-gold-primary) 20%, transparent)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium" style={{ color: "var(--brand-text, #2C2C2C)" }}>
              {ev_t.shareTitle}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="p-0.5 rounded hover:bg-gray-100 transition-colors"
              aria-label="닫기"
            >
              <X size={14} style={{ color: "var(--brand-text-mid, #666666)" }} />
            </button>
          </div>

          {/* 링크 복사 */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all mb-1.5 hover:bg-gray-50"
            style={{ color: "var(--brand-text, #2C2C2C)" }}
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
              style={{ background: copied ? "var(--color-gold-primary)" : "var(--brand-bg-alt, #F5F0EB)" }}
            >
              {copied
                ? <Check size={15} color="#fff" />
                : <Link2 size={15} style={{ color: "var(--color-gold-primary)" }} />
              }
            </span>
            <span>{copied ? ev_t.shareCopied : ev_t.shareLink}</span>
          </button>

          {/* 소셜 미디어 버튼들 */}
          <div className="grid grid-cols-2 gap-1.5">
            {shareLinks.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={(e) => handleSocial(e, s.url)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: s.color, color: s.textColor }}
                aria-label={s.label}
              >
                {s.icon}
                <span className="text-xs font-normal truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
