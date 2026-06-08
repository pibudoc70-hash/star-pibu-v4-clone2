/**
 * useClinicMap — 클리닉 지도 초기화 훅
 *
 * [R18-P1-6] ContactSection.tsx의 onMapReady 콜백 로직을 훅으로 캡슐화
 *
 * 책임:
 * - Google Maps 인스턴스 초기화 (setCenter, setZoom)
 * - idle 이벤트 1회 리스너 등록 (무한루프 방지)
 * - AdvancedMarkerElement 생성 및 지도에 배치
 * - 마커 팝업 가시성 상태 관리 (setMarkerPopupVisible 콜백)
 *
 * 사용 예:
 * ```tsx
 * const { handleMapReady } = useClinicMap({
 *   location: STAR_LOCATION,
 *   zoom: 17,
 *   markerParams: { clinicName, addrLine1, ... },
 *   mapInstanceRef,
 *   onPopupToggle: setMarkerPopupVisible,
 * });
 * <MapView onMapReady={handleMapReady} />
 * ```
 */
import { useCallback } from "react";
import type { MutableRefObject } from "react";
import { buildMarkerPinElement } from "@/components/ContactSection";

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
  onPopupToggle: (visible: boolean) => void;
}

export function useClinicMap({
  location,
  zoom,
  markerParams,
  mapInstanceRef,
  onPopupToggle,
}: UseClinicMapOptions) {
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
        onToggle: onPopupToggle,
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
    [location, zoom, markerParams, mapInstanceRef, onPopupToggle],
  );

  return { handleMapReady };
}
