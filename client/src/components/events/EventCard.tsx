/**
 * EventCard
 * SpecialEventSection에서 분리된 이벤트 카드 컴포넌트.
 * 축소(collapsed) / 확장(expanded) 두 가지 상태를 내부적으로 관리한다.
 *
 * 책임:
 * - 이벤트 이미지 표시 (PC 전용)
 * - 제목·부제·상품명·가격 표시 (EventCardHeader)
 * - 자세히 보기 / 접기 토글
 * - 확장 시 추가 가격 행, 상세 설명, 상담 버튼 표시
 */
import { useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import type { SpecialEvent, PriceRow } from "@/hooks/useLocalizedEvent";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";

interface EventCardProps {
  event: SpecialEvent;
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
}

// ── 카드 공통 헤더 ────────────────────────────────────────────────────────────
interface EventCardHeaderProps {
  event: SpecialEvent;
  priceRows: PriceRow[];
  displayPrice: { normalPrice: number; discountPrice: number };
  getLocalizedText: EventCardProps["getLocalizedText"];
  priceMb?: string;
}

function EventCardHeader({ event, priceRows, displayPrice, getLocalizedText, priceMb = "mb-6" }: EventCardHeaderProps) {
  return (
    <>
      <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "#d4af6c" }}>
        {getLocalizedText(event, "title")}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {getLocalizedText(event, "subtitle")}
      </p>
      {priceRows.length > 0 ? (
        <p className="text-base font-medium text-gray-700 mb-4">{priceRows[0].label}</p>
      ) : (
        event.productName && (
          <p className="text-base font-medium text-gray-700 mb-4">
            {getLocalizedText(event, "productName")}
          </p>
        )
      )}
      <div className={`${priceMb} flex items-center gap-6`}>
        <div>
          <p className="text-xs text-gray-500 mb-1">정상가</p>
          <p className="text-sm text-gray-500 line-through">
            {displayPrice.normalPrice.toLocaleString()}원
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">할인가</p>
          <p className="text-2xl font-bold" style={{ color: "#d4af6c" }}>
            {displayPrice.discountPrice.toLocaleString()}원
          </p>
        </div>
      </div>
    </>
  );
}

// ── 메인 EventCard ────────────────────────────────────────────────────────────
export default function EventCard({ event, getLocalizedText }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { lang } = useLang();
  const { chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  // 언어별 CTA 라벨
  const chatLabel = isZH ? "微信和我联系" : isJA ? "LINEで相談" : lang === "en" ? "Chat Consultation" : "카카오 상담";
  const phoneHref = lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300";
  const phoneLabel = lang === "ko" ? "051-818-2300" : "+82-51-818-2300";

  // priceRows 파싱
  let priceRows: PriceRow[] = [];
  if (event.priceRows) {
    try {
      priceRows = JSON.parse(event.priceRows) as PriceRow[];
    } catch {
      // JSON 파싱 실패 시 빈 배열 유지
    }
  }

  const hasMultipleRows = priceRows.length > 1;
  const displayPrice =
    priceRows.length > 0
      ? { normalPrice: priceRows[0].normalPrice, discountPrice: priceRows[0].discountPrice }
      : { normalPrice: event.normalPrice, discountPrice: event.discountPrice };

  const toggle = () => setIsExpanded((prev) => !prev);
  const title = getLocalizedText(event, "title");

  return (
    <div className="flex flex-col">
      {/* 이미지 (PC 전용) */}
      {event.imageUrl && (
        <div
          className="hidden md:block mb-6 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
          style={{ aspectRatio: "16/9" }}
        >
          <OptimizedImage
            src={event.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            width={800}
            height={450}
            priority={false}
          />
        </div>
      )}

      {/* 축소 상태 */}
      {!isExpanded ? (
        <div className="flex flex-col flex-1">
          <EventCardHeader
            event={event}
            priceRows={priceRows}
            displayPrice={displayPrice}
            getLocalizedText={getLocalizedText}
            priceMb="mb-6"
          />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={`special-event-detail-${event.id}`}
            aria-label={`${title} 자세히 보기`}
            className="mt-auto px-6 py-3 font-semibold rounded-full transition-colors text-navy hover:opacity-80"
            style={{ backgroundColor: "#f7f4ee" }}
          >
            {event.cta}
          </button>
        </div>
      ) : (
        /* 확장 상태 */
        <div id={`special-event-detail-${event.id}`} className="flex flex-col flex-1">
          <EventCardHeader
            event={event}
            priceRows={priceRows}
            displayPrice={displayPrice}
            getLocalizedText={getLocalizedText}
            priceMb="mb-4"
          />

          {/* 추가 가격 행 */}
          {hasMultipleRows && (
            <div className="mb-4 space-y-2">
              {priceRows.slice(1).map((row, idx) => (
                <div key={idx} className="flex items-start gap-6">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-navy mb-2">{row.label}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">정상가</p>
                        <p className="text-xs text-gray-500 line-through">
                          {row.normalPrice.toLocaleString()}원
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">할인가</p>
                        <p className="text-lg font-bold" style={{ color: "#d4af6c" }}>
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

          {/* 상담 버튼 */}
          <div className="flex gap-3 mb-3">
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 font-semibold rounded-full transition-colors text-center hover:opacity-80"
              style={{ background: chatBg, color: chatColor, fontSize: "0.875rem" }}
            >
              {chatLabel}
            </a>
            <a
              href={phoneHref}
              className="flex-1 px-4 py-2 font-semibold rounded-full transition-colors text-center text-navy hover:opacity-80"
              style={{ backgroundColor: "#f7f4ee", fontSize: "0.875rem" }}
            >
              {phoneLabel}
            </a>
          </div>

          {/* 접기 버튼 */}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={`special-event-detail-${event.id}`}
            aria-label={`${title} 접기`}
            className="w-full px-6 py-2 font-semibold rounded-full transition-colors bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm"
          >
            접기
          </button>
        </div>
      )}
    </div>
  );
}
