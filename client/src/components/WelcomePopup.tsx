/**
 * WelcomePopup - STAR 피부과 팝업 이벤트
 *
 * 변경사항:
 * - 이미지만 표시하고 클릭 시 clickUrl로 이동
 * - 모달 형태 제거, 간단한 이미지 클릭 형태로 변경
 * - 모바일/데스크톱 반응형 유지
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { withVersion } from "@/lib/imageUrl";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import OptimizedImage from "@/components/OptimizedImage";
import { useLang } from "@/contexts/useLang";

interface PopupEvent {
  id: number;
  imageUrl: string | null;
  clickUrl: string | null;
  isActive: "0" | "1";
  updatedAt?: Date | number | null;
}

function getSafePopupClickUrl(value: string): string | null {
  const url = value.trim();
  if (url.startsWith("/") && !url.startsWith("//")) return url;

  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

export default function WelcomePopup() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // 현재 언어를 서버에 전달하여 해당 언어용 팝업만 수신
  const { data: events, isLoading, error } = trpc.popup.list.useQuery(
    { lang },
    { staleTime: 5 * 60 * 1000 }
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (error) return;
    if (!events || events.length === 0) return;
    const dismissed = localStorage.getItem("star-popup-v2-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      const expiry = new Date(dismissed);
      if (new Date() > expiry) {
        localStorage.removeItem("star-popup-v2-dismissed");
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, error, events]);

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  const triggerClose = useCallback((callback?: () => void) => {
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setClosing(false);
      callback?.();
    }, 260);
  }, []);

  const dismiss = useCallback(() => triggerClose(), [triggerClose]);

  const dismissToday = () =>
    triggerClose(() => {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);
      localStorage.setItem("star-popup-v2-dismissed", expiry.toISOString());
    });

  useEffect(() => {
    if (visible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      lastFocusedRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const btn = dialogRef.current?.querySelector<HTMLElement>('button[aria-label]');
        btn?.focus();
      });
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }

    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
      lastFocusedRef.current = null;
    });
  }, [visible]);

  useEffect(() => {
    if (!visible || !dialogRef.current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current!.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (!visible || !events || events.length === 0) return null;

  // 첫 번째 활성 팝업 이벤트 찾기
  const ev = events.find((e: PopupEvent) => e.isActive === "1" && e.imageUrl) as PopupEvent | undefined;
  if (!ev) return null;

  const handleImageClick = () => {
    const safeUrl = ev.clickUrl ? getSafePopupClickUrl(ev.clickUrl) : null;
    if (safeUrl) {
      window.open(safeUrl, "_blank", "noopener,noreferrer");
    }
    dismiss();
  };

  // 팝업 이미지 URL을 프록시로 변환 + 캐시 무효화 버전 파라미터 추가
  const getProxiedImageUrl = (url: string | null, version?: Date | number | null) => {
    if (!url) return '';
    // 이미 /api/로 시작하면 그대로 사용
    if (url.startsWith('/api/')) {
      const ts = version instanceof Date ? version.getTime() : version;
      return withVersion(url, ts ?? undefined);
    }
    // CloudFront URL이면 프록시로 변환
    if (url.includes('cloudfront.net') || url.includes('d2xsxph8kpxj0f')) {
      const ts = version instanceof Date ? version.getTime() : version;
      const proxied = `/api/popup-image?url=${encodeURIComponent(url)}`;
      return withVersion(proxied, ts ?? undefined);
    }
    const ts = version instanceof Date ? version.getTime() : version;
    return withVersion(url, ts ?? undefined);
  };

  return isMobile
    ? <MobilePopup ev={ev} closing={closing} dismiss={dismiss} dismissToday={dismissToday} handleImageClick={handleImageClick} dialogRef={dialogRef} getProxiedImageUrl={(url) => getProxiedImageUrl(url, ev.updatedAt)} />
    : <DesktopPopup ev={ev} closing={closing} dismiss={dismiss} dismissToday={dismissToday} handleImageClick={handleImageClick} dialogRef={dialogRef} getProxiedImageUrl={(url) => getProxiedImageUrl(url, ev.updatedAt)} />;
}

// ── 모바일 팝업 ───────────────────────────────────────────────────────────────
interface PopupProps {
  ev: PopupEvent;
  closing: boolean;
  dismiss: () => void;
  dismissToday: () => void;
  handleImageClick: () => void;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  getProxiedImageUrl: (url: string | null) => string;
}

function MobilePopup({ ev, closing, dismiss, dismissToday, handleImageClick, dialogRef, getProxiedImageUrl }: PopupProps) {
  return (
    <div
      className={`popup-overlay${closing ? " closing" : ""}`}
      style={{ alignItems: "flex-start", padding: 0, paddingTop: "15%" }}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="팝업 닫기"
        onClick={dismiss}
      />
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label="팝업 이벤트"
        className={`popup-modal-mobile${closing ? " closing" : ""} relative z-10 w-full overflow-hidden shadow-2xl`}
        style={{
          borderRadius: "20px",
          background: "#ffffff",
          maxHeight: "80dvh",
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
        }}
      >
        {/* 이미지 */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative">
          <button
            type="button"
            onClick={handleImageClick}
            className="w-full h-full flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
            aria-label="팝업 이미지 클릭"
          >
            <OptimizedImage
              src={getProxiedImageUrl(ev.imageUrl)}
              alt="팝업 이벤트 이미지"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-t border-gray-200">
          <button type="button" onClick={dismissToday} className="text-xs text-gray-500 hover:text-gray-700">오늘 보지 않기</button>
          <button type="button" onClick={dismiss} className="text-xs text-gray-500 hover:text-gray-700">닫기</button>
        </div>
      </div>
    </div>
  );
}

// ── 데스크톱 팝업 ─────────────────────────────────────────────────────────────
function DesktopPopup({ ev, closing, dismiss, dismissToday, handleImageClick, dialogRef, getProxiedImageUrl }: PopupProps) {
  return (
    <div className={`popup-overlay${closing ? " closing" : ""}`}>
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="팝업 닫기"
        onClick={dismiss}
      />
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label="팝업 이벤트"
        className={`popup-modal relative z-10 overflow-hidden shadow-2xl${closing ? " closing" : ""}`}
        style={{
          maxWidth: "600px",
          maxHeight: "700px",
          borderRadius: "20px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 닫기 버튼 */}
        <div className="absolute top-4 right-4 z-10">
          <button type="button" onClick={dismiss} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white shadow-md transition-all" aria-label="닫기">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* 이미지 */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <button
            type="button"
            onClick={handleImageClick}
            className="w-full h-full flex items-center justify-center cursor-pointer hover:opacity-95 transition-opacity"
            aria-label="팝업 이미지 클릭"
          >
            <OptimizedImage
              src={getProxiedImageUrl(ev.imageUrl)}
              alt="팝업 이벤트 이미지"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </button>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-t border-gray-200">
          <button type="button" onClick={dismissToday} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">오늘 보지 않기</button>
          <button type="button" onClick={dismiss} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}
