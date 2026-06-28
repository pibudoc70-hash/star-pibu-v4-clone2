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
        className="font-normal leading-tight mb-2 text-[var(--brand-text,#2C2C2C)]"
        style={{
          fontSize: "clamp(1rem, 3.2vw, 1.15rem)",
          letterSpacing: "-0.01em",
          fontFamily: "'Noto Serif KR', 'Cormorant Garamond', serif",
        }}
      >
        {getLocalizedText(event, "title")}
      </h3>

      {/* 한 줄 카피 — 서브타이틀, 절제된 색상 */}
      <p
        className="leading-relaxed mb-3"
        style={{
          color: "var(--brand-text-mid, #666666)",
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
          style={{ color: "var(--brand-text-mid, #666666)", fontSize: "0.82rem", letterSpacing: "0.02em" }}
        >
          {priceRows[0].label}
        </p>
      ) : (
        event.productName && (
          <p
            className="font-medium mb-4"
          style={{ color: "var(--brand-text-mid, #666666)", fontSize: "0.82rem", letterSpacing: "0.02em" }}
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
            color: "var(--brand-gold-deep, #A8895E)",
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            letterSpacing: "-0.01em",
          }}
        >
          {displayPrice.discountPrice.toLocaleString()}원
        </span>
        <span
          className="line-through"
          style={{ color: "var(--brand-text-light, #BBBBBB)", fontSize: "0.78rem", fontWeight: 400 }}
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
      className="flex flex-col overflow-hidden card"
    >
      {/* 이미지 — PC: 항상 표시 / 모바일: 확장 시에만 표시 */}
      {event.imageUrl && (
        <div
          className={`overflow-hidden bg-gray-100 ${
            isExpanded ? "block" : "hidden md:block"
          }`}
          style={{
            aspectRatio: "3/2",
            borderRadius: isExpanded ? "1rem 1rem 0 0" : "1rem 1rem 0 0",
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
            className="mt-auto w-full py-3 font-semibold transition-all duration-300 rounded-xl hover:bg-[#F0EAE0] hover:-translate-y-0.5 text-[var(--brand-gold-deep,#A8895E)]"
            style={{
              background: "transparent",
              border: "1px solid rgba(196,168,130,0.5)",
              fontSize: "0.82rem",
              letterSpacing: "0.06em",
              fontWeight: 500,
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
                  <p className="text-xs font-semibold" style={{ color: "var(--brand-text-mid, #666666)" }}>{row.label}</p>
                  <div className="flex items-baseline gap-2 flex-shrink-0">
                    <p className="font-bold" style={{ color: "var(--brand-gold-deep, #A8895E)", fontSize: "0.95rem" }}>
                      {row.discountPrice.toLocaleString()}원
                    </p>
                    <p className="line-through" style={{ color: "var(--brand-text-light, #BBBBBB)", fontSize: "0.72rem" }}>
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
              <p className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: "var(--brand-text-mid, #666666)" }}>{event.desc}</p>
            </div>
          )}

          {/* 내용 */}
          {event.content && (
            <div className="mb-4">
              <p className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: "var(--brand-text-mid, #666666)" }}>{event.content}</p>
            </div>
          )}

          {/* 상담 버튼 — 모바일 640px 이하에서 숨김 (MobileBottomCTA와 충돌 방지) */}
          <div className="hidden md:flex gap-2.5 mb-3">
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
              style={{ backgroundColor: "var(--brand-bg-alt, #F5F0EB)", color: "var(--brand-text-mid, #666666)", fontSize: "0.82rem" }}
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
            className="w-full py-2.5 font-medium rounded-xl transition-colors text-sm text-[var(--brand-text-light,#BBBBBB)]"
            style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.12)", fontSize: "0.78rem", letterSpacing: "0.04em" }}
          >
            접기
          </button>
        </div>
      )}
    </div>
  );
}
