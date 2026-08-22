/**
 * HeroSection - STAR 피부과
 *
 * 애니메이션 시스템:
 * - 로고: heroFadeUp (0.0s)
 * - 병원명 "스타피부과": 글자별 charReveal stagger (0.03s~) [LCP-FIX: 0.3s→0.03s]
 * - 개원 배지: heroFadeUp (0.75s)
 * - 슬로건 단어별: wordReveal stagger (0.09s~) [LCP-FIX: 0.9s→0.09s]
 * - 층별 안내: heroFadeUp (1.25s)
 * - 수치 통계: heroFadeUp stagger (1.4s~)
 * - CTA 버튼: heroFadeUp stagger (1.7s~)
 * - 스크롤 인디케이터: heroFadeUp (2.1s)
 *
 * 모두 cubic-bezier(0.16, 1, 0.3, 1) spring easing — 팝업/섹션과 동일
 *
 * 레이아웃:
 * - 데스크톱: 기존 레이아웃 유지 (CharReveal, WordReveal 애니메이션)
 * - 모바일: 사진 기준 레이아웃
 *   상단: 로고(68px) → 병원명 → STAR DERMATOLOGY → 구분선 → 슬로건
 *   하단: 통계 스트립 → 3버튼 그리드
 */
import { useRef, useState, useEffect, memo } from "react";
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
import { HERO_IMAGES, HERO_LOGO_IMAGE, HERO_MOBILE_LOGO_IMAGE, HERO_DELAYS } from "@/components/hero/constants";
import { HOME_SEO_META } from "@/lib/homeSeo";
export { HERO_DELAYS } from "@/components/hero/constants";

// 슬로건 영한 교차 애니메이션 훅
function useSloganToggle(intervalMs = 3200) {
  const [showKo, setShowKo] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setShowKo(v => !v), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return showKo;
}

