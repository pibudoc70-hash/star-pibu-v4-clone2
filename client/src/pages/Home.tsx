/**
 * Home Page - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * TreatmentsSection + EquipmentSection → TreatmentsEquipmentSection 통합
 *
 * 성능 최적화:
 * - 폴드 위 섹션(Hero, SpecialEvent): eager import + 즉시 마운트
 * - 폴드 아래 섹션: React.lazy + Suspense + deferMount (뷰포트 근처에서만 마운트)
 *   → 초기 로드 시 폴드 아래 섹션의 JS 실행/API 호출 비용 제거
 *   → 스크롤 300px 전에 마운트 시작 → 사용자가 도달하기 전에 준비 완료
 */
import { lazy, Suspense, useEffect, useState } from "react";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { CLINIC_STATS } from "../lib/constants";
const _n = CLINIC_STATS.eyeBagCases.toLocaleString("ko-KR");
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd, buildFAQPageJsonLd, buildLocalBusinessJsonLd, buildVideoObjectListJsonLd, buildPersonListJsonLd, SITE_NAME_LOCALIZED, OG_IMAGE_LOCALIZED } from "@/components/SeoHead";
import { CLINIC_DOCTORS } from "@/lib/clinic-data";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MobileBottomCTA from "@/components/MobileBottomCTA";
// [P1-OPT] SpecialEventSection, DoctorsSection을 lazy import로 전환
// 폴드 아래 섹션이므로 초기 로딩 시 필요 없음
const SpecialEventSection = lazy(() => import("@/components/SpecialEventSection"));
const DoctorsSection = lazy(() => import("@/components/DoctorsSection"));
const TreatmentsEquipmentSection = lazy(() => import("@/components/TreatmentsEquipmentSection"));
import Footer from "@/components/Footer";
const WelcomePopup = lazy(() => import("@/components/WelcomePopup"));

