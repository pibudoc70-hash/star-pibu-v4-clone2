/**
 * [DORMANT PAGE - NOT ROUTED]
 *
 * STATUS: dormant/orphan — not registered in App.tsx.
 * Location info is currently surfaced via ContactSection on the home page.
 *
 * CLASSIFICATION: dormant (future activation candidate)
 *   The /directions standalone page was replaced by the ContactSection
 *   embedded in the home landing flow (with Google Maps integration).
 *   This file is kept as a candidate for a dedicated directions/access page.
 *
 * TO ACTIVATE:
 *   Add <Route path="/directions" component={Directions} /> to App.tsx
 *   and add a nav link in Header.tsx.
 *
 * DO NOT:
 *   - Treat the SeoHead canonical below as an active SEO signal
 *     (canonical is preserved for reference only; page is not live)
 */
import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import SeoHead, { buildHreflangs } from '@/components/SeoHead';
import { buttonVariants } from '@/components/ui/button';
import { MapPin, Phone, Clock, Copy, Check } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { Lang } from '@/lib/i18n.types';
import { MapView } from '@/components/Map';
import { trackMapFallback } from '@/lib/mapFallbackAnalytics';

const HOSPITAL = {
  phone: '051-818-2300',
  kakaoMapUrl: 'https://map.kakao.com/link/search/스타피부과',
  naverMapUrl: 'https://map.naver.com/v5/search/스타피부과',
};

export default function Directions() {
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
	const mapLanguage: Record<Lang, string> = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN', 'zh-TW': 'zh-TW' };
	const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=35.1572312%2C129.0581932&travelmode=driving&hl=${mapLanguage[lang]}`;
	const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3261.9755226137463!2d129.0581932!3d35.157231200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDA5JzI2LjAiTiAxMjnCsDAzJzI5LjUiRQ!5e0!3m2!1suk!2sua!4v1786971719314!5m2!1suk!2sua&hl=${mapLanguage[lang]}`;
	const mapFallbackUrl = lang === 'ko' ? HOSPITAL.kakaoMapUrl : googleMapsDirectionsUrl;
  const mapFallbackLabel = lang === 'ko' ? t.directions.kakaoMap : t.directions.googleMaps;
  const handleMapFallback = useCallback(() => {
    trackMapFallback({ locale: lang, surface: 'directions' });
  }, [lang]);

  const handleCopyAddress = () => {
    // [P2] Promise await + .catch() 추가 — 복사 성공 후에만 setCopied(true) 호출
    navigator.clipboard.writeText(t.access.address)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // 클립보드 접근 불가 시 조용히 무시
      });
  };

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

      {/* 지도 및 정보 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 지도 */}
              <div className="md:col-span-2">
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px', minHeight: '400px' }}>
                  <MapView
                    initialCenter={{ lat: 35.1572312, lng: 129.0581932 }}
                    initialZoom={17}
                    className="h-full w-full"
                    style={{ height: '100%' }}
	                    onFallback={handleMapFallback}
	                    errorFallback={(
	                      <div className="h-full w-full" style={{ height: '100%' }}>
	                        <iframe
	                          title={t.directions.mapTitle}
	                          src={googleMapsEmbedUrl}
	                          className="block h-full w-full border-0"
	                          style={{ height: '100%' }}
	                          referrerPolicy="strict-origin-when-cross-origin"
	                        />
	                      </div>
	                    )}
                  />
                </div>
              </div>

              {/* 정보 */}
              <div className="space-y-6">
                {/* 주소 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">{t.directions.addressLabel}</h3>
                      <p className="text-gray-600 text-sm mt-2">{t.access.address}</p>
                    </div>
                  </div>
                  <button type="button"
                    onClick={handleCopyAddress}
                    className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1 mt-3"
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> {t.directions.copiedAddress}
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> {t.directions.copyAddress}
                      </>
                    )}
                  </button>
                </div>

                {/* 전화 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">{t.directions.phoneLabel}</h3>
                      <a
                        href={`tel:${HOSPITAL.phone}`}
                        className="text-amber-600 hover:text-amber-700 font-semibold text-sm mt-2 block"
                      >
                        {HOSPITAL.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 진료 시간 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">{t.directions.hoursLabel}</h3>
                      {t.hours.rows.map((row, i) => (
                        <p key={i} className="text-gray-600 text-sm mt-1">{row.day}: {row.time}</p>
                      ))}
                      <p className="text-red-500 text-xs mt-2">{t.hours.note}</p>
                    </div>
                  </div>
                </div>

                {/* 길찾기 버튼 */}
                <div className="space-y-3">
                  {lang === 'ko' ? (
                    <>
                      <a
                        href={HOSPITAL.kakaoMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ className: "w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300" })}
                      >
                        {t.directions.kakaoMap}
                      </a>
                      <a
                        href={HOSPITAL.naverMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ className: "w-full bg-green-600 hover:bg-green-700 text-white mt-2" })}
                      >
                        {t.directions.naverMap}
                      </a>
                    </>
                  ) : (
                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ className: "w-full bg-[#4285F4] text-white hover:bg-[#3367D6]" })}
                    >
                      {t.directions.googleMaps}
                    </a>
                  )}
                </div>
              </div>
          </div>
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
