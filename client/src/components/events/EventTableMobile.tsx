/**
 * EventTableMobile - 모바일 전용 이벤트 카드
 *
 * 하나의 카드 안에 모든 시술 목록을 표시
 * 각 시술 행의 "상세보기" 버튼 클릭 시 모달에서 상세 정보 표시
 */
import { useState, useEffect } from "react";
import { ChevronRight, X, Sparkles } from "lucide-react";
import type { SpecialEvent, PriceRow } from "@/hooks/useLocalizedEvent";
import { useLang } from "@/contexts/LangContext";
import OptimizedImage from "@/components/OptimizedImage";
import { useChatConfig } from "@/hooks/useChatConfig";

interface EventTableMobileProps {
  events: SpecialEvent[];
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
}

interface EventDetailModalProps {
  event: SpecialEvent | null;
  getLocalizedText: (event: SpecialEvent, field: "title" | "subtitle" | "desc" | "productName") => string;
  onClose: () => void;
}

// ── 상세 정보 모달 ─────────────────────────────────────────────────────────────
function EventDetailModal({ event, getLocalizedText, onClose }: EventDetailModalProps) {
  const { lang } = useLang();
  const { chatUrl, chatBg, chatColor, isZH, isJA } = useChatConfig();

  // 모달 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    if (!event) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [event]);

  if (!event) return null;

  let priceRows: PriceRow[] = [];
  if (event.priceRows) {
    try { priceRows = JSON.parse(event.priceRows) as PriceRow[]; } catch { /* noop */ }
  }

  const chatLabel = isZH ? "微信和我联系" : isJA ? "LINEで相談" : lang === "en" ? "Chat Consultation" : "카카오 상담";
  const phoneHref = lang === "ko" ? "tel:051-818-2300" : "tel:+82-51-818-2300";
  const phoneLabel = lang === "ko" ? "051-818-2300" : "+82-51-818-2300";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center relative"
      style={{ touchAction: "none" }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="이벤트 상세 닫기"
        onClick={onClose}
      />
      <div
        className="relative bg-white w-full rounded-t-3xl overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-detail-modal-title"
        style={{ maxHeight: "88dvh", WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* 헤더 */}
        <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <h3 id="event-detail-modal-title" className="text-base font-bold text-gray-900 leading-tight">
            {getLocalizedText(event, "title")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="닫기"
          >
            <X size={16} className="text-gray-600" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-5 space-y-4">
          {/* 이미지 */}
          {event.imageUrl && (
            <div className="rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "3/2" }}>
              <OptimizedImage
                src={event.imageUrl}
                alt={getLocalizedText(event, "title")}
                className="w-full h-full object-cover"
                width={600}
                height={400}
                priority={false}
              />
            </div>
          )}

          {/* 한 줄 카피 */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {getLocalizedText(event, "subtitle")}
          </p>

          {/* 상세 설명 */}
          {event.desc && (
            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
              {event.desc}
            </p>
          )}
          {event.content && (
            <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
              {event.content}
            </p>
          )}

          {/* 가격 정보 */}
          <div className="rounded-xl overflow-hidden border border-gray-100">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">가격 안내</span>
            </div>
            <div className="divide-y divide-gray-100">
              {priceRows.length > 0 ? (
                priceRows.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3">
                    <span className="text-xs text-gray-600">{row.label}</span>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold text-sm" style={{ color: "var(--color-gold-deep)" }}>
                          {row.discountPrice.toLocaleString()}원
                        </span>
                        {row.normalPrice > 0 && (
                          <span className="line-through text-xs text-gray-400">
                            {row.normalPrice.toLocaleString()}원
                          </span>
                        )}
                      </div>
                      <span
                        className="inline-flex items-center px-1.5 py-0.5 rounded font-medium"
                        style={{
                          fontSize: "0.62rem",
                          letterSpacing: "0.04em",
                          color: "var(--color-gold-dark, #7A5C35)",
                          background: "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-gold-primary) 30%, transparent)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        VAT 포함
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-gray-600">{event.productName || "시술"}</span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-sm" style={{ color: "var(--color-gold-deep)" }}>
                        {event.discountPrice.toLocaleString()}원
                      </span>
                      {event.normalPrice > 0 && (
                        <span className="line-through text-xs text-gray-400">
                          {event.normalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-medium"
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "0.04em",
                        color: "var(--color-gold-dark, #7A5C35)",
                        background: "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-gold-primary) 30%, transparent)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      VAT 포함
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA 버튼 — 모바일 하단 퀘스타 바(56px) + safe-area 만큼 하단 여백 */}
          <div className="flex gap-3 pt-2" style={{ paddingBottom: "calc(56px + env(safe-area-inset-bottom, 0px) + 12px)" }}>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 font-semibold rounded-xl text-center text-sm"
              style={{ background: chatBg, color: chatColor }}
            >
              {chatLabel}
            </a>
            <a
              href={phoneHref}
              className="flex-1 px-4 py-3 font-medium rounded-xl text-center text-sm border border-gray-200"
              style={{ color: "var(--brand-text-mid, #666666)" }}
            >
              {phoneLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 카드 컴포넌트 ─────────────────────────────────────────────────────────
export default function EventTableMobile({ events, getLocalizedText }: EventTableMobileProps) {
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);

  return (
    <>
      {/* 하나의 카드 안에 모든 시술 목록 */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          borderColor: "var(--color-gold-light)",
          background: "var(--brand-bg-card, #FDFAF7)",
        }}
      >
        {/* 카드 헤더 */}
        <div
          className="flex items-center gap-2 px-5 py-4 border-b"
          style={{
            borderColor: "var(--color-gold-light)",
            background: "linear-gradient(135deg, color-mix(in srgb, var(--color-gold-primary) 12%, transparent) 0%, color-mix(in srgb, var(--color-gold-primary) 4%, transparent) 100%)",
          }}
        >
          <Sparkles size={14} style={{ color: "var(--color-gold-primary)" }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--color-gold-primary)" }}>
            Special Event
          </span>
        </div>

        {/* 시술 목록 */}
        <div className="divide-y" style={{ borderColor: "var(--color-gold-light)" }}>
          {events.map((event) => {
            let priceRows: PriceRow[] = [];
            if (event.priceRows) {
              try { priceRows = JSON.parse(event.priceRows) as PriceRow[]; } catch { /* noop */ }
            }
            const displayPrice =
              priceRows.length > 0 ? priceRows[0].discountPrice : event.discountPrice;
            const normalPrice =
              priceRows.length > 0 ? priceRows[0].normalPrice : event.normalPrice;

            return (
              <div
                key={event.id}
                className="flex items-center gap-3 px-5 py-4 active:bg-gray-50 transition-colors"
              >
                {/* 시술명 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getLocalizedText(event, "title")}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold" style={{ color: "var(--color-gold-deep)" }}>
                        {displayPrice.toLocaleString()}원
                      </span>
                      {normalPrice > 0 && (
                        <span className="line-through text-xs text-gray-400">
                          {normalPrice.toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded font-medium"
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.04em",
                        color: "var(--color-gold-dark, #7A5C35)",
                        background: "color-mix(in srgb, var(--color-gold-primary) 12%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-gold-primary) 30%, transparent)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      VAT 포함
                    </span>
                  </div>
                </div>

                {/* 상세보기 버튼 */}
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95"
                  style={{
                    borderColor: "var(--color-gold-light)",
                    color: "var(--color-gold-deep)",
                    background: "color-mix(in srgb, var(--color-gold-primary) 8%, transparent)",
                  }}
                  aria-label={`${getLocalizedText(event, "title")} 자세히 보기`}
                >
                  상세
                  <ChevronRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 상세 정보 모달 */}
      <EventDetailModal
        event={selectedEvent}
        getLocalizedText={getLocalizedText}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}
