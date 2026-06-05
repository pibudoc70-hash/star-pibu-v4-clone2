/**
 * Header Component - STAR 피부과 (v5 — Mega Menu + Mobile Bottom Tab + Shrink/Blur)
 *
 * 데스크탑: 4그룹 메가 메뉴 드롭다운 (hover/keyboard)
 * 모바일:   하단 고정 탭바 5개 + "더보기" Bottom Sheet 드로어
 * 스크롤:   72px → 56px Shrink + backdrop-blur 강화
 *
 * 기존 동작 완전 유지:
 *  - locale-aware 언어 전환 (buildLocalizedPath)
 *  - 해시 스크롤 + MutationObserver lazy 섹션 대기
 *  - ESC 닫기 / focus trap / focus restore (WCAG 2.1)
 *  - WeChat ID 복사 토스트
 *  - 관리자 전용 장비2 메뉴
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Menu, X, Phone, MessageCircle, Calendar,
  Home, Info, Users, Stethoscope, Building2, MapPin, Globe, ChevronDown,
  Sparkles, ChevronRight,
} from "lucide-react";
import StarLogo from "./StarLogo";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lang } from "@/lib/i18n";
import { getLocaleBase } from "../../../shared/pathUtils";
import { useChatConfig, CHAT_URLS } from "@/hooks/useChatConfig";

// ─── 메가 메뉴 그룹 정의 ─────────────────────────────────────────────────────
interface NavChild {
  label: string;
  labelEn?: string;
  href: string;
  icon?: React.ElementType;
  badge?: string;
}
interface NavGroup {
  id: string;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  href?: string;          // 그룹 자체 링크 (드롭다운 없을 때)
  children?: NavChild[];  // 드롭다운 항목
  hidden?: boolean;       // 관리자 전용
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "treatments",
    label: "시술·장비",
    labelEn: "TREATMENTS",
    icon: Stethoscope,
    children: [
      { label: "Best 시술",    labelEn: "BEST",          href: "/equipment2?category=best",       badge: "HOT" },
      { label: "리프팅·탄력",  labelEn: "LIFTING",       href: "/equipment2?category=lifting" },
      { label: "눈밑지방",     labelEn: "EYE",           href: "/equipment2?category=eye" },
      { label: "색소·문신",    labelEn: "PIGMENT",       href: "/equipment2?category=pigment" },
      { label: "흉터·모공",    labelEn: "SCAR",          href: "/equipment2?category=scar" },
      { label: "여드름",       labelEn: "ACNE",          href: "/equipment2?category=acne_laser" },
      { label: "홍조·혈관",    labelEn: "ROSACEA",       href: "/equipment2?category=rosacea" },
      { label: "볼륨·부스터",  labelEn: "VOLUME",        href: "/equipment2?category=volume" },
      { label: "보톡스·필러",  labelEn: "BOTOX",         href: "/equipment2?category=botox" },
      { label: "줄기세포·재생",labelEn: "STEM CELL",     href: "/equipment2?category=stemcell",   badge: "NEW" },
    ],
  },
  {
    id: "events",
    label: "이벤트",
    labelEn: "EVENT",
    icon: Sparkles,
    children: [
      { label: "진행 중 이벤트", labelEn: "Current Events",  href: "#events" },
      { label: "공지사항",       labelEn: "Announcements",   href: "#events" },
    ],
  },
  {
    id: "doctors",
    label: "의료진",
    labelEn: "DOCTORS",
    icon: Users,
    href: "#doctors",
  },
  {
    id: "clinic",
    label: "병원 소개",
    labelEn: "ABOUT",
    icon: Building2,
    children: [
      { label: "피부과 소개", labelEn: "About Us",     href: "/about",    icon: Info },
      { label: "시설 안내",   labelEn: "Facility",     href: "#facility", icon: Building2 },
      { label: "오시는 길",   labelEn: "Directions",   href: "#contact",  icon: MapPin },
    ],
  },
  {
    id: "equipment2",
    label: "장비2",
    labelEn: "EQUIPMENT2",
    icon: Stethoscope,
    href: "/equipment2",
    hidden: true,
  },
];

// 모바일 하단 탭바 항목 (5개 고정)
const BOTTOM_TABS = [
  { id: "home",       label: "홈",    icon: Home,          href: "#home" },
  { id: "treatments", label: "시술",  icon: Stethoscope,   href: "#treatments" },
  { id: "events",     label: "이벤트",icon: Sparkles,      href: "#events" },
  { id: "reserve",    label: "예약",  icon: Calendar,      href: "__reserve__", highlight: true },
  { id: "more",       label: "더보기",icon: Menu,          href: "__more__" },
];

export default function Header() {
  const [scrolled, setScrolled]         = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  // 데스크탑 메가 메뉴
  const [openGroup, setOpenGroup]       = useState<string | null>(null);
  const megaRef                         = useRef<HTMLDivElement>(null);
  const closeTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 모바일 Bottom Sheet
  const [sheetOpen, setSheetOpen]       = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const sheetRef                        = useRef<HTMLDivElement>(null);
  // 언어 드롭다운
  const [langDropOpen, setLangDropOpen] = useState(false);
  const langDropRef                     = useRef<HTMLDivElement>(null);
  const langTriggerRef                  = useRef<HTMLButtonElement>(null);
  // 기타
  const pendingNavRef = useRef<{ observer: MutationObserver; timeout: ReturnType<typeof setTimeout> } | null>(null);
  const [wechatCopied, setWechatCopied] = useState(false);

  const { t, lang, setLang } = useLang();
  const [location] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isHome  = location === "/" || location === "/en" || location === "/ja" || location === "/zh";

  const { chatUrl: rawChatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const WECHAT_ID   = "star2006beauty";
  const chatUrl     = isZH ? "#" : rawChatUrl;
  const NAVER_MAP_URL = "https://map.naver.com/p/search/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC%20%EC%84%9C%EB%A9%B4";
  const reserveUrl  = isZH ? CHAT_URLS.lineZH : isJA ? CHAT_URLS.lineJA : NAVER_MAP_URL;

  const langOptions: { lang: Lang; label: string; flag: string }[] = [
    { lang: "ko", label: "한국어", flag: "🇰🇷" },
    { lang: "en", label: "English", flag: "🇺🇸" },
    { lang: "ja", label: "日本語", flag: "🇯🇵" },
    { lang: "zh", label: "中文",   flag: "🇨🇳" },
  ];
  const currentLangOption = langOptions.find(o => o.lang === lang) || langOptions[0];

  // ── locale-aware 경로 빌더 ────────────────────────────────────────────────
  const buildLocalizedPath = useCallback((targetLang: Lang): string => {
    const LANG_PREFIXES = ["/en", "/ja", "/zh"];
    let stripped = location;
    for (const prefix of LANG_PREFIXES) {
      if (stripped === prefix || stripped.startsWith(prefix + "/")) {
        stripped = stripped.slice(prefix.length) || "/";
        break;
      }
    }
    if (targetLang === "ko" && (stripped === "/foreign-guide" || stripped.startsWith("/foreign-guide/"))) {
      return "/";
    }
    const prefix = targetLang === "ko" ? "" : `/${targetLang}`;
    return (prefix + (stripped === "/" ? "" : stripped)) || "/";
  }, [location]);

  const handleLangChange = (option: typeof langOptions[0]) => {
    setLangDropOpen(false);
    const hash = window.location.hash;
    window.location.href = buildLocalizedPath(option.lang) + hash;
  };

  // ── 스크롤 감지 ──────────────────────────────────────────────────────────
  useEffect(() => {
    const sectionIds = ["home", "events", "doctors", "treatments", "about", "facility", "contact"];
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (!isHome) return;
      const offset = 100;
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => { if (!isHome) setActiveSection(""); }, [isHome]);

  // ── 메가 메뉴 외부 클릭 닫기 ─────────────────────────────────────────────
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ── 언어 드롭다운 외부 클릭 닫기 ─────────────────────────────────────────
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) {
        setLangDropOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // ── 언어 드롭다운 ESC ────────────────────────────────────────────────────
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

  // ── Bottom Sheet ESC + focus trap ────────────────────────────────────────
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
      if (e.key !== "Tab" || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen]);

  useEffect(() => {
    if (sheetOpen) {
      requestAnimationFrame(() => sheetRef.current?.querySelector<HTMLElement>("button")?.focus());
    }
  }, [sheetOpen]);

  // ── Bottom Sheet 열기/닫기 ────────────────────────────────────────────────
  const openSheet = () => { setSheetOpen(true); setSheetVisible(true); };
  const closeSheet = () => {
    setSheetClosing(true);
    setSheetVisible(false);
    setTimeout(() => { setSheetClosing(false); setSheetOpen(false); }, 220);
  };

  // ── 네비게이션 클릭 핸들러 ────────────────────────────────────────────────
  const handleNavClick = useCallback((href: string) => {
    setOpenGroup(null);
    closeSheet();

    if (pendingNavRef.current) {
      pendingNavRef.current.observer.disconnect();
      clearTimeout(pendingNavRef.current.timeout);
      pendingNavRef.current = null;
    }

    const getLocalizedPath = () => getLocaleBase(location);
    const getHeaderOffset = () => {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      return header ? header.offsetHeight + 8 : 72;
    };

    if (href.startsWith("/")) {
      const basePath = getLocalizedPath();
      // /equipment2?category=xxx 등 쿼리 파라미터 포함 경로 처리
      const fullPath = basePath !== "/" ? `${basePath}${href}` : href;
      window.location.href = fullPath;
      return;
    }

    const currentPathname = window.location.pathname;
    const isCurrentHome =
      currentPathname === "/" ||
      currentPathname === "/en" || currentPathname === "/ja" || currentPathname === "/zh";

    if (isCurrentHome) {
      const basePath = getLocalizedPath();
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", basePath);
        return;
      }
      const scrollToEl = (el: Element) => {
        const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
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
      const timeout = setTimeout(() => { observer.disconnect(); pendingNavRef.current = null; }, 3000);
      pendingNavRef.current = { observer, timeout };
      history.replaceState(null, "", basePath + href);
      return;
    }

    const basePath = getLocalizedPath();
    window.location.href = href === "#home" ? basePath : `${basePath}${href}`;
  }, [location]);

  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };

  const isActive = (href: string) => {
    if (href.startsWith("/")) return location === href;
    return isHome && activeSection === href.replace("#", "");
  };

  // 메가 메뉴 hover 딜레이 처리
  const handleGroupEnter = (id: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpenGroup(id);
  };
  const handleGroupLeave = () => {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 120);
  };

  const visibleGroups = NAV_GROUPS.filter(g => !g.hidden || isAdmin);

  // ── 렌더 ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ════════════════ HEADER ════════════════ */}
      <header
        role="banner"
        aria-label="사이트 헤더"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: scrolled ? "56px" : "72px",
          backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "blur(12px)",
          boxShadow: scrolled
            ? "0 2px 24px rgba(0,0,0,0.10)"
            : "0 1px 0 rgba(0,0,0,0.06)",
          backgroundImage: scrolled
            ? "linear-gradient(rgba(255,255,255,0.97), rgba(255,255,255,0.97)), linear-gradient(90deg, transparent 0%, #C9A84C 30%, #F5D78E 50%, #C9A84C 70%, transparent 100%)"
            : "linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95))",
          backgroundOrigin: "border-box",
          backgroundClip: scrolled ? "padding-box, border-box" : "padding-box",
          borderBottom: scrolled ? "2px solid transparent" : "none",
        }}
      >
        <div className="h-full flex items-center" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.25rem", width: "100%" }}>

          {/* Logo */}
          <button type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center group flex-shrink-0"
            aria-label="홈으로 이동"
          >
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#d2ac67", letterSpacing: "0.5px" }}>
              STAR DERMATOLOGY
            </span>
          </button>

          {/* ── 데스크탑 메가 메뉴 ── */}
          <nav
            ref={megaRef}
            className="hidden md:flex items-center flex-1 justify-center"
            style={{ gap: "2px" }}
            role="navigation"
            aria-label="메인 네비게이션"
          >
            {visibleGroups.map((group) => {
              const isGroupActive = group.children
                ? group.children.some(c => isActive(c.href))
                : (group.href ? isActive(group.href) : false);
              const isOpen = openGroup === group.id;
              const Icon = group.icon;

              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => group.children ? handleGroupEnter(group.id) : undefined}
                  onMouseLeave={() => group.children ? handleGroupLeave() : undefined}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (group.children) {
                        setOpenGroup(isOpen ? null : group.id);
                      } else if (group.href) {
                        handleNavClick(group.href);
                      }
                    }}
                    aria-haspopup={group.children ? "true" : undefined}
                    aria-expanded={group.children ? isOpen : undefined}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
                    style={{
                      fontSize: "14px",
                      fontWeight: isGroupActive || isOpen ? "600" : "400",
                      color: isGroupActive || isOpen ? "#C9A84C" : "#4f4f4f",
                      background: isOpen ? "rgba(201,168,76,0.07)" : "transparent",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {group.label}
                    {group.children && (
                      <ChevronDown
                        size={13}
                        style={{
                          color: "#999",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    )}
                  </button>

                  {/* 드롭다운 패널 */}
                  {group.children && isOpen && (
                    <div
                      className="absolute top-full left-1/2 mt-1 rounded-2xl shadow-2xl overflow-hidden"
                      style={{
                        transform: "translateX(-50%)",
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.08)",
                        minWidth: group.id === "treatments" ? "520px" : "220px",
                        zIndex: 200,
                        animation: "megaFadeIn 0.15s ease",
                      }}
                      onMouseEnter={() => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } }}
                      onMouseLeave={handleGroupLeave}
                    >
                      {/* 드롭다운 헤더 */}
                      <div
                        className="px-5 pt-4 pb-2 border-b"
                        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(201,168,76,0.03)" }}
                      >
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em" }}>
                          {group.labelEn}
                        </p>
                      </div>

                      {/* 드롭다운 항목 */}
                      <div
                        className={group.id === "treatments" ? "grid grid-cols-2 gap-0 p-3" : "flex flex-col p-2"}
                      >
                        {group.children.map((child) => (
                          <button
                            type="button"
                            key={child.label}
                            onClick={() => handleNavClick(child.href)}
                            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-150 hover:bg-gray-50 group/item"
                            style={{ fontSize: "13.5px", color: isActive(child.href) ? "#C9A84C" : "#333", fontWeight: isActive(child.href) ? 600 : 400 }}
                          >
                            <span className="flex items-center gap-2">
                              {child.icon && <child.icon size={14} style={{ color: "#aaa" }} />}
                              {child.label}
                            </span>
                            <span className="flex items-center gap-1.5">
                              {child.badge && (
                                <span
                                  className="text-white rounded-full px-1.5 py-0.5"
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    letterSpacing: "0.05em",
                                    background: child.badge === "NEW" ? "#C9A84C" : "#ef4444",
                                  }}
                                >
                                  {child.badge}
                                </span>
                              )}
                              <ChevronRight size={12} style={{ color: "#ccc" }} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 언어 드롭다운 — 데스크탑 */}
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

          {/* CTA — 데스크탑 */}
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

          {/* 모바일: 언어 버튼만 헤더에 표시 (탭바가 주 네비게이션) */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <button type="button"
              onClick={() => setLangDropOpen(!langDropOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
              style={{ fontSize: "12px", color: "#4f4f4f", border: "1px solid rgba(0,0,0,0.12)", background: "white" }}
              aria-label="언어 선택"
            >
              <span>{currentLangOption.flag}</span>
              <ChevronDown size={11} style={{ color: "#888" }} />
            </button>
            {langDropOpen && (
              <div
                className="absolute top-14 right-4 rounded-xl shadow-xl overflow-hidden z-50"
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.1)", minWidth: "140px" }}
              >
                {langOptions.map((option) => (
                  <button type="button"
                    key={option.lang}
                    onClick={() => { setLangDropOpen(false); const hash = window.location.hash; window.location.href = buildLocalizedPath(option.lang) + hash; }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                    style={{ fontSize: "13px", color: option.lang === lang ? "#C9A84C" : "#333", fontWeight: option.lang === lang ? 600 : 400 }}
                  >
                    <span style={{ fontSize: "16px" }}>{option.flag}</span>
                    <span>{option.label}</span>
                    {option.lang === lang && <span style={{ marginLeft: "auto", color: "#C9A84C", fontSize: "12px" }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ════════════════ 모바일 하단 탭바 ════════════════ */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="하단 탭 네비게이션"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-center justify-around" style={{ height: "60px" }}>
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = tab.id !== "more" && tab.id !== "reserve" && isActive(tab.href);

            if (tab.href === "__reserve__") {
              return (
                <a
                  key={tab.id}
                  href={reserveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative"
                  aria-label="예약하기"
                >
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #03C75A, #02a84a)", boxShadow: "0 4px 14px rgba(3,199,90,0.4)", marginTop: "-12px" }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: "#03C75A", marginTop: "2px" }}>{tab.label}</span>
                </a>
              );
            }

            if (tab.href === "__more__") {
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={openSheet}
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
                  aria-label="더보기 메뉴"
                  aria-expanded={sheetOpen}
                >
                  <Icon size={22} style={{ color: sheetOpen ? "#C9A84C" : "#888" }} />
                  <span style={{ fontSize: "10px", fontWeight: sheetOpen ? 700 : 500, color: sheetOpen ? "#C9A84C" : "#888" }}>{tab.label}</span>
                </button>
              );
            }

            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => handleNavClick(tab.href)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
                aria-label={tab.label}
              >
                <Icon size={22} style={{ color: isTabActive ? "#C9A84C" : "#888" }} />
                <span style={{ fontSize: "10px", fontWeight: isTabActive ? 700 : 500, color: isTabActive ? "#C9A84C" : "#888" }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ════════════════ Bottom Sheet 딤 배경 ════════════════ */}
      {sheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 transition-all duration-220"
          style={{
            background: (sheetVisible || sheetClosing) ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
            backdropFilter: (sheetVisible || sheetClosing) ? "blur(3px)" : "none",
          }}
          onClick={closeSheet}
        />
      )}

      {/* ════════════════ Bottom Sheet 패널 ════════════════ */}
      {sheetOpen && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
          className="md:hidden fixed left-0 right-0 bottom-0 z-50 rounded-t-3xl overflow-hidden"
          style={{
            background: "white",
            maxHeight: "82vh",
            overflowY: "auto",
            transform: (sheetVisible && !sheetClosing) ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
          }}
        >
          {/* 드래그 핸들 */}
          <div className="flex justify-center pt-3 pb-1">
            <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(0,0,0,0.15)" }} />
          </div>

          {/* 시트 헤더 */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>전체 메뉴</span>
            <button type="button" onClick={closeSheet} className="p-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)", color: "#555" }}>
              <X size={18} />
            </button>
          </div>

          {/* 시트 메뉴 그룹 */}
          <div className="px-4 py-3 flex flex-col gap-1">
            {visibleGroups.map((group) => {
              const Icon = group.icon;
              if (!group.children) {
                return (
                  <button
                    type="button"
                    key={group.id}
                    onClick={() => handleNavClick(group.href!)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-colors hover:bg-gray-50"
                    style={{ color: "#222", fontSize: "15px", fontWeight: 500 }}
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "rgba(201,168,76,0.1)" }}>
                      <Icon size={18} style={{ color: "#C9A84C" }} />
                    </span>
                    {group.label}
                    <ChevronRight size={16} style={{ color: "#ccc", marginLeft: "auto" }} />
                  </button>
                );
              }
              return (
                <div key={group.id}>
                  <div className="flex items-center gap-3 px-4 pt-3 pb-1.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "rgba(201,168,76,0.1)" }}>
                      <Icon size={18} style={{ color: "#C9A84C" }} />
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#C9A84C", letterSpacing: "0.05em" }}>{group.labelEn}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-2 pb-2">
                    {group.children.map((child) => (
                      <button
                        type="button"
                        key={child.label}
                        onClick={() => handleNavClick(child.href)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-gray-50"
                        style={{ fontSize: "13.5px", color: isActive(child.href) ? "#C9A84C" : "#444", fontWeight: isActive(child.href) ? 600 : 400 }}
                      >
                        {child.label}
                        {child.badge && (
                          <span
                            className="text-white rounded-full px-1.5 py-0.5 ml-auto"
                            style={{ fontSize: "9px", fontWeight: 700, background: child.badge === "NEW" ? "#C9A84C" : "#ef4444" }}
                          >
                            {child.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 시트 CTA */}
          <div className="px-4 pb-4 pt-2 border-t flex flex-col gap-2.5" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
            <a
              href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
              className="flex items-center gap-3 py-3.5 px-4 rounded-2xl font-semibold text-sm"
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
                className="flex items-center gap-3 py-3.5 px-4 rounded-2xl font-semibold text-sm w-full"
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
              className="flex items-center gap-3 py-3.5 px-4 rounded-2xl font-semibold text-sm text-white"
              style={{ background: lang === "zh" ? "linear-gradient(135deg,#06C755,#04a843)" : "linear-gradient(135deg,#03C75A,#02a84a)" }}
            >
              <Calendar size={16} />
              {t.hero.cta_reserve}
            </a>
          </div>
        </div>
      )}

      {/* 메가 메뉴 페이드인 애니메이션 */}
      <style>{`
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
