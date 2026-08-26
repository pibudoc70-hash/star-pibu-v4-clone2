import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { withVersion } from "@/lib/imageUrl";
import type { SpecialEvent, PriceRow } from "@/hooks/useLocalizedEvent";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";

export type EventCardVariant = "lead" | "compact" | "legacy" | "selector";

interface EventCardProps {
  event: SpecialEvent;
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
  variant?: EventCardVariant;
  alwaysExpanded?: boolean;
  isSelected?: boolean;
  onPreview?: () => void;
  previewPanelId?: string;
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
      <h3 className="event-card__title font-normal leading-tight mb-2">
        {getLocalizedText(event, "title")}
      </h3>
      <p className="event-card__subtitle leading-relaxed mb-3">
        {getLocalizedText(event, "subtitle")}
      </p>
      {showProductLabel && (priceRows.length > 0 ? (
        <p className="event-card__product-label font-medium mb-4">{priceRows[0].label}</p>
      ) : (
        event.productName && (
          <p className="event-card__product-label font-medium mb-4">
            {getLocalizedText(event, "productName")}
          </p>
        )
      ))}
      <div className="flex items-center gap-2 flex-wrap mb-0">
        <div className="flex items-baseline gap-2">
          <span className="event-card__discount-price font-bold">
            {displayPrice.discountPrice.toLocaleString()}원
          </span>
          {displayPrice.normalPrice > 0 && (
            <span className="event-card__normal-price line-through">
              {displayPrice.normalPrice.toLocaleString()}원
            </span>
          )}
        </div>
        {showVat && (
          <span className="event-card__vat-badge inline-flex items-center px-1.5 py-0.5 rounded font-medium">
            VAT 포함
          </span>
        )}
      </div>
    </div>
  );
}

