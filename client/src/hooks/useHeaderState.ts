/**
 * useHeaderState
 * Header 컴포넌트의 모든 상태 및 이벤트 핸들러를 캡슐화한 훅.
 * Header.tsx에서 분리하여 단일 책임 원칙을 준수한다.
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { useChatConfig } from "@/hooks/useChatConfig";
import { Lang } from "@/lib/i18n";
import { getLocaleBase } from "../../../shared/pathUtils";
import type { NavItem as NavItemBase, LangOption as LangOptionBase } from "../../../shared/navConfig";

// re-export for backward compatibility
export type NavItem = NavItemBase;
export type LangOption = Omit<LangOptionBase, "lang"> & { lang: Lang };

export function useHeaderState() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [moreOpen, setMoreOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);

  const { t, lang, setLang } = useLang();
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isHome = location === "/" || location === "/en" || location === "/ja" || location === "/zh";

  const langDropRef = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pendingNavRef = useRef<{ observer: MutationObserver; timeout: ReturnType<typeof setTimeout> } | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const langOptions: LangOption[] = [
    { lang: "ko", label: "한국어", flag: "🇰🇷" },
    { lang: "en", label: "English", flag: "🇺🇸" },
    { lang: "ja", label: "日本語", flag: "🇯🇵" },
    { lang: "zh", label: "中文", flag: "🇨🇳" },
  ];
  const currentLangOption = langOptions.find(o => o.lang === lang) || langOptions[0];

  const { chatUrl: rawChatUrl, reserveUrl, chatBg, chatColor, isZH, phoneHref, phoneDisplay } = useChatConfig();
  const WECHAT_ID = "star2006beauty";
  const chatUrl = isZH ? "#" : rawChatUrl;

  // ── 1차 메뉴 ──────────────────────────────────────────────────────────────
  const primaryNav: NavItem[] = [
    { label: t.nav.treatments, href: "#treatments", sectionId: "treatments" },
    { label: t.nav.doctors,    href: "#doctors",    sectionId: "doctors"    },
    { label: "EVENT",          href: "#events",     sectionId: "events"     },
    { label: t.nav.about,      href: "/about",      sectionId: null         },
  ];

  // ── More 패널 항목 ─────────────────────────────────────────────────────────
  const secondaryNav: NavItem[] = [
    { label: t.nav.facility,    href: "#facility",    sectionId: "facility" },
    { label: t.nav.contact,     href: "#contact",     sectionId: "contact"  },
    { label: t.nav.foreignGuide, href: "/foreign-guide", sectionId: null   },
    { label: t.nav.research,      href: "/research",      sectionId: null   },
    ...(isAdmin ? [{ label: "주요 시술 및 장비", href: "/equipment2", sectionId: null }] : []),
  ];

  // ── URL 유틸 ──────────────────────────────────────────────────────────────
  const buildLocalizedPath = (targetLang: Lang): string => {
    const LANG_PREFIXES = ["/en", "/ja", "/zh"];
    let stripped = window.location.pathname;
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
  };

  // ── 핸들러 ────────────────────────────────────────────────────────────────
  const handleLangChange = (option: LangOption) => {
    setLangDropOpen(false);
    setLang(option.lang, true);
    const hash = window.location.hash;
    window.location.replace(buildLocalizedPath(option.lang) + hash);
  };

  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    // [P2] .catch() 추가 — HTTPS 미적용 환경·권한 거부 시 unhandled rejection 방지
    navigator.clipboard.writeText(WECHAT_ID)
      .then(() => {
        setWechatCopied(true);
        setTimeout(() => setWechatCopied(false), 2500);
      })
      .catch(() => {
        // 클립보드 접근 불가 시 조용히 무시
      });
  };

  const closeMobileMenu = (onAfterClose?: () => void) => {
    setMenuClosing(true);
    setMenuVisible(false);
    setTimeout(() => {
      setMenuClosing(false);
      setMobileOpen(false);
      onAfterClose?.();
    }, 280);
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
    if (href.startsWith("#")) {
      const basePath = getLocalizedPath();
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", basePath);
        return;
      }
      // 현재 페이지가 홈이 아닌 경우 홈으로 이동 후 해시 스크롤
      // (예: /about, /equipment2 등에서 EVENT 메뉴 클릭 시)
      if (!isHome) {
        const homePath = basePath === "/" ? "" : basePath;
        setLocation(homePath + href);
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
    // 절대 경로 (/about, /foreign-guide 등) — wouter setLocation으로 SPA 라우팅
    const basePath = getLocalizedPath();
    // basePath가 "/" 일 때 href 앞에 붙이면 "//about" 이 되므로 조건 분기
    const fullPath = basePath === "/" ? href : `${basePath}${href}`;
    setLocation(fullPath);
  };

  const isActive = (href: string, sectionId: string | null) => {
    if (href.startsWith("/")) return location === href;
    if (!sectionId) return false;
    return isHome && activeSection === sectionId;
  };

  // ── 이펙트 ────────────────────────────────────────────────────────────────
  // 드롭다운 외부 클릭 닫기
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

  // 모바일 메뉴 ESC 닫기
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeMobileMenu(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  // 모바일 메뉴 포커스 트랩
  useEffect(() => {
    if (!mobileOpen) return;
    const getFocusable = () => Array.from(
      mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
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
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [mobileOpen]);

  // 모바일 메뉴 열릴 때 첫 버튼 포커스
  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        const first = mobileMenuRef.current?.querySelector<HTMLElement>("button");
        first?.focus();
      });
    } else {
      requestAnimationFrame(() => hamburgerRef.current?.focus());
    }
  }, [mobileOpen]);

  // 언어 드롭다운 ESC 닫기
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
        if (el && el.getBoundingClientRect().top <= offset) current = id;
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

  return {
    // 상태
    scrolled, mobileOpen, menuVisible, menuClosing,
    activeSection, moreOpen, setMoreOpen,
    langDropOpen, setLangDropOpen,
    wechatCopied,
    // 데이터
    t, lang, langOptions, currentLangOption,
    chatUrl, reserveUrl, chatBg, chatColor, WECHAT_ID,
    phoneHref, phoneDisplay, isZH,
    primaryNav, secondaryNav,
    isHome,
    // Refs
    langDropRef, langTriggerRef, moreRef,
    mobileMenuRef, hamburgerRef,
    // 핸들러
    handleLangChange, handleWechatClick,
    closeMobileMenu, openMobileMenu, handleNavClick, isActive,
    buildLocalizedPath,
  };
}
