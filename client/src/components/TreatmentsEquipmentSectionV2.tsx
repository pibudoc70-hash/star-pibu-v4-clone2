/**
 * TreatmentsEquipmentSectionV2 - 시술·장비소개2 (DB 연동)
 * 관리자가 등록한 시술만 표시하는 컴포넌트
 */
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";

interface Treatment {
  id: number;
  categoryId: string;
  name: string;
  nameEn: string;
  desc: string;
  time: string;
  recovery: string;
  badge?: string | null;
  badgeColor?: string | null;
  image?: string | null;
  detail?: string | null;
  caution?: string | null;
  youtubeUrl?: string | null;
  best?: string | null;
  isActive?: string | null;
  images?: string | null;
  imgBg?: string | null;
  cardBannerImage?: string | null;
  sessions?: string | null;
  effect?: string | null;
  related?: string | null;
  steps?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const CATEGORIES = [
  { id: "best", label: "Best 시술", icon: Star },
  { id: "lifting", label: "리프팅·탄력" },
  { id: "eye", label: "눈밑지방" },
  { id: "vitiligo", label: "백반증" },
  { id: "pigment", label: "색소·문신" },
  { id: "scar", label: "흉터·모공" },
  { id: "acne", label: "여드름" },
  { id: "rosacea", label: "홍조·혈관" },
  { id: "fungus", label: "손·발톱무좀" },
  { id: "psoriasis", label: "건선·아토피" },
  { id: "volume", label: "볼륨·부스터" },
  { id: "botox", label: "보톡스·필러" },
];

export default function TreatmentsEquipmentSectionV2() {
  const [activeId, setActiveId] = useState("best");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useSectionReveal();

  // DB에서 모든 시술 조회
  const { data: treatments = [], isLoading } = trpc.treatments.all.useQuery();

  // 카테고리별 필터링
  const filteredTreatments = treatments.filter(
    (t: Treatment) => t.categoryId === activeId && t.isActive !== "0"
  );

  const handleTabChange = (id: string) => {
    setActiveId(id);
  };

  const handleTreatmentClick = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsModalOpen(true);
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabContainerRef.current) {
      const scrollAmount = 200;
      tabContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">시술 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (treatments.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">등록된 시술이 없습니다.</p>
        <p className="text-sm text-gray-400 mt-2">관리자에서 시술을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white reveal">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            시술·장비소개 2
          </h2>
          <p className="text-gray-600 text-lg">
            관리자에서 등록한 시술 및 장비를 소개합니다
          </p>
        </div>

        {/* 카테고리 탭 */}
        <div className="mb-8 flex items-center gap-2">
          <button
            onClick={() => scrollTabs("left")}
            className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={tabContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeId === cat.id;
              const count = treatments.filter(
                (t: Treatment) => t.categoryId === cat.id && t.isActive !== "0"
              ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleTabChange(cat.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollTabs("right")}
            className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 시술 카드 그리드 */}
        {filteredTreatments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreatments.map((treatment: Treatment) => (
              <div
                key={treatment.id}
                onClick={() => handleTreatmentClick(treatment)}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer reveal-card"
              >
                {/* 이미지 */}
                {treatment.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={treatment.image}
                      alt={treatment.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* 콘텐츠 */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {treatment.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{treatment.desc}</p>

                  {/* 배지 */}
                  {treatment.badge && (
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-3"
                      style={{ backgroundColor: treatment.badgeColor || "#4A6FA5" }}
                    >
                      {treatment.badge}
                    </div>
                  )}

                  {/* 정보 */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>⏱ {treatment.time}</div>
                    <div>🩹 {treatment.recovery}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              선택한 카테고리에 등록된 시술이 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* 상세 정보 모달 */}
      {isModalOpen && selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{selectedTreatment.name}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="p-6 space-y-6">
              {/* 이미지 */}
              {selectedTreatment.image && (
                <img
                  src={selectedTreatment.image}
                  alt={selectedTreatment.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">시술 시간</p>
                  <p className="font-semibold text-gray-900">{selectedTreatment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">회복 기간</p>
                  <p className="font-semibold text-gray-900">
                    {selectedTreatment.recovery}
                  </p>
                </div>
              </div>

              {/* 설명 */}
              <div>
                <p className="text-sm text-gray-500 mb-2">설명</p>
                <p className="text-gray-700">{selectedTreatment.desc}</p>
              </div>

              {/* 상세 정보 */}
              {selectedTreatment.detail && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">상세 정보</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedTreatment.detail}
                  </p>
                </div>
              )}

              {/* 주의사항 */}
              {selectedTreatment.caution && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">주의사항</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedTreatment.caution}
                  </p>
                </div>
              )}

              {/* YouTube 영상 */}
              {selectedTreatment.youtubeUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">관련 영상</p>
                  <iframe
                    width="100%"
                    height="315"
                    src={selectedTreatment.youtubeUrl}
                    title={selectedTreatment.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              )}

              {/* 닫기 버튼 */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