interface EventDetailProps {
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
  showCollapse?: boolean;
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
  showCollapse = true,
}: EventDetailProps) {
  return (
    <div
      id={detailId}
      role={compact ? "region" : undefined}
      aria-label={compact ? `${title} 상세 내용` : undefined}
      className={compact
        ? "event-card__compact-detail border-t border-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)] px-4 py-4"
        : "event-card__content flex flex-1 flex-col"}
    >
      {priceRows.length > 1 && (
        <div className="mb-4 space-y-3">
          {priceRows.slice(1).map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4">
              <p className="event-card__extra-label text-xs font-semibold">{row.label}</p>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                <div className="flex items-baseline gap-1.5">
                  <p className="event-card__discount-price event-card__discount-price--row font-bold">
                    {row.discountPrice.toLocaleString()}원
                  </p>
                  {row.normalPrice > 0 && (
                    <p className="event-card__normal-price event-card__normal-price--row line-through">
                      {row.normalPrice.toLocaleString()}원
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {event.desc && <p className="event-card__details mb-3 text-xs whitespace-pre-wrap leading-relaxed">{event.desc}</p>}
      {event.content && <p className="event-card__details mb-4 text-xs whitespace-pre-wrap leading-relaxed">{event.content}</p>}
      <div className={`gap-2.5 mb-3 ${hideLinksOnMobile ? "hidden md:flex" : "flex"}`}>
        <a
          href={chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="event-card__consult-link flex-1 px-4 py-2.5 font-semibold rounded-xl transition-opacity duration-200 text-center hover:opacity-85"
          style={{ background: chatBg, color: chatColor }}
        >
          {chatLabel}
        </a>
        <a
          href={phoneHref}
          className="event-card__consult-link event-card__consult-link--phone flex-1 px-4 py-2.5 font-medium rounded-xl transition-opacity duration-200 text-center hover:opacity-85"
        >
          {phoneLabel}
        </a>
      </div>
      {showCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          aria-expanded="true"
          aria-controls={detailId}
          aria-label={`${title} 접기`}
          className="event-card__collapse w-full py-2.5 font-medium rounded-xl transition-colors text-sm"
        >
          접기
        </button>
      )}
    </div>
  );
}

interface VariantCardProps extends Omit<EventCardProps, "variant"> {
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
  showCollapse?: boolean;
}

function LeadEventCard({
  event,
  getLocalizedText,
  priceRows,
  displayPrice,
  isExpanded,
  onToggle,
  title,
  chatUrl,
  chatBg,
  chatColor,
  chatLabel,
  phoneHref,
  phoneLabel,
  showCollapse,
  previewPanelId,
}: VariantCardProps) {
  const detailId = `special-event-detail-${event.id}`;

  return (
    <article id={previewPanelId} className="card card--event flex flex-col overflow-hidden">
      {event.imageUrl && (
        <div className="event-card__media event-card__media--lead event-card__media--hoverable overflow-hidden bg-gray-100">
          <OptimizedImage
            src={withVersion(event.imageUrl, event.updatedAt instanceof Date ? event.updatedAt.getTime() : event.updatedAt)}
            alt={title}
            className="event-card__media-image w-full h-full object-cover"
            width={800}
            height={533}
            priority={false}
          />
        </div>
      )}
      <div className="event-card__content flex flex-1 flex-col">
        <EventCardHeader
          event={event}
          priceRows={priceRows}
          displayPrice={displayPrice}
          getLocalizedText={getLocalizedText}
          showProductLabel={false}
          showVat={false}
        />
        {!isExpanded && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded="false"
            aria-controls={detailId}
            aria-label={`${title} 자세히 보기`}
            className="event-card__lead-toggle mt-5 w-fit text-sm font-semibold underline-offset-4 transition-colors hover:text-[var(--color-gold-deep)] hover:underline"
          >
            {event.cta}
          </button>
        )}
      </div>
      {isExpanded && (
        <EventDetail
          event={event}
          title={title}
          priceRows={priceRows}
          chatUrl={chatUrl}
          chatBg={chatBg}
          chatColor={chatColor}
          chatLabel={chatLabel}
          phoneHref={phoneHref}
          phoneLabel={phoneLabel}
          detailId={detailId}
          onCollapse={onToggle}
          showCollapse={showCollapse}
        />
      )}
    </article>
  );
}

function CompactEventRow({
  event,
  priceRows,
  displayPrice,
  isExpanded,
  onToggle,
  title,
  chatUrl,
  chatBg,
  chatColor,
  chatLabel,
  phoneHref,
  phoneLabel,
}: VariantCardProps) {
  const detailId = `special-event-compact-detail-${event.id}`;

  return (
    <article className="event-card__compact">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`special-event-compact-detail-${event.id}`}
        aria-label={`${title} 상세 ${isExpanded ? "접기" : "펼치기"}`}
        className="event-card__compact-row flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--color-gold-primary)_8%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-gold-primary)]"
      >
        <span className="min-w-0 truncate text-sm font-semibold text-[var(--brand-text)]">{title}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="event-card__discount-price text-base font-bold">{displayPrice.discountPrice.toLocaleString()}원</span>
          {displayPrice.normalPrice > 0 && (
            <span className="event-card__normal-price line-through">{displayPrice.normalPrice.toLocaleString()}원</span>
          )}
          <ChevronDown
            aria-hidden="true"
            size={16}
            className={`text-brand-mid transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {isExpanded && (
        <EventDetail
          event={event}
          title={title}
          priceRows={priceRows}
          chatUrl={chatUrl}
          chatBg={chatBg}
          chatColor={chatColor}
          chatLabel={chatLabel}
          phoneHref={phoneHref}
          phoneLabel={phoneLabel}
          detailId={detailId}
          onCollapse={onToggle}
          compact
        />
      )}
    </article>
  );
}

interface SelectorEventRowProps extends Omit<VariantCardProps, "isExpanded" | "onToggle"> {
  isSelected: boolean;
  onPreview: () => void;
  previewPanelId?: string;
}

function SelectorEventRow({
  event,
  displayPrice,
  title,
  isSelected,
  onPreview,
  previewPanelId,
}: SelectorEventRowProps) {
  return (
    <button
      type="button"
      onClick={onPreview}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      aria-pressed={isSelected}
      aria-controls={previewPanelId}
      className={`event-card__selector-row flex min-h-14 w-full items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--color-gold-primary)_20%,transparent)] px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-gold-primary)] ${isSelected ? "event-card__selector-row--selected bg-[color-mix(in_srgb,var(--color-gold-primary)_18%,transparent)] text-[var(--color-gold-deep)]" : "hover:bg-[color-mix(in_srgb,var(--color-gold-primary)_10%,transparent)] hover:text-[var(--color-gold-deep)]"}`}
    >
      <span className="min-w-0 truncate text-sm font-semibold text-[var(--brand-text)]">{title}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="event-card__discount-price text-base font-bold">{displayPrice.discountPrice.toLocaleString()}원</span>
        {displayPrice.normalPrice > 0 && (
          <span className="event-card__normal-price line-through">{displayPrice.normalPrice.toLocaleString()}원</span>
        )}
        <ChevronRight aria-hidden="true" size={16} className="text-brand-mid" />
      </span>
    </button>
  );
}

function LegacyEventCard({
  event,
  getLocalizedText,
  priceRows,
  displayPrice,
  isExpanded,
  onToggle,
  title,
  chatUrl,
  chatBg,
  chatColor,
  chatLabel,
  phoneHref,
  phoneLabel,
}: VariantCardProps) {
  const detailId = `special-event-detail-${event.id}`;

  return (
    <div className="flex flex-col overflow-hidden card card--event">
      {event.imageUrl && (
        <div className={`event-card__media event-card__media--hoverable overflow-hidden bg-gray-100 ${isExpanded ? "block" : "hidden md:block"}`}>
          <OptimizedImage
            src={withVersion(event.imageUrl, event.updatedAt instanceof Date ? event.updatedAt.getTime() : event.updatedAt)}
            alt={title}
            className="event-card__media-image w-full h-full object-cover"
            width={800}
            height={533}
            priority={false}
          />
        </div>
      )}
      {!isExpanded ? (
        <div className="event-card__content flex flex-col flex-1">
          <EventCardHeader event={event} priceRows={priceRows} displayPrice={displayPrice} getLocalizedText={getLocalizedText} />
          <div className="event-card__divider my-4" />
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={false}
            aria-controls={detailId}
            aria-label={`${title} 자세히 보기`}
            className="event-card__toggle mt-auto w-full py-3 font-semibold transition-all duration-300 rounded-xl hover:bg-[#F0EAE0] hover:-translate-y-0.5"
          >
            {event.cta}
          </button>
        </div>
      ) : (
        <>
          <div className="event-card__content flex flex-col flex-1">
            <EventCardHeader event={event} priceRows={priceRows} displayPrice={displayPrice} getLocalizedText={getLocalizedText} />
            <div className="event-card__divider my-4" />
          </div>
          <EventDetail
            event={event}
            title={title}
            priceRows={priceRows}
            chatUrl={chatUrl}
            chatBg={chatBg}
            chatColor={chatColor}
            chatLabel={chatLabel}
            phoneHref={phoneHref}
            phoneLabel={phoneLabel}
            detailId={detailId}
            onCollapse={onToggle}
            hideLinksOnMobile
          />
        </>
      )}
    </div>
  );
}

export default function EventCard({
  event,
  getLocalizedText,
  variant = "legacy",
  alwaysExpanded = false,
  isSelected = false,
  onPreview,
  previewPanelId,
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { lang } = useLang();
  const { chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();
  const priceRows = parsePriceRows(event);
  const displayPrice = getDisplayPrice(event, priceRows);
  const title = getLocalizedText(event, "title");
  const chatLabel = isZH ? "微信和我联系" : isJA ? "LINEで相談" : lang === "en" ? "Chat Consultation" : "카카오 상담";
  const phoneHref = lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300";
  const phoneLabel = lang === "ko" ? "051-818-2300" : "+82-51-818-2300";
  const effectiveExpanded = alwaysExpanded || isExpanded;
  const sharedProps: VariantCardProps = {
    event,
    getLocalizedText,
    priceRows,
    displayPrice,
    isExpanded: effectiveExpanded,
    onToggle: alwaysExpanded ? () => undefined : () => setIsExpanded((previous) => !previous),
    title,
    chatUrl,
    chatBg,
    chatColor,
    chatLabel,
    phoneHref,
    phoneLabel,
    showCollapse: !alwaysExpanded,
    previewPanelId,
  };

  if (variant === "lead") return <LeadEventCard {...sharedProps} />;
  if (variant === "compact") return <CompactEventRow {...sharedProps} />;
  if (variant === "selector") {
    return <SelectorEventRow {...sharedProps} isSelected={isSelected} onPreview={onPreview ?? (() => undefined)} previewPanelId={previewPanelId} />;
  }
  return <LegacyEventCard {...sharedProps} />;
}
