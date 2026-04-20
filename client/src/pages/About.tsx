import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import { Award, Heart, Target } from 'lucide-react';

export default function About() {
  const { t } = useLang();

  return (
    <MainLayout>
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">{t.about.label}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.about.title}</h1>
          <p className="text-gray-600 mt-4 max-w-2xl">{t.about.desc}</p>
        </div>
      </section>

      {/* 통계 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.about.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-500">{stat.num}</div>
                <div className="text-gray-600 mt-2 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 병원 소개 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">STAR 피부과</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                스타피부과는 20년 이상의 풍부한 경험을 바탕으로 환자 중심의 진료를 제공하는 프리미엄 피부과 클리닉입니다.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                최신 의료 기술과 세계 최고 수준의 장비를 갖추고 있으며, 전문가 의료진이 개인의 피부 상태에 맞춘 맞춤형 치료를 제공합니다.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-amber-600">★</div>
                <p className="text-gray-700 mt-4 font-semibold">STAR 피부과</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 미션·비전·가치 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">미션</h3>
              </div>
              <p className="text-gray-600">환자의 피부 건강과 아름다움을 위해 최고의 의료 서비스를 제공합니다.</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Target size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">비전</h3>
              </div>
              <p className="text-gray-600">대한민국 최고의 피부과 전문 클리닉으로 성장하여 글로벌 의료 서비스를 선도합니다.</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Award size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">가치</h3>
              </div>
              <p className="text-gray-600">환자의 신뢰와 만족을 바탕으로 윤리적이고 책임감 있는 진료를 실천합니다.</p>
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
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
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
            <div className="space-y-4 bg-amber-50 rounded-xl p-6">
              <div className="flex gap-4 items-start">
                <span className="text-amber-600 font-bold w-16 flex-shrink-0">주소</span>
                <span className="text-gray-700">{t.access.address}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-amber-600 font-bold w-16 flex-shrink-0">지하철</span>
                <span className="text-gray-700">{t.access.subway}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-amber-600 font-bold w-16 flex-shrink-0">버스</span>
                <span className="text-gray-700">{t.access.bus}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-amber-600 font-bold w-16 flex-shrink-0">주차</span>
                <span className="text-gray-700">{t.access.parking}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
