import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { useLang } from '@/contexts/LangContext';
import { useClinicStats } from '@/hooks/useClinicStats';
import { DoctorCardSkeleton, StatisticCardSkeleton } from '@/components/SkeletonUI';

export default function ResultsStatisticsSection() {
  const [isLoading, setIsLoading] = useState(false); // [P1-PERF] 가짜 800ms 로딩 제거: deferMount로 뷰포트 근처에서 마운트되므로 즉시 렌더
  const { t } = useLang();
  const r = t.results;
  const clinicStats = useClinicStats();

  const doctors = [
    {
      id: 1,
      image: '/manus-storage/01_cd3dce52.jpg',
      title: r.whyItems[0].title,
      description: r.whyItems[0].desc,
    },
    {
      id: 2,
      image: '/manus-storage/02_92c1e337.jpg',
      title: r.whyItems[1].title,
      description: r.whyItems[1].desc,
    },
    {
      id: 3,
      image: '/manus-storage/03_a440359e.jpg',
      title: r.whyItems[2].title,
      description: r.whyItems[2].desc,
    },
  ];

  // useClinicStats Hook으로 중앙화된 통계 수치 참조
  const statistics = [
    { icon: getIcon(0), number: clinicStats.years.value, unit: clinicStats.years.unit, label: r.stats[0].label, description: r.stats[0].desc },
    { icon: getIcon(1), number: clinicStats.satisfaction.value, unit: clinicStats.satisfaction.unit, label: r.stats[1].label, description: r.stats[1].desc },
    { icon: getIcon(2), number: clinicStats.cases.value, unit: clinicStats.cases.unit, label: r.stats[2].label, description: r.stats[2].desc },
    { icon: getIcon(3), number: clinicStats.ratio.value, unit: clinicStats.ratio.unit, label: r.stats[3].label, description: r.stats[3].desc },
  ];

  return (
    <section className="py-16 md:py-24" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
      <div className="container">
        {/* 제목 */}
        <div className="section-header-block">
          <span className="section-eyebrow">RESULTS & STATISTICS</span>
          <h2 className="section-title">{r.sectionTitle}</h2>
          <div className="star-divider mx-auto" />
        </div>

        {/* 의료진 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--brand-bg-alt, #F5F0EB)', boxShadow: '0 2px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(196,168,130,0.15)' }}
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
                <p className="font-normal mb-3" style={{ color: 'var(--brand-gold-deep, #A8895E)', fontSize: '1.1rem', letterSpacing: '0.01em' }}>
                  {doctor.title}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap text-center" style={{ color: 'var(--brand-text-mid, #666666)' }}>
                  {doctor.description}
                </p>
              </div>
            </div>
          ))
          )}
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            <>
              <StatisticCardSkeleton />
              <StatisticCardSkeleton />
              <StatisticCardSkeleton />
              <StatisticCardSkeleton />
            </>
          ) : (
            statistics.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--brand-bg-alt, #F5F0EB)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(196,168,130,0.15)' }}
            >
              {/* 아이콘 */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-bg, #FAF8F5)', border: '1px solid rgba(196,168,130,0.2)' }}>
                  {stat.icon}
                </div>
              </div>

              {/* 숫자 */}
              <p className="font-normal text-2xl sm:text-3xl mb-2" style={{ color: '#7A5C35', fontFamily: "'Montserrat', 'Noto Sans KR', sans-serif" }}>
                {stat.number}
                {/* [PROD-P3-2] fontSize 70% → 65%: HeroSection unit 표시와 통일 */}
                {stat.unit && <span style={{ fontSize: '65%' }} className="ml-1">{stat.unit}</span>}
              </p>

              {/* 라벨 - [MOB-4] 영어 20자 라벨이 2열 그리드에서 카드 높이 불균형 방지: break-words 추가 */}
              <p className="text-xs sm:text-sm font-medium break-words" style={{ color: 'var(--brand-text-mid, #666666)' }}>
                {stat.label}
              </p>

              {/* 설명 */}
              <p className="text-xs break-words" style={{ color: '#666666', marginTop: '0.5rem' }}>
                {stat.description}
              </p>
            </div>
          ))
          )}
        </div>
      </div>
    </section>
  );
}

function getIcon(index: number) {
  const icons = [
    <svg key={0} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D1AB67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
      <path d="M6 9c0-1 1-2 2-2h8c1 0 2 1 2 2v8c0 1-1 2-2 2H8c-1 0-2-1-2-2V9z"/>
      <path d="M9 5v2M15 5v2M6 15h12"/>
    </svg>,
    <svg key={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D1AB67" className="w-6 h-6 md:w-7 md:h-7">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>,
    <svg key={2} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D1AB67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>,
    <svg key={3} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D1AB67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>,
  ];
  return icons[index] || icons[0];
}
