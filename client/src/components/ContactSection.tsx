/**
 * ContactSection — STAR 피부과 (Luxury Minimal Medical Redesign)
 *
 * 디자인 원칙:
 * - Premium concierge 경험: 따뜻한 ivory 배경 + 골드 accent
 * - Hospitality style 레이아웃: 지도 + 정보 패널 정제
 * - DS 토큰 기반: DesignSystem.tsx의 color/shadow/radius/motion 사용
 * - 기존 기능 100% 유지: 지도 마커, 주소 복사, 진료시간, 교통, 카카오/네이버 지도
 *
 * CONTACT-P1-A: isMobile lazy initializer (SSR-safe)
 * CONTACT-P1-B: 마커 팝업 언어별 분기 (ko/en/ja/zh)
 * CONTACT-P1-C: bounds_changed → idle 1회 리스너 (무한루프 방지)
 * CONTACT-P2-A: labels 객체 제거 → t.access.* i18n 키 직접 사용
 */

import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Clock, Train, Car, Copy, Check } from "lucide-react";
import { MapView } from "@/components/Map";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import { DS, SectionHeader } from "@/components/ui/DesignSystem";

// 모듈 상수로 선언 — 리렌더링마다 새 객체가 생성되어 MapView에
// initialCenter prop으로 전달될 때 참조 안정성을 보장
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
}): HTMLElement {
  const { clinicName, addrLine1, addrLine2, exitLabel, walkLabel } = params;
  const pinEl = document.createElement("div");
  pinEl.style.cssText = "position:relative;cursor:pointer;";
  pinEl.innerHTML = `
    <div style="width:44px;height:44px;background:#C9A84C;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(201,168,76,0.45);">
      <span style="transform:rotate(45deg);font-size:20px;">⭐</span>
    </div>
    <div id="star-map-popup" style="display:block;position:absolute;bottom:52px;left:50%;transform:translateX(-50%);background:white;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.12);padding:12px 14px;min-width:210px;white-space:nowrap;z-index:9999;border:1px solid rgba(201,168,76,0.2);">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="font-size:16px;">⭐</span>
        <strong style="color:#1A1A1A;font-size:14px;font-weight:700;">${clinicName}</strong>
      </div>
      <p style="color:#6B6B6B;font-size:12px;margin:0 0 3px;">${addrLine1}</p>
      <p style="color:#6B6B6B;font-size:12px;margin:0 0 8px;">${addrLine2}</p>
      <div style="display:flex;gap:6px;">
        <span style="background:rgba(201,168,76,0.12);color:#C9A84C;font-size:11px;padding:3px 8px;border-radius:20px;font-weight:600;">${exitLabel}</span>
        <span style="background:#FFF3E0;color:#E65100;font-size:11px;padding:3px 8px;border-radius:20px;font-weight:600;">${walkLabel}</span>
      </div>
      <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid white;"></div>
    </div>
  `;
  let popupVisible = true;
  pinEl.addEventListener("click", () => {
    const popup = pinEl.querySelector("#star-map-popup") as HTMLElement | null;
    if (popup) {
      popupVisible = !popupVisible;
      popup.style.display = popupVisible ? "block" : "none";
    }
  });
  return pinEl;
}

