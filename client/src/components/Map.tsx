/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 *     // IMPORTANT: Always use window.google (not bare `google`) inside onMapReady:
 *     const g = window.google!;
 *     new g.maps.marker.AdvancedMarkerElement({ map, position: { lat: 40.7128, lng: -74.0060 } });
 *   }}
 * />
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new window.google!.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new window.google!.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = window.google!.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new window.google!.maps.DirectionsService();
 * const directionsRenderer = new window.google!.maps.DirectionsRenderer({ map });
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new window.google!.maps.TrafficLayer().setMap(map);
 * - new window.google!.maps.TransitLayer().setMap(map);
 * - new window.google!.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - "map-attached" → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - "standalone" → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - "data-only" → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.manus.ai";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;

// 모듈 레벨 Promise 캐시 - 한 번만 로드
let mapScriptPromise: Promise<void> | null = null;

function loadMapScript(): Promise<void> {
  // marker 라이브러리까지 완전히 로드된 경우 즉시 resolve
  if (window.google?.maps?.marker?.AdvancedMarkerElement) {
    return Promise.resolve();
  }

  // 이미 로드 중이면 같은 Promise 반환 (중복 로드 방지)
  if (mapScriptPromise) return mapScriptPromise;

  mapScriptPromise = new Promise<void>((resolve, reject) => {
    // 이미 스크립트 태그가 DOM에 있으면 onload 이벤트를 기다림
    const existingScript = document.querySelector(
      `script[src*="${MAPS_PROXY_URL}"]`
    ) as HTMLScriptElement | null;

    if (existingScript) {
      // 스크립트가 이미 있으면 google.maps가 준비될 때까지 폴링
      waitForMapsReady().then(resolve).catch(reject);
      return;
    }

    const script = document.createElement('script');
    // NOTE: script.remove()를 절대 호출하지 말 것 - 제거하면 재로드 시 실패
    // NOTE: Manus Maps Proxy only supports `marker` and `places` libraries.
    // Do NOT add geocoding, geometry, or other unsupported libraries.
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      // onload 후 google.maps.Map이 실제로 준비될 때까지 폴링
      waitForMapsReady().then(resolve).catch(reject);
    };
    script.onerror = () => {
      mapScriptPromise = null; // 실패 시 재시도 허용
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return mapScriptPromise;
}

/**
 * google.maps.Map과 marker 라이브러리가 실제로 사용 가능해질 때까지 폴링
 */
function waitForMapsReady(timeoutMs = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      if (window.google?.maps?.Map) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Timed out waiting for google.maps to be ready"));
        return;
      }
      setTimeout(check, 100);
    }
    check();
  });
}

interface MapViewProps {
  className?: string;
  style?: React.CSSProperties;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  onFallback?: () => void;
  errorFallback?: ReactNode;
}

export function MapView({
  className,
  style,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
  onFallback,
  errorFallback,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const initialized = useRef(false);
  const fallbackReported = useRef(false);
  const [mapError, setMapError] = useState(false);

  // onMapReady를 ref로 저장하여 stale closure 방지
  const onMapReadyRef = useRef(onMapReady);
  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  });

  const onFallbackRef = useRef(onFallback);
  useEffect(() => {
    onFallbackRef.current = onFallback;
  });

  useEffect(() => {
    if (initialized.current) return;

    let cancelled = false;
    let mapRenderTimer: ReturnType<typeof setTimeout> | null = null;
    let tilesListener: google.maps.MapsEventListener | null = null;

    const reportFallback = () => {
      if (fallbackReported.current) return;
      fallbackReported.current = true;
      onFallbackRef.current?.();
    };

    const hasRenderedMapDom = () => {
      const mapRoot = mapContainer.current?.querySelector(".gm-style");
      return Boolean(mapRoot && mapRoot.querySelector("img, canvas"));
    };

    async function initMap() {
      try {
        await loadMapScript();

        if (cancelled) return;
        if (!mapContainer.current) {
          console.error('[MapView] Container not found after script load');
          setMapError(true);
          reportFallback();
          return;
        }
        if (mapInstance.current) return;

        initialized.current = true;

        const g = window.google;
        if (!g?.maps?.Map) {
          throw new Error('google.maps.Map not available');
        }

        const map = new g.maps.Map(mapContainer.current, {
          zoom: initialZoom,
          center: initialCenter,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          streetViewControl: true,
        });

        mapInstance.current = map;

        // 일부 네트워크·브라우저 환경에서는 Map 생성자만 성공하고 타일이 끝내
        // 렌더링되지 않아 빈 영역이 남을 수 있다. 이 경우 상위 화면의 명시적
        // 외부 지도 대체 UI로 전환한다.
        tilesListener = g.maps.event.addListener(map, 'tilesloaded', () => {
          // 일부 프록시·브라우저 환경에서는 tilesloaded 이벤트만 오고 실제 지도 DOM이
          // 생성되지 않을 수 있다. 실제 타일 또는 canvas가 확인될 때만 성공 처리한다.
          if (!hasRenderedMapDom()) return;
          if (mapRenderTimer) {
            clearTimeout(mapRenderTimer);
            mapRenderTimer = null;
          }
          if (tilesListener) {
            g.maps.event.removeListener(tilesListener);
            tilesListener = null;
          }
        });
        mapRenderTimer = setTimeout(() => {
          if (!cancelled) {
            setMapError(true);
            reportFallback();
          }
        }, 8000);

        // 지도 렌더링을 위해 리사이즈 이벤트 트리거
        setTimeout(() => {
          if (mapInstance.current && g.maps.event) {
            g.maps.event.trigger(mapInstance.current, 'resize');
            mapInstance.current.setCenter(initialCenter);
          }
        }, 300);

        if (onMapReadyRef.current) {
          onMapReadyRef.current(map);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[MapView] Failed to initialize map:', err instanceof Error ? err.message : err);
          setMapError(true);
          reportFallback();
        }
      }
    }

    // mapContainer.current가 준비될 때까지 폴링
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    const deadline = Date.now() + 5000;

    function tryInit() {
      if (cancelled) return;
      if (mapContainer.current) {
        initMap();
      } else if (Date.now() < deadline) {
        pollTimer = setTimeout(tryInit, 50);
      } else {
        console.error('[MapView] Container never mounted');
        setMapError(true);
        reportFallback();
      }
    }

    tryInit();

    return () => {
      cancelled = true;
      if (pollTimer) clearTimeout(pollTimer);
      if (mapRenderTimer) clearTimeout(mapRenderTimer);
      if (tilesListener && window.google?.maps?.event) {
        window.google.maps.event.removeListener(tilesListener);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useLang();
  const mapLabel = t.access.mapViewLabel;
  const mapAddress = t.access.mapAddressShort;

  if (mapError) {
    return (
      <div
        className={cn("w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 rounded-2xl", className)}
        style={style}
      >
        {errorFallback ?? (
          <a
            href="https://map.kakao.com/link/search/부산광역시 부산진구 서면로 74 아이온시티빌딩"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-center px-6 py-8 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#FFCD00" }}>
              <span className="text-2xl font-bold" style={{ color: "#3C1E1E" }}>K</span>
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{mapLabel}</p>
              <p className="text-gray-500 text-sm mt-1">{mapAddress}</p>
            </div>
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={cn("w-full", !style?.height && "h-[500px]", className)}
      style={style}
    />
  );
}
