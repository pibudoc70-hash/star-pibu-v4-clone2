/**
 * Japanese Landing Page - /ja
 * SEO: All content rendered in Japanese for Google/Yahoo Japan indexing
 * Strategy: Uses same components as Home.tsx, forces lang="ja" on mount
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
import Footer from "@/components/Footer";
import WelcomePopup from "@/components/WelcomePopup";

export default function LandingJA() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // 언어 설정은 App.tsx의 HtmlLangUpdater가 URL(/ja) 기반으로 자동 처리
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
        title="釜山スター皮膚科 | ウルセラピープライム・サーマジFLX・目の下の脂肪再配置 | 西面クリニック"
        description="釜山西面のスター皮膚科。皮膚科専門医が20年以上の豊富な臨床経験で、ウルセラピープライム、サーマジFLX、目の下の脂肪再配置、ピコレーザーなど50種以上の施術を提供。日本語対応・外国人患者様歓迎。"
        keywords="釜山皮膚科, 西面クリニック, ウルセラピー釜山, サーマジ釜山, 目の下の脂肪再配置 韓国, ピコレーザー釜山, 韓国美容皮膚科, スター皮膚科, 釜山西面皮膚科, 日本語対応 釜山"
        canonical="https://star-pibu.com/ja"
        ogImage={OG_IMAGE_LOCALIZED.ja}
        ogSiteName={SITE_NAME_LOCALIZED.ja}
        jsonLd={[
          buildLocalBusinessJsonLd(),
          buildBreadcrumbJsonLd([
            { name: "ホーム", url: "https://star-pibu.com/ja" },
          ]),
          buildFAQPageJsonLd([
            /* ── クリニック基本情報 ── */
            { question: "スター皮膚科はどこにありますか？", answer: "スター皮膚科は釜山市釜山镇区西面路74（IONシティビル4F）にあります。釜山地下鉄１・２号線西面駅から徒歩5分です。電話：+82-51-818-2300" },
            { question: "診療時間はいつですか？", answer: "月曜日〜金曜日 10:00〜19:00、土曜日 09:30〜15:00。日曜日と祈日は休診です。" },
            { question: "スター皮膚科はどのような施術を専門としていますか？", answer: "ウルセラピープライム、サーマジFLX、目の下脂肪再配置、リジュランヒーラー、ピコレーザートーニング、色素治療、ニキビ治療など、50種以上のプレミアムレーザー施術を提供しています。経驖20年以上の皮膚科専門医3名がすべての施術を直接担当します。" },
            { question: "日本語での相談は可能ですか？", answer: "はい。スター皮膚科では英語・日本語・中国語での外国人患者様への対応が可能です。外国人患者様向ガイド（https://star-pibu.com/en/foreign-guide）もご参照ください。" },
            /* ── ウルセラピープライム ── */
            { question: "ウルセラピープライムとは何ですか？", answer: "ウルセラピープライム（Ultherapy Prime）は、集束超音波（HIFU）技術で皮膚深部のSMAS層まで刷激するFDA承認の非外科的リフティング施術です。従来のウルセラと比べエネルギー伝達効率が向上し、少ない回数で効果的なリフティングが可能です。" },
            { question: "ウルセラピープライムと従来のウルセラの違いは何ですか？", answer: "ウルセラピープライムは、エネルギー伝達効率が改善された次世代バージョンです。同じHIFU原理を使用していますが、より精密な超音波照射が可能で、コラーゲン再生効果が高く、施術中の不快感が軽減されているのが特徴です。" },
            { question: "ウルセラピーの効果はどのくらい続きますか？", answer: "ウルセラピーの効果は施術後2～3か月かけて徐々に現れ、滿6か月〜1年以上続きます。個人の皮膚状態、年齢、生活習慣によって差異があり、年1回のメンテナンス施術をお勧めします。" },
            { question: "ウルセラピー施術後に日常生活に山っても大丈夫ですか？", answer: "はい。ウルセラピーは非外科的施術のため、回復期間は必要ありません。施術直後に軽度の腕れや赤みが出ることがありますが、大部分の方は当日から日常生活に戻ることができます。" },
            /* ── サーマジFLX ── */
            { question: "サーマジFLXとは何ですか？", answer: "サーマジFLXは第4世代高周波（RF）エネルギーを利用して皮膚深部のコラーゲンを再生させるリフティング施術です。皮膚弾力改善、テクスチャー整紏、毛穴収縮、シワ改善に効果があり、FDA済みの安全な機器です。" },
            { question: "サーマジFLXは痛みがありますか？", answer: "サーマジFLXはバイブレーション機能が搭載され、従来のサーマジと比べ痛みが大幅に軽減されています。施術中は温かい热感と軽度のヒリヒリ感がありますが、ほとんどの方が十分に耐えられるレベルです。" },
            { question: "サーマジFLXは何回施術すればよいですか？", answer: "サーマジFLXは1回の施術で効果を実感でき、効果は施術後2～6か月かけて徐々に現れます。維持のために6か月～1年間隔での再施術をお勧めします。" },
            { question: "ウルセラピーとサーマジを一緒に受けられますか？", answer: "はい。ウルセラピー（HIFU）とサーマジFLX（RF）は作用原理が異なり、並行施術でシナジー効果が期待できます。ウルセラピーはSMAS層リフティングに、サーマジは皮膚表層のコラーゲン再生に特化しており、両方を受けることでより立体的なリフティング効果が期待できます。" },
            /* ── 目の下脂肪再配置 ── */
            { question: "目の下脂肪再配置術とは何ですか？", answer: "目の下脂肪再配置術は、目の下の余分な脂肪を除去せずに、こけた洺や溝部分に再配置して自然な目元ラインを形成する施術です。スター皮膚科の趙時形院長は4,000例以上の施術経験を持っています。" },
            { question: "目の下脂肪再配置術の回復期間はどのくらいかかりますか？", answer: "腕れは通常1～2週間で大部分引き、完全回復までは1～3か月かかります。施術後1週間は激しい運動と飲酒を遣け、紫外線対策に注意してください。" },
            /* ── リジュランヒーラー ── */
            { question: "リジュランヒーラーとは何ですか？", answer: "リジュランヒーラーは、サーモンから抽出したポリヌクレオタイド（PDRN）成分を皮膚に注入して皮膚再生と弾力改善を助ける施術です。皮膚の保湿、弾力向上、小ジワ改善、テクスチャー整紏に効果があります。" },
            { question: "リジュランヒーラーは何回施術すれば効果がありますか？", answer: "通常2～4週間隔で基本施術。3～4回行い、その後3～6か月間隔でメンテナンス施術をお勧めします。個人の皮膚状態によって施術回数と間隔が異なる場合があります。" },
            /* ── ピコレーザー ── */
            { question: "ピコレーザートーニングとは何ですか？", answer: "ピコレーザートーニングは、ピコ秒（1兆分の1秒）単位の超高速レーザーでメラニン色素を微細に砕いて皮膚トーンを均一に改善する施術です。そばかす、シミ、色素沈着、毛穴収縮、テクスチャー整紏に効果的で、熱ダメージが少なく安全です。" },
            { question: "ピコレーザー施術後の注意事項は何ですか？", answer: "ピコレーザー施術後は日焦け止めを徹底的に使用してください。施術後1～2日間は洗顔時の刺激を最小限にし、サウナ・岩盤浴・激しい運動は1週間程度遣けることがよいです。カサブたができた場合は無理にはがさないようにしてください。" },
            /* ── その他 ── */
            { question: "スター皮膚科は皮膚科専門医が直接施術しますか？", answer: "はい。スター皮膚科は経驖20年以上の皮膚科専門医3名（趙時形・宇恵真・李基羽院長）がすべての施術を直接担当します。専門医による直接施術で安全かつ正確な結果をお届けします。" },
            { question: "施術前のカウンセリングはどのように受けられますか？", answer: "電話（+82-51-818-2300）、ネイバー予約、カカオトークチャンネル（@スター皮膚科）で相談予約が可能です。来院時に皮膚状態を直接確認し、オーダーメイドの施術プランをご案内します。" },
          ]),
        ]}
        pageType="home"
        ogLocale="ja_JP"
        ogLocaleAlternates={["ko_KR", "en_US", "zh_CN"]}
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

        {isAdmin && (
          <div style={{ background: "#FFFFFF" }}>
            <ReservationSection />
          </div>
        )}

        <div style={{ background: "#F5F1ED" }}>
          <ContactSection />
        </div>
      </main>

      <Footer />
      <WelcomePopup />
    </div>
  );
}
