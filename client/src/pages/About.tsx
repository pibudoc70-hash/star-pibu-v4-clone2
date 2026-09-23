/**
 * About Page - 피부과 소개
 *
 * [PAGE LIFECYCLE] localized live page
 * - route: /about, /en/about, /ja/about, /zh/about, /zh-tw/about
 * - canonical, OG, hreflang and visible copy are language-aware.
 */

import MainLayout from '@/components/MainLayout';
import { useLang } from '@/contexts/LangContext';
import OptimizedImage from '@/components/OptimizedImage';
import SeoHead, {
  buildHreflangs,
  buildBreadcrumbJsonLd,
  LANG_TO_OG_LOCALE,
  OG_IMAGE_LOCALIZED,
  SITE_NAME_LOCALIZED,
  BASE_URL,
} from '@/components/SeoHead';
import { getLocalizedUrl } from '@/lib/localizedPath';
import { CalendarDays, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

const VALUE_ICONS = [HeartHandshake, Sparkles, ShieldCheck, CalendarDays] as const;

export default function About() {
  const { t, lang } = useLang();
  const pageUrl = getLocalizedUrl(lang, "/about");

  const seoTitle =
    lang === "ja" ? "クリニック紹介 | 釜山西面スター皮膚科 - 20年の経験を持つ皮膚科専門医" :
    lang === "zh" ? "诊所介绍 | 釜山西面星皮肤科 - 20年经验皮肤科专科医生" :
    lang === "zh-TW" ? "診所介紹｜釜山西面STAR皮膚科" :
    lang === "en" ? "About Us | STAR Dermatology Clinic Busan - 20 Years of Expert Care" :
    "피부과 소개 | 부산 서면 스타피부과 - 20년 경력 피부과 전문의";

  const seoDescription =
    lang === "ja" ? "釜山西面スター皮膚科をご紹介します。20年の経験を持つ皮膚科専門医が直接診療し、ウルセラピー・サーマジ・リフティング・色素治療などプレミアム治療を提供しています。" :
    lang === "zh" ? "介绍釜山西面星皮肤科。拥有20年经验的皮肤科专科医生亲自诊疗，提供热玛吉、提升、色素治疗等高端治疗项目。" :
    lang === "zh-TW" ? "介紹釜山西面STAR皮膚科的診療理念、醫師團隊、診療時間與交通資訊。" :
    lang === "en" ? "About STAR Dermatology Clinic in Seomyeon, Busan. A board-certified dermatologist with 20+ years of experience provides Ultherapy, Thermage, lifting, pigmentation treatments and more." :
    "부산 서면 스타피부과를 소개합니다. 20년 경력의 피부과 전문의가 직접 진료하며, 울쎄라, 써마지, 리프팅, 색소질환 등 프리미엄 시술을 제공합니다.";

  const seoKeywords =
    lang === "ja" ? "釜山皮膚科, スター皮膚科, 皮膚科専門医, 西面皮膚科, 釜山リフティング" :
    lang === "zh" ? "釜山皮肤科, 星皮肤科, 皮肤科专科, 西面皮肤科, 釜山提升" :
    lang === "zh-TW" ? "釜山皮膚科, STAR皮膚科, 西面皮膚科, 皮膚科專科, 診所介紹" :
    lang === "en" ? "Busan dermatology, STAR Dermatology Clinic, dermatologist Busan, Seomyeon skin clinic, about us" :
    "부산피부과, 피부과소개, 피부과전문의, 스타피부과, 서면피부과, 부산리프팅";

  const aboutUsLabel =
    lang === "ja" ? "クリニック紹介" :
    lang === "zh" ? "诊所介绍" :
    lang === "zh-TW" ? "診所介紹" :
    lang === "en" ? "About Us" :
    "피부과 소개";

  const medicalTeamAlt =
    lang === "ja" ? "医療チーム" :
    lang === "zh" ? "医疗团队" :
    lang === "zh-TW" ? "醫療團隊" :
    lang === "en" ? "Medical Team" :
    "의료진";

  const sinceLabel =
    lang === "ja" ? "2006年創業" :
    lang === "zh" ? "创立于2006年" :
    lang === "zh-TW" ? "自2006年起" :
    lang === "en" ? "Est. 2006" :
    "Since 2006";

  const doctorLinkLabel =
    lang === "ja" ? "医療陣を見る →" :
    lang === "zh" ? "查看医疗团队 →" :
    lang === "zh-TW" ? "查看醫師團隊 →" :
    lang === "en" ? "Meet Our Doctors →" :
    "의료진 소개 보기 →";
  const philosophyEyebrow = t.about.sectionLabels?.philosophy ?? "OUR PHILOSOPHY";
  const desktopPageTitle = lang === "ko" ? "스타피부과 소개" : aboutUsLabel;
  const desktopPageTagline = lang === "ko"
    ? "보이는 아름다움 그 너머, 피부의 본질까지 생각합니다."
    : t.about.title;
  const desktopPhilosophyHeading = lang === "ko"
    ? "스타피부과가 지키는 네 가지 약속"
    : t.about.title;

  return (
    <MainLayout>
      <SeoHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={pageUrl}
        ogUrl={pageUrl}
        ogImage={OG_IMAGE_LOCALIZED[lang] ?? OG_IMAGE_LOCALIZED.ko}
        ogSiteName={SITE_NAME_LOCALIZED[lang] ?? SITE_NAME_LOCALIZED.ko}
        ogLocale={LANG_TO_OG_LOCALE[lang] ?? "ko_KR"}
        hreflangs={buildHreflangs("/about", "/en/about", "/ja/about", "/zh/about", "/zh-tw/about")}
        pageType="treatment"
        jsonLd={[buildBreadcrumbJsonLd([
          { name: lang === "en" ? "Home" : lang === "ja" ? "ホーム" : lang === "zh" ? "首页" : lang === "zh-TW" ? "首頁" : "홈", url: BASE_URL + "/" },
          { name: lang === "en" ? "About" : lang === "ja" ? "クリニック紹介" : lang === "zh" ? "关于我们" : lang === "zh-TW" ? "診所介紹" : "병원 소개", url: pageUrl },
        ])]}
      />

      {/* Desktop: standalone subpage title plus warm editorial composition. */}
      <div className="hidden md:block bg-[var(--brand-bg)] text-[var(--brand-text)]">
        <section className="dr-page-header pt-32 pb-16 text-center" aria-labelledby="about-page-title">
          <div className="container">
            <p className="dr-page-header-eyebrow font-montserrat text-xs tracking-[0.3em] uppercase mb-3">STAR DERMATOLOGY</p>
            <h1 id="about-page-title" className="dr-page-header-title text-5xl font-extrabold mb-4">{desktopPageTitle}</h1>
            <p className="dr-page-header-tagline text-base">{desktopPageTagline}</p>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="container">
            <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] items-center gap-14 lg:gap-20">
              <div>
                <div className="mb-8 border-l-2 border-[color:var(--color-gold-primary)] pl-5">
                  <p className="font-montserrat text-xs font-semibold tracking-[0.25em] text-[var(--color-gold-deep)]">{t.about.title}</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">{t.about.philosophyTagline}</p>
                </div>
                <p className="max-w-2xl text-lg leading-9 text-[var(--brand-text-mid)]">{t.about.desc}</p>
                <a
                  href="/doctors"
                  className="mt-9 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-gold-primary)] bg-[var(--brand-bg-card)] px-5 py-3 text-sm font-semibold text-[var(--color-gold-dark)] transition-colors hover:bg-[var(--color-gold-pale)]"
                >
                  {doctorLinkLabel}
                </a>
                <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-[color:var(--color-gold-light)] py-6">
                  {t.about.stats.slice(0, 3).map((stat, idx) => {
                    const Icon = [CalendarDays, HeartHandshake, Sparkles][idx];
                    return (
                      <div key={stat.label} className="px-5 text-center first:border-r first:border-[color:var(--color-gold-light)] last:border-l last:border-[color:var(--color-gold-light)]">
                        <Icon size={20} aria-hidden="true" className="mx-auto text-[var(--color-gold-primary)]" />
                        <p className="mt-3 text-2xl font-extrabold text-[var(--color-gold-dark)]">{stat.num}</p>
                        <p className="mt-1 text-xs text-[var(--brand-text-mid)]">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <figure className="relative overflow-hidden rounded-[var(--card-radius)] shadow-[0_18px_42px_rgba(57,39,20,0.14)]">
                <OptimizedImage
                  id="about-section-image-desktop"
                  src="/manus-storage/patient-consultation-mobile_e2474e05_fb420943_2114c946.webp"
                  alt={medicalTeamAlt}
                  className="h-[27rem] w-full object-cover"
                  height={432}
                />
                <figcaption className="absolute bottom-5 left-5 rounded-full bg-[rgba(44,44,44,0.78)] px-4 py-2 text-sm font-semibold text-white">
                  {sinceLabel}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="pb-20 pt-8 lg:pb-24 lg:pt-12">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-montserrat text-xs font-semibold tracking-[0.25em] text-[var(--color-gold-deep)]">{philosophyEyebrow}</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-text)]">{desktopPhilosophyHeading}</h2>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-5">
              {t.about.values.map((value, idx) => {
                const Icon = VALUE_ICONS[idx] ?? ShieldCheck;
                return (
                  <article key={value.letter} className="border-t border-[color:var(--color-gold-light)] p-7">
                    <div className="flex items-start gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold-pale)] text-[var(--color-gold-dark)]"><Icon size={20} aria-hidden="true" /></span>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--brand-text)]"><span className="mr-1 text-[var(--color-gold-deep)]">{value.letter}</span>{value.title.slice(1)}</h3>
                        <p className="mt-2 text-sm leading-7 text-[var(--brand-text-mid)]">{value.desc}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile is intentionally retained unchanged. */}
      <section className="md:hidden py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--color-gold-primary)' }}>{aboutUsLabel}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{t.about.title}</h1>
              <p className="text-2xl font-bold mb-6" style={{ color: 'var(--color-gold-primary)' }}>STAR DERMATOLOGY</p>
              <p className="text-gray-600 mb-8 leading-relaxed text-base">{t.about.desc}</p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {t.about.stats.slice(0, 3).map((stat, idx) => (
                  <div key={idx} className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--color-gold-pale)' }}>
                    <div className="text-3xl font-bold mb-2" style={{ color: 'var(--color-gold-primary)' }}>{stat.num}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {t.about.values.map((value, idx) => (
                  <div key={idx} className="border-l-4 pl-4" style={{ borderColor: 'var(--color-gold-primary)' }}>
                    <h3 className="font-bold text-gray-900 mb-1"><span style={{ color: 'var(--color-gold-primary)' }}>{value.letter}</span>{value.title.slice(1)}</h3>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a href="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: 'var(--color-gold-primary)' }}>{doctorLinkLabel}</a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-96 flex items-center justify-center overflow-hidden">
                <OptimizedImage id="about-section-image" src="/manus-storage/patient-consultation-mobile_e2474e05_fb420943_2114c946.webp" alt={medicalTeamAlt} className="w-full h-full object-cover" height={384} />
              </div>
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm font-semibold">{sinceLabel}</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
