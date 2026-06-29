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
import ContactSection from "@/components/ContactSection";
import RecentNoticesSection from "@/components/RecentNoticesSection";
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";
import MobileBottomCTA from "@/components/MobileBottomCTA";

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
            /* ── 诊所基本信息 ── */
            { question: "STAR皮肤科在哪里？", answer: "STAR皮肤科位于釜山市釜山镇区西面路74号（ION City大厨4F）。乘釜山地铄1、2号线西面站步行5分钟。电话：+82-51-818-2300" },
            { question: "诊疗时间是什么时候？", answer: "周一至周五 10:00–19:00，周六 09:30–15:00。周日及公假日休诊。" },
            { question: "STAR皮肤科专门提供哪些项目？", answer: "STAR皮肤科提供超过50种高端激光和美容项目，包括超声刀Prime、热玛吉FLX、眼下脂肪重置术、丽婴兰水光针、皮秒激光淦肤、色素治疗、痘疮治疗等。拥有20年以上经验的3名皮肤科专科医生亲自操作所有项目。" },
            { question: "可以用中文和医生沟通吗？", answer: "可以。STAR皮肤科提供英语、日语、中文的外国患者就诊服务。请参阅外国患者指南（https://star-pibu.com/en/foreign-guide）。" },
            /* ── 超声刀Prime ── */
            { question: "超声刀Prime是什么？", answer: "超声刀Prime（Ultherapy Prime）是利用聚焦超声波（HIFU）技术刺激皮肤深层SMAS层的FDA批准非手术提拉项目。与原来的超声刀相比，能量传递效率提高，可以用更少的次数实现有效的提拉效果。" },
            { question: "超声刀Prime与原来超声刀的区别是什么？", answer: "超声刀Prime是能量传递效率改善的新一代版本。虽然使用相同HIFU原理，但更精确的超声波照射可实现更高的胶原蛋白再生效果，且治疗中不适感明显减少。" },
            { question: "超声刀效果能持续多久？", answer: "超声刀效果在治疗后2～3个月内逐渐显现，通常可持续6个月至1年以上。效果因个人皮肤状况、年龄和生活习惯而差异，建议每年进行一次维持治疗。" },
            { question: "超声刀治疗后能正常生活吗？", answer: "可以。超声刀是非手术项目，无需恢复期。治疗后可能出现轻度肿胀或发红，但大多数患者当天即可恢复日常生活。" },
            /* ── 热玛吉FLX ── */
            { question: "热玛吉FLX是什么？", answer: "热玛吉FLX是利用第4代高频电磁波（RF）能量刺激皮肤深层胶原蛋白再生的紧肤提拉项目。可改善皮肤弹力、肤质、收缩毛孔、淡化皮纹，是FDA批准的安全设备。" },
            { question: "热玛吉FLX会痛吗？", answer: "热玛吉FLX配备震动舒适系统，与以往型号相比痛感大幅减少。治疗中会感到温热感和轻度刺痛感，大多数患者都能承受。" },
            { question: "热玛吉FLX需要做几次？", answer: "热玛吉FLX一次治疗即可看到效果，效果在治疗后2～6个月内逐渐显现。建议每6个月至1年进行一次维持治疗。" },
            { question: "超声刀和热玛吉可以同时做吗？", answer: "可以。超声刀（HIFU）和热玛吉FLX（RF）作用原理不同，联合使用可产生协同效果。超声刀专注于SMAS层提拉，热玛吉专注于皮肤表层胶原蛋白再生，两者结合可实现更立体的提拉效果。" },
            /* ── 眼下脂肪重置术 ── */
            { question: "眼下脂肪重置术是什么？", answer: "眼下脂肪重置术是将眼下多余脂肪不加切除地重新分配到凹陷的泪沟部位，形成自然眼下轮廓的手术。STAR皮肤科赵时形院长拥有4000例以上的手术经验。" },
            { question: "眼下脂肪重置术的恢复期需要多久？", answer: "肿胀通常在1～2周内大部分消退，完全恢复需要在1～3个月。术后1周内避免剧烈运动和饮酒，并注意防晒。" },
            /* ── 丽婴兰水光针 ── */
            { question: "丽婴兰水光针是什么？", answer: "丽婴兰水光针是将从鲑鱼提取的多核苷酸（PDRN）成分注入皮肤，促进皮肤再生和弹力改善的项目。具有保湿、增弹、淡化细纹、改善肤质的效果。" },
            { question: "丽婴兰水光针需要做几次？", answer: "通常建议每2～4周进行基础治疗3～4次，此后每3～6个月进行维持治疗。具体方案因个人皮肤状况而异，建议先和专科医生资询。" },
            /* ── 皮秒激光 ── */
            { question: "皮秒激光淦肤是什么？", answer: "皮秒激光淦肤利用皮秒（1万亿分之一秒）级超高速激光将黑色素细化分裂，均匀肤色。对雀斑、斑点、色素沉着、收缩毛孔、改善肤质有效，热损伤小且安全。" },
            { question: "皮秒激光治疗后的注意事项是什么？", answer: "治疗后请彻底使用防晒霍。治疗后1～2天内洁面时尽量减少刺激，桑拿、汗蒸房和剧烈运动建议避免约1周。如有结痂，请勿强行撞除。" },
            /* ── 其他 ── */
            { question: "STAR皮肤科的项目由皮肤科专科医生亲自操作吗？", answer: "是的。STAR皮肤科由拥有20年以上经验的3名皮肤科专科医生（赵时形、宇恵真、李基羽院长）亲自操作所有项目，确保安全准确的效果。" },
            { question: "如何预约和和医生和诊？", answer: "可通过电话（+82-51-818-2300）、Naver预约或KakaoTalk频道（@星皮肤科）预约和诊。就诊时，专科医生会亲自评估您的皮肤状况并制定个性化治疗方案。" },
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


        <div style={{ background: "#F5F1ED" }}>
          <ContactSection />
        </div>

        {/* 최근 공지사항 섹션 */}
        <RecentNoticesSection lang="zh" />
      </main>

      <Footer />
      <MobileBottomCTA />
      <WelcomePopup />
    </div>
  );
}


