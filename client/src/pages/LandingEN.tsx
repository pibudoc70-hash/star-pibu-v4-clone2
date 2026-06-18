/**
 * English Landing Page - /en
 * SEO: All content rendered in English for Google/Yahoo indexing
 * Strategy: Uses same components as Home.tsx, forces lang="en" on mount
 */
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd, buildLocalBusinessJsonLd, buildFAQPageJsonLd, SITE_NAME_LOCALIZED, OG_IMAGE_LOCALIZED } from "@/components/SeoHead";
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
import RecentNoticesSection from "@/components/RecentNoticesSection";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";

export default function LandingEN() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 언어 설정은 App.tsx의 HtmlLangUpdater가 URL(/en) 기반으로 자동 처리
  // Scroll to hash section if present
  // [FIX] 언어 변경 시 hash 스크롤 방지: sessionStorage 플래그 확인
  useEffect(() => {
    // 언어 변경으로 인한 페이지 로드인 경우 hash 스크롤 무시
    const forceTop = sessionStorage.getItem("__star_force_scroll_top");
    if (forceTop) {
      sessionStorage.removeItem("__star_force_scroll_top");
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
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
        canonical="https://star-pibu.com/en"
        ogImage={OG_IMAGE_LOCALIZED.en}
        ogSiteName={SITE_NAME_LOCALIZED.en}
        jsonLd={[
          buildLocalBusinessJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "Home", url: "https://star-pibu.com/en" },
          ]),
          buildFAQPageJsonLd([
            /* ── Clinic Info ── */
            { question: "Where is Star Dermatology located?", answer: "Star Dermatology is located at 74 Seomyeon-ro, Busanjin-gu, Busan (ION City Building, 4F). It is a 5-minute walk from Seomyeon Station on Busan Metro Lines 1 and 2. Phone: +82-51-818-2300" },
            { question: "What are the clinic hours?", answer: "Monday–Friday 10:00–19:00, Saturday 09:30–15:00. Closed on Sundays and public holidays." },
            { question: "What treatments does Star Dermatology specialize in?", answer: "Star Dermatology offers over 50 premium laser and aesthetic procedures including Ultherapy Prime, Thermage FLX, under-eye fat repositioning, Rejuran Healer, Pico laser toning, pigmentation treatment, and acne care. All procedures are performed directly by board-certified dermatologists with over 20 years of experience." },
            { question: "Is consultation available in English?", answer: "Yes. Star Dermatology provides consultations in English, Japanese, and Chinese for international patients. Visit our foreign patient guide at https://star-pibu.com/en/foreign-guide" },
            /* ── Ultherapy Prime ── */
            { question: "What is Ultherapy Prime?", answer: "Ultherapy Prime is an FDA-approved non-surgical lifting treatment that uses focused ultrasound (HIFU) technology to stimulate the deep SMAS layer of the skin. It delivers improved energy efficiency compared to the original Ultherapy, achieving effective lifting with fewer sessions." },
            { question: "What is the difference between Ultherapy Prime and the original Ultherapy?", answer: "Ultherapy Prime is the next-generation version with enhanced energy delivery efficiency. While it uses the same HIFU principle, more precise ultrasound targeting allows for greater collagen regeneration with reduced discomfort during treatment." },
            { question: "How long do Ultherapy results last?", answer: "Ultherapy results gradually appear over 2–3 months post-treatment and typically last 6 months to over a year. Results vary based on individual skin condition, age, and lifestyle. Annual maintenance sessions are recommended." },
            { question: "Is there downtime after Ultherapy?", answer: "No, Ultherapy is a non-surgical procedure with no required downtime. Mild redness or swelling may occur immediately after treatment, but most patients can return to daily activities the same day." },
            /* ── Thermage FLX ── */
            { question: "What is Thermage FLX?", answer: "Thermage FLX is a 4th-generation radiofrequency (RF) skin tightening treatment that stimulates collagen production in deep skin layers. It improves skin elasticity, texture, pore size, and wrinkles. It is an FDA-cleared, safe device." },
            { question: "Is Thermage FLX painful?", answer: "Thermage FLX features a built-in vibration comfort system that significantly reduces discomfort compared to previous Thermage models. Patients typically feel a warm sensation and mild tingling, which most find tolerable." },
            { question: "How many Thermage FLX sessions are needed?", answer: "A single Thermage FLX session can produce visible results, with effects gradually appearing over 2–6 months. Maintenance sessions every 6 months to 1 year are recommended to sustain results." },
            { question: "Can Ultherapy and Thermage be combined?", answer: "Yes. Ultherapy (HIFU) and Thermage FLX (RF) work through different mechanisms and can be combined for synergistic results. Ultherapy targets deep SMAS layer lifting while Thermage focuses on surface collagen regeneration, creating a more comprehensive lifting effect when used together." },
            /* ── Under-Eye Fat Repositioning ── */
            { question: "What is under-eye fat repositioning?", answer: "Under-eye fat repositioning is a procedure that redistributes excess fat beneath the eye to the sunken tear trough area, creating a natural under-eye contour without removing fat. Dr. Cho Si-hyeong at Star Dermatology has performed over 4,000 such procedures." },
            { question: "What is the recovery time for under-eye fat repositioning?", answer: "Swelling typically subsides within 1–2 weeks, with full recovery taking 1–3 months. Avoid strenuous exercise and alcohol for the first week, and use diligent sun protection." },
            /* ── Rejuran Healer ── */
            { question: "What is Rejuran Healer?", answer: "Rejuran Healer is a skin regeneration treatment that injects polynucleotide (PDRN) derived from salmon DNA into the skin to improve hydration, elasticity, fine lines, and skin texture. It is ideal for those seeking natural skin improvement." },
            { question: "How many Rejuran sessions are recommended?", answer: "Typically 3–4 initial sessions at 2–4 week intervals, followed by maintenance sessions every 3–6 months. The exact schedule varies based on individual skin condition and is best determined through a consultation." },
            /* ── Pico Laser ── */
            { question: "What is Pico laser toning?", answer: "Pico laser toning uses ultra-fast picosecond (one trillionth of a second) laser pulses to shatter melanin pigment into tiny particles, evening out skin tone. It effectively treats freckles, dark spots, pigmentation, enlarged pores, and skin texture with minimal thermal damage." },
            { question: "What should I avoid after Pico laser treatment?", answer: "Apply sunscreen diligently after Pico laser treatment. Minimize skin irritation during cleansing for 1–2 days post-treatment. Avoid saunas, steam rooms, and intense exercise for about one week. Do not pick at any scabs that may form." },
            /* ── General ── */
            { question: "Are all procedures performed by board-certified dermatologists?", answer: "Yes. All procedures at Star Dermatology are performed directly by three board-certified dermatologists (Dr. Cho Si-hyeong, Dr. Woo Hye-jin, Dr. Lee Gi-wook), each with over 20 years of experience." },
            { question: "How can I book a consultation?", answer: "You can book a consultation by phone (+82-51-818-2300), Naver reservation, or KakaoTalk channel (@starpibugwa). During your visit, our specialists will assess your skin condition and create a personalized treatment plan." },
          ]),
        ]}
        pageType="home"
        ogLocale="en_US"
        ogLocaleAlternates={["ko_KR", "ja_JP", "zh_CN"]}
        hreflangs={COMMON_HREFLANGS}
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

        {isAdmin && (
          <div style={{ background: "#FFFFFF" }}>
            <ReservationSection />
          </div>
        )}

        <div style={{ background: "#F5F1ED" }}>
          <ContactSection />
        </div>

        {/* 최근 공지사항 섹션 */}
        <RecentNoticesSection lang="en" />
      </main>

      <Footer />
      <WelcomePopup />
    </div>
  );
}
