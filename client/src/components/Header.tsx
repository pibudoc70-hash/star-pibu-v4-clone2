/**
 * Header Component - STAR 피부과
 * IA 재설계: 1차 메뉴 4개(시술·장비 / 의료진 / 이벤트 / 병원 소개) + 예약 CTA
 *   - 나머지(시설안내, 오시는 길, 외국인 안내)는 More 패널로 이동
 * 언어 전환: 데스크탑 + 모바일 드롭다운 선택자 (buildLocalizedPath 기반 locale-aware 전환)
 *   - /foreign-guide 계열에서 ko 선택 시 홈(/) 이동 (ko 콘텐츠 없음)
 * 활성 메뉴: 스크롤 위치 감지 → 현재 섹션 메뉴 강조
 * 모바일 메뉴: full-screen premium overlay
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Menu, X, Globe, ChevronDown, MoreHorizontal,
} from "lucide-react";
import StarLogo from "./StarLogo";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lang } from "@/lib/i18n";
import { getLocaleBase } from "../../../shared/pathUtils";
import { useChatConfig, CHAT_URLS } from "@/hooks/useChatConfig";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const { t, lang, setLang } = useLang();
  const [langDropOpen, setLangDropOpen] = useState(false);
  const langDropRef = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pendingNavRef = useRef<{ observer: MutationObserver; timeout: ReturnType<typeof setTimeout> } | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const langOptions: { lang: Lang; label: string; flag: string }[] = [
    { lang: "ko", label: "한국어", flag: "🇰🇷" },
    { lang: "en", label: "English", flag: "🇺🇸" },
    { lang: "ja", label: "日本語", flag: "🇯🇵" },
    { lang: "zh", label: "中文", flag: "🇨🇳" },
  ];

  const currentLangOption = langOptions.find(o => o.lang === lang) || langOptions[0];

  const buildLocalizedPath = (targetLang: Lang): string => {
    // wouter의 location은 hash/query를 제외한 pathname만 반환하므로
    // window.location.pathname을 사용해 실제 현재 경로를 정확히 파악
    const LANG_PREFIXES = ["/en", "/ja", "/zh"];
    let stripped = window.location.pathname;
    for (const prefix of LANG_PREFIXES) {
      if (stripped === prefix || stripped.startsWith(prefix + "/")) {
        stripped = stripped.slice(prefix.length) || "/";
        break;
      }
    }
    // /foreign-guide 계열은 ko 콘텐츠 없음 → 홈으로 안전 복귀
    if (targetLang === "ko" && (stripped === "/foreign-guide" || stripped.startsWith("/foreign-guide/"))) {
      return "/";
    }
    const prefix = targetLang === "ko" ? "" : `/${targetLang}`;
    const newPath = prefix + (stripped === "/" ? "" : stripped) || "/";
    return newPath || "/";
  };

  const handleLangChange = (option: typeof langOptions[0]) => {
    setLangDropOpen(false);
    // LangContext를 먼저 업데이트하여 localStorage에 선호 언어 저장
    // (persist=true: 사용자가 명시적으로 선택한 언어이므로 저장)
    setLang(option.lang, true);
    const hash = window.location.hash;
    const newPath = buildLocalizedPath(option.lang);
    // window.location.href 대신 replace를 사용하여 히스토리 스택 오염 방지
    window.location.replace(newPath + hash);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) {
        setLangDropOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 모바일 메뉴 ESC 키 닫기 (WCAG 2.1 SC 2.1.2)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  // 모바일 메뉴 focus trap
  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return;
    const panel = mobileMenuRef.current;
    const getFocusable = () => panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onTab);
    return () => document.removeEventListener('keydown', onTab);
  }, [mobileOpen]);

  // 모바일 메뉴 열릴 때 첫 버튼에 포커스, 닫힐 때 햄버거 버튼으로 복원
  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        const first = mobileMenuRef.current?.querySelector<HTMLElement>('button');
        first?.focus();
      });
    } else if (!mobileOpen) {
      requestAnimationFrame(() => hamburgerRef.current?.focus());
    }
  }, [mobileOpen]);

  // 언어 드롭다운 ESC 키 닫기
  useEffect(() => {
    if (!langDropOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangDropOpen(false);
        requestAnimationFrame(() => langTriggerRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [langDropOpen]);

  const { chatUrl: rawChatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const WECHAT_ID = "star2006beauty";
  const chatUrl = isZH ? "#" : rawChatUrl;
  const NAVER_MAP_URL = "https://map.naver.com/p/search/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC%20%EC%84%9C%EB%A9%B4";
  const reserveUrl = isZH ? CHAT_URLS.lineZH : isJA ? CHAT_URLS.lineJA : NAVER_MAP_URL;
  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };

  const [location] = useLocation();
  const isHome = location === "/" || location === "/en" || location === "/ja" || location === "/zh";
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // ─── 1차 메뉴 (4개만 헤더에 노출) ───────────────────────────────────────
  const primaryNav = [
    { label: t.nav.treatments, href: "#treatments", sectionId: "treatments" },
    { label: t.nav.doctors,    href: "#doctors",    sectionId: "doctors"    },
    { label: "EVENT",          href: "#events",     sectionId: "events"     },
    { label: t.nav.about,      href: "/about",      sectionId: null         },
  ];

  // ─── More 패널 항목 (2차 메뉴) ──────────────────────────────────────────
  const secondaryNav = [
    { label: t.nav.facility,    href: "#facility",       sectionId: "facility" },
    { label: t.nav.contact,     href: "#contact",        sectionId: "contact"  },
    {
      label: lang === "ja" ? "外国人ガイド" : lang === "zh" ? "外国人指南" : lang === "en" ? "Foreign Guide" : "외국인 안내",
      href: "/foreign-guide",
      sectionId: null,
    },
    ...(isAdmin ? [{ label: "장비2", href: "/equipment2", sectionId: null }] : []),
  ];

  // 스크롤 감지
  useEffect(() => {
    const sectionIds = ["home", "events", "doctors", "treatments", "about", "facility", "contact"];
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (!isHome) return;
      const offset = 100;
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset) current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) setActiveSection("");
  }, [isHome]);

  const closeMobileMenu = () => {
    setMenuClosing(true);
    setMenuVisible(false);
    setTimeout(() => {
      setMenuClosing(false);
      setMobileOpen(false);
    }, 250);
  };

  const openMobileMenu = () => {
    setMobileOpen(true);
    requestAnimationFrame(() => setMenuVisible(true));
  };

  const handleNavClick = (href: string) => {
    closeMobileMenu();
    setMoreOpen(false);

    if (pendingNavRef.current) {
      pendingNavRef.current.observer.disconnect();
      clearTimeout(pendingNavRef.current.timeout);
      pendingNavRef.current = null;
    }

    const getLocalizedPath = () => getLocaleBase(location);
    const getHeaderOffset = () => {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      return header ? header.offsetHeight + 8 : 80;
    };

    if (href.startsWith("/")) {
      const basePath = getLocalizedPath();
      if (basePath !== "/") {
        window.location.href = `${basePath}${href}`;
      } else {
        window.location.href = href;
      }
      return;
    }

    const currentPathname = window.location.pathname;
    const isCurrentHome = currentPathname === "/" || currentPathname === "/en" || currentPathname === "/ja" || currentPathname === "/zh";

    if (isCurrentHome) {
      const basePath = getLocalizedPath();
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", basePath);
        return;
      }
      const scrollToEl = (el: Element) => {
        const offset = getHeaderOffset();
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", basePath + href);
      };
      const el = document.querySelector(href);
      if (el) { scrollToEl(el); return; }
      const observer = new MutationObserver(() => {
        const lazyEl = document.querySelector(href);
        if (lazyEl) {
          observer.disconnect();
          clearTimeout(timeout);
          pendingNavRef.current = null;
          scrollToEl(lazyEl);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = setTimeout(() => {
        observer.disconnect();
        pendingNavRef.current = null;
      }, 3000);
      pendingNavRef.current = { observer, timeout };
      history.replaceState(null, "", basePath + href);
      return;
    }

    const basePath = getLocalizedPath();
    if (href === "#home") {
      window.location.href = basePath;
    } else {
      window.location.href = `${basePath}${href}`;
    }
  };

  const isActive = (href: string, sectionId: string | null) => {
    if (href.startsWith("/")) return location === href;
    if (!sectionId) return false;
    return isHome && activeSection === sectionId;
  };

  // ─── 렌더 ────────────────────────────────────────────────────────────────
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
                {t.hero.cta_kakao}
              </a>
              {wechatCopied && lang === "zh" && (
                <div
                  className="absolute bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
                  style={{ top: "calc(100% + 8px)", left: "0", zIndex: 50 }}
                >
                  已复制 WeChat ID: <span className="font-bold">{WECHAT_ID}</span>
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
              {t.hero.cta_reserve}
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
            className="fixed inset-0 z-40 transition-all duration-300"
            style={{
              background: menuVisible ? "rgba(10,15,30,0.72)" : "rgba(10,15,30,0)",
              backdropFilter: menuVisible ? "blur(4px)" : "blur(0px)",
            }}
            onClick={() => closeMobileMenu()}
            aria-hidden="true"
          />

          {/* 메뉴 패널 */}
          <div
            ref={mobileMenuRef}
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="네비게이션 메뉴"
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto transition-all duration-300"
            style={{
              background: "#FFFFFF",
              opacity: menuVisible ? 1 : 0,
              transform: menuVisible ? "translateY(0)" : "translateY(-12px)",
            }}
          >
            {/* 패널 헤더 */}
            <div
              className="flex items-center justify-between"
              style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#C9A84C",
                  letterSpacing: "0.08em",
                }}
              >
                STAR DERMATOLOGY
              </span>
              <button
                type="button"
                onClick={() => closeMobileMenu()}
                className="flex items-center justify-center transition-colors hover:bg-gray-100"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  color: "#555",
                }}
                aria-label="메뉴 닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* 1차 메뉴 */}
            <nav
              role="navigation"
              aria-label="메인 네비게이션"
              style={{ padding: "8px 0" }}
            >
              {primaryNav.map((item, index) => {
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
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      fontSize: "17px",
                      fontWeight: active ? "600" : "400",
                      color: active ? "#C9A84C" : "#111",
                      letterSpacing: "-0.02em",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      opacity: menuVisible ? 1 : 0,
                      transform: menuVisible ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 0.3s ease ${80 + index * 50}ms, transform 0.3s ease ${80 + index * 50}ms`,
                    }}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#C9A84C",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* 2차 메뉴 (구분선 + 레이블) */}
            <div style={{ padding: "16px 24px 8px" }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  color: "#bbb",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                  opacity: menuVisible ? 1 : 0,
                  transition: `opacity 0.3s ease ${80 + primaryNav.length * 50}ms`,
                }}
              >
                MORE
              </p>
            </div>
            <nav
              role="navigation"
              aria-label="추가 메뉴"
              style={{ paddingBottom: "8px" }}
            >
              {secondaryNav.map((item, index) => {
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
                      justifyContent: "space-between",
                      padding: "13px 24px",
                      fontSize: "15px",
                      fontWeight: active ? "600" : "400",
                      color: active ? "#C9A84C" : "#555",
                      letterSpacing: "-0.01em",
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      opacity: menuVisible ? 1 : 0,
                      transform: menuVisible ? "translateY(0)" : "translateY(8px)",
                      transition: `opacity 0.3s ease ${80 + (primaryNav.length + index + 1) * 45}ms, transform 0.3s ease ${80 + (primaryNav.length + index + 1) * 45}ms`,
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
                      // LangContext 먼저 업데이트 (사용자 명시적 선택 → persist=true)
                      setLang(option.lang, true);
                      closeMobileMenu();
                      setTimeout(() => {
                        const hash = window.location.hash;
                        window.location.replace(buildLocalizedPath(option.lang) + hash);
                      }, 100);
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
                    已复制 WeChat ID: <span className="font-bold">{WECHAT_ID}</span>
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
