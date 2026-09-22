/**
 * [LIVE ROUTED PAGE]
 *
 * STATUS: active. App.tsx registers `/directions` and the four locale-prefixed
 * directions routes. The shared location and contact section is supplied by the
 * common footer; this page retains its dedicated transport guidance above it.
 *
 * This page owns the active SeoHead canonical/hreflang output and external
 * directions links for its route.
 */
import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import SeoHead, { buildHreflangs } from '@/components/SeoHead';

export default function Directions() {
  const { t, lang } = useLang();

  return (
    <MainLayout>
      <SeoHead
        title={`${t.directions.title} | STAR DERMATOLOGY`}
        description={t.directions.subtitle}
        canonical={`https://star-pibu.com${lang === 'ko' ? '' : `/${lang.toLowerCase()}`}/directions`}
        hreflangs={buildHreflangs("/directions")}
        pageType="treatment"
      />
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12 md:pt-32 md:pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.directions.title}</h1>
          <p className="text-gray-600 mt-4">{t.directions.subtitle}</p>
        </div>
      </section>

      {/* 주차 및 대중교통 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">{t.directions.transportationTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚗 {t.directions.carTitle}</h3>
              <p className="text-gray-600 mb-4">
                {t.directions.carDescription}
              </p>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• {t.directions.parkingFee}</li>
                <li>• {t.directions.parkingLocation}</li>
                <li>• {t.directions.accessibleParking}</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚌 {t.directions.transitTitle}</h3>
              <p className="text-gray-600 mb-4">
                {t.directions.transitDescription}
              </p>
              <ul className="text-gray-600 text-sm space-y-2">
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
