/**
 * useMapHeight
 * 오른쪽 정보 패널의 높이를 기반으로 지도 높이를 동적으로 계산하는 커스텀 훅.
 * PC에서는 infoPanelRef의 높이를 따르고, 모바일에서는 고정값(400px)을 사용한다.
 *
 * CONTACT-P3-B: ContactSection.tsx에서 분리
 */
import { useState, useRef, useEffect } from "react";

const MOBILE_BREAKPOINT = 1024;
const MOBILE_MAP_HEIGHT = "400px";

interface UseMapHeightResult {
  mapHeight: string;
  isMobile: boolean;
  infoPanelRef: React.RefObject<HTMLDivElement | null>;
  mapInstanceRef: React.MutableRefObject<google.maps.Map | null>;
}

export function useMapHeight(): UseMapHeightResult {
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapHeight, setMapHeight] = useState(MOBILE_MAP_HEIGHT);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const STAR_LOCATION = { lat: 35.1572312, lng: 129.0581932 };

    const updateMapHeight = () => {
      const isCurrentlyMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(isCurrentlyMobile);
      if (!isCurrentlyMobile && infoPanelRef.current) {
        const height = infoPanelRef.current.offsetHeight;
        setMapHeight(`${height}px`);
      } else if (isCurrentlyMobile) {
        setMapHeight(MOBILE_MAP_HEIGHT);
      }
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.setCenter(STAR_LOCATION);
        }, 0);
      }
    };

    // rAF + 단일 fallback 타이머로 초기 높이 계산
    const rafId = requestAnimationFrame(updateMapHeight);
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

  return { mapHeight, isMobile, infoPanelRef, mapInstanceRef };
}
