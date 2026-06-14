/**
 * MobileMenu — 모바일 전체 화면 오버레이 메뉴
 * Header.tsx에서 분리 추출 (2026-06-12)
 *
 * 개선 사항:
 * - 1차/2차 메뉴 시각적 구분 (구분선 + 섹션 레이블)
 * - 메뉴 항목 아이콘 추가 (각 nav item에 Lucide 아이콘)
 * - 언어 선택 그리드 개선 (카드 스타일 강화)
 * - CTA 버튼 스타일 강화 (그라디언트, 아이콘)
 */
import { X, ChevronRight, Stethoscope, Users, Calendar, Building2, MapPin, Globe2, BookOpen, FlaskConical } from "lucide-react";
import type { RefObject } from "react";
import type { NavItem, LangOption } from "@/hooks/useHeaderState";
import type { Lang } from "@/lib/i18n";

interface MobileMenuProps {
  mobileOpen: boolean;
  menuVisible: boolean;
  menuClosing: boolean;
  primaryNav: NavItem[];
  secondaryNav: NavItem[];
  langOptions: LangOption[];
  lang: string;
  closeMobileMenu: (onAfterClose?: () => void) => void;
  handleNavClick: (href: string) => void;
  isActive: (href: string, sectionId: string | null) => boolean;
  buildLocalizedPath: (lang: Lang) => string;
  chatUrl: string;
  reserveUrl: string;
  chatBg: string;
  chatColor: string;
  wechatCopied: boolean;
  handleWechatClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  WECHAT_ID: string;
  t: {
    hero: { cta_kakao: string; cta_reserve: string };
    access: { copiedLabel: string };
    nav?: Record<string, string>;
  };
  mobileMenuRef: RefObject<HTMLDivElement | null>;
}

// 메뉴 항목별 아이콘 매핑 (href 기준)
const NAV_ICONS: Record<string, React.ElementType> = {
  "#treatments": Stethoscope,
  "#doctors":    Users,
  "#events":     Calendar,
  "/about":      Building2,
  "#contact":    MapPin,
  "#facility":   Building2,
  "/foreign-guide": Globe2,
  "/research":   BookOpen,
  "/equipment3": FlaskConical,
  "/equipment2": FlaskConical,
};

