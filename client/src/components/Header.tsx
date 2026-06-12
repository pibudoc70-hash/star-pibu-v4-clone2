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
          height: scrolled ? "58px" : "76px",
          background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: scrolled
            ? "1px solid rgba(201,168,76,0.20)"
            : "1px solid rgba(255,255,255,0.4)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
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
            <span
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "#C9A84C",
                letterSpacing: "0.08em",
                transition: "opacity 0.2s",
              }}
            >
              STAR DERMATOLOGY
            </span>
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
                width: "40px",
                height: "40px",
                color: "#1F2937",
                borderRadius: "10px",
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
