import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

const DISMISS_KEY = "star-ulthera-thermage-promo-dismissed";
const SHOW_DELAY_MS = 700;

export const ULTHERA_THERMAGE_PROMOTIONS = {
  desktopImage: "/manus-storage/ulthera-thermage-promo-desktop_0ef841e8.jpg",
  mobileImage: "/manus-storage/ulthera-thermage-promo-mobile_52b2f894.jpg",
  ultheraUrl: "https://starpibuclinic.cafe24.com/event/ulthera",
  thermageUrl: "https://starpibuclinic.cafe24.com/event/thermage",
} as const;

function getNextLocalMidnight() {
  const expiry = new Date();
  expiry.setHours(24, 0, 0, 0);
  return expiry;
}

export default function UltheraThermagePromotionPopup() {
  const [visible, setVisible] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) return;
    if (dismissedUntil) localStorage.removeItem(DISMISS_KEY);

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
    if (hideToday) localStorage.setItem(DISMISS_KEY, getNextLocalMidnight().toISOString());
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
        className="relative w-full max-w-[420px] overflow-hidden rounded-[1.25rem] border border-[rgba(215,181,92,0.76)] bg-[var(--color-star-navy)] shadow-[0_22px_70px_rgba(0,0,0,0.45)] md:max-w-[960px]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={dismiss}
          aria-label="닫기"
          className="absolute right-3 top-3 z-20 flex size-11 items-center justify-center rounded-full border border-white/35 bg-[rgba(10,18,40,0.86)] text-white shadow-lg transition-colors hover:bg-[var(--color-star-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-star-navy)]"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="relative">
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

        <div className="flex min-h-14 items-center border-t border-white/20 bg-[var(--color-star-navy)] px-4 py-2.5">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-1.5 text-xs font-medium text-white/80 focus-within:ring-2 focus-within:ring-[var(--color-gold-primary)]">
            <input
              type="checkbox"
              checked={hideToday}
              onChange={(event) => setHideToday(event.target.checked)}
              className="sr-only"
            />
            <span className={`flex size-5 items-center justify-center rounded border ${hideToday ? "border-[var(--color-gold-primary)] bg-[var(--color-gold-primary)] text-[var(--color-star-navy)]" : "border-white/55"}`} aria-hidden="true">
              {hideToday && <Check size={14} strokeWidth={3} />}
            </span>
            오늘은 보지 않음
          </label>
        </div>
      </section>
    </div>
  );
}
