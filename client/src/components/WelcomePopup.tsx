/**
 * WelcomePopup - STAR 피부과 첫 방문 이벤트 팝업
 *
 * 반응형:
 * - 모바일(~479px): 화면 하단 바텀 시트, 드래그 닫기, 이미지 비율 유동 높이
 * - 태블릿/데스크톱(480px+): 중앙 모달, 좌우 2단 레이아웃
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageCircle, Phone, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";

interface PriceItem {
  label: string;
  original: string;
  price: string;
}

interface PopupEvent {
  id: number;
  tab: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string | null;
  priceItems: PriceItem[];
  note: string;
  imageUrl: string | null;
  accent: string;
  accentLight: string;
  sortOrder: number;
  isActive: "0" | "1";
}

// ── 드래그 훅 ─────────────────────────────────────────────────────────────────
function useDragToClose(onClose: () => void, threshold = 80) {
  const startY = useRef<number | null>(null);
  const currentY = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta < 0) return; // 위로 드래그 무시
    currentY.current = delta;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
      // 드래그 거리에 따라 투명도 감소
      sheetRef.current.style.opacity = String(Math.max(0.4, 1 - delta / 300));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
      sheetRef.current.style.transform = "";
      sheetRef.current.style.opacity = "";
    }
    if (currentY.current >= threshold) {
      onClose();
    }
    startY.current = null;
    currentY.current = 0;
  }, [onClose, threshold]);

  return { sheetRef, onTouchStart, onTouchMove, onTouchEnd };
}

// ── 이미지 자연 비율 높이 훅 ──────────────────────────────────────────────────
function useNaturalImageHeight(src: string | null, maxH = 300, minH = 140) {
  const [height, setHeight] = useState(160);
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalHeight / img.naturalWidth;
      // 컨테이너 너비를 320px 기준으로 비율 계산
      const computed = Math.round(320 * ratio);
      setHeight(Math.min(maxH, Math.max(minH, computed)));
    };
    img.src = src;
  }, [src, maxH, minH]);
  return height;
}

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: events, isLoading } = trpc.popup.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isLoading) return;
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
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
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

  const handleTabChange = (i: number) => {
    setActiveTab(i);
    setTabKey((k) => k + 1);
  };

  if (!visible || !events || events.length === 0) return null;

  const safeTab = activeTab < events.length ? activeTab : 0;
  const ev = events[safeTab] as PopupEvent;

  return isMobile
    ? <MobilePopup ev={ev} events={events} safeTab={safeTab} closing={closing} tabKey={tabKey} dismiss={dismiss} dismissToday={dismissToday} handleTabChange={handleTabChange} />
    : <DesktopPopup ev={ev} events={events} safeTab={safeTab} closing={closing} tabKey={tabKey} dismiss={dismiss} dismissToday={dismissToday} handleTabChange={handleTabChange} />;
}

// ── 공통 props ────────────────────────────────────────────────────────────────
interface PopupProps {
  ev: PopupEvent;
  events: PopupEvent[];
  safeTab: number;
  closing: boolean;
  tabKey: number;
  dismiss: () => void;
  dismissToday: () => void;
  handleTabChange: (i: number) => void;
}

// ── 모바일 팝업 ───────────────────────────────────────────────────────────────
function MobilePopup({ ev, events, safeTab, closing, tabKey, dismiss, dismissToday, handleTabChange }: PopupProps) {
  const imgHeight = useNaturalImageHeight(ev.imageUrl);
  const { sheetRef, onTouchStart, onTouchMove, onTouchEnd } = useDragToClose(dismiss);
  const { t, lang } = useLang();
  const wp = t.welcomePopup;
  const chatUrl = lang === "zh" ? "https://u.wechat.com/star2006beauty" : "https://pf.kakao.com/_HNyGC";
  const chatBg = lang === "zh" ? "#07C160" : "#FEE500";
  const chatColor = lang === "zh" ? "white" : "#1F2937";

  return (
    <div
      className={`popup-overlay${closing ? " closing" : ""}`}
      style={{ alignItems: "flex-end", padding: 0 }}
      onClick={dismiss}
    >
      <div
        ref={sheetRef}
        className={`popup-modal-mobile${closing ? " closing" : ""} w-full overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          borderRadius: "20px 20px 0 0",
          background: "#ffffff",
          maxHeight: "92dvh",
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
        }}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "#D1D5DB" }} />
        </div>

        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 py-2.5 flex-shrink-0"
          style={{ background: "#1F2937" }}
        >
          <div className="flex items-center gap-2">
            <span className="font-montserrat font-extrabold text-sm tracking-widest" style={{ color: "#81C7C9" }}>STAR</span>
            <span className="text-white text-xs font-medium opacity-70">{wp.title}</span>
          </div>
          <button onClick={dismiss} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10" aria-label={wp.dismiss}>
            <X size={15} className="text-white/70" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid #E5E7EB" }}>
          {events.map((e: PopupEvent, i: number) => (
            <button
              key={e.id}
              onClick={() => handleTabChange(i)}
              className="flex-1 py-2.5 text-xs font-semibold transition-all duration-200"
              style={safeTab === i
                ? { color: ev.accent, borderBottom: `2px solid ${ev.accent}`, background: ev.accentLight }
                : { color: "#9CA3AF", borderBottom: "2px solid transparent" }}
            >
              {e.tab}
            </button>
          ))}
        </div>

        {/* 스크롤 가능한 본문 */}
        <div key={tabKey} className="popup-tab-content flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* 이미지 - 비율에 따라 높이 유동 */}
          {ev.imageUrl && (
            <div
              className="w-full flex items-center justify-center transition-all duration-300"
              style={{
                height: `${imgHeight}px`,
                background: `linear-gradient(160deg, ${ev.accentLight} 0%, #ffffff 100%)`,
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <OptimizedImage
                src={ev.imageUrl}
                alt={ev.title}
                className="h-full object-contain py-3"
                style={{ maxWidth: "240px" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

          {/* 텍스트 + 가격표 */}
          <div className="px-5 pt-4 pb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: ev.accentLight, color: ev.accent }}>
              {ev.badge}
            </span>
            <h2 className="font-extrabold leading-tight mb-1" style={{ color: "#1F2937", fontSize: "1.35rem" }}>
              {ev.title}
            </h2>
            <p className="text-xs font-semibold tracking-widest mb-3 font-montserrat" style={{ color: ev.accent }}>
              {ev.subtitle}
            </p>
            {ev.desc && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280", whiteSpace: "pre-line" }}>
                {ev.desc}
              </p>
            )}
            <div className="space-y-2 mb-2">
              {ev.priceItems.map((item: PriceItem, i: number) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: ev.accentLight }}>
                  <span className="text-sm font-semibold" style={{ color: "#374151" }}>{item.label}</span>
                  <div className="text-right">
                    {item.original && <span className="text-xs line-through mr-2" style={{ color: "#9CA3AF" }}>{item.original}</span>}
                    <span className="text-sm font-extrabold" style={{ color: ev.accent }}>{item.price}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs pl-1" style={{ color: "#9CA3AF" }}>{ev.note}</p>
            </div>
          </div>
        </div>

        {/* CTA 버튼 (하단 고정) */}
        <div className="px-5 pt-3 pb-3 flex flex-col gap-2 flex-shrink-0" style={{ borderTop: "1px solid #F3F4F6" }}>
          <a href={chatUrl} target="_blank" rel="noopener noreferrer" onClick={dismiss}
            className="flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm justify-center"
            style={{ background: chatBg, color: chatColor }}>
            <MessageCircle size={16} />{wp.cta_kakao}
          </a>
          <div className="flex gap-2">
            <a href="tel:051-818-2300"
              className="flex-1 flex items-center gap-1.5 py-2.5 px-3 rounded-full font-semibold text-xs justify-center"
              style={{ background: "#F3F4F6", color: "#374151" }}>
              <Phone size={13} />051-818-2300
            </a>
            <a href="https://booking.naver.com/booking/13/bizes/1122956" target="_blank" rel="noopener noreferrer" onClick={dismiss}
              className="flex-1 flex items-center gap-1.5 py-2.5 px-3 rounded-full font-semibold text-xs justify-center text-white"
              style={{ background: "#03C75A" }}>
              <Calendar size={13} />{wp.cta_reserve}
            </a>
          </div>
        </div>

        {/* 하단 푸터 */}
        <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0" style={{ borderTop: "1px solid #F3F4F6" }}>
          <button onClick={dismissToday} className="text-xs" style={{ color: "#9CA3AF" }}>{wp.dismissToday}</button>
          <button onClick={dismiss} className="text-xs" style={{ color: "#9CA3AF" }}>{wp.dismiss}</button>
        </div>
      </div>
    </div>
  );
}

// ── 데스크톱 팝업 ─────────────────────────────────────────────────────────────
function DesktopPopup({ ev, events, safeTab, closing, tabKey, dismiss, dismissToday, handleTabChange }: PopupProps) {
  const { t, lang } = useLang();
  const wp = t.welcomePopup;
  const chatUrl = lang === "zh" ? "https://u.wechat.com/star2006beauty" : "https://pf.kakao.com/_HNyGC";
  const chatBg = lang === "zh" ? "#07C160" : "#FEE500";
  const chatColor = lang === "zh" ? "white" : "#1F2937";

  return (
    <div className={`popup-overlay${closing ? " closing" : ""}`} onClick={dismiss}>
      <div
        className={`popup-modal relative w-full overflow-hidden shadow-2xl${closing ? " closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "520px", borderRadius: "20px", background: "#ffffff" }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-3" style={{ background: "#1F2937" }}>
          <div className="flex items-center gap-2">
            <span className="font-montserrat font-extrabold text-sm tracking-widest" style={{ color: "#81C7C9" }}>STAR</span>
            <span className="text-white text-xs font-medium opacity-70">{wp.title}</span>
          </div>
          <button onClick={dismiss} className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/10 hover:scale-110 active:scale-95" aria-label={wp.dismiss}>
            <X size={15} className="text-white/70" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex" style={{ borderBottom: "1px solid #E5E7EB" }}>
          {events.map((e: PopupEvent, i: number) => (
            <button key={e.id} onClick={() => handleTabChange(i)}
              className="flex-1 py-2.5 text-xs font-semibold transition-all duration-250"
              style={safeTab === i
                ? { color: ev.accent, borderBottom: `2px solid ${ev.accent}`, background: ev.accentLight }
                : { color: "#9CA3AF", borderBottom: "2px solid transparent", background: "transparent" }}>
              {e.tab}
            </button>
          ))}
        </div>

        {/* 본문 (좌우 2단) */}
        <div key={tabKey} className="popup-tab-content flex" style={{ minHeight: "300px" }}>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ background: ev.accentLight, color: ev.accent }}>
                {ev.badge}
              </span>
              <h2 className="font-extrabold leading-tight mb-1" style={{ color: "#1F2937", fontSize: "1.5rem" }}>{ev.title}</h2>
              <p className="text-xs font-semibold tracking-widest mb-3 font-montserrat" style={{ color: ev.accent }}>{ev.subtitle}</p>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280", whiteSpace: "pre-line" }}>{ev.desc}</p>
            </div>
            <div className="space-y-2">
              {ev.priceItems.map((item: PriceItem, i: number) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: ev.accentLight }}>
                  <span className="text-sm font-semibold" style={{ color: "#374151" }}>{item.label}</span>
                  <div className="text-right">
                    {item.original && <span className="text-xs line-through mr-2" style={{ color: "#9CA3AF" }}>{item.original}</span>}
                    <span className="text-sm font-extrabold" style={{ color: ev.accent }}>{item.price}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs pl-1" style={{ color: "#9CA3AF" }}>{ev.note}</p>
            </div>
          </div>
          {ev.imageUrl && (
            <div className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: "200px",
                minHeight: "300px",
                background: `linear-gradient(160deg, ${ev.accentLight} 0%, #ffffff 100%)`,
                borderLeft: "1px solid #F3F4F6",
              }}>
              <OptimizedImage
                src={ev.imageUrl}
                alt={ev.title}
                style={{
                  width: ev.tab.includes("세르프") ? "204px" : "168px",
                  height: "auto",
                  maxHeight: ev.tab.includes("세르프") ? "387px" : "320px",
                  objectFit: "contain",
                  padding: "12px 8px",
                  transition: "transform 0.3s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-6 pb-4 pt-2 flex flex-col gap-2.5">
          <a href={chatUrl} target="_blank" rel="noopener noreferrer" onClick={dismiss}
            className="flex items-center gap-2 py-3 px-6 rounded-full font-bold text-sm justify-center transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: chatBg, color: chatColor }}>
            <MessageCircle size={16} />{wp.cta_kakao}
          </a>
          <div className="flex gap-2">
            <a href="tel:051-818-2300"
              className="flex-1 flex items-center gap-1.5 py-2.5 px-4 rounded-full font-semibold text-xs justify-center transition-all duration-200 hover:opacity-80"
              style={{ background: "#F3F4F6", color: "#374151" }}>
              <Phone size={13} />051-818-2300
            </a>
            <a href="https://booking.naver.com/booking/13/bizes/1122956" target="_blank" rel="noopener noreferrer" onClick={dismiss}
              className="flex-1 flex items-center gap-1.5 py-2.5 px-4 rounded-full font-semibold text-xs justify-center transition-all duration-200 hover:opacity-90 text-white"
              style={{ background: "#03C75A" }}>
              <Calendar size={13} />{wp.cta_reserve}
            </a>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid #F3F4F6" }}>
          <button onClick={dismissToday} className="text-xs transition-colors duration-150 hover:opacity-60" style={{ color: "#9CA3AF" }}>{wp.dismissToday}</button>
          <button onClick={dismiss} className="text-xs transition-colors duration-150 hover:opacity-60" style={{ color: "#9CA3AF" }}>{wp.dismiss}</button>
        </div>
      </div>
    </div>
  );
}
