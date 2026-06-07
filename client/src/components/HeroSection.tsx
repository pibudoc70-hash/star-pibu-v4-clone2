/**
 * HeroSection — STAR 피부과 (Luxury Minimal Medical Redesign)
 *
 * 디자인 원칙:
 * - 브랜드 무드 우선: 첫 화면에서 premium clinic 느낌이 먼저 전달
 * - 정보 밀도 최소화: 병원명 + 슬로건 + CTA 2개 + 통계 strip
 * - 시네마틱 오버레이: 상단 어둠 → 중앙 투명 → 하단 어둠 구조
 * - Motion system: DS.motion 토큰 기반, 등장 애니메이션 절제
 * - 통계는 Hero 하단 strip으로 분리 (정보 계층 명확화)
 *
 * 애니메이션 타임라인:
 * - 로고:       0ms
 * - 병원명:     300ms (charReveal stagger)
 * - 슬로건:     900ms (wordReveal stagger)
 * - CTA 버튼:   1200ms / 1350ms
 * - 통계 strip: 1500ms stagger
 * - 스크롤:     1700ms
 */
import { useRef, useState } from "react";
import { Calendar, ChevronDown, Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useCountUp } from "@/hooks/useCountUp";
import OptimizedImage from "@/components/OptimizedImage";
import { CLINIC_STATS, CLINIC_TEL, CLINIC_TEL_INTL, WECHAT_ID } from "@/lib/constants";
import { useClinicStats } from "@/hooks/useClinicStats";
import { useChatConfig } from "@/hooks/useChatConfig";
import GoldParticles from "@/components/hero/GoldParticles";
import { CharReveal, WordReveal } from "@/components/hero/HeroAnimations";
import { DS } from "@/components/ui/DesignSystem";

// ── 이미지 URL ─────────────────────────────────────────────────────────────────
const HERO_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop_2f8a8ccf.webp";
const HERO_IMAGE_DESKTOP_JPG  = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop.jpg";
const HERO_IMAGE_MOBILE_WEBP  = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile_f9bea0c7.webp";
const HERO_IMAGE_MOBILE_JPG   = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile.jpg";
const LOGO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/star_ai_logo_1_73172f49.png";

// ── 애니메이션 딜레이 상수 ─────────────────────────────────────────────────────
const HERO_DELAYS = {
  logo:       "0ms",
  title:      300,    // charReveal startDelay (ms)
  subtitle:   900,    // wordReveal startDelay (ms)
  ctaFirst:   "1200ms",
  ctaSecond:  "1350ms",
  statBase:   1500,   // 통계 strip 기준 (ms)
  statStep:   100,    // 통계 stagger 간격
  scroll:     "1700ms",
  floor:      "1100ms",
} as const;

