/**
 * Header Component - STAR 피부과 (2025~2026 트렌드 개편)
 *
 * 데스크탑: 4그룹 메가 메뉴 드롭다운 (hover + keyboard)
 * 모바일: 하단 고정 탭바 5개 + Bottom Sheet (더보기)
 * 스크롤: 72px → 56px Shrink + backdrop-filter blur/saturate
 * 접근성: WCAG 2.1 AA — aria-haspopup, aria-expanded, ESC 닫기, focus trap, focus restore
 *
 * 기존 동작 유지:
 *   - locale-aware 언어 전환 (buildLocalizedPath)
 *   - 해시 스크롤 (MutationObserver 3초 대기)
 *   - WeChat ID 복사 토스트 (lang === "zh")
 *   - useChatConfig() 훅으로 카카오/라인/위챗 URL 분기
 *   - getLocaleBase(location) 기반 경로 계산
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  X, Phone, MessageCircle, Calendar, Home,
  Stethoscope, Sparkles, Menu, Globe, ChevronDown,
  Users, Info, Building2, MapPin,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Lang } from "@/lib/i18n";
import { getLocaleBase } from "../../../shared/pathUtils";
import { useChatConfig, CHAT_URLS } from "@/hooks/useChatConfig";

// ─── 디자인 토큰 ──────────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#F5D78E";
const GOLD_MID = "#d2ac67";
const TEXT_BASE = "#4f4f4f";
const TEXT_DARK = "#1a1a1a";

// ─── 메가 메뉴 데이터 ─────────────────────────────────────────────────────────
interface NavChild {
  label: string;
  href: string;
  badge?: string;
}
interface NavGroup {
  id: string;
  label: string;
  labelEn: string;
  icon: React.ElementType;
  href?: string;          // 단일 링크 (드롭다운 없음)
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
      { label: "Best 시술",   href: "/equipment2?category=best",      badge: "HOT" },
      { label: "리프팅·탄력", href: "/equipment2?category=lifting" },
      { label: "눈밑지방",    href: "/equipment2?category=eye" },
      { label: "색소·문신",   href: "/equipment2?category=pigment" },
      { label: "흉터·모공",   href: "/equipment2?category=scar" },
      { label: "여드름",      href: "/equipment2?category=acne_laser" },
      { label: "홍조·혈관",   href: "/equipment2?category=rosacea" },
      { label: "액취증·다한증", href: "/equipment2?category=acne" },
      { label: "손·발톱무좀", href: "/equipment2?category=fungus" },
      { label: "건선·아토피", href: "/equipment2?category=psoriasis" },
      { label: "볼륨·부스터", href: "/equipment2?category=volume" },
      { label: "보톡스·필러", href: "/equipment2?category=botox" },
    ],
  },
  {
    id: "events",
    label: "이벤트",
    labelEn: "EVENTS",
    icon: Sparkles,
    children: [
      { label: "진행 중 이벤트", href: "#events" },
      { label: "공지사항",       href: "#events" },
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
    id: "about",
    label: "병원 소개",
    labelEn: "ABOUT",
    icon: Info,
    children: [
      { label: "피부과 소개", href: "/about" },
      { label: "시설 안내",   href: "#facility" },
      { label: "오시는 길",   href: "#contact" },
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

// ─── 모바일 하단 탭바 항목 ────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { id: "home",      label: "홈",   icon: Home,        href: "#home" },
  { id: "treatment", label: "시술", icon: Stethoscope, href: "/equipment2" },
  { id: "events",    label: "이벤트", icon: Sparkles,  href: "#events" },
  { id: "reserve",   label: "예약", icon: Calendar,    href: "__reserve__", isAccent: true },
  { id: "more",      label: "더보기", icon: Menu,      href: "__more__" },
];

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function Header() {
  const [scrolled, setScrolled]           = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openDropId, setOpenDropId]       = useState<string | null>(null);
  const [sheetOpen, setSheetOpen]         = useState(false);
  const [sheetVisible, setSheetVisible]   = useState(false);
  const [langDropOpen, setLangDropOpen]   = useState(false);
  const [wechatCopied, setWechatCopied]   = useState(false);

  const { t, lang, setLang } = useLang();
  const [location] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const langDropRef    = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef       = useRef<HTMLDivElement>(null);
  const dropRefs       = useRef<Record<string, HTMLDivElement | null>>({});
  const dropTriggerRefs= useRef<Record<string, HTMLButtonElement | null>>({});
  const pendingNavRef  = useRef<{ observer: MutationObserver; timeout: ReturnType<typeof setTimeout> } | null>(null);

  const isHome = location === "/" || location === "/en" || location === "/ja" || location === "/zh";

  // ── 언어 옵션 ──
  const langOptions: { lang: Lang; label: string; flag: string }[] = [
    { lang: "ko", label: "한국어", flag: "🇰🇷" },
    { lang: "en", label: "English", flag: "🇺🇸" },
    { lang: "ja", label: "日本語", flag: "🇯🇵" },
    { lang: "zh", label: "中文",   flag: "🇨🇳" },
  ];
  const currentLangOption = langOptions.find(o => o.lang === lang) || langOptions[0];

  // ── 채팅/예약 URL ──
  const { chatUrl: rawChatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const WECHAT_ID  = "star2006beauty";
  const chatUrl    = isZH ? "#" : rawChatUrl;
  const NAVER_MAP_URL = "https://map.naver.com/p/search/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC%20%EC%84%9C%EB%A9%B4";
  const reserveUrl = isZH ? CHAT_URLS.lineZH : isJA ? CHAT_URLS.lineJA : NAVER_MAP_URL;

  // ── locale-aware 경로 빌더 ──
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
    return prefix + (stripped === "/" ? "" : stripped) || "/";
  }, [location]);

  const handleLangChange = (option: typeof langOptions[0]) => {
    setLangDropOpen(false);
    const hash = window.location.hash;
    window.location.href = buildLocalizedPath(option.lang) + hash;
  };

  // ── WeChat 복사 ──
  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };

  // ── 스크롤 감지 ──
  useEffect(() => {
    const sectionIds = ["home", "events", "doctors", "treatments", "about", "facility", "contact"];
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (!isHome) return;
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
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

  // ── 드롭다운 외부 클릭 닫기 ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideDrop = Object.values(dropRefs.current).some(r => r?.contains(target));
      const isInsideTrigger = Object.values(dropTriggerRefs.current).some(r => r?.contains(target));
      if (!isInsideDrop && !isInsideTrigger) setOpenDropId(null);
      if (langDropRef.current && !langDropRef.current.contains(target)) setLangDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── 드롭다운 ESC 닫기 ──
  useEffect(() => {
    if (!openDropId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const id = openDropId;
        setOpenDropId(null);
        requestAnimationFrame(() => dropTriggerRefs.current[id]?.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openDropId]);

  // ── 언어 드롭다운 ESC 닫기 ──
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

  // ── Bottom Sheet ESC + focus trap ──
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
      if (e.key === "Tab" && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen]);

  useEffect(() => {
    if (sheetOpen) {
      requestAnimationFrame(() => {
        const first = sheetRef.current?.querySelector<HTMLElement>("button");
        first?.focus();
      });
    }
  }, [sheetOpen]);

  // ── Bottom Sheet 열기/닫기 ──
  const openSheet = () => {
    setSheetOpen(true);
    requestAnimationFrame(() => setSheetVisible(true));
  };
  const closeSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setSheetOpen(false), 280);
  };

  // ── 네비게이션 클릭 핸들러 ──
  const handleNavClick = useCallback((href: string) => {
    setOpenDropId(null);
    closeSheet();

    if (pendingNavRef.current) {
      pendingNavRef.current.observer.disconnect();
      clearTimeout(pendingNavRef.current.timeout);
      pendingNavRef.current = null;
    }

    const getLocalizedPath = () => getLocaleBase(location);
    const getHeaderOffset  = () => {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      return header ? header.offsetHeight + 8 : 72;
    };

    if (href.startsWith("/")) {
      const basePath = getLocalizedPath();
      window.location.href = basePath !== "/" ? `${basePath}${href}` : href;
      return;
    }

    const currentPathname = window.location.pathname;
    const isCurrentHome =
      currentPathname === "/" || currentPathname === "/en" ||
      currentPathname === "/ja" || currentPathname === "/zh";

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
    window.location.href = href === "#home" ? basePath : `${basePath}${href}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // ── 활성 여부 ──
  const isActive = (href: string) => {
    if (href.startsWith("/")) return location === href || location.startsWith(href + "?");
    const sectionId = href.replace("#", "");
    return isHome && activeSection === sectionId;
  };

  const visibleGroups = NAV_GROUPS.filter(g => !g.hidden || isAdmin);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── 데스크탑/공통 헤더 ── */}
      <header
        role="banner"
        aria-label="사이트 헤더"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: scrolled ? "56px" : "72px",
          background: scrolled
            ? "rgba(255,255,255,0.96)"
            : "rgba(255,255,255,0.97)",
          backdropFilter: `blur(${scrolled ? 18 : 8}px) saturate(${scrolled ? 180 : 120}%)`,
          borderBottom: scrolled
            ? `1px solid ${GOLD}44`
            : "1px solid rgba(0,0,0,0.06)",
          boxShadow: scrolled
            ? "0 2px 20px rgba(0,0,0,0.08)"
            : "none",
        }}
      >
        <div
          className="h-full flex items-center"
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.25rem", width: "100%" }}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex items-center flex-shrink-0 focus-visible:outline-none"
            aria-label="홈으로 이동"
            style={{ outlineOffset: "3px" }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: GOLD_MID,
                letterSpacing: "0.5px",
              }}
            >
              STAR DERMATOLOGY
            </span>
          </button>

          {/* ── 데스크탑 메가 메뉴 ── */}
          <nav
            className="hidden md:flex items-center flex-1 justify-center"
            style={{ gap: "2px" }}
            role="navigation"
            aria-label="메인 네비게이션"
          >
            {visibleGroups.map((group) => {
              const hasChildren = !!group.children?.length;
              const isOpen      = openDropId === group.id;
              const active      = group.href ? isActive(group.href)
                : group.children?.some(c => isActive(c.href)) ?? false;

              return (
                <div key={group.id} style={{ position: "relative" }}>
                  {hasChildren ? (
                    /* 드롭다운 트리거 */
                    <button
                      type="button"
                      ref={el => { dropTriggerRefs.current[group.id] = el; }}
                      onClick={() => setOpenDropId(isOpen ? null : group.id)}
                      onMouseEnter={() => setOpenDropId(group.id)}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-md transition-all duration-150 whitespace-nowrap"
                      style={{
                        fontSize: "14px",
                        fontWeight: active || isOpen ? "600" : "400",
                        color: active || isOpen ? GOLD : TEXT_BASE,
                        background: isOpen ? `${GOLD}10` : "transparent",
                        letterSpacing: "-0.01em",
                      }}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={`dropdown-${group.id}`}
                    >
                      {group.label}
                      <ChevronDown
                        size={13}
                        style={{
                          color: active || isOpen ? GOLD : "#999",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </button>
                  ) : (
                    /* 단일 링크 */
                    <button
                      type="button"
                      onClick={() => handleNavClick(group.href!)}
                      className="px-3.5 py-2 rounded-md transition-all duration-150 whitespace-nowrap"
                      style={{
                        fontSize: "14px",
                        fontWeight: active ? "600" : "400",
                        color: active ? GOLD : TEXT_BASE,
                        background: active ? `${GOLD}10` : "transparent",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {group.label}
                    </button>
                  )}

                  {/* 드롭다운 패널 */}
                  {hasChildren && isOpen && (
                    <div
                      ref={el => { dropRefs.current[group.id] = el; }}
                      id={`dropdown-${group.id}`}
                      role="menu"
                      aria-label={`${group.label} 메뉴`}
                      onMouseLeave={() => setOpenDropId(null)}
                      className="absolute top-full left-0"
                      style={{
                        marginTop: "6px",
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        minWidth: group.id === "treatments" ? "520px" : "200px",
                        padding: "12px",
                        animation: "dropIn 150ms ease forwards",
                        zIndex: 200,
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: group.id === "treatments" ? "1fr 1fr" : "1fr",
                          gap: "2px",
                        }}
                      >
                        {group.children!.map((child) => (
                          <button
                            type="button"
                            key={child.href}
                            role="menuitem"
                            onClick={() => handleNavClick(child.href)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2"
                            style={{
                              fontSize: "13.5px",
                              color: TEXT_DARK,
                              fontWeight: "400",
                              letterSpacing: "-0.01em",
                              // focus ring 색상
                              ["--tw-ring-color" as string]: GOLD,
                            }}
                          >
                            <span style={{ flex: 1 }}>{child.label}</span>
                            {child.badge && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  color: child.badge === "HOT" ? "#ef4444" : GOLD,
                                  background: child.badge === "HOT" ? "#fef2f2" : `${GOLD}18`,
                                  padding: "1px 6px",
                                  borderRadius: "999px",
                                  letterSpacing: "0.03em",
                                }}
                              >
                                {child.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── 언어 드롭다운 (데스크탑) ── */}
          <div
            className="hidden md:flex items-center mr-2 flex-shrink-0"
            ref={langDropRef}
            style={{ position: "relative" }}
          >
            <button
              type="button"
              ref={langTriggerRef}
              onClick={() => setLangDropOpen(!langDropOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-gray-100"
              style={{
                fontSize: "13px",
                color: TEXT_BASE,
                border: "1px solid rgba(0,0,0,0.12)",
                background: langDropOpen ? "#f5f5f5" : "white",
              }}
              aria-label="언어 선택"
              aria-expanded={langDropOpen}
              aria-haspopup="listbox"
            >
              <Globe size={13} style={{ color: "#888" }} />
              <span>{currentLangOption.flag}</span>
              <span style={{ fontWeight: 500 }}>{currentLangOption.label}</span>
              <ChevronDown
                size={12}
                style={{
                  color: "#888",
                  transform: langDropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
            {langDropOpen && (
              <div
                role="listbox"
                aria-label="언어 목록"
                aria-activedescendant={`lang-option-${lang}`}
                className="absolute top-full mt-1.5 right-0 rounded-xl shadow-xl overflow-hidden"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.1)",
                  minWidth: "140px",
                  zIndex: 200,
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
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                    style={{
                      fontSize: "13px",
                      color: option.lang === lang ? GOLD : "#333",
                      fontWeight: option.lang === lang ? 600 : 400,
                      background: option.lang === lang ? `${GOLD}10` : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{option.flag}</span>
                    <span>{option.label}</span>
                    {option.lang === lang && (
                      <span style={{ marginLeft: "auto", color: GOLD, fontSize: "12px" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── CTA 버튼 (데스크탑) ── */}
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
              style={{
                background: "linear-gradient(135deg, #03C75A, #02a84a)",
                boxShadow: "0 2px 8px rgba(3,199,90,0.35)",
                fontSize: "13px",
                padding: "6px 14px",
              }}
            >
              <Calendar size={13} />
              {t.hero.cta_reserve}
            </a>
          </div>

          {/* ── 모바일: 로고 우측 언어 버튼만 표시 ── */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            <div ref={langDropRef} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setLangDropOpen(!langDropOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
                style={{
                  fontSize: "12px",
                  color: TEXT_BASE,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                }}
                aria-label="언어 선택"
                aria-expanded={langDropOpen}
                aria-haspopup="listbox"
              >
                <Globe size={12} style={{ color: "#888" }} />
                <span>{currentLangOption.flag}</span>
              </button>
              {langDropOpen && (
                <div
                  role="listbox"
                  className="absolute top-full mt-1.5 right-0 rounded-xl shadow-xl overflow-hidden"
                  style={{
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.1)",
                    minWidth: "130px",
                    zIndex: 200,
                  }}
                >
                  {langOptions.map((option) => (
                    <button
                      type="button"
                      key={option.lang}
                      role="option"
                      aria-selected={option.lang === lang}
                      onClick={() => handleLangChange(option)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50"
                      style={{
                        fontSize: "13px",
                        color: option.lang === lang ? GOLD : "#333",
                        fontWeight: option.lang === lang ? 600 : 400,
                      }}
                    >
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── 모바일 하단 고정 탭바 ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="모바일 하단 네비게이션"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(16px) saturate(160%)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          height: "calc(60px + env(safe-area-inset-bottom, 0px))",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="w-full flex items-center justify-around" style={{ height: "60px" }}>
          {BOTTOM_TABS.map((tab) => {
            const Icon = tab.icon;
            const isReserve = tab.id === "reserve";
            const isMore    = tab.id === "more";

            if (isReserve) {
              return (
                <a
                  key={tab.id}
                  href={reserveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center"
                  style={{ flex: 1 }}
                  aria-label="예약하기"
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #03C75A, #02a84a)",
                      boxShadow: "0 4px 12px rgba(3,199,90,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "-12px",
                    }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  <span style={{ fontSize: "10px", color: "#03C75A", fontWeight: 700, marginTop: "2px" }}>
                    {tab.label}
                  </span>
                </a>
              );
            }

            if (isMore) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={openSheet}
                  className="flex flex-col items-center justify-center gap-0.5"
                  style={{ flex: 1, color: sheetOpen ? GOLD : "#888" }}
                  aria-label="더보기 메뉴 열기"
                  aria-expanded={sheetOpen}
                  aria-haspopup="dialog"
                >
                  <Icon size={22} />
                  <span style={{ fontSize: "10px", fontWeight: sheetOpen ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleNavClick(tab.href)}
                className="flex flex-col items-center justify-center gap-0.5"
                style={{ flex: 1, color: "#888" }}
                aria-label={tab.label}
              >
                <Icon size={22} />
                <span style={{ fontSize: "10px", fontWeight: 500 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom Sheet 딤 배경 ── */}
      {sheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 transition-opacity duration-280"
          style={{
            background: "rgba(0,0,0,0.5)",
            opacity: sheetVisible ? 1 : 0,
            backdropFilter: "blur(2px)",
          }}
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      {/* ── Bottom Sheet 패널 ── */}
      {sheetOpen && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
          className="md:hidden fixed left-0 right-0 bottom-0 z-50 overflow-y-auto transition-transform duration-280"
          style={{
            background: "#FAFAFA",
            borderRadius: "20px 20px 0 0",
            maxHeight: "85vh",
            transform: sheetVisible ? "translateY(0)" : "translateY(100%)",
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.15)",
          }}
        >
          {/* 드래그 핸들 + 닫기 */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div
              style={{
                width: "40px",
                height: "4px",
                borderRadius: "2px",
                background: "rgba(0,0,0,0.15)",
                margin: "0 auto",
              }}
            />
            <button
              type="button"
              onClick={closeSheet}
              className="p-2 rounded-full"
              style={{ color: "#666", background: "rgba(0,0,0,0.06)", marginLeft: "auto" }}
              aria-label="메뉴 닫기"
            >
              <X size={18} />
            </button>
          </div>

          {/* 그룹별 메뉴 */}
          <div className="px-4 pb-2">
            {visibleGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.id} className="mb-4">
                  {/* 그룹 헤더 */}
                  <div
                    className="flex items-center gap-2 mb-2 px-1"
                    style={{ color: "#999", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}
                  >
                    <Icon size={13} />
                    <span>{group.label.toUpperCase()}</span>
                  </div>
                  {/* 서브메뉴 그리드 */}
                  {group.children ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: group.id === "treatments" ? "1fr 1fr" : "1fr",
                        gap: "4px",
                      }}
                    >
                      {group.children.map((child) => (
                        <button
                          type="button"
                          key={child.href}
                          onClick={() => handleNavClick(child.href)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left"
                          style={{
                            fontSize: "13.5px",
                            color: TEXT_DARK,
                            background: "white",
                            border: "1px solid rgba(0,0,0,0.06)",
                            fontWeight: "400",
                          }}
                        >
                          <span style={{ flex: 1 }}>{child.label}</span>
                          {child.badge && (
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 700,
                                color: child.badge === "HOT" ? "#ef4444" : GOLD,
                                background: child.badge === "HOT" ? "#fef2f2" : `${GOLD}18`,
                                padding: "1px 5px",
                                borderRadius: "999px",
                              }}
                            >
                              {child.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavClick(group.href!)}
                      className="w-full flex items-center px-3 py-2.5 rounded-xl text-left"
                      style={{
                        fontSize: "13.5px",
                        color: TEXT_DARK,
                        background: "white",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {group.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 언어 선택 */}
          <div className="px-4 pb-2 border-t pt-4" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
            <p className="text-xs font-bold mb-2.5 px-1" style={{ color: "#999", letterSpacing: "0.05em" }}>LANGUAGE</p>
            <div className="grid grid-cols-4 gap-2">
              {langOptions.map((option) => (
                <button
                  type="button"
                  key={option.lang}
                  onClick={() => {
                    closeSheet();
                    setTimeout(() => {
                      const hash = window.location.hash;
                      window.location.href = buildLocalizedPath(option.lang) + hash;
                    }, 100);
                  }}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
                  style={{
                    background: option.lang === lang ? `${GOLD}18` : "rgba(0,0,0,0.04)",
                    border: option.lang === lang ? `1.5px solid ${GOLD}` : "1.5px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{option.flag}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: option.lang === lang ? 700 : 500,
                      color: option.lang === lang ? GOLD : "#555",
                    }}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="px-4 pt-4 border-t flex flex-col gap-2.5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
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
              style={{ background: "linear-gradient(135deg, #03C75A, #02a84a)", boxShadow: "0 2px 8px rgba(3,199,90,0.35)" }}
            >
              <Calendar size={16} />
              {t.hero.cta_reserve}
            </a>
          </div>
        </div>
      )}

      {/* ── 드롭다운 애니메이션 keyframes ── */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* focus-visible 링 — 골드 색상 */
        button:focus-visible, a:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
