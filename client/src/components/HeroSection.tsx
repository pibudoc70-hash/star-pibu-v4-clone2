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
 *
 * [R12-P1-1] 서브컴포넌트 분리:
 * - HeroOverlays: 배경 오버레이/그라디언트/글로우
 * - HeroFloorBadge: 층별 안내 텍스트
 * - HeroStatsStrip: 통계 스트립 (HeroStatItem 포함)
 * - HeroActions: CTA 버튼 그룹
 * - HeroScrollIndicator: 스크롤 인디케이터
 */
import { useRef, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { useCountUp } from "@/hooks/useCountUp";
import OptimizedImage from "@/components/OptimizedImage";
import { CLINIC_STATS, WECHAT_ID } from "@/lib/constants";
import { useClinicStats } from "@/hooks/useClinicStats";
import { useChatConfig } from "@/hooks/useChatConfig";
import GoldParticles from "@/components/hero/GoldParticles";
import { CharReveal, WordReveal } from "@/components/hero/HeroAnimations";
import { HeroDarkOverlay, HeroVignette, HeroGoldGlow } from "@/components/hero/HeroOverlays";
import { HeroFloorBadge } from "@/components/hero/HeroFloorBadge";
import { HeroStatsStrip } from "@/components/hero/HeroStatsStrip";
import { HeroActions } from "@/components/hero/HeroActions";
import { HeroScrollIndicator } from "@/components/hero/HeroScrollIndicator";

// 반응형 이미지 URL (WebP + JPEG 폴백)
const HERO_IMAGE_DESKTOP_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop_2f8a8ccf.webp";
const HERO_IMAGE_DESKTOP_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-bg-new-desktop.jpg";
const HERO_IMAGE_MOBILE_PORTRAIT_WEBP = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile_f9bea0c7.webp";
const HERO_IMAGE_MOBILE_PORTRAIT_JPG = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/hero-mobile-new-mobile.jpg";
const LOGO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/star_ai_logo_1_73172f49.png";

/**
 * [R11-C] 애니메이션 딜레이 매직넘버 → 명시적 상수
 * 파일 상단 주석의 타임라인과 1:1 대응
 */
export const HERO_DELAYS = {
  floorBadge: "1250ms",
  statBase: 1000,
  statStep: 120,
  ctaFirst: "1350ms",
  ctaSecond: "1470ms",
  ctaPhone: "1590ms",
  ctaScroll: "1700ms",
} as const;

export default function HeroSection() {
  const { t, lang } = useLang();
  const { chatUrl: rawChatUrl, reserveUrl, chatBg, chatColor, isZH } = useChatConfig();
  const chatUrl = isZH ? "#" : rawChatUrl;
  const chatShadow = isZH ? "0 4px 18px rgba(7,193,96,0.35)" : "0 4px 18px rgba(254,229,0,0.35)";
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
  const { value: count20, isDone: done20 } = useCountUp(CLINIC_STATS.yearsExperience, 2000, "", 0, statsRef, lang);
  const { value: count50, isDone: done50 } = useCountUp(CLINIC_STATS.laserTypes, 2000, "", 0, statsRef, lang);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* LCP 최적화: <picture> 태그 */}
      <picture
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ display: "block" }}
      >
        <source media="(min-width: 641px)" srcSet={HERO_IMAGE_DESKTOP_WEBP} type="image/webp" />
        <source media="(min-width: 641px)" srcSet={HERO_IMAGE_DESKTOP_JPG} type="image/jpeg" />
        <source media="(max-width: 640px)" srcSet={HERO_IMAGE_MOBILE_PORTRAIT_WEBP} type="image/webp" />
        <source media="(max-width: 640px)" srcSet={HERO_IMAGE_MOBILE_PORTRAIT_JPG} type="image/jpeg" />
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

      {/* [R12-P1-1] 오버레이 서브컴포넌트 */}
      <HeroDarkOverlay />
      <HeroVignette />
      <HeroGoldGlow />
      <GoldParticles />

      {/* [R12-P1-1] 층별 안내 서브컴포넌트 */}
      <HeroFloorBadge text={t.hero.floor} animationDelay={HERO_DELAYS.floorBadge} />

      {/* 콘텐츠 */}
      <div
        className="relative z-10 text-center flex flex-col items-center w-full"
        style={{
          maxWidth: "min(680px, 96vw)",
          padding: "0 clamp(1.25rem, 6vw, 2rem)",
          paddingTop: "141px",
          paddingBottom: "clamp(40px, 6vh, 100px)",
          boxSizing: "border-box",
          paddingRight: "35px",
          marginTop: "-47px",
        }}
      >
        {/* 로고 */}
        <div
          className="hero-fade"
          style={{
            animationDelay: "0ms",
            display: "flex",
            justifyContent: "center",
            marginBottom: "clamp(0.25rem, 1.5vh, 1.75rem)",
          }}
        >
          <div style={{ position: "relative" }}>
            <OptimizedImage
              src={LOGO_IMAGE}
              alt="스타피부과 로고"
              priority={true}
              width={220}
              height={220}
              style={{
                height: "clamp(120px, 30vw, 220px)",
                width: "clamp(120px, 30vw, 220px)",
                objectFit: "contain",
                display: "block",
                marginTop: "-31px",
              }}
            />
          </div>
        </div>

        {/* 병원명: 글자별 charReveal */}
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
          <CharReveal text={t.hero.title} startDelay={300} charGap={60} />
        </h1>

        {/* 슬로건: 단어별 wordReveal */}
        <p
          className="font-light"
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "clamp(0.85rem, 3vw, 1.45rem)",
            marginBottom: "clamp(0.2rem, 0.8vh, 0.5rem)",
            letterSpacing: "0.02em",
          }}
        >
          <WordReveal text={t.hero.subtitle} startDelay={900} wordGap={85} />
        </p>

        {/* [R12-P1-1] 통계 스트립 서브컴포넌트 */}
        <HeroStatsStrip
          statsRef={statsRef}
          stats={[
            {
              value: count20,
              unit: clinicStats.years.unit,
              label: t.about.stats[0].label,
              isDone: done20,
              animationDelay: `${HERO_DELAYS.statBase}ms`,
            },
            {
              value: count4000,
              unit: clinicStats.cases.unit,
              label: t.about.stats[1].label,
              isDone: done4000,
              animationDelay: `${HERO_DELAYS.statBase + HERO_DELAYS.statStep}ms`,
            },
            {
              value: count50,
              unit: clinicStats.types.unit,
              label: t.about.stats[2].label,
              isDone: done50,
              animationDelay: `${HERO_DELAYS.statBase + HERO_DELAYS.statStep * 2}ms`,
            },
          ]}
        />

        {/* [R12-P1-1] CTA 버튼 그룹 서브컴포넌트 */}
        <HeroActions
          lang={lang}
          t={t}
          chatUrl={chatUrl}
          reserveUrl={reserveUrl}
          chatBg={chatBg}
          chatColor={chatColor}
          chatShadow={chatShadow}
          isZH={isZH}
          wechatCopied={wechatCopied}
          onWechatClick={handleWechatClick}
          delays={{
            ctaFirst: HERO_DELAYS.ctaFirst,
            ctaSecond: HERO_DELAYS.ctaSecond,
            ctaPhone: HERO_DELAYS.ctaPhone,
          }}
        />
      </div>

      {/* [R12-P1-1] 스크롤 인디케이터 서브컴포넌트 */}
      <HeroScrollIndicator
        label={t.hero.scrollLabel}
        animationDelay={HERO_DELAYS.ctaScroll}
      />
    </section>
  );
}
