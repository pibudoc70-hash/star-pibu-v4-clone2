/**
 * EventTableMobile - 모바일 전용 이벤트 테이블
 * 
 * 시술명 + 가격을 한 줄 테이블로 표시
 * 각 행의 "상세보기" 버튼 클릭 시 모달에서 상세 정보 표시
 */
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { SpecialEvent, PriceRow } from "@/hooks/useLocalizedEvent";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
import { useChatConfig } from "@/hooks/useChatConfig";

interface EventTableMobileProps {
  events: SpecialEvent[];
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
}

interface EventDetailModalProps {
  event: SpecialEvent | null;
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
  onClose: () => void;
}

// ── 상세 정보 모달 ────────────────────────────────────────────────────────────
function EventDetailModal({ event, getLocalizedText, onClose }: EventDetailModalProps) {
  const { lang } = useLang();
  const { chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  
  if (!event) return null;

  // priceRows 파싱
  let priceRows: PriceRow[] = [];
  if (event.priceRows) {
    try {
      priceRows = JSON.parse(event.priceRows) as PriceRow[];
    } catch {
      // JSON 파싱 실패 시 빈 배열 유지
    }
  }

  const chatLabel = isZH ? "微信和我联系" : isJA ? "LINEで相談" : lang === "en" ? "Chat Consultation" : "카카오 상담";
  const phoneHref = lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300";
  const phoneLabel = lang === "ko" ? "051-818-2300" : "+82-51-818-2300";

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 flex items-center justify-between p-5 md:p-6 border-b border-gray-200 bg-white rounded-t-3xl md:rounded-t-2xl">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {getLocalizedText(event, "title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-5 md:p-6 space-y-5">
          {/* 이미지 */}
          {event.imageUrl && (
            <div className="rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "3/2" }}>
              <OptimizedImage
                src={event.imageUrl}
                alt={getLocalizedText(event, "title")}
                className="w-full h-full object-cover"
                width={600}
                height={400}
                priority={false}
              />
            </div>
          )}

          {/* 한 줄 카피 */}
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {getLocalizedText(event, "subtitle")}
          </p>

          {/* 상세 설명 */}
          {event.desc && (
            <div>
              <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {event.desc}
              </p>
            </div>
          )}

          {/* 추가 콘텐츠 */}
          {event.content && (
            <div>
              <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {event.content}
              </p>
            </div>
          )}

          {/* 가격 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-sm text-gray-900">가격 정보</h4>
            {priceRows.length > 0 ? (
              priceRows.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">{row.label}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm md:text-base" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>
                      {row.discountPrice.toLocaleString()}원
                    </span>
                    {row.normalPrice > 0 && (
                      <span className="line-through text-xs text-gray-400">
                        {row.normalPrice.toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-600">{event.productName || "시술"}</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm md:text-base" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>
                    {event.discountPrice.toLocaleString()}원
                  </span>
                  {event.normalPrice > 0 && (
                    <span className="line-through text-xs text-gray-400">
                      {event.normalPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CTA 버튼 */}
          <div className="flex gap-3 pt-4">
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 font-semibold rounded-lg transition-all text-center text-sm"
              style={{ background: chatBg, color: chatColor }}
            >
              {chatLabel}
            </a>
            <a
              href={phoneHref}
              className="flex-1 px-4 py-3 font-medium rounded-lg transition-all text-center text-sm"
              style={{ backgroundColor: "var(--brand-bg-alt, #F5F0EB)", color: "var(--brand-text-mid, #666666)" }}
            >
              {phoneLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 테이블 컴포넌트 ────────────────────────────────────────────────────────────
export default function EventTableMobile({ events, getLocalizedText }: EventTableMobileProps) {
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);

  return (
    <>
      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">시술명</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">가격</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              // priceRows 파싱
              let priceRows: PriceRow[] = [];
              if (event.priceRows) {
                try {
                  priceRows = JSON.parse(event.priceRows) as PriceRow[];
                } catch {
                  // JSON 파싱 실패 시 빈 배열 유지
                }
              }

              const displayPrice =
                priceRows.length > 0
                  ? priceRows[0].discountPrice
                  : event.discountPrice;

              return (
                <tr
                  key={event.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {getLocalizedText(event, "title")}
                  </td>
                  <td className="py-4 px-4 text-right font-bold" style={{ color: "var(--brand-gold-deep, #A8895E)" }}>
                    {displayPrice.toLocaleString()}원
                  </td>
                  <td className="py-4 px-2 text-center">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label={`${getLocalizedText(event, "title")} 상세보기`}
                    >
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 상세 정보 모달 */}
      <EventDetailModal
        event={selectedEvent}
        getLocalizedText={getLocalizedText}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
