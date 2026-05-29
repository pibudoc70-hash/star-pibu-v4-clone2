/**
 * English Landing Page - /en
 * SEO: All content rendered in English for Google/Yahoo indexing
 * Strategy: Uses same components as Home.tsx, forces lang="en" on mount
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

export default function LandingEN() {
  const { setLang } = useLang();

  // Force English on mount
  useEffect(() => {
    setLang("en");
    document.title = "Star Dermatology Busan | Ultherapy · Thermage FLX · Under-Eye Fat Repositioning | Seomyeon";
    const metas: { name?: string; property?: string; content: string }[] = [
      { name: "description", content: "Star Dermatology in Busan Seomyeon. Board-certified dermatologist with 20+ years experience. Ultherapy Prime, Thermage FLX, Under-Eye Fat Repositioning, Pico Laser and 50+ premium treatments. Foreign patients welcome." },
      { name: "keywords", content: "Busan dermatology, Seomyeon skin clinic, Ultherapy Busan, Thermage Busan, under-eye surgery Korea, pico laser Busan, Korean skin clinic, Star Dermatology, Busan aesthetic clinic, English dermatology Korea" },
      { property: "og:title", content: "Star Dermatology Busan | Ultherapy · Thermage FLX · Under-Eye Fat Repositioning" },
      { property: "og:description", content: "Board-certified dermatologist in Busan Seomyeon. 20+ years experience, 4,000+ under-eye procedures, 50+ premium laser devices. Foreign patients welcome." },
      { property: "og:url", content: "https://star-pibu.com/en" },
      { property: "og:locale", content: "en_US" },
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
      "name": "Star Dermatology",
      "url": "https://star-pibu.com/en",
      "telephone": "+82-51-818-2300",
      "address": { "@type": "PostalAddress", "streetAddress": "74 Seomyeon-ro, ION City Building 4F", "addressLocality": "Busanjin-gu", "addressRegion": "Busan", "postalCode": "47189", "addressCountry": "KR" },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "19:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:30", "closes": "15:00" }
      ],
      "medicalSpecialty": "Dermatology",
      "inLanguage": "en",
      "knowsAbout": ["Ultherapy Prime", "Thermage FLX", "Under-Eye Fat Repositioning", "Laser Toning", "Pico Laser", "Rejuran Healer"]
    };
    let scriptEl = document.querySelector<HTMLScriptElement>('script[data-ld="en-medical"]');
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-ld", "en-medical");
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);
    return () => {
      document.title = "부산 서면 스타피부과 | 피부과 전문의 울쎄라 써마지 리프팅 시술";
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
