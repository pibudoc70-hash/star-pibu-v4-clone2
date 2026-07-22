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
 * [R18-P1-6] onMapReady 콜백 로직 → useClinicMap 훅으로 캡슐화
 * [R21-P0-3] mapContainerRef / markerPopupVisible 직접 소유 제거
 *            - mapContainerRef: MapView에 전달되지 않는 불필요한 ref → 제거
 *            - markerPopupVisible 상태 소유권 → useClinicMap 훅으로 이전
 *            - data-popup-visible: CSS에서 미사용 → 제거
 */

import { useState, useCallback, useEffect } from "react";
import { MapView } from "@/components/Map";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useMapHeight } from "@/hooks/useMapHeight";
import { useClinicMap } from "@/hooks/useClinicMap";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";

// 모듈 상수로 선언 — 리렌더링마다 새 객체가 생성되어 MapView에
// initialCenter prop으로 전달될 때 참조 안정성을 보장
// (새 객체 참조는 다른 객체로 판단되어 불필요한 리렌더링을 유발할 수 있음)
const STAR_LOCATION: google.maps.LatLngLiteral = { lat: 35.1572312, lng: 129.0581932 };

// [R19-P1-6] buildMarkerPinElement를 lib/mapHelpers로 이동 — 의존 방향 역전 해소
// 후행 호환성을 위해 re-export 유지
export { buildMarkerPinElement } from "@/lib/mapHelpers";

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay } = useChatConfig();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  // [R17-P1-3] clipboard 실패 원인 세분화: 'unsupported' | 'denied' | 'error'
  const [copyFailReason, setCopyFailReason] = useState<'unsupported' | 'denied' | 'error' | null>(null);

  // CONTACT-P3-B: 지도 높이 계산 로직을 useMapHeight 커스텀 훅으로 분리
  const { mapHeight, isMobile, infoPanelRef, mapInstanceRef } = useMapHeight();

  // [P0-MAP-LAZY] Map lazy mount: viewport 진입 시에만 MapView 렌더링
  // 모바일 홈페이지 초기 로드 시 지도 스크립트 로드 방지 (~100KB 감소)
  // [UI개선-2026-07-22] rootMargin 300px로 확대 → 섹션 진입 전 미리 로드
  // 스크롤 속도가 빠르거나 섹션이 화면 하단에 있을 때 지도가 표시 안 되는 문제 방지
  const { ref: mapContainerRef, isVisible: shouldRenderMap } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '300px', // 300px 전에 미리 로드 시작 (기존 100px → 확대)
    triggerOnce: true,
  });

  // [R18-P1-6] onMapReady 콜백 로직 → useClinicMap 훅으로 캡슐화
  // [R21-P0-3] markerPopupVisible 상태 소유권 → useClinicMap 훅으로 이전
  //            ContactSection은 mapContainerRef / markerPopupVisible 직접 소유 제거
  const { handleMapReady } = useClinicMap({
    location: STAR_LOCATION,
    zoom: 17,
    markerParams: {
      clinicName: t.access.mapPopupClinicName,
      addrLine1: t.access.mapPopupAddrLine1,
      addrLine2: t.access.mapPopupAddrLine2,
      exitLabel: t.access.mapPopupExitLabel,
      walkLabel: t.access.mapPopupWalkLabel,
    },
    mapInstanceRef,
  });

  // CONTACT-P4-A: navigator.clipboard 전용 (document.execCommand deprecated 제거)
  // [R17-P1-3] clipboard 실패 원인 세분화
  const handleCopyAddress = useCallback(async () => {
    setCopyFailed(false);
    setCopyFailReason(null);
    if (!navigator.clipboard) {
      setCopyFailed(true);
      setCopyFailReason('unsupported');
      return;
    }
    try {
      await navigator.clipboard.writeText(t.access.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopyFailed(true);
      // NotAllowedError: 사용자가 클립보드 권한을 거부한 경우
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setCopyFailReason('denied');
      } else {
        setCopyFailReason('error');
      }
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
    <section ref={sectionRef} id="contact" className="py-16 sm:py-24 faq-section-bg" aria-label="오시는 방법 및 연락체어">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-block reveal-heading">
          <span className="section-eyebrow">{locationInfo}</span>
          <h2 className="section-title font-extrabold text-[clamp(1.4rem,5vw,2.6rem)]">{sectionTitle}</h2>
          <div className="star-divider mx-auto" />
        </div>

        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"} gap-6 sm:gap-8 ${isMobile ? "items-center" : "items-stretch"} auto-rows-max lg:auto-rows-fr`}
        >
          {/* Map - 모바일에서 더 크게 */}
          {/* [P0-MAP-LAZY] 지도 컨드: viewport 진입 시에만 MapView 렌더링 */}
          <div
            ref={mapContainerRef}
            className="reveal-left lg:col-span-3 rounded-2xl overflow-hidden shadow-lg flex flex-col min-h-[300px]"
            style={{ height: mapHeight }}
            aria-label={t.access.mapAriaLabel}
          >
            {/* [P0-MAP-LAZY] shouldRenderMap 플래그로 조건부 렌더링 */}
            {/* [UI개선-2026-07-22] placeholder: 로딩 스피너 + 브랜드 색상 적용 */}
            {shouldRenderMap ? (
              <MapView
                className="w-full h-full"
                initialCenter={STAR_LOCATION}
                initialZoom={17}
                onMapReady={handleMapReady}
              />
            ) : (
              // 지도 로드 전 placeholder - 브랜드 색상 + 스피너
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--brand-bg-warm, #EDE8E0)' }}>
                <div className="text-center flex flex-col items-center gap-3">
                  <svg
                    className="animate-spin"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" stroke="var(--color-gold-pale)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--color-gold-primary)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--color-star-text, #2C2C2C)' }}>지도 로드 중...</span>
                </div>
              </div>
            )}
          </div>

          {/* [R15-P1-2] Info Panel → ContactInfoPanel 서브컴포넌트로 분리 */}
          <ContactInfoPanel
            t={t}
            infoPanelRef={infoPanelRef}
            copied={copied}
            copyFailed={copyFailed}
            copyFailReason={copyFailReason}
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
