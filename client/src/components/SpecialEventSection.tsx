/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 * 디자인: 3열 그리드 카드 (PC에서 이미지 표시, 모바일에서 이미지 미표시)
 * 데이터: tRPC events.special에서 동적 로드
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";

interface SpecialEvent {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  productName: string;
  normalPrice: number;
  discountPrice: number;
  imageUrl?: string;
  cta: string;
  isActive: "0" | "1";
  sortOrder: number;
}

export default function SpecialEventSection() {
  const { t } = useLang();
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // tRPC 쿼리
  const { data, isLoading: queryLoading } = trpc.events.special.useQuery();

  useEffect(() => {
    if (data) {
      setSpecialEvents(data as SpecialEvent[]);
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading || queryLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-gold mb-2">FOR YOU</p>
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">SPECIAL EVENT</h2>
            <p className="text-lg text-gold">로딩 중...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!specialEvents || specialEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        {/* 헤더 */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm font-medium text-gold mb-2">FOR YOU</p>
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">SPECIAL EVENT</h2>
          <p className="text-lg text-gold">
            스타만의 특별한 가격으로,<br />
            한 단계 높은 피부 관리를 시작해보세요.
          </p>
        </div>

        {/* 이벤트 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialEvents.map((event) => (
            <div key={event.id} className="flex flex-col">
              {/* 이미지 (PC에서만 표시) */}
              {event.imageUrl && (
                <div className="hidden md:block mb-6 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 aspect-square">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 제목 */}
              <h3 className="text-xl md:text-2xl font-bold text-navy mb-2">
                {event.title}
              </h3>

              {/* 부제 */}
              <p className="text-sm text-gray-600 mb-3">
                {event.subtitle}
              </p>

              {/* 상품명 */}
              <p className="text-base font-medium text-gray-700 mb-4">
                {event.productName}
              </p>

              {/* 가격 정보 */}
              <div className="mb-6">
                {/* 정상가 */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">정상가</span>
                  <span className="text-sm text-gray-400 line-through">
                    {event.normalPrice.toLocaleString()}원
                  </span>
                </div>

                {/* 할인가 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">할인가</span>
                  <span className="text-3xl font-bold text-orange-500">
                    {event.discountPrice.toLocaleString()}
                    <span className="text-lg">원</span>
                  </span>
                </div>
              </div>

              {/* CTA 버튼 */}
              <button className="mt-auto px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-navy font-semibold rounded-full transition-colors">
                {event.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
