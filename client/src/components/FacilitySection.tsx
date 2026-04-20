import { useLang } from "@/contexts/useLang";

const facilities = [
  { name: "관리실", desc: "최신 의료 장비가 갖춰진 시술실", icon: "🏥" },
  { name: "인포메이션", desc: "편안한 안내 데스크", icon: "💁" },
  { name: "안내데스크", desc: "친절한 상담 공간", icon: "🪑" },
  { name: "대기실", desc: "쾌적한 대기 환경", icon: "🛋️" },
  { name: "시술실", desc: "프리미엄 시술 공간", icon: "✨" },
  { name: "줄기세포 연구센터", desc: "2층 전용 연구 시설", icon: "🔬" },
];

export default function FacilitySection() {
  const { t } = useLang();

  return (
    <section id="facility" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="section-label mb-3">{t.facility.label}</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] gold-underline inline-block">
            {t.facility.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {facilities.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl bg-[var(--star-bg-section)] border border-gray-100 hover:border-[#c9a96e]/30 hover:shadow-md transition-all text-center card-hover"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-[#1a2744] mb-1">{f.name}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-[#0d1b2a] text-white text-center">
          <p className="text-[#c9a96e] text-sm font-semibold mb-2">📍 오시는 길</p>
          <p className="text-lg font-bold mb-1">부산광역시 부산진구 서면로 19</p>
          <p className="text-white/60 text-sm">아이온시티빌딩 4층 접수·진료 | 2층 줄기세포 연구센터</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-white/50">
            <span>🚇 지하철 1·2호선 서면역 7번 출구</span>
            <span>🚌 버스 정류장 인근</span>
          </div>
        </div>
      </div>
    </section>
  );
}
