/**
 * Japanese Landing Page - /ja
 * SEO: All content rendered in Japanese for Google/Yahoo Japan indexing
 * Strategy: Uses same components as Home.tsx, forces lang="ja" on mount
 */
import { useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import Header from "@/components/Header";
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
    document.title = "釜山スタ皮膚科 | ウルセラピー・サーマジFLX・目の下の脂肪再配置 | 西面";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "釜山西面のスタ皮膚科。皮膚科専門医が20年以上の経験でウルセラピープライム、サーマジFLX、目の下の脂肪再配置、ピコレーザーなど50種以上の施術を提供。外国人患者様歓迎。" },
      { name: "keywords", content: "釜山皮膚科, 西面スキンクリニック, ウルセラピー釜山, サーマジ釜山, 目の下の脂肪再配置 韓国, ピコレーザー釜山, 韓国美容皮膚科, スタ皮膚科, 日本語対応 釜山" },
      { property: "og:title", content: "釜山スタ皮膚科 | ウルセラピー・サーマジFLX・目の下の脂肪再配置" },
      { property: "og:description", content: "釜山西面の皮膚科専門医クリニック。20年以上の経験、目の下の脂肪再配置4,000件以上、50種以上のレーザー機器。外国人患者様歓迎。" },
      { property: "og:url", content: "https://star-pibu.com/ja" },
      { property: "og:locale", content: "ja_JP" },
    ];
    metas.forEach(({ name, property, content }) => {
      let el = name
        ? document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
        : document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name) el.setAttribute("name", name);
        if (property) el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    });
    // JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "スタ皮膚科",
      "alternateName": "Star Dermatology",
      "url": "https://star-pibu.com/ja",
      "telephone": "+82-51-818-2300",
      "address": { "@type": "PostalAddress", "streetAddress": "西面路74 IONシティビル4F", "addressLocality": "釜山鎮区", "addressRegion": "釜山", "postalCode": "47189", "addressCountry": "KR" },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "19:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:30", "closes": "15:00" }
      ],
      "medicalSpecialty": "Dermatology",
      "inLanguage": "ja",
      "knowsAbout": ["ウルセラピープライム", "サーマジFLX", "目の下の脂肪再配置", "レーザートーニング", "ピコレーザー", "リジュラン"]
    };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="ja-medical"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-ld", "ja-medical");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);
    return () => {
      document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술";
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
