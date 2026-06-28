/**
 * About Page - 피부과 소개
 *
 * [PAGE LIFECYCLE] localized live page (정책 확정: PR-38)
 * - route: /about, /en/about, /ja/about, /zh/about (App.tsx live)
 * - canonical: lang 기반 동적 계산 (ko → /about, 기타 → /{lang}/about)
 * - ogUrl: canonical과 동일
 * - ogLocale: LANG_TO_OG_LOCALE[lang] (언어별 정렬)
 * - hreflangs: buildHreflangs("/about", "/en/about", "/ja/about", "/zh/about")
 * - title/description/keywords: ko/en/ja/zh 언어별 정렬
 * - 본문: t.about.desc / t.about.values / t.access (i18n 중앙화 완료)
 * - noindex: 없음 (전체 색인 허용)
 *
 * [TRANSLATION STATUS] 완성 (ko/en/ja/zh 전 섹션 i18n 처리)
 */
import MainLayout from '@/components/MainLayout';
import { useLang } from '@/contexts/LangContext';
import OptimizedImage from '@/components/OptimizedImage';
import SeoHead, { buildHreflangs, buildBreadcrumbJsonLd, LANG_TO_OG_LOCALE, OG_IMAGE_LOCALIZED, SITE_NAME_LOCALIZED, BASE_URL } from '@/components/SeoHead';
import { getLocalizedUrl } from '@/lib/localizedPath';

