import { useState } from "react";
import OptimizedImage from "@/components/OptimizedImage";
import { withVersion } from "@/lib/imageUrl";
import type { SpecialEvent, PriceRow } from "@/hooks/useLocalizedEvent";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";

export type EventCardVariant = "lead" | "compact" | "legacy";

interface EventCardProps {
  event: SpecialEvent;
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
  variant?: EventCardVariant;
}

type DisplayPrice = { normalPrice: number; discountPrice: number };

function parsePriceRows(event: SpecialEvent): PriceRow[] {
  if (!event.priceRows) return [];

  try {
    return JSON.parse(event.priceRows) as PriceRow[];
  } catch {
    return [];
  }
}

function getDisplayPrice(event: SpecialEvent, priceRows: PriceRow[]): DisplayPrice {
  return priceRows.length > 0
    ? { normalPrice: priceRows[0].normalPrice, discountPrice: priceRows[0].discountPrice }
    : { normalPrice: event.normalPrice, discountPrice: event.discountPrice };
}

interface EventCardHeaderProps {
  event: SpecialEvent;
  priceRows: PriceRow[];
  displayPrice: DisplayPrice;
  getLocalizedText: EventCardProps["getLocalizedText"];
  showProductLabel?: boolean;
  showVat?: boolean;
}

function EventCardHeader({
  event,
  priceRows,
  displayPrice,
  getLocalizedText,
  showProductLabel = true,
  showVat = true,
}: EventCardHeaderProps) {
  return (
    <div className="flex flex-col">
      <h3 className="event-card__title mb-2 font-normal leading-tight">{getLocalizedText(event, "title")}</h3>
      <p className="event-card__subtitle mb-3 leading-relaxed">{getLocalizedText(event, "subtitle")}</p>

      {showProductLabel && (priceRows.length > 0 ? (
        <p className="event-card__product-label mb-4 font-medium">{priceRows[0].label}</p>
      ) : (
        event.productName && <p className="event-card__product-label mb-4 font-medium">{getLocalizedText(event, "productName")}</p>
      ))}

      <div className="mb-0 flex flex-wrap items-center gap-2">
        <div className="flex items-baseline gap-2">
          <span className="event-card__discount-price font-bold">{displayPrice.discountPrice.toLocaleString()}원</span>
          {displayPrice.normalPrice > 0 && <span className="event-card__normal-price line-through">{displayPrice.normalPrice.toLocaleString()}원</span>}
        </div>
        {showVat && <span className="event-card__vat-badge inline-flex items-center rounded px-1.5 py-0.5 font-medium">VAT 포함</span>}
      </div>
    </div>
  );
}

interface DetailProps {
  event: SpecialEvent;
  title: string;
  priceRows: PriceRow[];
  chatUrl: string;
  chatBg: string;
  chatColor: string;
  chatLabel: string;
  phoneHref: string;
  phoneLabel: string;
  detailId: string;
  onCollapse: () => void;
  compact?: boolean;
  hideLinksOnMobile?: boolean;
}

