import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Menu, X, Phone, MessageCircle, Calendar } from "lucide-react";
import StarLogo from "./StarLogo";
import { useLang } from "@/contexts/useLang";
import { langCodes, Lang } from "@/lib/i18n";

const KAKAO_URL = "https://pf.kakao.com/_xkxnxmxj";
const NAVER_URL = "https://booking.naver.com/booking/13/bizes/1166145";
const PHONE = "051-818-2300";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, setLang } = useLang();
  const [location, navigate] = useLocation();
  const isHome = location === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.home, href: "/", section: "home" },
    { label: t.nav.events, href: "/events", section: "events" },
    { label: t.nav.doctors, href: "/#doctors", section: "doctors" },
    { label: t.nav.treatments, href: "/#treatments", section: "treatments" },
    { label: t.nav.about, href: "/#about", section: "about" },
    { label: t.nav.facility, href: "/#facility", section: "facility" },
    { label: t.nav.contact, href: "/directions", section: "contact" },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (isHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
      }
    } else {
      navigate(href);
    }
  };

  const langs: Lang[] = ["ko", "en", "ja", "zh"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0d1b2a]/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      {/* 상단 정보 바 */}
      <div className="hidden lg:block bg-[#0d1b2a]/80 border-b border-white/10">
        <div className="container flex justify-between items-center py-1.5 text-xs text-white/60">
          <span>부산 서면 아이온시티빌딩 4층 접수·진료 | 2층 줄기세포 연구센터</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="flex items-center gap-1 hover:text-[#c9a96e] transition-colors">
              <Phone size={11} /> {PHONE}
            </a>
            <div className="flex items-center gap-1">
              {langs.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    lang === l ? "bg-[#c9a96e] text-[#0d1b2a]" : "hover:text-[#c9a96e]"
                  }`}
                >
                  {langCodes[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="container flex items-center justify-between h-16">
        {/* 로고 */}
        <button onClick={() => handleNavClick("/")} className="focus:outline-none">
          <StarLogo />
        </button>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                (item.href === "/" && location === "/") ||
                (item.href !== "/" && location.startsWith(item.href.replace("/#", "/")))
                  ? "text-[#c9a96e]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 데스크탑 CTA 버튼 */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE500] text-[#3A1D1D] text-xs font-bold rounded-full hover:bg-[#FFD700] transition-colors"
          >
            <MessageCircle size={13} />
            {t.cta.kakao}
          </a>
          <a
            href={NAVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#03C75A] text-white text-xs font-bold rounded-full hover:bg-[#02b050] transition-colors"
          >
            <Calendar size={13} />
            {t.cta.naver}
          </a>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d1b2a]/98 backdrop-blur-md border-t border-white/10">
          <nav className="container py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-[#c9a96e] hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-[#c9a96e]"
              >
                <Phone size={15} /> {PHONE}
              </a>
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FEE500] text-[#3A1D1D] text-sm font-bold rounded-lg"
              >
                <MessageCircle size={15} /> {t.cta.kakao}
              </a>
              <a
                href={NAVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#03C75A] text-white text-sm font-bold rounded-lg"
              >
                <Calendar size={15} /> {t.cta.naver}
              </a>
            </div>
            {/* 모바일 언어 전환 */}
            <div className="flex items-center gap-2 px-4 pt-2">
              {langs.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                    lang === l ? "bg-[#c9a96e] text-[#0d1b2a]" : "text-white/60 hover:text-[#c9a96e]"
                  }`}
                >
                  {langCodes[l]}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
