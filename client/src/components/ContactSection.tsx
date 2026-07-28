/**
 * ContactSection - 위치 및 연락처
 * 디자인: 베이지 배경, 지도 + 진료시간 + CTA
 * i18n: useLang으로 한/중/일 전환
 * 모바일 최적화: 지도 높이 확대, 주소 복사 버튼, 레이아웃 개선
 *
 * [Step67-E] tRPC base64 → GET /api/staticmap.png 전환
 *   - trpc.location.getStaticMapUrl 제거
 *   - <img src="/api/staticmap.png?w=...&h=...&s=1"> 직접 사용
 *   - 브라우저 캐시 + CDN immutable 캐시 활성화
 *   - 전송량 약 25% 감소 (base64 오버헤드 제거)
 */

import { useState, useCallback, useMemo, useEffect } from "react";
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
// 구글 지도 링크 (지도 이미지 클릭 시 이동)
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/1trKAhUzLhw3gMFG9";

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay } = useChatConfig();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copyFailReason, setCopyFailReason] = useState<'unsupported' | 'denied' | 'error' | null>(null);

  // 지도 높이 계산 로직
  const { mapHeight, isMobile, infoPanelRef } = useMapHeight();

  // [Step67-E] GET /api/staticmap.png?w=...&h=...&s=1
  // isMobile 변경으로 src가 바뀌면 에러 상태를 초기화한다
  const mapSrc = useMemo(
    () => `/api/staticmap.png?w=${isMobile ? 700 : 900}&h=${isMobile ? 400 : 560}&s=1`,
    [isMobile],
  );
  const [mapImgError, setMapImgError] = useState(false);
  useEffect(() => { setMapImgError(false); }, [mapSrc]);

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

  return (
    <section ref={sectionRef} id="contact" className="py-16 sm:py-24 faq-section-bg scroll-mt-24 md:scroll-mt-28" aria-label="오시는 방법 및 연락처">
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
          {/* 지도 영역 — [Step67-E] GET /api/staticmap.png 직접 사용 */}
          <div
            className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg relative"
            style={{ height: mapHeight, minHeight: '400px', background: '#E8E4DF' }}
            aria-label={t.access.mapAriaLabel}
          >
            {!mapImgError ? (
              <a
                href={GOOGLE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="구글 지도에서 스타피부과 위치 보기 (새 탭)"
                className="block w-full h-full"
              >
                <img
                  src={mapSrc}
                  alt={t.access.mapAriaLabel}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={() => setMapImgError(true)}
                />
                {/* 지도 클릭 안내 오버레이 */}
                <div
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
                  style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                  지도 클릭 → 구글 지도 열기
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
                    {/* [Step59-A] NAP 일관성: 지번주소 → 도로명주소 통일 */}
                    부산광역시 부산진구 서면로 74<br />아이온시티빌딩 4층
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
                    {t.access.kakaoMapLabel ?? "KakaoMap"}
                  </a>
                  <a
                    href="https://map.naver.com/v5/search/스타피부과%20서면"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-star-naver)', color: '#fff' }}
                  >
                    {t.access.naverMap ?? "Naver Map"}
                  </a>
                  {/* [Step59-B] 네이버 플레이스 상시 링크 */}
                  <a
                    href={NAVER_PLACE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-star-naver)', color: '#fff' }}
                  >
                    {t.contact.naverPlaceLabel ?? "네이버 플레이스"}
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
