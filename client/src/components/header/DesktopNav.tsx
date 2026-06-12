/**
 * DesktopNav — 데스크탑 1차 메뉴 + More 드롭다운 + 예약 CTA
 * Header.tsx에서 분리 추출 (2026-06-12)
 */
import { MoreHorizontal } from "lucide-react";
import type { RefObject } from "react";
import type { NavItem } from "@/hooks/useHeaderState";

interface DesktopNavProps {
  primaryNav: NavItem[];
  secondaryNav: NavItem[];
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
  moreRef: RefObject<HTMLDivElement | null>;
  isActive: (href: string, sectionId: string | null) => boolean;
  handleNavClick: (href: string) => void;
  // CTA
  chatUrl: string;
  reserveUrl: string;
  chatBg: string;
  chatColor: string;
  wechatCopied: boolean;
  handleWechatClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  lang: string;
  WECHAT_ID: string;
  ctaKakao: string;
  ctaReserve: string;
  copiedLabel: string;
}

export default function DesktopNav({
  primaryNav,
  secondaryNav,
  moreOpen,
  setMoreOpen,
  moreRef,
  isActive,
  handleNavClick,
  chatUrl,
  reserveUrl,
  chatBg,
  chatColor,
  wechatCopied,
  handleWechatClick,
  lang,
  WECHAT_ID,
  ctaKakao,
  ctaReserve,
  copiedLabel,
}: DesktopNavProps) {
  return (
    <>
      {/* 1차 메뉴 */}
      <nav
        className="hidden md:flex items-center"
        style={{ gap: "0" }}
        role="navigation"
        aria-label="메인 네비게이션"
      >
        {primaryNav.map((item) => {
          const active = isActive(item.href, item.sectionId);
          return (
            <button
              type="button"
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="relative whitespace-nowrap transition-colors duration-200"
              style={{
                color: active ? "#111" : "#555",
                fontSize: "13.5px",
                fontWeight: active ? "600" : "400",
                letterSpacing: "0.005em",
                padding: "8px 18px",
                background: "transparent",
              }}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: active ? "18px" : "0px",
                  height: "2px",
                  background: "linear-gradient(90deg, #C9A84C, #F5D78E)",
                  borderRadius: "2px",
                  transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
                  display: "block",
                }}
              />
            </button>
          );
        })}

        {/* More 버튼 */}
        <div ref={moreRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex items-center gap-1 whitespace-nowrap transition-colors duration-200"
            style={{
              color: moreOpen ? "#111" : "#888",
              fontSize: "13px",
              padding: "8px 14px",
              background: "transparent",
              letterSpacing: "0.01em",
            }}
            aria-expanded={moreOpen}
            aria-haspopup="true"
            aria-label="더 보기 메뉴"
          >
            <MoreHorizontal size={16} />
          </button>

          {moreOpen && (
            <div
              role="menu"
              aria-label="추가 메뉴"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: "0",
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "14px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                minWidth: "160px",
                overflow: "hidden",
                zIndex: 200,
                animation: "fadeSlideDown 0.15s ease",
              }}
            >
              {secondaryNav.map((item) => {
                const active = isActive(item.href, item.sectionId);
                return (
                  <button
                    type="button"
                    key={item.label}
                    role="menuitem"
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left transition-colors hover:bg-gray-50"
                    style={{
                      display: "block",
                      padding: "11px 18px",
                      fontSize: "13.5px",
                      color: active ? "#C9A84C" : "#333",
                      fontWeight: active ? "600" : "400",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* 데스크탑 예약 CTA */}
      <div className="hidden lg:flex items-center flex-shrink-0" style={{ marginLeft: "12px", gap: "8px" }}>
        <div className="relative">
          <a
            href={chatUrl}
            target={lang === "zh" ? undefined : "_blank"}
            rel="noopener noreferrer"
            onClick={handleWechatClick}
            className="flex items-center font-semibold transition-all duration-200 whitespace-nowrap hover:opacity-90"
            style={{
              background: chatBg,
              color: chatColor,
              fontSize: "12.5px",
              padding: "7px 16px",
              borderRadius: "100px",
              letterSpacing: "0.01em",
            }}
          >
            {ctaKakao}
          </a>
          {wechatCopied && lang === "zh" && (
            <div
              className="absolute bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
              style={{ top: "calc(100% + 8px)", left: "0", zIndex: 50 }}
            >
              {copiedLabel}: <span className="font-bold">{WECHAT_ID}</span>
            </div>
          )}
        </div>
        <a
          href={reserveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center font-semibold text-white transition-all duration-200 whitespace-nowrap hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #03C75A 0%, #02a84a 100%)",
            fontSize: "12.5px",
            padding: "7px 18px",
            borderRadius: "100px",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 12px rgba(3,199,90,0.25)",
          }}
        >
          {ctaReserve}
        </a>
      </div>
    </>
  );
}
