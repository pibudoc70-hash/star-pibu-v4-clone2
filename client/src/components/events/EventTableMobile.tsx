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

const MOBILE_EVENT_COPY = {
  ko: {
    hint: "원하는 이벤트를 누르면 상세 내용과 가격을 확인할 수 있어요.",
    open: "상세 보기",
    close: "상세 접기",
    detail: "상세",
    pricing: "가격 안내",
    treatment: "시술",
  },
  en: {
    hint: "Tap an event to view its details and pricing.",
    open: "View details",
    close: "Close details",
    detail: "details",
    pricing: "Pricing",
    treatment: "Treatment",
  },
  ja: {
    hint: "イベントをタップすると、詳細と料金をご確認いただけます。",
    open: "詳細を見る",
    close: "詳細を閉じる",
    detail: "詳細",
    pricing: "料金案内",
    treatment: "施術",
  },
  zh: {
    hint: "点击活动即可查看详情和价格。",
    open: "查看详情",
    close: "收起详情",
    detail: "详情",
    pricing: "价格说明",
    treatment: "治疗项目",
  },
  "zh-TW": {
    hint: "點選活動即可查看詳細內容與價格。",
    open: "查看詳細",
    close: "收起詳細",
    detail: "詳細",
    pricing: "價格說明",
    treatment: "療程",
  },
} as const;

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
  const copy = MOBILE_EVENT_COPY[lang];
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
        <section className="event-mobile-detail__body border-t border-gray-100 bg-white px-4 pt-3 pb-4" aria-label={`${title} ${copy.detail}`}>
          <div className="mb-2">
            <p className="text-base font-bold text-gray-900 leading-tight">{title}</p>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{getLocalizedText(event, "subtitle")}</p>
          </div>

          {event.imageUrl && (
            <div className="mb-3 rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "16/9" }}>
              <OptimizedImage src={event.imageUrl} alt={title} className="w-full h-full object-cover" width={600} height={400} priority={false} />
            </div>
          )}

          {event.desc && <p className="mb-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{event.desc}</p>}
          {event.content && <p className="mb-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{event.content}</p>}

          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className="px-3.5 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{copy.pricing}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {priceRows.length > 0 ? (
                priceRows.map((row, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
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
                <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <span className="text-xs text-gray-600">{event.productName || copy.treatment}</span>
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

          <div className="grid grid-cols-2 gap-2.5 pt-3">
            <a href={chatUrl} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2.5 font-semibold rounded-xl text-center text-sm" style={{ background: chatBg, color: chatColor }}>
              {chatLabel}
            </a>
            <a href={phoneHref} className="flex-1 px-4 py-2.5 font-medium rounded-xl text-center text-sm border border-gray-200" style={{ color: "var(--brand-text-mid, #666666)" }}>
              {phoneLabel}
            </a>
          </div>
          <div data-testid="mobile-event-detail-footer" className="mt-2.5 flex justify-center border-t border-gray-100 pt-2.5">
            <button
              type="button"
              onClick={onFooterClose}
              className="min-h-11 min-w-28 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)]"
              aria-label={`${title} ${copy.close}`}
            >
              {copy.close}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EventTableMobile({ events, getLocalizedText }: EventTableMobileProps) {
  const { lang } = useLang();
  const copy = MOBILE_EVENT_COPY[lang];
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const eventRowRefs = useRef(new Map<number, HTMLButtonElement>());

  const handleFooterClose = (eventId: number) => {
    setExpandedEventId(null);

    requestAnimationFrame(() => {
      eventRowRefs.current.get(eventId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div
      className="overflow-hidden rounded-[1.25rem] border shadow-[0_12px_30px_rgba(10,18,40,0.045)]"
      style={{
        borderColor: "var(--color-gold-light)",
        background: "var(--brand-bg-card, #FDFAF7)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          borderColor: "var(--color-gold-light)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-gold-primary) 4%, transparent) 100%)",
        }}
      >
        <Sparkles size={14} style={{ color: "var(--color-gold-primary)" }} />
        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: "var(--color-gold-primary)" }}>Special Event</span>
      </div>

      <div data-testid="mobile-event-list" className="divide-y" style={{ borderColor: "var(--color-gold-light)" }}>
        <p data-testid="mobile-event-detail-hint" className="border-b px-4 py-2 text-[11px] leading-relaxed text-stone-500" style={{ borderColor: "var(--color-gold-light)" }}>
          {copy.hint}
        </p>
        {events.map((event) => {
          const priceRows = parsePriceRows(event);
          const displayPrice = priceRows.length > 0 ? priceRows[0].discountPrice : event.discountPrice;
          const normalPrice = priceRows.length > 0 ? priceRows[0].normalPrice : event.normalPrice;
          const title = getLocalizedText(event, "title");
          const isOpen = expandedEventId === event.id;

          return (
            <div key={event.id} className="event-mobile-entry">
              <button
                type="button"
                ref={(node) => {
                  if (node) {
                    eventRowRefs.current.set(event.id, node);
                  } else {
                    eventRowRefs.current.delete(event.id);
                  }
                }}
                data-event-row={event.id}
                onClick={() => setExpandedEventId(isOpen ? null : event.id)}
                className="flex w-full scroll-mt-16 items-center gap-3 px-4 py-3 text-left transition-colors active:bg-[color-mix(in_srgb,var(--color-gold-primary)_7%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-primary)]"
                aria-label={`${title} ${isOpen ? copy.close : copy.open}`}
                aria-expanded={isOpen}
                aria-controls={`mobile-event-detail-${event.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-5 text-gray-900 truncate">{title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold" style={{ color: "var(--color-gold-deep)" }}>{displayPrice.toLocaleString()}원</span>
                      {normalPrice > 0 && <span className="line-through text-xs text-gray-400">{normalPrice.toLocaleString()}원</span>}
                    </div>
                    <VatBadge />
                  </div>
                </div>

                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-all"
                  style={{
                    borderColor: "var(--color-gold-light)",
                    color: "var(--color-gold-deep)",
                    background: "color-mix(in srgb, var(--color-gold-primary) 8%, transparent)",
                  }}
                  aria-hidden="true"
                >
                  <span
                    data-testid={`mobile-event-expand-indicator-${event.id}`}
                    data-expanded={isOpen}
                    aria-hidden="true"
                    className={`event-mobile-entry__indicator inline-flex transition-transform duration-300 ease-out motion-reduce:transition-none ${isOpen ? "is-expanded rotate-180" : ""}`}
                  >
                    <ChevronDown size={16} strokeWidth={2.25} />
                  </span>
                </span>
              </button>

              <EventInlineDetail event={event} isOpen={isOpen} getLocalizedText={getLocalizedText} onFooterClose={() => handleFooterClose(event.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
