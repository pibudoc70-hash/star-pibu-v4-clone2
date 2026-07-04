/**
 * HeroSection - STAR 피부과
 *
 * 모바일 레이아웃 (사진 기준):
 *   - section: height 100dvh, flex-col, justify-between
 *   - 상단 그룹: 로고(68px) + 병원명 + STAR DERMATOLOGY + 구분선 + 슬로건
 *     → 화면 상단 1/2 중앙에 배치
 *   - 하단 그룹: 통계 스트립 + 3버튼 그리드
 *     → 화면 하단에 붙어서 배치
 *
 * 데스크톱: 기존 레이아웃 유지
 */
import { useRef, useState, memo } from "react";
import { useLang } from "@/contexts/LangContext";
import { useCountUp } from "@/hooks/useCountUp";
import OptimizedImage from "@/components/OptimizedImage";
import { CLINIC_STATS, WECHAT_ID } from "@/lib/constants";
import { useClinicStats } from "@/hooks/useClinicStats";
import { useChatConfig } from "@/hooks/useChatConfig";
import { CharReveal, WordReveal } from "@/components/hero/HeroAnimations";
import { HeroBackgroundLayers } from "@/components/hero/HeroBackgroundLayers";
import { HeroFloorBadge } from "@/components/hero/HeroFloorBadge";
import { HeroStatsStrip } from "@/components/hero/HeroStatsStrip";
import { HeroActions } from "@/components/hero/HeroActions";
import { HeroScrollIndicator } from "@/components/hero/HeroScrollIndicator";
import HeroStarfield from "@/components/hero/HeroStarfield";
import { HERO_IMAGES, HERO_LOGO_IMAGE, HERO_DELAYS } from "@/components/hero/constants";
export { HERO_DELAYS } from "@/components/hero/constants";

function HeroSection() {
  const { t, lang } = useLang();
  const { chatUrl: rawChatUrl, reserveUrl, chatBg, chatColor, isZH } = useChatConfig();
  const chatUrl = isZH ? "#" : rawChatUrl;
  const chatShadow = isZH ? "0 4px 18px rgba(7,193,96,0.35)" : "0 4px 18px rgba(254,229,0,0.35)";
  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (!isZH) return;
    e.preventDefault();
    navigator.clipboard.writeText(WECHAT_ID)
      .then(() => {
        setWechatCopied(true);
        setTimeout(() => setWechatCopied(false), 2500);
      })
      .catch(() => {});
  };

  const statsRef = useRef<HTMLDivElement>(null);
  const clinicStats = useClinicStats();
  const { value: count4000, isDone: done4000 } = useCountUp(CLINIC_STATS.eyeBagCases, 900, "", 0, statsRef, lang);
  const { value: count20, isDone: done20 } = useCountUp(CLINIC_STATS.yearsExperience, 900, "", 0, statsRef, lang);
  const { value: count50, isDone: done50 } = useCountUp(CLINIC_STATS.laserTypes, 900, "", 0, statsRef, lang);

  type StatItem = { value: string; unit: string; label: string; isDone: boolean; animationDelay: string };
  const statsData: [StatItem, StatItem, StatItem] = [
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
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden hero-section-root"
    >
      {/* ── 배경 레이어 ── */}
      {/* 데스크톱: 이미지 배경 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        <picture aria-hidden="true" className="absolute inset-0 block w-full h-full">
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopWebp} type="image/webp" />
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopJpg} type="image/jpeg" />
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.mobilePortraitWebp} type="image/webp" />
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.mobilePortraitJpg} type="image/jpeg" />
          <img
            src={HERO_IMAGES.desktopJpg}
            alt="스타피부과 클리닉 내부 - 현대적인 진료 환경"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="hero-bg-img"
          />
        </picture>
      </div>

      {/* 모바일: 딥 그린-블랙 + 별자리 배경 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden md:hidden">
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(120% 100% at 30% 0%, #1a2822 0%, #0d1614 55%, #050908 100%)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: "50%",
            right: -180,
            top: -200,
            background: "radial-gradient(circle, rgba(201,168,105,0.10), transparent 65%)",
          }}
        />
        <HeroStarfield />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.32) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 데스크톱 오버레이 */}
      <div className="hidden md:block">
        <HeroBackgroundLayers />
      </div>

      {/* 층별 안내 */}
      <HeroFloorBadge text={t.hero.floor} animationDelay={HERO_DELAYS.floorBadge} />

      {/* ── 데스크톱 레이아웃 ── */}
      <div className="hidden md:flex relative z-10 text-center flex-col items-center w-full hero-content">
        <div className="hero-top-group flex flex-col items-center w-full">
          <div className="hero-fade hero-logo-wrap">
            <div className="relative">
              <OptimizedImage
                src={HERO_LOGO_IMAGE}
                alt="스타피부과 로고"
                priority={true}
                width={220}
                height={220}
                className="hero-logo-img"
              />
            </div>
          </div>
          <h1 className="font-medium hero-title">
            <CharReveal text={t.hero.title} startDelay={300} charGap={60} />
          </h1>
          <p className="font-light hero-subtitle">
            <WordReveal text={t.hero.subtitle} startDelay={900} wordGap={85} />
          </p>
          <HeroStatsStrip statsRef={statsRef} stats={statsData} />
        </div>
        <div className="hero-cta-group w-full">
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
      </div>

      {/* ── 모바일 레이아웃: justify-between으로 상단/하단 분리 ── */}
      <div className="md:hidden hero-mobile-layout">
        {/* 상단 그룹: 로고 + 텍스트 (화면 상부 중앙) */}
        <div className="hero-mobile-top-group">
          {/* 로고 */}
          <div className="hero-fade hero-mobile-logo-wrap">
            <OptimizedImage
              src={HERO_LOGO_IMAGE}
              alt="스타피부과 로고"
              priority={true}
              width={136}
              height={136}
              className="hero-mobile-logo-img"
            />
          </div>
          {/* 병원명 */}
          <h1 className="hero-mobile-title">{t.hero.title}</h1>
          {/* STAR DERMATOLOGY */}
          <p className="hero-mobile-dermatology">STAR&nbsp;DERMATOLOGY</p>
          {/* 구분선 */}
          <div className="hero-mobile-divider" />
          {/* 슬로건 */}
          <p className="hero-mobile-slogan">
            Where Experience,<br />Trust, and Science Meet
          </p>
        </div>

        {/* 하단 그룹: 통계 + CTA (화면 하부에 고정) */}
        <div className="hero-mobile-bottom-group">
          <HeroStatsStrip statsRef={statsRef} stats={statsData} />
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
      </div>

      {/* 스크롤 인디케이터 */}
      <HeroScrollIndicator
        label={t.hero.scrollLabel}
        animationDelay={HERO_DELAYS.ctaScroll}
      />
    </section>
  );
}

export default memo(HeroSection);
