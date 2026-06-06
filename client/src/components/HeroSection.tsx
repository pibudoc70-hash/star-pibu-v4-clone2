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
import { useRef, useState } from "react";
import { MessageCircle, Calendar, ChevronDown, Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useCountUp } from "@/hooks/useCountUp";
import OptimizedImage from "@/components/OptimizedImage";
import { CLINIC_STATS, CLINIC_TEL, CLINIC_TEL_INTL } from "@/lib/constants";
import { useClinicStats } from "@/hooks/useClinicStats";
import { useChatConfig } from "@/hooks/useChatConfig";
import GoldParticles from "@/components/hero/GoldParticles";
import { CharReveal, WordReveal } from "@/components/hero/HeroAnimations";

// GoldParticles 이제 hero/GoldParticles.tsx에서 import

// 반응형 이미지 URL (WebP + JPEG 폴백)
const HERO_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop_2f8a8ccf.webp";
const HERO_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop.jpg";
const HERO_IMAGE_MOBILE_PORTRAIT_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile_f9bea0c7.webp";
const HERO_IMAGE_MOBILE_PORTRAIT_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile.jpg";
const LOGO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/star_ai_logo_1_73172f49.png";

// CharReveal, WordReveal 이제 hero/HeroAnimations.tsx에서 import

