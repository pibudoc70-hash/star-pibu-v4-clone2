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
      {/* [M3] 시선 흐름: 시술명 → 짧은 카피 → 가격 순서 유지, 가격이 먼저 튀지 않게 */}
      <h3 className="text-xl md:text-2xl font-bold mb-1.5" style={{ color: "#d4af6c" }}>
        {getLocalizedText(event, "title")}
      </h3>
      <p className="text-sm text-gray-500 mb-3 leading-relaxed">
        {getLocalizedText(event, "subtitle")}
      </p>
      {priceRows.length > 0 ? (
        <p className="text-sm font-medium text-gray-600 mb-3">{priceRows[0].label}</p>
      ) : (
        event.productName && (
          <p className="text-sm font-medium text-gray-600 mb-3">
            {getLocalizedText(event, "productName")}
          </p>
        )
      )}
      {/* 가격 영역 — 정상가는 보조, 할인가만 강조 */}
      <div className={`${priceMb} flex items-end gap-3`}>
        <div>
          <p className="text-2xl font-bold" style={{ color: "#d4af6c" }}>
            {displayPrice.discountPrice.toLocaleString()}원
          </p>
        </div>
        <div className="pb-1">
          <p className="text-xs text-gray-400 line-through">
            {displayPrice.normalPrice.toLocaleString()}원
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
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid rgba(212,175,108,0.15)",
        padding: "0",
      }}
    >
      {/* [M3] 이미지 — 모바일/데스크톱 공통 표시, 카드 상단 전체 너비 */}
      {event.imageUrl && (
        <div
          className="overflow-hidden bg-gray-100"
          style={{
            aspectRatio: "16/9",
            borderRadius: "1rem 1rem 0 0",
          }}
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
        <div className="flex flex-col flex-1" style={{ padding: "1.25rem 1.25rem 1.25rem" }}>
          <EventCardHeader
            event={event}
            priceRows={priceRows}
            displayPrice={displayPrice}
            getLocalizedText={getLocalizedText}
            priceMb="mb-5"
          />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={`special-event-detail-${event.id}`}
            aria-label={`${title} 자세히 보기`}
            className="mt-auto w-full py-3 font-semibold transition-colors text-white rounded-xl hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #F5D78E 50%, #B8892A 100%)",
              fontSize: "0.875rem",
              letterSpacing: "0.03em",
              boxShadow: "0 2px 10px rgba(201,168,76,0.3)",
            }}
          >
            {event.cta}
          </button>
        </div>
      ) : (
        /* 확장 상태 */
        <div id={`special-event-detail-${event.id}`} className="flex flex-col flex-1" style={{ padding: "1.25rem 1.25rem 1.25rem" }}>
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
            className="w-full py-2.5 font-medium rounded-xl transition-colors text-sm"
            style={{ background: "#f3f0ea", color: "#6B7280" }}
          >
            접기
          </button>
        </div>
      )}
    </div>
  );
}