export default function About() {
  const { t, lang } = useLang();

  // SEO: 현재 언어 route 기준 pageUrl 계산 (localized live page 정책) [R11-F]
  const pageUrl = getLocalizedUrl(lang, "/about");

  // 언어별 SEO 메타 (title/description/keywords)
  const seoTitle =
    lang === "ja" ? "クリニック紹介 | 釜山西面スター皮膚科 - 20年の経験を持つ皮膚科専門医" :
    lang === "zh" ? "诊所介绍 | 釜山西面星皮肤科 - 20年经验皮肤科专科医生" :
    lang === "en" ? "About Us | Star Dermatology Clinic Busan - 20 Years of Expert Care" :
    "피부과 소개 | 부산 서면 스타피부과 - 20년 경력 피부과 전문의";

  const seoDescription =
    lang === "ja" ? "釜山西面スター皮膚科をご紹介します。20年の経験を持つ皮膚科専門医が直接診療し、ウルセラピー・サーマジ・リフティング・色素治療などプレミアム治療を提供しています。" :
    lang === "zh" ? "介绍釜山西面星皮肤科。拥有20年经验的皮肤科专科医生亲自诊疗，提供热玛吉、提升、色素治疗等高端治疗项目。" :
    lang === "en" ? "About Star Dermatology Clinic in Seomyeon, Busan. A board-certified dermatologist with 20+ years of experience provides Ultherapy, Thermage, lifting, pigmentation treatments and more." :
    "부산 서면 스타피부과를 소개합니다. 20년 경력의 피부과 전문의가 직접 진료하며, 울쎄라, 써마지, 리프팅, 색소질환 등 프리미엄 시술을 제공합니다.";

  const seoKeywords =
    lang === "ja" ? "釜山皮膚科, スター皮膚科, 皮膚科専門医, 西面皮膚科, 釜山リフティング" :
    lang === "zh" ? "釜山皮肤科, 星皮肤科, 皮肤科专科, 西面皮肤科, 釜山提升" :
    lang === "en" ? "Busan dermatology, Star Dermatology Clinic, dermatologist Busan, Seomyeon skin clinic, about us" :
    "부산피부과, 피부과소개, 피부과전문의, 스타피부과, 서면피부과, 부산리프팅";

  // access 섹션 레이블 (언어별 분기)
  const accessLabels =
    lang === "ja" ? { address: "住所", subway: "地下鉄", bus: "バス", parking: "駐車場" } :
    lang === "zh" ? { address: "地址", subway: "地铁", bus: "公交", parking: "停车" } :
    lang === "en" ? { address: "Address", subway: "Subway", bus: "Bus", parking: "Parking" } :
    { address: "주소", subway: "지하철", bus: "버스", parking: "주차" };

  // visible string i18n (PR-39: localized live 정책 UI 일관성)
  const aboutUsLabel =
    lang === "ja" ? "クリニック紹介" :
    lang === "zh" ? "诊所介绍" :
    lang === "en" ? "About Us" :
    "피부과 소개";

  const medicalTeamAlt =
    lang === "ja" ? "医療チーム" :
    lang === "zh" ? "医疗团队" :
    lang === "en" ? "Medical Team" :
    "의료진";

  const sinceLabel =
    lang === "ja" ? "2006年創業" :
    lang === "zh" ? "创立于2006年" :
    lang === "en" ? "Est. 2006" :
    "Since 2006";

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
        hreflangs={buildHreflangs("/about", "/en/about", "/ja/about", "/zh/about")}
        pageType="treatment"
        jsonLd={[buildBreadcrumbJsonLd([
          { name: lang === "en" ? "Home" : lang === "ja" ? "ホーム" : lang === "zh" ? "首页" : "홈", url: BASE_URL + "/" },
          { name: lang === "en" ? "About" : lang === "ja" ? "クリニック紹介" : lang === "zh" ? "关于我们" : "병원 소개", url: pageUrl },
        ])]}
      />
      {/* 피부과 소개 섹션 - About Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* 좌측 콘텐츠 */}
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider mb-4" style={{color: 'var(--color-gold-primary)'}}>{aboutUsLabel}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{t.about.title}</h1>
              <p className="text-2xl font-bold mb-6" style={{color: 'var(--color-gold-primary)'}}>STAR DERMATOLOGY</p>

              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                {t.about.desc}
              </p>

              {/* 통계 정보 - i18n 중앙 데이터 참조 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {t.about.stats.slice(0, 3).map((stat, idx) => (
                  <div key={idx} className="rounded-lg p-6 text-center" style={{backgroundColor: 'var(--color-gold-pale)'}}>
                    <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-gold-primary)'}}>{stat.num}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* 특징 설명 - STAR 4개 박스 (i18n) */}
              <div className="space-y-4">
                {t.about.values.map((v, idx) => (
                  <div key={idx} className="border-l-4 pl-4" style={{borderColor: 'var(--color-gold-primary)'}}>
                    <h3 className="font-bold text-gray-900 mb-1">
                      <span style={{color: 'var(--color-gold-primary)'}}>{v.letter}</span>
                      {v.title.slice(1)}
                    </h3>
                    <p className="text-gray-600 text-sm">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측 이미지 영역 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-96 flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  id="about-section-image"
                  src="/manus-storage/medical_team_53232402.jpg"
                  alt={medicalTeamAlt}
                  className="w-full h-full object-cover"
                  height={384}
                />
              </div>
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm font-semibold">
                {sinceLabel}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 진료 시간 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.hours.title}</h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <tbody>
                  {t.hours.rows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : ''} style={idx % 2 === 1 ? {backgroundColor: 'var(--color-gold-pale)'} : {}}>
                      <td className="py-3 px-6 font-medium text-gray-700">{row.day}</td>
                      <td className="py-3 px-6 text-gray-600 text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {t.hours.note && (
              <p className="text-gray-500 text-sm mt-4 text-center">{t.hours.note}</p>
            )}
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t.access.title}</h2>
            <div className="space-y-4 rounded-xl p-6" style={{backgroundColor: 'var(--color-gold-pale)'}}>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>{accessLabels.address}</span>
                <span className="text-gray-700">{t.access.address}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>{accessLabels.subway}</span>
                <span className="text-gray-700">{t.access.subway}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>{accessLabels.bus}</span>
                <span className="text-gray-700">{t.access.bus}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>{accessLabels.parking}</span>
                <span className="text-gray-700">{t.access.parking}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
