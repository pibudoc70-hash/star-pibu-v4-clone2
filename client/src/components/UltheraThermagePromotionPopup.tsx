import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const SHOW_DELAY_MS = 700;

export const ULTHERA_THERMAGE_PROMOTIONS = {
  desktopImage: "/manus-storage/ulthera-thermage-promo-desktop_0ef841e8.jpg",
  mobileImage: "/manus-storage/ulthera-thermage-promo-mobile_52b2f894.jpg",
  ultheraUrl: "https://starpibuclinic.cafe24.com/event/ulthera",
  thermageUrl: "https://starpibuclinic.cafe24.com/event/thermage",
} as const;

export default function UltheraThermagePromotionPopup() {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lastFocusedRef.current = document.activeElement as HTMLElement;
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    window.requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
      lastFocusedRef.current = null;
    });
  };

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  if (!visible) return null;

  return (
    <div
      data-testid="ulthera-thermage-promotion-popup"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(5,12,28,0.72)] px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="울쎄라피 프라임 및 써마지 FLX 이벤트"
        className="ulthera-thermage-promotion-dialog relative w-full max-w-[420px] overflow-visible rounded-[1.25rem] border border-[rgba(215,181,92,0.76)] bg-[var(--color-star-navy)] shadow-[0_22px_70px_rgba(0,0,0,0.45)] md:max-w-[960px]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={dismiss}
          aria-label="닫기"
          className="absolute right-3 top-3 z-30 inline-flex size-[52px] items-center justify-center rounded-full border-2 border-white/90 bg-[var(--color-star-navy)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-[background-color,color,transform,box-shadow] duration-150 hover:bg-[var(--color-gold-primary)] hover:text-[var(--color-star-navy)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.55)] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-star-navy)] md:right-auto md:size-11 md:-right-14 md:top-0"
        >
          <X size={22} strokeWidth={2.6} aria-hidden="true" />
          <span className="sr-only">닫기</span>
        </button>

        <div className="relative overflow-hidden rounded-[1.25rem]">
          <picture>
            <source media="(min-width: 768px)" srcSet={ULTHERA_THERMAGE_PROMOTIONS.desktopImage} />
            <img
              src={ULTHERA_THERMAGE_PROMOTIONS.mobileImage}
              alt=""
              className="block h-auto w-full"
              width={800}
              height={1000}
            />
          </picture>
          <a
            data-testid="ulthera-promotion-link"
            href={ULTHERA_THERMAGE_PROMOTIONS.ultheraUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="울쎄라피 프라임 이벤트 새 탭으로 보기"
            className="absolute left-0 top-0 h-1/2 w-full focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-primary)] md:h-full md:w-1/2"
          >
            <span className="sr-only">울쎄라피 프라임 이벤트 보기</span>
          </a>
          <a
            data-testid="thermage-promotion-link"
            href={ULTHERA_THERMAGE_PROMOTIONS.thermageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="써마지 FLX 이벤트 새 탭으로 보기"
            className="absolute bottom-0 left-0 h-1/2 w-full focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-primary)] md:left-1/2 md:top-0 md:h-full md:w-1/2"
          >
            <span className="sr-only">써마지 FLX 이벤트 보기</span>
          </a>
        </div>
      </section>
    </div>
  );
}
