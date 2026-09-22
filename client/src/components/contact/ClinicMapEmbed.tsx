interface ClinicMapEmbedProps {
  title: string;
  className?: string;
}

export const STAR_CLINIC_LAT = 35.1572312;
export const STAR_CLINIC_LNG = 129.0581932;

/**
 * Stable, API-key-free Google Maps iframe for the shared clinic location.
 * The coordinate query displays the clinic pin without depending on Kakao SDK loading.
 */
export const GOOGLE_CLINIC_MAP_EMBED_URL =
  `https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${STAR_CLINIC_LAT},${STAR_CLINIC_LNG}!6i17`;

export default function ClinicMapEmbed({ title, className = "" }: ClinicMapEmbedProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_10px_30px_rgba(57,39,20,0.16)] ${className}`.trim()}
      data-testid="clinic-map-embed"
    >
      <iframe
        src={GOOGLE_CLINIC_MAP_EMBED_URL}
        title={title}
        className="block min-h-[360px] w-full border-0 sm:min-h-[440px] lg:h-full lg:min-h-[560px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
