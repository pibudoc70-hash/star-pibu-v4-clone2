/**
 * FacilitySection - 시설 슬라이드 캐러셀
 * 디자인: 최신 트렌드 세련된 슬라이드 형태
 * 기능: 자동 슬라이드 + 수동 네비게이션 + 터치 스와이프
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

const galleryImageSrcs = [
  { srcWebP: "/manus-storage/metaview_room_535d3491.jpg", srcJPG: "/manus-storage/metaview_room_535d3491.jpg" },
  { srcWebP: "/manus-storage/waiting_room_ce355737.jpg", srcJPG: "/manus-storage/waiting_room_ce355737.jpg" },
  { srcWebP: "/manus-storage/multi_skincare_room_ebebe73e.jpg", srcJPG: "/manus-storage/multi_skincare_room_ebebe73e.jpg" },
  { srcWebP: "/manus-storage/laser_corridor_9e114a15.jpg", srcJPG: "/manus-storage/laser_corridor_9e114a15.jpg" },
  { srcWebP: "/manus-storage/reception_desk_f4dd56dc.jpg", srcJPG: "/manus-storage/reception_desk_f4dd56dc.jpg" },
  { srcWebP: "/manus-storage/reception_desk_02_1fe4bedc.jpg", srcJPG: "/manus-storage/reception_desk_02_1fe4bedc.jpg" },
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
  const touchStartX = useRef<number | null>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const galleryImages = galleryImageSrcs.map((src, i) => ({
    ...src,
    label: fc.images[i]?.label ?? "",
    desc: fc.images[i]?.desc ?? "",
  }));

  // 자동 슬라이드
  useEffect(() => {
    if (!isAutoPlay || isHovering) {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
      return;
    }

    autoPlayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isAutoPlay, isHovering, galleryImages.length]);

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

  return (
    <section ref={sectionRef} id="facility" className="py-16 sm:py-24 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 reveal-heading">
          <p
            className="font-montserrat font-semibold text-sm tracking-widest mb-3"
            style={{ color: "#C9A961" }}
          >
            {fc.sectionTitle}
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 800 }}
          >
            {fc.sectionSubtitle}
          </h2>
          <div className="star-divider mx-auto mb-6" />
          {fc.highlights[0] && (
            <p className="text-sm" style={{ color: "#6B7280" }}>
              {fc.highlights.map((h) => h.label).join(" · ")}
            </p>
          )}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="reveal-card text-center p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
              style={{ transitionDelay: `${i * 0.08}s`, background: "#F5F1ED" }}
            >
              <div
                className="font-montserrat font-extrabold text-2xl sm:text-3xl mb-2"
                style={{ color: "#C9A961" }}
              >
                {h.num}
              </div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: "#6B7280" }}>
                {fc.highlights[i]?.label ?? ""}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Container */}
        <div
          className="reveal-card relative rounded-3xl overflow-hidden bg-gray-900 shadow-2xl"
          style={{ aspectRatio: "16/9", minHeight: "300px" }}
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
                style={{ opacity: i === currentIndex ? 1 : 0 }}
              >
                <picture>
                  <source srcSet={img.srcWebP} type="image/webp" />
                  <img
                    src={img.srcJPG}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                </picture>
                {/* Dark Overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)" }}
                />
              </div>
            ))}
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 pointer-events-none">
            <div className="max-w-2xl">
              <p
                className="text-sm sm:text-base font-montserrat font-semibold tracking-widest mb-2 sm:mb-3"
                style={{ color: "#C9A961" }}
              >
                시설 {currentIndex + 1} / {galleryImages.length}
              </p>
              <h3
                className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3"
                style={{ color: "#FFFFFF" }}
              >
                {galleryImages[currentIndex].label}
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {galleryImages[currentIndex].desc}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goPrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 pointer-events-auto"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            aria-label={isAutoPlay ? "Pause autoplay" : "Play autoplay"}
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
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === currentIndex ? "32px" : "8px",
                  height: "8px",
                  background: i === currentIndex ? "#C9A961" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Strip (Desktop only) */}
        <div className="hidden md:flex gap-3 mt-8 justify-center flex-wrap">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="relative overflow-hidden rounded-lg transition-all duration-300 hover:ring-2"
              style={{
                width: "120px",
                height: "80px",
                opacity: i === currentIndex ? 1 : 0.5,
                ring: i === currentIndex ? "2px solid #C9A961" : "none",
              }}
            >
              <picture>
                <source srcSet={img.srcWebP} type="image/webp" />
                <img
                  src={img.srcJPG}
                  alt={img.label}
                  className="w-full h-full object-cover"
                />
              </picture>
              {i === currentIndex && (
                <div
                  className="absolute inset-0"
                  style={{ border: "2px solid #C9A961" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
