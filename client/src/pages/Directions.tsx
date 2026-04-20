import { MapPin, Phone, Clock, Train, Bus } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useLang } from "@/contexts/useLang";
import { MapView } from "@/components/Map";

const PHONE = "051-818-2300";
const LAT = 35.1567;
const LNG = 129.0589;

export default function Directions() {
  const { t } = useLang();

  return (
    <MainLayout>
      <div className="pt-24 pb-16 min-h-screen bg-[var(--star-bg-section)]">
        <div className="container">
          <div className="mb-10">
            <p className="section-label mb-2">{t.nav.contact}</p>
            <h1 className="text-3xl md:text-4xl font-black text-[#1a2744]">{t.directions.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 지도 */}
            <div className="rounded-2xl overflow-hidden shadow-md" style={{ height: "420px" }}>
              <MapView
                onMapReady={(map) => {
                  map.setCenter({ lat: LAT, lng: LNG });
                  map.setZoom(17);
                  const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: { lat: LAT, lng: LNG },
                    title: "스타피부과",
                  });
                  const info = new google.maps.InfoWindow({
                    content: `<div style="padding:8px;font-family:sans-serif;"><strong>스타피부과</strong><br/>부산 서면 아이온시티빌딩 4층</div>`,
                  });
                  marker.addListener("click", () => info.open(map, marker as unknown as google.maps.MVCObject));
                }}
              />
            </div>

            {/* 정보 카드 */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-[#1a2744] text-lg mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[#c9a96e]" /> {t.directions.address}
                </h2>
                <p className="text-gray-700 font-semibold mb-1">부산광역시 부산진구 서면로 19</p>
                <p className="text-gray-500 text-sm">아이온시티빌딩 4층 접수·진료</p>
                <p className="text-gray-500 text-sm">아이온시티빌딩 2층 줄기세포 연구센터</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-[#1a2744] text-lg mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#c9a96e]" /> {t.directions.hours}
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">평일</span>
                    <span className="font-semibold text-gray-700">10:00 – 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">토요일</span>
                    <span className="font-semibold text-gray-700">10:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">점심시간</span>
                    <span className="font-semibold text-gray-700">13:00 – 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">일요일·공휴일</span>
                    <span className="font-semibold text-red-500">휴진</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-[#1a2744] text-lg mb-4 flex items-center gap-2">
                  <Train size={18} className="text-[#c9a96e]" /> {t.directions.transit}
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-[#f97316] text-white text-xs font-bold rounded flex-shrink-0">지하철</span>
                    <p className="text-gray-600">1·2호선 서면역 7번 출구 도보 3분</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-[#3b82f6] text-white text-xs font-bold rounded flex-shrink-0">버스</span>
                    <p className="text-gray-600">서면역 정류장 하차 후 도보 2분</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-[#6b7280] text-white text-xs font-bold rounded flex-shrink-0">주차</span>
                    <p className="text-gray-600">아이온시티빌딩 지하 주차장 이용 가능</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1b2a] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">전화 예약·문의</p>
                  <p className="text-[#c9a96e] text-lg font-black">{PHONE}</p>
                </div>
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a96e] text-[#0d1b2a] text-sm font-bold rounded-full hover:bg-[#e8d5b0] transition-colors"
                >
                  <Phone size={14} /> 전화하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
