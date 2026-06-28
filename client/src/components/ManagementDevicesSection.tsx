import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { DeviceCardSkeleton } from "@/components/SkeletonUI";
import {
  type ManagementDevice,
  MANAGEMENT_DEVICES,
  MANAGEMENT_DEVICE_IMAGES,
} from "@/lib/clinic-data";

// ── [REMOVED] Device 타입, CDN 상수, deviceImages 맵, devices 배열
// ──   → lib/clinic-data.ts 의 ManagementDevice / MANAGEMENT_DEVICE_IMAGES / MANAGEMENT_DEVICES 로 이동

// deviceImages → MANAGEMENT_DEVICE_IMAGES (clinic-data.ts)
// 상수명 에일리어스: 이전 코드와의 호환성 유지
const deviceImages = MANAGEMENT_DEVICE_IMAGES;

// ── 장비 데이터 (4개 언어 완전 번역) ─────────────────────────────────────────
// devices → MANAGEMENT_DEVICES (clinic-data.ts)
const devices = MANAGEMENT_DEVICES;


// ── 언어별 텍스트 선택 헬퍼 ──────────────────────────────────────────────────
// [MAINT-P1-1] getDeviceText → @/hooks/useLocalizedText 공유 hook으로 이동됨

// ── 개별 카드 컴포넌트 ──────────────────────────────────────────────────────────
function DeviceCard({ device }: { device: ManagementDevice }) {
  const imgUrl = deviceImages[device.imgId] ?? `https://d2xsxph8kpxj0f.cloudfront.net/310519663496986810/4mEoPkvqQdPU4cZqm7AUEB/${device.imgId}.png`;
  const { getText } = useLocalizedText();
  const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh);
  const displayDesc = getText(device.shortDesc, device.shortDescEn, device.shortDescJa, device.shortDescZh);

  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col text-left flex-shrink-0 h-full"
      style={{
        background: "var(--brand-bg-alt, #F5F1ED)",
        boxShadow: "none",
      }}
    >
      {/* 상단 금선 */}
      <div className="h-1 w-full" style={{ background: "var(--brand-gold, #C4A882)" }} />

      {/* 이미지 + 타이틀 가로 레이아웃 */}
      <div className="flex gap-3 px-4 py-4 md:py-5">
        {/* 원형 아이콘 */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
          style={{ background: "var(--brand-bg-warm, #EDE8E0)", border: "2px solid var(--brand-gold, #C4A882)" }}
        >
          <OptimizedImage
            src={imgUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
        </div>

        {/* 타이틀 + 영문명 */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-bold leading-tight" style={{ color: "var(--brand-text, #2C2C2C)" }}>
            {displayName}
          </h3>
          <span
            className="tracking-wide uppercase mt-1 text-xs"
            style={{ color: "var(--brand-gold, #C4A882)", fontWeight: 200, fontSize: "10px" }}
          >
            {device.nameEn}
          </span>
        </div>
      </div>

      {/* 설명 텍스트 (왼쪽 정렬) */}
      <div className="px-4 pb-4 md:pb-5">
        <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--brand-text-mid, #666666)", textAlign: "left" }}>
          {displayDesc}
        </p>
      </div>
    </div>
  );
}

// ── 섹션 컴포넌트 ──────────────────────────────────────────────────────────────
export default function ManagementDevicesSection() {
  const { t, lang } = useLang();
  const md = t.managementDevices;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // [P1-PERF] 가짜 700ms 로딩 제거: deferMount로 뷰포트 근처에서 마운트되므로 즉시 렌더

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <>
      {/* 관리 장비 섹션 */}
      <section id="management-devices" className="py-12 sm:py-20" style={{ background: "var(--brand-bg, #FAF8F5)" }} aria-label="관리 장비 안내">
        <div className="container">
          {/* 섹션 헤더 */}
            <div className="section-header-block">
              <span className="section-eyebrow management-devices-eyebrow">
                MANAGEMENT DEVICES
              </span>
              <h2 className="section-title management-devices-title">
                {md.sectionTitle}
              </h2>
              <div className="star-divider mx-auto" />
              <p className="section-subtitle text-[var(--brand-gold-deep,#A8895E)]">
                {md.sectionSubtitle}
              </p>
            </div>

            {/* 스크롤 컨른테이너 */}
            {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
          </div>
        ) : (
          <div className="relative">
            {/* 좋주 화살표 */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full shadow-md -translate-x-3"
                style={{ background: "white", border: "1px solid rgba(196,168,130,0.35)", color: "var(--brand-gold, #C4A882)" }}
                aria-label={t.managementDevices.scrollPrevLabel}
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {/* 우측 화살표 */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full shadow-md translate-x-3"
                style={{ background: "white", border: "1px solid rgba(196,168,130,0.35)", color: "var(--brand-gold, #C4A882)" }}
                aria-label={t.managementDevices.scrollNextLabel}
              >
                <ChevronRight size={18} />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 hide-scrollbar"
              style={{ scrollSnapType: "x mandatory" }}
              onScroll={updateScrollButtons}
            >
              <div
                className="grid gap-4"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${devices.length}, minmax(200px, 1fr))`,
                  width: "max-content",
                  minWidth: "100%",
                }}
              >
                {devices.map((device) => (
                  <div
                    key={device.id}
                    style={{ scrollSnapAlign: "start", width: "200px" }}
                  >
                    <DeviceCard device={device} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
