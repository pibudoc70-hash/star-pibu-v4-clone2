/**
 * Chinese Landing Page - /zh
 * SEO: All content rendered in Chinese for Google/Baidu indexing
 * Strategy: Uses same components as Home.tsx, forces lang="zh" on mount
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

export default function LandingZH() {
  const { setLang } = useLang();

  // Force Chinese on mount
  useEffect(() => {
    setLang("zh", false);
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
        title="釜山星皮肤科 | 超声刀·热玻吵FLX·眼袋脂肪重置 | 西面"
        description="釜山西面星皮肤科。皮肤科专科医生拥有20年以上经验，提供超声刀、热玻吵FLX、眼袋脂肪重置、皮秒激光筐50余种优质项目。欢迎外国患者，提供中文和询。"
        keywords="釜山皮肤科, 西面皮肤诊所, 超声刀釜山, 热玻吵釜山, 眼袋手术韓国, 皮秒激光釜山, 韓国美容皮肤科, 星皮肤科, 釜山整形美容, 中文皮肤科"
        canonical="https://www.star-pibu.com/zh"
        ogImage="https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e/울쎄라피프라임_1_0daba485.png"
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "MedicalBusiness",
          "name": "星皮肤科",
          "alternateName": "Star Dermatology",
          "url": "https://www.star-pibu.com/zh",
          "telephone": "+82-51-818-2300",
          "address": { "@type": "PostalAddress", "streetAddress": "西面路74 ION城市大厨4层", "addressLocality": "釜山镇区", "addressRegion": "釜山", "postalCode": "47189", "addressCountry": "KR" },
          "medicalSpecialty": "Dermatology",
          "inLanguage": "zh",
          "knowsAbout": ["超声刀", "热玸吵FLX", "眼袋脂肪重置", "激光嫩肤", "皮秒激光", "婴儿针"]
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
