import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/contexts/useLang";
import { useLocation } from "wouter";

const categories = [
  {
    id: "best",
    label: "Best 시술",
    items: [
      { name: "울써마지 리프팅", slug: "ulthermage", desc: "울쎄라피+써마지 복합 리프팅의 끝판왕" },
      { name: "울쎄라피 프라임", slug: "ultherapy-prime", desc: "차세대 초음파 리프팅 시술" },
      { name: "써마지 FLX", slug: "thermage-flx", desc: "4세대 고주파 리프팅의 정점" },
      { name: "프로파운드 RF", slug: "profound-rf", desc: "마이크로니들 RF 리프팅" },
      { name: "줄기세포 치료", slug: "stem-cell", desc: "자가세포 피부 재생 치료" },
    ],
  },
  {
    id: "lifting",
    label: "리프팅·탄력",
    items: [
      { name: "울쎄라피 프라임", slug: "ultherapy-prime", desc: "초음파 리프팅" },
      { name: "써마지 FLX", slug: "thermage-flx", desc: "고주파 리프팅" },
      { name: "세르프 리프팅", slug: "cerf", desc: "RF 리프팅" },
      { name: "프로파운드 RF", slug: "profound-rf", desc: "마이크로니들 RF" },
      { name: "실 리프팅", slug: "thread-lift", desc: "실 리프팅" },
    ],
  },
  {
    id: "eyebag",
    label: "눈밑지방",
    items: [
      { name: "눈밑지방재배치", slug: "eyebag-repositioning", desc: "레이저 눈밑 시술" },
      { name: "런치타임 눈밑레이저", slug: "lunchtime-eye", desc: "당일 복귀 가능" },
    ],
  },
  {
    id: "pigment",
    label: "색소·문신",
    items: [
      { name: "엔라이튼 III", slug: "enlighten3", desc: "피코초 레이저" },
      { name: "큐어맥스", slug: "curemax", desc: "흑자·기미·잡티 제거" },
      { name: "기미 치료 프로그램", slug: "melasma", desc: "복합 레이저 기미 치료" },
    ],
  },
  {
    id: "scar",
    label: "흉터·모공",
    items: [
      { name: "흉터 치료 프로그램", slug: "scar-treatment", desc: "울트라펄스+DRT 복합" },
      { name: "프락셀", slug: "fraxel", desc: "모공·흉터 레이저" },
    ],
  },
  {
    id: "acne",
    label: "여드름",
    items: [
      { name: "여드름 치료", slug: "acne", desc: "피부과 전문의 여드름 치료" },
      { name: "여드름 흉터", slug: "acne-scar", desc: "흉터 개선 프로그램" },
    ],
  },
  {
    id: "rosacea",
    label: "홍조·혈관",
    items: [
      { name: "홍조 치료 프로그램", slug: "rosacea", desc: "Excel V+ · ADVATX 듀얼" },
      { name: "Excel V+", slug: "excel-v", desc: "혈관 선택성 레이저" },
    ],
  },
  {
    id: "volume",
    label: "볼륨·부스터",
    items: [
      { name: "스컬트라", slug: "sculptra", desc: "FDA 승인 볼륨 필러" },
      { name: "리쥬란", slug: "rejuran", desc: "피부 재생 부스터" },
    ],
  },
];

export default function TreatmentsSection() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState("best");
  const [, navigate] = useLocation();

  const current = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <section id="treatments" className="py-20 bg-white">
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">{t.treatments.label}</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] gold-underline inline-block">
            {t.treatments.title}
          </h2>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#1a2744] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 시술 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {current.items.map((item) => (
            <button
              key={item.slug}
              onClick={() => navigate(`/treatment/${item.slug}`)}
              className="group text-left p-5 bg-[var(--star-bg-section)] rounded-xl border border-gray-100 hover:border-[#c9a96e]/40 hover:shadow-md transition-all card-hover"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#1a2744] group-hover:text-[#c9a96e] transition-colors mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-300 group-hover:text-[#c9a96e] transition-colors flex-shrink-0 mt-0.5"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
