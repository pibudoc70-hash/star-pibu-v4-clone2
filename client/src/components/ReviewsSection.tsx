/**
 * ReviewsSection - 실제 후기
 * 디자인: 연민트 배경, 슬라이더 형태 후기 카드
 * 모바일: 가로 스와이프 슬라이더 (터치 스와이프 + 자동 슬라이드)
 * 데스크톱: 3열 그리드 (페이지네이션)
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "#FEE500" : "none"}
          style={{ color: i < rating ? "#FEE500" : "#D1D5DB" }}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const rv = t.reviews;

  const reviews = rv.items;
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const perPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(reviews.length / perPage);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const startAuto = useCallback(() => {
    if (!isMobile) return;
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(goNext, 4000);
  }, [isMobile, goNext]);

  useEffect(() => {
    startAuto();
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [startAuto]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCurrent(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    if (autoTimer.current) clearInterval(autoTimer.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    startAuto();
  };

  const visible = reviews.slice(current * perPage, current * perPage + perPage);

  return (
    <section ref={sectionRef} id="reviews" className="py-16 sm:py-24 star-section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <span className="section-eyebrow">{rv.eyebrow}</span>
          <h2 className="section-title mb-4">{rv.sectionTitle}</h2>
          <div className="star-divider mx-auto mb-4" />
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="#FEE500" style={{ color: "#FEE500" }} />
              ))}
            </div>
            <span className="font-montserrat font-bold text-lg" style={{ color: "var(--brand-text, #2C2C2C)" }}>4.9</span>
            <span className="text-sm" style={{ color: "var(--brand-text-mid, #666666)" }}>/ 5.0 · {rv.ratingSource}</span>
          </div>
        </div>

        {/* 모바일: 스와이프 슬라이더 / 데스크톱: 3열 그리드 */}
        {isMobile ? (
          <div
            className="relative"
            role="region"
            aria-label="후기 캐러셀"
            tabIndex={0}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            // S2-T5: 방향키 지원 — ArrowLeft/ArrowRight
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); startAuto(); }
              if (e.key === "ArrowRight") { e.preventDefault(); goNext(); startAuto(); }
            }}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-400 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {reviews.map((r, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 px-1">
                    <div className="review-card flex-shrink-0 w-full" style={{ minWidth: 0 }}>
                      <Quote size={28} style={{ color: 'var(--brand-gold-pale, #EDE8E0)', marginBottom: "0.5rem" }} />
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--brand-text, #2C2C2C)" }}>
                        "{r.text}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={r.rating} />
                            <span className="text-xs font-semibold" style={{ color: "var(--brand-gold, #C4A882)" }}>
                              {r.treatment}
                            </span>
                          </div>
                          <div className="text-xs" style={{ color: "var(--brand-text-muted, #999999)" }}>
                            {r.name}
                          </div>
                        </div>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-semibold"
                          style={{
                            background: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" || r.platform === "Naver" ? "rgba(3,199,90,0.08)" : "rgba(196,168,130,0.12)",
                            color: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" || r.platform === "Naver" ? "#03C75A" : "var(--brand-gold-deep, #A8895E)",
                          }}
                        >
                          {r.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="button"
              onClick={() => { goPrev(); startAuto(); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ background: "var(--brand-bg, #FAF8F5)", color: "var(--brand-gold, #C4A882)", border: "1px solid rgba(196,168,130,0.3)" }}
              aria-label={rv.prevLabel}
            >
              <ChevronLeft size={16} />
            </button>
            <button type="button"
              onClick={() => { goNext(); startAuto(); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ background: "var(--brand-bg, #FAF8F5)", color: "var(--brand-gold, #C4A882)", border: "1px solid rgba(196,168,130,0.3)" }}
              aria-label={rv.nextLabel}
            >
              <ChevronRight size={16} />
            </button>

            <div className="flex justify-center gap-2 mt-5">
              {reviews.map((_, i) => (
                <button type="button"
                  key={i}
                  onClick={() => { setCurrent(i); startAuto(); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "22px" : "7px",
                    height: "7px",
                    background: i === current ? "var(--brand-gold, #C4A882)" : "rgba(196,168,130,0.25)",
                  }}
                  aria-label={`${i + 1}`}
                />
              ))}
            </div>

            <p className="text-center text-xs mt-3" style={{ color: "#9CA3AF" }}>
              {rv.swipeHint}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-5 mb-8">
              {visible.map((r, i) => (
                <div
                  key={i}
                  className="reveal-card"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="review-card flex-shrink-0 w-full" style={{ minWidth: 0 }}>
                    <Quote size={28} style={{ color: "rgba(196,168,130,0.25)", marginBottom: "0.5rem" }} />
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--brand-text, #2C2C2C)" }}>
                      "{r.text}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating rating={r.rating} />
                          <span className="text-xs font-semibold" style={{ color: "var(--brand-gold, #C4A882)" }}>
                            {r.treatment}
                          </span>
                        </div>
                        <div className="text-xs" style={{ color: "var(--brand-text-muted, #999999)" }}>
                          {r.name}
                        </div>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          background: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" ? "rgba(3,199,90,0.08)" : "rgba(196,168,130,0.12)",
                          color: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" ? "#03C75A" : "var(--brand-gold-deep, #A8895E)",
                        }}
                      >
                        {r.platform}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4">
              <button type="button"
                onClick={goPrev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md"
                style={{ background: 'var(--brand-bg, #FAF8F5)', color: 'var(--brand-gold, #C4A882)', border: '1px solid var(--brand-gold-pale, #E8E0D5)' }}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button type="button"
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ background: i === current ? "var(--brand-gold, #C4A882)" : "rgba(196,168,130,0.25)" }}
                    aria-label={`${i + 1}`}
                  />
                ))}
              </div>
              <button type="button"
                onClick={goNext}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md"
                style={{ background: 'var(--brand-bg, #FAF8F5)', color: 'var(--brand-gold, #C4A882)', border: '1px solid var(--brand-gold-pale, #E8E0D5)' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* More Reviews CTA */}
        <div className="text-center mt-10">
          <a
            href="https://pcmap.place.naver.com/hospital/12020103/review/visitor?fromPanelNum=2&locale=ko&searchText=%EC%8A%A4%ED%83%80%ED%94%BC%EB%B6%80%EA%B3%BC&svcName=map_pcv5&timestamp=202603301414"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 hover:shadow-md"
            style={{
              background: "var(--brand-bg, #FAF8F5)",
              color: "var(--brand-text, #2C2C2C)",
              border: "1.5px solid var(--brand-gold-pale, #E8E0D5)",
              boxShadow: "0 2px 8px rgba(196,168,130,0.12)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {rv.moreReviews}
          </a>
        </div>
      </div>
    </section>
  );
}
