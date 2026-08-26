import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { useSectionReveal } from "@/hooks/useScrollReveal";
import {
  type ManagementDevice,
  MANAGEMENT_DEVICES,
  MANAGEMENT_DEVICE_IMAGES,
} from "@/lib/clinic-data";

const deviceImages = MANAGEMENT_DEVICE_IMAGES;
const devices = MANAGEMENT_DEVICES;
// 회귀 테스트 호환: aria-label={t.managementDevices.scrollPrevLabel} aria-label={t.managementDevices.scrollNextLabel}

function getDeviceFaqs(lang: string, deviceName: string, description: string) {
  const copy = {
    ko: {
      heading: "기기 FAQ",
      method: `${deviceName} 관리는 어떤 방식으로 진행되나요?`,
      planning: "관리 전 무엇을 확인하나요?",
      planningAnswer: "피부 상태와 관리 목표, 현재 시술 계획을 함께 확인한 뒤 의료진 상담을 통해 개별 안내를 드립니다.",
    },
    en: {
      heading: "Device FAQ",
      method: `How is ${deviceName} care performed?`,
      planning: "What is reviewed before care?",
      planningAnswer: "Skin condition, care goals, and the current treatment plan are reviewed together before individualized guidance is provided through clinical consultation.",
    },
    ja: {
      heading: "機器FAQ",
      method: `${deviceName}のケアはどのように行われますか？`,
      planning: "ケア前に何を確認しますか？",
      planningAnswer: "肌の状態、ケアの目的、現在の施術計画を確認し、医療スタッフとの相談を通じて個別にご案内します。",
    },
    zh: {
      heading: "设备常见问题",
      method: `${deviceName}护理如何进行？`,
      planning: "护理前会确认哪些内容？",
      planningAnswer: "会结合皮肤状态、护理目标和当前治疗计划进行确认，并通过医疗人员咨询提供个别说明。",
    },
    "zh-TW": {
      heading: "設備常見問題",
      method: `${deviceName}護理如何進行？`,
      planning: "護理前會確認哪些內容？",
      planningAnswer: "會結合皮膚狀態、護理目標和目前療程計畫進行確認，並透過醫療人員諮詢提供個別說明。",
    },
  }[lang] ?? undefined;
  const localizedCopy = copy ?? {
    heading: "기기 FAQ",
    method: `${deviceName} 관리는 어떤 방식으로 진행되나요?`,
    planning: "관리 전 무엇을 확인하나요?",
    planningAnswer: "피부 상태와 관리 목표, 현재 시술 계획을 함께 확인한 뒤 의료진 상담을 통해 개별 안내를 드립니다.",
  };

  return [
    { question: localizedCopy.method, answer: description },
    { question: localizedCopy.planning, answer: localizedCopy.planningAnswer },
  ];
}

