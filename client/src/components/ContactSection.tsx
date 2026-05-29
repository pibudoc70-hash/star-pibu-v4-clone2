/**
 * ContactSection - 위치 및 연락처
 * 디자인: 연민트 배경, 지도 + 진료시간 + CTA
 * i18n: useLang으로 한/중/일 전환
 * 모바일 최적화: 지도 높이 확대, 주소 복사 버튼, 레이아웃 개선
 */

import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Clock, Train, Car, MessageCircle, Calendar, Navigation, Copy, Check } from "lucide-react";
import { MapView } from "@/components/Map";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapHeight, setMapHeight] = useState("400px");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // 스타피부과 정확한 좌표 (부산 서면 아이온시티빌딩)
  const STAR_LOCATION = { lat: 35.1572312, lng: 129.0581932 };

  // 오른쪽 정보 패널의 높이를 기반으로 지도 높이 동적 계산 (PC에서만)
  useEffect(() => {
    const updateMapHeight = () => {
      // 윈도우 너비 확인
      const isCurrentlyMobile = window.innerWidth < 1024;
      setIsMobile(isCurrentlyMobile);

      // PC에서만 정보 패널 높이에 맞춤
      if (!isCurrentlyMobile && infoPanelRef.current) {
        const height = infoPanelRef.current.offsetHeight;setMapHeight(`${height}px`);
      } else if (isCurrentlyMobile) {
        // 모바일에서는 고정 높이 사용
        setMapHeight("400px");
      }

      // 지도 크기 변경 후 중심 좌표 유지
      if (mapInstanceRef.current) {
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(STAR_LOCATION);
          }
        }, 0);
      }
    };

    // 초기 계산 (DOM 렌더링 완료 후 높이 측정)
    const initTimer = setTimeout(updateMapHeight, 200);
    const initTimer2 = setTimeout(updateMapHeight, 500);

    // ResizeObserver로 정보 패널 높이 변화 감시 (PC에서만)
    const observer = new ResizeObserver(() => {
      if (!isMobile && infoPanelRef.current) {
        const height = infoPanelRef.current.offsetHeight;setMapHeight(`${height}px`);
      }
    });
    if (infoPanelRef.current) {
      observer.observe(infoPanelRef.current);
    }

    // 윈도우 리사이즈 시에도 업데이트
    window.addEventListener("resize", updateMapHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMapHeight);
      clearTimeout(initTimer);
      clearTimeout(initTimer2);
    };
  }, [isMobile]);

  // 주소 복사
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(t.access.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = t.access.address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 진료시간 "휴진" 판별 (언어별)
  const closedLabel = lang === "en" ? "Closed" : lang === "ja" ? "休診" : lang === "zh" ? "休诊" : "휴진";

  // 라벨 매핑
  const labels = {
    locationInfo: lang === "en" ? t.access.label : lang === "ja" ? "アクセス・連絡先" : lang === "zh" ? "位置及联系方式" : "위치 및 연락정보",
    sectionTitle: lang === "en" ? t.access.title : lang === "ja" ? "アクセス" : lang === "zh" ? t.access.title : "찾아오시는 길",
    address: lang === "en" ? "Address" : lang === "ja" ? "住所" : lang === "zh" ? "地址" : "주소",
    phone: lang === "en" ? "Phone" : lang === "ja" ? "電話" : lang === "zh" ? "电话" : "전화",
    hours: lang === "en" ? "Clinic Hours" : lang === "ja" ? "診療時間" : lang === "zh" ? "诊疗时间" : "진료시간",
    hoursNote: lang === "en" ? "※ Weekday lunch break 13:00–14:00 · No lunch break on Saturdays" : lang === "ja" ? "※ 平日昼休み 13:00–14:00 · 土曜日は昼休みなし" : lang === "zh" ? "※ 平日午休 13:00–14:00 · 周六不设午休" : "※ 평일 점심시간 13:00–14:00 · 토요일 점심시간 없이 진료",
    transit: lang === "en" ? "Public Transit" : lang === "ja" ? "交通" : lang === "zh" ? "交通" : "대중교통",
    transitDesc: lang === "en" ? t.access.subway : lang === "ja" ? "地下鉄 西面駅 5番・7番出口 徒歩2分" : lang === "zh" ? "地铁西面站 5号·7号出口 步行2分钟" : "지하철 서면역 5번·7번 출구 도보 2분",
    parking: lang === "en" ? "Parking" : lang === "ja" ? "駐車場" : lang === "zh" ? "停车场" : "주차",
    parkingDesc: lang === "en" ? t.access.parking : lang === "ja" ? "アイオンシティビル内駐車場利用可" : lang === "zh" ? "爱恩城大厦内停车场可用" : "아이온시티 건물 내 주차 가능",
    kakaoMap: lang === "en" ? "Get Directions (Kakao Map)" : lang === "ja" ? "カカオマップで経路検索" : lang === "zh" ? "Kakao地图导航" : "카카오맵 길찾기",
    kakaoChat: lang === "en" ? "KakaoTalk Chat" : lang === "ja" ? "カカオ相談" : lang === "zh" ? "KakaoTalk咨询" : "카카오 상담",
    smsConsult: lang === "en" ? "SMS Consult" : lang === "ja" ? "SMS相談" : lang === "zh" ? "短信咨询" : "문자 상담",
    naverMap: lang === "en" ? "Naver Map" : lang === "ja" ? "Naver地図" : lang === "zh" ? "Naver地图" : "네이버 지도",
    copyAddress: lang === "en" ? "Copy Address" : lang === "ja" ? "住所をコピー" : lang === "zh" ? "复制地址" : "주소 복사",
    copied: lang === "en" ? "Copied!" : lang === "ja" ? "コピーしました！" : lang === "zh" ? "已复制！" : "복사됨!",
  };

  return (
    <section ref={sectionRef} id="contact" className="py-16 sm:py-24 star-section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p
            className="font-montserrat font-semibold text-sm tracking-widest mb-3"
            style={{ color: "#81C7C9" }}
          >
            {labels.locationInfo}
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}
          >
            {labels.sectionTitle}
          </h2>
          <div className="star-divider mx-auto" />
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'} gap-6 sm:gap-8 ${isMobile ? 'items-center' : 'items-stretch'} auto-rows-max lg:auto-rows-fr`}>
          {/* Map - 모바일에서 더 크게 */}
          <div
            ref={mapContainerRef}
            className="reveal-left lg:col-span-3 rounded-2xl overflow-hidden shadow-lg"
            style={{ display: "flex", flexDirection: "column", height: mapHeight, minHeight: "300px" }}
            aria-label="스타피부과 위치 지도 - 부산 서면 아이온시티빌딩 4층"
          >
            <MapView
              className="w-full h-full"
              initialCenter={STAR_LOCATION}
              initialZoom={17}
              onMapReady={(map) => {
                // 지도 인스턴스 저장 (나중에 중심 좌표 유지용)
                mapInstanceRef.current = map;
                
                // 디버그: 지도 컨테이너 크기 확인
                if (mapContainerRef.current) {}

                // 지도 중심 및 줌 설정
                map.setCenter(STAR_LOCATION);
                map.setZoom(17);

                // 지도 크기 변경 이벤트 리스너 추가
                if (window.google?.maps) {
                  window.google.maps.event.addListener(map, 'bounds_changed', () => {
                    // 지도 경계 변경 시 중심 좌표 유지
                    map.setCenter(STAR_LOCATION);
                  });
                }

                // 커스텀 마커 핀 엘리먼트 (SVG 별 아이콘 + 팝업 포함)
                const pinEl = document.createElement('div');
                pinEl.style.cssText = "position:relative;cursor:pointer;";
                pinEl.innerHTML = `
                  <div style="width:44px;height:44px;background:#4A6FA5;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
                    <span style="transform:rotate(45deg);font-size:20px;">⭐</span>
                  </div>
                  <div id="star-map-popup" style="display:block;position:absolute;bottom:52px;left:50%;transform:translateX(-50%);background:white;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:10px 12px;min-width:200px;white-space:nowrap;z-index:9999;">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                      <span style="font-size:16px;">⭐</span>
                      <strong style="color:#1F2937;font-size:14px;">스타피부과의원</strong>
                    </div>
                    <p style="color:#6B7280;font-size:12px;margin:0 0 4px;">부산 부산진구 서면로 74</p>
                    <p style="color:#6B7280;font-size:12px;margin:0 0 8px;">아이온시티빌딩 2·4층</p>
                    <div style="display:flex;gap:6px;">
                      <span style="background:#EEF7F7;color:#4A6FA5;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;">서면역 5·7번 출구</span>
                      <span style="background:#FFF3E0;color:#E65100;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;">도보 2분</span>
                    </div>
                    <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid white;"></div>
                  </div>
                `;

                // 마커 클릭 시 팝업 토글
                let popupVisible = true;
                pinEl.addEventListener("click", () => {
                  const popup = pinEl.querySelector("#star-map-popup") as HTMLElement | null;
                  if (popup) {
                    popupVisible = !popupVisible;
                    popup.style.display = popupVisible ? "block" : "none";
                  }
                });

                // window.google 안전 참조 (bare `google` 전역 사용 금지)
                const g = window.google;
                if (!g?.maps?.marker?.AdvancedMarkerElement) {
                  console.warn("[ContactSection] AdvancedMarkerElement not available");
                  return;
                }
                new g.maps.marker.AdvancedMarkerElement({
                  position: STAR_LOCATION,
                  map,
                  title: "스타피부과 서면 아이온시티",
                  content: pinEl,
                });
              }}
            />
          </div>

          {/* Info */}
          <div
            ref={infoPanelRef}
            className="reveal-right lg:col-span-2 flex flex-col gap-2 sm:gap-3 lg:h-full"
            style={{ transitionDelay: "0.15s" }}
          >
            {/* Address + 복사 버튼 */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ background: "white" }}>
              <div className="flex items-stretch gap-3">
                <MapPin size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>{labels.address}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {t.access.address}
                  </p>
                  {/* 주소 복사 버튼 */}
                  <button
                    onClick={handleCopyAddress}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95"
                    style={{
                      background: copied ? "#E8F9EF" : "#EEF7F7",
                      color: copied ? "#03C75A" : "#4A6FA5",
                      border: `1px solid ${copied ? "#03C75A33" : "#81C7C933"}`,
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={12} />
                        {labels.copied}
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        {labels.copyAddress}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ background: "white" }}>
              <div className="flex items-center gap-3">
                <Phone size={20} style={{ color: "#81C7C9", flexShrink: 0 }} />
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>{labels.phone}</p>
                  <a
                    href="tel:051-818-2300"
                    className="font-montserrat font-bold text-lg transition-colors hover:opacity-70"
                    style={{ color: "#4A6FA5" }}
                  >
                    051-818-2300
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ background: "white" }}>
              <div className="flex items-stretch gap-3">
                <Clock size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div className="flex-1">
                  <p className="font-bold text-sm mb-3" style={{ color: "#1F2937" }}>{labels.hours}</p>
                  <div className="space-y-1.5">
                    {t.hours.rows.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <span style={{ color: "#6B7280" }}>{h.day}</span>
                        <span
                          className="font-semibold"
                          style={{ color: h.time === closedLabel ? "#EF4444" : "#1F2937" }}
                        >
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-3 p-2 rounded-lg" style={{ background: "#EEF7F7", color: "#4A6FA5" }}>
                    {labels.hoursNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Transit */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ background: "white" }}>
              <div className="flex items-stretch gap-3">
                <Train size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p className="font-bold text-sm mb-2" style={{ color: "#1F2937" }}>{labels.transit}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {labels.transitDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-stretch gap-3 mt-3">
                <Car size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>{labels.parking}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{labels.parkingDesc}</p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}
