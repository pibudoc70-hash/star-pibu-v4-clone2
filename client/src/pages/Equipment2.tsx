/**
 * Equipment2 Page - 시술·장비소개2 (관리자 등록 시술 프로그램)
 * 별도 페이지에서 관리자가 등록한 시술을 표시하고 관리할 수 있는 페이지
 *
 * [PAGE LIFECYCLE] localized live page (PR-38 정책 확정)
 * - route: /equipment2, /en/equipment2, /ja/equipment2, /zh/equipment2 (App.tsx live)
 * - canonical: lang 기반 동적 계산 (ko → /equipment2, 기타 → /{lang}/equipment2)
 * - ogUrl: canonical과 동일
 * - ogLocale: LANG_TO_OG_LOCALE[lang] (언어별 정렬)
 * - hreflangs: buildHreflangs("/equipment2", "/en/...", "/ja/...", "/zh/...")
 * - title/description/keywords: ko/en/ja/zh 언어별 정렬
 * - noindex: 없음 (전체 색인 허용)
 * - Equipment2Detail.tsx의 다국어 SEO 패턴과 동일한 정책 적용
 */
import SeoHead, { buildHreflangs, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED } from "@/components/SeoHead";
import { useLang } from "@/contexts/LangContext";
import Header from "@/components/Header";
import TreatmentsEquipmentSection from "@/components/TreatmentsEquipmentSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Equipment2() {
  const { lang } = useLang();

  // SEO: 현재 언어 route 기준 pageUrl 계산 (localized live page 정책)
  const langPrefix = lang === "ko" ? "" : `/${lang}`;
  const pageUrl = `https://www.star-pibu.com${langPrefix}/equipment2`;

  // 언어별 SEO 메타 (title/description/keywords)
  const seoTitle =
    lang === "ja" ? "治療・機器紹介 | 釜山スター皮膚科" :
    lang === "zh" ? "治疗·设备介绍 | 釜山星皮肤科" :
    lang === "en" ? "Treatments & Equipment | Star Dermatology Clinic Busan" :
    "시술·장비소개 | 부산 스타피부과";

  const seoDescription =
    lang === "ja" ? "釜山スター皮膚科の各種治療・機器をご紹介します。ウルセラピー・サーマジFLX・色素治療・レーザーなど最新医療機器とプレミアム治療を提供しています。" :
    lang === "zh" ? "釜山星皮肤科为您介绍各种治疗项目和设备。热玛吉FLX、皮秒激光、提升、色素治疗等最新医疗设备和高端治疗项目。" :
    lang === "en" ? "Star Dermatology Clinic Busan offers a wide range of treatments and equipment. Ultherapy, Thermage FLX, pigmentation treatment, laser and more premium medical programs." :
    "부산 스타피부과의 다양한 시술과 장비를 소개합니다. 울쎄라, 써마지 리프팅, 색소질환 치료, 레이저 시술 등 최신 의료 장비와 프리미엄 시술 프로그램을 제공합니다.";

  const seoKeywords =
    lang === "ja" ? "釜山皮膚科, ウルセラピー, サーマジ, リフティング, 色素治療, レーザー治療, 機器紹介" :
    lang === "zh" ? "釜山皮肤科, 热玛吉, 皮秒激光, 提升, 色素治疗, 激光治疗, 设备介绍" :
    lang === "en" ? "Busan dermatology, Ultherapy, Thermage, lifting, pigmentation, laser treatment, equipment guide" :
    "부산피부과, 울쎄라, 써마지, 리프팅, 색소질환, 레이저치료, 피부시술, 장비소개, 부산리프팅, 피부관리";

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogImage={OG_IMAGE_LOCALIZED[lang] ?? OG_IMAGE_LOCALIZED.ko}
        ogSiteName={SITE_NAME_LOCALIZED[lang] ?? SITE_NAME_LOCALIZED.ko}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs(
          "/equipment2",
          "/en/equipment2",
          "/ja/equipment2",
          "/zh/equipment2",
        )}
      />

      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        {/* SEO 용 h1 태그 - 시각적으로 숨김으로써 접근성 유지 (PR-39: lang-aware) */}
        <h1 className="sr-only">
          {lang === "ja" ? "釜山スター皮膚科 治療・機器ガイド - ウルセラピー サーマジ リフティング 色素治療 レーザー" :
           lang === "zh" ? "釜山星皮肤科 治疗设备指南 - 热玛吉 提升 色素治疗 激光" :
           lang === "en" ? "Star Dermatology Clinic Busan - Treatments & Equipment Guide: Ultherapy, Thermage, Lifting, Pigmentation, Laser" :
           "부산 서면 스타피부과 시술 안내 - 울쎄라 써마지 리프팅 색소질환 레이저"}
        </h1>
        {/* Treatments + Equipment Section 2 - DB 연동 (관리자 등록) */}
        <TreatmentsEquipmentSection />

        {/* Location & Contact - 오시는 길 */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA */}
      <FloatingCTA />
    </div>
  );
}
