/**
 * Taiwan Traditional Chinese Landing Page - /zh-tw
 * SEO: All content rendered in Traditional Chinese for Google indexing (Taiwan)
 * Strategy: Uses same components as Home.tsx, forces lang="zh-TW" on mount
 */
import { useEffect } from "react";
import { CLINIC_STATS } from "../lib/constants";
const _n = CLINIC_STATS.eyeBagCases.toLocaleString("zh-TW");
import Header from "@/components/Header";
import SeoHead, { COMMON_HREFLANGS, buildBreadcrumbJsonLd, buildLocalBusinessJsonLd, buildFAQPageJsonLd, SITE_NAME_LOCALIZED, OG_IMAGE_LOCALIZED } from "@/components/SeoHead";
import HeroSection from "@/components/HeroSection";
import { LiftingPositioningSummary } from "@/components/LiftingPositioning";
import PhilosophySection from "@/components/PhilosophySection";
import DoctorsSection from "@/components/DoctorsSection";
import TreatmentsEquipmentSection from "@/components/TreatmentsEquipmentSection";
import ManagementDevicesSection from "@/components/ManagementDevicesSection";
import SpecialEventSection from "@/components/SpecialEventSection";
import ResultsStatisticsSection from "@/components/ResultsStatisticsSection";
import FacilitySection from "@/components/FacilitySection";
import YouTubeSection from "@/components/YouTubeSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import RecentNoticesSection from "@/components/RecentNoticesSection";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";
import MobileBottomCTA from "@/components/MobileBottomCTA";

