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
import { MapView } from "@/components/Map";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useMapHeight } from "@/hooks/useMapHeight";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";

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
  // [R15-P1-2] addressLabel/phoneLabel 등 Info Panel 전용 변수는 ContactInfoPanel로 이전
  const locationInfo = t.access.locationInfo ?? "";
  const sectionTitle = t.access.sectionTitle ?? "";

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

          {/* [R15-P1-2] Info Panel → ContactInfoPanel 서브컴포넌트로 분리 */}
          <ContactInfoPanel
            t={t}
            infoPanelRef={infoPanelRef}
            copied={copied}
            copyFailed={copyFailed}
            closedLabel={closedLabel}
            phoneHref={phoneHref}
            phoneDisplay={phoneDisplay}
            onCopyAddress={handleCopyAddress}
          />
        </div>
      </div>
    </section>
  );
}
