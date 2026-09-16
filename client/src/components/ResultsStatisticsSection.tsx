import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { useLang } from '@/contexts/LangContext';
import { DoctorCardSkeleton } from '@/components/SkeletonUI';
import { useSectionReveal } from '@/hooks/useScrollReveal';

export default function ResultsStatisticsSection({ showRegenerativeMedicineBanner = false }: { showRegenerativeMedicineBanner?: boolean }) {
  const sectionRef = useSectionReveal(60); // [Step64]
  const [isLoading, setIsLoading] = useState(false); // [P1-PERF] 가짜 800ms 로딩 제거: deferMount로 뷰포트 근처에서 마운트되므로 즉시 렌더
  const { t } = useLang();
  const r = t.results;

  const doctors = [
    {
      id: 1,
      image: '/manus-storage/choosing-star-01_cd3dce52_18c438e7-optimized_90c3e2a4.webp',
      title: r.whyItems[0].title,
      description: r.whyItems[0].desc,
    },
    {
      id: 2,
      image: '/manus-storage/choosing-star-02_92c1e337_7f575d87-optimized_8a7385f0.webp',
      title: r.whyItems[1].title,
      description: r.whyItems[1].desc,
    },
    {
      id: 3,
      image: '/manus-storage/choosing-star-03_a440359e_f67b000c-optimized_6294b5b8.webp',
      title: r.whyItems[2].title,
      description: r.whyItems[2].desc,
    },
  ];

  return (
    <section ref={sectionRef} id="results-statistics" className="py-16 md:py-24" aria-label="시술 결과 실적">
      <div className="container">
        {/* 제목 */}
        <div className="section-header-block reveal-heading">
          <span className="section-eyebrow">RESULTS & STATISTICS</span>
          <h2 className="section-title">{r.sectionTitle}</h2>
          <div className="star-divider mx-auto" />
        </div>

        {/* 의료진 카드 */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${showRegenerativeMedicineBanner ? "mb-6 md:mb-8" : "mb-16"}`}>
          {isLoading ? (
            <>
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
              <DoctorCardSkeleton />
            </>
          ) : (
            doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 card"
            >
              {/* 의료진 사진 */}
              <div className="relative h-64 md:h-72 overflow-hidden" style={{ background: 'var(--brand-bg-warm, #EDE8E0)' }}>
                <OptimizedImage
                  src={doctor.image}
                  alt={doctor.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 타이틀 및 설명 */}
              <div className="p-4 sm:p-6 text-center w-full">
                <p className="font-normal mb-3 text-[var(--color-gold-deep)]" style={{ fontSize: '1.1rem', letterSpacing: '0.01em' }}>
                  {doctor.title}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap text-center text-[var(--brand-text-mid,#666666)]">
                  {doctor.description}
                </p>
              </div>
            </div>
          ))
          )}
        </div>
        {showRegenerativeMedicineBanner && (
          <div data-testid="regenerative-medicine-banner" className="w-full">
            <a
              href="https://star-pibu.com/notice/90001"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-[92%] mx-auto rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.30)] md:max-w-none"
              aria-label="보건복지부 지정 첨단재생의료 실시기관 공지 보기"
            >
              <img
                src="/manus-storage/regen-medicine-banner-pc2_430fd36f_89f4a3e5.webp"
                alt="보건복지부 지정 첨단재생의료 실시기관 — 스타피부과는 보건복지부로부터 첨단재생의료 실시기관에 지정됐습니다"
                className="w-full h-auto block"
                width={1470}
                height={368}
                loading="lazy"
                fetchPriority="low"
              />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
