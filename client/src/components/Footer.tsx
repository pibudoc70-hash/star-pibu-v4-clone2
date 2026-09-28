/**
 * Footer - STAR 피부과
 * 디자인: 컴팩트 다크 배경, 브랜드 + SNS + 법적 정보
 * i18n: useLang으로 한/중/일 전환
 */
import { MessageCircle, Youtube, BookOpen, Instagram } from "lucide-react";
import { useLocation } from "wouter";
import { useLang } from "@/contexts/LangContext";
import { getLocaleBase } from "../../../shared/pathUtils";
import ContactSection from "@/components/ContactSection";

const sns = [
  { icon: MessageCircle, label: "KakaoTalk", href: "https://pf.kakao.com/_HNyGC", color: "#FEE500" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@starpibu", color: "#FF0000" },
  { icon: BookOpen, label: "Naver Blog", href: "https://blog.naver.com/starpibu", color: "#03C75A" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/starpibu", color: "#E1306C" },
];

interface FooterProps {
  showContactSection?: boolean;
}

export default function Footer({ showContactSection = true }: FooterProps) {
  const { t } = useLang();
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
      // [FIX] URL에 hash를 남기지 않음 — 다음 방문 시 자동 스크롤 방지
    } else {
      // lazy 섹션이 아직 DOM에 없으면 MutationObserver로 대기
      const observer = new MutationObserver(() => {
        const lazyEl = document.querySelector(href);
        if (lazyEl) {
          observer.disconnect();
          clearTimeout(timeout);
          const top2 = lazyEl.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: top2, behavior: "smooth" });
          // [FIX] URL에 hash를 남기지 않음
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      const timeout = setTimeout(() => observer.disconnect(), 3000);
      // [FIX] URL에 hash를 남기지 않음
    }
  };

  return (
    <>
      {showContactSection && <ContactSection />}
      <footer
        style={{ background: "#1A1410" }}
        className="footer-root"
      >

      {/* ── Brand bar — 로고 + 슬로건 + SNS 아이콘 한 줄 정렬 ── */}
      <div
        className="container"
        style={{
          padding: "32px 1.25rem 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          {/* 브랜드 */}
          <div>
            <h3
              style={{
                fontFamily: "'Montserrat', 'Noto Sans KR', sans-serif",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.08em",
                color: "var(--color-gold-primary)",
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
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.62)", lineHeight: "1.7" }}>
              {t.footer.bizInfo}
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => handleNavClick("/non-covered")}
              className="transition-colors hover:text-white"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.62)" }}
            >
              {t.footer.nonCovered}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("/privacy")}
              className="transition-colors hover:text-white"
              style={{ fontSize: "11px", color: "rgba(255,255,255,0.62)" }}
            >
              {t.footer.privacy}
            </button>
          </div>
        </div>
        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.62)" }}>
          {t.footer.copyright}
        </p>
      </div>
      </footer>
    </>
  );
}
