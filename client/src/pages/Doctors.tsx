/**
 * Doctors Page — 피부과전문의 3인 소개
 *
 * [PAGE LIFECYCLE] localized live page
 * - route: /doctors, /en/doctors, /ja/doctors, /zh/doctors (App.tsx live)
 * - canonical: lang 기반 동적 계산
 * - 목적: SEO — "부산 피부과전문의", "스타피부과 의료진" 키워드 노출
 * - 데스크톱: 3인의 전체 프로필을 순서대로 보여주는 세로형 상세 레이아웃
 * - 모바일: 기존 탭 선택형 레이아웃 유지
 */
import { useLang } from "@/contexts/LangContext";
import MainLayout from "@/components/MainLayout";

const DERM_SPECIALIST_BADGE = "/manus-storage/derm-specialist-badge_6d75896e.webp";
import SeoHead, {
  buildHreflangs,
  buildBreadcrumbJsonLd,
  LANG_TO_OG_LOCALE,
  OG_IMAGE_LOCALIZED,
  SITE_NAME_LOCALIZED,
  BASE_URL,
} from "@/components/SeoHead";
import OptimizedImage from "@/components/OptimizedImage";
import { buildPhysicianJsonLd, getDoctorsSeoContent } from "@/lib/doctorsSeo";
import { getLocalizedUrl } from "@/lib/localizedPath";
import { useDoctorViewModel } from "@/hooks/useDoctorViewModel";
import { DoctorCredentials } from "@/components/doctors/DoctorCredentials";
import { DoctorTabButton } from "@/components/doctors/DoctorTabButton";
import { Zap } from "lucide-react";

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
  } = useDoctorViewModel(t, lang);
  const badgeLabel = t.doctors.badge;

  // ── SEO ──────────────────────────────────────────────────────────────────────
  const pageUrl = getLocalizedUrl(lang, "/doctors");
  const seo = getDoctorsSeoContent(lang);
  const ogLocale = LANG_TO_OG_LOCALE[lang as keyof typeof LANG_TO_OG_LOCALE] ?? "ko_KR";
  const ogImage = OG_IMAGE_LOCALIZED[lang as keyof typeof OG_IMAGE_LOCALIZED] ?? OG_IMAGE_LOCALIZED.ko;
  const siteName = SITE_NAME_LOCALIZED[lang as keyof typeof SITE_NAME_LOCALIZED] ?? SITE_NAME_LOCALIZED.ko;

  const personSchemas = buildPhysicianJsonLd(mergedDoctors, siteName, BASE_URL);

  const breadcrumbSchema = buildBreadcrumbJsonLd([
    { name: siteName, url: BASE_URL },
    { name: seo.pageTitle, url: `${BASE_URL}${pageUrl}` },
  ]);

  return (
    <MainLayout>
      <SeoHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
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
        className="dr-page-header dr-page-header--doctors pt-28 pb-12 sm:pt-32 sm:pb-16 text-center"
      >
        <div className="container">
          <p
            className="dr-page-header-eyebrow font-montserrat text-xs tracking-[0.3em] uppercase mb-3"
          >
            STAR DERMATOLOGY · {t.doctors.label}
          </p>
          <h1
            className="dr-page-header-title text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
          >
            {seo.pageTitle}
          </h1>
          <p className="dr-page-header-tagline text-sm sm:text-base">
            {seo.pageTagline}
          </p>
        </div>
      </section>

      {/* ── 의료진 프로필 ─────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 dr-section-bg">
        <div className="container">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* ── 데스크톱: 탭 없이 세 원장 프로필을 모두 표시 ─────────── */}
            <div className="hidden lg:block space-y-10">
              {mergedDoctors.map((d, index) => (
                <article
                  key={d.id}
                  id={`dr-${d.slug}`}
                  aria-labelledby={`doctor-profile-${d.slug}`}
                  className="grid grid-cols-[420px_minmax(0,1fr)] overflow-hidden rounded-3xl dr-panel-card card card--doctor dr-panel-border scroll-mt-24 md:scroll-mt-28"
                >
                  {/* 사진 영역 */}
                  <div className="relative dr-photo-panel">
                    <OptimizedImage
                      src={d.image}
                      alt={d.name}
                      priority={index === 0}
                      usePicture={false}
                      onLoad={() => handleImageLoad(d.id)}
                      className="dr-photo-img opacity-100"
                      style={{ objectPosition: "top 0%" }}
                    />
                    <div className="dr-photo-fade-right" />
                    <div className="dr-photo-fade-bottom" />
                  </div>

                  {/* 텍스트 상세 */}
                  <div className="min-w-0 p-12 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div className="flex items-baseline gap-3 flex-wrap dr-name-header">
                          <h2 id={`doctor-profile-${d.slug}`} className="dr-name-h3-desktop">{d.name}</h2>
                          <span className="font-montserrat dr-name-en">{d.nameEn}</span>
                        </div>
                      </div>
                      <img
                        src={DERM_SPECIALIST_BADGE}
                        alt={t.doctors.dermBadge?.replace("\n", " ") ?? "피부과 전문의"}
                        className="dr-derm-badge-img dr-derm-badge-img-desktop"
                        draggable={false}
                      />
                    </div>

                    <div className="text-sm leading-relaxed dr-intro-desktop">
                      {Array.isArray(d.intro)
                        ? d.intro.map((para, idx) => (
                            <p key={idx} className="dr-intro-para">{para}</p>
                          ))
                        : <p>{d.intro as string}</p>}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3 dr-sub-header-wrap">
                        <Zap size={16} className="dr-sub-header-icon" />
                        <p className="text-xs tracking-widest uppercase dr-sub-header-text">
                          {t.doctors.specialtyTitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 dr-specialty-wrap">
                        {d.specialties.map((s) => (
                          <span key={s} className="px-3 py-1.5 text-xs dr-specialty-chip-desktop">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="dr-gold-divider dr-gold-divider-light" />

                    <DoctorCredentials
                      doctor={d}
                      variant="desktop"
                      credentialsTitle={t.doctors.credentialsTitle}
                    />
                  </div>
                </article>
              ))}
            </div>

            {/* ── 모바일 레이아웃 ───────────────────────────────────────── */}
            <div className="lg:hidden rounded-3xl overflow-hidden dr-panel-card card card--doctor dr-panel-border">
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
                    src={DERM_SPECIALIST_BADGE}
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
    </MainLayout>
  );
}
