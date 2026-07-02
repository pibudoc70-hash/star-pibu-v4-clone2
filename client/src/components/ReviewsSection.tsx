/**
 * ReviewsSection - 실제 후기
 * 디자인: 연민트 배경, 슬라이더 형태 후기 카드
 * 모바일: 가로 스와이프 슬라이더 (터치 스와이프, 수동 조작)
 *   [UX개선] 자동 슬라이드(Auto-play) 제거 — 텍스트 읽기 방해 방지
 *   [UX개선] 화살표 버튼 제거 — dot 네비게이션만 유지
 *   [UX개선] Peeking 디자인 — 다음 카드 살짝 노출로 스와이프 어포던스 제공
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

  // [P1-PERF] 제거: 600ms 가짜 로딩 타이머 — 로컬 데이터이므로 즉시 렌더 가능
  // deferMount가 뷰포트 근처에서만 마운트를 보장하므로 내부 딜레이 불필요

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + totalPages) % totalPages);
  }, [totalPages]);

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
  };

  const visible = reviews.slice(current * perPage, current * perPage + perPage);

  return (
    <section ref={sectionRef} id="reviews" className="py-16 sm:py-24 star-section-alt" aria-label="환자 후기">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block reveal-heading">
          <span className="section-eyebrow">{rv.eyebrow}</span>
          <h2 className="section-title">{rv.sectionTitle}</h2>
          <div className="star-divider mx-auto" />
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="#FEE500" style={{ color: "#FEE500" }} />
              ))}
            </div>
            <span className="font-montserrat font-normal text-lg text-[var(--brand-text,#2C2C2C)]">4.9</span>
            <span className="text-sm text-[var(--brand-text-mid,#666666)]">/ 5.0 · {rv.ratingSource}</span>
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
            // 방향키 지원 — ArrowLeft/ArrowRight
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
              if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
            }}
          >
            {/* [UX개선] overflow: visible + 카드 너비 calc(100% - 40px) → Peeking 효과 */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-400 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {reviews.map((r, idx) => (
                  <div
                    key={idx}
                    className="review-slide-item"
                  >
                    <div className="review-card card card--review w-full min-w-0">
                      <Quote size={28} className="review-quote-icon" />
                      <p className="text-sm leading-relaxed mb-4 text-brand">
                        {`"${r.text}"`}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={r.rating} />
                            <span className="text-xs font-normal text-brand-gold">
                              {r.treatment}
                            </span>
                          </div>
                          <div className="text-xs text-brand-muted">
                            {r.name}
                          </div>
                        </div>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-normal"
                          style={{
                            background: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" || r.platform === "Naver" ? "rgba(3,199,90,0.08)" : "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)",
                            color: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" || r.platform === "Naver" ? "#027A37" : "var(--color-gold-deep)",
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

            {/* [UX개선] 화살표 버튼 제거 — dot 네비게이션만 유지 */}
            <div className="flex justify-center gap-2 mt-5">
              {reviews.map((_, i) => (
                <button type="button"
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={i === current ? "review-dot review-dot--active" : "review-dot"}
                  aria-label={`${i + 1}`}
                />
              ))}
            </div>

            <p className="text-center text-xs mt-3 text-gray-400">
              {rv.swipeHint}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-5 mb-8">
              {visible.map((r, i) => (
                <div
                  key={i}
                  style={{ transitionDelay: `${i * 0.1}s` } as React.CSSProperties}
                >
                  <div className="review-card card card--review flex-shrink-0 w-full min-w-0">
                    <Quote size={28} className="review-quote-icon" />
                    <p className="text-sm leading-relaxed mb-4 text-brand">
                      {`"${r.text}"`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating rating={r.rating} />
                          <span className="text-xs font-normal text-brand-gold">
                            {r.treatment}
                          </span>
                        </div>
                        <div className="text-xs text-brand-muted">
                          {r.name}
                        </div>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-normal"
                        style={{
                          background: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" ? "rgba(3,199,90,0.08)" : "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)",
                          color: r.platform === "네이버" || r.platform === "Naver" || r.platform === "ネイバー" ? "#027A37" : "var(--color-gold-deep)",
                        }}
                      >
                        {r.platform}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <button type="button"
                onClick={goPrev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md"
                style={{ background: 'var(--brand-bg, #FAF8F5)', color: 'var(--color-gold-primary)', border: '1px solid var(--color-gold-pale)' }}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button type="button"
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{ background: i === current ? "var(--color-gold-primary)" : "color-mix(in srgb, var(--color-gold-primary) 25%, transparent)" }}
                    aria-label={`${i + 1}`}
                  />
                ))}
              </div>
              <button type="button"
                onClick={goNext}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-md"
                style={{ background: 'var(--brand-bg, #FAF8F5)', color: 'var(--color-gold-primary)', border: '1px solid var(--color-gold-pale)' }}
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
            className="btn-ghost-mobile"
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
