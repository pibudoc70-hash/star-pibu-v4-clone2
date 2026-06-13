/**
 * Footer - STAR 피부과
 * 디자인: 다크 네이비 배경, 빠른 링크 + SNS + 법적 정보
 * i18n: useLang으로 한/중/일 전환
 */
import { MessageCircle, Youtube, BookOpen, Instagram, Phone, MapPin, Mail, Printer } from "lucide-react";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { getLocaleBase } from "../../../shared/pathUtils";
import { CLINIC_TEL, CLINIC_TEL_INTL } from "@/lib/constants";

const sns = [
  { icon: MessageCircle, label: "KakaoTalk", href: "https://pf.kakao.com/_HNyGC", color: "#FEE500" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@starpibu", color: "#FF0000" },
  { icon: BookOpen, label: "Naver Blog", href: "https://blog.naver.com/starpibu", color: "#03C75A" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/starpibu", color: "#E1306C" },
];

export default function Footer() {
  const { t, lang } = useLang();
  const [, navigate] = useLocation();

  const handleNavClick = (href: string) => {
    // shared/pathUtils.getLocaleBase: /foreign-guide → "/en", /en/* → "/en", etc.
    const getLocalizedPath = () => getLocaleBase(window.location.pathname);
    
    // 절대 경로 링크 (/about, /equipment2 등)는 locale-aware로 처리
    if (href.startsWith("/")) {
      // S2-T6: SPA navigate로 교체 — 페이지 전체 리로드 방지
      const basePath = getLocalizedPath();
      if (basePath !== "/") {
        navigate(`${basePath}${href}`);
      } else {
        navigate(href);
      }
      return;
    }
    
    // 해시 링크 (#home, #doctors 등)는 현재 페이지 기반
    const basePath = getLocalizedPath();
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // URL 해시 업데이트 (popstate 방지)
      history.replaceState(null, "", basePath);
      return;
    }
    // Bug Fix: 헤더 높이를 동적으로 계산
    const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
    const headerOffset = header ? header.offsetHeight + 8 : 80;
    const el = document.querySelector(href);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
      // URL 해시 업데이트 (popstate 방지)
      history.replaceState(null, "", basePath + href);
    } else {
      // lazy 섹션이 아직 DOM에 없으면 MutationObserver로 대기
      const observer = new MutationObserver(() => {
        const lazyEl = document.querySelector(href);
        if (lazyEl) {
          observer.disconnect();
          clearTimeout(timeout);
          const top2 = lazyEl.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: top2, behavior: "smooth" });
          history.replaceState(null, "", basePath + href);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = setTimeout(() => observer.disconnect(), 3000);
      history.replaceState(null, "", basePath + href);
    }
  };

  // Header primaryNav + secondaryNav 순서와 일치 (일관성 유지)
  const quickLinks = [
    // 1차 메뉴
    { label: t.nav.treatments, href: "#treatments" },
    { label: t.nav.doctors,    href: "#doctors"    },
    { label: "EVENT",          href: "#events"     },
    { label: t.nav.about,      href: "/about"      },
    // 2차 메뉴 (More 패널과 동일)
    { label: t.nav.facility,   href: "#facility"   },
    { label: t.nav.contact,    href: "#contact"    },
    { label: t.nav.foreignGuide, href: "/foreign-guide" },
  ];

  // 주요 시술 목록 (언어별)
  const treatmentItems = t.treatments.categories.flatMap((c) => c.items.slice(0, 2)).slice(0, 10);



  return (
    <footer style={{ background: "#1A1410" }}>

      {/* ── Brand bar — 로고 + 슬로건 + SNS 아이콘 한 줄 정렬 ── */}
      <div
        className="container"
        style={{
          padding: "40px 1.25rem 32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          {/* 브랜드 */}
          <div>
            <h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "18px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                color: "var(--brand-gold, #C4A882)",
                marginBottom: "4px",
              }}
            >
              STAR DERMATOLOGY
            </h3>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>
              {t.footer.brandDesc}
            </p>
          </div>
          {/* SNS 아이콘 */}
          <div style={{ display: "flex", gap: "8px" }}>
            {sns.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all hover:scale-110"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  aria-label={s.label}
                  title={s.label}
                >
                  <Icon size={15} className="text-white" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3열 정보 영역 ── */}
      <div
        className="container"
        style={{
          padding: "32px 1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "32px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Quick Links */}
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "14px",
              textTransform: "uppercase",
            }}
          >
            {t.footer.quickMenu}
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {quickLinks.map((l) => (
              <li key={l.label}>
                <button
                  type="button"
                  onClick={() => handleNavClick(l.href)}
                  className="transition-colors hover:text-white"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", letterSpacing: "-0.01em" }}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Treatments */}
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "14px",
              textTransform: "uppercase",
            }}
          >
            {t.footer.mainTreatments}
          </p>
          <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {treatmentItems.slice(0, 6).map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => handleNavClick("#treatments")}
                  className="transition-colors hover:text-white"
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", letterSpacing: "-0.01em" }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "14px",
              textTransform: "uppercase",
            }}
          >
            {t.footer.contactInfo}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href={lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`}
              className="transition-colors hover:text-white"
              style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.8)", letterSpacing: "0.02em" }}
            >
              {t.footer.tel}
            </a>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>
              {t.footer.address}
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              {t.footer.subwayInfo}
            </p>
            {/* 영업시간 요약 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", paddingTop: "4px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {t.hours.rows.slice(0, 3).map((row) => (
                <p key={row.day} style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                  {row.day} {row.time}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 하단 바 — 사업자 정보 + 법적 링크 ── */}
      <div
        className="container"
        style={{
          padding: "20px 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", lineHeight: "1.7" }}>
              {t.footer.bizInfo}
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="https://www.hira.or.kr/ra/medi/getHealthCareList.do"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}
            >
              {t.footer.nonCovered}
            </a>
            <button
              type="button"
              onClick={() => handleNavClick("/privacy")}
              className="transition-colors hover:text-white"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}
            >
              {t.footer.privacy}
            </button>
          </div>
        </div>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