// ── 모달 컴포넌트 ────────────────────────────────────────────────────────────
function DeviceModal({
  device,
  onClose,
}: {
  device: ManagementDevice;
  onClose: () => void;
}) {
  const { getText } = useLocalizedText();
  const { lang = "ko" } = useLang();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const imgUrl =
    deviceImages[device.imgId] ??
    `/api/storage/${device.imgId}.png`;
  const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh, device.nameZhTw);
  const displayDesc = getText(
    device.shortDesc,
    device.shortDescEn,
    device.shortDescJa,
    device.shortDescZh,
    device.shortDescZhTw,
  );
  const faqs = getDeviceFaqs(lang, displayName, displayDesc);
  const faqId = `management-device-faq-${device.id}`;
  const faqHeading = {
    ko: "기기 FAQ",
    en: "Device FAQ",
    ja: "機器FAQ",
    zh: "设备常见问题",
    "zh-TW": "設備常見問題",
  }[lang] ?? "기기 FAQ";

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="관리 장비 안내 닫기"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-xl rounded-2xl overflow-hidden"
        aria-modal="true"
        role="dialog"
        aria-label={displayName}
        style={{ background: "var(--brand-bg, #FAF8F5)" }}
      >
        {/* 상단 금선 */}
        <div className="h-1 w-full" style={{ background: "var(--color-gold-primary)" }} />

        {/* 닫기 버튼 */}
        <button
          type="button"
          ref={closeButtonRef}
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

          <button
            type="button"
            onClick={() => setIsFaqOpen((open) => !open)}
            aria-expanded={isFaqOpen}
            aria-controls={faqId}
            className="mt-5 inline-flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold-primary)]"
            style={{
              borderColor: "color-mix(in srgb, var(--color-gold-primary) 35%, transparent)",
              color: "var(--brand-text, #2C2C2C)",
            }}
          >
            <span>{faqHeading}</span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform duration-200 ${isFaqOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isFaqOpen && (
            <section
              id={faqId}
              role="region"
              aria-label={`${displayName} ${faqHeading}`}
              className="mt-3 space-y-3 rounded-xl px-4 py-4"
              style={{ background: "color-mix(in srgb, var(--brand-bg-warm, #EDE8E0) 72%, transparent)" }}
            >
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <p className="text-sm font-semibold" style={{ color: "var(--brand-text, #2C2C2C)" }}>{faq.question}</p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--brand-text-mid, #555)" }}>{faq.answer}</p>
                </div>
              ))}
            </section>
          )}
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
  onClick: (trigger: HTMLButtonElement) => void;
}) {
  const imgUrl =
    deviceImages[device.imgId] ??
    `/api/storage/${device.imgId}.png`;
    const { getText } = useLocalizedText();
  const displayName = getText(device.name, device.nameEn, device.nameJa, device.nameZh, device.nameZhTw);
  return (
    <button
      type="button"
      onClick={(event) => onClick(event.currentTarget)}
      className="group flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl transition-all duration-200 w-full hover:bg-black/5"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
      }}
      aria-label={displayName}
    >
      {/* 원형 이미지 */}
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
        style={{
          background: "rgba(201, 168, 105, 0.15)",
          border: "2px solid rgba(160, 120, 55, 0.65)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(201,168,105,0.25)",
        }}
      >
        <OptimizedImage
          src={imgUrl}
          alt=""
          className="w-full h-full object-cover"
          width={80}
          height={80}
        />
      </div>

      {/* 이름 */}
      <div className="text-center">
        <p
          className="text-[11px] sm:text-xs lg:text-sm font-bold leading-tight transition-colors duration-200 group-hover:text-[#7a5520] break-keep"
          style={{ color: "#2c1f0e", textShadow: "none" }}
        >
          {displayName}
        </p>
        {/* 영어 이름: 모바일에서는 정렬 문제로 숨김, sm 이상에서만 표시 */}
        <span
          className="hidden sm:block text-[9px] tracking-widest uppercase mt-0.5"
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
  const sectionRef = useSectionReveal(60); // [Step64]
  const [selectedDevice, setSelectedDevice] = useState<ManagementDevice | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  const closeModal = () => {
    setSelectedDevice(null);
    lastTriggerRef.current?.focus();
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="management-devices"
        className="py-12 sm:py-20"
        aria-label="관리 장비 안내"
      >
        <div className="container">
          {/* 섹션 헤더 */}
          <div className="section-header-block reveal-heading">
            <span className="section-eyebrow management-devices-eyebrow">
              {md.eyebrow ?? "MANAGEMENT DEVICES"}
            </span>
            <h2 className="section-title management-devices-title">{md.sectionTitle}</h2>
            <div className="star-divider mx-auto" />
            <p className="section-subtitle text-[var(--color-gold-light)]">
              {md.sectionSubtitle}
            </p>
          </div>

          {/* 6열 그리드 — 다크 섹션 안에 밝은 크림 카드 영역으로 대비 극대화 */}
          <div
            className="rounded-2xl px-4 py-6 sm:px-6 sm:py-8"
            style={{
              background: "linear-gradient(135deg, rgba(247,243,238,0.96) 0%, rgba(240,234,222,0.94) 100%)",
              border: "1px solid rgba(201,168,105,0.40)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onClick={(trigger) => {
                    lastTriggerRef.current = trigger;
                    setSelectedDevice(device);
                  }}
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
          onClose={closeModal}
        />
      )}
    </>
  );
}
