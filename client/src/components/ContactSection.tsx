/**
 * ContactSection - 위치 및 연락처
 * 디자인: 베이지 배경, 지도 + 진료시간 + CTA
 * i18n: useLang으로 한/중/일 전환
 * 모바일 최적화: 지도 높이 확대, 주소 복사 버튼, 레이아웃 개선
 *
 * [UI개선-2026-07-22-v6] Static Maps API 이미지 방식으로 전환
 *   - iframe/JS API 렌더링 실패 문제 완전 우회
 *   - Manus 프록시를 통한 Google Static Maps API 사용
 *   - <img> 태그로 직접 표시 → 안정적인 렌더링
 *   - 지도 클릭 시 카카오맵으로 이동
 *   - reveal-heading 제거 → 섹션 헤더 항상 표시
 */

import { useState, useCallback } from "react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useMapHeight } from "@/hooks/useMapHeight";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";

// 후행 호환성을 위해 re-export 유지
export { buildMarkerPinElement } from "@/lib/mapHelpers";

// 스타피부과 위치 (부산 서면)
const STAR_LAT = 35.1572312;
const STAR_LNG = 129.0581932;

// Manus 프록시를 통한 Google Static Maps API
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.manus.ai";
const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY || "";

function buildStaticMapUrl(width: number, height: number): string {
  const scale = typeof window !== "undefined" && window.devicePixelRatio >= 2 ? 2 : 1;
  const params = new URLSearchParams({
    center: `${STAR_LAT},${STAR_LNG}`,
    zoom: "17",
    size: `${width}x${height}`,
    scale: String(scale),
    maptype: "roadmap",
    markers: `color:red|label:S|${STAR_LAT},${STAR_LNG}`,
    language: "ko",
    key: API_KEY,
  });
  return `${FORGE_BASE_URL}/v1/maps/proxy/maps/api/staticmap?${params.toString()}`;
}

// 카카오맵 링크 (지도 클릭 시 이동)
const KAKAO_MAP_URL = `https://map.kakao.com/link/map/스타피부과,${STAR_LAT},${STAR_LNG}`;

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay } = useChatConfig();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copyFailReason, setCopyFailReason] = useState<'unsupported' | 'denied' | 'error' | null>(null);
  const [mapImgError, setMapImgError] = useState(false);

  // 지도 높이 계산 로직
  const { mapHeight, isMobile, infoPanelRef } = useMapHeight();

  // CONTACT-P4-A: navigator.clipboard 전용
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
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setCopyFailReason('denied');
      } else {
        setCopyFailReason('error');
      }
    }
  }, [t.access.address]);

  // 진료시간 "휴진" 판별
  const closedLabel = t.hours.rows[t.hours.rows.length - 1]?.time ?? t.hours.rows[0]?.time ?? "";
  const locationInfo = t.access.locationInfo ?? "";
  const sectionTitle = t.access.sectionTitle ?? "";

  // 지도 이미지 크기 (컨테이너 기준)
  const mapW = isMobile ? 700 : 900;
  const mapH = isMobile ? 400 : 560;
  const staticMapUrl = buildStaticMapUrl(mapW, mapH);

  return (
    <section ref={sectionRef} id="contact" className="py-16 sm:py-24 faq-section-bg" aria-label="오시는 방법 및 연락처">
      <div className="container">
        {/* Section Header — reveal-heading 제거: 항상 표시 */}
        <div className="section-header-block">
          <span
            className="section-eyebrow"
            style={{ color: 'var(--color-gold-primary)', fontWeight: 600 }}
          >
            {locationInfo}
          </span>
          <h2
            className="section-title font-extrabold text-[clamp(1.4rem,5vw,2.6rem)]"
            style={{ color: '#1A1A1A' }}
          >
            {sectionTitle}
          </h2>
          <div className="star-divider mx-auto" />
        </div>

        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"} gap-6 sm:gap-8 ${isMobile ? "items-center" : "items-stretch"} auto-rows-max lg:auto-rows-fr`}
        >
          {/* 지도 영역 — Static Maps API 이미지 방식 */}
          <div
            className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg relative"
            style={{ height: mapHeight, minHeight: '400px', background: '#E8E4DF' }}
            aria-label={t.access.mapAriaLabel}
          >
            {!mapImgError ? (
              <a
                href={KAKAO_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오맵에서 스타피부과 위치 보기 (새 탭)"
                className="block w-full h-full"
              >
                <img
                  src={staticMapUrl}
                  alt={t.access.mapAriaLabel ?? "스타피부과 위치 지도"}
                  className="w-full h-full object-cover"
                  onError={() => setMapImgError(true)}
                  loading="lazy"
                />
                {/* 지도 클릭 안내 오버레이 */}
                <div
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
                  style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                  지도 클릭 → 카카오맵 열기
                </div>
              </a>
            ) : (
              /* 이미지 로드 실패 시 폴백 UI */
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
                <div className="text-center">
                  <p className="font-semibold text-base mb-1" style={{ color: '#1A1A1A' }}>
                    스타피부과
                  </p>
                  <p className="text-sm" style={{ color: '#555' }}>
                    부산 부산진구 부전동 257-3<br />아이온시티빌딩 4층
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  <a
                    href={KAKAO_MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-star-kakao)', color: '#3C1E1E' }}
                  >
                    카카오맵으로 보기
                  </a>
                  <a
                    href="https://map.naver.com/v5/search/스타피부과%20서면"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-star-naver)', color: '#fff' }}
                  >
                    네이버지도로 보기
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
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
