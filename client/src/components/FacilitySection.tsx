/**
 * FacilitySection - 시설 갤러리
 * 디자인: 흰색 배경, 그리드 갤러리 + 풀스크린 라이트박스
 * 모바일 최적화: 터치 스와이프, 인디케이터, 풀스크린 지원
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/104196446/FfraVpZBeN8JUDHaejFA3e";

const galleryImageSrcs = [
  { srcWebP: `${CDN}/sub01_04_07-desktop_eabba615.webp`, srcJPG: `${CDN}/sub01_04_07-desktop.jpg` },
  { srcWebP: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub01_04_01-desktop_9391bcd7.jpg", srcJPG: "https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/sub01_04_01-desktop_9391bcd7.jpg" },
  { srcWebP: `${CDN}/sub01_04_02-desktop_de43f18c.webp`, srcJPG: `${CDN}/sub01_04_02-desktop.jpg` },
  { srcWebP: `${CDN}/sub01_04_04-desktop_b7c7d14b.webp`, srcJPG: `${CDN}/sub01_04_04-desktop.jpg` },
  { srcWebP: `${CDN}/sub01_04_03-desktop_09ad9a3f.webp`, srcJPG: `${CDN}/sub01_04_03-desktop.jpg` },
  { srcWebP: `${CDN}/sub01_04_05-desktop_6b2831e9.webp`, srcJPG: `${CDN}/sub01_04_05-desktop.jpg` },
  { srcWebP: `${CDN}/sub01_04_06-desktop_6057112b.webp`, srcJPG: `${CDN}/sub01_04_06-desktop.jpg` },
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

  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const galleryImages = galleryImageSrcs.map((src, i) => ({
    ...src,
    label: fc.images[i]?.label ?? "",
    desc: fc.images[i]?.desc ?? "",
  }));

  const goNext = useCallback(() => {
    setLightbox((l) => ((l ?? 0) + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const goPrev = useCallback(() => {
    setLightbox((l) => ((l ?? 0) - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, goNext, goPrev]);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section ref={sectionRef} id="facility" className="py-16 sm:py-24 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p
            className="font-montserrat font-semibold text-sm tracking-widest mb-3"
            style={{ color: "#81C7C9" }}
          >
            {fc.sectionTitle}
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="reveal-card text-center p-3 sm:p-5 rounded-xl"
              style={{ transitionDelay: `${i * 0.08}s`, background: "#EEF7F7" }}
            >
              <div
                className="font-montserrat font-extrabold text-xl sm:text-2xl mb-1"
                style={{ color: "#4A6FA5" }}
              >
                {h.num}
              </div>
              <div className="text-xs" style={{ color: "#6B7280" }}>
                {fc.highlights[i]?.label ?? ""}
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="reveal-card relative overflow-hidden rounded-xl cursor-pointer group"
              style={{ transitionDelay: `${i * 0.07}s`, aspectRatio: "4/3" }}
              onClick={() => setLightbox(i)}
            >
              <picture>
                <source srcSet={img.srcWebP} type="image/webp" />
                <img
                  src={img.srcJPG}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </picture>
              {/* Hover Overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(74,111,165,0.7)" }}
              >
                <ZoomIn size={28} className="text-white mb-2" />
                <span className="text-white font-bold text-sm">{img.label}</span>
                <span className="text-white/80 text-xs mt-1 text-center px-4">{img.desc}</span>
              </div>
              {/* Label */}
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
              >
                <span className="text-white text-xs font-semibold">{img.label}</span>
              </div>
              {/* 모바일 탭 힌트 아이콘 */}
              <div className="absolute top-2 right-2 sm:hidden">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <ZoomIn size={13} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 모바일 갤러리 힌트 */}
        <p className="text-center text-xs mt-4 sm:hidden" style={{ color: "#9CA3AF" }}>
          {fc.zoomHint}
        </p>
      </div>

      {/* 풀스크린 라이트박스 */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          {/* 상단 바 */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div>
              <p className="text-white font-bold text-sm">{galleryImages[lightbox].label}</p>
              <p className="text-white/60 text-xs">{galleryImages[lightbox].desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-xs">
                {lightbox + 1} / {galleryImages.length}
              </span>
              <button
                onClick={() => setLightbox(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.15)" }}
                aria-label="Close"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div className="flex-1 flex items-center justify-center relative min-h-0 px-2 py-2">
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
              aria-label="Previous"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>

            <picture>
              <source srcSet={galleryImages[lightbox].srcWebP} type="image/webp" />
              <img
                src={galleryImages[lightbox].srcJPG}
                alt={galleryImages[lightbox].label}
                className="max-w-full max-h-full rounded-lg object-contain"
                style={{
                  maxHeight: "calc(100vh - 140px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                }}
              />
            </picture>

            <button
              onClick={goNext}
              className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
              aria-label="Next"
            >
              <ChevronRight size={22} className="text-white" />
            </button>
          </div>

          {/* 하단 인디케이터 도트 */}
          <div className="flex justify-center items-center gap-2 py-4 flex-shrink-0">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === lightbox ? "24px" : "7px",
                  height: "7px",
                  background: i === lightbox ? "#C9A84C" : "rgba(255,255,255,0.35)",
                }}
                aria-label={`${i + 1}`}
              />
            ))}
          </div>

          {/* 모바일 스와이프 힌트 */}
          <p className="text-center text-xs pb-3 sm:hidden" style={{ color: "rgba(255,255,255,0.3)" }}>
            {fc.zoomHint}
          </p>
        </div>
      )}
    </section>
  );
}
