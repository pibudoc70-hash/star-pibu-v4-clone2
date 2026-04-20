/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 * 디자인: 3열 그리드 카드 (PC에서 이미지 표시, 모바일에서 이미지 미표시)
 * 데이터: tRPC events.special에서 동적 로드
 * 
 * 가격 행 표시 방식: 토글 방식
 * - 초기: 첫 번째 가격 행만 표시 + "자세히 보기" 버튼
 * - 클릭: 모든 가격 행 표시 + "접기" 버튼
 * - 다시 클릭: 첫 번째 가격 행만 표시 + "자세히 보기" 버튼
 */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";

interface PriceRow {
  label: string;
  normalPrice: number;
  discountPrice: number;
}

interface SpecialEvent {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  content: string;
  productName: string;
  normalPrice: number;
  discountPrice: number;
  priceRows?: string; // JSON 문자열
  imageUrl?: string;
  cta: string;
  isActive: "0" | "1";
  sortOrder: number;
  anesthesiaFee?: string; // 수면마취비 정보
}

export default function SpecialEventSection() {
  const { t } = useLang();
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 각 이벤트별 확장 상태 (true = 모든 가격 행 표시, false = 첫 번째 행만 표시)
  const [expandedEventIds, setExpandedEventIds] = useState<Set<number>>(new Set());

  // tRPC 쿼리
  const { data, isLoading: queryLoading } = trpc.events.special.useQuery();

  useEffect(() => {
    if (data) {
      setSpecialEvents(data as SpecialEvent[]);
      setIsLoading(false);
    }
  }, [data]);

  const toggleExpanded = (eventId: number) => {
    setExpandedEventIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

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

  // 이벤트가 없어도 섹션은 표시 ("진행중인 이벤트 없음" 메시지 표시)
  // if (!specialEvents || specialEvents.length === 0) {
  //   return null;
  // }

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
        {specialEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">진행중인 이벤트가 없습니다.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialEvents.map((event) => {
            // priceRows 파싱
            let priceRows: PriceRow[] = [];
            if (event.priceRows) {
              try {
                priceRows = JSON.parse(event.priceRows);
              } catch (e) {
                console.error('Failed to parse priceRows:', e);
              }
            }

            const isExpanded = expandedEventIds.has(event.id);
            const hasMultipleRows = priceRows.length > 1;

            // 표시할 가격 정보 (초기: 첫 번째 행)
            let displayPrice: { normalPrice: number; discountPrice: number };
            if (priceRows.length > 0) {
              displayPrice = {
                normalPrice: priceRows[0].normalPrice,
                discountPrice: priceRows[0].discountPrice,
              };
            } else {
              displayPrice = {
                normalPrice: event.normalPrice,
                discountPrice: event.discountPrice,
              };
            }

            return (
              <div key={event.id} className="flex flex-col">
                {/* 이미지 (PC에서만 표시) */}
                {event.imageUrl && (
                  <div className="hidden md:block mb-6 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100" style={{aspectRatio: '16/9'}}>
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

                {/* 수면마취비 정보 */}
                {event.anesthesiaFee && (
                  <p className="text-sm text-orange-600 font-semibold mb-4">
                    {event.anesthesiaFee}
                  </p>
                )}

                {/* 가격 정보 - 항상 첫 번째 가격 행만 표시 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">정상가</span>
                    <span className="text-sm text-gray-400 line-through">
                      {displayPrice.normalPrice.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">할인가</span>
                    <span className="text-3xl font-bold text-orange-500">
                      {displayPrice.discountPrice.toLocaleString()}
                      <span className="text-lg">원</span>
                    </span>
                  </div>
                </div>

                {/* CTA 버튼 */}
                {hasMultipleRows ? (
                  <button
                    onClick={() => toggleExpanded(event.id)}
                    className={`mt-auto px-6 py-3 font-semibold rounded-full transition-colors ${
                      isExpanded
                        ? 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                        : 'text-navy hover:opacity-80'
                    }`}
                    style={{
                      backgroundColor: isExpanded ? undefined : '#f7f4ee',
                    }}
                  >
                    {isExpanded ? '접기' : event.cta}
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-auto px-6 py-3 font-semibold rounded-full text-navy opacity-50 cursor-not-allowed"
                    style={{
                      backgroundColor: '#f7f4ee',
                    }}
                  >
                    {event.cta}
                  </button>
                )}

                {/* 추가 가격 행 정보 (확장 시 표시) */}
                {isExpanded && hasMultipleRows && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    {/* 모든 가격 행 표시 */}
                    <div className="space-y-3">
                      {priceRows.map((row, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-navy mb-2">{row.label}</h4>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500">정상가</p>
                              <p className="text-sm text-gray-400 line-through">
                                {row.normalPrice.toLocaleString()}원
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">할인가</p>
                              <p className="text-xl font-bold text-orange-500">
                                {row.discountPrice.toLocaleString()}원
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 상세 설명 */}
                    {event.desc && (
                      <div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.desc}</p>
                      </div>
                    )}

                    {/* 내용 */}
                    {event.content && (
                      <div>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.content}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
