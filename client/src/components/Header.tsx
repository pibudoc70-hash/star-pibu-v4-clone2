/**
 * Header Component - STAR 피부과
 * IA 재설계: 1차 메뉴 4개(시술·장비 / 의료진 / 이벤트 / 병원 소개) + 예약 CTA
 *   - 나머지(시설안내, 오시는 길, 외국인 안내)는 More 패널로 이동
 * 언어 전환: 데스크탑 + 모바일 드롭다운 선택자 (buildLocalizedPath 기반 locale-aware 전환)
 *   - /foreign-guide 계열에서 ko 선택 시 홈(/) 이동 (ko 콘텐츠 없음)
 * 활성 메뉴: 스크롤 위치 감지 → 현재 섹션 메뉴 강조
 * 모바일 메뉴: full-screen premium overlay
 *
 * 구조 분해 (2026-06-06):
 *   - 상태/핸들러: @/hooks/useHeaderState
 */
import {
  Menu, X, Globe, ChevronDown, MoreHorizontal,
} from "lucide-react";
import { useHeaderState } from "@/hooks/useHeaderState";

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

          {/* ── 데스크탑 1차 메뉴 (4개) ── */}
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
                  {/* 골드 언더라인 인디케이터 */}
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

            {/* ── More 버튼 ── */}
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

              {/* More 드롭다운 패널 */}
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

          {/* ── 언어 드롭다운 ── */}
          <div
            className="hidden md:flex items-center flex-shrink-0"
            ref={langDropRef}
            style={{ position: "relative", marginLeft: "16px" }}
          >
            <button
              type="button"
              ref={langTriggerRef}
              onClick={() => setLangDropOpen(!langDropOpen)}
              className="flex items-center gap-1.5 transition-all duration-200 hover:bg-gray-50"
              style={{
                fontSize: "12.5px",
                color: "#555",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: "100px",
                padding: "5px 12px",
                background: langDropOpen ? "#f7f7f7" : "white",
                gap: "5px",
              }}
              aria-label="언어 선택"
              aria-expanded={langDropOpen}
              aria-haspopup="listbox"
            >
              <Globe size={12} style={{ color: "#999" }} />
              <span>{currentLangOption.flag}</span>
              <ChevronDown
                size={11}
                style={{
                  color: "#aaa",
                  transform: langDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {langDropOpen && (
              <div
                role="listbox"
                aria-label="언어 목록"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: "0",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                  minWidth: "148px",
                  overflow: "hidden",
                  zIndex: 200,
                  animation: "fadeSlideDown 0.15s ease",
                }}
              >
                {langOptions.map((option) => (
                  <button
                    type="button"
                    id={`lang-option-${option.lang}`}
                    key={option.lang}
                    role="option"
                    aria-selected={option.lang === lang}
                    onClick={() => handleLangChange(option)}
                    className="w-full flex items-center gap-2.5 text-left transition-colors hover:bg-gray-50"
                    style={{
                      padding: "10px 16px",
                      fontSize: "13px",
                      color: option.lang === lang ? "#C9A84C" : "#333",
                      fontWeight: option.lang === lang ? 600 : 400,
                      background: option.lang === lang ? "rgba(201,168,76,0.05)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "15px" }}>{option.flag}</span>
                    <span>{option.label}</span>
                    {option.lang === lang && (
                      <span style={{ marginLeft: "auto", color: "#C9A84C", fontSize: "11px" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── 데스크탑 예약 CTA ── */}
          <div className="hidden lg:flex items-center flex-shrink-0" style={{ marginLeft: "12px", gap: "6px" }}>
            {/* 카카오톡 상담 */}
            <div className="relative">
              <a
                href={chatUrl}
                target={isZH ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={handleWechatClick}
                className="flex items-center gap-1 font-semibold transition-all duration-200 whitespace-nowrap hover:opacity-90"
                style={{
                  background: chatBg,
                  color: chatColor,
                  fontSize: "12px",
                  padding: "7px 14px",
                  borderRadius: "100px",
                  letterSpacing: "0.01em",
                }}
              >
                {t.hero.cta_kakao}
              </a>
              {wechatCopied && isZH && (
                <div
                  className="absolute bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
                  style={{ top: "calc(100% + 8px)", left: "0", zIndex: 50 }}
                >
                  {t.access.copiedLabel}: <span className="font-bold">{WECHAT_ID}</span>
                </div>
              )}
            </div>
            {/* 네이버 예약 */}
            <a
              href={reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-white transition-all duration-200 whitespace-nowrap hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #03C75A 0%, #02a84a 100%)",
                fontSize: "12px",
                padding: "7px 14px",
                borderRadius: "100px",
                letterSpacing: "0.01em",
                boxShadow: "0 2px 10px rgba(3,199,90,0.25)",
              }}
            >
              {t.hero.cta_reserve}
            </a>
            {/* 전화 */}
            <a
              href={phoneHref}
              className="flex items-center gap-1 font-semibold transition-all duration-200 whitespace-nowrap hover:opacity-90"
              style={{
                background: "#1F2937",
                color: "#FFFFFF",
                fontSize: "12px",
                padding: "7px 14px",
                borderRadius: "100px",
                letterSpacing: "0.01em",
              }}
            >
              {phoneDisplay}
            </a>
          </div>

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

      {/* ── 모바일 메뉴 — Full-Screen Premium Overlay ── */}
      {mobileOpen && (
        <>
          {/* 딤 배경 */}
          <div
            onClick={() => closeMobileMenu()}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
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
              background: "white",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              transform: menuVisible && !menuClosing ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
            }}
          >
            {/* 헤더 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#C9A84C", letterSpacing: "0.08em" }}>
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

            {/* 1차 + 2차 메뉴 */}
            <nav
              style={{
                padding: "16px 0",
                opacity: menuVisible ? 1 : 0,
                transition: "opacity 0.3s ease 100ms",
              }}
              aria-label="모바일 메인 네비게이션"
            >
              {[...primaryNav, ...secondaryNav].map((item, idx) => {
                const active = isActive(item.href, item.sectionId);
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className="w-full text-left transition-colors"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 24px",
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
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* 언어 선택 */}
            <div
              style={{
                padding: "20px 24px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                opacity: menuVisible ? 1 : 0,
                transition: "opacity 0.3s ease 400ms",
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

            {/* 모바일 CTA */}
            <div
              style={{
                padding: "16px 24px 32px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                opacity: menuVisible ? 1 : 0,
                transition: "opacity 0.3s ease 450ms",
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
                  background: "linear-gradient(135deg, #03C75A 0%, #02a84a 100%)",
                  padding: "14px",
                  borderRadius: "14px",
                  letterSpacing: "0.01em",
                  boxShadow: "0 4px 16px rgba(3,199,90,0.22)",
                }}
              >
                {t.hero.cta_reserve}
              </a>
            </div>
          </div>
        </>
      )}

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
