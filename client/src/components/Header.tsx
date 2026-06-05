/**
 * Header Component - STAR 피부과
 * 디자인: 모던 클리닉 엣지 - 민트-네이비 듀오톤
 * 언어 전환: 데스크탑 + 모바일 드롭다운 선택자 (buildLocalizedPath 기반 locale-aware 전환)
 *   - /foreign-guide 계열에서 ko 선택 시 홈(/) 이동 (ko 콘텐츠 없음)
 *   - 그 외 경로: 현재 URL에서 lang prefix만 교체
 * 활성 메뉴: 스크롤 위치 감지 → 현재 섹션 메뉴 강조
 * 모바일 메뉴: 각 항목 앞에 아이콘 추가
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  Menu, X, Phone, MessageCircle, Calendar,
  Home, Info, Users, Stethoscope, Building2, MapPin, Globe, ChevronDown,
} from "lucide-react";
import StarLogo from "./StarLogo";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lang } from "@/lib/i18n";
import { getLocaleBase } from "../../../shared/pathUtils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { t, lang, setLang } = useLang();
  const [langDropOpen, setLangDropOpen] = useState(false);
  const langDropRef = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null); // S2-T3: ESC 닫기 후 focus restore 대상
  // Bug Fix: 빠른 연속 클릭 시 이전 MutationObserver 취소용 ref
  const pendingNavRef = useRef<{ observer: MutationObserver; timeout: ReturnType<typeof setTimeout> } | null>(null);
  // A11y: 모바일 메뉴 focus trap용 ref
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null); // 메뉴 닫힐 후 focus 복원 대상

  // 언어 옵션 정의
  const langOptions: { lang: Lang; label: string; flag: string }[] = [
    { lang: "ko", label: "한국어", flag: "🇰🇷" },
    { lang: "en", label: "English", flag: "🇺🇸" },
    { lang: "ja", label: "日本語", flag: "🇯🇵" },
    { lang: "zh", label: "中文", flag: "🇨🇳" },
  ];

  const currentLangOption = langOptions.find(o => o.lang === lang) || langOptions[0];

  /**
   * locale-aware 언어 전환:
   * 현재 URL에서 lang prefix(/en|/ja|/zh)를 제거한 뒤 새 prefix를 붙여 이동.
   * 지원 패턴: /, /about, /equipment2, /equipment2/:slug,
   *   /treatments/:slug, /foreign-guide, /privacy, /non-covered
   * hash가 있으면 유지.
   */
  const buildLocalizedPath = (targetLang: Lang): string => {
    const LANG_PREFIXES = ["/en", "/ja", "/zh"];
    // 현재 pathname에서 lang prefix 제거
    let stripped = location;
    for (const prefix of LANG_PREFIXES) {
      if (stripped === prefix || stripped.startsWith(prefix + "/")) {
        stripped = stripped.slice(prefix.length) || "/";
        break;
      }
    }
    // /foreign-guide 계열에서 ko 선택 시 홈(/) 이동
    // 이유: foreign-guide는 en/ja/zh 전용 페이지이므로 ko 콘텐츠 없음.
    //   ko 선택 시 영어 alias 화면이 남아 헤더만 ko인 상태를 방지.
    if (targetLang === "ko" && (stripped === "/foreign-guide" || stripped.startsWith("/foreign-guide/"))) {
      return "/";
    }
    // 새 prefix 붙이기
    const prefix = targetLang === "ko" ? "" : `/${targetLang}`;
    const newPath = prefix + (stripped === "/" ? "" : stripped) || "/";
    return newPath || "/";
  };

  const handleLangChange = (option: typeof langOptions[0]) => {
    setLangDropOpen(false);
    const hash = window.location.hash;
    const newPath = buildLocalizedPath(option.lang);
    window.location.href = newPath + hash;
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) {
        setLangDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // H-1: 모바일 메뉴 ESC 키 닫기 (WCAG 2.1 SC 2.1.2)
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  // A11y: 모바일 메뉴 focus trap (Tab/Shift+Tab 제한)
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

  // A11y: 모바일 메뉴 열릴 때 첫 버튼에 포커스, 닫힐 때 햄버거 버튼으로 복원
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

  // H-3: 언어 드롭다운 ESC 키 닫기 + S2-T3: focus restore
  useEffect(() => {
    if (!langDropOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLangDropOpen(false);
        // S2-T3: ESC 닫기 후 트리거 버튼으로 focus 복원
        requestAnimationFrame(() => langTriggerRef.current?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [langDropOpen]);
  const WECHAT_ID = "star2006beauty";
  const KAKAO_URL = "https://pf.kakao.com/_HNyGC";
  const LINE_URL = "https://line.me/ti/p/~star2006derm";
  const JA_LINE_URL = "https://lin.ee/tyuRdUc";
  const NAVER_URL = "https://map.naver.com/p/search/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC%20%EC%84%9C%EB%A9%B4";
  const chatUrl = lang === "zh" ? "#" : KAKAO_URL;
  const reserveUrl = lang === "zh" ? LINE_URL : lang === "ja" ? JA_LINE_URL : NAVER_URL;
  const chatBg = lang === "zh" ? "#07C160" : "#FEE500";
  const chatColor = lang === "zh" ? "white" : "#1F2937";
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
  // 다국어 페이지도 홈 페이지로 간주
  const isHome = location === "/" || location === "/en" || location === "/ja" || location === "/zh";
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";


  const navItems = [
    { label: t.nav.home,         href: "#home",       icon: Home },
    { label: "EVENT",            href: "#events",     icon: Calendar },
    { label: t.nav.doctors,      href: "#doctors",    icon: Users },
    { label: t.nav.treatments,   href: "#treatments", icon: Stethoscope },
    { label: t.nav.about,        href: "/about",      icon: Info },
    { label: t.nav.facility,     href: "#facility",   icon: Building2 },
    { label: t.nav.contact,      href: "#contact",    icon: MapPin },
    { label: "장비2",             href: "/equipment2", icon: Stethoscope, hidden: true },
  ];

  // 스크롤 감지: scrolled 상태 + 활성 섹션 감지
  useEffect(() => {
    const sectionIds = ["home", "events", "doctors", "treatments", "about", "facility", "contact"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isHome) return;

      // 현재 뷰포트 중앙에 가장 가까운 섹션 찾기
      const offset = 100;
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 실행
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // 다른 페이지에서 돌아올 때 활성 섹션 초기화
  useEffect(() => {
    if (!isHome) setActiveSection("");
  }, [isHome]);

  // 메뉴 닫기 - 빠른 반응성을 위해 애니메이션 시간 단축
  const closeMobileMenu = () => {
    setMenuClosing(true);
    setMenuVisible(false);
    setTimeout(() => {
      setMenuClosing(false);
      setMobileOpen(false);
    }, 200); // 총 200ms로 단축 (기존 595ms)
  };

  // 메뉴 열기 - 즉시 반응
  const openMobileMenu = () => {
    setMobileOpen(true);
    setMenuVisible(true);
  };

  // 메뉴 랜더링 로직
  const renderNavItems = navItems.filter(item => {
    // 장비2는 관리자만 보이기
    if (item.hidden && !isAdmin) return false;
    return true;
  });

  const handleNavClick = (href: string) => {
    closeMobileMenu();

    // Bug Fix 1: 빠른 연속 클릭 시 이전 MutationObserver 취소
    if (pendingNavRef.current) {
      pendingNavRef.current.observer.disconnect();
      clearTimeout(pendingNavRef.current.timeout);
      pendingNavRef.current = null;
    }

    // shared/pathUtils.getLocaleBase: /foreign-guide → "/en", /en/* → "/en", etc.
    const getLocalizedPath = () => getLocaleBase(location);

    // Bug Fix 2: 헤더 높이를 동적으로 계산 (scrolled 상태에 따라 60px 또는 72px)
    const getHeaderOffset = () => {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      return header ? header.offsetHeight + 8 : 80;
    };

    // 절대 경로 링크 (/about, /equipment2 등)는 locale-aware로 처리
    if (href.startsWith("/")) {
      const basePath = getLocalizedPath();
      if (basePath !== "/") {
        // 다국어 페이지: 해당 언어 경로 추가
        window.location.href = `${basePath}${href}`;
      } else {
        // 한국어 페이지: 그대로 이동
        window.location.href = href;
      }
      return;
    }

    // Bug Fix 3: isHome 판단 시 window.location.pathname 기준으로 재확인
    // (wouter location state가 비동기 업데이트될 수 있으므로 실제 pathname 사용)
    const currentPathname = window.location.pathname;
    const isCurrentHome = currentPathname === "/" || currentPathname === "/en" || currentPathname === "/ja" || currentPathname === "/zh";

    // 해시 링크 (#home, #doctors 등)는 현재 페이지 기반
    // isCurrentHome이 true이면 현재 페이지에서 스크롤 (다국어 페이지 포함)
    if (isCurrentHome) {
      const basePath = getLocalizedPath();
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", basePath);
        return;
      }
      const scrollToEl = (el: Element) => {
        // Bug Fix 4: smooth scroll 중 재클릭 시 정확한 위치 계산
        // getBoundingClientRect().top은 현재 뷰포트 기준이므로 window.scrollY 더해야 절대 위치
        const offset = getHeaderOffset();
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        history.replaceState(null, "", basePath + href);
      };
      const el = document.querySelector(href);
      if (el) {
        scrollToEl(el);
        return;
      }
      // lazy 섹션은 아직 DOM에 없을 수 있음.
      // MutationObserver로 최대 3초 대기 후 마운트되면 스크롤.
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
      // 진행 중인 observer 저장 (다음 클릭 시 취소용)
      pendingNavRef.current = { observer, timeout };
      // URL 해시 미리 업데이트 (브라우저 기본 스크롤 방지용)
      history.replaceState(null, "", basePath + href);
      return;
    }

    // isCurrentHome이 false이면 다른 페이지 → 현재 언어 페이지로 라우팅
    const basePath = getLocalizedPath();
    if (href === "#home") {
      window.location.href = basePath;
    } else {
      window.location.href = `${basePath}${href}`;
    }
  };

  // 활성 여부 판단
  const isActive = (href: string) => {
    if (href.startsWith("/")) {
      return location === href;
    }
    const sectionId = href.replace("#", "");
    // 다국어 페이지에서도 섹션 활성 상태 표시
    return isHome && activeSection === sectionId;
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        role="banner"
        aria-label="사이트 헤더"
        style={{
          height: scrolled ? "60px" : "72px",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled
            ? "0 2px 20px rgba(0,0,0,0.08), 0 3px 0 0 transparent"
            : "0 1px 0 rgba(0,0,0,0.06)",
          borderBottom: scrolled ? "2px solid transparent" : "none",
          backgroundImage: scrolled
            ? "linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(90deg, transparent 0%, #C9A84C 30%, #F5D78E 50%, #C9A84C 70%, transparent 100%)"
            : "linear-gradient(rgba(255,255,255,0.97), rgba(255,255,255,0.97))",
          backgroundOrigin: "border-box",
          backgroundClip: scrolled ? "padding-box, border-box" : "padding-box",
        }}
      >
        <div
          className="h-full flex items-center"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.25rem", width: "100%" }}
        >
          {/* Logo */}
          <button type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center group flex-shrink-0"
            aria-label="홈으로 이동"
            style={{ position: "relative" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#d2ac67",
                  letterSpacing: "0.5px",
                }}
              >
                STAR DERMATOLOGY
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center flex-1 justify-center" style={{ gap: "4px" }} role="navigation" aria-label="메인 네비게이션">
            {renderNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <button type="button"
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="relative transition-all duration-200 whitespace-nowrap px-3.5 py-2"
                  style={{
                    color: '#4f4f4f',
                    fontSize: '14px',
                    fontWeight: active ? '600' : '400',
                    letterSpacing: "-0.01em",
                    background: active ? "#f0f0f0" : "transparent",
                    borderRadius: '5px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    borderBottom: active ? '2px solid #ffffff' : '2px solid transparent',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Language Dropdown - Desktop */}
          <div className="hidden md:flex items-center mr-2 flex-shrink-0" ref={langDropRef} style={{ position: "relative" }}>
            <button type="button"
              ref={langTriggerRef}
              onClick={() => setLangDropOpen(!langDropOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100"
              style={{ fontSize: "13px", color: "#4f4f4f", border: "1px solid rgba(0,0,0,0.12)", background: langDropOpen ? "#f5f5f5" : "white" }}
              aria-label="언어 선택"
              aria-expanded={langDropOpen}
              aria-haspopup="listbox"
            >
              <Globe size={13} style={{ color: "#888" }} />
              <span>{currentLangOption.flag}</span>
              <span style={{ fontWeight: 500 }}>{currentLangOption.label}</span>
              <ChevronDown size={12} style={{ color: "#888", transform: langDropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            {langDropOpen && (
              <div
                role="listbox"
                aria-label="언어 목록"
                aria-activedescendant={`lang-option-${lang}`}
                className="absolute top-full mt-1.5 right-0 rounded-xl shadow-xl overflow-hidden"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", minWidth: "140px", zIndex: 200 }}
              >
                {langOptions.map((option) => (
                  <button type="button"
                    id={`lang-option-${option.lang}`}
                    key={option.lang}
                    role="option"
                    aria-selected={option.lang === lang}
                    onClick={() => handleLangChange(option)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                    style={{
                      fontSize: "13px",
                      color: option.lang === lang ? "#C9A84C" : "#333",
                      fontWeight: option.lang === lang ? 600 : 400,
                      background: option.lang === lang ? "rgba(201,168,76,0.06)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{option.flag}</span>
                    <span>{option.label}</span>
                    {option.lang === lang && <span style={{ marginLeft: "auto", color: "#C9A84C", fontSize: "12px" }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <a
                href={chatUrl}
                target={lang === "zh" ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={handleWechatClick}
                className="flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: chatBg, color: chatColor, fontSize: "13px", padding: "6px 14px" }}
              >
                <MessageCircle size={13} />
                {t.hero.cta_kakao}
              </a>
              {wechatCopied && lang === "zh" && (
                <div className="absolute top-10 left-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-50">
                  已复制 WeChat ID: <span className="font-bold">{WECHAT_ID}</span>
                </div>
              )}
            </div>
            <a
              href={reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold rounded-full text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ background: lang === "zh" ? "#06C755" : "#03C75A", fontSize: "13px", padding: "6px 14px" }}
            >
              <Calendar size={13} />
              {t.hero.cta_reserve}
            </a>
          </div>

          {/* Mobile Hamburger + 층별 안내 */}
          <div className="md:hidden ml-auto">
            <button type="button"
              ref={hamburgerRef}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#1F2937" }}
              onClick={() => openMobileMenu()}
              aria-label="메뉴 열기"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - 딤 배경 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 transition-all duration-300"
          style={{
            background: (menuVisible || menuClosing) ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
            backdropFilter: (menuVisible || menuClosing) ? "blur(3px)" : "blur(0px)",
          }}
          onClick={() => closeMobileMenu()}
        />
      )}

      {/* Mobile Menu Panel */}
      {mobileOpen && (
      <div
        ref={mobileMenuRef}
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="네비게이션 메뉴"
        className="fixed top-0 right-0 h-full z-50 shadow-2xl overflow-y-auto transition-all duration-300"
        style={{
          width: "min(88vw, 340px)",
          transform: (menuVisible || menuClosing) ? "translateX(0)" : "translateX(100%)",
          opacity: (menuVisible || menuClosing) ? 1 : 0,
          background: "#FAFAFA",
        }}
      >
        {/* 모바일 메뉴 헤더 */}
        <div
          className={`flex items-center justify-between p-5 border-b${
            menuClosing ? " menu-cta-stagger-out" : menuVisible ? " menu-cta-stagger" : ""
          }`}
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            ...(menuClosing
              ? { "--stagger-out-delay": `${30 + navItems.length * 45}ms` } as React.CSSProperties
              : menuVisible
              ? { "--stagger-delay": "30ms" } as React.CSSProperties
              : {}),
          }}
        >

          <button type="button"
            onClick={() => closeMobileMenu()}
            className="p-2 rounded-full transition-colors"
            style={{ color: "#666", background: "rgba(0,0,0,0.06)" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 모바일 네비게이션 - 아이콘 포함 */}
        <nav className="p-4 flex flex-col gap-1">
          {renderNavItems.map((item, index) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <button type="button"
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`flex items-center gap-3 text-left py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200${
                  menuClosing ? " menu-item-stagger-out" : menuVisible ? " menu-item-stagger" : ""
                }`}
                style={{
                  color: active ? "#C9A84C" : "#333",
                  background: active
                    ? "rgba(201,168,76,0.08)"
                    : "transparent",

                  ...(menuClosing
                    ? { "--stagger-out-delay": `${(navItems.length - 1 - index) * 45}ms` } as React.CSSProperties
                    : menuVisible
                    ? { "--stagger-delay": `${80 + index * 45}ms` } as React.CSSProperties
                    : {}),
                }}
              >
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ color: active ? "#C9A84C" : "#888" }}
                >
                  <Icon size={18} />
                </span>
                <span style={{ letterSpacing: "-0.01em" }}>{item.label}</span>

              </button>
            );
          })}
        </nav>

        {/* 모바일 언어 선택 */}
        <div
          className={`p-4 border-t${menuClosing ? " menu-cta-stagger-out" : menuVisible ? " menu-cta-stagger" : ""}`}
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            ...(menuClosing
              ? { "--stagger-out-delay": "0ms" } as React.CSSProperties
              : menuVisible
              ? { "--stagger-delay": `${80 + navItems.length * 45}ms` } as React.CSSProperties
              : {}),
          }}
        >
          <p className="text-xs font-semibold mb-2.5" style={{ color: "#999", letterSpacing: "0.05em" }}>LANGUAGE</p>
          <div className="grid grid-cols-4 gap-2">
            {langOptions.map((option) => (
              <button type="button"
                key={option.lang}
                onClick={() => { closeMobileMenu(); setTimeout(() => { const hash = window.location.hash; window.location.href = buildLocalizedPath(option.lang) + hash; }, 100); }}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
                style={{
                  background: option.lang === lang ? "rgba(201,168,76,0.1)" : "rgba(0,0,0,0.04)",
                  border: option.lang === lang ? "1.5px solid #C9A84C" : "1.5px solid transparent",
                }}
              >
                <span style={{ fontSize: "20px" }}>{option.flag}</span>
                <span style={{ fontSize: "10px", fontWeight: option.lang === lang ? 700 : 500, color: option.lang === lang ? "#C9A84C" : "#555" }}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 모바일 CTA 버튼들 */}
        <div
          className={`p-4 border-t flex flex-col gap-2.5${
            menuClosing ? " menu-cta-stagger-out" : menuVisible ? " menu-cta-stagger" : ""
          }`}
          style={{
            borderColor: "rgba(0,0,0,0.08)",
            ...(menuClosing
              ? { "--stagger-out-delay": "0ms" } as React.CSSProperties
              : menuVisible
              ? { "--stagger-delay": `${80 + navItems.length * 45 + 30}ms` } as React.CSSProperties
              : {}),
          }}
        >
          <a
            href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(0,0,0,0.04)", color: "#333", border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <Phone size={16} />
            {lang === "ko" ? "051-818-2300" : "+82-51-818-2300"}
          </a>
          <div className="relative">
            <a
              href={chatUrl}
              target={lang === "zh" ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={handleWechatClick}
              className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm w-full"
              style={{ background: chatBg, color: chatColor }}
            >
              <MessageCircle size={16} />
              {t.hero.cta_kakao}
            </a>
            {wechatCopied && lang === "zh" && (
              <div className="absolute -top-10 left-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-50">
                已复制 WeChat ID: <span className="font-bold">{WECHAT_ID}</span>
              </div>
            )}
          </div>
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm text-white"
            style={{ background: lang === "zh" ? "linear-gradient(135deg, #06C755, #04a843)" : "linear-gradient(135deg, #03C75A, #02a84a)" }}
          >
            <Calendar size={16} />
            {t.hero.cta_reserve}
          </a>
        </div>
      </div>
      )}
    </>
  );
}
