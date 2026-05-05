import React from 'react';

export default function ResultsStatisticsSection() {
  const doctors = [
    {
      id: 1,
      name: '조시형 원장',
      title: '검증된 경험',
      description: '20년 이상 피부과 임상 경험으로 안전하고 신뢰할 수 있는 서울 제공',
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
      icon: '🏥',
      number: '20년',
      label: '전문의 경력',
      description: '2006년 개원 이래',
    },
    {
      icon: '⭐',
      number: '95%',
      label: '환자 만족도',
      description: '네이버·구글 리뷰 기준',
    },
    {
      icon: '📊',
      number: '4,000례',
      label: '눈밑지방재배치',
      description: '안전하고 검증된 시술',
    },
    {
      icon: '👥',
      number: '1:1',
      label: '피부과전문의 시술',
      description: '모든 시술 직접 담당',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-12">
          <p className="text-sm md:text-base font-medium text-amber-600 mb-2">
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
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-sm font-semibold text-amber-600 mb-3">
                  {doctor.title}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {doctor.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 통계 섹션 */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                {/* 아이콘 */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-amber-100 flex items-center justify-center text-xl md:text-2xl">
                    {stat.icon}
                  </div>
                </div>

                {/* 숫자 */}
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </p>

                {/* 라벨 */}
                <p className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                  {stat.label}
                </p>

                {/* 설명 */}
                <p className="text-xs md:text-sm text-gray-600">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
