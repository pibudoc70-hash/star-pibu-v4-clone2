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
 *
 * [R18-P0-2] 배경 레이어 추상화:
 * - HeroBackgroundLayers: HeroDarkOverlay + HeroVignette + HeroGoldGlow + GoldParticles 조립
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
// [R13-P1-1] 이미지 URL 상수를 hero/constants.ts로 분리
// [R20-P0-3] HERO_DELAYS 상수도 hero/constants.ts로 이동 (애니메이션 타이밍 변경 시 이 파일만 수정)
import { HERO_IMAGES, HERO_LOGO_IMAGE, HERO_DELAYS } from "@/components/hero/constants";
// [R20-P0-3] 하위 호환성 re-export: 이전 import 경로(HeroSection에서 HERO_DELAYS 직접 import)를 사용하는 코드가 있다면 계속 동작
// 신규 코드는 hero/constants.ts에서 직접 import하세요
export { HERO_DELAYS } from "@/components/hero/constants";

// [P1-OPT] React.memo로 memoization 적용
// Hero 섮션은 부모 업데이트 시 단순 리렌더링 방지
function HeroSection() {
  const { t, lang } = useLang();
  const { chatUrl: rawChatUrl, reserveUrl, chatBg, chatColor, isZH } = useChatConfig();
  const chatUrl = isZH ? "#" : rawChatUrl;
  const chatShadow = isZH ? "0 4px 18px rgba(7,193,96,0.35)" : "0 4px 18px rgba(254,229,0,0.35)";
  const [wechatCopied, setWechatCopied] = useState(false);
  const handleWechatClick = (e: React.MouseEvent) => {
    if (!isZH) return;
    e.preventDefault();
    // [P2] .catch() 추가 — HTTPS 미적용 환경·권한 거부 시 unhandled rejection 방지
    navigator.clipboard.writeText(WECHAT_ID)
      .then(() => {
        setWechatCopied(true);
        setTimeout(() => setWechatCopied(false), 2500);
      })
      .catch(() => {
        // 클립보드 접근 불가 시 조용히 무시
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
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-svh"
    >
      {/* LCP 최적화: <picture> 태그 + 모바일 애니메이션 래퍼 */}
      <div className="absolute inset-0 block pointer-events-none overflow-hidden">
        <picture
          aria-hidden="true"
          className="absolute inset-0 block w-full h-full"
        >
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopWebp} type="image/webp" />
          <source media="(min-width: 641px)" srcSet={HERO_IMAGES.desktopJpg} type="image/jpeg" />
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.desktopWebp} type="image/webp" />
          <source media="(max-width: 640px)" srcSet={HERO_IMAGES.desktopJpg} type="image/jpeg" />
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

      {/* [R18-P0-2] 배경 레이어 조립 → HeroBackgroundLayers로 추상화 */}
      <HeroBackgroundLayers />

      {/* [R12-P1-1] 층별 안내 서브컴포넌트 */}
      <HeroFloorBadge text={t.hero.floor} animationDelay={HERO_DELAYS.floorBadge} />

      {/* 콘텐츠 — 모바일: space-between으로 상단(로고/텍스트/통계)와 하단(CTA) 분리 */}
      <div className="relative z-10 text-center flex flex-col items-center w-full hero-content">
        {/* 상단 콘텐츠 그룹: 로고 + 텍스트 + 통계 */}
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

        {/* 병원명: 글자별 charReveal (데스크톱만) */}
        <h1 className="font-medium hero-title hidden md:block">
          <CharReveal text={t.hero.title} startDelay={300} charGap={60} />
        </h1>
        {/* 모바일: 병원명 숨김 */}

        {/* 슬로건: 단어별 wordReveal (데스크톱만) */}
        <p className="font-light hero-subtitle hidden md:block">
          <WordReveal text={t.hero.subtitle} startDelay={900} wordGap={85} />
        </p>
        
        {/* 모바일: 병원명만 표시 (로고 아래 영어는 이미 있음) */}
        <div className="md:hidden flex flex-col items-center gap-1 mb-8">
          {/* 한글 병원명 - 메인 */}
          <p className="hero-title-mobile font-medium text-white text-center">
            스타피부과
          </p>
        </div>

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

        </div>{/* /hero-top-group */}

        {/* 하단 CTA 그룹 — 모바일에서는 화면 하단에 자연스럽게 위치 */}
        <div className="hero-cta-group w-full">
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
        </div>{/* /hero-cta-group */}
      </div>

      {/* [R12-P1-1] 스크롤 인디케이터 서브컴포넌트 */}
      <HeroScrollIndicator
        label={t.hero.scrollLabel}
        animationDelay={HERO_DELAYS.ctaScroll}
      />
    </section>
  );
}

// [P1-OPT] React.memo로 memoization 내보내
export default memo(HeroSection);
