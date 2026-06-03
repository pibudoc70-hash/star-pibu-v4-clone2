import { useLang } from '@/contexts/LangContext';
import MainLayout from '@/components/MainLayout';
import SeoHead, { COMMON_HREFLANGS } from '@/components/SeoHead';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { MapView } from '@/components/Map';

const HOSPITAL = {
  address: '부산광역시 부산진구 서면문화로 27 아이온시티빌딩 10층',
  phone: '051-818-2300',
  kakaoMapUrl: 'https://map.kakao.com/link/search/스타피부과',
  naverMapUrl: 'https://map.naver.com/v5/search/스타피부과',
};

export default function Directions() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(HOSPITAL.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MainLayout>
      <SeoHead
        title="오시는 길 | 부산 서면 스타피부과"
        description="부산 서면 스타피부과 오시는 길 안내. 부산광역시 부산진구 서면문화로 27 아이온시티빌딩 10층. 서면역 1번 출구 도보 5분. 무료 주차 가능."
        keywords="스타피부과 위치, 스타피부과 주소, 서면피부과 오시는길, 부산피부과 위치, 서면역 피부과"
        canonical="https://www.star-pibu.com/directions"
        ogLocale="ko_KR"
        hreflangs={COMMON_HREFLANGS}
      />
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t.nav.contact}</h1>
          <p className="text-gray-600 mt-4">쉽게 찾아오세요.</p>
        </div>
      </section>

      {/* 지도 및 정보 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 지도 */}
              <div className="md:col-span-2">
                <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <MapView
                    onMapReady={(map: google.maps.Map) => {
                      const geocoder = new google.maps.Geocoder();
                      geocoder.geocode({ address: HOSPITAL.address }, (results, status) => {
                        if (status === 'OK' && results && results[0]) {
                          map.setCenter(results[0].geometry.location);
                          map.setZoom(16);
                          new google.maps.Marker({
                            map,
                            position: results[0].geometry.location,
                            title: 'STAR 피부과',
                          });
                        }
                      });
                    }}
                  />
                </div>
              </div>

              {/* 정보 */}
              <div className="space-y-6">
                {/* 주소 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">주소</h3>
                      <p className="text-gray-600 text-sm mt-2">{HOSPITAL.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1 mt-3"
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> 복사됨
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> 주소 복사
                      </>
                    )}
                  </button>
                </div>

                {/* 전화 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">전화</h3>
                      <a
                        href={`tel:${HOSPITAL.phone}`}
                        className="text-amber-600 hover:text-amber-700 font-semibold text-sm mt-2 block"
                      >
                        {HOSPITAL.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 진료 시간 */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-900">진료 시간</h3>
                      {t.hours.rows.map((row, i) => (
                        <p key={i} className="text-gray-600 text-sm mt-1">{row.day}: {row.time}</p>
                      ))}
                      <p className="text-red-500 text-xs mt-2">{t.hours.note}</p>
                    </div>
                  </div>
                </div>

                {/* 길찾기 버튼 */}
                <div className="space-y-3">
                  <a href={HOSPITAL.kakaoMapUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                      카카오맵으로 보기
                    </Button>
                  </a>
                  <a href={HOSPITAL.naverMapUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-2">
                      네이버지도로 보기
                    </Button>
                  </a>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* 주차 및 대중교통 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">교통 안내</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚗 자동차</h3>
              <p className="text-gray-600 mb-4">
                아이온시티빌딩 지하 주차장 이용 가능합니다. 시술 시간 동안 무료 주차 서비스를 제공합니다.
              </p>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• 주차 요금: 무료 (시술 고객)</li>
                <li>• 주차 위치: 지하 1층~3층</li>
                <li>• 장애인 주차: 별도 구역 준비</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🚌 대중교통</h3>
              <p className="text-gray-600 mb-4">
                지하철 및 버스로 쉽게 접근 가능합니다.
              </p>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• 지하철: 서면역 1번 출구 도보 5분</li>
                <li>• 버스: 서면역 정류장 인근</li>
                <li>• 택시: 아이온시티빌딩 기준</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
