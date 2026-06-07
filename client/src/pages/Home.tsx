/**
 * Home Page - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * TreatmentsSection + EquipmentSection → TreatmentsEquipmentSection 통합
 *
 * 성능 최적화:
 * - 폴드 위 섹션(Hero, SpecialEvent, Doctors, Treatments): eager import
 * - 폴드 아래 섹션: React.lazy + Suspense로 코드 스플리팅
 * - 배경색: inline style → CSS 유틸리티 클래스 (bg-white / bg-[#F5F1ED])
 */
import { lazy, Suspense, useEffect } from "react";
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd, SITE_NAME_LOCALIZED, OG_IMAGE_LOCALIZED } from "@/components/SeoHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SpecialEventSection from "@/components/SpecialEventSection";
import DoctorsSection from "@/components/DoctorsSection";
import TreatmentsEquipmentSection from "@/components/TreatmentsEquipmentSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import WelcomePopup from "@/components/WelcomePopup";

// 폴드 아래 섹션 — lazy loading으로 초기 번들 크기 감소
const ManagementDevicesSection = lazy(() => import("@/components/ManagementDevicesSection"));
const PhilosophySection = lazy(() => import("@/components/PhilosophySection"));
const ResultsStatisticsSection = lazy(() => import("@/components/ResultsStatisticsSection"));
const FacilitySection = lazy(() => import("@/components/FacilitySection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const YouTubeSection = lazy(() => import("@/components/YouTubeSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ReservationSection = lazy(() => import("@/components/ReservationSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));

/** 섹션 로딩 중 표시할 최소 스켈레톤 */
// S2-T4: CLS 감소 — 서스펜스 폴백에 min-h 지정으로 레이아웃 시프트 방지
function SectionFallback({ minH = "min-h-[320px]" }: { minH?: string } = {}) {
  return <div className={`${minH} py-16 md:py-24`} aria-hidden="true" />;
}

export default function Home() {
  // 다른 페이지에서 /#about 등으로 이동 시 해당 섹션으로 자동 스크롤
  // lazy 섹션은 300ms 내 렌더링이 보장되지 않으므로 MutationObserver로 DOM 대기
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);

    const scrollToElement = (el: Element) => {
      // Bug Fix: 헤더 높이를 동적으로 계산 (scrolled 상태에 따라 60px 또는 72px)
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      const offset = header ? header.offsetHeight + 8 : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    // 이미 DOM에 있으면 즉시 스크롤
    const existing = document.getElementById(id);
    if (existing) {
      scrollToElement(existing);
      return;
    }

    // lazy 섹션이 마운트될 때까지 MutationObserver로 대기 (최대 5초)
    const observer = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) {
        observer.disconnect();
        clearTimeout(timeout);
        scrollToElement(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
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
        description="부산 서면 스타피부과는 20년 경력 피부과 전문의가 직접 진료합니다. 울쎄라, 써마지 리프팅, 색소질환 치료, 다양한 레이저 시술 보유. 눈밑지방재배치, 리주란 등 프리미엄 시술 전문. 온라인 예약 가능."
        keywords="부산피부과, 울쎄라, 써마지, 리프팅, 색소질환, 레이저치료, 리주란, 눈밑지방, 피부과전문의, 부산리프팅, 피부관리"
        canonical="https://www.star-pibu.com/"
        ogImage={OG_IMAGE_LOCALIZED.ko}
        ogSiteName={SITE_NAME_LOCALIZED.ko}
        ogLocale="ko_KR"
        ogLocaleAlternates={["en_US", "ja_JP", "zh_CN"]}
        hreflangs={COMMON_HREFLANGS}
        includeWebSiteSchema={true}
        includeMedicalSchema={true}
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: "홈", url: "https://www.star-pibu.com/" },
          ]),
        ]}
      />

      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* 1. Hero - Full Screen (eager) */}
        <HeroSection />

        {/* 2. SPECIAL EVENT — 순수 흰색, 상단 여백 증가로 허로 이후 숨 포인트 */}
        <div style={{ background: "#FFFFFF" }}>
          <SpecialEventSection />
        </div>

        {/* 3. Doctors — 따뜻한 크림 오프화이트, 시각적 질감 전환 */}
        <div style={{ background: "linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" }}>
          <DoctorsSection />
        </div>

        {/* 4. Treatments + Equipment — 순수 흰색, 콘텐츠 밀도 높음 */}
        <div style={{ background: "#FFFFFF" }}>
          <TreatmentsEquipmentSection />
        </div>

        {/* 5. Management Devices — 열린 어두운 배경으로 시각적 리듬 전환 */}
        <div style={{ background: "linear-gradient(180deg, #1A2744 0%, #243358 100%)" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[480px]" />}>
            <ManagementDevicesSection />
          </Suspense>
        </div>

        {/* 6. Philosophy — 미니멀 흰색, 여백 강조 */}
        <div style={{ background: "#FAFAFA" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
            <PhilosophySection />
          </Suspense>
        </div>

        {/* 6-2. Results & Statistics — 연한 골드 톤 */}
        <div style={{ background: "linear-gradient(135deg, #F5F1ED 0%, #EDE8E2 100%)" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[320px]" />}>
            <ResultsStatisticsSection />
          </Suspense>
        </div>

        {/* 7. Facility Gallery — 순수 흰색, 이미지 중심 */}
        <div style={{ background: "#FFFFFF" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[560px]" />}>
            <FacilitySection />
          </Suspense>
        </div>

        {/* 8. Patient Reviews — 연한 웸아이보리 */}
        <div style={{ background: "linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[480px]" />}>
            <ReviewsSection />
          </Suspense>
        </div>

        {/* 8-2. YouTube Channel — 어두운 에디토리얼 톤 */}
        <div style={{ background: "linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
            <YouTubeSection />
          </Suspense>
        </div>

        {/* 9. FAQ — 순수 흰색 */}
        <div style={{ background: "#FFFFFF" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
            <FAQSection />
          </Suspense>
        </div>

        {/* 9-2. Reservation — 미니멀 크림 */}
        <div style={{ background: "linear-gradient(180deg, #F9F6F2 0%, #F5F1ED 100%)" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[480px]" />}>
            <ReservationSection />
          </Suspense>
        </div>

        {/* 10. Location & Contact — 다크 네이비 마무리 */}
        <div style={{ background: "linear-gradient(180deg, #1A2744 0%, #0F1A30 100%)" }}>
          <Suspense fallback={<SectionFallback minH="min-h-[400px]" />}>
            <ContactSection />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA - Always Visible */}
      <FloatingCTA />

      {/* Welcome Popup */}
      <WelcomePopup />
    </div>
  );
}
