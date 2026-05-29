import MainLayout from '@/components/MainLayout';
import { useLang } from '@/contexts/LangContext';
import OptimizedImage from '@/components/OptimizedImage';

export default function About() {
  const { t } = useLang();
  return (
    <MainLayout>
      {/* 피부과 소개 섹션 - About Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* 좌측 콘텐츠 */}
            <div>
              <p className="font-semibold text-sm uppercase tracking-wider mb-4" style={{color: 'var(--color-gold-primary)'}}>About Us</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">빛나는 피부의 시작</h1>
              <p className="text-2xl font-bold mb-6" style={{color: 'var(--color-gold-primary)'}}>STAR DERMATOLOGY</p>
              
              <p className="text-gray-600 mb-8 leading-relaxed text-base">
                2006년 부산 서면에서 문을 연 스타피부과는 지난 20여 년간 오직 고객의 피부만을 고민해 왔습니다. 세계적인 프리미엄 레이저 장비와 검증된 치료 프로토콜을 통해 의료 서비스의 질을 높였으며, 교수출신 피부과전문의의 20년 이상 풍부한 임상 경험의 노하우를 바탕으로 최상의 결과를 약속드립니다.
              </p>

              {/* 통계 정보 - 3개 박스 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-lg p-6 text-center" style={{backgroundColor: 'var(--color-gold-pale)'}}>
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-gold-primary)'}}>20년+</div>
                  <div className="text-gray-600 text-sm">피부과전문의 경력</div>
                </div>
                <div className="rounded-lg p-6 text-center" style={{backgroundColor: 'var(--color-gold-pale)'}}>
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-gold-primary)'}}>4,000례+</div>
                  <div className="text-gray-600 text-sm">눈밑지방재배치술</div>
                </div>
                <div className="rounded-lg p-6 text-center" style={{backgroundColor: 'var(--color-gold-pale)'}}>
                  <div className="text-3xl font-bold mb-2" style={{color: 'var(--color-gold-primary)'}}>50종+</div>
                  <div className="text-gray-600 text-sm">프리미엄 레이저</div>
                </div>
              </div>

              {/* 특징 설명 - 4개 박스 */}
              <div className="space-y-4">
                <div className="border-l-4 pl-4" style={{borderColor: 'var(--color-gold-primary)'}}>
                  <h3 className="font-bold text-gray-900 mb-1"><span style={{color: 'var(--color-gold-primary)'}}>S</span>pecial Guest</h3>
                  <p className="text-gray-600 text-sm">모든 환자분은 우리에게 가장 특별한 분입니다. 개개인의 고민에 귀 기울이는 1:1 맞춤 진료를 실천합니다.</p>
                </div>
                <div className="border-l-4 pl-4" style={{borderColor: 'var(--color-gold-primary)'}}>
                  <h3 className="font-bold text-gray-900 mb-1"><span style={{color: 'var(--color-gold-primary)'}}>T</span>op Quality</h3>
                  <p className="text-gray-600 text-sm">다양한 프리미엄 레이저와 앞선 의료 기술로 언제나 수준 높은 치료 결과를 선사합니다.</p>
                </div>
                <div className="border-l-4 pl-4" style={{borderColor: 'var(--color-gold-primary)'}}>
                  <h3 className="font-bold text-gray-900 mb-1"><span style={{color: 'var(--color-gold-primary)'}}>A</span>ttractive Atmosphere</h3>
                  <p className="text-gray-600 text-sm">예약제를 통해 대기 시간을 줄이고, 오직 치료에만 집중할 수 있는 편안한 환경을 제공합니다.</p>
                </div>
                <div className="border-l-4 pl-4" style={{borderColor: 'var(--color-gold-primary)'}}>
                  <h3 className="font-bold text-gray-900 mb-1"><span style={{color: 'var(--color-gold-primary)'}}>R</span>esponsibility</h3>
                  <p className="text-gray-600 text-sm">치료 설명과 경과 관찰에 책임감을 갖고, 결과에 만족하실 때까지 함께합니다.</p>
                </div>
              </div>
            </div>

            {/* 우측 이미지 영역 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-96 flex items-center justify-center overflow-hidden">
                <OptimizedImage
                  id="about-section-image"
                  src="/manus-storage/medical_team_53232402.jpg"
                  alt="의료진"
                  className="w-full h-full object-cover"
                  height={384}
                />
              </div>
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-sm font-semibold">
                Since 2006
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
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>주소</span>
                <span className="text-gray-700">{t.access.address}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>지하철</span>
                <span className="text-gray-700">{t.access.subway}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>버스</span>
                <span className="text-gray-700">{t.access.bus}</span>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-bold w-16 flex-shrink-0" style={{color: 'var(--color-gold-primary)'}}>주차</span>
                <span className="text-gray-700">{t.access.parking}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
