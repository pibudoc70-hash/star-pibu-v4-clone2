/**
 * ContactSection - 위치 및 연락처
 * 디자인: 연민트 배경, 지도 + 진료시간 + CTA
 * i18n: useLang으로 한/중/일 전환
 * 모바일 최적화: 지도 높이 확대, 주소 복사 버튼, 레이아웃 개선
 *
 * CONTACT-P1-A: isMobile lazy initializer (SSR-safe)
 * CONTACT-P1-B: 마커 팝업 언어별 분기 (ko/en/ja/zh)
 * CONTACT-P1-C: bounds_changed → idle 1회 리스너 (무한루프 방지)
 * CONTACT-P2-A: labels 객체 제거 → t.access.* i18n 키 직접 사용
 */

import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Clock, Train, Car, Copy, Check } from "lucide-react";
import { MapView } from "@/components/Map";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { CLINIC_TEL, CLINIC_TEL_INTL } from "@/lib/constants";

// 모듈 상수로 선언 — 리렌더링마다 새 객체가 생성되어 MapView에
// initialCenter prop으로 전달될 때 참조 안정성을 보장
// (새 객체 참조는 다른 객체로 판단되어 불필요한 리렌더링을 유발할 수 있음)
const STAR_LOCATION: google.maps.LatLngLiteral = { lat: 35.1572312, lng: 129.0581932 };

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t, lang } = useLang();
  const [copied, setCopied] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapHeight, setMapHeight] = useState("400px");
  // CONTACT-P1-A: lazy initializer — window 접근을 렌더 외부로 이동
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  // 오른쪽 정보 패널의 높이를 기반으로 지도 높이 동적 계산 (PC에서만)
  useEffect(() => {
    const updateMapHeight = () => {
      const isCurrentlyMobile = window.innerWidth < 1024;
      setIsMobile(isCurrentlyMobile);

      if (!isCurrentlyMobile && infoPanelRef.current) {
        const height = infoPanelRef.current.offsetHeight;
        setMapHeight(`${height}px`);
      } else if (isCurrentlyMobile) {
        setMapHeight("400px");
      }

      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.setCenter(STAR_LOCATION);
        }, 0);
      }
    };

    // CONTACT-P2-B: 중복 타이머 → rAF + 단일 fallback 타이머
    let rafId = requestAnimationFrame(updateMapHeight);
    const initTimer = setTimeout(updateMapHeight, 300);

    const observer = new ResizeObserver(() => {
      if (!isMobile && infoPanelRef.current) {
        const height = infoPanelRef.current.offsetHeight;
        setMapHeight(`${height}px`);
      }
    });
    if (infoPanelRef.current) {
      observer.observe(infoPanelRef.current);
    }

    window.addEventListener("resize", updateMapHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateMapHeight);
      cancelAnimationFrame(rafId);
      clearTimeout(initTimer);
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
      const el = document.createElement("textarea");
      el.value = t.access.address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 진료시간 "휴진" 판별: t.hours.rows 마지막 항목의 time 값 사용 (i18n 중앙화)
  const closedLabel = t.hours.rows[t.hours.rows.length - 1]?.time ?? t.hours.rows[0]?.time ?? "";  // 마지막 행 time 값 (휴진 표시)

  // CONTACT-P2-A: i18n 키 직접 사용 (fallback 삼항 제거 — 4개 언어 모두 키 존재 확인)
  const locationInfo = t.access.locationInfo ?? t.access.label;  // locationInfo 4개 언어 모두 존재
  const sectionTitle = t.access.sectionTitle ?? t.access.title;  // sectionTitle 4개 언어 모두 존재
  const addressLabel = t.access.addressLabel!;
  const phoneLabel = t.access.phoneLabel!;
  const hoursLabel = t.access.hoursLabel!;
  const hoursNote = t.access.hoursNote ?? t.hours.note;  // hoursNote 4개 언어 모두 존재
  const transitLabel = t.access.transitLabel!;
  const transitDesc = t.access.transitDesc ?? t.access.subway;  // transitDesc 4개 언어 모두 존재
  const parkingLabel = t.access.parkingLabel!;
  const parkingDesc = t.access.parkingDesc ?? t.access.parking;  // parkingDesc 4개 언어 모두 존재
  const kakaoMapLabel = t.access.kakaoMapLabel!;
  const naverMapLabel = t.access.naverMap!;  // naverMap 4개 언어 모두 존재
  const copyAddressLabel = t.access.copyAddress!;
  const copiedLabel = t.access.copiedLabel!;

  return (
    <section ref={sectionRef} id="contact" className="py-16 sm:py-24 star-section-alt">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 reveal-heading">
          <p
            className="font-montserrat font-semibold text-sm tracking-widest mb-3"
            style={{ color: "#81C7C9" }}
          >
            {locationInfo}
          </p>
          <h2
            className="mb-4"
            style={{ color: "#1F2937", fontSize: "clamp(1.4rem, 5vw, 2.6rem)", fontWeight: 800 }}
          >
            {sectionTitle}
          </h2>
          <div className="star-divider mx-auto" />
        </div>

        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"} gap-6 sm:gap-8 ${isMobile ? "items-center" : "items-stretch"} auto-rows-max lg:auto-rows-fr`}
        >
          {/* Map - 모바일에서 더 크게 */}
          <div
            ref={mapContainerRef}
            className="reveal-left lg:col-span-3 rounded-2xl overflow-hidden shadow-lg"
            style={{ display: "flex", flexDirection: "column", height: mapHeight, minHeight: "300px" }}
            aria-label={t.access.mapAriaLabel}
          >
            <MapView
              className="w-full h-full"
              initialCenter={STAR_LOCATION}
              initialZoom={17}
              onMapReady={(map) => {
                mapInstanceRef.current = map;

                map.setCenter(STAR_LOCATION);
                map.setZoom(17);

                // CONTACT-P1-C: idle 이벤트 1회만 사용 (무한루프 방지)
                if (window.google?.maps) {
                  window.google.maps.event.addListenerOnce(map, "idle", () => {
                    map.setCenter(STAR_LOCATION);
                  });
                }

                // CONTACT-P1-B: 언어별 마커 팝업 텍스트
                const popupLang = lang;
                const clinicName =
                  popupLang === "en"
                    ? "Star Dermatology"
                    : popupLang === "ja"
                      ? "スター皮膚科"
                      : popupLang === "zh"
                        ? "星皮肤科"
                        : "스타피부과의원";
                const addrLine1 =
                  popupLang === "en"
                    ? "74 Seomyeon-ro, Busanjin-gu"
                    : popupLang === "ja"
                      ? "釜山鎮区西面路74"
                      : popupLang === "zh"
                        ? "釜山镇区西面路74号"
                        : "부산진구 서면로 74";
                const addrLine2 =
                  popupLang === "en"
                    ? "Ion City Bldg 4F"
                    : popupLang === "ja"
                      ? "アイオンシティビル4F"
                      : popupLang === "zh"
                        ? "爱恩城大厦4层"
                        : "아이온시티빌딩 4층(접수·진료)";
                const exitLabel =
                  popupLang === "en"
                    ? "Exit 5·7"
                    : popupLang === "ja"
                      ? "5·7番出口"
                      : popupLang === "zh"
                        ? "5·7号出口"
                        : "서면역 5·7번 출구";
                const walkLabel =
                  popupLang === "en"
                    ? "2 min walk"
                    : popupLang === "ja"
                      ? "徒歩2分"
                      : popupLang === "zh"
                        ? "步行2分钟"
                        : "도보 2분";

                const pinEl = document.createElement("div");
                pinEl.style.cssText = "position:relative;cursor:pointer;";
                pinEl.innerHTML = `
                  <div style="width:44px;height:44px;background:#4A6FA5;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
                    <span style="transform:rotate(45deg);font-size:20px;">⭐</span>
                  </div>
                  <div id="star-map-popup" style="display:block;position:absolute;bottom:52px;left:50%;transform:translateX(-50%);background:white;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:10px 12px;min-width:200px;white-space:nowrap;z-index:9999;">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                      <span style="font-size:16px;">⭐</span>
                      <strong style="color:#1F2937;font-size:14px;">${clinicName}</strong>
                    </div>
                    <p style="color:#6B7280;font-size:12px;margin:0 0 4px;">${addrLine1}</p>
                    <p style="color:#6B7280;font-size:12px;margin:0 0 8px;">${addrLine2}</p>
                    <div style="display:flex;gap:6px;">
                      <span style="background:#EEF7F7;color:#4A6FA5;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;">${exitLabel}</span>
                      <span style="background:#FFF3E0;color:#E65100;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600;">${walkLabel}</span>
                    </div>
                    <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid white;"></div>
                  </div>
                `;

                let popupVisible = true;
                pinEl.addEventListener("click", () => {
                  const popup = pinEl.querySelector("#star-map-popup") as HTMLElement | null;
                  if (popup) {
                    popupVisible = !popupVisible;
                    popup.style.display = popupVisible ? "block" : "none";
                  }
                });

                const g = window.google;
                if (!g?.maps?.marker?.AdvancedMarkerElement) {
                  console.warn("[ContactSection] AdvancedMarkerElement not available");
                  return;
                }
                new g.maps.marker.AdvancedMarkerElement({
                  position: STAR_LOCATION,
                  map,
                  title: t.access.mapMarkerTitle,
                  content: pinEl,
                });
              }}
            />
          </div>

          {/* Info Panel */}
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
                  <p className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>
                    {addressLabel}
                  </p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {t.access.address}
                  </p>
                  <button
                    type="button"
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
                        {copiedLabel}
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        {copyAddressLabel}
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
                  <p className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>
                    {phoneLabel}
                  </p>
                  <a
                    href={lang === "ko" ? `tel:${CLINIC_TEL}` : `tel:${CLINIC_TEL_INTL}`}
                    className="font-montserrat font-bold text-lg transition-colors hover:opacity-70"
                    style={{ color: "#4A6FA5" }}
                  >
                    {lang === "ko" ? CLINIC_TEL : CLINIC_TEL_INTL}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ background: "white" }}>
              <div className="flex items-stretch gap-3">
                <Clock size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div className="flex-1">
                  <p className="font-bold text-sm mb-3" style={{ color: "#1F2937" }}>
                    {hoursLabel}
                  </p>
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
                  <p
                    className="text-xs mt-3 p-2 rounded-lg"
                    style={{ background: "#EEF7F7", color: "#4A6FA5" }}
                  >
                    {hoursNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Transit & Parking */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ background: "white" }}>
              <div className="flex items-stretch gap-3">
                <Train size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p className="font-bold text-sm mb-2" style={{ color: "#1F2937" }}>
                    {transitLabel}
                  </p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {transitDesc}
                  </p>
                </div>
              </div>
              <div className="flex items-stretch gap-3 mt-3">
                <Car size={20} style={{ color: "#81C7C9", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: "#1F2937" }}>
                    {parkingLabel}
                  </p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {parkingDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* External Map Links */}
            <div className="flex gap-2 flex-wrap">
              <a
                href="https://map.kakao.com/link/map/스타피부과,35.1572312,129.0581932"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{ background: "#FEE500", color: "#3C1E1E", minWidth: "120px" }}
              >
                <MapPin size={14} />
                {kakaoMapLabel}
              </a>
              <a
                href="https://map.naver.com/v5/search/스타피부과%20서면"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{ background: "#03C75A", color: "white", minWidth: "120px" }}
              >
                <MapPin size={14} />
                {naverMapLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
