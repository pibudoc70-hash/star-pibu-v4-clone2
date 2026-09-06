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
    vatIncluded: "VAT 포함",
  },
  en: {
    hint: "Tap an event to view its details and pricing.",
    open: "View details",
    close: "Close details",
    detail: "details",
    pricing: "Pricing",
    treatment: "Treatment",
    vatIncluded: "VAT included",
  },
  ja: {
    hint: "イベントをタップすると、詳細と料金をご確認いただけます。",
    open: "詳細を見る",
    close: "詳細を閉じる",
    detail: "詳細",
    pricing: "料金案内",
    treatment: "施術",
    vatIncluded: "VAT込み",
  },
  zh: {
    hint: "点击活动即可查看详情和价格。",
    open: "查看详情",
    close: "收起详情",
    detail: "详情",
    pricing: "价格说明",
    treatment: "治疗项目",
    vatIncluded: "含 VAT",
  },
  "zh-TW": {
    hint: "點選活動即可查看詳細內容與價格。",
    open: "查看詳細",
    close: "收起詳細",
    detail: "詳細",
    pricing: "價格說明",
    treatment: "療程",
    vatIncluded: "含 VAT",
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

export const MOBILE_PRIORITY_EVENT_IDS = [300001, 360001, 10560001] as const;

export function orderMobileSpecialEvents(events: SpecialEvent[]) {
  const priority = new Map<number, number>(MOBILE_PRIORITY_EVENT_IDS.map((id, index) => [id, index]));
  const fallbackPriority = MOBILE_PRIORITY_EVENT_IDS.length;

  return [...events].sort((left, right) => {
    const leftPriority = priority.get(left.id) ?? fallbackPriority;
    const rightPriority = priority.get(right.id) ?? fallbackPriority;
    return leftPriority - rightPriority || left.sortOrder - right.sortOrder || left.id - right.id;
  });
}

interface EventInlineDetailProps {
  event: SpecialEvent;
  isOpen: boolean;
  getLocalizedText: EventTableMobileProps["getLocalizedText"];
  onFooterClose: (eventId: number) => void;
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
        <div className="event-mobile-detail__body border-t border-gray-100 bg-white px-4 pt-1.5 pb-4">
          <div className="mb-1.5">
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
              onClick={() => onFooterClose(event.id)}
              className="min-h-11 min-w-28 rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors active:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)]"
              aria-label={`${title} ${copy.close}`}
            >
              {copy.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventTableMobile({ events, getLocalizedText }: EventTableMobileProps) {
  const { lang } = useLang();
  const copy = MOBILE_EVENT_COPY[lang];
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const eventRowRefs = useRef(new Map<number, HTMLButtonElement>());
  const orderedEvents = orderMobileSpecialEvents(events);

  const handleFooterClose = (eventId: number) => {
    setExpandedEventId(null);

    requestAnimationFrame(() => {
      eventRowRefs.current.get(eventId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const registerEventRow = (eventId: number) => (node: HTMLButtonElement | null) => {
    if (node) {
      eventRowRefs.current.set(eventId, node);
    } else {
      eventRowRefs.current.delete(eventId);
    }
  };

  return (
    <>
      {orderedEvents.length > 0 && <div
      data-testid="mobile-event-regular-list"
      className="overflow-hidden rounded-[1.25rem] border shadow-[0_16px_36px_rgba(10,18,40,0.06)]"
      style={{
        borderColor: "var(--color-gold-light)",
        background: "var(--brand-bg-card, #FDFAF7)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3.5 border-b"
        style={{
          borderColor: "var(--color-gold-light)",
          background: "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-gold-primary) 4%, transparent) 100%)",
        }}
      >
        <Sparkles size={14} style={{ color: "var(--color-gold-primary)" }} />
        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: "var(--color-gold-primary)" }}>Special Event</span>
        <span data-testid="mobile-event-vat-notice" className="ml-auto rounded-full border px-2 py-1 text-[10px] font-semibold" style={{ borderColor: "color-mix(in srgb, var(--color-gold-primary) 38%, transparent)", color: "var(--color-gold-deep)", background: "color-mix(in srgb, var(--color-gold-primary) 9%, transparent)" }}>{copy.vatIncluded}</span>
      </div>

      <div data-testid="mobile-event-list" className="bg-white">
        <p data-testid="mobile-event-detail-hint" className="border-b px-4 py-3 text-[11px] leading-relaxed text-stone-500" style={{ borderColor: "var(--color-gold-light)" }}>
          {copy.hint}
        </p>
        {orderedEvents.map((event, index) => {
          const priceRows = parsePriceRows(event);
          const displayPrice = priceRows.length > 0 ? priceRows[0].discountPrice : event.discountPrice;
          const normalPrice = priceRows.length > 0 ? priceRows[0].normalPrice : event.normalPrice;
          const title = getLocalizedText(event, "title");
          const isOpen = expandedEventId === event.id;
          const priorityIndex = MOBILE_PRIORITY_EVENT_IDS.findIndex((priorityId) => priorityId === event.id);
          const isPriority = priorityIndex !== -1;

          return (
            <div
              key={event.id}
              data-testid={`mobile-event-entry-${event.id}`}
              data-priority={isPriority ? priorityIndex + 1 : undefined}
              className={`event-mobile-entry overflow-hidden bg-white transition-colors ${index > 0 ? "border-t" : ""} ${isPriority ? "bg-[color-mix(in_srgb,var(--color-gold-primary)_3%,white)]" : ""}`}
              style={index > 0 ? { borderColor: "var(--color-gold-light)" } : undefined}
            >
              <button
                type="button"
                ref={registerEventRow(event.id)}
                data-testid={`mobile-event-row-${event.id}`}
                data-event-row={event.id}
                onClick={() => setExpandedEventId(isOpen ? null : event.id)}
                className={`flex w-full scroll-mt-16 items-center px-4 text-left transition-colors active:bg-[color-mix(in_srgb,var(--color-gold-primary)_7%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-primary)] ${isPriority ? "!h-auto !min-h-[5rem] !py-4" : "!h-auto !min-h-[4.75rem] !py-3.5"}`}
                aria-label={`${title} ${isOpen ? copy.close : copy.open}`}
                aria-expanded={isOpen}
                aria-controls={`mobile-event-detail-${event.id}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                  <p className={`min-w-0 font-semibold leading-5 text-gray-900 truncate ${isPriority ? "text-[15px]" : "text-sm"}`}>{title}</p>
                  </div>
                </div>
                <div data-testid={`mobile-event-price-${event.id}`} className="flex w-32 shrink-0 items-baseline justify-end gap-1 whitespace-nowrap text-right tabular-nums">
                    <span className="text-sm font-bold" style={{ color: "var(--color-gold-deep)" }}>{displayPrice.toLocaleString()}원</span>
                    {normalPrice > 0 && <span className="line-through text-xs text-gray-400">{normalPrice.toLocaleString()}원</span>}
                </div>
                <span
                  data-testid={`mobile-event-expand-indicator-${event.id}`}
                  data-expanded={isOpen}
                  aria-hidden="true"
                  className={`ml-2 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-gold-light)] text-[var(--color-gold-deep)] transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={14} strokeWidth={2.25} />
                </span>
              </button>

              <EventInlineDetail event={event} isOpen={isOpen} getLocalizedText={getLocalizedText} onFooterClose={handleFooterClose} />
            </div>
          );
        })}
      </div>
      </div>}
    </>
  );
}
