import React from 'react';

export default function ResultsStatisticsSection() {
  const doctors = [
    {
      id: 1,
      name: '조시형 원장',
      title: '검증된 경험',
      description: ['20년 이상 피부과 임상 경험으로 안전하고 신뢰할 수 있는 시술 제공'],
      image: '/manus-storage/01_cd3dce52.jpg',
    },
    {
      id: 2,
      name: '우혜진 원장',
      title: '환자 중심 진료',
      description: '1:1 맞춤 상담으로 개인의 피부 상태에 최적화된 시술 계획 수립',
      image: '/manus-storage/02_92c1e337.jpg',
    },
    {
      id: 3,
      name: '이기욱 원장',
      title: '최신 장비',
      description: '국내 최고 수준의 레이저 및 시술 장비를 사용하여 최상의 결과 보장',
      image: '/manus-storage/03_a440359e.jpg',
    },
  ];

  const statistics = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D1AB67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
          <path d="M6 9c0-1 1-2 2-2h8c1 0 2 1 2 2v8c0 1-1 2-2 2H8c-1 0-2-1-2-2V9z"/>
          <path d="M9 5v2M15 5v2M6 15h12"/>
        </svg>
      ),
      number: '20',
      unit: '년',
      label: '전문의 경력',
      description: '2006년 개원 이래',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#D1AB67" className="w-6 h-6 md:w-7 md:h-7">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      number: '95',
      unit: '%',
      label: '환자 만족도',
      description: '네이버·구글 리뷰 기준',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D1AB67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
      number: '4,000',
      unit: '례',
      label: '눈밑지방재배치',
      description: '안전하고 검증된 시술',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D1AB67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-7 md:h-7">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      number: '1:1',
      unit: '',
      label: '피부과전문의 시술',
      description: '모든 시술 직접 담당',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-12">
          <p className="text-sm md:text-base font-medium mb-2" style={{ color: '#D1AB67' }}>
            RESULTS & STATISTICS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            스타피부과를 선택하는 이유
          </h2>
        </div>

        {/* 의료진 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* 의료진 사진 */}
              <div className="relative h-64 md:h-72 overflow-hidden bg-gray-200">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 의료진 정보 */}
              <div className="p-4 sm:p-6 text-center w-full">
                <p className="font-semibold mb-3" style={{ color: '#D1AB67', fontSize: '24px' }}>
                  {doctor.title}
                </p>
                <div className="text-xs sm:text-sm text-gray-600 leading-relaxed sm:leading-loose space-y-2 sm:space-y-3 w-full">
                  {Array.isArray(doctor.description) ? (
                    doctor.description.map((para, idx) => (
                      <p key={idx} className="break-words whitespace-pre-wrap text-left">{para}</p>
                    ))
                  ) : (
                    <p className="break-words whitespace-pre-wrap text-left">{doctor.description}</p>
                  )}
                </div>
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
