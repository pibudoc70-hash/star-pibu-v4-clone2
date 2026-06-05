/**
 * English Landing Page - /en
 * SEO: All content rendered in English for Google/Yahoo indexing
 * Strategy: Uses same components as Home.tsx, forces lang="en" on mount
 */
import { useEffect } from "react";
import Header from "@/components/Header";
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd } from "@/components/SeoHead";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import DoctorsSection from "@/components/DoctorsSection";
import TreatmentsEquipmentSection from "@/components/TreatmentsEquipmentSection";
import ManagementDevicesSection from "@/components/ManagementDevicesSection";
import SpecialEventSection from "@/components/SpecialEventSection";
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

export default function LandingEN() {
  // 언어 설정은 App.tsx의 HtmlLangUpdater가 URL(/en) 기반으로 자동 처리
  // Scroll to hash section if present
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
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
        title="Star Dermatology Busan | Ultherapy · Thermage FLX · Under-Eye Fat Repositioning | Seomyeon"
        description="Star Dermatology in Busan Seomyeon. Board-certified dermatologist with 20+ years experience. Ultherapy Prime, Thermage FLX, Under-Eye Fat Repositioning, Pico Laser and 50+ premium treatments. Foreign patients welcome."
        keywords="Busan dermatology, Seomyeon skin clinic, Ultherapy Busan, Thermage Busan, under-eye surgery Korea, pico laser Busan, Korean skin clinic, Star Dermatology, Busan aesthetic clinic, English dermatology Korea"
        canonical="https://www.star-pibu.com/en"
        ogImage="https://www.star-pibu.com/og-image.jpg"
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: "https://www.star-pibu.com/en" },
          ]),
        ]}
        ogLocale="en_US"
        hreflangs={COMMON_HREFLANGS}
        includeMedicalSchema={true}
      />
      {/* [PROD-P2-3] 다국어 랜딩 페이지에도 MedicalBusiness 스키마 삽입 (Google 검색 결과 리치 스니펫) */}
      {/* Fixed Header */}
      <Header />
      {/* Main Content - identical to Home.tsx */}
      <main>
        <HeroSection />

        <div style={{ background: "#FFFFFF" }}>
          <SpecialEventSection />
        </div>

        <div style={{ background: "#F5F1ED" }}>
          <DoctorsSection />
        </div>

        <div style={{ background: "#FFFFFF" }}>
          <TreatmentsEquipmentSection />
        </div>

        <div style={{ background: "#F5F1ED" }}>
          <ManagementDevicesSection />
        </div>

        <div style={{ background: "#FFFFFF" }}>
          <PhilosophySection />
        </div>

        <div style={{ background: "#F5F1ED" }}>
          <ResultsStatisticsSection />
        </div>

        <div style={{ background: "#FFFFFF" }}>
          <FacilitySection />
        </div>

        <div style={{ background: "#F5F1ED" }}>
          <ReviewsSection />
        </div>

        <div style={{ background: "#FFFFFF" }}>
          <YouTubeSection />
        </div>

        <div style={{ background: "#F5F1ED" }}>
          <FAQSection />
        </div>

        <div style={{ background: "#FFFFFF" }}>
          <ReservationSection />
        </div>

        <div style={{ background: "#F5F1ED" }}>
          <ContactSection />
        </div>
      </main>

      <Footer />
      <FloatingCTA />
      <WelcomePopup />
    </div>
  );
}
