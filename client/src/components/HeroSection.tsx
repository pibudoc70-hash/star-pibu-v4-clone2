/**
 * HeroSection - STAR 피부과
 *
 * 애니메이션 시스템:
 * - 로고: heroFadeUp (0.0s)
 * - 병원명 "스타피부과": 글자별 charReveal stagger (0.3s~)
 * - 개원 배지: heroFadeUp (0.75s)
 * - 슬로건 단어별: wordReveal stagger (0.9s~)
 * - 층별 안내: heroFadeUp (1.25s)
 * - 수치 통계: heroFadeUp stagger (1.4s~)
 * - CTA 버튼: heroFadeUp stagger (1.7s~)
 * - 스크롤 인디케이터: heroFadeUp (2.1s)
 *
 * 모두 cubic-bezier(0.16, 1, 0.3, 1) spring easing — 팝업/섹션과 동일
 */
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Calendar, ChevronDown, Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useCountUp } from "@/hooks/useCountUp";
import OptimizedImage from "@/components/OptimizedImage";
import { CLINIC_STATS, STAT_UNITS, type StatLang } from "@/lib/constants";

/** 금색 빛 가루 파티클 Canvas 컴포넌트 */
function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // prefers-reduced-motion: 모션 감소 설정 시 파티클 비활성화
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    const PARTICLE_COUNT = 80;

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      opacityTarget: number;
      opacitySpeed: number;
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const mkParticle = (forceBottom = false): Particle => ({
      x: Math.random() * canvas.width,
      y: forceBottom ? canvas.height + Math.random() * 60 : Math.random() * canvas.height,
      size: 0.6 + Math.random() * 1.2,          // 0.6 ~ 1.8px
      speedY: -(0.18 + Math.random() * 0.33),   // 위로 천천히 (1.5배 속도)
      speedX: (Math.random() - 0.5) * 0.12,     // 좌우 미세 흔들림
      opacity: 0,
      opacityTarget: 0.12 + Math.random() * 0.12, // 최대 12~24%
      opacitySpeed: 0.002 + Math.random() * 0.003,
    });

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      mkParticle(false)
    );

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        // opacity fade in/out
        if (p.opacity < p.opacityTarget) p.opacity = Math.min(p.opacity + p.opacitySpeed, p.opacityTarget);
        else p.opacity = Math.max(p.opacity - p.opacitySpeed * 0.6, 0);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 172, 80, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // 화면 위로 벗어나면 하단에서 재시작
        if (p.y < -10) {
          Object.assign(p, mkParticle(true));
        }
      }
      if (isRunning) animId = requestAnimationFrame(draw);
    };
    draw();

    // 탭 비활성화 시 RAF 중단 → 배터리/CPU 절약
    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        isRunning = true;
        draw();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", zIndex: 3 }}
    />
  );
}

// 반응형 이미지 URL (WebP + JPEG 폴백)
const HERO_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop_2f8a8ccf.webp";
const HERO_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop.jpg";
const HERO_IMAGE_MOBILE_PORTRAIT_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile_f9bea0c7.webp";
const HERO_IMAGE_MOBILE_PORTRAIT_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile.jpg";
const LOGO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/star_ai_logo_1_73172f49.png";

