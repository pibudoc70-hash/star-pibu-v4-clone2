/**
 * MobileMenu — 모바일 전체 화면 오버레이 메뉴
 * P0 개선사항:
 * - 인라인 스타일 → CSS 클래스 기반으로 전환
 * - 하드코딩 컬러 → 브랜드 CSS 변수로 통일
 * - Body scroll lock 구현
 * - Focus trap 구현 (Tab 키 제어)
 * - ESC 키 닫기 구현
 */
import { X, ChevronRight, Stethoscope, Users, Calendar, Building2, MapPin, Globe2, BookOpen, FlaskConical } from "lucide-react";
import type { RefObject } from "react";
import { useEffect } from "react";
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
  "/doctors":    Users,
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
  // Scroll lock 및 Focus trap 관리
  useEffect(() => {
    if (!mobileOpen) return;

    // Scroll lock: body에 overflow: hidden 추가
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add("menu-open");
    document.body.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);

    // ESC 키 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    };

    // Focus trap: Tab 키 제어
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !mobileMenuRef.current) return;

      const focusableElements = mobileMenuRef.current.querySelectorAll(
        "button, a[href], input, [tabindex]:not([tabindex='-1'])"
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabKey);

    // 메뉴 열 때 첫 포커스 요소로 이동
    if (menuVisible && mobileMenuRef.current) {
      const closeBtn = mobileMenuRef.current.querySelector(".mobile-menu-close-btn") as HTMLElement;
      closeBtn?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabKey);
      document.body.classList.remove("menu-open");
      document.body.style.removeProperty("--scrollbar-width");
    };
  }, [mobileOpen, menuVisible, closeMobileMenu, mobileMenuRef]);

  if (!mobileOpen) return null;

  return (
    <>
      {/* 딤 배경 */}
      <div
        onClick={() => closeMobileMenu()}
        className={`mobile-menu-overlay ${menuVisible ? "visible" : ""}`}
        aria-hidden="true"
      />

      {/* 메뉴 패널 */}
      <div
        id="mobile-menu-panel"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
        className={`mobile-menu-panel ${menuVisible && !menuClosing ? "visible" : ""}`}
      >
        {/* ── 헤더 ── */}
        <div className="mobile-menu-header">
          <span className="mobile-menu-header-title">STAR DERMATOLOGY</span>
          <button
            type="button"
            onClick={() => closeMobileMenu()}
            className="mobile-menu-close-btn"
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── 1차 메뉴 ── */}
        <nav className={`mobile-menu-nav ${menuVisible ? "visible" : ""}`} aria-label="모바일 메인 네비게이션">
          {/* 섹션 레이블 */}
          <p className="mobile-menu-section-label">MENU</p>

          {primaryNav.map((item, idx) => {
            const active = isActive(item.href, item.sectionId ?? null);
            const Icon = NAV_ICONS[item.href];
            return (
              <button
                type="button"
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`mobile-menu-item mobile-menu-item-delay-${idx} ${active ? "active" : ""} ${menuVisible ? "visible" : ""}`}
              >
                {Icon && (
                  <span className="mobile-menu-icon">
                    <Icon size={15} />
                  </span>
                )}
                <span className="flex-1 min-w-0">{item.label}</span>
                <ChevronRight size={14} className="shrink-0" />
              </button>
            );
          })}
        </nav>

        {/* ── 2차 메뉴 구분선 + 섹션 ── */}
        {secondaryNav.length > 0 && (
          <div className={`mobile-menu-secondary-section ${menuVisible ? "visible" : ""}`}>
            <div className="mobile-menu-divider" />
            <p className="mobile-menu-section-label">MORE</p>
            {secondaryNav.map((item, idx) => {
              const active = isActive(item.href, item.sectionId ?? null);
              const Icon = NAV_ICONS[item.href];
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`mobile-menu-item mobile-menu-item-secondary mobile-menu-item-delay-secondary-${idx} ${active ? "active" : ""} ${menuVisible ? "visible" : ""}`}
                >
                  {Icon && (
                    <span className="mobile-menu-icon mobile-menu-icon-secondary">
                      <Icon size={13} />
                    </span>
                  )}
                  <span className="flex-1 min-w-0">{item.label}</span>
                  <ChevronRight size={13} className="shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {/* ── 언어 선택 ── */}
        <div className={`mobile-menu-lang-section ${menuVisible ? "visible" : ""}`}>
          <p className="mobile-menu-section-label">LANGUAGE</p>
          <div className="mobile-menu-lang-grid">
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
                className={`mobile-menu-lang-btn ${option.lang === lang ? "active" : ""}`}
              >
                <span className="mobile-menu-lang-badge">{option.lang.toUpperCase()}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 모바일 CTA ── */}
        <div className={`mobile-menu-cta-section ${menuVisible ? "visible" : ""}`}>
          <div className="relative">
            <a
              href={chatUrl}
              target={lang === "zh" ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={handleWechatClick}
              className="mobile-menu-cta-primary"
              style={{
                background: chatBg,
                color: chatColor,
              }}
              data-chat-bg={chatBg}
              data-chat-color={chatColor}
            >
              {t.hero.cta_kakao}
            </a>
            {wechatCopied && lang === "zh" && (
              <div className="mobile-menu-wechat-toast">
                {t.access.copiedLabel}: <span className="font-bold">{WECHAT_ID}</span>
              </div>
            )}
          </div>
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-cta-secondary"
          >
            {t.hero.cta_reserve}
          </a>
        </div>
      </div>
    </>
  );
}