export default function LandingZHTW() {
  // 언어 설정은 App.tsx의 HtmlLangUpdater가 URL(/zh-tw) 기반으로 자동 처리
  useEffect(() => {
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
    const observer = new MutationObserver(() => {
      const target = document.querySelector(hash);
      if (target) {
        observer.disconnect();
        const top2 = target.getBoundingClientRect().top + window.scrollY - headerOffset;
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
        title="釜山STAR皮膚科 | 超聲刀·熱瑪吉FLX·眼袋脂肪重置 | 西面診所"
        description="釜山西面STAR皮膚科。皮膚科專科醫師擁有20年以上豐富臨床經驗，提供超聲刀、熱瑪吉FLX、眼袋脂肪重置、皮秒雷射等頂尖療程。歡迎外籍患者，提供中文諮詢服務。"
        keywords="釜山皮膚科, 西面皮膚診所, 超聲刀釜山, 熱瑪吉釜山, 眼袋手術韓國, 皮秒雷射釜山, 韓國醫美皮膚科, STAR皮膚科, 釜山醫美, 中文諮詢皮膚科"
        canonical="https://star-pibu.com/zh-tw"
        ogImage={OG_IMAGE_LOCALIZED["zh-TW"] ?? OG_IMAGE_LOCALIZED.zh}
        ogSiteName={SITE_NAME_LOCALIZED["zh-TW"]}
        jsonLd={[
          buildLocalBusinessJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "首頁", url: "https://star-pibu.com/zh-tw" },
          ]),
          buildFAQPageJsonLd([
            /* ── 外籍患者 ── */
            { question: "STAR皮膚科提供中文諮詢服務嗎？", answer: "是的。STAR皮膚科提供中文諮詢服務，外籍患者可安心就診。請參閱外籍患者指南（https://star-pibu.com/en/foreign-guide）。" },
            /* ── 超聲刀Prime ── */
            { question: "超聲刀Prime是什麼？", answer: "超聲刀Prime（Ultherapy Prime）是利用聚焦超音波（HIFU）技術刺激皮膚深層SMAS層的FDA核准非手術拉提療程。與原版超聲刀相比，能量傳遞效率更高，可用更少次數達到有效的拉提效果。" },
            { question: "超聲刀Prime與原版超聲刀有何不同？", answer: "超聲刀Prime是能量傳遞效率改良的新世代版本。雖採用相同HIFU原理，但更精準的超音波照射可達到更高的膠原蛋白再生效果，且療程中不適感明顯減少。" },
            { question: "超聲刀效果能維持多久？", answer: "超聲刀效果在療程後2～3個月內逐漸顯現，通常可維持6個月至1年以上。效果因個人膚況、年齡及生活習慣而有所差異，建議每年進行一次維護療程。" },
            { question: "超聲刀療程後可以正常生活嗎？", answer: "可以。超聲刀是非手術療程，無需恢復期。療程後可能出現輕微腫脹或泛紅，但大多數患者當天即可恢復日常生活。" },
            /* ── 熱瑪吉FLX ── */
            { question: "熱瑪吉FLX是什麼？", answer: "熱瑪吉FLX是利用第4代高頻電磁波（RF）能量刺激皮膚深層膠原蛋白再生的緊膚拉提療程。可改善皮膚彈力、膚質、收縮毛孔、淡化細紋，是FDA核准的安全設備。" },
            { question: "熱瑪吉FLX會痛嗎？", answer: "熱瑪吉FLX配備震動舒適系統，與舊型號相比疼痛感大幅降低。療程中會感到溫熱感與輕微刺痛感，大多數患者均可承受。" },
            { question: "熱瑪吉FLX需要做幾次？", answer: "熱瑪吉FLX一次療程即可看到效果，效果在療程後2～6個月內逐漸顯現。建議每6個月至1年進行一次維護療程。" },
            { question: "超聲刀和熱瑪吉可以同時進行嗎？", answer: "可以。超聲刀（HIFU）和熱瑪吉FLX（RF）作用原理不同，合併使用可產生協同效果。超聲刀專注於SMAS層拉提，熱瑪吉專注於皮膚表層膠原蛋白再生，兩者結合可實現更立體的拉提效果。" },
            /* ── 眼袋脂肪重置術 ── */
            { question: "眼袋脂肪重置術是什麼？", answer: `眼袋脂肪重置術是將眼下多餘脂肪不加切除地重新分配至凹陷的淚溝部位，形成自然眼下輪廓的手術。STAR皮膚科趙時亨院長擁有${_n}例以上的手術經驗。` },
            { question: "眼袋脂肪重置術的恢復期需要多久？", answer: "腫脹通常在1～2週內大部分消退，完全恢復需要1～3個月。術後1週內請避免劇烈運動及飲酒，並注意防曬。" },
            /* ── 麗嬰蘭水光針 ── */
            { question: "麗嬰蘭水光針是什麼？", answer: "麗嬰蘭水光針是將從鮭魚提取的多核苷酸（PDRN）成分注入皮膚，促進皮膚再生與彈力改善的療程。具有保濕、增彈、淡化細紋、改善膚質的效果。" },
            { question: "麗嬰蘭水光針需要做幾次？", answer: "通常建議每2～4週進行基礎療程3～4次，此後每3～6個月進行維護療程。具體方案因個人膚況而異，建議先與專科醫師諮詢。" },
            /* ── 皮秒雷射 ── */
            { question: "皮秒雷射淨膚是什麼？", answer: "皮秒雷射淨膚利用皮秒（1兆分之一秒）級超高速雷射將黑色素細化分裂，均勻膚色。對雀斑、斑點、色素沉澱、收縮毛孔、改善膚質有效，熱損傷小且安全。" },
            { question: "皮秒雷射療程後的注意事項是什麼？", answer: "療程後請徹底做好防曬。療程後1～2天內洗臉時盡量減少刺激，三溫暖、汗蒸房及劇烈運動建議避免約1週。如有結痂，請勿強行撕除。" },
            /* ── 其他 ── */
            { question: "STAR皮膚科的療程由皮膚科專科醫師親自操作嗎？", answer: "是的。STAR皮膚科由擁有20年以上經驗的3位皮膚科專科醫師（趙時亨、禹惠珍、李基旭院長）親自操作所有療程，確保安全精準的效果。" },
            { question: "如何預約與醫師諮詢？", answer: "可透過電話（+82-51-818-2300）、Naver預約或KakaoTalk頻道（@星皮膚科）預約諮詢。就診時，專科醫師會親自評估您的膚況並制定個人化療程方案。" },
          ]),
        ]}
        pageType="home"
        ogLocale="zh_TW"
        ogLocaleAlternates={["ko_KR", "en_US", "ja_JP", "zh_CN"]}
        hreflangs={COMMON_HREFLANGS}
      />
      {/* Fixed Header */}
      <Header />
      {/* Main Content - identical to Home.tsx */}
      <main>
        <HeroSection />
        <LiftingPositioningSummary />
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
        <div style={{ background: "#FFFFFF" }}>
          <YouTubeSection />
        </div>
        <div style={{ background: "#F5F1ED" }}>
          <FAQSection />
        </div>
        <div style={{ background: "#F5F1ED" }}>
          <ContactSection />
        </div>
        {/* 최근 공지사항 섹션 */}
        <RecentNoticesSection lang="zh-TW" />
      </main>
      <Footer />
      <MobileBottomCTA />
      <WelcomePopup />
    </div>
  );
}
