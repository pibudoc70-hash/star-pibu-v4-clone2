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
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">
      {/* 라벨 바 — 골드 톤 픽스드 (shimmer 아님) */}
      <div
        style={{
          height: '10px', width: '4rem', borderRadius: '999px',
          background: isDark ? 'rgba(196,168,130,0.35)' : 'rgba(196,168,130,0.42)',
        }}
      />
      <div className={`h-6 w-48 rounded ${s}`} style={{ animationDelay: "0.1s" }} />
      <div className={`h-4 w-64 rounded ${s}`} style={{ animationDelay: "0.2s" }} />
    </div>
  );

  // 레이아웃별 콘텐츠 — content-first preview state (실제 카드 구조 반영)
  let content: React.ReactNode;
  if (layout === "cards-3") {
    // 3열 카드 그리드: 이미지 영역 + 텍스트 라인 (이벤트/의료진/시술 카드 구조)
    content = (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,168,130,0.14)',
            }}>
            {/* 이미지 영역 — aspect-ratio 3/2 */}
            <div className={`${s} w-full`} style={{ aspectRatio: '3/2', animationDelay: `${i * 0.1}s` }} />
            {/* 텍스트 영역 */}
            <div className="p-4 flex flex-col gap-2.5">
              {/* 배지 라벨 — 골드 픽스드 */}
              <div style={{
                height: '12px', width: '3.5rem', borderRadius: '999px',
                background: isDark ? 'rgba(196,168,130,0.25)' : 'rgba(196,168,130,0.32)',
                animationDelay: `${i * 0.1 + 0.05}s`,
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
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,168,130,0.14)',
            }}>
            {/* 이미지 영역 — 정사각형 비율 */}
            <div className={`${s} w-full`} style={{ aspectRatio: '1/1', animationDelay: `${i * 0.08}s` }} />
            {/* 텍스트 영역 */}
            <div className="p-3 flex flex-col gap-2">
              {/* 배지 라벨 — 골드 픽스드 */}
              <div style={{
                height: '10px', width: '2.8rem', borderRadius: '999px',
                background: isDark ? 'rgba(196,168,130,0.25)' : 'rgba(196,168,130,0.32)',
              }} />
              <div className={`h-4 w-4/5 rounded ${s}`} style={{ animationDelay: `${i * 0.08 + 0.06}s` }} />
              <div className={`h-3 w-3/5 rounded ${s}`} style={{ animationDelay: `${i * 0.08 + 0.12}s` }} />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (layout === "list") {
    // 목록형 (FAQ): 아코디언 행 구조
    content = (
      <div className="flex flex-col gap-2 w-full max-w-2xl px-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl flex items-center gap-3 px-4"
            style={{
              height: '56px',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,168,130,0.14)',
            }}>
            {/* Q 아이콘 힌트 — 골드 픽스드 */}
            <div style={{
              width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
              background: isDark ? 'rgba(196,168,130,0.25)' : 'rgba(196,168,130,0.32)',
            }} />
            <div className={`h-3.5 rounded flex-1 ${s}`} style={{ width: `${60 + (i % 3) * 10}%`, animationDelay: `${i * 0.08 + 0.05}s` }} />
          </div>
        ))}
      </div>
    );
  } else if (layout === "gallery") {
    // 갤러리 (Facility): 메인 + 서브 2장 구조
    // gallery는 이미지 자체가 카드이므로 border/shadow를 shimmer 위에 overlay로 처리
    const galleryCardStyle = {
      boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
      outline: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,168,130,0.14)',
      outlineOffset: '-1px',
    };
    content = (
      <div className="flex gap-3 w-full max-w-4xl px-4" style={{ height: '300px' }}>
        <div className={`rounded-2xl flex-1 ${s}`} style={{ animationDelay: '0s', minWidth: 0, ...galleryCardStyle }} />
        <div className="flex flex-col gap-3" style={{ width: '38%', flexShrink: 0 }}>
          <div className={`rounded-2xl flex-1 ${s}`} style={{ animationDelay: '0.1s', ...galleryCardStyle }} />
          <div className={`rounded-2xl flex-1 ${s}`} style={{ animationDelay: '0.2s', ...galleryCardStyle }} />
        </div>
      </div>
    );
  } else if (layout === "stats") {
    // 통계 카드 (ResultsStatistics): 수치 + 라벨 카드 4개
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl p-5 flex flex-col items-center gap-3"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,168,130,0.14)',
            }}>
            {/* 아이콘 원 — 골드 픽스드 힌트 */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: isDark ? 'rgba(196,168,130,0.18)' : 'rgba(196,168,130,0.22)',
            }} />
            <div className={`h-7 w-16 rounded ${s}`} style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
            <div className={`h-3 w-14 rounded ${s}`} style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
          </div>
        ))}
      </div>
    );
  } else {
    // default: 범용 카드 그리드
    content = (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl px-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.96)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(196,168,130,0.14)',
            }}>
            <div className={`${s} w-full`} style={{ aspectRatio: '4/3', animationDelay: `${i * 0.12}s` }} />
            <div className="p-3 flex flex-col gap-2">
              <div style={{
                height: '10px', width: '2.8rem', borderRadius: '999px',
                background: isDark ? 'rgba(196,168,130,0.25)' : 'rgba(196,168,130,0.32)',
              }} />
              <div className={`h-4 w-4/5 rounded ${s}`} style={{ animationDelay: `${i * 0.12 + 0.06}s` }} />
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

  // 다른 페이지에서 섹션 메뉴 클릭 시 해당 섹션으로 자동 스크롤
  // lazy 섹션은 300ms 내 렌더링이 보장되지 않으므로 MutationObserver로 DOM 대기
  //
  // [FIX v2] URL hash 대신 sessionStorage(__star_scroll_to)를 사용해
  // URL에 hash가 남지 않도록 한다. hash가 URL에 남으면 다음 방문 시
  // 자동 스크롤이 발생하는 버그가 있었음.
  // 외부 직접 진입(새 탭, 북마크, 외부 링크)이나 새로고침 시에는
  // hash를 무시하고 상단으로 이동한다.
  useEffect(() => {
    // [FIX v3] 완전 재작성 - 초기 진입 시 무조건 상단으로 이동
    // URL hash는 일체 무시하고 sessionStorage만 사용
    //
    // 문제 원인:
    // 1. useHeaderState에서 history.replaceState로 URL에 #events 등 hash 저장
    // 2. 브라우저 scroll restoration이 이전 스크롤 위치 복원
    // 3. Home.tsx의 hash 스크롤 useEffect가 이를 읽어 자동 스크롤
    //
    // 해결 방법:
    // - 진입 시 URL hash를 즉시 제거하고 상단으로 이동
    // - 다른 페이지에서 메뉴 클릭 시 sessionStorage로 스크롤 대상 전달

    // [FIX v4] 언어 변경 시 scroll restoration 무시
    // sessionStorage에 "__star_force_scroll_top" 플래그가 있으면
    // 브라우저의 scroll restoration을 무시하고 상단으로 이동
    const forceScrollTop = sessionStorage.getItem("__star_force_scroll_top");
    if (forceScrollTop) {
      sessionStorage.removeItem("__star_force_scroll_top");
      // 브라우저의 scroll restoration 무시
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // URL에 hash가 있으면 즉시 제거 + 상단으로 이동 (어떤 경우든 hash를 URL에 남기지 않음)
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // sessionStorage에서 스크롤 대상 확인 (다른 페이지에서 메뉴 클릭 시)
    const sessionTarget = sessionStorage.getItem("__star_scroll_to");
    if (!sessionTarget) {
      // 스크롤 대상이 없으면 상단으로 이동 (이미 ScrollToTop이 처리하지만 이중 보장)
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    // sessionStorage에 스크롤 대상이 있으면 해당 섹션으로 스크롤
    sessionStorage.removeItem("__star_scroll_to");
    const id = sessionTarget;

    const scrollToElement = (el: Element) => {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      const offset = header ? header.offsetHeight + 8 : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    const existing = document.getElementById(id);
    if (existing) { scrollToElement(existing); return; }

    // lazy 섹션이 마운트될 때까지 MutationObserver로 대기 (최대 5초)
    const observer = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) { observer.disconnect(); clearTimeout(timeout); scrollToElement(el); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 5000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

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
              answer: "눈밑지방재배치술은 눈 아래 과잉 지방을 제거하지 않고 꺼진 눈물고랑 부위로 재배치하여 자연스러운 눈밑 라인을 형성하는 시술입니다. 스타피부과 조시형 원장은 4,000례 이상의 시술 경험을 보유하고 있습니다."
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

        {/* 2. SPECIAL EVENT — 순수 흰색, Hero 바로 아래 (즉시 마운트 + Suspense)
            deferMount=false: Hero 스크롤 직후 바로 보이므로 선로딩 유지
            단, Suspense로 감싸 코드 스플리팅 유지 */}
        <div className="bg-white">
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

        {/* 4. Treatments + Equipment */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="bg-white">
            <Suspense fallback={<SectionFallback minH="min-h-[720px]" layout="cards-3" bg="#ffffff" />}>
              <TreatmentsEquipmentSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 5. Management Devices */}
        <ScrollAnimationWrapper
          animationType="fade-in-slow"
        >
          <div className="section-bg-dark-navy">
            <Suspense fallback={<SectionFallback minH="min-h-[560px]" variant="dark" layout="cards-4" bg="linear-gradient(180deg, #1A2744 0%, #243358 100%)" />}>
              <ManagementDevicesSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 6. Philosophy */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="section-bg-offwhite">
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

        {/* 7. Facility Gallery */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="bg-white">
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

        {/* 8-2. YouTube Channel */}
        <ScrollAnimationWrapper
          animationType="fade-in-slow"
        >
          <div className="section-bg-dark-deep">
            <Suspense fallback={<SectionFallback minH="min-h-[400px]" variant="dark" bg="linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" />}>
              <YouTubeSection />
            </Suspense>
          </div>
        </ScrollAnimationWrapper>

        {/* 9. FAQ */}
        <ScrollAnimationWrapper
          animationType="fade-in"
        >
          <div className="bg-white">
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

        {/* 10. Location & Contact */}
        <ScrollAnimationWrapper
          animationType="fade-in-slow"
        >
          <div className="section-bg-dark-deep">
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