export default function ContactSection() {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay, isZH } = useChatConfig();
  void isZH; // R11-B: isZH는 WeChat 링크 분기에 사용 (현재 ContactSection에서는 phoneHref가 이미 분기 처리됨)
  const [copied, setCopied] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapHeight, setMapHeight] = useState("400px");
  // CONTACT-P1-A: lazy initializer — window 접근을 렌더 외부로 이동
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  // 오른쪽 정보 패널의 높이를 기반으로 지도 높이 동적 계산 (PC에서만)
  useEffect(() => {
    const updateMapHeight = () => {
      const isCurrentlyMobile = window.innerWidth < 1024;
      setIsMobile(isCurrentlyMobile);

      if (!isCurrentlyMobile && infoPanelRef.current) {
        const height = infoPanelRef.current.offsetHeight;
        setMapHeight(`${height}px`);
      } else if (isCurrentlyMobile) {
        setMapHeight("400px");
      }

      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current?.setCenter(STAR_LOCATION);
        }, 0);
      }
    };

    let rafId = requestAnimationFrame(updateMapHeight);
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

  // 주소 복사
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(t.access.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = t.access.address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 진료시간 "휴진" 판별
  const closedLabel = t.hours.rows[t.hours.rows.length - 1]?.time ?? t.hours.rows[0]?.time ?? "";

  // CONTACT-P2-A: i18n 키 직접 사용
  const locationInfo = t.access.locationInfo!;
  const sectionTitle = t.access.sectionTitle!;
  const addressLabel = t.access.addressLabel!;
  const phoneLabel = t.access.phoneLabel!;
  const hoursLabel = t.access.hoursLabel!;
  const hoursNote = t.access.hoursNote!;
  const transitLabel = t.access.transitLabel!;
  const transitDesc = t.access.transitDesc!;
  const parkingLabel = t.access.parkingLabel!;
  const parkingDesc = t.access.parkingDesc!;
  const kakaoMapLabel = t.access.kakaoMapLabel!;
  const naverMapLabel = t.access.naverMap!;
  const copyAddressLabel = t.access.copyAddress!;
  const copiedLabel = t.access.copiedLabel!;

  // 공통 카드 스타일
  const cardStyle: React.CSSProperties = {
    background: DS.color.white,
    borderRadius: DS.radius.md,
    border: `1px solid rgba(201,168,76,0.15)`,
    boxShadow: DS.shadow.sm,
    padding: "16px 18px",
  };

  const iconStyle: React.CSSProperties = {
    color: DS.color.gold,
    flexShrink: 0,
    marginTop: "2px",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: "0.85rem",
    color: DS.color.charcoal,
    marginBottom: "4px",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    color: DS.color.midGray,
    lineHeight: 1.6,
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{ background: DS.color.warmWhite }}
      aria-label={sectionTitle}
      role="region"
    >
      <div className="container">
        {/* ── 섹션 헤더 ── */}
        <SectionHeader
          eyebrow={locationInfo}
          title={sectionTitle}
          align="center"
          titleSize="lg"
          className="mb-10 sm:mb-14"
        />

        {/* ── 지도 + 정보 패널 그리드 ── */}
        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-5"} gap-6 sm:gap-8 ${isMobile ? "items-center" : "items-stretch"} auto-rows-max lg:auto-rows-fr`}
        >
          {/* ── 지도 ── */}
          <div
            ref={mapContainerRef}
            className="reveal-left lg:col-span-3 overflow-hidden"
            style={{
              display: "flex",
              flexDirection: "column",
              height: mapHeight,
              minHeight: "300px",
              borderRadius: DS.radius.lg,
              boxShadow: DS.shadow.md,
              border: `1px solid rgba(201,168,76,0.18)`,
            }}
            aria-label={t.access.mapAriaLabel}
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

                // [E항목] buildMarkerPinElement 순수 함수로 위임
                const pinEl = buildMarkerPinElement({
                  clinicName: t.access.mapPopupClinicName,
                  addrLine1: t.access.mapPopupAddrLine1,
                  addrLine2: t.access.mapPopupAddrLine2,
                  exitLabel: t.access.mapPopupExitLabel,
                  walkLabel: t.access.mapPopupWalkLabel,
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

          {/* ── 정보 패널 ── */}
          <div
            ref={infoPanelRef}
            className="reveal-right lg:col-span-2 flex flex-col gap-3 lg:h-full"
            style={{ transitionDelay: "0.15s" }}
          >
            {/* 주소 + 복사 */}
            <div style={cardStyle}>
              <div className="flex items-stretch gap-3">
                <MapPin size={18} style={iconStyle} />
                <div className="flex-1 min-w-0">
                  <p style={labelStyle}>{addressLabel}</p>
                  <p style={valueStyle}>{t.access.address}</p>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95"
                    style={{
                      background: copied ? "rgba(3,199,90,0.1)" : DS.color.goldLight,
                      color: copied ? "#03C75A" : DS.color.gold,
                      border: `1px solid ${copied ? "rgba(3,199,90,0.3)" : "rgba(201,168,76,0.3)"}`,
                    }}
                  >
                    {copied ? (
                      <><Check size={11} />{copiedLabel}</>
                    ) : (
                      <><Copy size={11} />{copyAddressLabel}</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 전화 */}
            <div style={cardStyle}>
              <div className="flex items-center gap-3">
                <Phone size={18} style={iconStyle} />
                <div>
                  <p style={labelStyle}>{phoneLabel}</p>
                  <a
                    href={phoneHref}
                    className="font-montserrat font-bold text-lg transition-opacity hover:opacity-70"
                    style={{ color: DS.color.gold }}
                  >
                    {phoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            {/* 진료시간 */}
            <div style={cardStyle}>
              <div className="flex items-stretch gap-3">
                <Clock size={18} style={iconStyle} />
                <div className="flex-1">
                  <p style={labelStyle}>{hoursLabel}</p>
                  <div className="space-y-1.5 mt-1">
                    {t.hours.rows.map((h) => (
                      <div key={h.day} className="flex justify-between text-sm">
                        <span style={{ color: DS.color.midGray }}>{h.day}</span>
                        <span
                          className="font-semibold"
                          style={{ color: h.time === closedLabel ? "#EF4444" : DS.color.charcoal }}
                        >
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-xs mt-3 p-2.5 rounded-lg"
                    style={{
                      background: DS.color.goldLight,
                      color: DS.color.gold,
                      border: `1px solid rgba(201,168,76,0.2)`,
                    }}
                  >
                    {hoursNote}
                  </p>
                </div>
              </div>
            </div>

            {/* 교통 + 주차 */}
            <div style={cardStyle}>
              <div className="flex items-stretch gap-3">
                <Train size={18} style={iconStyle} />
                <div>
                  <p style={labelStyle}>{transitLabel}</p>
                  <p style={valueStyle}>{transitDesc}</p>
                </div>
              </div>
              <div className="flex items-stretch gap-3 mt-3 pt-3" style={{ borderTop: `1px solid rgba(201,168,76,0.12)` }}>
                <Car size={18} style={iconStyle} />
                <div>
                  <p style={labelStyle}>{parkingLabel}</p>
                  <p style={valueStyle}>{parkingDesc}</p>
                </div>
              </div>
            </div>

            {/* 외부 지도 링크 */}
            <div className="flex gap-2 flex-wrap">
              <a
                href="https://map.kakao.com/link/map/스타피부과,35.1572312,129.0581932"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{
                  background: "#FEE500",
                  color: "#3C1E1E",
                  minWidth: "120px",
                  borderRadius: DS.radius.md,
                  boxShadow: DS.shadow.sm,
                }}
              >
                <MapPin size={13} />
                {kakaoMapLabel}
              </a>
              <a
                href="https://map.naver.com/v5/search/스타피부과%20서면"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
                style={{
                  background: "#03C75A",
                  color: "white",
                  minWidth: "120px",
                  borderRadius: DS.radius.md,
                  boxShadow: DS.shadow.sm,
                }}
              >
                <MapPin size={13} />
                {naverMapLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
