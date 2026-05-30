import React from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import { useLang } from '@/contexts/LangContext';

export default function ResultsStatisticsSection() {
  const { t, lang } = useLang();
  const r = t.results;

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

  const statNumbers = ['20', '95', '4,000', '1:1'];
  const statUnitsByLang: Record<string, string[]> = {
    ko: ['년', '%', '례', ''],
    en: ['+yrs', '%', '+', ''],
    ja: ['年', '%', '例', ''],
    zh: ['年', '%', '例', ''],
  };
  const statUnits = statUnitsByLang[lang] ?? statUnitsByLang.en;

  const statistics = r.stats.map((stat, i) => ({
    icon: getIcon(i),
    number: statNumbers[i],
    unit: statUnits[i],
    label: stat.label,
    description: stat.desc,
  }));

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-12">
          <p className="text-sm md:text-base font-medium mb-2" style={{ color: '#D1AB67' }}>
            RESULTS & STATISTICS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {r.sectionTitle}
          </h2>
        </div>

        {/* 의료진 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              style={{ background: '#F5F1ED' }}
            >
              {/* 의료진 사진 */}
              <div className="relative h-64 md:h-72 overflow-hidden bg-gray-200">
                <OptimizedImage
                  src={doctor.image}
                  alt={doctor.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 타이틀 및 설명 */}
              <div className="p-4 sm:p-6 text-center w-full">
                <p className="font-semibold mb-3" style={{ color: '#D1AB67', fontSize: '24px' }}>
                  {doctor.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words whitespace-pre-wrap text-center">
                  {doctor.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
              style={{ background: '#F5F1ED' }}
            >
              {/* 아이콘 */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>

              {/* 숫자 */}
              <p className="font-extrabold text-2xl sm:text-3xl mb-2" style={{ color: '#D1AB67' }}>
                {stat.number}
                {stat.unit && <span style={{ fontSize: '70%' }} className="ml-1">{stat.unit}</span>}
              </p>

              {/* 라벨 */}
              <p className="text-xs sm:text-sm font-medium" style={{ color: '#6B7280' }}>
                {stat.label}
              </p>

              {/* 설명 */}
              <p className="text-xs" style={{ color: '#9CA3AF', marginTop: '0.5rem' }}>
                {stat.description}
              </p>
            </div>
          ))}
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
