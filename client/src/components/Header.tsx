/**
 * Header Component - STAR 피부과
 * IA 재설계: 1차 메뉴 4개(시술·장비 / 의료진 / 이벤트 / 병원 소개) + 예약 CTA
 *   - 나머지(시설안내, 오시는 길, 외국인 안내)는 More 패널로 이동
 * 언어 전환: 데스크탑 + 모바일 드롭다운 선택자 (buildLocalizedPath 기반 locale-aware 전환)
 *   - /foreign-guide 계열에서 ko 선택 시 홈(/) 이동 (ko 콘텐츠 없음)
 * 활성 메뉴: 스크롤 위치 감지 → 현재 섹션 메뉴 강조
 * 모바일 메뉴: full-screen premium overlay
 *
 * 구조 분해 (2026-06-12):
 *   - 상태/핸들러: @/hooks/useHeaderState
 *   - 서브컴포넌트: LanguageSwitcher, DesktopNav, MobileMenu
 */
import { Menu } from "lucide-react";
import { useHeaderState } from "@/hooks/useHeaderState";
import LanguageSwitcher from "./header/LanguageSwitcher";
import DesktopNav from "./header/DesktopNav";
import MobileMenu from "./header/MobileMenu";

export default function Header() {
  const {
    scrolled, mobileOpen, menuVisible, menuClosing,
    moreOpen, setMoreOpen,
    langDropOpen, setLangDropOpen,
    wechatCopied,
    t, lang, langOptions, currentLangOption,
    chatUrl, reserveUrl, chatBg, chatColor, WECHAT_ID,
    primaryNav, secondaryNav,
    langDropRef, langTriggerRef, moreRef,
    mobileMenuRef, hamburgerRef,
    handleLangChange, handleWechatClick,
    openMobileMenu, closeMobileMenu, handleNavClick, isActive,
    buildLocalizedPath,
  } = useHeaderState();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        role="banner"
        aria-label="사이트 헤더"
        style={{
          height: scrolled ? "60px" : "80px",
          background: scrolled
            ? "rgba(250,248,245,0.97)"
            : "rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(24px) saturate(200%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "none",
          borderBottom: scrolled
            ? "1px solid color-mix(in srgb, var(--color-gold-primary) 18%, transparent)"
            : "1px solid rgba(255,255,255,0.0)",
          boxShadow: scrolled ? "0 2px 32px rgba(0,0,0,0.07)" : "none",
          transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          className="h-full flex items-center"
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", width: "100%", gap: "0" }}
        >
          {/* ── 로고 ── */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center flex-shrink-0 group"
            aria-label="홈으로 이동"
            style={{ marginRight: "auto" }}
          >
            {/* 심볼 아이콘만 표시 */}
            <img
              src="/manus-storage/star_logo_d0ae8bbf.webp"
              alt="스타피부과 로고"
              style={{
                width: "38px",
                height: "38px",
                objectFit: "contain",
                filter: scrolled
                  ? "brightness(0) saturate(100%) invert(18%) sepia(15%) saturate(400%) hue-rotate(340deg) brightness(85%)"
                  : "brightness(1.1) drop-shadow(0 1px 6px rgba(0,0,0,0.5))",
                transition: "filter 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </button>

          {/* ── 데스크탑 네비게이션 + CTA ── */}
          <DesktopNav
            primaryNav={primaryNav}
            secondaryNav={secondaryNav}
            moreOpen={moreOpen}
            setMoreOpen={setMoreOpen}
            moreRef={moreRef}
            isActive={isActive}
            handleNavClick={handleNavClick}
            scrolled={scrolled}
            chatUrl={chatUrl}
            reserveUrl={reserveUrl}
            chatBg={chatBg}
            chatColor={chatColor}
            wechatCopied={wechatCopied}
            handleWechatClick={handleWechatClick}
            lang={lang}
            WECHAT_ID={WECHAT_ID}
            ctaKakao={t.hero.cta_kakao}
            ctaReserve={t.hero.cta_reserve}
            copiedLabel={t.access.copiedLabel}
          />

          {/* ── 언어 드롭다운 ── */}
          <LanguageSwitcher
            lang={lang}
            langOptions={langOptions}
            currentLangOption={currentLangOption}
            langDropOpen={langDropOpen}
            setLangDropOpen={setLangDropOpen}
            langDropRef={langDropRef}
            langTriggerRef={langTriggerRef}
            handleLangChange={handleLangChange}
          />

          {/* ── 모바일 햄버거 ── */}
          <div className="md:hidden" style={{ marginLeft: "auto" }}>
            <button
              type="button"
              ref={hamburgerRef}
              className="flex items-center justify-center transition-colors"
              style={{
                width: "44px",
                height: "44px",
                color: scrolled ? "#3d2b1a" : "rgba(255,255,255,0.92)",
                borderRadius: "10px",
                transition: "color 0.5s cubic-bezier(0.16,1,0.3,1)",
                textShadow: scrolled ? "none" : "0 2px 12px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)",
                filter: scrolled ? "none" : "drop-shadow(0 1px 4px rgba(0,0,0,0.5))",
              }}
              onClick={() => openMobileMenu()}
              aria-label="메뉴 열기"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── 모바일 메뉴 ── */}
      <MobileMenu
        mobileOpen={mobileOpen}
        menuVisible={menuVisible}
        menuClosing={menuClosing}
        primaryNav={primaryNav}
        secondaryNav={secondaryNav}
        langOptions={langOptions}
        lang={lang}
        closeMobileMenu={closeMobileMenu}
        handleNavClick={handleNavClick}
        isActive={isActive}
        buildLocalizedPath={buildLocalizedPath}
        chatUrl={chatUrl}
        reserveUrl={reserveUrl}
        chatBg={chatBg}
        chatColor={chatColor}
        wechatCopied={wechatCopied}
        handleWechatClick={handleWechatClick}
        WECHAT_ID={WECHAT_ID}
        t={t}
        mobileMenuRef={mobileMenuRef}
      />

      {/* fadeSlideDown 애니메이션 */}
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