/** 문자열을 글자 단위로 분해하여 <span> 배열 반환 */
function CharReveal({
  text,
  startDelay = 0,
  charGap = 55,
  className = "",
  style = {},
}: {
  text: string;
  startDelay?: number;
  charGap?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ animationDelay: `${startDelay + i * charGap}ms`, fontWeight: '600' }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/** 문자열을 공백 기준으로 단어 분해하여 <span> 배열 반환 */
function WordReveal({
  text,
  startDelay = 0,
  wordGap = 90,
  className = "",
  style = {},
}: {
  text: string;
  startDelay?: number;
  wordGap?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline", ...style }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block" }}>
          <span
            className="hero-word"
            style={{ animationDelay: `${startDelay + i * wordGap}ms`, fontWeight: '100' }}
          >
            {word}
          </span>
          {i < words.length - 1 && (
            <span
              className="hero-word"
              style={{ animationDelay: `${startDelay + i * wordGap}ms` }}
            >
              &nbsp;
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

const scrollToAbout = () => {
  const el = document.querySelector("#about");
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

export default function HeroSection() {
  const { t, lang } = useLang();
  const WECHAT_ID = "star2006beauty";
  const chatUrl = lang === "zh" ? "#" : "https://pf.kakao.com/_HNyGC";
  const reserveUrl = lang === "zh" ? "https://line.me/ti/p/~star2006derm" : lang === "ja" ? "https://lin.ee/tyuRdUc" : "https://booking.naver.com/booking/13/bizes/209080";
  const chatBg = lang === "zh" ? "#07C160" : "#FEE500";
  const chatColor = lang === "zh" ? "white" : "#1F2937";
  const chatShadow = lang === "zh" ? "0 4px 18px rgba(7,193,96,0.35)" : "0 4px 18px rgba(254,229,0,0.35)";
  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (lang !== "zh") return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID).then(() => {
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    });
  };
  // 통계 섹션 IntersectionObserver ref
  const statsRef = useRef<HTMLDivElement>(null);
  // constants.ts 단일 소스에서 통계 수치 직접 참조
  // 스크롤 진입 시 카운팅 애니메이션 (0 → 목표값)
  const { value: count4000, isDone: done4000 } = useCountUp(CLINIC_STATS.eyeBagCases, 3500, "", 0, statsRef);
  const { value: count20, isDone: done20 } = useCountUp(CLINIC_STATS.yearsExperience, 3500, "", 0, statsRef);
  const { value: count50, isDone: done50 } = useCountUp(CLINIC_STATS.laserTypes, 3500, "", 0, statsRef);
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: "100svh",
      }}
    >
      {/* 배경 이미지 - 데스크톱: 가로형, 모바일: 세로형 */}
      {/* 데스크톱 배경 (641px 이상) - 반응형 WebP 이미지 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-no-repeat hidden sm:block"
        style={{
          backgroundImage: `url(${HERO_IMAGE_DESKTOP_WEBP}), url(${HERO_IMAGE_DESKTOP_JPG})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backfaceVisibility: "hidden",
        }}
      />
      {/* 모바일 배경 (640px 이하) - 반응형 WebP 이미지, 중앙 포커스 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-no-repeat sm:hidden"
        style={{
          backgroundImage: `url(${HERO_IMAGE_MOBILE_PORTRAIT_WEBP}), url(${HERO_IMAGE_MOBILE_PORTRAIT_JPG})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backfaceVisibility: "hidden",
        }}
      />
      {/* 오버레이 - 밝은 베이지 인테리어 사진에 맞게 조정 */}
      {/* 상단·하단에 어두운 그라디언트 → 텍스트 가독성 확보, 중앙은 사진 그대로 노출 */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,18,40,0.72) 0%, rgba(10,18,40,0.38) 35%, rgba(10,18,40,0.42) 65%, rgba(10,18,40,0.80) 100%)",
        }}
      />
      {/* 좌우 비네팅 — 사진 중앙 집중 */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,10,25,0.45) 100%)", paddingTop: '7px', marginTop: '1px',
        }}
      />
      {/* 상단 조명 Soft Glow — 천장 조명의 골드빛 일렁임 */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "38%",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(210,172,103,0.9) 0%, rgba(210,172,103,0.3) 45%, transparent 75%)",
          animation: "softGlow 10s ease-in-out infinite",
          opacity: 0.15,
          mixBlendMode: "screen",
          willChange: "opacity",
        }}
      />
      {/* 금색 빛 가루 파티클 */}
      <GoldParticles />

      {/* 층별 안내 - 모바일 전용: 헤더 바로 아래 중앙 */}
      <p
        className="hero-fade absolute z-20 md:hidden"
        style={{
          top: "68px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.85)",
          fontSize: "10px",
          letterSpacing: "0.03em",
          animationDelay: "1250ms",
          whiteSpace: "nowrap",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          textAlign: "center",
          marginTop: '-46px',
          marginLeft: '-142px',
        }}
      >
        {t.hero.floor}
      </p>

      {/* 층별 안내 - 데스크톱: 우상단 고정 */}
      <p
        className="hero-fade absolute z-20 hidden md:block"
        style={{
          top: "clamp(72px, 10vh, 90px)",
          right: "clamp(16px, 4vw, 40px)",
          color: "rgba(255,255,255,0.75)",
          fontSize: "clamp(0.62rem, 1.5vw, 0.8rem)",
          letterSpacing: "0.03em",
          animationDelay: "1250ms",
          whiteSpace: "nowrap",
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        {t.hero.floor}
      </p>

      {/* 콘텐츠 */}
      <div
        className="relative z-10 text-center flex flex-col items-center w-full"
        style={{
          maxWidth: "min(680px, 96vw)",
          padding: "0 clamp(1.25rem, 6vw, 2rem)",
          paddingTop: '141px',
          paddingBottom: "clamp(40px, 6vh, 100px)",
          boxSizing: "border-box",
          paddingRight: '35px',
          marginTop: '-47px',
        }}
      >

        {/* ── 로고 (입체감 강화 + 금색 테두리) ── */}
        <div
          className="hero-fade"
          style={{
            animationDelay: "0ms",
            display: "flex",
            justifyContent: "center",
            marginBottom: "clamp(0.25rem, 1.5vh, 1.75rem)",
          }}
        >
          {/* 로고 */}
          <div style={{ position: "relative" }}>
            <OptimizedImage
              src={LOGO_IMAGE}
              alt="스타피부과 로고"
              priority={true}
              width={220}
              height={220}
              style={{
                height: 'clamp(120px, 30vw, 220px)',
                width: 'clamp(120px, 30vw, 220px)',
                objectFit: "contain",
                display: "block", marginTop: '-31px',
              }}
            />
          </div>
        </div>

        {/* ── 병원명: 글자별 charReveal ── */}
        <h1
          className="font-bold"
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(1.1rem, 4.2vw, 2.8rem)",
            marginBottom: "clamp(0.3rem, 1.2vh, 0.75rem)",
            fontFamily: "'Noto Sans KR', sans-serif",
            letterSpacing: "clamp(0.04em, 1.5vw, 0.12em)",
            textShadow: "0 3px 16px rgba(0,0,0,0.4), 0 0 40px rgba(201,168,76,0.15)",
            lineHeight: 1.2,
          }}
        >
          <CharReveal
            text={t.hero.title}
            startDelay={300}
            charGap={60}
          />
        </h1>



        {/* ── 슬로건: 단어별 wordReveal ── */}
        <p
          className="font-light"
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "clamp(0.85rem, 3vw, 1.45rem)",
            marginBottom: "clamp(0.2rem, 0.8vh, 0.5rem)",
            letterSpacing: "0.02em",
          }}
        >
          <WordReveal
            text={t.hero.subtitle}
            startDelay={900}
            wordGap={85}
          />
        </p>



        {/* ── 수치 통계: 모바일 2+1 레이아웃, 데스크탑 3열 ── */}
        <div
          ref={statsRef}
          style={{
            marginBottom: "clamp(1rem, 3vh, 2.5rem)",
            width: "100%",
          }}
        >
          {/* 데스크톱: 3열 / 모바일: 상단 2열 */}
          <div
            className="flex justify-center"
            style={{ gap: "clamp(1rem, 5vw, 3rem)", paddingTop: '30px' }}
          >
            {/* 20년+ - 첫 번째 */}
            <div
              className="text-center hero-fade"
              style={{ animationDelay: "1400ms" }}
            >
              <div
                style={{
                  color: done20 ? "#F5D78E" : "rgba(255,255,255,0.97)",
                  fontSize: "clamp(1.2rem, 4.5vw, 2.2rem)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  textShadow: done20
                    ? "0 0 20px rgba(245,215,142,0.65), 0 2px 10px rgba(0,0,0,0.4)"
                    : "0 2px 10px rgba(0,0,0,0.4)",
                  lineHeight: 1,
                  transition: "color 0.7s ease, text-shadow 0.7s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count20}<span style={{ fontSize: "50%", fontWeight: 300, opacity: 0.85 }}>{STAT_UNITS.years[lang as StatLang] ?? STAT_UNITS.years.en}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done20 ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                transformOrigin: "center",
              }} />
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(0.62rem, 1.6vw, 0.78rem)",
                  letterSpacing: "0.04em", paddingTop: '8px',
                }}
              >
                {t.about.stats[0].label}
              </div>
            </div>
            {/* 4,000회+ - 두 번째 */}
            <div
              className="text-center hero-fade"
              style={{ animationDelay: "1520ms" }}
            >
              <div
                style={{
                  color: done4000 ? "#F5D78E" : "rgba(255,255,255,0.97)",
                  fontSize: "clamp(1.2rem, 4.5vw, 2.2rem)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  textShadow: done4000
                    ? "0 0 20px rgba(245,215,142,0.65), 0 2px 10px rgba(0,0,0,0.4)"
                    : "0 2px 10px rgba(0,0,0,0.4)",
                  lineHeight: 1,
                  transition: "color 0.7s ease, text-shadow 0.7s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "4ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count4000}<span style={{ fontSize: "50%", fontWeight: 300, opacity: 0.85 }}>{STAT_UNITS.cases[lang as StatLang] ?? STAT_UNITS.cases.en}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done4000 ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                transformOrigin: "center",
              }} />
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(0.62rem, 1.6vw, 0.78rem)",
                  letterSpacing: "0.04em", paddingTop: '8px',
                }}
              >
                {t.about.stats[1].label}
              </div>
            </div>
            {/* 데스크톱에서만 3번째 통계 같은 행에 표시 */}
            <div
              className="text-center hero-fade hidden sm:block"
              style={{ animationDelay: "1640ms" }}
            >
              <div
                style={{
                  color: done50 ? "#F5D78E" : "rgba(255,255,255,0.97)",
                  fontSize: "clamp(1.2rem, 4.5vw, 2.2rem)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  textShadow: done50
                    ? "0 0 20px rgba(245,215,142,0.65), 0 2px 10px rgba(0,0,0,0.4)"
                    : "0 2px 10px rgba(0,0,0,0.4)",
                  lineHeight: 1,
                  transition: "color 0.7s ease, text-shadow 0.7s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count50}<span style={{ fontSize: "50%", fontWeight: 300, opacity: 0.85 }}>{STAT_UNITS.types[lang as StatLang] ?? STAT_UNITS.types.en}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done50 ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                transformOrigin: "center",
              }} />
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(0.62rem, 1.6vw, 0.78rem)",
                  letterSpacing: "0.04em", paddingTop: '8px',
                }}
              >
                {t.about.stats[2].label}
              </div>
            </div>
          </div>
          {/* 모바일에서만 3번째 통계 하단 중앙에 표시 */}
          <div
            className="flex justify-center sm:hidden"
            style={{ marginTop: "clamp(0.5rem, 1.5vh, 0.75rem)" }}
          >
            <div
              className="text-center hero-fade"
              style={{ animationDelay: "1640ms" }}
            >
              <div
                style={{
                  color: done50 ? "#F5D78E" : "rgba(255,255,255,0.97)",
                  fontSize: "clamp(1.2rem, 4.5vw, 2.2rem)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  textShadow: done50
                    ? "0 0 20px rgba(245,215,142,0.65), 0 2px 10px rgba(0,0,0,0.4)"
                    : "0 2px 10px rgba(0,0,0,0.4)",
                  lineHeight: 1,
                  transition: "color 0.7s ease, text-shadow 0.7s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count50}<span style={{ fontSize: "50%", fontWeight: 300, opacity: 0.85 }}>{STAT_UNITS.types[lang as StatLang] ?? STAT_UNITS.types.en}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done50 ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                transformOrigin: "center",
              }} />
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(0.62rem, 1.6vw, 0.78rem)",
                  letterSpacing: "0.04em", paddingTop: '8px',
                }}
              >
                {t.about.stats[2].label}
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA 버튼: 모바일 세로 스택 / 데스크톱 가로 일렬 ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full" style={{ gap: "clamp(1rem, 1.5vw, 0.6rem)", marginTop: '42px', maxWidth: '591px', width: '100%' }}>
          {/* 전화 버튼 - 모바일에서 전체 너비 */}
          <a
            href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
            className="hero-fade flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full sm:w-auto"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.1) 100%)",
              color: "#F5D78E",
              border: "1.5px solid rgba(201,168,76,0.55)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 12px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
              fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
              padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
              animationDelay: "1750ms",
              whiteSpace: "nowrap",
              maxWidth: "min(100%, 320px)",
              paddingRight: '19px',
              marginTop: '0px',
              marginBottom: '0px',
            }}
          >
            <Phone size={14} />
            {t.hero.cta_call}
          </a>
          {/* 카카오 + 네이버 버튼 - 모바일에서 2열, 데스크톱에서 인라인 */}
          <div className="flex flex-row w-full sm:w-auto" style={{ gap: "clamp(0.4rem, 1.5vw, 0.6rem)" }}>
            <div className="relative hero-fade flex-1 sm:flex-none" style={{ animationDelay: "1870ms" }}>
              <a
                href={chatUrl}
                target={lang === "zh" ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={handleWechatClick}
                className="flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full"
                style={{
                  background: chatBg,
                  color: chatColor,
                  boxShadow: chatShadow,
                  fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
                  padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
                  whiteSpace: "nowrap",
                  minWidth: "clamp(78px, 22vw, 130px)",
                }}
              >
                <MessageCircle size={14} />
                {wechatCopied && lang === "zh" ? "已复制!" : t.hero.cta_kakao}
              </a>
              {wechatCopied && lang === "zh" && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                  ID: {WECHAT_ID}
                </div>
              )}
            </div>
            <a
              href={reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-fade flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center flex-1 sm:flex-none"
              style={{
                background: lang === "zh" ? "#06C755" : "#03C75A",
                color: "#FFFFFF",
                boxShadow: "0 4px 18px rgba(3,199,90,0.35)",
                fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
                padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
                animationDelay: "1990ms",
                whiteSpace: "nowrap",
                minWidth: "clamp(78px, 22vw, 130px)",
                paddingTop: '11px',
              }}
            >
              <Calendar size={14} />
              {t.hero.cta_reserve}
            </a>
          </div>
        </div>
      </div>

      {/* ── 스크롤 인디케이터 ── */}
      <button
        onClick={scrollToAbout}
        className="hero-fade absolute flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
        style={{
          bottom: "clamp(1.25rem, 3.5vh, 2.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.55)",
          animationDelay: "2100ms", marginBottom: '-7px', marginLeft: '-20px',
        }}
        aria-label="아래로 스크롤"
      >
        <span style={{ fontSize: "clamp(0.58rem, 1.4vw, 0.68rem)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {t.nav.contact === "アクセス" ? "下へ" : t.nav.contact === "交通指南" ? "向下" : "Scroll"}
        </span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  );
}
