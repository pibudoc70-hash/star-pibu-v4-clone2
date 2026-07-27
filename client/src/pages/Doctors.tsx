/**
 * Doctors Page — 피부과전문의 3인 소개
 *
 * [PAGE LIFECYCLE] localized live page
 * - route: /doctors, /en/doctors, /ja/doctors, /zh/doctors (App.tsx live)
 * - canonical: lang 기반 동적 계산
 * - 목적: SEO — "부산 피부과전문의", "스타피부과 의료진" 키워드 노출
 * - 레이아웃: 좌측 세로 탭 사이드바 + 우측 상세 패널 (DoctorsSection 동일 패턴)
 */
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import MainLayout from "@/components/MainLayout";
import SeoHead, {
  buildHreflangs,
  buildBreadcrumbJsonLd,
  LANG_TO_OG_LOCALE,
  OG_IMAGE_LOCALIZED,
  SITE_NAME_LOCALIZED,
  BASE_URL,
} from "@/components/SeoHead";
import OptimizedImage from "@/components/OptimizedImage";
import { getLocalizedUrl } from "@/lib/localizedPath";
import { useDoctorViewModel } from "@/hooks/useDoctorViewModel";
import { DoctorCredentials } from "@/components/doctors/DoctorCredentials";
import { DoctorTabButton } from "@/components/doctors/DoctorTabButton";
import { Zap } from "lucide-react";

// ── SEO 다국어 메타 ────────────────────────────────────────────────────────────
const SEO_TITLE: Record<string, string> = {
  ko: "피부과전문의 3인 | 부산 서면 스타피부과",
  en: "3 Board-Certified Dermatologists | Star Dermatology Busan",
  ja: "皮膚科専門医3名 | 釜山 서면 スター皮膚科",
  zh: "3位皮肤科专科医生 | 釜山서면 STAR皮肤科",
};
const SEO_DESC: Record<string, string> = {
  ko: "부산 서면 스타피부과 피부과전문의 3인 소개. 조시형 원장(써마지 FLX 자문의, 눈밑지방재배치 4,000례), 우혜진 원장, 이기욱 원장. 20년 이상의 임상 경험으로 안전하고 자연스러운 피부 치료를 제공합니다.",
  en: "Meet the 3 board-certified dermatologists at Star Dermatology, Seomyeon, Busan. Dr. Jo Si-Hyung (Thermage FLX advisor, 4,000+ under-eye fat repositioning cases), Dr. Woo Hye-Jin, Dr. Lee Gi-Wook. Over 20 years of clinical expertise.",
  ja: "釜山서면スター皮膚科の皮膚科専門医3名をご紹介します。趙時亨院長（써마지FLX顧問医、目の下の脂肪再配置4,000例以上）、禹惠珍院長、李基旭院長。20年以上の臨床経験。",
  zh: "釜山서면STAR皮肤科三位皮肤科专科医生介绍。赵时亨院长（써마지FLX顾问医、眼下脂肪重置4,000例以上）、禹慧珍院长、李基旭院长。20年以上临床经验。",
};
const SEO_KEYWORDS: Record<string, string> = {
  ko: "스타피부과 의료진, 부산 피부과전문의, 조시형 원장, 우혜진 원장, 이기욱 원장, 서면피부과 전문의, 부산피부과 의사, 써마지 자문의, 눈밑지방재배치 전문의",
  en: "Star Dermatology doctors, Busan dermatologist, Dr Jo Si-Hyung, board-certified dermatologist Busan, Seomyeon dermatology",
  ja: "スター皮膚科 医師, 釜山皮膚科専門医, 趙時亨院長, 皮膚科専門医 釜山",
  zh: "STAR皮肤科 医生, 釜山皮肤科专科医生, 赵时亨院长, 皮肤科专科医生 釜山",
};

// ── 페이지 제목 다국어 ─────────────────────────────────────────────────────────
const PAGE_TITLE: Record<string, string> = {
  ko: "피부과전문의 3인",
  en: "3 Board-Certified Dermatologists",
  ja: "皮膚科専門医 3名",
  zh: "3位皮肤科专科医生",
};
const PAGE_TAGLINE: Record<string, string> = {
  ko: "피부의 격(格)이 바뀌는 순간, 전문의의 안목이 차이를 만듭니다.",
  en: "When your skin transforms, the specialist's insight makes all the difference.",
  ja: "肌の格が変わる瞬間、専門医の眼力が違いを生む。",
  zh: "肌肤蜕变的瞬间，专科医生的眼光创造不同。",
};