const scrollToAbout = () => {
  const el = document.querySelector("#about");
  if (el) {
    const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
    const offset = header ? header.offsetHeight + 8 : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

// ── StatStrip 아이템 ────────────────────────────────────────────────────────────
interface StatStripItemProps {
  value: string | number;
  unit: string;
  label: string;
  isDone: boolean;
  delay: number;
}

function StatStripItem({ value, unit, label, isDone, delay }: StatStripItemProps) {
  return (
    <div
      className="hero-fade text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 수치 */}
      <div
        style={{
          color: isDone ? "#F5D78E" : "rgba(255,255,255,0.92)",
          fontSize: "clamp(1.05rem, 3.5vw, 1.7rem)",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          lineHeight: 1,
          transition: `color ${DS.motion.slow} ${DS.motion.ease}`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        <span style={{ fontSize: "58%", fontWeight: 300, opacity: 0.8, marginLeft: "2px" }}>
          {unit}
        </span>
      </div>
      {/* 골드 언더라인 */}
      <div
        style={{
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${DS.color.gold}, transparent)`,
          marginTop: "5px",
          transform: isDone ? "scaleX(1)" : "scaleX(0)",
          transition: `transform ${DS.motion.slow} ${DS.motion.spring}`,
          transformOrigin: "center",
        }}
      />
      {/* 레이블 */}
      <div
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.58rem, 1.4vw, 0.7rem)",
          letterSpacing: "0.06em",
          marginTop: "5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── HeroSection ────────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { t, lang } = useLang();
  const { chatUrl: rawChatUrl, reserveUrl, chatBg, chatColor, isZH, phoneHref } = useChatConfig();
  const chatUrl = isZH ? "#" : rawChatUrl;
  const [wechatCopied, setWechatCopied] = useState(false);

  const handleWechatClick = (e: React.MouseEvent) => {
    if (!isZH) return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };

  const statsRef = useRef<HTMLDivElement>(null);
  const clinicStats = useClinicStats();
  const { value: count4000, isDone: done4000 } = useCountUp(CLINIC_STATS.eyeBagCases, 2000, "", 0, statsRef, lang);
  const { value: count20,   isDone: done20   } = useCountUp(CLINIC_STATS.yearsExperience, 2000, "", 0, statsRef, lang);
  const { value: count50,   isDone: done50   } = useCountUp(CLINIC_STATS.laserTypes, 2000, "", 0, statsRef, lang);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* ── 배경 이미지 (LCP 최적화) ── */}
      <picture
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ display: "block" }}
      >
        <source media="(min-width: 641px)" srcSet={HERO_IMAGE_DESKTOP_WEBP} type="image/webp" />
        <source media="(min-width: 641px)" srcSet={HERO_IMAGE_DESKTOP_JPG}  type="image/jpeg" />
        <source media="(max-width: 640px)" srcSet={HERO_IMAGE_MOBILE_WEBP}  type="image/webp" />
        <source media="(max-width: 640px)" srcSet={HERO_IMAGE_MOBILE_JPG}   type="image/jpeg" />
        <img
          src={HERO_IMAGE_DESKTOP_JPG}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center center",
          }}
        />
      </picture>

      {/* ── 시네마틱 오버레이 — 상단/하단 어둠, 중앙 투명 ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,10,25,0.78) 0%, rgba(5,10,25,0.28) 40%, rgba(5,10,25,0.32) 60%, rgba(5,10,25,0.85) 100%)",
        }}
      />
      {/* 좌우 비네팅 */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(3,7,18,0.38) 100%)",
        }}
      />
      {/* 상단 골드 조명 glow */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%", height: "35%",
          background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.06) 55%, transparent 80%)",
          animation: "softGlow 10s ease-in-out infinite",
          mixBlendMode: "screen",
          willChange: "opacity",
        }}
      />
      <GoldParticles />

      {/* ── 층별 안내 — 모바일: 헤더 아래 중앙 ── */}
      <p
        className="hero-fade absolute z-20 md:hidden"
        style={{
          top: "22px", left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.75)",
          fontSize: "10px", letterSpacing: "0.04em",
          animationDelay: HERO_DELAYS.floor,
          whiteSpace: "normal", wordBreak: "keep-all",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          textAlign: "center", width: "90vw", lineHeight: 1.4,
        }}
      >
        {t.hero.floor}
      </p>
      {/* 층별 안내 — 데스크톱: 우상단 */}
      <p
        className="hero-fade absolute z-20 hidden md:block"
        style={{
          top: "clamp(72px, 10vh, 90px)", right: "clamp(16px, 4vw, 40px)",
          color: "rgba(255,255,255,0.6)",
          fontSize: "clamp(0.6rem, 1.4vw, 0.75rem)", letterSpacing: "0.04em",
          animationDelay: HERO_DELAYS.floor,
          whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        {t.hero.floor}
      </p>

      {/* ── 메인 콘텐츠 ── */}
      <div
        className="relative z-10 text-center flex flex-col items-center w-full"
        style={{
          maxWidth: "min(640px, 94vw)",
          padding: "0 clamp(1.25rem, 6vw, 2rem)",
          paddingTop: "clamp(100px, 18vh, 160px)",
          paddingBottom: "clamp(80px, 12vh, 140px)",
          boxSizing: "border-box",
        }}
      >
        {/* 로고 */}
        <div
          className="hero-fade"
          style={{ animationDelay: HERO_DELAYS.logo, marginBottom: "clamp(0.5rem, 2vh, 1.5rem)" }}
        >
          <OptimizedImage
            src={LOGO_IMAGE}
            alt="스타피부과 로고"
            priority={true}
            width={200}
            height={200}
            style={{
              height: "clamp(100px, 25vw, 180px)",
              width: "clamp(100px, 25vw, 180px)",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* 병원명 */}
        <h1
          className="font-bold"
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(1.2rem, 4.5vw, 2.8rem)",
            marginBottom: "clamp(0.5rem, 1.5vh, 1rem)",
            fontFamily: "'Noto Sans KR', sans-serif",
            letterSpacing: "clamp(0.06em, 1.8vw, 0.14em)",
            textShadow: "0 2px 20px rgba(0,0,0,0.35), 0 0 60px rgba(201,168,76,0.12)",
            lineHeight: 1.15,
          }}
        >
          <CharReveal text={t.hero.title} startDelay={HERO_DELAYS.title} charGap={60} />
        </h1>

        {/* 슬로건 */}
        <p
          className="font-light"
          style={{
            color: "rgba(255,255,255,0.82)",
            fontSize: "clamp(0.88rem, 2.8vw, 1.35rem)",
            marginBottom: "clamp(1.5rem, 4vh, 2.5rem)",
            letterSpacing: "0.015em",
            lineHeight: 1.6,
          }}
        >
          <WordReveal text={t.hero.subtitle} startDelay={HERO_DELAYS.subtitle} wordGap={85} />
        </p>

        {/* ── CTA 버튼 2개 ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center w-full"
          style={{ gap: "clamp(0.6rem, 2vw, 0.75rem)", maxWidth: "480px" }}
        >
          {/* Primary: 예약/채팅 */}
          <div className="relative hero-fade w-full sm:w-auto" style={{ animationDelay: HERO_DELAYS.ctaFirst }}>
            <a
              href={chatUrl}
              target={isZH ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={handleWechatClick}
              className="flex items-center gap-2 justify-center w-full sm:w-auto"
              style={{
                background: chatBg,
                color: chatColor,
                borderRadius: DS.radius.pill,
                fontWeight: 700,
                fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)",
                padding: "clamp(0.65rem, 2vw, 0.8rem) clamp(1.4rem, 4vw, 2rem)",
                boxShadow: isZH
                  ? "0 4px 20px rgba(7,193,96,0.3)"
                  : "0 4px 20px rgba(254,229,0,0.25)",
                transition: `all ${DS.motion.base} ${DS.motion.ease}`,
                whiteSpace: "nowrap",
                textDecoration: "none",
                minWidth: "clamp(140px, 40vw, 200px)",
              }}
            >
              <Calendar size={15} />
              {wechatCopied && isZH ? t.access.copiedLabel : t.hero.cta_reserve}
            </a>
            {wechatCopied && isZH && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                ID: {WECHAT_ID}
              </div>
            )}
          </div>

          {/* Secondary: 전화 */}
          <a
            href={phoneHref ?? (lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`)}
            className="hero-fade flex items-center gap-2 justify-center w-full sm:w-auto"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.9)",
              border: "1.5px solid rgba(255,255,255,0.22)",
              borderRadius: DS.radius.pill,
              backdropFilter: "blur(8px)",
              fontWeight: 600,
              fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)",
              padding: "clamp(0.65rem, 2vw, 0.8rem) clamp(1.4rem, 4vw, 2rem)",
              transition: `all ${DS.motion.base} ${DS.motion.ease}`,
              animationDelay: HERO_DELAYS.ctaSecond,
              whiteSpace: "nowrap",
              textDecoration: "none",
              minWidth: "clamp(140px, 40vw, 200px)",
            }}
          >
            <Phone size={15} />
            {t.hero.cta_call}
          </a>
        </div>
      </div>

      {/* ── 통계 Strip — Hero 하단 고정 ── */}
      <div
        ref={statsRef}
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          background: "linear-gradient(to top, rgba(3,7,18,0.82) 0%, rgba(3,7,18,0.55) 60%, transparent 100%)",
          paddingBottom: "clamp(2rem, 5vh, 3.5rem)",
          paddingTop: "clamp(2.5rem, 6vh, 4rem)",
        }}
      >
        <div
          className="flex justify-center items-end"
          style={{ gap: "clamp(1.5rem, 6vw, 4rem)" }}
        >
          <StatStripItem
            value={count20}
            unit={clinicStats.years.unit}
            label={t.about.stats[0].label}
            isDone={done20}
            delay={HERO_DELAYS.statBase}
          />
          {/* 구분선 */}
          <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.15)", alignSelf: "center" }} />
          <StatStripItem
            value={count4000}
            unit={clinicStats.cases.unit}
            label={t.about.stats[1].label}
            isDone={done4000}
            delay={HERO_DELAYS.statBase + HERO_DELAYS.statStep}
          />
          <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.15)", alignSelf: "center" }} />
          <StatStripItem
            value={count50}
            unit={clinicStats.types.unit}
            label={t.about.stats[2].label}
            isDone={done50}
            delay={HERO_DELAYS.statBase + HERO_DELAYS.statStep * 2}
          />
        </div>

        {/* 스크롤 인디케이터 */}
        <button
          type="button"
          onClick={scrollToAbout}
          className="hero-fade flex flex-col items-center gap-1 mx-auto transition-opacity hover:opacity-60"
          style={{
            color: "rgba(255,255,255,0.45)",
            marginTop: "clamp(0.75rem, 2vh, 1.25rem)",
            animationDelay: HERO_DELAYS.scroll,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={t.hero.scrollLabel}
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {t.hero.scrollLabel}
          </span>
          <ChevronDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
