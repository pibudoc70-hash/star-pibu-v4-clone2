/**
 * useClinicMap — 클리닉 지도 초기화 훅
 *
 * [R18-P1-6] ContactSection.tsx의 onMapReady 콜백 로직을 훅으로 캡슐화
 * [R21-P0-3] markerPopupVisible 상태를 훅 내부로 이동
 *            ContactSection이 직접 소유하던 map UI 상태를 훅이 소유하도록 변경.
 *            onPopupToggle 콜백 prop 제거 → markerPopupVisible 반환값으로 교체.
 *
 * 책임:
 * - Google Maps 인스턴스 초기화 (setCenter, setZoom)
 * - idle 이벤트 1회 리스너 등록 (무한루프 방지)
 * - AdvancedMarkerElement 생성 및 지도에 배치
 * - 마커 팝업 가시성 상태 소유 및 반환 (markerPopupVisible)
 *
 * 사용 예:
 * ```tsx
 * const { handleMapReady, markerPopupVisible } = useClinicMap({
 *   location: STAR_LOCATION,
 *   zoom: 17,
 *   markerParams: { clinicName, addrLine1, ... },
 *   mapInstanceRef,
 * });
 * <MapView onMapReady={handleMapReady} />
 * ```
 */
import { useCallback, useState } from "react";
import type { MutableRefObject } from "react";
// [R19-P1-6] 의존 방향 역전 해소: ContactSection → lib/mapHelpers (순수 헬퍼 계층)
import { buildMarkerPinElement } from "@/lib/mapHelpers";

interface UseClinicMapOptions {
  location: google.maps.LatLngLiteral;
  zoom: number;
  markerParams: {
    clinicName: string;
    addrLine1: string;
    addrLine2: string;
    exitLabel: string;
    walkLabel: string;
  };
  mapInstanceRef: MutableRefObject<google.maps.Map | null>;
}

interface UseClinicMapResult {
  handleMapReady: (map: google.maps.Map) => void;
  /** [R21-P0-3] 마커 팝업 가시성 상태 — 훅이 소유, ContactSection은 읽기만 */
  markerPopupVisible: boolean;
}

export function useClinicMap({
  location,
  zoom,
  markerParams,
  mapInstanceRef,
}: UseClinicMapOptions): UseClinicMapResult {
  // [R21-P0-3] markerPopupVisible 상태를 훅 내부로 이동
  // 이전: ContactSection이 useState로 소유하고 onPopupToggle 콜백으로 전달
  // 이후: 훅이 소유하고 반환값으로 노출 (ContactSection은 읽기만)
  const [markerPopupVisible, setMarkerPopupVisible] = useState(true);

  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      mapInstanceRef.current = map;
      map.setCenter(location);
      map.setZoom(zoom);

      // CONTACT-P1-C: idle 이벤트 1회만 사용 (무한루프 방지)
      if (window.google?.maps) {
        window.google.maps.event.addListenerOnce(map, "idle", () => {
          map.setCenter(location);
        });
      }

      // [E항목] buildMarkerPinElement 순수 함수로 위임 (테스트 가능)
      const pinEl = buildMarkerPinElement({
        ...markerParams,
        onToggle: setMarkerPopupVisible,
      });

      const g = window.google;
      if (!g?.maps?.marker?.AdvancedMarkerElement) {
        console.warn("[useClinicMap] AdvancedMarkerElement not available");
        return;
      }

      new g.maps.marker.AdvancedMarkerElement({
        position: location,
        map,
        title: markerParams.clinicName,
        content: pinEl,
      });
    },
    [location, zoom, markerParams, mapInstanceRef],
  );

  return { handleMapReady, markerPopupVisible };
}
