/**
 * Home Page - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * TreatmentsSection + EquipmentSection → TreatmentsEquipmentSection 통합
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd } from "@/components/SeoHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import DoctorsSection from "@/components/DoctorsSection";
import TreatmentsEquipmentSection from "@/components/TreatmentsEquipmentSection";
import ManagementDevicesSection from "@/components/ManagementDevicesSection";
import SpecialEventSection from "@/components/SpecialEventSection";
import ResultsSection from "@/components/ResultsSection";
import ResultsStatisticsSection from "@/components/ResultsStatisticsSection";
import FacilitySection from "@/components/FacilitySection";
import ReviewsSection from "@/components/ReviewsSection";
import YouTubeSection from "@/components/YouTubeSection";
import FAQSection from "@/components/FAQSection";
import ReservationSection from "@/components/ReservationSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import WelcomePopup from "@/components/WelcomePopup";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user } = useAuth();
  void user; // auth state available for future use



  // 다른 페이지에서 /#about 등으로 이동 시 해당 섹션으로 자동 스크롤
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    // 페이지 렌더링 완료 후 스크롤
    const timer = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 300);
    return () => clearTimeout(timer);
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
        {/* 1. Hero - Full Screen */}
        <HeroSection />

        {/* 2. SPECIAL EVENT - 특별 이벤트 섹션 - 흰색 배경 */}
        <div style={{ background: "#FFFFFF" }}>
          <SpecialEventSection />
        </div>

        {/* 3. Doctors - 의료진 소개 (3명) - 베이지 배경 */}
        <div style={{ background: "#F5F1ED" }}>
          <DoctorsSection />
        </div>

        {/* 4. Treatments + Equipment - 시술 안내 & 장비 소개 통합 - 흰색 배경 */}
        <div style={{ background: "#FFFFFF" }}>
          <TreatmentsEquipmentSection />
        </div>

        {/* 4-2. Treatments + Equipment Section 2 - DB 연동 (관리자 등록) - 별도 페이지로 이동 */}
        {/* <TreatmentsEquipmentSectionV2 /> */}

        {/* 5. Management Devices - 관리장비 - 베이지 배경 */}
        <div style={{ background: "#F5F1ED" }}>
          <ManagementDevicesSection />
        </div>

        {/* 6. About / Philosophy - 스타피부과를 선택하는 이유 - 흰색 배경 */}
        <div style={{ background: "#FFFFFF" }}>
          <PhilosophySection />
        </div>

        {/* 6. Before & After Results (숨김) */}
        {/* <ResultsSection /> */}

        {/* 6-2. Results & Statistics - 스타피부과를 선택하는 이유 (의료진 소개 + 통계) - 베이지 배경 */}
        <div style={{ background: "#F5F1ED" }}>
          <ResultsStatisticsSection />
        </div>

        {/* 7. Facility Gallery - 시설 갤러리 - 흰색 배경 */}
        <div style={{ background: "#FFFFFF" }}>
          <FacilitySection />
        </div>

        {/* 8. Patient Reviews - 환자 후기 - 베이지 배경 */}
        <div style={{ background: "#F5F1ED" }}>
          <ReviewsSection />
        </div>

        {/* 8-2. YouTube Channel - 유튜브 채널 - 흰색 배경 */}
        <div style={{ background: "#FFFFFF" }}>
          <YouTubeSection />
        </div>

        {/* 9. FAQ - 자주 묻는 질문 - 베이지 배경 */}
        <div style={{ background: "#F5F1ED" }}>
          <FAQSection />
        </div>

        {/* 9-2. Reservation - 예약 신청 - 흰색 배경 */}
        <div style={{ background: "#FFFFFF" }}>
          <ReservationSection />
        </div>

        {/* 10. Location & Contact - 오시는 길 - 베이지 배경 */}
        <div style={{ background: "#F5F1ED" }}>
          <ContactSection />
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