function EventDetail({
  event,
  title,
  priceRows,
  chatUrl,
  chatBg,
  chatColor,
  chatLabel,
  phoneHref,
  phoneLabel,
  detailId,
  onCollapse,
  compact = false,
  hideLinksOnMobile = false,
}: DetailProps) {
  return (
    <div id={detailId} className={compact ? "event-card__compact-detail border-t border-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)] px-4 py-4" : "event-card__content flex flex-1 flex-col"}>
      {priceRows.length > 1 && (
        <div className="mb-4 space-y-3">
          {priceRows.slice(1).map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4">
              <p className="event-card__extra-label text-xs font-semibold">{row.label}</p>
              <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2">
                <div className="flex items-baseline gap-1.5">
                  <p className="event-card__discount-price event-card__discount-price--row font-bold">{row.discountPrice.toLocaleString()}원</p>
                  {row.normalPrice > 0 && <p className="event-card__normal-price event-card__normal-price--row line-through">{row.normalPrice.toLocaleString()}원</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {event.desc && <p className="event-card__details mb-3 whitespace-pre-wrap text-xs leading-relaxed">{event.desc}</p>}
      {event.content && <p className="event-card__details mb-4 whitespace-pre-wrap text-xs leading-relaxed">{event.content}</p>}

      <div className={`mb-3 gap-2.5 ${hideLinksOnMobile ? "hidden md:flex" : "flex"}`}>
        <a href={chatUrl} target="_blank" rel="noopener noreferrer" className="event-card__consult-link flex-1 rounded-xl px-4 py-2.5 text-center font-semibold transition-opacity duration-200 hover:opacity-85" style={{ background: chatBg, color: chatColor }}>
          {chatLabel}
        </a>
        <a href={phoneHref} className="event-card__consult-link event-card__consult-link--phone flex-1 rounded-xl px-4 py-2.5 text-center font-medium transition-opacity duration-200 hover:opacity-85">
          {phoneLabel}
        </a>
      </div>

      <button type="button" onClick={onCollapse} aria-expanded="true" aria-controls={detailId} aria-label={`${title} 접기`} className="event-card__collapse w-full rounded-xl py-2.5 text-sm font-medium transition-colors">
        접기
      </button>
    </div>
  );
}

interface LeadEventCardProps extends Omit<EventCardProps, "variant"> {
  priceRows: PriceRow[];
  displayPrice: DisplayPrice;
  isExpanded: boolean;
  onToggle: () => void;
  title: string;
  chatUrl: string;
  chatBg: string;
  chatColor: string;
  chatLabel: string;
  phoneHref: string;
  phoneLabel: string;
}

function LeadEventCard({ event, getLocalizedText, priceRows, displayPrice, isExpanded, onToggle, title, chatUrl, chatBg, chatColor, chatLabel, phoneHref, phoneLabel }: LeadEventCardProps) {
  const detailId = `special-event-detail-${event.id}`;

  return (
    <article className="card card--event flex overflow-hidden">
      <div className="w-5/12 shrink-0">
        {event.imageUrl && <div className="event-card__media event-card__media--hoverable event-card__media--lead overflow-hidden bg-gray-100"><OptimizedImage src={withVersion(event.imageUrl, event.updatedAt instanceof Date ? event.updatedAt.getTime() : event.updatedAt)} alt={title} className="event-card__media-image h-full w-full object-cover" width={800} height={533} priority={false} /></div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="event-card__content flex flex-1 flex-col">
          <EventCardHeader event={event} priceRows={priceRows} displayPrice={displayPrice} getLocalizedText={getLocalizedText} showProductLabel={false} showVat={false} />
          <div className="event-card__divider my-4" />
          {!isExpanded && <button type="button" onClick={onToggle} aria-expanded={false} aria-controls={`special-event-detail-${event.id}`} aria-label={`${title} 자세히 보기`} className="event-card__lead-toggle mt-auto w-fit text-sm font-semibold underline-offset-4 transition-colors hover:text-[var(--color-gold-deep)] hover:underline">{event.cta}</button>}
        </div>
        {isExpanded && <EventDetail event={event} title={title} priceRows={priceRows} chatUrl={chatUrl} chatBg={chatBg} chatColor={chatColor} chatLabel={chatLabel} phoneHref={phoneHref} phoneLabel={phoneLabel} detailId={detailId} onCollapse={onToggle} />}
      </div>
    </article>
  );
}

interface CompactEventRowProps extends Omit<LeadEventCardProps, "getLocalizedText"> {}

function CompactEventRow({ event, priceRows, displayPrice, isExpanded, onToggle, title, chatUrl, chatBg, chatColor, chatLabel, phoneHref, phoneLabel }: CompactEventRowProps) {
  const detailId = `special-event-compact-detail-${event.id}`;

  return (
    <article className="event-card__compact divide-y divide-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)]">
      <button type="button" onClick={onToggle} aria-expanded={isExpanded} aria-controls={`special-event-compact-detail-${event.id}`} aria-label={`${title} 상세 ${isExpanded ? "접기" : "펼치기"}`} className="event-card__compact-row flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-gold-primary)_8%,transparent)]">
        <span className="min-w-0 truncate text-sm font-semibold text-[var(--brand-text)]">{title}</span>
        <span className="flex shrink-0 items-baseline gap-2"><span className="event-card__discount-price text-base font-bold">{displayPrice.discountPrice.toLocaleString()}원</span>{displayPrice.normalPrice > 0 && <span className="event-card__normal-price line-through">{displayPrice.normalPrice.toLocaleString()}원</span>}</span>
      </button>
      {isExpanded && <EventDetail event={event} title={title} priceRows={priceRows} chatUrl={chatUrl} chatBg={chatBg} chatColor={chatColor} chatLabel={chatLabel} phoneHref={phoneHref} phoneLabel={phoneLabel} detailId={detailId} onCollapse={onToggle} compact />}
    </article>
  );
}

function LegacyEventCard({ event, getLocalizedText, priceRows, displayPrice, isExpanded, onToggle, title, chatUrl, chatBg, chatColor, chatLabel, phoneHref, phoneLabel }: LeadEventCardProps) {
  const detailId = `special-event-detail-${event.id}`;

  return (
    <div className="card card--event flex flex-col overflow-hidden">
      {event.imageUrl && <div className={`event-card__media event-card__media--hoverable overflow-hidden bg-gray-100 ${isExpanded ? "block" : "hidden md:block"}`}><OptimizedImage src={withVersion(event.imageUrl, event.updatedAt instanceof Date ? event.updatedAt.getTime() : event.updatedAt)} alt={title} className="event-card__media-image h-full w-full object-cover" width={800} height={533} priority={false} /></div>}
      {!isExpanded ? (
        <div className="event-card__content flex flex-1 flex-col">
          <EventCardHeader event={event} priceRows={priceRows} displayPrice={displayPrice} getLocalizedText={getLocalizedText} />
          <div className="event-card__divider my-4" />
          <button type="button" onClick={onToggle} aria-expanded={false} aria-controls={detailId} aria-label={`${title} 자세히 보기`} className="event-card__toggle mt-auto w-full rounded-xl py-3 font-semibold transition-all duration-300 hover:bg-[#F0EAE0] hover:-translate-y-0.5">{event.cta}</button>
        </div>
      ) : (
        <>
          <div className="event-card__content flex flex-1 flex-col"><EventCardHeader event={event} priceRows={priceRows} displayPrice={displayPrice} getLocalizedText={getLocalizedText} /><div className="event-card__divider my-4" /></div>
          <EventDetail event={event} title={title} priceRows={priceRows} chatUrl={chatUrl} chatBg={chatBg} chatColor={chatColor} chatLabel={chatLabel} phoneHref={phoneHref} phoneLabel={phoneLabel} detailId={detailId} onCollapse={onToggle} hideLinksOnMobile />
        </>
      )}
    </div>
  );
}

export default function EventCard({ event, getLocalizedText, variant = "legacy" }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { lang } = useLang();
  const { chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const priceRows = parsePriceRows(event);
  const displayPrice = getDisplayPrice(event, priceRows);
  const title = getLocalizedText(event, "title");
  const chatLabel = isZH ? "微信和我联系" : isJA ? "LINEで相談" : lang === "en" ? "Chat Consultation" : "카카오 상담";
  const phoneHref = lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300";
  const phoneLabel = lang === "ko" ? "051-818-2300" : "+82-51-818-2300";
  const sharedProps = { event, getLocalizedText, priceRows, displayPrice, isExpanded, onToggle: () => setIsExpanded((previous) => !previous), title, chatUrl, chatBg, chatColor, chatLabel, phoneHref, phoneLabel };

  if (variant === "lead") return <LeadEventCard {...sharedProps} />;
  if (variant === "compact") return <CompactEventRow {...sharedProps} />;
  return <LegacyEventCard {...sharedProps} />;
}
