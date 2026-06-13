/**
 * EventCard
 * SpecialEventSection에서 분리된 이벤트 카드 컴포넌트.
 * 축소(collapsed) / 확장(expanded) 두 가지 상태를 내부적으로 관리한다.
 *
 * [P1 디자인 개선] 프리미엄 시술 제안 카드로 재설계:
 * - 시술명 / 한 줄 카피 / 핵심 베네핏 / 가격 / CTA 순서 유지
 * - 가격이 카드의 유일한 중심이 되지 않도록 비주얼 비중 강화
 * - 이미지 aspect-ratio 더 넓게 (16/9 → 3/2) — 비주얼 임팩트 강화
 * - "자세히 보기" 버튼을 카드 구조에 자연스럽게 통합
 * - 카드 배경: 순백 → 오프화이트(#FDFCF9) — 럭셔리 톤
 * - 가격 표현: 할인가 강조 유지, 정상가는 더 절제
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
  isExpanded?: boolean;
}

function EventCardHeader({ event, priceRows, displayPrice, getLocalizedText, isExpanded = false }: EventCardHeaderProps) {
  return (
    <div className="flex flex-col">
      {/* 시술명 — 브랜드 골드, 절제된 크기 */}
      <h3
        className="font-bold leading-tight mb-2"
        style={{
          color: "#C9A84C",
          fontSize: "clamp(1rem, 3.2vw, 1.2rem)",
          letterSpacing: "0.01em",
        }}
      >
        {getLocalizedText(event, "title")}
      </h3>

      {/* 한 줄 카피 — 서브타이틀, 절제된 색상 */}
      <p
        className="leading-relaxed mb-3"
        style={{
          color: "#6B7280",
          fontSize: "clamp(0.78rem, 2.2vw, 0.88rem)",
          lineHeight: "1.6",
        }}
      >
        {getLocalizedText(event, "subtitle")}
      </p>

      {/* 상품/시술 라벨 */}
      {priceRows.length > 0 ? (
        <p
          className="font-medium mb-4"
          style={{ color: "#4B5563", fontSize: "0.82rem", letterSpacing: "0.02em" }}
        >
          {priceRows[0].label}
        </p>
      ) : (
        event.productName && (
          <p
            className="font-medium mb-4"
            style={{ color: "#4B5563", fontSize: "0.82rem", letterSpacing: "0.02em" }}
          >
            {getLocalizedText(event, "productName")}
          </p>
        )
      )}

      {/* 가격 영역 — 할인가 강조, 정상가 절제 */}
      <div className="flex items-baseline gap-2.5 mb-0">
        <span
          className="font-bold"
          style={{
            color: "#C9A84C",
            fontSize: "clamp(1.25rem, 4vw, 1.55rem)",
            letterSpacing: "-0.01em",
          }}
        >
          {displayPrice.discountPrice.toLocaleString()}원
        </span>
        <span
          className="line-through"
          style={{ color: "#C4C4C4", fontSize: "0.78rem", fontWeight: 400 }}
        >
          {displayPrice.normalPrice.toLocaleString()}원
        </span>
      </div>
    </div>
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
        background: "#FDFCF9",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)",
        border: "1px solid rgba(201,168,76,0.12)",
      }}
    >
      {/* 이미지 — 더 넓은 비율로 비주얼 임팩트 강화 */}
      {event.imageUrl && (
        <div
          className="overflow-hidden bg-gray-100"
          style={{
            aspectRatio: "3/2",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          <OptimizedImage
            src={event.imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            width={800}
            height={533}
            priority={false}
          />
        </div>
      )}

      {/* 축소 상태 */}
      {!isExpanded ? (
        <div className="flex flex-col flex-1" style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
          <EventCardHeader
            event={event}
            priceRows={priceRows}
            displayPrice={displayPrice}
            getLocalizedText={getLocalizedText}
          />

          {/* 구분선 — 가격과 CTA 사이 */}
          <div
            className="my-4"
            style={{ height: "1px", background: "linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08), transparent)" }}
          />

          {/* CTA — 카드 구조에 자연스럽게 통합 */}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={`special-event-detail-${event.id}`}
            aria-label={`${title} 자세히 보기`}
            className="mt-auto w-full py-3 font-semibold transition-all duration-300 text-white rounded-xl hover:opacity-92 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #B8892A 100%)",
              fontSize: "0.85rem",
              letterSpacing: "0.04em",
              boxShadow: "0 3px 14px rgba(201,168,76,0.28)",
            }}
          >
            {event.cta}
          </button>
        </div>
      ) : (
        /* 확장 상태 */
        <div id={`special-event-detail-${event.id}`} className="flex flex-col flex-1" style={{ padding: "1.5rem 1.5rem 1.25rem" }}>
          <EventCardHeader
            event={event}
            priceRows={priceRows}
            displayPrice={displayPrice}
            getLocalizedText={getLocalizedText}
            isExpanded
          />

          {/* 구분선 */}
          <div
            className="my-4"
            style={{ height: "1px", background: "linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08), transparent)" }}
          />

          {/* 추가 가격 행 */}
          {hasMultipleRows && (
            <div className="mb-4 space-y-3">
              {priceRows.slice(1).map((row, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4">
                  <p className="text-xs font-semibold" style={{ color: "#4B5563" }}>{row.label}</p>
                  <div className="flex items-baseline gap-2 flex-shrink-0">
                    <p className="font-bold" style={{ color: "#C9A84C", fontSize: "1rem" }}>
                      {row.discountPrice.toLocaleString()}원
                    </p>
                    <p className="line-through" style={{ color: "#C4C4C4", fontSize: "0.72rem" }}>
                      {row.normalPrice.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 상세 설명 */}
          {event.desc && (
            <div className="mb-3">
              <p className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: "#6B7280" }}>{event.desc}</p>
            </div>
          )}

          {/* 내용 */}
          {event.content && (
            <div className="mb-4">
              <p className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: "#6B7280" }}>{event.content}</p>
            </div>
          )}

          {/* 상담 버튼 */}
          <div className="flex gap-2.5 mb-3">
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 font-semibold rounded-xl transition-all duration-200 text-center hover:opacity-85"
              style={{ background: chatBg, color: chatColor, fontSize: "0.82rem", letterSpacing: "0.02em" }}
            >
              {chatLabel}
            </a>
            <a
              href={phoneHref}
              className="flex-1 px-4 py-2.5 font-medium rounded-xl transition-all duration-200 text-center hover:opacity-85"
              style={{ backgroundColor: "#F5F0E8", color: "#6B7280", fontSize: "0.82rem" }}
            >
              {phoneLabel}
            </a>
          </div>

          {/* 접기 — 절제된 톤 */}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={`special-event-detail-${event.id}`}
            aria-label={`${title} 접기`}
            className="w-full py-2.5 font-medium rounded-xl transition-colors text-sm"
            style={{ background: "transparent", color: "#C4C4C4", border: "1px solid rgba(201,168,76,0.12)", fontSize: "0.78rem", letterSpacing: "0.04em" }}
          >
            접기
          </button>
        </div>
      )}
    </div>
  );
}
