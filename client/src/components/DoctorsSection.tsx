import { useState } from "react";
import { Award, GraduationCap, Stethoscope, ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/useLang";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";
const CDN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB";

const doctors = [
  {
    id: 0,
    name: "조시형 원장",
    nameEn: "Dr. JO SI-HYEONG",
    title: "피부과 전문의 · 의학박사",
    badge: "대표원장",
    image: `${CDN2}/01_5e3176cb.png`,
    mobileImage: `${CDN}/dr_jo_profile-mobile_ee5a7e09.webp`,
    intro: "2006년 부산 서면에서 첫 진료를 시작한 이래, 20년이 넘는 시간 동안 수많은 환자분들의 피부 고민을 마주해 왔습니다. 피부 치료는 단순히 장비를 사용하는 기술이 아니라, 환자의 피부 상태를 정확히 읽어내는 '안목'에서 시작됩니다. 무리한 시술보다는 가장 안전하고 자연스러운 결과를 지향합니다.",
    credentials: [
      { icon: GraduationCap, text: "부산대학교병원 피부과 수련" },
      { icon: GraduationCap, text: "인제대학교 피부과 교수 역임" },
      { icon: Award, text: "피부과 전문의 · 의학박사" },
      { icon: Award, text: "써마지 FLX 공식 자문의" },
      { icon: Award, text: "전) 부산경남울산 피부과의사회 회장" },
      { icon: Stethoscope, text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, text: "미국 피부과 학회(AAD) 정회원" },
    ],
    specialties: ["눈밑지방재배치", "울쎄라 프라임", "써마지 FLX", "흉터치료"],
    color: "#c9a96e",
  },
  {
    id: 1,
    name: "우혜진 원장",
    nameEn: "Dr. WOO HYE-JIN",
    title: "피부과 전문의",
    badge: "원장",
    image: `${CDN2}/0211_8cfcf452.png`,
    mobileImage: `${CDN}/sub_01_02_img2-mobile_ceacc144.webp`,
    intro: "가톨릭의대 피부과 수련과 고운세상 피부과에서의 폭넓은 임상 경험을 바탕으로, 한 분 한 분의 피부 고민에 공감하며 진료합니다. 단순히 증상만을 보는 것이 아니라 환자분의 피부 상태를 세심하게 체크하여 가장 조화롭고 효과적인 치료 솔루션을 제안해 드립니다.",
    credentials: [
      { icon: GraduationCap, text: "카톨릭의대 피부과 수련" },
      { icon: GraduationCap, text: "카톨릭의대 피부과 외래교수" },
      { icon: Award, text: "피부과 전문의" },
      { icon: Stethoscope, text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, text: "대한 미용 피부외과 학회 정회원" },
    ],
    specialties: ["여드름·색소 치료", "피부 레이저", "보톡스·필러", "피부 관리"],
    color: "#4a90d9",
  },
  {
    id: 2,
    name: "이기욱 원장",
    nameEn: "Dr. LEE GI-WOOK",
    title: "피부과 전문의",
    badge: "원장",
    image: `${CDN2}/03_46691618.png`,
    mobileImage: `${CDN}/sub_01_02_img5-mobile_2e57f5ca.webp`,
    intro: "풍부한 임상 경험을 바탕으로 다양한 피부 질환과 미용 시술을 전문적으로 다루고 있습니다. 특히 레이저 시술과 색소 치료 분야에서 탁월한 실력을 발휘하며, 환자 개개인의 피부 상태에 맞는 맞춤형 치료를 제공합니다.",
    credentials: [
      { icon: GraduationCap, text: "부산대학교 의과대학 졸업" },
      { icon: Award, text: "피부과 전문의" },
      { icon: Stethoscope, text: "대한 피부과 학회 정회원" },
      { icon: Stethoscope, text: "대한 레이저 학회 정회원" },
    ],
    specialties: ["레이저 시술", "색소·문신 제거", "눈밑지방재배치", "피부 질환"],
    color: "#5ba87a",
  },
];

export default function DoctorsSection() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const dr = doctors[active];

  return (
    <section id="doctors" className="py-20 bg-[#f8f6f2]">
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest text-[#c9a96e] uppercase bg-[#c9a96e]/10 rounded-full mb-3">
            Medical Team
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744]">{t.doctors?.title || "피부과전문의"}</h2>
          <p className="text-gray-500 mt-2">스타피부과의 전문 의료진을 소개합니다</p>
        </div>

        {/* 의사 탭 선택 */}
        <div className="flex justify-center gap-3 mb-10">
          {doctors.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                active === i
                  ? "bg-[#1a2744] text-white shadow-lg"
                  : "bg-white text-[#1a2744] border border-[#1a2744]/20 hover:border-[#1a2744]/50"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* 의사 상세 카드 */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2">
            {/* 이미지 */}
            <div className="relative bg-[#0d1b2a] min-h-[360px] md:min-h-[480px] overflow-hidden">
              <img
                src={dr.image}
                alt={dr.name}
                className="w-full h-full object-cover object-top"
                style={{ minHeight: "360px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span
                  className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white mb-2"
                  style={{ backgroundColor: dr.color }}
                >
                  {dr.badge}
                </span>
                <h3 className="text-2xl font-black text-white">{dr.name}</h3>
                <p className="text-white/70 text-sm">{dr.nameEn}</p>
              </div>
            </div>

            {/* 정보 */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <p className="text-[#c9a96e] font-bold text-sm mb-1">{dr.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{dr.intro}</p>

                {/* 자격/경력 */}
                <div className="space-y-2 mb-6">
                  {dr.credentials.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <c.icon size={14} className="text-[#c9a96e] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{c.text}</span>
                    </div>
                  ))}
                </div>

                {/* 전문 분야 */}
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">전문 분야</p>
                  <div className="flex flex-wrap gap-2">
                    {dr.specialties.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-[#f0f4ff] text-[#1a2744]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 다음 의사 버튼 */}
              <button
                onClick={() => setActive((active + 1) % doctors.length)}
                className="mt-6 flex items-center gap-1 text-xs text-gray-400 hover:text-[#c9a96e] transition-colors self-end"
              >
                다음 의료진 <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
