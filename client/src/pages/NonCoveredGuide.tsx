import MainLayout from "@/components/MainLayout";

const items = [
  { category: "리프팅·탄력", items: [
    { name: "울쎄라피 프라임 (전안면)", price: "상담 후 결정" },
    { name: "써마지 FLX (전안면)", price: "상담 후 결정" },
    { name: "프로파운드 RF 리프팅", price: "상담 후 결정" },
    { name: "세르프 리프팅", price: "상담 후 결정" },
  ]},
  { category: "눈밑지방", items: [
    { name: "눈밑지방재배치 (레이저)", price: "상담 후 결정" },
    { name: "런치타임 눈밑레이저", price: "상담 후 결정" },
  ]},
  { category: "색소·문신", items: [
    { name: "엔라이튼 III (피코초 레이저)", price: "상담 후 결정" },
    { name: "기미 치료 프로그램", price: "상담 후 결정" },
  ]},
  { category: "홍조·혈관", items: [
    { name: "Excel V+ 레이저", price: "상담 후 결정" },
    { name: "ADVATX 레이저", price: "상담 후 결정" },
  ]},
  { category: "볼륨·부스터", items: [
    { name: "스컬트라 (FDA 승인 필러)", price: "상담 후 결정" },
    { name: "리쥬란 (피부 재생 부스터)", price: "상담 후 결정" },
  ]},
];

export default function NonCoveredGuide() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container max-w-3xl">
          <div className="mb-10">
            <p className="section-label mb-2">NON-COVERED SERVICES</p>
            <h1 className="text-3xl font-black text-[#1a2744]">비급여 진료 안내</h1>
          </div>

          <div className="bg-[#0d1b2a] rounded-2xl p-5 mb-6 text-sm text-white/70">
            <p className="text-[#c9a96e] font-bold mb-1">안내사항</p>
            <p>아래 비급여 진료 항목의 가격은 개인별 피부 상태 및 시술 범위에 따라 달라질 수 있습니다. 정확한 비용은 피부과 전문의 상담 후 안내해 드립니다.</p>
          </div>

          <div className="space-y-4">
            {items.map((group) => (
              <div key={group.category} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-3 bg-[#1a2744]">
                  <h2 className="text-sm font-bold text-[#c9a96e]">{group.category}</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-2.5 text-gray-400 font-medium">시술명</th>
                      <th className="text-right px-6 py-2.5 text-gray-400 font-medium">가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="px-6 py-3 text-gray-700">{item.name}</td>
                        <td className="px-6 py-3 text-right text-[#c9a96e] font-semibold">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-gray-400 text-center">
            * 본 안내는 의료법 시행규칙 제42조의2에 따른 비급여 진료비 공개 의무를 이행하기 위한 것입니다.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
