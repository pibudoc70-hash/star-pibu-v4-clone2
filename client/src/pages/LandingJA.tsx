/**
 * Japanese Landing Page - /ja
 * SEO: All content rendered in Japanese for Google/Yahoo Japan indexing
 * Strategy: Uses same components as Home.tsx, forces lang="ja" on mount
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

export default function LandingJA() {
  // 언어 설정은 App.tsx의 HtmlLangUpdater가 URL(/ja) 기반으로 자동 처리
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
        title="釜山スター皮膚科 | ウルセラピープライム・サーマジFLX・目の下の脂肪再配置 | 西面クリニック"
        description="釜山西面のスター皮膚科。皮膚科専門医が20年以上の豊富な臨床経験で、ウルセラピープライム、サーマジFLX、目の下の脂肪再配置、ピコレーザーなど50種以上の施術を提供。日本語対応・外国人患者様歓迎。"
        keywords="釜山皮膚科, 西面クリニック, ウルセラピー釜山, サーマジ釜山, 目の下の脂肪再配置 韓国, ピコレーザー釜山, 韓国美容皮膚科, スター皮膚科, 釜山西面皮膚科, 日本語対応 釜山"
        canonical="https://www.star-pibu.com/ja"
        ogImage="https://www.star-pibu.com/og-image.jpg"
        jsonLd={[
          buildBreadcrumbJsonLd([
            { name: "ホーム", url: "https://www.star-pibu.com/ja" },
          ]),
        ]}
        ogLocale="ja_JP"
        hreflangs={COMMON_HREFLANGS}
        includeMedicalSchema={true}
      />
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
