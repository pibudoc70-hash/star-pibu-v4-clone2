import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

export const SHOW_DELAY_MS = 0;
export const DISMISS_ANIMATION_MS = 200;
export const PROMOTION_HIDE_UNTIL_DATE_KEY = "star-pibu:ulthera-thermage-promotion-hide-date";

export function getLocalCalendarDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const ULTHERA_THERMAGE_PROMOTIONS = {
  desktopImage: "/manus-storage/ulthera-thermage-promo-desktop_0ef841e8.jpg",
  mobileImage: "/manus-storage/ulthera-thermage-promo-mobile_52b2f894.jpg",
  ultheraUrl: "https://starpibuclinic.cafe24.com/event/ulthera",
  thermageUrl: "https://starpibuclinic.cafe24.com/event/thermage",
} as const;

export default function UltheraThermagePromotionPopup() {
  const [visible, setVisible] = useState(false);
  const [hideForToday, setHideForToday] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const dismissTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const today = getLocalCalendarDateKey();
    try {
      if (window.localStorage.getItem(PROMOTION_HIDE_UNTIL_DATE_KEY) === today) return;
    } catch {
      // Storage may be unavailable in restrictive browser contexts; show the popup normally.
    }

    const timer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || isClosing) return;
    const animationFrame = window.requestAnimationFrame(() => setIsEntering(true));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [visible, isClosing]);

  useEffect(() => () => {
    if (dismissTimerRef.current !== null) window.clearTimeout(dismissTimerRef.current);
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
    if (isClosing) return;

    if (hideForToday) {
      try {
        window.localStorage.setItem(PROMOTION_HIDE_UNTIL_DATE_KEY, getLocalCalendarDateKey());
      } catch {
        // Dismissal still works when local storage is unavailable.
      }
    }
    setIsClosing(true);
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    dismissTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setIsEntering(false);
      setIsClosing(false);
      setIsCloseHovered(false);
      dismissTimerRef.current = null;
      window.requestAnimationFrame(() => {
        lastFocusedRef.current?.focus();
        lastFocusedRef.current = null;
      });
    }, prefersReducedMotion ? 0 : DISMISS_ANIMATION_MS);
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
      data-state={isClosing ? "closing" : isEntering ? "open" : "opening"}
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(5,12,28,0.72)] px-4 py-6 backdrop-blur-[2px] transition-opacity duration-200 ease-out motion-reduce:transition-none ${isClosing ? "pointer-events-none opacity-0" : isEntering ? "opacity-100" : "opacity-0"}`}
      style={{ opacity: isClosing || !isEntering ? 0 : 1 }}
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="울쎄라피 프라임 및 써마지 FLX 이벤트"
        data-state={isClosing ? "closing" : isEntering ? "open" : "opening"}
        className={`ulthera-thermage-promotion-dialog relative w-full max-w-[420px] overflow-visible rounded-[1.25rem] border border-[rgba(215,181,92,0.76)] bg-[var(--color-star-navy)] shadow-[0_22px_70px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none md:max-w-[960px] ${isClosing || !isEntering ? "scale-[0.985] opacity-0" : "scale-100 opacity-100"}`}
        style={{ opacity: isClosing || !isEntering ? 0 : 1, scale: isClosing || !isEntering ? "0.985" : "1" }}
      >
        <div data-testid="promotion-popup-controls" className="absolute bottom-3 right-3 z-30 flex items-center gap-2 md:bottom-auto md:right-auto md:-right-14 md:top-0">
          <label
            data-testid="promotion-hide-today-control"
            className="group inline-flex min-h-[52px] min-w-[178px] cursor-pointer items-center gap-2.5 rounded-[0.9rem] border border-[rgba(215,181,92,0.7)] bg-[rgba(5,12,28,0.92)] px-3.5 text-[12px] font-semibold tracking-[-0.01em] text-white shadow-[0_8px_20px_rgba(0,0,0,0.42)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-[var(--color-gold-primary)] hover:bg-[rgba(20,35,61,0.97)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.5)] active:scale-[0.98] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-gold-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-star-navy)]"
          >
            <input
              type="checkbox"
              checked={hideForToday}
              onChange={(event) => setHideForToday(event.target.checked)}
              className="peer sr-only"
            />
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-[rgba(255,255,255,0.72)] bg-white/5 text-transparent transition-[background-color,border-color,color,transform] duration-200 peer-checked:scale-105 peer-checked:border-[var(--color-gold-primary)] peer-checked:bg-[var(--color-gold-primary)] peer-checked:text-[var(--color-star-navy)]" aria-hidden="true">
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="whitespace-nowrap">오늘 하루 보지 않기</span>
          </label>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={dismiss}
            onPointerEnter={() => {
              if (window.matchMedia?.("(min-width: 768px)")?.matches) setIsCloseHovered(true);
            }}
            onPointerLeave={() => setIsCloseHovered(false)}
            disabled={isClosing}
            aria-label="닫기"
            data-testid="promotion-popup-close"
            data-hovered={isCloseHovered ? "true" : "false"}
            className="inline-flex size-[52px] items-center justify-center rounded-full border-2 border-[var(--color-gold-primary)] bg-[var(--color-star-navy)] text-white shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 md:hover:scale-105 md:hover:border-white md:hover:bg-[var(--color-gold-primary)] md:hover:text-[var(--color-star-navy)] md:hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-star-navy)] md:size-[52px]"
            style={isCloseHovered ? { backgroundColor: "#C4A882", borderColor: "#FFFFFF", color: "#2C2C2C", scale: "1.05" } : undefined}
          >
            <X size={22} strokeWidth={2.6} aria-hidden="true" />
            <span className="sr-only">닫기</span>
          </button>
        </div>

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
