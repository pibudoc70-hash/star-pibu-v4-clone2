/**
 * Header Component - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * 언어 전환: 헤더에서 제거 (LangSwitcher 플로팅 버튼으로 대체)
 * 활성 메뉴: 스크롤 위치 감지 → 현재 섹션 메뉴 강조
 * 모바일 메뉴: 각 항목 앞에 아이콘 추가
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Menu, X, Phone, MessageCircle, Calendar,
  Home, Info, Users, Stethoscope, Building2, MapPin, Globe,
} from "lucide-react";
import StarLogo from "./StarLogo";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { t } = useLang();
  const [location] = useLocation();
  const isHome = location === "/";
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

  // 메뉴 닫기 - 역방향 stagger 후 패널 슬라이드 아웃
  // 총 닫힘 시간: CTA(0ms) → nav 역순(30ms~345ms) → 헤더(375ms) → 패널 슬라이드(+300ms)
  const CLOSE_STAGGER_TOTAL = 375 + 220; // 마지막 항목 딜레이 + 애니메이션 지속시간
  const closeMobileMenu = () => {
    setMenuClosing(true);
    // 역방향 stagger 완료 후 패널 전체 슬라이드 아웃
    setTimeout(() => {
      setMenuVisible(false);
      setMenuClosing(false);
      setTimeout(() => setMobileOpen(false), 300);
    }, CLOSE_STAGGER_TOTAL);
  };

  // 메뉴 열기
  const openMobileMenu = () => {
    setMobileOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMenuVisible(true));
    });
  };

  // 메뉴 랜더링 로직
  const renderNavItems = navItems.filter(item => {
    // 장비2는 관리자만 보이기
    if (item.hidden && !isAdmin) return false;
    return true;
  });

  const handleNavClick = (href: string) => {
    closeMobileMenu();
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }
    if (!isHome) {
      window.location.href = href === "#home" ? "/" : `/${href}`;
      return;
    }
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // 활성 여부 판단
  const isActive = (href: string) => {
    if (href.startsWith("/")) {
      return location === href;
    }
    const sectionId = href.replace("#", "");
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
          <button
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
                <button
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

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <a
              href="https://pf.kakao.com/_HNyGC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ background: "#FEE500", color: "#1F2937", fontSize: "13px", padding: "6px 14px" }}
            >
              <MessageCircle size={13} />
              {t.hero.cta_kakao}
            </a>
            <a
              href="https://map.naver.com/p/search/%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC%20%EC%84%9C%EB%A9%B4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold rounded-full text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 whitespace-nowrap"
              style={{ background: "#03C75A", fontSize: "13px", padding: "6px 14px" }}
            >
              <Calendar size={13} />
              {t.hero.cta_reserve}
            </a>
          </div>

          {/* Mobile Hamburger + 층별 안내 */}
          <div className="md:hidden ml-auto">
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#1F2937" }}
              onClick={() => openMobileMenu()}
              aria-label="메뉴 열기"
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

          <button
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
              <button
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
            href="tel:051-818-2300"
            className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm"
            style={{ background: "rgba(0,0,0,0.04)", color: "#333", border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <Phone size={16} />
            051-818-2300
          </a>
          <a
            href="https://pf.kakao.com/_HNyGC"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm"
            style={{ background: "#FEE500", color: "#1F2937" }}
          >
            <MessageCircle size={16} />
            {t.hero.cta_kakao}
          </a>
          <a
            href="https://booking.naver.com/booking/13/bizes/1122956"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #03C75A, #02a84a)" }}
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
