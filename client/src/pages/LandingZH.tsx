/**
 * Chinese Landing Page - /zh
 * SEO: All content rendered in Chinese for Google/Baidu indexing
 * Strategy: Uses same components as Home.tsx, forces lang="zh" on mount
 */
import { useEffect } from "react";
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
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import WelcomePopup from "@/components/WelcomePopup";

export default function LandingZH() {
  // 언어 설정은 App.tsx의 HtmlLangUpdater가 URL(/zh) 기반으로 자동 처리
  // Scroll to hash section if present (MutationObserver 패턴 사용 — lazy 섹션 대응)
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
    const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
    const headerOffset = header ? header.offsetHeight + 8 : 80;
    const el = document.querySelector(hash);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
    // lazy 섹션이 아직 DOM에 없으면 MutationObserver로 대기
    const observer = new MutationObserver(() => {
      const lazyEl = document.querySelector(hash);
      if (lazyEl) {
        observer.disconnect();
        clearTimeout(timeout);
        const top2 = lazyEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: top2, behavior: "smooth" });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 3000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

   return (
    <div className="min-h-screen">
      <SeoHead
        title="釜山STAR皮肤科 | 超声刀·热玛吉FLX·眼袋脂肪重置 | 西面诊所"
        description="釜山西面STAR皮肤科。皮肤科专科医生拥有20年以上丰富临床经验，提供超声刀、热玛吉FLX、眼袋脂肪重置、皮秒激光等中韓一流项目。欢迎外国患者，提供中文咨询服务。"
        keywords="釜山皮肤科, 西面皮肤诊所, 超声刀釜山, 热玛吉釜山, 眼袋手术韓国, 皮秒激光釜山, 韓国美容皮肤科, STAR皮肤科, 釜山整形美容, 中文咨询皮肤科诊所"
        canonical="https://star-pibu.com/zh"
        ogImage={OG_IMAGE_LOCALIZED.zh}
        ogSiteName={SITE_NAME_LOCALIZED.zh}
        jsonLd={[
          buildLocalBusinessJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "首页", url: "https://star-pibu.com/zh" },
          ]),
          buildFAQPageJsonLd([
            { question: "STAR皮肤科在哪里？", answer: "STAR皮肤科位于釜山市釜山镇区西面路74号（ION City大厨4F）。乘釜山地铁1、2号线西面站步行5分钟。电话：+82-51-818-2300" },
            { question: "诊疗时间是什么时候？", answer: "周一至周五 10:00–19:00，周六 09:30–15:00。周日及公假日休诊。" },
            { question: "超声刀和热玛吉的区别是什么？", answer: "超声刀利用聚焦超声波（HIFU）刺激皮肤深层SMAS层，是FDA批准的非手术提拉项目。热玛吉FLX利用第4代高频电磁波（RF）能量再生胶原蛋白，两者原理不同，组合使用可产生协同效果。" },
            { question: "可以用中文和医生沟通吗？", answer: "可以。STAR皮肤科提供英语、日语、中文的外国患者就诊服务。" },
          ]),
        ]}
        pageType="home"
        ogLocale="zh_CN"
        ogLocaleAlternates={["ko_KR", "en_US", "ja_JP"]}
        hreflangs={COMMON_HREFLANGS}
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
