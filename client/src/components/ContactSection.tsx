/**
 * ContactSection - 위치 및 연락처
 * 디자인: 웜 베이지 배경의 단일 지도·연락정보 카드 + CTA
 * i18n: useLang으로 한/중/일 전환
 * 모바일 최적화: 주소 복사 버튼, 레이아웃 개선
 */

import { useState, useCallback, useRef } from "react";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import { useLang } from "@/contexts/LangContext";
import { useChatConfig } from "@/hooks/useChatConfig";
import ContactInfoPanel from "@/components/contact/ContactInfoPanel";
import ClinicMapEmbed from "@/components/contact/ClinicMapEmbed";
// 후행 호환성을 위해 re-export 유지
export { buildMarkerPinElement } from "@/lib/mapHelpers";

interface ContactSectionProps {
  showHeader?: boolean;
  desktopTone?: "default" | "doctors";
}

export default function ContactSection({ showHeader = true, desktopTone = "default" }: ContactSectionProps) {
  const sectionRef = useSectionReveal(80);
  const { t } = useLang();
  const { phoneHref, phoneDisplay } = useChatConfig();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [copyFailReason, setCopyFailReason] = useState<'unsupported' | 'denied' | 'error' | null>(null);

  const infoPanelRef = useRef<HTMLDivElement>(null);

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
  const closedLabel = t.hours.rows.at(-1)?.time ?? '휴진';
  const mapTitle = t.access.mapAriaLabel ?? '스타피부과 위치 지도';

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`pt-12 pb-16 sm:pt-16 sm:pb-24 scroll-mt-24 md:scroll-mt-28${desktopTone === "doctors" ? " contact-section--doctors" : ""}`}
      style={{ backgroundColor: "var(--contact-section-bg, var(--brand-bg-warm))" }}
      aria-label="오시는 방법 및 연락처"
    >
      <div className="container">
        {showHeader && (
          <div className="section-header-block">
            <span
              className="section-eyebrow"
              style={{ color: '#4B351F', fontWeight: 700 }}
            >
              {locationInfo}
            </span>
            <h2
              className="section-title font-extrabold text-[clamp(1.4rem,5vw,2.6rem)]"
              style={{ color: '#24180F' }}
            >
              {sectionTitle}
            </h2>
            <div className="star-divider mx-auto" />
          </div>
        )}

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_12px_36px_rgba(57,39,20,0.14)] lg:grid-cols-12 lg:items-stretch">
          <ClinicMapEmbed integrated className="reveal-left lg:col-span-7" title={mapTitle} />

          {/* Info Panel */}
          <ContactInfoPanel
            integrated
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