// 폴드 아래 섹션 — lazy loading으로 초기 번들 크기 감소
const ManagementDevicesSection = lazy(() => import("@/components/ManagementDevicesSection"));
const PhilosophySection = lazy(() => import("@/components/PhilosophySection"));
const ResultsStatisticsSection = lazy(() => import("@/components/ResultsStatisticsSection"));
const FacilitySection = lazy(() => import("@/components/FacilitySection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const YouTubeSection = lazy(() => import("@/components/YouTubeSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const RecentNoticesSection = lazy(() => import("@/components/RecentNoticesSection"));
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { useNewNoticeToast } from "@/hooks/useNewNoticeToast";
import { useLocation } from "wouter";

/** 셉션 로딩 중 표시할 스켈레톤 — CLS 방지 + perceived performance 개선
 * variant="dark": 어두운 배경 섹션(ManagementDevices, YouTube, Contact)
 * variant="light": 밝은 배경 섹션 (기본값)
 * 200ms 지연 후 opacity 1로 전환 → 빠른 연결에서 skeleton flash 방지
 */
/**
 * SectionFallback — Suspense fallback skeleton
 * layout: 섹션 실제 레이아웃에 맞는 skeleton 형태
 *   'cards-3'  : 3열 카드 그리드 (SpecialEvent, Doctors, ResultsStatistics)
 *   'cards-4'  : 4열 카드 그리드 (ManagementDevices)
 *   'list'     : 목록형 (FAQ, Notices)
 *   'gallery'  : 갤러리 (Facility)
 *   'stats'    : 통계 카드 (Philosophy)
 *   'default'  : 범용 (기본값)
 */
function SectionFallback({
  minH = "min-h-[320px]",
  variant = "light",
  layout = "default",
  bg,
}: {
  minH?: string;
  variant?: "light" | "dark";
  layout?: "cards-3" | "cards-4" | "list" | "gallery" | "stats" | "default";
  bg?: string;
} = {}) {
  const isDark = variant === "dark";
  const s = isDark ? "skeleton-shimmer--dark" : "skeleton-shimmer";
  const bgStyle = bg
    ? { background: bg }
    : isDark
    ? { background: "linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" }
    : { background: "var(--brand-bg, #FAF8F5)" };

  // 섹션 헤더 (공통) — 라벨 바는 골드 톤 픽스드 색상으로 브랜드 일관성 확보
  const header = (
    <div className="flex flex-col items-center gap-2.5 w-full px-4" style={{ maxWidth: '28rem' }}>
      {/* 라벨 바 — 골드 톤 픽스드 (shimmer 아님) */}
      <div
        style={{
          height: '9px', width: '3.5rem', borderRadius: '999px',
          background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 35%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 42%, transparent)',
        }}
      />
      {/* 제목 — 모바일에서 w-full로 잘림 방지 */}
      <div className={`h-6 rounded ${s}`} style={{ width: 'min(12rem, 75%)', animationDelay: "0.1s" }} />
      <div className={`h-4 rounded ${s}`} style={{ width: 'min(16rem, 90%)', animationDelay: "0.2s" }} />
    </div>
  );

  // 레이아웃별 콘텐츠 — content-first preview state (실제 카드 구조 반영)
  let content: React.ReactNode;
  if (layout === "cards-3") {
    // 3열 카드 그리드: 이미지 영역 + 텍스트 라인 (이벤트/의료진/시술 카드 구조)
    // 모바일: 1열 + 카드 1장만 표시(답답함 방지), 데스크톱: 3열
    content = (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl px-5 md:px-4">
        {[0, 1, 2].map((i) => (
          // 모바일에서는 첫 번째 카드만 표시 (좁은 화면에서 3장 나열 불필요)
          <div key={i} className={`rounded-2xl overflow-hidden${i > 0 ? ' hidden md:block' : ''}`}
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid color-mix(in srgb, var(--color-gold-primary) 14%, transparent)',
            }}>
            {/* 이미지 영역 — aspect-ratio 3/2 + 그라디언트 오버레이 + 가격 배지 힌트 */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <div className={`${s} absolute inset-0`} style={{ animationDelay: `${i * 0.1}s` }} />
              {/* 하단 그라디언트 오버레이 — 실제 카드 분위기 반영 */}
              <div style={{
                position: 'absolute', inset: 0,
                background: isDark
                  ? 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.25) 100%)'
                  : 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.10) 100%)',
                pointerEvents: 'none',
              }} />
              {/* 가격 배지 힌트 — 우상단 */}
              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                height: '20px', width: '52px', borderRadius: '999px',
                background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 30%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 38%, transparent)',
              }} />
            </div>
            {/* 텍스트 영역 */}
            <div className="p-4 flex flex-col gap-2">
              {/* 배지 라벨 — 골드 픽스드 */}
              <div style={{
                height: '11px', width: '3rem', borderRadius: '999px',
                background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 25%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 32%, transparent)',
              }} />
              <div className={`h-5 w-4/5 rounded ${s}`} style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
              <div className={`h-3.5 w-3/5 rounded ${s}`} style={{ animationDelay: `${i * 0.1 + 0.15}s` }} />
              <div className={`h-3.5 w-2/5 rounded ${s}`} style={{ animationDelay: `${i * 0.1 + 0.2}s` }} />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (layout === "cards-4") {
    // 4열 카드 그리드: 이미지 영역 + 텍스트 2줄 (관리 장비 카드 구조)
    // 모바일: 2열 유지, gap/padding 축소로 답답함 완화
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl px-5 md:px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl md:rounded-2xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid color-mix(in srgb, var(--color-gold-primary) 14%, transparent)',
            }}>
            {/* 이미지 영역 — 정사각형 비율 + 그라디언트 오버레이 */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <div className={`${s} absolute inset-0`} style={{ animationDelay: `${i * 0.08}s` }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: isDark
                  ? 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.20) 100%)'
                  : 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.08) 100%)',
                pointerEvents: 'none',
              }} />
            </div>
            {/* 텍스트 영역 — 모바일 p-2.5, 데스크톱 p-3 */}
            <div className="p-2.5 md:p-3 flex flex-col gap-1.5 md:gap-2">
              {/* 배지 라벨 — 골드 픽스드 */}
              <div style={{
                height: '9px', width: '2.4rem', borderRadius: '999px',
                background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 25%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 32%, transparent)',
              }} />
              <div className={`h-3.5 w-4/5 rounded ${s}`} style={{ animationDelay: `${i * 0.08 + 0.06}s` }} />
              <div className={`h-3 w-3/5 rounded ${s}`} style={{ animationDelay: `${i * 0.08 + 0.12}s` }} />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (layout === "list") {
    // 목록형 (FAQ): 아코디언 행 구조
    // 모바일: 행 높이 52px, gap 1.5, px-5로 여백 확보
    content = (
      <div className="flex flex-col gap-1.5 md:gap-2 w-full max-w-2xl px-5 md:px-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl flex items-center gap-3 px-4"
            style={{
              height: '52px',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid color-mix(in srgb, var(--color-gold-primary) 14%, transparent)',
            }}>
            {/* Q 아이콘 힌트 — 골드 픽스드 */}
            <div style={{
              width: '11px', height: '11px', borderRadius: '50%', flexShrink: 0,
              background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 25%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 32%, transparent)',
            }} />
            <div className={`h-3 rounded flex-1 ${s}`} style={{ width: `${60 + (i % 3) * 10}%`, animationDelay: `${i * 0.08 + 0.05}s` }} />
          </div>
        ))}
      </div>
    );
  } else if (layout === "gallery") {
    // 갤러리 (Facility): 메인 + 서브 2장 구조
    // gallery는 이미지 자체가 카드이므로 border/shadow를 shimmer 위에 overlay로 처리
    // 모바일: height 220px, 서브 패널 숨김 → 메인 1장만 표시
    const galleryCardStyle = {
      boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
      outline: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid color-mix(in srgb, var(--color-gold-primary) 14%, transparent)',
      outlineOffset: '-1px',
    };
    content = (
      <div className="flex gap-3 w-full max-w-4xl px-5 md:px-4" style={{ height: 'clamp(200px, 40vw, 300px)' }}>
        <div className={`rounded-xl md:rounded-2xl flex-1 ${s}`} style={{ animationDelay: '0s', minWidth: 0, ...galleryCardStyle }} />
        {/* 서브 패널 — 모바일에서 숨김 (좁은 화면에서 너무 좁아짐) */}
        <div className="hidden md:flex flex-col gap-3" style={{ width: '38%', flexShrink: 0 }}>
          <div className={`rounded-2xl flex-1 ${s}`} style={{ animationDelay: '0.1s', ...galleryCardStyle }} />
          <div className={`rounded-2xl flex-1 ${s}`} style={{ animationDelay: '0.2s', ...galleryCardStyle }} />
        </div>
      </div>
    );
  } else if (layout === "stats") {
    // 통계 카드 (ResultsStatistics): 수치 + 라벨 카드 4개
    // 모바일: 2열, p-4로 패딩 축소, 아이콘 원 32px
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl px-5 md:px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col items-center gap-2 md:gap-3"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid color-mix(in srgb, var(--color-gold-primary) 14%, transparent)',
            }}>
            {/* 아이콘 원 — 골드 픽스드 힌트, 모바일 32px */}
            <div style={{
              width: 'clamp(28px, 7vw, 40px)', height: 'clamp(28px, 7vw, 40px)', borderRadius: '50%',
              background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 18%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 22%, transparent)',
            }} />
            <div className={`h-6 md:h-7 rounded ${s}`} style={{ width: 'clamp(3rem, 8vw, 4rem)', animationDelay: `${i * 0.1 + 0.05}s` }} />
            <div className={`h-3 rounded ${s}`} style={{ width: 'clamp(2.5rem, 7vw, 3.5rem)', animationDelay: `${i * 0.1 + 0.1}s` }} />
          </div>
        ))}
      </div>
    );
  } else {
    // default: 범용 카드 그리드 — 모바일 gap/padding 최적화
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl px-5 md:px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid color-mix(in srgb, var(--color-gold-primary) 14%, transparent)',
            }}>
            <div className={`${s} w-full`} style={{ aspectRatio: '4/3', animationDelay: `${i * 0.12}s` }} />
            <div className="p-2.5 md:p-3 flex flex-col gap-1.5 md:gap-2">
              <div style={{
                height: '9px', width: '2.4rem', borderRadius: '999px',
                background: isDark ? 'color-mix(in srgb, var(--color-gold-primary) 25%, transparent)' : 'color-mix(in srgb, var(--color-gold-primary) 32%, transparent)',
              }} />
              <div className={`h-3.5 w-4/5 rounded ${s}`} style={{ animationDelay: `${i * 0.12 + 0.06}s` }} />
              <div className={`h-3 w-3/5 rounded ${s}`} style={{ animationDelay: `${i * 0.12 + 0.12}s` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`section-fallback ${minH} py-16 md:py-24 flex flex-col items-center justify-center gap-6`}
      aria-hidden="true"
      role="presentation"
      style={bgStyle}
    >
      {header}
      {content}
    </div>
  );
}

