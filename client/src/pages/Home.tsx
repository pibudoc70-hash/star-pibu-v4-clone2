/**
 * Home Page - STAR 피부과
 * 디자인: 모던 클리니컬 엣지 - 민트-네이비 듀오톤
 * TreatmentsSection + EquipmentSection → TreatmentsEquipmentSection 통합
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import DoctorsSection from "@/components/DoctorsSection";
import TreatmentsEquipmentSection from "@/components/TreatmentsEquipmentSection";
import ManagementDevicesSection from "@/components/ManagementDevicesSection";
import SpecialEventSection from "@/components/SpecialEventSection";
import ResultsSection from "@/components/ResultsSection";
import FacilitySection from "@/components/FacilitySection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import WelcomePopup from "@/components/WelcomePopup";
import LangSwitcher from "@/components/LangSwitcher";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  const { user } = useAuth();
  void user; // auth state available for future use

  // 페이지 제목 설정 (SEO 최적화)
  useEffect(() => {
    document.title = "스타피부과 | 부산 피부과 전문의 울쎼라 써마지 리프팅 시술";
  }, []);

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
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* 1. Hero - Full Screen */}
        <HeroSection />

        {/* 2. SPECIAL EVENT - 특별 이벤트 섹션 */}
        <SpecialEventSection />

        {/* 3. Doctors - 의료진 소개 (3명) */}
        <DoctorsSection />

        {/* 4. Treatments + Equipment - 시술 안내 & 장비 소개 통합 */}
        <TreatmentsEquipmentSection />

        {/* 5. Management Devices - 관리장비 */}
        <ManagementDevicesSection />

        {/* 6. About / Philosophy - 스타피부과를 선택하는 이유 (숨김) */}
        {/* <PhilosophySection /> */}

        {/* 6. Before & After Results */}
        <ResultsSection />

        {/* 7. Facility Gallery - 시설 갤러리 */}
        <FacilitySection />

        {/* 8. Patient Reviews - 환자 후기 */}
        <ReviewsSection />

        {/* 9. FAQ - 자주 묻는 질문 */}
        <FAQSection />

        {/* 10. Location & Contact - 오시는 길 */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA - Always Visible */}
      <FloatingCTA />

      {/* Welcome Popup */}
      <WelcomePopup />

      {/* Language Switcher - Floating */}
      <LangSwitcher />
    </div>
  );
}
