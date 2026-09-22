import { MapPin } from "lucide-react";

interface LocationLinkPanelProps {
  address: string;
  buttonLabel: string;
  href: string;
  className?: string;
}

/** A compact external-map handoff with no embedded map or provider fallback surface. */
export default function LocationLinkPanel({ address, buttonLabel, href, className = "" }: LocationLinkPanelProps) {
  return (
    <div className={`reveal-left ${className}`.trim()} data-testid="location-link-panel">
      <div className="rounded-2xl border border-[var(--color-gold-pale)] bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm leading-7 text-[var(--color-star-text)] sm:text-base">
          {address}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-star-kakao)] px-4 py-2.5 text-sm font-medium text-[#3C1E1E] transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2"
        >
          <MapPin size={16} aria-hidden="true" />
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}
