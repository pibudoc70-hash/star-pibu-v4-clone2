/**
 * NonCoveredGuide - 비급여 진료안내 페이지
 * 건강보험 비급여 항목 안내 (4개 언어)
 *
 * [PAGE LIFECYCLE] localized live page (PR-38 정책 확정)
 * - route: /non-covered, /en/non-covered, /ja/non-covered, /zh/non-covered (App.tsx live)
 * - canonical: lang 기반 동적 계산 (ko → /non-covered, 기타 → /{lang}/non-covered)
 * - ogUrl: canonical과 동일
 * - ogLocale: LANG_TO_OG_LOCALE[lang] (언어별 정렬)
 * - hreflangs: buildHreflangs("/non-covered", "/en/...", "/ja/...", "/zh/...")
 * - 본문: ko/en/ja/zh 4개 언어 전체 제공 (의료법 제45조 준수)
 * - noindex: 없음 (전체 색인 허용)
 */
import { useLang } from "@/contexts/LangContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, Info, ChevronRight } from "lucide-react";
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE } from "@/components/SeoHead";
import { getLocalizedUrl } from "@/lib/localizedPath";

export default function NonCoveredGuide() {
  const { lang } = useLang();

  const labels = {
    title:
      lang === "ja" ? "非保険診療案内" :
      lang === "zh" ? "非医保诊疗指南" :
      lang === "en" ? "Non-Covered Medical Services" :
      "비급여 진료안내",
    subtitle:
      lang === "ja" ? "保険適用外の診療項目と費用についてご案内します" :
      lang === "zh" ? "为您介绍非医保诊疗项目及费用" :
      lang === "en" ? "Information on non-covered medical services and fees" :
      "건강보험이 적용되지 않는 진료항목 및 비용을 안내드립니다",
    hiraTitle:
      lang === "ja" ? "健康保険審査評価院 非保険診療費用公開" :
      lang === "zh" ? "健康保险审查评价院 非医保诊疗费用公开" :
      lang === "en" ? "HIRA Non-Covered Medical Fees Disclosure" :
      "건강보험심사평가원 비급여 진료비용 공개",
    hiraDesc:
      lang === "ja" ? "医療機関の非保険診療費用は健康保険審査評価院のウェブサイトで確認できます。" :
      lang === "zh" ? "医疗机构的非医保诊疗费用可在健康保险审查评价院网站上查询。" :
      lang === "en" ? "Non-covered medical fees for healthcare institutions can be found on the HIRA website." :
      "의료기관의 비급여 진료비용은 건강보험심사평가원 홈페이지에서 확인하실 수 있습니다.",
    hiraBtn:
      lang === "ja" ? "審査評価院で確認する" :
      lang === "zh" ? "在审查评价院查询" :
      lang === "en" ? "Check on HIRA Website" :
      "심사평가원에서 확인하기",
    notice:
      lang === "ja" ? "※ 비급여 진료비용은 의료기관마다 다를 수 있으며, 실제 진료 시 변경될 수 있습니다. 정확한 비용은 내원 상담 후 안내드립니다." :
      lang === "zh" ? "※ 非医保诊疗费用因医疗机构而异，实际诊疗时可能有所变化。准确费用将在就诊咨询后告知。" :
      lang === "en" ? "※ Non-covered fees may vary by institution and are subject to change. Exact costs will be provided after consultation." :
      "※ 비급여 진료비용은 의료기관마다 다를 수 있으며, 실제 진료 시 변경될 수 있습니다. 정확한 비용은 내원 상담 후 안내드립니다.",
    categories: [
      {
        name: lang === "ja" ? "リフティング" : lang === "zh" ? "提升" : lang === "en" ? "Lifting" : "리프팅",
        items: [
          { name: lang === "ja" ? "ウルセラ（超音波リフティング）" : lang === "zh" ? "超声刀（超声波提升）" : lang === "en" ? "Ultherapy (HIFU Lifting)" : "울쎄라 (초음파 리프팅)", price: lang === "en" ? "From ₩500,000" : lang === "ja" ? "50万ウォン〜" : lang === "zh" ? "50万韩元起" : "50만원~" },
          { name: lang === "ja" ? "サーマジ（高周波リフティング）" : lang === "zh" ? "热玛吉（射频提升）" : lang === "en" ? "Thermage (RF Lifting)" : "써마지 (고주파 리프팅)", price: lang === "en" ? "From ₩600,000" : lang === "ja" ? "60万ウォン〜" : lang === "zh" ? "60万韩元起" : "60만원~" },
          { name: lang === "ja" ? "XERF（セルフリフティング）" : lang === "zh" ? "XERF（射频提升）" : lang === "en" ? "XERF (RF Lifting)" : "세르프 (고주파 리프팅)", price: lang === "en" ? "From ₩300,000" : lang === "ja" ? "30万ウォン〜" : lang === "zh" ? "30万韩元起" : "30만원~" },
          { name: lang === "ja" ? "シルエットリフト（糸リフト）" : lang === "zh" ? "线雕提升" : lang === "en" ? "Silhouette Lift (Thread Lift)" : "실루엣 리프트 (실 리프팅)", price: lang === "en" ? "From ₩800,000" : lang === "ja" ? "80万ウォン〜" : lang === "zh" ? "80万韩元起" : "80만원~" },
        ]
      },
      {
        name: lang === "ja" ? "ボリュームアップ" : lang === "zh" ? "丰盈" : lang === "en" ? "Volume Enhancement" : "볼륨 증가",
        items: [
          { name: lang === "ja" ? "スカルプトラ（コラーゲン再生注射）" : lang === "zh" ? "舒颜萃（胶原蛋白再生注射）" : lang === "en" ? "Sculptra (Collagen Stimulator)" : "스컬트라 (콜라겐 재생 주사)", price: lang === "en" ? "From ₩400,000" : lang === "ja" ? "40万ウォン〜" : lang === "zh" ? "40万韩元起" : "40만원~" },
          { name: lang === "ja" ? "ヒアルロン酸フィラー" : lang === "zh" ? "玻尿酸填充" : lang === "en" ? "Hyaluronic Acid Filler" : "히알루론산 필러", price: lang === "en" ? "From ₩200,000" : lang === "ja" ? "20万ウォン〜" : lang === "zh" ? "20万韩元起" : "20만원~" },
          { name: lang === "ja" ? "ボトックス（しわ・輪郭）" : lang === "zh" ? "肉毒素（皱纹·轮廓）" : lang === "en" ? "Botox (Wrinkles & Contouring)" : "보톡스 (주름·윤곽)", price: lang === "en" ? "From ₩100,000" : lang === "ja" ? "10万ウォン〜" : lang === "zh" ? "10万韩元起" : "10만원~" },
        ]
      },
      {
        name: lang === "ja" ? "色素・シミ" : lang === "zh" ? "色素·斑点" : lang === "en" ? "Pigmentation" : "색소·잡티",
        items: [
          { name: lang === "ja" ? "色素レーザー（シミ・そばかす）" : lang === "zh" ? "色素激光（斑点·雀斑）" : lang === "en" ? "Pigment Laser (Spots & Freckles)" : "색소 레이저 (잡티·주근깨)", price: lang === "en" ? "From ₩50,000" : lang === "ja" ? "5万ウォン〜" : lang === "zh" ? "5万韩元起" : "5만원~" },
          { name: lang === "ja" ? "タトゥー除去" : lang === "zh" ? "纹身去除" : lang === "en" ? "Tattoo Removal" : "문신 제거", price: lang === "en" ? "From ₩50,000" : lang === "ja" ? "5万ウォン〜" : lang === "zh" ? "5万韩元起" : "5만원~" },
          { name: lang === "ja" ? "肝斑治療（トーニング）" : lang === "zh" ? "黄褐斑治疗（调色）" : lang === "en" ? "Melasma Treatment (Toning)" : "기미 치료 (토닝)", price: lang === "en" ? "From ₩80,000" : lang === "ja" ? "8万ウォン〜" : lang === "zh" ? "8万韩元起" : "8만원~" },
        ]
      },
      {
        name: lang === "ja" ? "ニキビ・毛穴・瘢痕" : lang === "zh" ? "痘痘·毛孔·疤痕" : lang === "en" ? "Acne, Pores & Scars" : "여드름·모공·흉터",
        items: [
          { name: lang === "ja" ? "フラクショナルレーザー（毛穴・瘢痕）" : lang === "zh" ? "点阵激光（毛孔·疤痕）" : lang === "en" ? "Fractional Laser (Pores & Scars)" : "프락셀 레이저 (모공·흉터)", price: lang === "en" ? "From ₩150,000" : lang === "ja" ? "15万ウォン〜" : lang === "zh" ? "15万韩元起" : "15만원~" },
          { name: lang === "ja" ? "ニキビレーザー治療" : lang === "zh" ? "痘痘激光治疗" : lang === "en" ? "Acne Laser Treatment" : "여드름 레이저 치료", price: lang === "en" ? "From ₩80,000" : lang === "ja" ? "8万ウォン〜" : lang === "zh" ? "8万韩元起" : "8만원~" },
          { name: lang === "ja" ? "火傷・ニキビ瘢痕除去" : lang === "zh" ? "烧伤·痘疤去除" : lang === "en" ? "Burn & Acne Scar Removal" : "화상·여드름 흉터 제거", price: lang === "en" ? "From ₩100,000" : lang === "ja" ? "10万ウォン〜" : lang === "zh" ? "10万韩元起" : "10만원~" },
        ]
      },
      {
        name: lang === "ja" ? "目元・小手術" : lang === "zh" ? "眼部·小手术" : lang === "en" ? "Eye Area & Minor Surgery" : "눈가·소수술",
        items: [
          { name: lang === "ja" ? "目の下の脂肪再配置" : lang === "zh" ? "眼袋脂肪重置" : lang === "en" ? "Lower Eyelid Fat Repositioning" : "눈밑 지방 재배치", price: lang === "en" ? "From ₩1,500,000" : lang === "ja" ? "150万ウォン〜" : lang === "zh" ? "150万韩元起" : "150만원~" },
          { name: lang === "ja" ? "汗管腫除去" : lang === "zh" ? "汗管瘤去除" : lang === "en" ? "Syringoma Removal" : "한관종 제거", price: lang === "en" ? "From ₩50,000" : lang === "ja" ? "5万ウォン〜" : lang === "zh" ? "5万韩元起" : "5만원~" },
        ]
      },
      {
        name: lang === "ja" ? "その他" : lang === "zh" ? "其他" : lang === "en" ? "Others" : "기타",
        items: [
          { name: lang === "ja" ? "多汗症治療（ボトックス）" : lang === "zh" ? "多汗症治疗（肉毒素）" : lang === "en" ? "Hyperhidrosis (Botox)" : "다한증 치료 (보톡스)", price: lang === "en" ? "From ₩300,000" : lang === "ja" ? "30万ウォン〜" : lang === "zh" ? "30万韩元起" : "30만원~" },
          { name: lang === "ja" ? "爪水虫治療（レーザー）" : lang === "zh" ? "甲癣治疗（激光）" : lang === "en" ? "Nail Fungus (Laser)" : "손발톱 무좀 (레이저)", price: lang === "en" ? "From ₩50,000" : lang === "ja" ? "5万ウォン〜" : lang === "zh" ? "5万韩元起" : "5만원~" },
          { name: lang === "ja" ? "白斑治療（エキシマレーザー）" : lang === "zh" ? "白癜风治疗（准分子激光）" : lang === "en" ? "Vitiligo (Excimer Laser)" : "백반증 (엑시머 레이저)", price: lang === "en" ? "From ₩30,000" : lang === "ja" ? "3万ウォン〜" : lang === "zh" ? "3万韩元起" : "3만원~" },
        ]
      },
    ]
  };

  // SEO: 현재 언어 route 기준 pageUrl 계산 (localized live page 정책) [R11-F]
  const pageUrl = getLocalizedUrl(lang, "/non-covered");

  // 언어별 SEO 메타 (title/description/keywords)
  const seoTitle =
    lang === "ja" ? "非保険診療案内 | 釜山西面スター皮膚科" :
    lang === "zh" ? "非医保诊疗指南 | 釜山西面星皮肤科" :
    lang === "en" ? "Non-Covered Medical Services | Star Dermatology Busan" :
    "비급여 진료안내 | 부산 서면 스타피부과";

  const seoDescription =
    lang === "ja" ? "釜山西面スター皮膚科の非保険診療案内です。ウルセラ・サーマジ・リフティング・レーザーなど非保険診療項目と費用をご案内します。医療法第45条遵守。" :
    lang === "zh" ? "釜山西面星皮肤科的非医保诊疗项目指南。超声刀、热玛吉、提升、激光等项目及费用说明。遵守医疗法第45条。" :
    lang === "en" ? "Non-covered medical service guide at Star Dermatology Clinic, Seomyeon Busan. Ultherapy, Thermage, lifting, laser treatments and pricing. Compliant with Medical Act Article 45." :
    "부산 서면 스타피부과의 비급여 진료안내입니다. 울쎄라, 써마지, 리프팅, 레이저 시술 등 비급여 진료 항목과 비용을 안내합니다. 의료법 제45조 준수.";

  const seoKeywords =
    lang === "ja" ? "非保険診療, ウルセラ価格, サーマジ価格, リフティング費用, 釜山皮膚科価格" :
    lang === "zh" ? "非医保诊疗, 超声刀价格, 热玛吉价格, 提升费用, 釜山皮肤科价格" :
    lang === "en" ? "non-covered medical services, Ultherapy price, Thermage price, lifting cost, Busan dermatology" :
    "비급여진료, 비급여안내, 울쎄라가격, 써마지가격, 리프팅비용, 부산피부과가격";

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs(
          "/non-covered",
          "/en/non-covered",
          "/ja/non-covered",
          "/zh/non-covered",
        )}
        pageType="treatment"
      />
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <div className="py-12 md:py-16 text-center" style={{ background: "linear-gradient(135deg, #0D2B5E 0%, #1A4FA0 100%)" }}>
          <div className="container">
            <span className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
              {lang === "ko" ? "의료법 제45조" : lang === "ja" ? "医療法第45条" : lang === "zh" ? "医疗法第45条" : "Medical Act Article 45"}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{labels.title}</h1>
            <p className="text-base md:text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>{labels.subtitle}</p>
          </div>
        </div>

        <div className="container py-10 md:py-16 max-w-5xl mx-auto">
          {/* HIRA 링크 카드 */}
          <div className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "#EBF3FF", border: "1.5px solid #B8D0F0" }}>
            <Info size={28} style={{ color: "#1A4FA0", flexShrink: 0 }} />
            <div className="flex-1">
              <p className="font-bold text-base mb-1" style={{ color: "#0D2B5E" }}>{labels.hiraTitle}</p>
              <p className="text-sm" style={{ color: "#4A6FA5" }}>{labels.hiraDesc}</p>
            </div>
            <a
              href="https://www.hira.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all hover:scale-105"
              style={{ background: "#1A4FA0", color: "#fff" }}
            >
              {labels.hiraBtn}
              <ExternalLink size={14} />
            </a>
          </div>

          {/* 비급여 진료비 가격표 — 텍스트 테이블 (Step71) */}
          {lang === "ko" && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-md border border-blue-200">
              <div className="px-6 py-4" style={{ background: "#1A4FA0" }}>
                <h2 className="font-bold text-white text-base">
                  스타피부과의원 비급여 진료 비용 안내
                </h2>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
                  의료법 제 45조 및 동법 시행규칙 제 42조의 2에 의해 비급여 진료 비용을 고지합니다.(2024.03)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: "#2d2d2d", color: "#fff" }}>
                      <th className="px-4 py-2.5 text-center font-semibold border border-gray-600 whitespace-nowrap" style={{ width: "13%" }}>시술부위</th>
                      <th className="px-4 py-2.5 text-center font-semibold border border-gray-600" style={{ width: "38%" }}>항목</th>
                      <th className="px-4 py-2.5 text-center font-semibold border border-gray-600 whitespace-nowrap" style={{ width: "10%" }}>단위</th>
                      <th className="px-4 py-2.5 text-center font-semibold border border-gray-600 whitespace-nowrap" style={{ width: "14%" }}>최소금액(만원)</th>
                      <th className="px-4 py-2.5 text-center font-semibold border border-gray-600 whitespace-nowrap" style={{ width: "14%" }}>최대금액(만원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 기미/주근깨/홍조 */}
                    {[
                      ["인라이트3","1회","20","30"],
                      ["스타워커","1회","20","30"],
                      ["피코슈어","1회","20","30"],
                      ["엑셀V+(부분/전체)","1회","20","80"],
                      ["시너지","1회","20","80"],
                      ["루메니스/BBL","1회","30",""],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={6} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>기미/주근깨/홍조</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 문신제거 */}
                    {[
                      ["눈썹","1회","25","30"],
                      ["아이라인","1회","25","30"],
                      ["몸(명함사이즈 기준)","1회","40",""],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={3} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>문신제거</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 여드름 */}
                    {[
                      ["카프리+스켈링","1회","15",""],
                      ["플라듀오","1회","15",""],
                      ["플레티넘 PPT + 스켈링 1회","1회","30",""],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={3} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>여드름</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 모공/흉터 */}
                    {[
                      ["울트라펄스 앙코르","1회","80",""],
                      ["MCL / DRT","1회","60",""],
                      ["줄레이저","1회","80","100"],
                      ["피코 프락셀","1회","60",""],
                      ["버츄RF","1회","40",""],
                      ["프로파운드","1회","350","450"],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={6} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>모공/흉터</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 리프팅 */}
                    {[
                      ["울쎄라","1회","150",""],
                      ["써마지 FLX","1회","250",""],
                      ["라페라 / 엑실리스","1회","50","80"],
                      ["프로파운드","1회","350","450"],
                      ["에너젯","1회","100",""],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={5} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>리프팅</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 눈밑지방제거 재배치 */}
                    <tr style={{ background: "#fff" }}>
                      <td className="px-3 py-2 text-center font-bold border border-gray-200" style={{ background: "#f5f5f5" }}>눈밑지방제거 재배치</td>
                      <td className="px-4 py-2 text-left border border-gray-200">리프팅 포함</td>
                      <td className="px-3 py-2 text-center border border-gray-200">1회</td>
                      <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>150</td>
                      <td className="px-3 py-2 text-center border border-gray-200"></td>
                    </tr>
                    {/* 액취증/다한증 */}
                    <tr style={{ background: "#fafafa" }}>
                      <td className="px-3 py-2 text-center font-bold border border-gray-200" style={{ background: "#f5f5f5" }}>액취증/다한증</td>
                      <td className="px-4 py-2 text-left border border-gray-200">미라드라이 프레쉬</td>
                      <td className="px-3 py-2 text-center border border-gray-200">1회</td>
                      <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>220</td>
                      <td className="px-3 py-2 text-center border border-gray-200"></td>
                    </tr>
                    {/* 손/발톱무좀 */}
                    {[
                      ["손톱무좀 (손톱 1개당)","1회","3","5"],
                      ["발톱무좀 (발톱 1개당)","1회","3","5"],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={2} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>손/발톱무좀</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 에스테틱 */}
                    {[
                      ["비타민","1회","5","10"],
                      ["포아딤","1회","15","20"],
                      ["버블테라피","1회","15",""],
                      ["LDM","1회","15",""],
                      ["플로리스","1회","15",""],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={5} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>에스테틱</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: r[3] ? "#b94040" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                    {/* 주의 문구 */}
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-center text-xs font-medium border border-yellow-200" style={{ background: "#fffbe6", color: "#7a5c00" }}>
                        ※ 위 시술은 치료부위와 분포도에 따라 비용이 달라질수 있습니다.
                      </td>
                    </tr>
                    {/* 제증명 수수료 */}
                    {[
                      ["진단서","","2",""],
                      ["소견서","","2",""],
                      ["의뢰서","","0.5",""],
                      ["진료확인서","","0.3",""],
                      ["진료기록사본","1~5매","0.1 (장당)","6매이상 100원(장당)"],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                        {i === 0 && <td rowSpan={5} className="px-3 py-2 text-center font-bold border border-gray-200 align-middle" style={{ background: "#f5f5f5" }}>제증명 수수료</td>}
                        <td className="px-4 py-2 text-left border border-gray-200">{r[0]}</td>
                        <td className="px-3 py-2 text-center border border-gray-200">{r[1]}</td>
                        <td className="px-3 py-2 text-center font-semibold border border-gray-200" style={{ color: "#1a4fa0" }}>{r[2]}</td>
                        <td className="px-3 py-2 text-center text-xs border border-gray-200" style={{ color: r[3] ? "#555" : undefined }}>{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 비급여 항목 테이블 */}
          <div className="space-y-6">
            {labels.categories.map((cat, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden shadow-sm" style={{ border: "1.5px solid #D0E4FF" }}>
                {/* 카테고리 헤더 */}
                <div className="px-6 py-4 flex items-center gap-3" style={{ background: "#1A4FA0" }}>
                  <ChevronRight size={18} className="text-white" />
                  <h3 className="font-bold text-white text-base">{cat.name}</h3>
                </div>
                {/* 항목 목록 */}
                <div className="divide-y divide-blue-100">
                  {cat.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between px-6 py-4" style={{ background: iIdx % 2 === 0 ? "#fff" : "#F5F9FF" }}>
                      <span className="text-sm font-medium" style={{ color: "#1F2937" }}>{item.name}</span>
                      <span className="text-sm font-bold" style={{ color: "#1A4FA0" }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 안내 문구 */}
          <div className="mt-8 p-5 rounded-xl text-sm leading-relaxed" style={{ background: "#FFF8E8", border: "1.5px solid #F0D080", color: "#7A5A00" }}>
            {labels.notice}
          </div>

          {/* 의료광고 필수 표기 영역 */}
          <div className="mt-6 p-5 rounded-xl text-xs leading-relaxed space-y-2" style={{ background: "#F0F4FF", border: "1.5px solid #C0D0F0", color: "#374151" }}>
            <p className="font-bold text-sm mb-3" style={{ color: "#1A4FA0" }}>
              {lang === "ko" ? "⚠️ 비급여 진료비 안내 주의사항" :
               lang === "ja" ? "⚠️ 非保険診療費用の注意事項" :
               lang === "zh" ? "⚠️ 非医保诊疗费用注意事项" :
               "⚠️ Non-Covered Fee Notice"}
            </p>
            <p>
              {lang === "ko" ? "• 비급여 진료비용은 의료기관의 사정에 따라 변동될 수 있으며, 실제 진료 시 다를 수 있습니다." :
               lang === "ja" ? "• 非保険診療費用は医療機関の事情により変動する場合があります。" :
               lang === "zh" ? "• 非医保诊疗费用可能根据医疗机构情况发生变动。" :
               "• Non-covered fees may vary depending on the medical institution and may change at actual treatment."}
            </p>
            <p>
              {lang === "ko" ? `• 마지막 갱신일: ${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월` :
               lang === "ja" ? `• 最終更新日: ${new Date().getFullYear()}年${new Date().getMonth() + 1}月` :
               lang === "zh" ? `• 最后更新日期: ${new Date().getFullYear()}年${new Date().getMonth() + 1}月` :
               `• Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`}
            </p>
            <p>
              {lang === "ko" ? "• 정확한 비용은 내원 상담 후 안내드리며, 사전 상담을 권장합니다." :
               lang === "ja" ? "• 正確な費用は来院相談後にご案内します。事前相談をお勧めします。" :
               lang === "zh" ? "• 准确费用将在就诊和诊后告知，建议提前和诊。" :
               "• Exact costs will be provided after consultation. We recommend a prior consultation."}
            </p>
            <p>
              {lang === "ko" ? "• 건강보험심사평가원(HIRA) 홈페이지에서 전체 의료기관의 비급여 진료비용을 비교할 수 있습니다." :
               lang === "ja" ? "• 健康保険審査評価院(HIRA)のホームページで全医療機関の非保険診療費用を比較できます。" :
               lang === "zh" ? "• 可在健康保险审查评价院(HIRA)网站比较各医疗机构的非医保诊疗费用。" :
               "• You can compare non-covered fees across medical institutions on the HIRA website."}
            </p>
          </div>

          {/* 문의 CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm mb-4" style={{ color: "#4A6FA5" }}>
              {lang === "ko" ? "정확한 비용은 내원 상담 후 안내드립니다." :
               lang === "ja" ? "正確な費用は来院相談後にご案内します。" :
               lang === "zh" ? "准确费用将在就诊咨询后告知。" :
               "Exact costs will be provided after consultation."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                style={{ background: "#1A4FA0", color: "#fff" }}
              >
                {lang === "ko" ? "📞 전화 상담" : lang === "ja" ? "📞 電話相談" : lang === "zh" ? "📞 电话咨询" : "📞 Call Us"}
              </a>
              <a
                href="https://pf.kakao.com/_HNyGC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                style={{ background: "#FEE500", color: "#1F2937" }}
              >
                {lang === "ko" ? "💬 카카오톡 상담" : lang === "ja" ? "💬 KakaoTalk相談" : lang === "zh" ? "💬 KakaoTalk咨询" : "💬 KakaoTalk"}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
