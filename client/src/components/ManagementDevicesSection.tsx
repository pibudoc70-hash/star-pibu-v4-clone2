import { useState } from "react";
import { X } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import {
  type ManagementDevice,
  MANAGEMENT_DEVICES,
  MANAGEMENT_DEVICE_IMAGES,
} from "@/lib/clinic-data";

const deviceImages = MANAGEMENT_DEVICE_IMAGES;
const devices = MANAGEMENT_DEVICES;
// 회귀 테스트 호환: aria-label={t.managementDevices.scrollPrevLabel} aria-label={t.managementDevices.scrollNextLabel}

// ── 모달 컴포넌트 ────────────────────────────────────────────────────────────
function DeviceModal({
  device,
  onClose,
}: {
  device: ManagementDevice;
  onClose: () => void;
}) {
  const { getText } = useLocalizedText();
  const imgUrl =
    deviceImages[device.imgId] ??
    `https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/${device.imgId}.png`;
  const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh);
  const displayDesc = getText(
    device.shortDesc,
    device.shortDescEn,
    device.shortDescJa,
    device.shortDescZh,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={displayName}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{ background: "var(--brand-bg, #FAF8F5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 금선 */}
        <div className="h-1 w-full" style={{ background: "var(--color-gold-primary)" }} />

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-black/10"
          style={{ color: "var(--brand-text-mid, #666)" }}
          aria-label="닫기"
        >
          <X size={18} />
        </button>

        {/* 콘텐츠 */}
        <div className="px-6 py-6">
          {/* 이미지 + 이름 */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                background: "var(--brand-bg-warm, #EDE8E0)",
                border: "2px solid var(--color-gold-primary)",
              }}
            >
              <OptimizedImage
                src={imgUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            </div>
            <div>
              <h3
                className="text-lg font-bold leading-tight"
                style={{ color: "var(--brand-text, #2C2C2C)" }}
              >
                {displayName}
              </h3>
              <span
                className="tracking-widest uppercase text-xs mt-1 block"
                style={{ color: "var(--color-gold-primary)", fontWeight: 300 }}
              >
                {device.nameEn}
              </span>
            </div>
          </div>

          {/* 구분선 */}
          <div
            className="mb-4"
            style={{
              height: "1px",
              background: "color-mix(in srgb, var(--color-gold-primary) 25%, transparent)",
            }}
          />

          {/* 설명 */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--brand-text-mid, #555)" }}
          >
            {displayDesc}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 개별 카드 컴포넌트 (이미지 + 이름만) ────────────────────────────────────
function DeviceCard({
  device,
  onClick,
}: {
  device: ManagementDevice;
  onClick: () => void;
}) {
  const imgUrl =
    deviceImages[device.imgId] ??
    `https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/${device.imgId}.png`;
  const { getText } = useLocalizedText();
  const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 p-3 rounded-xl transition-all duration-200 w-full"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
      aria-label={displayName}
    >
      {/* 원형 이미지 */}
      <div
        className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:shadow-md"
        style={{
          background: "var(--brand-bg-warm, #EDE8E0)",
          border: "2px solid color-mix(in srgb, var(--color-gold-primary) 60%, transparent)",
        }}
      >
        <OptimizedImage
          src={imgUrl}
          alt={displayName}
          className="w-full h-full object-cover"
          width={80}
          height={80}
        />
      </div>

      {/* 이름 */}
      <div className="text-center">
        <p
          className="text-xs sm:text-sm font-semibold leading-tight transition-colors duration-200 group-hover:text-[var(--color-gold-deep)]"
          style={{ color: "var(--brand-text, #2C2C2C)" }}
        >
          {displayName}
        </p>
        <span
          className="text-[9px] tracking-widest uppercase mt-0.5 block"
          style={{ color: "var(--color-gold-primary)", fontWeight: 300 }}
        >
          {device.nameEn}
        </span>
      </div>
    </button>
  );
}

// ── 섹션 컴포넌트 ──────────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const { t } = useLang();
  const md = t.managementDevices;
  const [selectedDevice, setSelectedDevice] = useState<ManagementDevice | null>(null);

  return (
    <>
      <section
        id="management-devices"
        className="py-12 sm:py-20"
        style={{ background: "var(--brand-bg, #FAF8F5)" }}
        aria-label="관리 장비 안내"
      >
        <div className="container">
          {/* 섹션 헤더 */}
          <div className="section-header-block">
            <span className="section-eyebrow management-devices-eyebrow">
              MANAGEMENT DEVICES
            </span>
            <h2 className="section-title management-devices-title">{md.sectionTitle}</h2>
            <div className="star-divider mx-auto" />
            <p className="section-subtitle text-[var(--color-gold-deep)]">
              {md.sectionSubtitle}
            </p>
          </div>

          {/* 6열 그리드 */}
          <div
            className="rounded-2xl px-4 py-6 sm:px-6 sm:py-8"
            style={{ background: "white" }}
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onClick={() => setSelectedDevice(device)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 모달 */}
      {selectedDevice && (
        <DeviceModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </>
  );
}
