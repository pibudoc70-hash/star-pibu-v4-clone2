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
 * CONTACT-P3-A: 팝업 토글 로직 React state로 관리 (onToggle 콜백)
 * CONTACT-P3-B: 지도 높이 계산 로직 useMapHeight 커스텀 훅으로 분리
 * CONTACT-P4-A: document.execCommand deprecated → navigator.clipboard 전용 + 실패 시 안내
 * CONTACT-P4-B: non-null assertion(!) 제거 → optional chaining + nullish coalescing
 * CONTACT-P4-C: 지도 로드 실패 fallback UI (MapView 내부 자체 제공)
 */

import { useState, useRef, useCallback } from "react";
import { MapPin, Phone, Clock, Train, Car, Copy, Check } from "lucide-react";
import { MapView } from "@/components/Map";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useMapHeight } from "@/hooks/useMapHeight";

// 모듈 상수로 선언 — 리렌더링마다 새 객체가 생성되어 MapView에
// initialCenter prop으로 전달될 때 참조 안정성을 보장
// (새 객체 참조는 다른 객체로 판단되어 불필요한 리렌더링을 유발할 수 있음)
const STAR_LOCATION: google.maps.LatLngLiteral = { lat: 35.1572312, lng: 129.0581932 };

/**
 * [E항목] buildMarkerPinElement: 지도 마커 팝업 DOM 생성 순수 함수
 * - onMapReady 콜백에서 분리 → 단위 테스트 가능
 * - Google Maps AdvancedMarkerElement의 content prop에 전달
 */
export function buildMarkerPinElement(params: {
  clinicName: string;
  addrLine1: string;
  addrLine2: string;
  exitLabel: string;
  walkLabel: string;
  onToggle?: (visible: boolean) => void;
}): HTMLElement {
  const { clinicName, addrLine1, addrLine2, exitLabel, walkLabel, onToggle } = params;
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
  // CONTACT-P3-A: popupVisible을 클로저 변수로 유지하되 onToggle 콜백으로 React state와 연동
  let popupVisible = true;
  pinEl.addEventListener("click", () => {
    const popup = pinEl.querySelector("#star-map-popup") as HTMLElement | null;
    if (popup) {
      popupVisible = !popupVisible;
      popup.style.display = popupVisible ? "block" : "none";
      onToggle?.(popupVisible);
    }
  });
  return pinEl;
}

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay } = useChatConfig();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  // CONTACT-P3-A: 팝업 토글 상태 React state로 관리
  const [markerPopupVisible, setMarkerPopupVisible] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // CONTACT-P3-B: 지도 높이 계산 로직을 useMapHeight 커스텀 훅으로 분리
  const { mapHeight, isMobile, infoPanelRef, mapInstanceRef } = useMapHeight();

  // CONTACT-P4-A: navigator.clipboard 전용 (document.execCommand deprecated 제거)
  const handleCopyAddress = useCallback(async () => {
    setCopyFailed(false);
    if (!navigator.clipboard) {
      setCopyFailed(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(t.access.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
    }
  }, [t.access.address]);

  // 진료시간 "휴진" 판별: t.hours.rows 마지막 항목의 time 값 사용 (i18n 중앙화)
  const closedLabel = t.hours.rows[t.hours.rows.length - 1]?.time ?? t.hours.rows[0]?.time ?? "";  // 마지막 행 time 값 (휴진 표시)

  // CONTACT-P2-A: i18n 키 직접 사용 (fallback 삼항 제거 — 4개 언어 모두 키 존재 확인)
  // CONTACT-P4-B: non-null assertion(!) 제거 → optional chaining + nullish coalescing
  const locationInfo = t.access.locationInfo ?? "";
  const sectionTitle = t.access.sectionTitle ?? "";
  const addressLabel = t.access.addressLabel ?? "";
  const phoneLabel = t.access.phoneLabel ?? "";
  const hoursLabel = t.access.hoursLabel ?? "";
  const hoursNote = t.access.hoursNote ?? "";
  const transitLabel = t.access.transitLabel ?? "";
  const transitDesc = t.access.transitDesc ?? "";
  const parkingLabel = t.access.parkingLabel ?? "";
  const parkingDesc = t.access.parkingDesc ?? "";
  const kakaoMapLabel = t.access.kakaoMapLabel ?? "카카오맵";
  const naverMapLabel = t.access.naverMap ?? "네이버지도";
  const copyAddressLabel = t.access.copyAddress ?? "주소 복사";
  const copiedLabel = t.access.copiedLabel ?? "복사됨";

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
            data-popup-visible={markerPopupVisible}
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

                // [E항목] buildMarkerPinElement 순수 함수로 위임 (테스트 가능)
                // CONTACT-P3-A: onToggle 콜백으로 팝업 상태를 React state와 연동
                const pinEl = buildMarkerPinElement({
                  clinicName: t.access.mapPopupClinicName,
                  addrLine1: t.access.mapPopupAddrLine1,
                  addrLine2: t.access.mapPopupAddrLine2,
                  exitLabel: t.access.mapPopupExitLabel,
                  walkLabel: t.access.mapPopupWalkLabel,
                  onToggle: setMarkerPopupVisible,
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
                      background: copied ? "#E8F9EF" : copyFailed ? "#FEF2F2" : "#EEF7F7",
                      color: copied ? "#03C75A" : copyFailed ? "#EF4444" : "#4A6FA5",
                      border: `1px solid ${copied ? "#03C75A33" : copyFailed ? "#EF444433" : "#81C7C933"}`,
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={12} />
                        {copiedLabel}
                      </>
                    ) : copyFailed ? (
                      <span>직접 복사: {t.access.address}</span>
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
                    href={phoneHref}
                    className="font-montserrat font-bold text-lg transition-colors hover:opacity-70"
                    style={{ color: "#4A6FA5" }}
                  >
                    {phoneDisplay}
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
                aria-label={`${kakaoMapLabel} (새 탭에서 열림)`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95 bg-[#FEE500] text-[#3C1E1E] min-w-[120px]"
              >
                <MapPin size={14} />
                {kakaoMapLabel}
              </a>
              <a
                aria-label={`${naverMapLabel} (새 탭에서 열림)`}
                href="https://map.naver.com/v5/search/스타피부과%20서면"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95 bg-[#03C75A] text-white min-w-[120px]"
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