const scrollToAbout = () => {
  const el = document.querySelector("#about");
  if (el) {
    const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
    const offset = header ? header.offsetHeight + 8 : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

export default function HeroSection() {
  const { t, lang } = useLang();
  // [PROD-P4-2] useChatConfig 훅으로 인라인 URL 로직 중앙화
  const { chatUrl: rawChatUrl, reserveUrl, chatBg, chatColor, isZH } = useChatConfig();
  const WECHAT_ID = "star2006beauty";
  // 중국어일 때 위체 클립보드 복사를 위해 href="#" 유지
  const chatUrl = isZH ? "#" : rawChatUrl;
  const chatShadow = isZH ? "0 4px 18px rgba(7,193,96,0.35)" : "0 4px 18px rgba(254,229,0,0.35)";
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
  // useClinicStats Hook으로 단위 문자열 중앙화
  const clinicStats = useClinicStats();
  // 스크롤 진입 시 카운팅 애니메이션 (0 → 목표값)
  // [PROD-P1-3] 카운팅 duration 3500ms → 2000ms: rAF 루프 1.5초 단축 → 메인스레드 부담 감소
  const { value: count4000, isDone: done4000 } = useCountUp(CLINIC_STATS.eyeBagCases, 2000, "", 0, statsRef, lang);
  const { value: count20, isDone: done20 } = useCountUp(CLINIC_STATS.yearsExperience, 2000, "", 0, statsRef, lang);
  const { value: count50, isDone: done50 } = useCountUp(CLINIC_STATS.laserTypes, 2000, "", 0, statsRef, lang);
  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        minHeight: "100svh",
      }}
    >
      {/*
       * [PROD-P1-1] LCP 최적화: CSS background-image → <picture> 태그 교체
       * 이유: CSS background-image는 브라우저 프리로드 스캐너가 파싱 불가능.
       * <picture> + <img fetchPriority="high"> 는 HTML 파싱 단계에서 즉시 감지되어
       * LCP 이미지 요청이 최소 200~400ms 앞당겨짐.
       * index.html의 <link rel="preload">와 이중 보장으로 LCP 최적화.
       */}
      <picture
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ display: "block" }}
      >
        {/* 데스크탑: 641px 이상 */}
        <source
          media="(min-width: 641px)"
          srcSet={HERO_IMAGE_DESKTOP_WEBP}
          type="image/webp"
        />
        <source
          media="(min-width: 641px)"
          srcSet={HERO_IMAGE_DESKTOP_JPG}
          type="image/jpeg"
        />
        {/* 모바일: 640px 이하 */}
        <source
          media="(max-width: 640px)"
          srcSet={HERO_IMAGE_MOBILE_PORTRAIT_WEBP}
          type="image/webp"
        />
        <source
          media="(max-width: 640px)"
          srcSet={HERO_IMAGE_MOBILE_PORTRAIT_JPG}
          type="image/jpeg"
        />
        {/* fallback img — fetchPriority="high"로 LCP 우선 로드 */}
        <img
          src={HERO_IMAGE_DESKTOP_JPG}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      </picture>
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
      {/*
       * [MOB-1] 영어(85자) floor 텍스트가 whiteSpace:nowrap + 하드코딩 marginLeft:-142px로
       * 화면 밖으로 잘리는 문제 수정.
       * → whiteSpace:normal + width:90vw + text-center로 자연스럽게 줄바꿈 처리
       */}
      <p
        className="hero-fade absolute z-20 md:hidden"
        style={{
          top: "22px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.85)",
          fontSize: "10px",
          letterSpacing: "0.03em",
          animationDelay: "1250ms",
          whiteSpace: "normal",
          wordBreak: "keep-all",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          textAlign: "center",
          width: "90vw",
          lineHeight: 1.4,
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
            {/* [FM-P1-5] 1400ms → 1000ms: 히어로 진입 후 통계 등장까지 400ms 단축 */}
            <div
              className="text-center hero-fade"
              style={{ animationDelay: "1000ms" }}
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
                  /* [FM-P1-6] 0.7s → 0.5s: 카운터 완료 시 금색 전환 속도 개선 */
                  transition: "color 0.5s ease, text-shadow 0.5s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count20}<span style={{ fontSize: "65%", fontWeight: 300, opacity: 0.85 }}>{clinicStats.years.unit}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done20 ? "scaleX(1)" : "scaleX(0)",
                /* [FM-P1-6] 0.7s → 0.5s */
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
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
            {/* [FM-P1-5] 1520ms → 1120ms */}
            <div
              className="text-center hero-fade"
              style={{ animationDelay: "1120ms" }}
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
                  /* [FM-P1-6] 0.7s → 0.5s */
                  transition: "color 0.5s ease, text-shadow 0.5s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "4ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count4000}<span style={{ fontSize: "65%", fontWeight: 300, opacity: 0.85 }}>{clinicStats.cases.unit}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done4000 ? "scaleX(1)" : "scaleX(0)",
                /* [FM-P1-6] 0.7s → 0.5s */
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
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
            {/* [FM-P1-5] 1640ms → 1240ms */}
            <div
              className="text-center hero-fade hidden sm:block"
              style={{ animationDelay: "1240ms" }}
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
                  /* [FM-P1-6] 0.7s → 0.5s */
                  transition: "color 0.5s ease, text-shadow 0.5s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count50}<span style={{ fontSize: "65%", fontWeight: 300, opacity: 0.85 }}>{clinicStats.types.unit}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done50 ? "scaleX(1)" : "scaleX(0)",
                /* [FM-P1-6] 0.7s → 0.5s */
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
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
            {/* [FM-P1-5] 1640ms → 1240ms (모바일 버전) */}
            <div
              className="text-center hero-fade"
              style={{ animationDelay: "1240ms" }}
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
                  /* [FM-P1-6] 0.7s → 0.5s */
                  transition: "color 0.5s ease, text-shadow 0.5s ease",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  display: "inline-block",
                  textAlign: "right",
                }}
              >
                {count50}<span style={{ fontSize: "65%", fontWeight: 300, opacity: 0.85 }}>{clinicStats.types.unit}</span>
              </div>
              <div style={{
                height: "1.5px",
                background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                marginTop: "6px",
                transform: done50 ? "scaleX(1)" : "scaleX(0)",
                /* [FM-P1-6] 0.7s → 0.5s */
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
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
            href={lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`}
            className="hero-fade flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center w-full sm:w-auto"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.1) 100%)",
              color: "#F5D78E",
              border: "1.5px solid rgba(201,168,76,0.55)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 12px rgba(201,168,76,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
              fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
              padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
              /* [FM-P1-5] 1750ms → 1350ms */
              animationDelay: "1350ms",
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
          {/*
           * [PROD-P1-4] 모바일 CTA 순서 개선: 예약 버튼 우선 노출
           * 이유: 모바일 사용자의 주요 전환 목표는 예약. 네이버 예약 버튼을
           * 카카오 앞에 배치하여 시각적 우선순위를 사용자 의도와 일치시킴.
           */}
          <div className="flex flex-row w-full sm:w-auto" style={{ gap: "clamp(0.4rem, 1.5vw, 0.6rem)" }}>
            {/* 예약 버튼 - 모바일에서 첫 번째 (PROD-P1-4) */}
            <a
              href={reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-fade flex items-center gap-1.5 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl justify-center flex-1 sm:flex-none"
              style={{
                background: isZH ? "#06C755" : "#03C75A",
                color: "#FFFFFF",
                boxShadow: "0 4px 18px rgba(3,199,90,0.35)",
                fontSize: "clamp(0.7rem, 2.8vw, 0.85rem)",
                padding: "clamp(0.55rem, 1.8vw, 0.7rem) clamp(0.8rem, 3vw, 1.2rem)",
                animationDelay: "1470ms",
                whiteSpace: "nowrap",
                minWidth: "clamp(78px, 22vw, 130px)",
                paddingTop: '11px',
              }}
            >
              <Calendar size={14} />
              {t.hero.cta_reserve}
            </a>
            {/* 카카오/위체트 버튼 - 모바일에서 두 번째 */}
            <div className="relative hero-fade flex-1 sm:flex-none" style={{ animationDelay: "1590ms" }}>
              <a
                href={chatUrl}
                target={isZH ? undefined : "_blank"}
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
                {wechatCopied && lang === "zh" ? (t.access?.copiedLabel ?? "已复制！") : t.hero.cta_kakao}
              </a>
              {wechatCopied && lang === "zh" && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                  ID: {WECHAT_ID}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 스크롤 인디케이터 ── */}
      <button type="button"
        onClick={scrollToAbout}
        className="hero-fade absolute flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
        style={{
          bottom: "clamp(1.25rem, 3.5vh, 2.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.55)",
          /* [FM-P1-5] 2100ms → 1700ms */
          animationDelay: "1700ms", marginBottom: '-7px', marginLeft: '-20px',
        }}
        aria-label={t.hero.scrollLabel}
      >
        <span style={{ fontSize: "clamp(0.58rem, 1.4vw, 0.68rem)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {t.hero.scrollLabel}
        </span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  );
}
