/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 * 디자인: 3열 그리드 카드 (PC에서 이미지 표시, 모바일에서 이미지 미표시)
 * 데이터: tRPC events.special에서 동적 로드
 * 
 * 가격 행 표시 방식: 토글 방식
 * - 초기: 제목, 이벤트명, 정상가/할인가 표시 + "자세히 보기" 버튼
 * - 클릭: 카드 내에서 확장되어 추가 정보 표시 + "접기" 버튼
 * - 다시 클릭: 초기 상태로 돌아감
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
  // 각 이벤트별 확장 상태 (true = 확장됨, false = 축소됨)
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
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

                {/* 카드 컨테이너 - 축소 상태 */}
                {!isExpanded ? (
                  <div className="flex flex-col flex-1">
                    {/* 제목 */}
                    <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#d4af6c' }}>
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

                    {/* 정상가와 할인가 (초기 상태) */}
                    <div className="mb-6 flex items-center gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">정상가</p>
                        <p className="text-sm text-gray-400 line-through">
                          {displayPrice.normalPrice.toLocaleString()}원
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">할인가</p>
                        <p className="text-2xl font-bold" style={{ color: '#d4af6c' }}>
                          {displayPrice.discountPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    {/* 자세히 보기 버튼 */}
                    <button
                      onClick={() => toggleExpanded(event.id)}
                      className="mt-auto px-6 py-3 font-semibold rounded-full transition-colors text-navy hover:opacity-80"
                      style={{
                        backgroundColor: '#f7f4ee',
                      }}
                    >
                      {event.cta}
                    </button>
                  </div>
                ) : (
                  // 카드 컨테이너 - 확장 상태
                  <div className="flex flex-col flex-1">
                    {/* 제목 */}
                    <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: '#d4af6c' }}>
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

                    {/* 정상가와 할인가 (확장 상태) */}
                    <div className="mb-4 flex items-center gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">정상가</p>
                        <p className="text-sm text-gray-400 line-through">
                          {displayPrice.normalPrice.toLocaleString()}원
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">할인가</p>
                        <p className="text-2xl font-bold" style={{ color: '#d4af6c' }}>
                          {displayPrice.discountPrice.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    {/* 추가 가격 행 정보 (여러 개인 경우) */}
                    {hasMultipleRows && (
                      <div className="mb-4 space-y-2">
                        {priceRows.slice(1).map((row, idx) => (
                          <div key={idx} className="flex items-start gap-6">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-navy mb-2">{row.label}</p>
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">정상가</p>
                                  <p className="text-xs text-gray-400 line-through">
                                    {row.normalPrice.toLocaleString()}원
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">할인가</p>
                                  <p className="text-lg font-bold" style={{ color: '#d4af6c' }}>
                                    {row.discountPrice.toLocaleString()}원
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 상세 설명 */}
                    {event.desc && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap">{event.desc}</p>
                      </div>
                    )}

                    {/* 내용 */}
                    {event.content && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap">{event.content}</p>
                      </div>
                    )}

                    {/* 상담 버튼 영역 */}
                    <div className="flex gap-3 mb-3">
                      <a
                        href="https://pf.kakao.com/_HNyGC"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 font-semibold rounded-full transition-colors text-center text-navy hover:opacity-80"
                        style={{
                          backgroundColor: '#f7f4ee',
                          fontSize: '0.875rem',
                        }}
                      >
                        카카오 상담
                      </a>
                      <a
                        href="tel:051-818-2300"
                        className="flex-1 px-4 py-2 font-semibold rounded-full transition-colors text-center text-navy hover:opacity-80"
                        style={{
                          backgroundColor: '#f7f4ee',
                          fontSize: '0.875rem',
                        }}
                      >
                        전화 상담
                      </a>
                    </div>

                    {/* 접기 버튼 */}
                    <button
                      onClick={() => toggleExpanded(event.id)}
                      className="w-full px-6 py-2 font-semibold rounded-full transition-colors bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm"
                    >
                      접기
                    </button>
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
