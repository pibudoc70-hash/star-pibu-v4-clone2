/**
 * EventTableMobile - 모바일 전용 이벤트 목록
 *
 * 각 행의 상세를 해당 행 바로 아래에서 펼쳐, 이후 행이 자연스럽게 밀려난다.
 */
import { useRef, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import type { SpecialEvent, PriceRow } from "@/hooks/useLocalizedEvent";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
import { useChatConfig } from "@/hooks/useChatConfig";

interface EventTableMobileProps {
  events: SpecialEvent[];
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
}

function parsePriceRows(event: SpecialEvent): PriceRow[] {
  if (!event.priceRows) return [];

  try {
    return JSON.parse(event.priceRows) as PriceRow[];
  } catch {
    return [];
  }
}

function VatBadge() {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded font-medium"
      style={{
        fontSize: "0.62rem",
        letterSpacing: "0.04em",
        color: "var(--color-gold-dark, #7A5C35)",
        background: "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)",
        border: "1px solid color-mix(in srgb, var(--color-gold-primary) 30%, transparent)",
        whiteSpace: "nowrap",
      }}
    >
      VAT 포함
    </span>
  );
}

interface EventInlineDetailProps {
  event: SpecialEvent;
  isOpen: boolean;
  getLocalizedText: EventTableMobileProps["getLocalizedText"];
  onFooterClose: () => void;
}

function EventInlineDetail({ event, isOpen, getLocalizedText, onFooterClose }: EventInlineDetailProps) {
  const { lang } = useLang();
  const { chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const priceRows = parsePriceRows(event);
  const title = getLocalizedText(event, "title");
  const chatLabel = isZH ? "微信和我联系" : isJA ? "LINEで相談" : lang === "en" ? "Chat Consultation" : "카카오 상담";
  const phoneHref = lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300";
  const phoneLabel = lang === "ko" ? "051-818-2300" : "+82-51-818-2300";

  return (
    <div
      id={`mobile-event-detail-${event.id}`}
      data-event-detail={event.id}
      data-testid={`mobile-event-detail-${event.id}`}
      className={`event-mobile-detail ${isOpen ? "is-open" : ""}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="event-mobile-detail__content">
        <section className="event-mobile-detail__body border-t border-gray-100 bg-white/70 px-5 pt-3 pb-5" aria-label={`${title} 상세`}>
          <div className="mb-4">
            <p className="text-base font-bold text-gray-900 leading-tight">{title}</p>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{getLocalizedText(event, "subtitle")}</p>
          </div>

          {event.imageUrl && (
            <div className="mb-4 rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "3/2" }}>
              <OptimizedImage src={event.imageUrl} alt={title} className="w-full h-full object-cover" width={600} height={400} priority={false} />
            </div>
          )}

          {event.desc && <p className="mb-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{event.desc}</p>}
          {event.content && <p className="mb-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{event.content}</p>}

          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">가격 안내</span>
            </div>
            <div className="divide-y divide-gray-100">
              {priceRows.length > 0 ? (
                priceRows.map((row, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-xs text-gray-600">{row.label}</span>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-sm" style={{ color: "var(--color-gold-deep)" }}>{row.discountPrice.toLocaleString()}원</span>
                        {row.normalPrice > 0 && <span className="line-through text-xs text-gray-400">{row.normalPrice.toLocaleString()}원</span>}
                      </div>
                      <VatBadge />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-xs text-gray-600">{event.productName || "시술"}</span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-sm" style={{ color: "var(--color-gold-deep)" }}>{event.discountPrice.toLocaleString()}원</span>
                      {event.normalPrice > 0 && <span className="line-through text-xs text-gray-400">{event.normalPrice.toLocaleString()}원</span>}
                    </div>
                    <VatBadge />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <a href={chatUrl} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-3 font-semibold rounded-xl text-center text-sm" style={{ background: chatBg, color: chatColor }}>
              {chatLabel}
            </a>
            <a href={phoneHref} className="flex-1 px-4 py-3 font-medium rounded-xl text-center text-sm border border-gray-200" style={{ color: "var(--brand-text-mid, #666666)" }}>
              {phoneLabel}
            </a>
          </div>
          <div data-testid="mobile-event-detail-footer" className="mt-3 flex justify-center border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onFooterClose}
              className="min-h-11 min-w-28 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)]"
              aria-label={`${title} 상세 접기`}
            >
              접기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EventTableMobile({ events, getLocalizedText }: EventTableMobileProps) {
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const eventRowRefs = useRef(new Map<number, HTMLDivElement>());

  const handleFooterClose = (eventId: number) => {
    setExpandedEventId(null);

    requestAnimationFrame(() => {
      eventRowRefs.current.get(eventId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        borderColor: "var(--color-gold-light)",
        background: "var(--brand-bg-card, #FDFAF7)",
      }}
    >
      <div
        className="flex items-center gap-2 px-5 py-4 border-b"
        style={{
          borderColor: "var(--color-gold-light)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-gold-primary) 4%, transparent) 100%)",
        }}
      >
        <Sparkles size={14} style={{ color: "var(--color-gold-primary)" }} />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--color-gold-primary)" }}>Special Event</span>
      </div>

      <div data-testid="mobile-event-list" className="divide-y" style={{ borderColor: "var(--color-gold-light)" }}>
        {events.map((event) => {
          const priceRows = parsePriceRows(event);
          const displayPrice = priceRows.length > 0 ? priceRows[0].discountPrice : event.discountPrice;
          const normalPrice = priceRows.length > 0 ? priceRows[0].normalPrice : event.normalPrice;
          const title = getLocalizedText(event, "title");
          const isOpen = expandedEventId === event.id;

          return (
            <div key={event.id} className="event-mobile-entry">
              <div
                ref={(node) => {
                  if (node) {
                    eventRowRefs.current.set(event.id, node);
                  } else {
                    eventRowRefs.current.delete(event.id);
                  }
                }}
                data-event-row={event.id}
                className="flex scroll-mt-16 items-center gap-3 px-5 py-4 transition-colors active:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold" style={{ color: "var(--color-gold-deep)" }}>{displayPrice.toLocaleString()}원</span>
                      {normalPrice > 0 && <span className="line-through text-xs text-gray-400">{normalPrice.toLocaleString()}원</span>}
                    </div>
                    <VatBadge />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedEventId(isOpen ? null : event.id)}
                  className="flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center gap-1 rounded-full border px-3 text-xs font-medium transition-all active:scale-95"
                  style={{
                    borderColor: "var(--color-gold-light)",
                    color: "var(--color-gold-deep)",
                    background: "color-mix(in srgb, var(--color-gold-primary) 8%, transparent)",
                  }}
                  aria-label={`${title} 상세 ${isOpen ? "접기" : "펼치기"}`}
                  aria-expanded={isOpen}
                  aria-controls={`mobile-event-detail-${event.id}`}
                >
                  {isOpen ? "접기" : "상세"}
                  <span
                    data-testid={`mobile-event-expand-indicator-${event.id}`}
                    data-expanded={isOpen}
                    aria-hidden="true"
                    className={`event-mobile-entry__indicator inline-flex transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? "is-expanded rotate-180" : ""}`}
                  >
                    <ChevronDown size={16} strokeWidth={2.25} />
                  </span>
                </button>
              </div>

              <EventInlineDetail event={event} isOpen={isOpen} getLocalizedText={getLocalizedText} onFooterClose={() => handleFooterClose(event.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
