/**
 * Japanese Landing Page - /ja
 * SEO: All content rendered in Japanese for Google/Yahoo Japan indexing
 * Strategy: Uses same components as Home.tsx, forces lang="ja" on mount
 */
import { useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import Header from "@/components/Header";
import SeoHead from "@/components/SeoHead";
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
import LangSwitcher from "@/components/LangSwitcher";

export default function LandingJA() {
  const { setLang } = useLang();

  // Force Japanese on mount
  useEffect(() => {
    setLang("ja", false);
    return () => {
      setLang("ko", false);
    };
  }, [setLang]);

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
        title="釜山スタ皮膚科 | ウルセラピー・サーマジFLX・目の下の脂肪再配置 | 西面"
        description="釜山西面のスタ皮膚科。皮膚科専門医が20年以上の経験でウルセラピープライム、サーマジFLX、目の下の脂肪再配置、ピコレーザーなど50種以上の施術を提供。外国人患者様歓迎。"
        keywords="釜山皮膚科, 西面スキンクリニック, ウルセラピー釜山, サーマジ釜山, 目の下の脂肪再配置 韓国, ピコレーザー釜山, 韓国美容皮膚科, スタ皮膚科, 日本語対応 釜山"
        canonical="https://www.star-pibu.com/ja"
        ogImage="https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/울쎄라피프라임_1_0daba485.png"
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "スタ皮膚科",
          "alternateName": "Star Dermatology",
          "url": "https://www.star-pibu.com/ja",
          "telephone": "+82-51-818-2300",
          "address": { "@type": "PostalAddress", "streetAddress": "西面路74 IONシティビル4F", "addressLocality": "釜山鎮区", "addressRegion": "釜山", "postalCode": "47189", "addressCountry": "KR" },
          "medicalSpecialty": "Dermatology",
          "inLanguage": "ja",
          "knowsAbout": ["ウルセラピープライム", "サーマジFLX", "目の下の脂肪再配置", "レーザートーニング", "ピコレーザー", "リジュラン"]
        }]}
        hreflangs={[
          { hreflang: "ko", href: "https://www.star-pibu.com/" },
          { hreflang: "en", href: "https://www.star-pibu.com/en" },
          { hreflang: "ja", href: "https://www.star-pibu.com/ja" },
          { hreflang: "zh", href: "https://www.star-pibu.com/zh" },
          { hreflang: "x-default", href: "https://www.star-pibu.com/" },
        ]}
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
      <LangSwitcher />
    </div>
  );
}
