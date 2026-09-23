/**
 * [LIVE ROUTED PAGE]
 *
 * STATUS: active. App.tsx registers `/directions` and the four locale-prefixed
 * directions routes. This route places the shared location and contact section
 * in its main content, then excludes the duplicate common-footer instance.
 *
 * This page owns the active SeoHead canonical/hreflang output and external
 * directions links for its route.
 */
import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import ContactSection from '@/components/ContactSection';
import SeoHead, { buildHreflangs } from '@/components/SeoHead';

export default function Directions() {
  const { t, lang } = useLang();

  return (
    <MainLayout showContactSection={false}>
      <SeoHead
        title={`${t.directions.title} | STAR DERMATOLOGY`}
        description={t.directions.subtitle}
        canonical={`https://star-pibu.com${lang === 'ko' ? '' : `/${lang.toLowerCase()}`}/directions`}
        hreflangs={buildHreflangs("/directions")}
        pageType="treatment"
      />
      <section className="dr-page-header pt-28 pb-12 sm:pt-32 sm:pb-16 text-center" aria-labelledby="directions-page-title">
        <div className="container">
          <p className="dr-page-header-eyebrow font-montserrat text-xs tracking-[0.3em] uppercase mb-3">
            STAR DERMATOLOGY
          </p>
          <h1 id="directions-page-title" className="dr-page-header-title text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            {t.directions.title}
          </h1>
          <p className="dr-page-header-tagline text-sm sm:text-base">{t.directions.subtitle}</p>
        </div>
      </section>

      <ContactSection showHeader={false} />

      {/* 주차 및 대중교통 */}
      <section className="directions-transport-section py-16 md:py-24 bg-[var(--brand-bg-alt)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[var(--brand-text)] mb-12 text-center">{t.directions.transportationTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--brand-bg-card)] rounded-[var(--card-radius)] border border-[color:var(--color-gold-light)] p-6 shadow-[0_8px_20px_rgba(57,39,20,0.06)]">
              <h3 className="text-xl font-bold text-[var(--brand-text)] mb-4">🚗 {t.directions.carTitle}</h3>
              <p className="text-[var(--brand-text-mid)] mb-4">
                {t.directions.carDescription}
              </p>
              <ul className="text-[var(--brand-text-mid)] text-sm space-y-2">
                <li>• {t.directions.parkingFee}</li>
                <li>• {t.directions.parkingLocation}</li>
                <li>• {t.directions.accessibleParking}</li>
              </ul>
            </div>

            <div className="bg-[var(--brand-bg-card)] rounded-[var(--card-radius)] border border-[color:var(--color-gold-light)] p-6 shadow-[0_8px_20px_rgba(57,39,20,0.06)]">
              <h3 className="text-xl font-bold text-[var(--brand-text)] mb-4">🚌 {t.directions.transitTitle}</h3>
              <p className="text-[var(--brand-text-mid)] mb-4">
                {t.directions.transitDescription}
              </p>
              <ul className="text-[var(--brand-text-mid)] text-sm space-y-2">
                <li>• {t.directions.subwayInfo}</li>
                <li>• {t.directions.busInfo}</li>
                <li>• {t.directions.taxiInfo}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
