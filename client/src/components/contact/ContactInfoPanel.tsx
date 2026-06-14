/**
 * ContactInfoPanel
 * ContactSection의 우측 정보 패널 (주소/전화/진료시간/교통/지도링크).
 *
 * [R15-P1-2] ContactSection에서 분리된 서브컴포넌트.
 *            인라인 hex 색상 → CSS 변수 토큰 치환.
 */
import React from "react";
import {
  MapPin, Phone, Clock, Train, Car, Check, Copy,
} from "lucide-react";
import type { I18nContent } from "@/lib/i18n.types";

interface ContactInfoPanelProps {
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
  const addressLabel   = t.access.addressLabel  ?? "";
  const phoneLabel     = t.access.phoneLabel    ?? "";
  const hoursLabel     = t.access.hoursLabel    ?? "";
  const hoursNote      = t.access.hoursNote     ?? "";
  const transitLabel   = t.access.transitLabel  ?? "";
  const transitDesc    = t.access.transitDesc   ?? "";
  const parkingLabel   = t.access.parkingLabel  ?? "";
  const parkingDesc    = t.access.parkingDesc   ?? "";
  const kakaoMapLabel  = t.access.kakaoMapLabel ?? "카카오맵";
  const naverMapLabel  = t.access.naverMap      ?? "네이버지도";
  const copyAddressLabel = t.access.copyAddress ?? "주소 복사";
  const copiedLabel    = t.access.copiedLabel   ?? "복사됨";

  return (
    <div
      ref={infoPanelRef}
      className="reveal-right lg:col-span-2 flex flex-col gap-2 sm:gap-3 lg:h-full"
      style={{ transitionDelay: "0.15s" }}
    >
      {/* Address + 복사 버튼 */}
      <div className="p-3 sm:p-4 rounded-xl" style={{ background: 'var(--brand-bg, #FAF8F5)', border: '1px solid var(--brand-gold-pale, #F0EAE0)' }}>
        <div className="flex items-stretch gap-3">
          <MapPin size={20} style={{ color: 'var(--brand-gold, #C4A882)' }} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm mb-1 text-[var(--color-star-text)]">
              {addressLabel}
            </p>
            <p className="text-sm text-[var(--color-star-text-mid)]">
              {t.access.address}
            </p>
            <button
              type="button"
              onClick={onCopyAddress}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95"
              style={{
                background: copied ? "#E8F9EF" : copyFailed ? "#FEF2F2" : "var(--brand-gold-pale, #F0EAE0)",
                color: copied ? "#03C75A" : copyFailed ? "#EF4444" : "var(--brand-text, #2C2C2C)",
                border: `1px solid ${copied ? "#03C75A33" : copyFailed ? "#EF444433" : "color-mix(in srgb, var(--brand-gold, #C4A882) 25%, transparent)"}`,
              }}
            >
              {copied ? (
                <>
                  <Check size={12} />
                  {copiedLabel}
                </>
              ) : copyFailed ? (
                <span>
                  {copyFailReason === 'unsupported'
                    ? '직접 복사: ' + t.access.address
                    : copyFailReason === 'denied'
                    ? '권한 거부됨 — 직접 복사: ' + t.access.address
                    : '복사 실패 — 직접 복사: ' + t.access.address}
                </span>
              ) : (
                <>
                  <Copy size={12} />
                  {copyAddressLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="p-3 sm:p-4 rounded-xl" style={{ background: 'var(--brand-bg, #FAF8F5)', border: '1px solid var(--brand-gold-pale, #F0EAE0)' }}>
        <div className="flex items-center gap-3">
          <Phone size={20} style={{ color: 'var(--brand-gold, #C4A882)' }} className="flex-shrink-0" />
          <div>
            <p className="font-bold text-sm mb-1 text-[var(--color-star-text)]">
              {phoneLabel}
            </p>
            <a
              href={phoneHref}
              className="font-montserrat font-bold text-lg transition-colors hover:opacity-70 text-[var(--color-star-navy)]"
            >
              {phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="p-3 sm:p-4 rounded-xl" style={{ background: 'var(--brand-bg, #FAF8F5)', border: '1px solid var(--brand-gold-pale, #F0EAE0)' }}>
        <div className="flex items-stretch gap-3">
          <Clock size={20} style={{ color: 'var(--brand-gold, #C4A882)' }} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-sm mb-3 text-[var(--color-star-text)]">
              {hoursLabel}
            </p>
            <div className="space-y-1.5">
              {t.hours.rows.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-[var(--color-star-text-mid)]">{h.day}</span>
                  <span
                    className="font-semibold"
                    style={{ color: h.time === closedLabel ? "#EF4444" : "var(--color-star-text)" }}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 p-2 rounded-lg" style={{ background: 'var(--brand-gold-pale, #F0EAE0)', color: 'var(--brand-text, #2C2C2C)' }}>
              {hoursNote}
            </p>
          </div>
        </div>
      </div>

      {/* Transit & Parking */}
      <div className="p-3 sm:p-4 rounded-xl" style={{ background: 'var(--brand-bg, #FAF8F5)', border: '1px solid var(--brand-gold-pale, #F0EAE0)' }}>
        <div className="flex items-stretch gap-3">
          <Train size={20} style={{ color: 'var(--brand-gold, #C4A882)' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-2 text-[var(--color-star-text)]">
              {transitLabel}
            </p>
            <p className="text-sm text-[var(--color-star-text-mid)]">
              {transitDesc}
            </p>
          </div>
        </div>
        <div className="flex items-stretch gap-3 mt-3">
          <Car size={20} style={{ color: 'var(--brand-gold, #C4A882)' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-1 text-[var(--color-star-text)]">
              {parkingLabel}
            </p>
            <p className="text-sm text-[var(--color-star-text-mid)]">
              {parkingDesc}
            </p>
          </div>
        </div>
      </div>

      {/* External Map Links */}
      <div className="flex gap-2 flex-wrap">
        <a
          href="https://map.kakao.com/link/map/스타피부과,35.1572312,129.0581932"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${kakaoMapLabel} (새 탭에서 열림)`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95 bg-[var(--color-star-kakao)] text-[#3C1E1E] min-w-[120px]"
        >
          <MapPin size={14} />
          {kakaoMapLabel}
        </a>
        <a
          href="https://map.naver.com/v5/search/스타피부과%20서면"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${naverMapLabel} (새 탭에서 열림)`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 active:scale-95 bg-[var(--color-star-naver)] text-white min-w-[120px]"
        >
          <MapPin size={14} />
          {naverMapLabel}
        </a>
      </div>
    </div>
  );
}