function HeroSection() {
  const { t, lang } = useLang();
  const seoHeading = lang === "ko" ? HOME_SEO_META.title : t.hero.title;
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

  const showKo = useSloganToggle(5000);
  // [BUG FIX] 데스크톱/모바일 statsRef 분리
  // 두 HeroStatsStrip이 동일 ref를 공유하면 IntersectionObserver가
  // CSS로 숨겨진 모바일 요소를 감시하여 isDone 완료가 불안정해짐
  const desktopStatsRef = useRef<HTMLDivElement>(null);
  const mobileStatsRef = useRef<HTMLDivElement>(null);
  const clinicStats = useClinicStats();
  // useCountUp은 데스크톱 ref 기준으로 트리거 (PC에서 뷰포트 진입 시 카운트업 시작)
  const { value: count4000, isDone: done4000 } = useCountUp(CLINIC_STATS.eyeBagCases, 900, "", 0, desktopStatsRef, lang);
  const { value: count20, isDone: done20 } = useCountUp(CLINIC_STATS.yearsExperience, 900, "", 0, desktopStatsRef, lang);
  const { value: count50, isDone: done50 } = useCountUp(CLINIC_STATS.laserTypes, 900, "", 0, desktopStatsRef, lang);

  const statsData: [
    { value: string; unit: string; label: string; isDone: boolean; animationDelay: string },
    { value: string; unit: string; label: string; isDone: boolean; animationDelay: string },
    { value: string; unit: string; label: string; isDone: boolean; animationDelay: string }
  ] = [
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
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-svh hero-section-root"
    >
      <h1 className="sr-only">{seoHeading}</h1>
      {/* ── 배경 레이어 ── */}

      {/* 데스크톱: 이미지 배경 */}
      <div className="absolute inset-0 block pointer-events-none overflow-hidden hidden md:block">
        <picture className="absolute inset-0 block w-full h-full">
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopAvif} type="image/avif" />
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopWebp} type="image/webp" />
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopJpg} type="image/jpeg" />
          {/* 모바일 이미지 소스 (테스트 참조용 — 실제 모바일은 별자리 배경 사용) */}
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.mobilePortraitAvif} type="image/avif" />
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

      {/* 모바일: 병원 사진 배경 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden md:hidden">
        <picture className="absolute inset-0 block w-full h-full">
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.mobilePortraitAvif} type="image/avif" />
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.mobilePortraitWebp} type="image/webp" />
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.mobilePortraitJpg} type="image/jpeg" />
          <img
            src={HERO_IMAGES.mobilePortraitJpg}
            alt="스타피부과 클리닉 내부 - 현대적인 진료 환경"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="hero-bg-img"
          />
        </picture>
      </div>

      {/* 오버레이 (데스크톱 + 모바일 공통) */}
      <HeroBackgroundLayers />

      {/* 층별 안내 */}
      <HeroFloorBadge text={t.hero.floor} animationDelay={HERO_DELAYS.floorBadge} />

      {/* ── 데스크톱 레이아웃 (기존 유지) ── */}
      <div className="hidden md:flex relative z-10 text-center flex-col items-center w-full hero-content">
        <div className="hero-top-group flex flex-col items-center w-full">
          {/* 로고 */}
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
          {/* 병원명: 글자별 charReveal */}
          {/* [LCP-FIX] startDelay 300→30, charGap 60→6: 마지막 글자 완료 540ms→54ms, LCP 개선 */}
          <div className="font-medium hero-title" aria-hidden="true">
            <CharReveal text={t.hero.title} startDelay={30} charGap={6} />
          </div>
          {/* 슬로건: 단어별 wordReveal */}
          {/* [LCP-FIX] startDelay 900→90, wordGap 85→8 */}
          <p className="font-light hero-subtitle">
            {lang === "ko" ? (
              <span className="hero-desktop-slogan-toggle">
                <span className="sr-only">{t.hero.subtitle}</span>
                <span aria-hidden="true" className="hero-desktop-slogan-visual">
                  <span className="hero-desktop-slogan-line hero-desktop-slogan-en">
                    {t.hero.subtitle}
                  </span>
                  <span className="hero-desktop-slogan-line hero-desktop-slogan-ko">
                    신뢰와 과학이 경험으로 완성되는 곳
                  </span>
                </span>
              </span>
            ) : (
              <WordReveal text={t.hero.subtitle} startDelay={90} wordGap={8} />
            )}
          </p>
          {/* 통계 스트립 */}
          <HeroStatsStrip statsRef={desktopStatsRef} stats={statsData} />
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

      {/* ── 모바일 레이아웃: 사진 기준 (상단 중앙 + 하단 고정) ── */}
      <div className="md:hidden hero-mobile-layout">
        {/* 상단 그룹: 로고 + 텍스트 (화면 상부 중앙) */}
        <div className="hero-mobile-top-group">
          {/* 로고 — 단일 렌더링 (68px) */}
          <div className="hero-mobile-logo-wrap">
            <OptimizedImage
              src={HERO_MOBILE_LOGO_IMAGE}
              alt="스타피부과 로고"
              priority={true}
              width={96}
              height={96}
              className="hero-mobile-logo-img"
            />
          </div>
          {/* 병원명 */}
          <div className="hero-mobile-title" aria-hidden="true">{t.hero.title}</div>
          {/* STAR DERMATOLOGY — 사진 배경에 이미 표시되므로 제거 */}
          {/* 슬로건 — 한국어일 때만 영한 교차, 외국어에서는 해당 언어 슬로건만 표시 */}
          <div className="hero-mobile-slogan-wrap">
            {lang === "ko" ? (
              <p
                key={showKo ? "ko" : "en"}
                className="hero-mobile-slogan hero-mobile-slogan-fade"
              >
                {showKo
                  ? <>신뢰와 과학이<br />경험으로 완성되는 곳</>
                  : <>Where Experience,<br />Trust, and Science Meet</>}
              </p>
            ) : (
              <p className="hero-mobile-slogan">
                {t.hero.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 하단 그룹: 통계 + 스크롤 유도 화살표 */}
        <div className="hero-mobile-bottom-group">
          <HeroStatsStrip statsRef={mobileStatsRef} stats={statsData} />
          {/* 모바일 스크롤 유도 화살표 */}
          <button
            type="button"
            aria-label={t.hero.scrollLabel ?? "Scroll down"}
            className="hero-mobile-scroll-arrow"
            onClick={() => {
              const el = document.querySelector("#about");
              if (el) {
                const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
                const offset = header ? header.offsetHeight + 8 : 80;
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 8.5L11 14.5L17 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