export default function MobileMenu({
  mobileOpen,
  menuVisible,
  menuClosing,
  primaryNav,
  secondaryNav,
  langOptions,
  lang,
  closeMobileMenu,
  handleNavClick,
  isActive,
  buildLocalizedPath,
  chatUrl,
  reserveUrl,
  chatBg,
  chatColor,
  wechatCopied,
  handleWechatClick,
  WECHAT_ID,
  t,
  mobileMenuRef,
}: MobileMenuProps) {
  if (!mobileOpen) return null;

  return (
    <>
      {/* 딤 배경 */}
      <div
        onClick={() => closeMobileMenu()}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 998,
          opacity: menuVisible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
        aria-hidden="true"
      />

      {/* 메뉴 패널 */}
      <div
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(88vw, 360px)",
          height: "100dvh",
          background: "#FAF8F5",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          transform: menuVisible && !menuClosing ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        {/* ── 헤더 ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--brand-gold, #C4A882)", letterSpacing: "0.08em", fontFamily: "'Playfair Display', Georgia, serif" }}>
            STAR DERMATOLOGY
          </span>
          <button
            type="button"
            onClick={() => closeMobileMenu()}
            className="flex items-center justify-center"
            style={{ width: "36px", height: "36px", borderRadius: "10px", color: "#555" }}
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── 1차 메뉴 ── */}
        <nav
          style={{
            padding: "12px 0 8px",
            opacity: menuVisible ? 1 : 0,
            transition: "opacity 0.3s ease 100ms",
          }}
          aria-label="모바일 메인 네비게이션"
        >
          {/* 섹션 레이블 */}
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "#bbb",
              textTransform: "uppercase",
              padding: "0 24px",
              marginBottom: "4px",
            }}
          >
            MENU
          </p>

          {primaryNav.map((item, idx) => {
            const active = isActive(item.href, item.sectionId ?? null);
              const Icon = NAV_ICONS[item.href];
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left transition-colors"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "13px 24px",
                  fontSize: "15px",
                  fontWeight: active ? "700" : "500",
                  color: active ? "#C9A84C" : "#1F2937",
                  borderLeft: active ? "3px solid #C9A84C" : "3px solid transparent",
                  background: active ? "rgba(201,168,76,0.04)" : "transparent",
                  opacity: menuVisible ? 1 : 0,
                  transform: menuVisible ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 0.3s ease ${100 + idx * 40}ms, transform 0.3s ease ${100 + idx * 40}ms`,
                }}
              >
                {Icon && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "30px",
                      height: "30px",
                      borderRadius: "8px",
                      background: active ? "rgba(201,168,76,0.12)" : "rgba(0,0,0,0.04)",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} style={{ color: active ? "#C9A84C" : "#888" }} />
                  </span>
                )}
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight size={14} style={{ color: active ? "#C9A84C" : "#ccc", flexShrink: 0 }} />
              </button>
            );
          })}
        </nav>

        {/* ── 2차 메뉴 구분선 + 섹션 ── */}
        {secondaryNav.length > 0 && (
          <div
            style={{
              opacity: menuVisible ? 1 : 0,
              transition: "opacity 0.3s ease 300ms",
            }}
          >
            <div
              style={{
                margin: "4px 24px 0",
                borderTop: "1px solid rgba(0,0,0,0.06)",
              }}
            />
            <p
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                color: "#bbb",
                textTransform: "uppercase",
                padding: "12px 24px 4px",
              }}
            >
              MORE
            </p>
            {secondaryNav.map((item, idx) => {
              const active = isActive(item.href, item.sectionId ?? null);
              const Icon = NAV_ICONS[item.href];
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left transition-colors"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 24px",
                    fontSize: "14px",
                    fontWeight: active ? "700" : "400",
                    color: active ? "#C9A84C" : "#555",
                    borderLeft: active ? "3px solid #C9A84C" : "3px solid transparent",
                    background: active ? "rgba(201,168,76,0.04)" : "transparent",
                    opacity: menuVisible ? 1 : 0,
                    transform: menuVisible ? "translateX(0)" : "translateX(20px)",
                    transition: `opacity 0.3s ease ${320 + idx * 35}ms, transform 0.3s ease ${320 + idx * 35}ms`,
                  }}
                >
                  {Icon && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "26px",
                        height: "26px",
                        borderRadius: "7px",
                        background: active ? "rgba(201,168,76,0.12)" : "rgba(0,0,0,0.03)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={13} style={{ color: active ? "#C9A84C" : "#aaa" }} />
                    </span>
                  )}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronRight size={13} style={{ color: active ? "#C9A84C" : "#ddd", flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        )}

        {/* ── 언어 선택 ── */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            marginTop: "auto",
            opacity: menuVisible ? 1 : 0,
            transition: "opacity 0.3s ease 420ms",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "#bbb",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            LANGUAGE
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {langOptions.map((option) => (
              <button
                type="button"
                key={option.lang}
                onClick={() => {
                  closeMobileMenu(() => {
                    const hash = window.location.hash;
                    window.location.replace(buildLocalizedPath(option.lang) + hash);
                  });
                }}
                className="flex flex-col items-center gap-1 transition-all"
                style={{
                  padding: "10px 4px",
                  borderRadius: "12px",
                  background: option.lang === lang ? "rgba(201,168,76,0.08)" : "rgba(0,0,0,0.03)",
                  border: option.lang === lang ? "1.5px solid #C9A84C" : "1.5px solid transparent",
                }}
              >
                <span style={{ fontSize: "20px" }}>{option.flag}</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: option.lang === lang ? 700 : 500,
                    color: option.lang === lang ? "#C9A84C" : "#666",
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 모바일 CTA ── */}
        <div
          style={{
            padding: "16px 24px 32px",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flexShrink: 0,
            opacity: menuVisible ? 1 : 0,
            transition: "opacity 0.3s ease 460ms",
          }}
        >
          <div className="relative">
            <a
              href={chatUrl}
              target={lang === "zh" ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={handleWechatClick}
              className="flex items-center justify-center font-semibold text-sm w-full transition-opacity hover:opacity-90"
              style={{
                background: chatBg,
                color: chatColor,
                padding: "14px",
                borderRadius: "14px",
                letterSpacing: "0.01em",
              }}
            >
              {t.hero.cta_kakao}
            </a>
            {wechatCopied && lang === "zh" && (
              <div
                className="absolute bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
                style={{ top: "-40px", left: "0", zIndex: 50 }}
              >
                {t.access.copiedLabel}: <span className="font-bold">{WECHAT_ID}</span>
              </div>
            )}
          </div>
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #C4A882 0%, #A8895E 100%)",
              padding: "14px",
              borderRadius: "14px",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 16px rgba(196,168,130,0.3)",
            }}
          >
            {t.hero.cta_reserve}
          </a>
        </div>
      </div>
    </>
  );
}
