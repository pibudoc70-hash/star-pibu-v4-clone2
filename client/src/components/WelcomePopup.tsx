/**
 * WelcomePopup - STAR 피부과 팝업 이벤트
 *
 * 변경사항:
 * - 이미지만 표시하고 클릭 시 clickUrl로 이동
 * - 모달 형태 제거, 간단한 이미지 클릭 형태로 변경
 * - 모바일/데스크톱 반응형 유지
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import OptimizedImage from "@/components/OptimizedImage";

interface PopupEvent {
  id: number;
  imageUrl: string | null;
  clickUrl: string | null;
  isActive: "0" | "1";
}

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const { data: events, isLoading, error } = trpc.popup.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (error) {
      console.warn("[WelcomePopup] 팡업 데이터 로드 실패:", error.message);
    }
  }, [error]);

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
  }, [isLoading, events]);

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      lastFocusedRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const btn = dialogRef.current?.querySelector<HTMLElement>('button[aria-label]');
        btn?.focus();
      });
    } else {
      document.body.style.overflow = "";
      requestAnimationFrame(() => {
        lastFocusedRef.current?.focus();
        lastFocusedRef.current = null;
      });
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  useEffect(() => {
    if (!visible || !dialogRef.current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

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

  if (!visible || !events || events.length === 0) return null;

  // 첫 번째 활성 팝업 이벤트 찾기
  const ev = events.find((e: PopupEvent) => e.isActive === "1" && e.imageUrl) as PopupEvent | undefined;
  if (!ev) return null;

  const handleImageClick = () => {
    if (ev.clickUrl) {
      window.open(ev.clickUrl, '_blank');
    }
    dismiss();
  };

  return isMobile
    ? <MobilePopup ev={ev} closing={closing} dismiss={dismiss} dismissToday={dismissToday} handleImageClick={handleImageClick} dialogRef={dialogRef} />
    : <DesktopPopup ev={ev} closing={closing} dismiss={dismiss} dismissToday={dismissToday} handleImageClick={handleImageClick} dialogRef={dialogRef} />;
}

// ── 모바일 팝업 ───────────────────────────────────────────────────────────────
interface PopupProps {
  ev: PopupEvent;
  closing: boolean;
  dismiss: () => void;
  dismissToday: () => void;
  handleImageClick: () => void;
  dialogRef: React.RefObject<HTMLDivElement | null>;
}

function MobilePopup({ ev, closing, dismiss, dismissToday, handleImageClick, dialogRef }: PopupProps) {
  return (
    <div
      className={`popup-overlay${closing ? " closing" : ""}`}
      style={{ alignItems: "flex-start", padding: 0, paddingTop: "15%" }}
      onClick={dismiss}
    >
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label="팝업 이벤트"
        className={`popup-modal-mobile${closing ? " closing" : ""} w-full overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
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
              src={ev.imageUrl || ""}
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
function DesktopPopup({ ev, closing, dismiss, dismissToday, handleImageClick, dialogRef }: PopupProps) {
  return (
    <div className={`popup-overlay${closing ? " closing" : ""}`} onClick={dismiss}>
      <div
        ref={dialogRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label="팝업 이벤트"
        className={`popup-modal relative overflow-hidden shadow-2xl${closing ? " closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
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
              src={ev.imageUrl || ""}
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
