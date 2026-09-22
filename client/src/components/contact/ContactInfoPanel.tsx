/**
 * ContactInfoPanel
 * ContactSection의 우측 정보 패널 (주소/전화/진료시간/교통/지도링크).
 *
 * 공통 ContactSection에서는 한 개의 통합 정보 패널로 렌더링한다.
 * 각 정보 블록은 독립 카드가 아닌 divider로만 분리된다.
 */
import React from "react";
import {
  MapPin, Phone, Clock, Train, Car, Check, Copy,
} from "lucide-react";
import type { I18nContent } from "@/lib/i18n.types";

interface ContactInfoPanelProps {
  integrated?: boolean;
  t: I18nContent;
  infoPanelRef: React.RefObject<HTMLDivElement | null>;
  copied: boolean;
  copyFailed: boolean;
  /** [R17-P1-3] clipboard 실패 원인 세분화 */
  copyFailReason?: 'unsupported' | 'denied' | 'error' | null;
  closedLabel: string;
  phoneHref: string;
  phoneDisplay: string;
  onCopyAddress: () => void;
}

export default function ContactInfoPanel({
  integrated = false,
  t,
  infoPanelRef,
  copied,
  copyFailed,
  copyFailReason = null,
  closedLabel,
  phoneHref,
  phoneDisplay,
  onCopyAddress,
}: ContactInfoPanelProps) {
  const addressLabel = t.access.addressLabel ?? "";
  const phoneLabel = t.access.phoneLabel ?? "";
  const hoursLabel = t.access.hoursLabel ?? "";
  const hoursNote = t.access.hoursNote ?? "";
  const transitLabel = t.access.transitLabel ?? "";
  const transitDesc = t.access.transitDesc ?? "";
  const parkingLabel = t.access.parkingLabel ?? "";
  const parkingDesc = t.access.parkingDesc ?? "";
  const kakaoMapLabel = t.access.kakaoMapLabel ?? "카카오맵";
  const naverMapLabel = t.access.naverMap ?? "네이버지도";
  const copyAddressLabel = t.access.copyAddress ?? "주소 복사";
  const copiedLabel = t.access.copiedLabel ?? "복사됨";

  const dividerColor = "1px solid color-mix(in srgb, var(--color-gold-primary) 22%, transparent)";
  const sectionStyle = integrated
    ? { borderBottom: dividerColor }
    : { background: "#FFFFFF", border: "1px solid var(--color-gold-pale)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
  const sectionClassName = integrated
    ? "px-4 py-4 sm:px-5 sm:py-5"
    : "p-3 sm:p-4 rounded-2xl";
  const rootClassName = integrated
    ? "reveal-right lg:col-span-5 flex h-full flex-col bg-[var(--brand-bg-card)]"
    : "reveal-right lg:col-span-5 flex flex-col gap-2 sm:gap-3 lg:h-full";

  return (
    <div
      ref={infoPanelRef}
      className={rootClassName}
      style={{ transitionDelay: "0.15s" }}
      data-testid="contact-info-panel"
    >
      {/* Address + 복사 버튼 */}
      <div className={sectionClassName} style={sectionStyle}>
        <div className="flex items-stretch gap-3">
          <MapPin size={20} style={{ color: "var(--color-gold-primary)" }} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-sm font-normal text-[var(--color-star-text)]">{addressLabel}</p>
            <p className="text-sm text-[var(--color-star-text)]">{t.access.address}</p>
            <button
              type="button"
              onClick={onCopyAddress}
              className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-normal transition-all duration-200 active:scale-95"
              style={{
                background: copied ? "#E8F9EF" : copyFailed ? "#FEF2F2" : "var(--color-gold-pale)",
                color: copied ? "#03C75A" : copyFailed ? "#EF4444" : "var(--brand-text, #2C2C2C)",
                border: `1px solid ${copied ? "#03C75A33" : copyFailed ? "#EF444433" : "color-mix(in srgb, var(--color-gold-primary) 25%, transparent)"}`,
              }}
            >
              {copied ? (
                <><Check size={12} />{copiedLabel}</>
              ) : copyFailed ? (
                <span>
                  {copyFailReason === 'unsupported'
                    ? `직접 복사: ${t.access.address}`
                    : copyFailReason === 'denied'
                      ? `권한 거부됨 — 직접 복사: ${t.access.address}`
                      : `복사 실패 — 직접 복사: ${t.access.address}`}
                </span>
              ) : (
                <><Copy size={12} />{copyAddressLabel}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className={sectionClassName} style={sectionStyle}>
        <div className="flex items-center gap-3">
          <Phone size={20} style={{ color: "var(--color-gold-primary)" }} className="shrink-0" />
          <div>
            <p className="mb-1 text-sm font-normal text-[var(--color-star-text)]">{phoneLabel}</p>
            <a href={phoneHref} className="font-montserrat text-lg font-normal text-[var(--color-star-navy)] transition-colors hover:opacity-70">
              {phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className={sectionClassName} style={sectionStyle}>
        <div className="flex items-stretch gap-3">
          <Clock size={20} style={{ color: "var(--color-gold-primary)" }} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="mb-3 text-sm font-normal text-[var(--color-star-text)]">{hoursLabel}</p>
            <div className="space-y-1.5">
              {t.hours.rows.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-[var(--color-star-text)]">{h.day}</span>
                  <span className="font-normal" style={{ color: h.time === closedLabel ? "#EF4444" : "var(--color-star-text)" }}>
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-[var(--color-gold-pale)] p-2 text-xs font-medium text-[#1a1a1a]">{hoursNote}</p>
          </div>
        </div>
      </div>

      {/* Transit & Parking */}
      <div className={sectionClassName} style={integrated ? undefined : sectionStyle}>
        <div className="flex items-stretch gap-3">
          <Train size={20} style={{ color: "var(--color-gold-primary)" }} className="mt-0.5 shrink-0" />
          <div>
            <p className="mb-2 text-sm font-normal text-[var(--color-star-text)]">{transitLabel}</p>
            <p className="text-sm text-[var(--color-star-text)]">{transitDesc}</p>
          </div>
        </div>
        <div className="mt-3 flex items-stretch gap-3">
          <Car size={20} style={{ color: "var(--color-gold-primary)" }} className="mt-0.5 shrink-0" />
          <div>
            <p className="mb-1 text-sm font-normal text-[var(--color-star-text)]">{parkingLabel}</p>
            <p className="text-sm text-[var(--color-star-text)]">{parkingDesc}</p>
          </div>
        </div>
      </div>

      {/* External Map Links */}
      <div
        className={`mt-auto flex flex-wrap gap-2 ${integrated ? "border-t px-4 py-4 sm:px-5 sm:py-5" : ""}`}
        style={integrated ? { borderColor: "color-mix(in srgb, var(--color-gold-primary) 22%, transparent)" } : undefined}
      >
        <a
          href="https://map.kakao.com/link/map/스타피부과,35.1572312,129.0581932"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${kakaoMapLabel} (새 탭에서 열림)`}
          className="flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-star-kakao)] px-3 py-2.5 text-sm font-normal text-[#3C1E1E] transition-all duration-200 hover:opacity-80 active:scale-95"
        >
          <MapPin size={14} />
          {kakaoMapLabel}
        </a>
        <a
          href="https://map.naver.com/v5/search/스타피부과%20서면"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${naverMapLabel} (새 탭에서 열림)`}
          className="flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-star-naver)] px-3 py-2.5 text-sm font-normal text-white transition-all duration-200 hover:opacity-80 active:scale-95"
        >
          <MapPin size={14} />
          {naverMapLabel}
        </a>
      </div>
    </div>
  );
}
