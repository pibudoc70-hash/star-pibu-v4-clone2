import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import SeoHead, { COMMON_HREFLANGS } from '@/components/SeoHead';

const EQUIPMENT_LIST = [
  { name: '울쎄라(Ultherapy)', desc: '초음파 에너지를 이용한 비침습적 리프팅 시술. FDA 승인 유일 비수술 리프팅.', category: '리프팅·탄력' },
  { name: '써마지FLX', desc: '고주파 에너지로 피부 깊은 층을 자극하여 콜라겐 재생 및 탄력 개선.', category: '리프팅·탄력' },
  { name: '프로파운드', desc: '고주파+마이크로니들 복합 시술로 탄력 및 주름 개선에 탁월한 효과.', category: '리프팅·탄력' },
  { name: '엔라이튼(Enlighten)', desc: '피코초 레이저로 색소·문신 제거 및 피부 톤 개선에 효과적.', category: '색소·문신' },
  { name: '엑셀V+', desc: '혈관 및 색소 병변 치료에 특화된 레이저 장비.', category: '혈관·색소' },
  { name: '리쥬란(REJURAN)', desc: '연어 DNA 성분으로 피부 재생 및 탄력 강화.', category: '피부재생' },
  { name: '세르프(CERF)', desc: '고강도 집속 초음파로 눈가 및 이마 리프팅에 특화.', category: '리프팅·탄력' },
  { name: '눈밑지방재배치', desc: '눈밑 지방을 재배치하여 자연스러운 동안 효과.', category: '눈밑지방' },
];

export default function Equipment() {
  const { t, lang } = useLang();

  return (
    <MainLayout>
      <SeoHead
        title="부산 서면 스타피부과 | 시술·장비 안내 - 울쎄라, 써마지, 리주란, 눈밑지방 전문"
        description="부산 서면 스타피부과의 시술 및 장비 안내입니다. 울쎄라피, 써마지 FLX, 눈밑지방재배치, 리쥬란힐러, 피코레이저 등 50종 이상의 프리미엄 레이저 시술을 보유하고 있습니다."
        keywords="부산피부과, 울쎄라, 써마지, 리주란, 눈밑지방재배치, 피코레이저, 레이저시술, 시술안내"
        canonical="https://star-pibu.com/equipment"
        hreflangs={COMMON_HREFLANGS}
        pageType="treatment"
      />
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.nav.equipment}</h1>
          <p className="text-gray-600 mt-4">세계 최고 수준의 프리미엄 장비로 최상의 결과를 제공합니다.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EQUIPMENT_LIST.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <span className="text-5xl">⚕️</span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-full">{item.category}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">전문가 상담을 받으세요</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://pf.kakao.com/_xnxmKxj" target="_blank" rel="noopener noreferrer"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-3 rounded-lg font-semibold transition-colors">
              카카오톡 상담
            </a>
            <a href={lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300"}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              {t.footer.tel}
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
