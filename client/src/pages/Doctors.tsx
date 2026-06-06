/**
 * [DORMANT PAGE - NOT ROUTED]
 *
 * STATUS: dormant/orphan — not registered in App.tsx.
 * Content is currently surfaced via DoctorsSection component on the home page.
 *
 * CLASSIFICATION: dormant (future activation candidate)
 *   The /doctors standalone page was replaced by the DoctorsSection
 *   embedded in the home landing flow. This file is kept as a candidate
 *   for a dedicated doctors sub-page if the IA is expanded later.
 *
 * TO ACTIVATE:
 *   Add <Route path="/doctors" component={Doctors} /> to App.tsx
 *   and add a nav link in Header.tsx.
 *
 * DO NOT:
 *   - Treat the SeoHead canonical below as an active SEO signal
 *     (canonical is preserved for reference only; page is not live)
 */
import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import SeoHead, { COMMON_HREFLANGS } from '@/components/SeoHead';
import OptimizedImage from '@/components/OptimizedImage';

const DOCTOR_IMAGES = [
  'https://d2fqpnqbhf3bxe.cloudfront.net/star-pibu/doctors/cho-si-hyung.jpg',
  'https://d2fqpnqbhf3bxe.cloudfront.net/star-pibu/doctors/woo-hye-jin.jpg',
  'https://d2fqpnqbhf3bxe.cloudfront.net/star-pibu/doctors/lee-gi-wook.jpg',
];

export default function Doctors() {
  const { t, lang } = useLang();
  const doctors = t.doctors.list;

  return (
    <MainLayout>
      {/* NOTE: canonical below is inactive — this page is not routed in App.tsx */}
      <SeoHead
        title="의료진 소개 | 부산 서면 스타피부과"
        description="부산 서면 스타피부과 의료진. 피부과 전문의 조시형 원장 외 전문 의료진이 직접 진료합니다. 20년 이상의 감방 시술 경험."
        keywords="스타피부과 의료진, 조시형 원장, 부산피부과 전문의, 서면피부과 의사, 피부과전문의"
        canonical="https://www.star-pibu.com/doctors"
        ogLocale="ko_KR"
        hreflangs={COMMON_HREFLANGS}
              includeMedicalSchema={true}

      />
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.doctors.title}</h1>
          <p className="text-gray-600 mt-4">{t.doctors.label}</p>
        </div>
      </section>

      {/* 의료진 목록 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.map((doctor, idx) => (
              <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                {/* 프로필 이미지 */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-72 flex items-center justify-center overflow-hidden">
                  {DOCTOR_IMAGES[idx] ? (
                    <OptimizedImage
                      src={DOCTOR_IMAGES[idx]}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      height={288}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-6xl">👨‍⚕️</div>
                  )}
                </div>

                {/* 정보 */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-amber-600 font-semibold mt-2">{doctor.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{doctor.specialty}</p>

                  {doctor.careers && doctor.careers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <ul className="space-y-1">
                        {doctor.careers.map((career, cidx) => (
                          <li key={cidx} className="text-gray-600 text-sm flex items-start gap-2">
                            <span className="text-amber-500 mt-1 flex-shrink-0">·</span>
                            <span>{career}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 예약 CTA */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">전문가 상담을 받으세요</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            의료진과 상담을 통해 당신에게 맞는 최적의 시술을 추천받으세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://pf.kakao.com/_xnxmKxj"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              카카오톡 상담
            </a>
            <a
              href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {t.footer.tel}
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
