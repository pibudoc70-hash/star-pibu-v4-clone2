/**
 * ContactSection - 위치 및 연락처
 * 디자인: 베이지 배경, 지도 + 진료시간 + CTA
 * i18n: useLang으로 한/중/일 전환
 * 모바일 최적화: 지도 높이 확대, 주소 복사 버튼, 레이아웃 개선
 *
 * [Step68] 정적 이미지 지도 → 인터랙티브 구글 지도 전환
 *   - Google Maps Embed API (iframe) 사용 — API 키 불필요
 *   - 사용자가 확대/축소/드래그 가능
 */

import { useState, useCallback } from "react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { useMapHeight } from "@/hooks/useMapHeight";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
// [Step59-B] 네이버 플레이스 상시 링크 — 리뷰·길찾기 유입 경로
import { NAVER_PLACE_URL } from "@/lib/constants";
// 후행 호환성을 위해 re-export 유지
export { buildMarkerPinElement } from "@/lib/mapHelpers";

// 스타피부과 위치 (부산 서면)
const STAR_LAT = 35.1572312;
const STAR_LNG = 129.0581932;
// 카카오맵 링크 (폴백 버튼용)
// [Step59-A] 지도 검색용 문자열. NAP 표기(도로명)와 별개로 유지.
const KAKAO_MAP_URL = `https://map.kakao.com/link/map/스타피부과,${STAR_LAT},${STAR_LNG}`;

// Google Maps Embed API URL (API 키 불필요)
const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${STAR_LAT},${STAR_LNG}&z=17&output=embed&hl=ko`;

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay } = useChatConfig();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copyFailReason, setCopyFailReason] = useState<'unsupported' | 'denied' | 'error' | null>(null);

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
      await navigator.clipboard.writeText(t.access.address ?? '부산광역시 부산진구 서면로 74 아이온시티빌딩 4층');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopyFailed(true);
      setCopyFailReason(err instanceof DOMException ? (err.name === 'NotAllowedError' ? 'denied' : 'error') : 'error');
    }
  }, [t.access.address]);

  // 섹션 제목 및 부제목
  const sectionTitle = t.access.sectionTitle ?? t.access.title ?? '오시는 길';
  const locationInfo = t.access.locationInfo ?? 'Location';
  const mapTitle = t.access.mapAriaLabel ?? `${sectionTitle} 지도`;
  const closedLabel = t.hours.rows.at(-1)?.time ?? '휴진';

  return (
    <section ref={sectionRef} id="contact" className="py-16 sm:py-24 faq-section-bg scroll-mt-24 md:scroll-mt-28" aria-label="오시는 방법 및 연락처">
      <div className="container">
        {/* Section Header */}
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
          {/* 지도 영역 — Google Maps Embed API (iframe) */}
          <div
            className="lg:col-span-3 flex flex-col rounded-2xl overflow-hidden shadow-lg relative w-full"
            style={{ height: mapHeight || '500px', minHeight: '400px' }}
            aria-label={mapTitle}
          >
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={mapTitle}
            />
            <a
              href={KAKAO_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-10 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:text-black focus:shadow"
            >
              {t.access.mapAriaLabel ?? '지도 앱에서 위치 열기'}
            </a>
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
