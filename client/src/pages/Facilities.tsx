import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';

const FACILITY_HIGHLIGHTS = [
  { icon: '🏥', title: '프리미엄 진료실', desc: '최신 인테리어와 편안한 분위기의 1:1 프라이빗 진료실' },
  { icon: '🔬', title: '첨단 시술실', desc: '세계 최고 수준의 의료 장비가 완비된 전문 시술 공간' },
  { icon: '💆', title: '편안한 회복실', desc: '시술 후 안정적인 회복을 위한 전용 휴식 공간' },
  { icon: '🛡️', title: '철저한 위생 관리', desc: '매 시술마다 엄격한 위생 기준을 준수하는 멸균 환경' },
  { icon: '👥', title: '전문 상담 공간', desc: '편안하고 프라이빗한 1:1 상담 전용 공간' },
  { icon: '🔬', title: '줄기세포 연구센터', desc: '자가 줄기세포 치료 연구 및 시술 전문 공간' },
];

export default function Facilities() {
  const { t } = useLang();

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-2">{t.facility.sectionTitle}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.nav.facility}</h1>
          <p className="text-gray-600 mt-4">{t.facility.sectionSubtitle}</p>
        </div>
      </section>

      {/* 시설 하이라이트 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACILITY_HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 갤러리 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">시설 갤러리</h2>
          <p className="text-gray-500 text-center mb-10">{t.facility.zoomHint}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.facility.images.map((img, idx) => (
              <div key={idx} className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center p-4">
                <span className="text-3xl mb-2">🏥</span>
                <p className="text-sm font-semibold text-gray-700 text-center">{img.label}</p>
                <p className="text-xs text-gray-500 text-center mt-1">{img.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">직접 방문하여 확인하세요</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://pf.kakao.com/_xnxmKxj" target="_blank" rel="noopener noreferrer"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-3 rounded-lg font-semibold transition-colors">
              카카오톡 상담
            </a>
            <a href="/directions"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              오시는 길
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
