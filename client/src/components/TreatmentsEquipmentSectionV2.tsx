import { useState, useRef, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// 카테고리 정의
// ─────────────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  labelEn: string;
  desc: string;
}

const CATEGORIES: Category[] = [
  { id: "best", label: "Best", labelEn: "BEST", desc: "스타피부과의 대표 프로그램" },
  { id: "lifting", label: "리프팅", labelEn: "LIFTING", desc: "얼굴 리프팅 시술" },
  { id: "wrinkle", label: "주름개선", labelEn: "WRINKLE", desc: "주름 개선 시술" },
  { id: "skin_tone", label: "톤개선", labelEn: "SKIN TONE", desc: "피부톤 개선 시술" },
  { id: "scar", label: "흉터치료", labelEn: "SCAR", desc: "흉터 치료 시술" },
  { id: "vitiligo", label: "백반증", labelEn: "VITILIGO", desc: "백반증 치료 시술" },
  { id: "tattoo", label: "문신제거", labelEn: "TATTOO", desc: "문신 제거 시술" },
  { id: "botox", label: "보톡스·필러", labelEn: "BOTOX", desc: "주름 개선과 얼굴 윤곽 교정" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────────────────────────────
interface Treatment {
  id: number;
  name: string;
  nameEn: string;
  desc: string;
  time: string;
  recovery: string;
  badge: string | null;
  badgeColor: string | null;
  image: string | null;
  images: string | null;
  imgBg: string | null;
  cardBannerImage: string | null;
  best: string | boolean | null;
  detail: string | null;
  caution: string | null;
  sessions: string | null;
  effect: string | null;
  related: string | null;
  steps: string | null;
  youtubeUrl: string | null;
  modalImage: string | null;
  categoryId: string;
  isActive: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────
export default function TreatmentsEquipmentSectionV2() {
  const [activeId, setActiveId] = useState("best");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [showModal, setShowModal] = useState(false);

  // DB에서 데이터 로드
  const { data: treatmentsList, isLoading } = trpc.treatments.all.useQuery();
  const { data: bestTreatments } = trpc.treatments.best.useQuery();
  const { data: categoryTreatments } = trpc.treatments.byCategory.useQuery(
    { categoryId: activeId },
    { enabled: activeId !== "best" }
  );

  const sectionRef = useSectionReveal(60);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // 탭 자동 스크롤
  useEffect(() => {
    const container = tabContainerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const containerWidth = container.offsetWidth;
    const btnLeft = activeBtn.offsetLeft;
    const btnWidth = activeBtn.offsetWidth;
    container.scrollTo({
      left: btnLeft - containerWidth / 2 + btnWidth / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  // 현재 활성 탭의 시술 데이터
  const filteredTreatments = useMemo(() => {
    if (activeId === "best") {
      return bestTreatments || [];
    }
    return categoryTreatments || [];
  }, [activeId, bestTreatments, categoryTreatments]);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
        <div className="container text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="treatments" className="py-16 sm:py-24" style={{ background: "#ffffff" }}>
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p className="text-sm tracking-widest mb-3 font-montserrat" style={{ color: "#d1ab67", fontWeight: 300, fontSize: '12px' }}>
            TREATMENTS & EQUIPMENT
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}
          >
            검증된 숙련도와 최상의 솔루션
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-snug sm:leading-normal" style={{ color: '#d1ab67', paddingTop: '7px' }}>
            <span className="sm:hidden" style={{fontSize: '18px'}}>20년 내공의 피부과전문의 시술,<br />프리미엄 레이저 장비 라인업</span>
            <span className="hidden sm:inline" style={{fontSize: '18px'}}>20년 내공의 피부과전문의 시술, 프리미엄 레이저 장비 라인업</span>
          </p>
        </div>

        {/* 카테고리 탭 */}
        <div
          className="rounded-2xl px-4 py-4 mb-6"
          style={{ background: "#ffffff", marginBottom: '15px' }}
        >
          <div ref={tabContainerRef} className="grid grid-cols-2 gap-2 sm:hidden overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                data-active={activeId === cat.id}
                onClick={() => setActiveId(cat.id)}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
                style={{
                  background: activeId === cat.id ? "#4A6FA5" : "#F3F4F6",
                  color: activeId === cat.id ? "white" : "#6B7280",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                data-active={activeId === cat.id}
                onClick={() => setActiveId(cat.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
                style={{
                  background: activeId === cat.id ? "#4A6FA5" : "#F3F4F6",
                  color: activeId === cat.id ? "white" : "#6B7280",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 시술 카드 그리드 */}
        {filteredTreatments && filteredTreatments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreatments.map((treatment: Treatment) => (
              <div
                key={treatment.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedTreatment(treatment);
                  setShowModal(true);
                }}
              >
                {/* 이미지 */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  {(treatment.cardBannerImage || treatment.image) ? (
                    <img
                      src={(treatment.cardBannerImage || treatment.image) as string}
                      alt={treatment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">이미지 없음</span>
                    </div>
                  )}
                  {treatment.youtubeUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors">
                      <Play size={48} className="text-white" />
                    </div>
                  )}
                </div>

                {/* 콘텐츠 */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 flex-1">{treatment.name}</h3>
                    {treatment.best && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded ml-2">
                        Best
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{treatment.desc}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>⏱ {treatment.time}</span>
                    <span>🏥 {treatment.recovery}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">시술 정보가 없습니다.</p>
          </div>
        )}

        {/* 상세 모달 */}
        {showModal && selectedTreatment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* 모달 헤더 */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedTreatment.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* 모달 콘텐츠 */}
              <div className="p-6 space-y-6">
                {/* 이미지 또는 유튜브 */}
                {selectedTreatment.youtubeUrl ? (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={(selectedTreatment.youtubeUrl as string).replace('watch?v=', 'embed/')}
                      title={selectedTreatment.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (selectedTreatment.modalImage || selectedTreatment.image) ? (
                  <img
                    src={(selectedTreatment.modalImage || selectedTreatment.image) as string}
                    alt={selectedTreatment.name}
                    className="w-full rounded-lg"
                  />
                ) : null}

                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">소요 시간</p>
                    <p className="font-semibold text-gray-900">{selectedTreatment.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">회복 기간</p>
                    <p className="font-semibold text-gray-900">{selectedTreatment.recovery}</p>
                  </div>
                </div>

                {/* 상세 설명 */}
                {selectedTreatment.detail && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">상세 설명</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedTreatment.detail}</p>
                  </div>
                )}

                {/* 기대 효과 */}
                {selectedTreatment.effect && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">기대 효과</h3>
                    <p className="text-gray-700">{selectedTreatment.effect}</p>
                  </div>
                )}

                {/* 권장 횟수 */}
                {selectedTreatment.sessions && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">권장 횟수</h3>
                    <p className="text-gray-700">{selectedTreatment.sessions}</p>
                  </div>
                )}

                {/* 주의사항 */}
                {selectedTreatment.caution && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">주의사항</h3>
                    <p className="text-gray-700">{selectedTreatment.caution}</p>
                  </div>
                )}

                {/* 닫기 버튼 */}
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
