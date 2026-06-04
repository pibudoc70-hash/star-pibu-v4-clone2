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
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd } from "@/components/SeoHead";
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
function SectionFallback() {
  return <div className="py-16 md:py-24" aria-hidden="true" />;
}

export default function Home() {
  // 다른 페이지에서 /#about 등으로 이동 시 해당 섹션으로 자동 스크롤
  // lazy 섹션은 300ms 내 렌더링이 보장되지 않으므로 MutationObserver로 DOM 대기
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);

    const scrollToElement = (el: Element) => {
      const offset = 80;
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
      <SeoHead
        title="부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅, 색소질환, 다양한 레이저 보유"
        description="부산 서면 스타피부과는 20년 경력 피부과 전문의가 직접 진료합니다. 울쎄라, 써마지 리프팅, 색소질환 치료, 다양한 레이저 시술 보유. 눈밑지방재배치, 리쥬란 등 프리미엄 시술 전문. 온라인 예약 가능."
        keywords="부산피부과, 울쎄라, 써마지, 리프팅, 색소질환, 레이저치료, 리쥬란, 눈밑지방, 피부과전문의, 부산리프팅, 피부관리"
        canonical="https://www.star-pibu.com/"
        ogImage="https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/울쎄라피프라임_1_0daba485.png"
        ogLocale="ko_KR"
        hreflangs={COMMON_HREFLANGS}
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

        {/* 2. SPECIAL EVENT - 흰색 배경 (eager) */}
        <div className="bg-white">
          <SpecialEventSection />
        </div>

        {/* 3. Doctors - 베이지 배경 (eager) */}
        <div className="bg-[#F5F1ED]">
          <DoctorsSection />
        </div>

        {/* 4. Treatments + Equipment - 흰색 배경 (eager) */}
        <div className="bg-white">
          <TreatmentsEquipmentSection />
        </div>

        {/* 5. Management Devices - 베이지 배경 (lazy) */}
        <div className="bg-[#F5F1ED]">
          <Suspense fallback={<SectionFallback />}>
            <ManagementDevicesSection />
          </Suspense>
        </div>

        {/* 6. Philosophy - 흰색 배경 (lazy) */}
        <div className="bg-white">
          <Suspense fallback={<SectionFallback />}>
            <PhilosophySection />
          </Suspense>
        </div>

        {/* 6-2. Results & Statistics - 베이지 배경 (lazy) */}
        <div className="bg-[#F5F1ED]">
          <Suspense fallback={<SectionFallback />}>
            <ResultsStatisticsSection />
          </Suspense>
        </div>

        {/* 7. Facility Gallery - 흰색 배경 (lazy) */}
        <div className="bg-white">
          <Suspense fallback={<SectionFallback />}>
            <FacilitySection />
          </Suspense>
        </div>

        {/* 8. Patient Reviews - 베이지 배경 (lazy) */}
        <div className="bg-[#F5F1ED]">
          <Suspense fallback={<SectionFallback />}>
            <ReviewsSection />
          </Suspense>
        </div>

        {/* 8-2. YouTube Channel - 흰색 배경 (lazy) */}
        <div className="bg-white">
          <Suspense fallback={<SectionFallback />}>
            <YouTubeSection />
          </Suspense>
        </div>

        {/* 9. FAQ - 베이지 배경 (lazy) */}
        <div className="bg-[#F5F1ED]">
          <Suspense fallback={<SectionFallback />}>
            <FAQSection />
          </Suspense>
        </div>

        {/* 9-2. Reservation - 흰색 배경 (lazy) */}
        <div className="bg-white">
          <Suspense fallback={<SectionFallback />}>
            <ReservationSection />
          </Suspense>
        </div>

        {/* 10. Location & Contact - 베이지 배경 (lazy) */}
        <div className="bg-[#F5F1ED]">
          <Suspense fallback={<SectionFallback />}>
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