/** WelcomePopup을 첫 렌더 후 idle 시점에 마운트 — 초기 query 비용 제거 */
function useIdleMount(delayMs = 2000): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // requestIdleCallback 지원 시 idle에 마운트, 미지원 시 delayMs 후 마운트
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => setMounted(true), { timeout: delayMs });
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setMounted(true), delayMs);
      return () => clearTimeout(id);
    }
  }, [delayMs]);
  return mounted;
}

export default function Home() {
  const popupReady = useIdleMount(2000);
  const [, navigate] = useLocation();

  // 새 공지사항 알림 토스트 (세션당 1회)
  useNewNoticeToast(navigate);

  const { scrollToSelector } = useAnchorScroll();

  // 다른 페이지에서 섹션 메뉴 클릭 시 해당 섹션으로 자동 스크롤
  // [FIX v2] URL hash 대신 sessionStorage(__star_scroll_to)를 사용해
  // URL에 hash가 남지 않도록 한다.
  useEffect(() => {
    // [FIX v4] 언어 변경 시 scroll restoration 무시 → 강제 최상단
    const forceScrollTop = sessionStorage.getItem("__star_force_scroll_top");
    if (forceScrollTop) {
      sessionStorage.removeItem("__star_force_scroll_top");
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // [FIX v9] __star_doctor_tab → __star_dr_target 방식으로 통일
    const storedTab = sessionStorage.getItem("__star_doctor_tab");
    if (storedTab) {
      sessionStorage.removeItem("__star_doctor_tab");
      const slugMap = ['cho', 'woo', 'lee'];
      const slug = slugMap[parseInt(storedTab, 10)];
      if (slug) {
        sessionStorage.setItem('__star_dr_target', `dr-${slug}`);
        return;
      }
    }

    // URL hash 처리: index.html에서 #dr-* 는 이미 제거됨
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // [FIX v12] __star_dr_target이 있으면 useDoctorViewModel이 스크롤 담당
    if (sessionStorage.getItem('__star_dr_target')) return;

    // 일반 섹션 스크롤: sessionStorage(__star_scroll_to) → useAnchorScroll
    const sessionTarget = sessionStorage.getItem("__star_scroll_to");
    if (!sessionTarget) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    sessionStorage.removeItem("__star_scroll_to");
    scrollToSelector(`#${sessionTarget}`, { block: "start" });
  }, []); // 반드시 빈 배열 — 마운트 시 1회만 실행

  return (
    <div className="min-h-screen">
      {/*
       * [PROD-P2-2] 홈페이지에만 pageType="home" 설정 (WebSite + MedicalBusiness 스키마 모두 포함)
       * 이유: WebSite 스키마(SearchAction)는 사이트 전체를 대표하는 루트 URL에만
       * 삽입하는 것이 Google 권장 사항. 내부 페이지에 중복 삽입되면
       * 신호 희석이 분산되어 Sitelinks Searchbox 인식률이 낮아집니다.
       */}
      <SeoHead
        title="부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅, 색소질환, 다양한 레이저 보유"
        description="부산 서면 스타피부과(서면로 74 아이온시티빌딩 4F)는 20년 이상 경력 피부과 전문의 3인이 울세라피·써마지 FLX·눈밑지방재배치·리주란힐러·피코레이저 등 50종 프리미엄 레이저를 직접 담당합니다. 영어·일본어·중국어 외국인 환자 진료 가능. 전화 051-818-2300."
        keywords="부산피부과, 울쎄라, 써마지, 리프팅, 색소질환, 레이저치료, 리주란, 눈밑지방, 피부과전문의, 부산리프팅, 피부관리"
        canonical="https://star-pibu.com/"
        ogImage={OG_IMAGE_LOCALIZED.ko}
        ogSiteName={SITE_NAME_LOCALIZED.ko}
        ogLocale="ko_KR"
        ogLocaleAlternates={["en_US", "ja_JP", "zh_CN"]}
        hreflangs={COMMON_HREFLANGS}
        pageType="home"
        jsonLd={[
          buildLocalBusinessJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "홈", url: "https://star-pibu.com/" },
          ]),
          buildFAQPageJsonLd([
            /* ── 병원 기본 정보 ── */
            {
              question: "스타피부과는 어디에 위치하나요?",
              answer: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층에 위치합니다. 부산 지하철 1·2호선 서면역에서 도보 5분 거리입니다. 전화: 051-818-2300"
            },
            {
              question: "스타피부과 진료 시간은 어떻게 되나요?",
              answer: "월요일~금요일 오전 10시~오후 7시, 토요일 오전 9시 30분~오후 3시입니다. 일요일과 공휴일은 휴진합니다."
            },
            {
              question: "스타피부과는 어떤 시술을 전문으로 하나요?",
              answer: "울쎄라피 프라임, 써마지 FLX, 눈밑지방재배치, 리쥬란힐러, 피코레이저 토닝, 색소질환 치료, 여드름 치료 등 50종 이상의 프리미엄 레이저 시술을 보유하고 있습니다. 20년 이상 경력의 피부과 전문의 3인이 모든 시술을 직접 담당합니다."
            },
            {
              question: "스타피부과에서 외국인 환자도 진료가 가능한가요?",
              answer: "네, 영어·일본어·중국어 안내를 제공합니다. 외국인 환자 전용 안내 페이지(https://star-pibu.com/en/foreign-guide)를 참고하세요."
            },
            /* ── 울쎄라피 ── */
            {
              question: "울쎄라피 프라임이란 무엇인가요?",
              answer: "울쎄라피 프라임(Ultherapy Prime)은 집속 초음파(HIFU) 기술로 피부 깊은 SMAS층까지 자극하는 FDA 승인 비수술 리프팅 시술입니다. 기존 울쎄라 대비 에너지 전달 효율이 향상되어 더 적은 횟수로 효과적인 리프팅이 가능합니다."
            },
            {
              question: "울쎄라피 프라임과 기존 울쎄라의 차이는 무엇인가요?",
              answer: "울쎄라피 프라임은 기존 울쎄라 대비 에너지 전달 효율이 개선된 차세대 버전입니다. 동일한 HIFU 원리를 사용하지만 더 정밀한 초음파 조사가 가능하여 콜라겐 재생 효과가 높고, 시술 시 불편감이 줄어든 것이 특징입니다."
            },
            {
              question: "울쎄라피 시술 후 효과는 얼마나 지속되나요?",
              answer: "울쎄라피 효과는 시술 후 2~3개월에 걸쳐 서서히 나타나며, 6개월~1년 이상 지속됩니다. 개인의 피부 상태, 나이, 생활 습관에 따라 차이가 있을 수 있으며, 연 1회 유지 시술을 권장합니다."
            },
            {
              question: "울쎄라피 시술 후 일상생활이 바로 가능한가요?",
              answer: "네, 울쎄라피는 비수술 시술로 별도의 회복 기간이 필요하지 않습니다. 시술 직후 약간의 붓기나 홍조가 있을 수 있으나 대부분 당일 일상생활 복귀가 가능합니다."
            },
            /* ── 써마지 FLX ── */
            {
              question: "써마지 FLX란 무엇인가요?",
              answer: "써마지 FLX는 4세대 고주파(RF) 에너지를 이용해 피부 깊은 층의 콜라겐을 재생시키는 리프팅 시술입니다. 피부 탄력 개선, 피부결 정돈, 모공 축소, 주름 개선 효과가 있으며 FDA 승인을 받은 안전한 장비입니다."
            },
            {
              question: "써마지 FLX 시술은 통증이 있나요?",
              answer: "써마지 FLX는 진동(Vibration) 기능이 탑재되어 기존 써마지 대비 통증이 크게 줄었습니다. 시술 중 따뜻한 열감과 약간의 따끔함이 느껴질 수 있으나 대부분의 환자가 충분히 견딜 수 있는 수준입니다."
            },
            {
              question: "써마지 FLX는 몇 회 시술해야 하나요?",
              answer: "써마지 FLX는 1회 시술로도 효과를 볼 수 있으며, 효과는 시술 후 2~6개월에 걸쳐 서서히 나타납니다. 유지를 위해 6개월~1년 간격으로 재시술을 권장합니다."
            },
            {
              question: "울쎄라피와 써마지를 함께 받을 수 있나요?",
              answer: "네, 울쎄라피(HIFU)와 써마지 FLX(RF)는 작용 원리가 달라 병행 시술 시 시너지 효과를 낼 수 있습니다. 울쎄라피는 SMAS층 리프팅에, 써마지는 피부 표층 콜라겐 재생에 특화되어 있어 함께 받으면 더욱 입체적인 리프팅 효과를 기대할 수 있습니다."
            },
            /* ── 눈밑지방재배치 ── */
            {
              question: "눈밑지방재배치술이란 무엇인가요?",
              answer: `눈밑지방재배치술은 눈 아래 과잉 지방을 제거하지 않고 꺼진 눈물고랑 부위로 재배치하여 자연스러운 눈밑 라인을 형성하는 시술입니다. 스타피부과 조시형 원장은 ${_n}례 이상의 시술 경험을 보유하고 있습니다.`
            },
            {
              question: "눈밑지방재배치 회복 기간은 얼마나 걸리나요?",
              answer: "눈밑지방재배치 후 붓기는 보통 1~2주 내에 대부분 빠지며, 완전한 회복까지는 1~3개월이 소요됩니다. 시술 후 1주일은 격렬한 운동과 음주를 삼가고, 자외선 차단에 주의해야 합니다."
            },
            /* ── 리쥬란힐러 ── */
            {
              question: "리쥬란힐러란 무엇인가요?",
              answer: "리쥬란힐러는 연어에서 추출한 폴리뉴클레오타이드(PDRN) 성분을 피부에 주입하여 피부 재생 및 탄력 개선을 돕는 시술입니다. 피부 보습, 탄력 증가, 미세 주름 개선, 피부결 정돈 효과가 있으며 자연스러운 피부 개선을 원하는 분들에게 적합합니다."
            },
            {
              question: "리쥬란힐러는 몇 회 시술해야 효과가 있나요?",
              answer: "리쥬란힐러는 보통 2~4주 간격으로 3~4회 기본 시술 후 3~6개월 간격으로 유지 시술을 권장합니다. 개인 피부 상태에 따라 시술 횟수와 간격이 달라질 수 있으며, 시술 전 전문의 상담을 통해 맞춤 계획을 세우는 것이 좋습니다."
            },
            /* ── 부산 지역 특화 ── */
            {
              question: "부산 서면에서 울쎄라 시술받을 수 있는 피부과는?",
              answer: "부산광역시 부산진구 서면로 74 아이온시티빌딩 4층에 위치한 스타피부과에서 울쎄라피 프라임 시술을 제공합니다. 서면역에서 도보 5분 거리이며, 20년 이상 경력의 피부과 전문의가 직접 시술합니다."
            },
            {
              question: "부산에서 써마지 시술받으려면 어디가 좋은가요?",
              answer: "부산 서면 스타피부과의 조시형 대표원장은 써마지 FLX 공식 자문의로 활동하고 있으며, 20년 이상의 피부과 전문의 경력을 보유하고 있습니다."
            },
            {
              question: "부산 피부과 중 눈밑지방재배치 경험이 많은 곳은?",
              answer: "부산 서면 스타피부과는 눈밑지방재배치 4,000례 이상의 시술 경험을 보유하고 있으며, 다크서클과 눈밑 볼록함을 동시에 개선하는 방식으로 진행됩니다."
            },
            {
              question: "부산에서 울쎄라와 써마지 중 어느 것을 선택해야 하나요?",
              answer: "울쎄라는 초음파(HIFU) 기반으로 피부 깊은 SMAS층을 자극하고, 써마지는 고주파(RF) 기반으로 피부 진피층 콜라겐을 자극합니다. 개별 피부 상태와 목적에 따라 다르며, 부산 스타피부과에서는 상담을 통해 적합한 시술을 제안합니다."
            },
            {
              question: "부산 지역에서 다양한 레이저를 보유한 피부과는?",
              answer: "부산 서면 스타피부과는 50종 이상의 프리미엄 레이저 및 시술 장비를 보유하고 있어, 피부 상태에 맞는 다양한 치료가 가능합니다."
            },
            {
              question: "부산 스타피부과에서 피부과 전문의가 직접 시술하나요?",
              answer: "네, 스타피부과의 모든 시술은 조시형·우혜진·이기욱 3명의 피부과 전문의가 직접 담당합니다. 간호사나 피부관리사가 시술하지 않으며, 부산 지역에서 20년 이상 피부과 전문 진료를 제공하고 있습니다."
            },
            /* ── 통증 경감·편의 시설 ── */
            {
              question: "울쎄라 시술이 아프다고 들었는데, 부산 스타피부과는 통증 완화를 어떻게 하나요?",
              answer: "부산 서면 스타피부과는 울쎄라피 프라임 시술 시 환자의 통증 부담을 낮추기 위해 다층 통증 경감 프로토콜을 운영합니다. 시술 전 마취 크림 도포, 시술 중 실시간 통증 모니터링, 환자 요청 시 모니터링 진정(수면 진정) 옵션을 제공합니다. 20년 이상의 피부과 전문의 경력을 바탕으로 시술 강도를 개별 조정합니다."
            },
            {
              question: "써마지 시술 중 통증이 걱정됩니다. 어떻게 관리하나요?",
              answer: "스타피부과는 써마지 FLX 시술 시 부위별 마취 크림, 시술 중 냉각 시스템(Cooling Tip), 그리고 필요한 경우 모니터링 진정 옵션을 함께 제공합니다. 조시형 원장은 써마지 FLX 공식 자문의로 활동하며 통증 관리 경험이 축적되어 있습니다."
            },
            {
              question: "부산에서 수면마취(진정) 하에 울쎄라·써마지 시술 가능한 곳은?",
              answer: "부산 서면 스타피부과는 환자가 원하는 경우 전문 의료진 감독 하에 모니터링 진정(수면 진정) 방식으로 울쎄라·써마지 시술을 진행할 수 있습니다. 진정 시술 시에는 별도의 상담과 사전 안내가 이루어지며, 시술 중 환자의 활력 징후를 모니터링합니다."
            },
            {
              question: "통증에 예민한 편인데 리프팅 시술이 가능할까요?",
              answer: "통증 민감도에 따라 마취 크림, 냉각, 진정 옵션을 조합하여 개인별 맞춤 통증 경감 계획을 상담합니다. 20년 이상 임상 경력의 피부과 전문의가 상담을 통해 환자에게 적합한 통증 관리 방식을 제안합니다."
            },
            {
              question: "스타피부과의 환자 편의 시설은 어떤가요?",
              answer: "부산 서면 스타피부과는 시술 대기실, 프라이버시가 확보된 개별 시술실, 시술 후 회복 공간, 진정 시술을 위한 모니터링 설비를 갖추고 있습니다."
            },
                    ]),
          buildPersonListJsonLd(CLINIC_DOCTORS),
          buildVideoObjectListJsonLd([
            {
              title: "울쎄라피 프라임 시술 안내 | 부산 서면 스타피부과",
              videoId: "PLACEHOLDER_ULTHERAPY",
              description: "울쎄라피 프라임 HIFU 리프팅 시술 효과와 과정을 스타피부과 전문의가 직접 설명합니다.",
            },
            {
              title: "써마지 FLX 시술 안내 | 부산 서면 스타피부과",
              videoId: "PLACEHOLDER_THERMAGE",
              description: "4세대 고주파 써마지 FLX 리프팅 시술 효과와 과정을 스타피부과 전문의가 직접 설명합니다.",
            },
            {
              title: "눈밑지방재배치 시술 안내 | 부산 서면 스타피부과",
              videoId: "PLACEHOLDER_EYEBAG",
              description: "눈밑지방재배치 수술 효과와 회복 과정을 스타피부과 전문의가 직접 설명합니다.",
            },
          ]),
        ]}
      />
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* 1. Hero - Full Screen (eager) */}
        <HeroSection />
        <MobileBottomCTA />

        {/* 1-B. 첨단재생의료 실시기관 배너 — SPECIAL EVENT 위 */}
        <div className="section-bg-cream py-6 md:py-8 flex justify-center px-4 md:px-0">
          <a
            href="https://star-pibu.com/notice/90001"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-[92%] md:w-[70%] md:max-w-none mx-auto rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.30)]"
            aria-label="보건복지부 지정 첨단재생의료 실시기관 공지 보기"
          >
            <picture>
              {/* 모바일 WebP (768px 미만) — 273KB PNG → 24KB WebP */}
              <source
                media="(max-width: 767px)"
                srcSet="/api/storage/regen-medicine-banner-mobile_1fe7ea14_b3d1a716.webp"
                type="image/webp"
              />
              {/* 모바일 PNG 폴백 (768px 미만) */}
              <source
                media="(max-width: 767px)"
                srcSet="/api/storage/regen-medicine-banner-mobile_1fe7ea14.png"
              />
              {/* PC WebP (768px 이상) — 374KB PNG → 36KB WebP */}
              <source
                media="(min-width: 768px)"
                srcSet="/api/storage/regen-medicine-banner-pc2_e6271aa5_5f2ea459.webp"
                type="image/webp"
              />
              {/* PC PNG 폴백 (768px 이상) */}
              <source
                media="(min-width: 768px)"
                srcSet="/api/storage/regen-medicine-banner-pc2_e6271aa5.png"
              />
              <img
                src="/api/storage/regen-medicine-banner-pc2_e6271aa5.png"
                alt="보건복지부 지정 체담재생의료 실시기관 — 스타피부과는 보건복지부로부터 체담재생의료 실시기관에 지정됐습니다"
                className="w-full h-auto block"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </a>
        </div>

        {/* 2. SPECIAL EVENT — [Option A] 순백→크림 오프화이트 */}
        <div className="section-bg-cream">
          <Suspense fallback={<SectionFallback minH="min-h-[640px]" layout="cards-3" bg="#ffffff" />}>
            <SpecialEventSection />
          </Suspense>
        </div>

        {/* 3. Doctors */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-warm">
            <Suspense fallback={<SectionFallback minH="min-h-[520px]" layout="cards-3" bg="linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" />}>
              <DoctorsSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 4. Treatments + Equipment — [Option A] 순백→크림 소프트 */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-cream-soft">
            <Suspense fallback={<SectionFallback minH="min-h-[720px]" layout="cards-3" bg="#ffffff" />}>
              <TreatmentsEquipmentSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 5. Management Devices — [Option B] 다크 네이비→다크 브라운 */}
        <ScrollAnimationWrapper
          animationType="fade-in-slow"
        >
          <div className="section-bg-dark-brown">
            <Suspense fallback={<SectionFallback minH="min-h-[560px]" variant="dark" layout="cards-4" bg="linear-gradient(180deg, #1A2744 0%, #243358 100%)" />}>
              <ManagementDevicesSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 6. Philosophy — [Option A] offwhite→크림 */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-cream">
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" layout="stats" bg="#FAFAFA" />}>
              <PhilosophySection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 6-2. Results & Statistics */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-gold-soft">
            <Suspense fallback={<SectionFallback minH="min-h-[440px]" layout="cards-3" bg="linear-gradient(135deg, #F5F1ED 0%, #EDE8E2 100%)" />}>
              <ResultsStatisticsSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 7. Facility Gallery — [Option A] 순백→웜 알트 */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-warm-alt">
            <Suspense fallback={<SectionFallback minH="min-h-[560px]" layout="gallery" bg="#ffffff" />}>
              <FacilitySection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 8. Patient Reviews */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-warm">
            <Suspense fallback={<SectionFallback minH="min-h-[480px]" layout="cards-3" bg="linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" />}>
              <ReviewsSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 8-2. YouTube Channel — [Option B] 다크 딥→다크 브라운 미드 */}
        <ScrollAnimationWrapper
          animationType="fade-in-slow"
        >
          <div className="section-bg-dark-brown-mid">
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" variant="dark" bg="linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" />}>
              <YouTubeSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 9. FAQ — [Option A] 순백→크림 */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-cream">
            <Suspense fallback={<SectionFallback minH="min-h-[560px]" layout="list" bg="#ffffff" />}>
              <FAQSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 최근 공지사항 섹션 */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <Suspense fallback={<SectionFallback minH="min-h-[300px]" layout="list" bg="#FAF8F5" />}>
            <RecentNoticesSection lang="ko" />
          </Suspense>
        </ScrollAnimationWrapper>

        {/* 10. Location & Contact — [Option B] 다크 딥→다크 브라운 */}
        <ScrollAnimationWrapper
          animationType="fade-in-slow"
        >
          <div className="section-bg-dark-brown">
            <Suspense fallback={<SectionFallback minH="min-h-[560px]" variant="dark" bg="linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" />}>
              <ContactSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>
      </main>

      {/* Footer */}
      <Footer />

      {/* Welcome Popup — lazy loaded + idle mount: 초기 번들/query 비용 제거
           첫 렌더 후 2초 idle 시점에 마운트하여 LCP/FID에 영향 없음 */}
      {popupReady && (
        <Suspense fallback={null}>
          <WelcomePopup />
        </Suspense>
      )}
    </div>
  );
}
