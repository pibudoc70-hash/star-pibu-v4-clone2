/**
 * FacilitySection - 시설 갤러리
 * 디자인: PC(md 이상) - 3개×2행 가로 긴 그리드, 모바일(md 미만) - 슬라이드 캐러셀
 * 기능: 반응형 레이아웃 + 자동 슬라이드(모바일만) + 터치 스와이프(모바일만) + 라이트박스
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";

const galleryImageSrcs = [
  { srcWebP: "/api/storage/metaview_room_535d3491.jpg", srcJPG: "/api/storage/metaview_room_535d3491.jpg" },
  { srcWebP: "/api/storage/waiting_room_ce355737.jpg", srcJPG: "/api/storage/waiting_room_ce355737.jpg" },
  { srcWebP: "/api/storage/multi_skincare_room_ebebe73e.jpg", srcJPG: "/api/storage/multi_skincare_room_ebebe73e.jpg" },
  { srcWebP: "/api/storage/laser_corridor_9e114a15.jpg", srcJPG: "/api/storage/laser_corridor_9e114a15.jpg" },
  { srcWebP: "/api/storage/reception_desk_f4dd56dc.jpg", srcJPG: "/api/storage/reception_desk_f4dd56dc.jpg" },
  { srcWebP: "/api/storage/reception_desk_02_1fe4bedc.jpg", srcJPG: "/api/storage/reception_desk_02_1fe4bedc.jpg" },
];

// PC 버전용 제목 (사용자 요청대로)
const pcCardTitles = [
  "메타뷰촬영실",
  "피부대기실",
  "다인피부관리실",
  "레이저실 복도",
  "안내데스크",
  "안내데스크",
];

const highlights = [
  { num: "50+" },
  { num: "3인" },
  { num: "2·4층" },
  { num: "전체" },
];

export default function FacilitySection() {
  const sectionRef = useSectionReveal(70);
  const { t } = useLang();
  const fc = t.facility;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [canAutoPlay, setCanAutoPlay] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const galleryImages = galleryImageSrcs.map((src, i) => ({
    ...src,
    label: fc.images[i]?.label ?? "",
    desc: fc.images[i]?.desc ?? "",
  }));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateAutoPlayAvailability = () => {
      setCanAutoPlay(mobileQuery.matches && !reducedMotionQuery.matches);
    };

    updateAutoPlayAvailability();
    mobileQuery.addEventListener("change", updateAutoPlayAvailability);
    reducedMotionQuery.addEventListener("change", updateAutoPlayAvailability);
    return () => {
      mobileQuery.removeEventListener("change", updateAutoPlayAvailability);
      reducedMotionQuery.removeEventListener("change", updateAutoPlayAvailability);
    };
  }, []);

  // 자동 슬라이드 (모바일에서만)
  useEffect(() => {
    if (!canAutoPlay || !isAutoPlay || isHovering) {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
    };
  }, [canAutoPlay, isAutoPlay, isHovering, galleryImages.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxDialogRef = useRef<HTMLDivElement>(null);

  const openLightbox = (i: number, btn: HTMLButtonElement) => {
    triggerBtnRef.current = btn;
    setLightboxIndex(i);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // A11y: focus trap, ESC 닫기, 스크롤 잠금과 trigger focus 복원
  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => lightboxCloseRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = lightboxDialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => triggerBtnRef.current?.focus());
    };
  }, [lightboxIndex, closeLightbox]);

  return (
    <section ref={sectionRef} id="facility" className="py-16 sm:py-24 scroll-mt-24 md:scroll-mt-28" aria-label="클리닉 시설 갤러리">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 reveal-heading">
          <span className="section-eyebrow">{fc.sectionTitle}</span>
          <h2 className="section-title mb-4">{fc.sectionSubtitle}</h2>
          <div className="star-divider mx-auto mb-6" />
          {fc.highlights[0] && (
            <p className="section-subtitle">
              {fc.highlights.map((h) => h.label).join("・")}
            </p>
          )}
        </div>



        {/* PC VERSION: 3x2 Grid Layout with Wide Cards (md and above) */}
        <div className="hidden md:grid grid-cols-3 gap-4 reveal-card">
          {galleryImages.map((img, i) => (
            <button type="button"
              key={i}
              onClick={(e) => openLightbox(i, e.currentTarget)}
              className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer text-left facility-grid-thumb"
              aria-label={`${img.label} ${fc.zoomHint}`}
            >
              <OptimizedImage
                src={img.srcJPG}
                alt={img.label}
                className="w-full h-full object-cover"
                width={800}
                height={450}
              />
              {/* Dark Overlay */}
              <div
                className="absolute inset-0 facility-dark-overlay"
              />
              {/* Content Overlay - Title Only */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                <h3
                  className="font-normal facility-img-label"
                >
                  {img.label}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* MOBILE VERSION: Carousel Layout (below md) */}
        <div className="md:hidden reveal-card">
          {/* Carousel Container */}
          <div
            className="relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl w-full facility-carousel-wrap"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slides */}
            <div className="relative w-full h-full">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{ opacity: i === currentIndex ? 1 : 0 } as React.CSSProperties}
                >
                    <OptimizedImage
                      src={img.srcJPG}
                      alt={img.label}
                      className="w-full h-full object-cover"
                      width={800}
                      height={450}
                    />
                  {/* Dark Overlay */}
                  <div
                    className="absolute inset-0 facility-dark-overlay"
                  />
                </div>
              ))}
            </div>

            {/* Content Overlay - Title Only */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
              <div className="max-w-2xl">
                <h3
                  className="text-2xl sm:text-4xl font-normal text-white"
                >
                  {galleryImages[currentIndex].label}
                </h3>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button type="button"
              onClick={goPrev}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto facility-nav-btn"
              aria-label={fc.prevSlideLabel}
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            <button type="button"
              onClick={goNext}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto facility-nav-btn"
              aria-label={fc.nextSlideLabel}
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            {/* Play/Pause Button */}
            <button type="button"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto facility-nav-btn"
              aria-label={isAutoPlay ? fc.pauseAutoplayLabel : fc.playAutoplayLabel}
            >
              {isAutoPlay ? (
                <Pause size={18} className="text-white" />
              ) : (
                <Play size={18} className="text-white" />
              )}
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-auto">
              {galleryImages.map((_, i) => (
                <button type="button"
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === currentIndex ? "10px" : "8px",
                    height: i === currentIndex ? "10px" : "8px",
                    minWidth: i === currentIndex ? "10px" : "8px",
                    minHeight: i === currentIndex ? "10px" : "8px",
                    maxWidth: i === currentIndex ? "10px" : "8px",
                    maxHeight: i === currentIndex ? "10px" : "8px",
                    borderRadius: "50%",
                    background: i === currentIndex ? "#C9A961" : "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    padding: 0,
                    border: "none",
                    flexShrink: 0,
                    display: "block",
                  }}
                  aria-label={fc.goToSlideLabel.replace("{n}", String(i + 1))}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip (Mobile) - Fixed overflow issue */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 px-2">
            {galleryImages.map((img, i) => (
              <button type="button"
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="relative overflow-hidden rounded-lg transition-all duration-300 flex-shrink-0"
                style={{
                  width: "80px",
                  height: "60px",
                  opacity: i === currentIndex ? 1 : 0.5,
                  border: i === currentIndex ? "2px solid #C9A961" : "1px solid #E5E7EB",
                }}
              >
                <OptimizedImage
                  src={img.srcJPG}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  width={800}
                  height={450}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox Modal (PC Only) */}
        {lightboxIndex !== null && (
          <div
            ref={lightboxDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={fc.zoomHint}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          >
            <div aria-hidden="true" className="absolute inset-0" onClick={closeLightbox} />
            <div
              className="relative max-w-4xl w-full"
            >
              {/* Close Button */}
              <button type="button"
                ref={lightboxCloseRef}
                onClick={closeLightbox}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                 aria-label={fc.closeLightboxLabel}
              >
                <X size={32} />
              </button>

              {/* Image */}
                <OptimizedImage
                  src={galleryImageSrcs[lightboxIndex].srcJPG}
                  alt={pcCardTitles[lightboxIndex]}
                  className="w-full h-auto rounded-lg"
                  width={1200}
                  height={675}
                />

              {/* Title */}
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-normal">
                  {galleryImages[lightboxIndex].label}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