export default function Doctors() {
  const { t, lang } = useLang();
  const {
    mergedDoctors,
    doctor,
    activeDoctor,
    expandedCredentials,
    handleDoctorSelect,
    handleImageLoad,
    toggleCredentials,
    handleTouchStart,
    handleTouchEnd,
    handleTabKeyDown,
  } = useDoctorViewModel(t);
  const badgeLabel = t.doctors.badge;

  // ── SEO ──────────────────────────────────────────────────────────────────────
  const pageUrl = getLocalizedUrl(lang, "/doctors");
  const seoTitle = SEO_TITLE[lang] ?? SEO_TITLE.ko;
  const seoDesc = SEO_DESC[lang] ?? SEO_DESC.ko;
  const seoKeywords = SEO_KEYWORDS[lang] ?? SEO_KEYWORDS.ko;
  const ogLocale = LANG_TO_OG_LOCALE[lang as keyof typeof LANG_TO_OG_LOCALE] ?? "ko_KR";
  const ogImage = OG_IMAGE_LOCALIZED[lang as keyof typeof OG_IMAGE_LOCALIZED] ?? OG_IMAGE_LOCALIZED.ko;
  const siteName = SITE_NAME_LOCALIZED[lang as keyof typeof SITE_NAME_LOCALIZED] ?? SITE_NAME_LOCALIZED.ko;

  // ── JSON-LD: Person 스키마 3인 ────────────────────────────────────────────────
  const personSchemas = mergedDoctors.map((d) => ({
    "@context": "https://schema.org",
    "@type": "Physician",
    name: d.name,
    jobTitle: d.jobTitleEn ?? "Dermatologist",
    description: d.schemaDescription ?? d.intro?.[0] ?? "",
    image: `${BASE_URL}${d.image}`,
    worksFor: {
      "@type": "MedicalBusiness",
      name: siteName,
      url: BASE_URL,
    },
    ...(d.alumniOf && {
      alumniOf: d.alumniOf.map((a) => ({ "@type": "EducationalOrganization", name: a.name, ...(a.url && { url: a.url }) })),
    }),
    ...(d.memberOf && {
      memberOf: d.memberOf.map((m) => ({ "@type": "Organization", name: m.name, ...(m.url && { url: m.url }) })),
    }),
    ...(d.award && { award: d.award }),
    ...(d.sameAs && { sameAs: d.sameAs }),
    ...(d.availableService && {
      availableService: d.availableService.map((s) => ({ "@type": "MedicalProcedure", name: s })),
    }),
  }));

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: siteName, url: BASE_URL },
    { name: PAGE_TITLE[lang] ?? PAGE_TITLE.ko, url: `${BASE_URL}${pageUrl}` },
  ]);

  return (
    <MainLayout>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        canonical={`${BASE_URL}${pageUrl}`}
        ogUrl={`${BASE_URL}${pageUrl}`}
        ogLocale={ogLocale}
        ogImage={ogImage}
        ogSiteName={siteName}
        hreflangs={buildHreflangs("/doctors", "/en/doctors", "/ja/doctors", "/zh/doctors")}
        jsonLd={[...personSchemas, breadcrumbSchema]}
        pageType="treatment"
      />

      {/* ── 페이지 헤더 ─────────────────────────────────────────────────────── */}
      <section
        className="py-12 sm:py-16 text-center"
        style={{ background: "linear-gradient(135deg, #faf8f3 0%, #f5efe0 100%)" }}
      >
        <div className="container">
          <p
            className="font-montserrat text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#b89a5a" }}
          >
            STAR DERMATOLOGY · {t.doctors.label}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
            style={{ color: "#1a1a1a" }}
          >
            {PAGE_TITLE[lang] ?? PAGE_TITLE.ko}
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#6b5c3e" }}>
            {PAGE_TAGLINE[lang] ?? PAGE_TAGLINE.ko}
          </p>
        </div>
      </section>

      {/* ── 메인 패널 (DoctorsSection 동일 레이아웃) ──────────────────────── */}
      <section className="py-10 sm:py-16 dr-section-bg">
        <div className="container">
          <div
            className="rounded-3xl overflow-hidden dr-panel-card card card--doctor dr-panel-border"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* ── 데스크톱 레이아웃 ─────────────────────────────────────── */}
            <div className="hidden lg:flex dr-desktop-panel">
              {/* 좌측 탭 사이드바 */}
              <div className="flex flex-col dr-tab-sidebar dr-tab-sidebar-border">
                <div className="px-5 py-7 border-b text-center dr-brand-border">
                  <p className="font-montserrat text-[0.6rem] tracking-[0.25em] uppercase dr-brand-label">
                    STAR DERMATOLOGY
                  </p>
                  <p className="text-[0.6rem] mt-0.5 dr-brand-sub">{t.doctors.label}</p>
                </div>
                <div
                  role="tablist"
                  aria-orientation="vertical"
                  aria-label={t.doctors.label}
                  className="flex flex-col flex-1 justify-center"
                >
                  {mergedDoctors.map((d) => (
                    <DoctorTabButton
                      key={d.id}
                      doctor={d}
                      isActive={activeDoctor === d.id}
                      variant="desktop"
                      badgeLabel={badgeLabel}
                      onSelect={handleDoctorSelect}
                      onKeyDown={(e) => handleTabKeyDown(e, "vertical")}
                    />
                  ))}
                </div>
              </div>

              {/* 우측 상세 패널 */}
              <div
                role="tabpanel"
                id={`doctor-panel-${activeDoctor}`}
                aria-labelledby={`doctor-tab-${activeDoctor}`}
                className="flex flex-1"
              >
                {mergedDoctors.map((d) => (
                  <div
                    key={d.id}
                    id={`dr-${d.slug}`}
                    className="absolute top-0 left-0 w-0 h-0 overflow-hidden scroll-mt-24 md:scroll-mt-28"
                    aria-hidden="true"
                  />
                ))}
                {/* 사진 영역 */}
                <div className="relative flex-shrink-0 dr-photo-panel">
                  {mergedDoctors.map((d) => (
                    <OptimizedImage
                      key={d.id}
                      src={d.image}
                      alt={d.name}
                      priority={activeDoctor === d.id}
                      usePicture={false}
                      onLoad={() => handleImageLoad(d.id)}
                      className={`dr-photo-img ${activeDoctor === d.id ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
                      style={{ objectPosition: "top 0%" }}
                    />
                  ))}
                  <div className="dr-photo-fade-right" />
                  <div className="dr-photo-fade-bottom" />
                </div>

                {/* 텍스트 상세 */}
                <div className="flex-1 p-12 flex flex-col gap-5 overflow-y-auto">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-baseline gap-3 flex-wrap dr-name-header">
                        <h2 className="dr-name-h3-desktop">{doctor.name}</h2>
                        <span className="font-montserrat dr-name-en">{doctor.nameEn}</span>
                      </div>
                    </div>
                    <img
                      src="/api/storage/derm-specialist-badge_9b9bcf96.png"
                      alt={t.doctors.dermBadge?.replace("\n", " ") ?? "피부과 전문의"}
                      className="dr-derm-badge-img dr-derm-badge-img-desktop"
                      draggable={false}
                    />
                  </div>

                  <div className="text-sm leading-relaxed dr-intro-desktop">
                    {Array.isArray(doctor.intro)
                      ? doctor.intro.map((para, idx) => (
                          <p key={idx} className="dr-intro-para">{para}</p>
                        ))
                      : <p>{doctor.intro as string}</p>}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3 dr-sub-header-wrap">
                      <Zap size={16} className="dr-sub-header-icon" />
                      <p className="text-xs tracking-widest uppercase dr-sub-header-text">
                        {t.doctors.specialtyTitle}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 dr-specialty-wrap">
                      {doctor.specialties.map((s) => (
                        <span key={s} className="px-3 py-1.5 text-xs dr-specialty-chip-desktop">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="dr-gold-divider dr-gold-divider-light" />

                  <DoctorCredentials
                    doctor={doctor}
                    variant="desktop"
                    credentialsTitle={t.doctors.credentialsTitle}
                  />
                </div>
              </div>
            </div>

            {/* ── 모바일 레이아웃 ───────────────────────────────────────── */}
            <div className="lg:hidden">
              {/* 상단 탭 */}
              <div
                role="tablist"
                aria-orientation="horizontal"
                aria-label={t.doctors.label}
                className="flex dr-mobile-tabbar"
              >
                {mergedDoctors.map((d) => (
                  <DoctorTabButton
                    key={d.id}
                    doctor={d}
                    isActive={activeDoctor === d.id}
                    variant="mobile"
                    badgeLabel={badgeLabel}
                    onSelect={handleDoctorSelect}
                    onKeyDown={(e) => handleTabKeyDown(e, "horizontal")}
                  />
                ))}
              </div>

              {/* 사진 */}
              <div className="relative dr-mobile-photo-wrap">
                {mergedDoctors.map((d) => (
                  <OptimizedImage
                    key={d.id}
                    src={d.mobileImage ?? d.image}
                    alt={d.name}
                    priority={activeDoctor === d.id}
                    usePicture={false}
                    onLoad={() => handleImageLoad(d.id)}
                    className={`dr-mobile-photo-img ${activeDoctor === d.id ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
                    style={{ objectPosition: d.mobileObjectPosition ?? "top center" }}
                  />
                ))}
                <div className="dr-mobile-photo-fade" />
              </div>

              {/* 텍스트 */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className="dr-name-h3-mobile">{doctor.name}</h2>
                      <span className="font-montserrat dr-name-en-mobile">{doctor.nameEn}</span>
                    </div>
                  </div>
                  <img
                    src="/api/storage/derm-specialist-badge_9b9bcf96.png"
                    alt={t.doctors.dermBadge?.replace("\n", " ") ?? "피부과 전문의"}
                    className="dr-derm-badge-img dr-derm-badge-img-mobile"
                    draggable={false}
                  />
                </div>

                <div className="text-sm leading-relaxed dr-intro-mobile">
                  {Array.isArray(doctor.intro)
                    ? doctor.intro.map((para, idx) => (
                        <p key={idx} className="dr-intro-para">{para}</p>
                      ))
                    : <p>{doctor.intro as string}</p>}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 dr-sub-header-wrap">
                    <Zap size={14} className="dr-sub-header-icon" />
                    <p className="text-xs tracking-widest uppercase dr-sub-header-text">
                      {t.doctors.specialtyTitle}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 dr-specialty-wrap">
                    {doctor.specialties.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs dr-specialty-chip-mobile">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dr-gold-divider dr-gold-divider-light" />

                <DoctorCredentials
                  doctor={doctor}
                  variant="mobile"
                  credentialsTitle={t.doctors.credentialsTitle}
                  expanded={expandedCredentials}
                  onToggle={toggleCredentials}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 하단 CTA ────────────────────────────────────────────────────────── */}
      <section
        className="py-14 sm:py-20 text-center"
        style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)" }}
      >
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {lang === "en" ? "Consult with Our Specialists" : lang === "ja" ? "専門医に相談する" : lang === "zh" ? "咨询专科医生" : "전문의 직접 상담"}
          </h2>
          <p className="text-sm text-gray-300 mb-8 max-w-xl mx-auto">
            {lang === "en"
              ? "Our board-certified dermatologists will recommend the most suitable treatment for you."
              : lang === "ja"
              ? "皮膚科専門医が直接診断し、最適な治療をご提案します。"
              : lang === "zh"
              ? "皮肤科专科医生将为您直接诊断并推荐最适合的治疗方案。"
              : "피부과 전문의가 직접 진단하고 최적의 시술을 추천해 드립니다."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://pf.kakao.com/_HNyGC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#FEE500", color: "#1a1a1a" }}
            >
              {lang === "en" ? "KakaoTalk Consultation" : lang === "ja" ? "カカオトーク相談" : lang === "zh" ? "KakaoTalk咨询" : "카카오톡 상담"}
            </a>
            <a
              href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm border-2 border-white text-white transition-all hover:bg-white hover:text-gray-900 active:scale-95"
            >
              {lang === "en" ? "Call Us" : lang === "ja" ? "お電話" : lang === "zh" ? "电话咨询" : "전화 상담"} 051-818-2300
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
