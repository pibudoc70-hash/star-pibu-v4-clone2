/**
 * SpecialEventSection - SPECIAL EVENT 섹션
 *
 * 리팩토링 내역 (356줄 → 약 90줄):
 * - getLocalizedText + SpecialEvent 타입 → useLocalizedEvent Hook으로 추출
 *   → client/src/hooks/useLocalizedEvent.ts
 * - EventCardHeader + 카드 축소/확장 로직 → EventCard 컴포넌트로 분리
 *   → client/src/components/events/EventCard.tsx
 *
 * 이 파일의 책임:
 * - tRPC 데이터 페칭 (trpc.events.special)
 * - 섹션 헤더 렌더링
 * - Empty State 렌더링
 * - EventCard 목록 렌더링
 */
import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedEvent, type SpecialEvent } from "@/hooks/useLocalizedEvent";
import { i18n } from "@/lib/i18n";
import EventCard from "@/components/events/EventCard";
import { parseEventListError } from "@/lib/errorMessages";

// ── Empty State ───────────────────────────────────────────────────────────────
function EventEmptyState({ lang }: { lang: string }) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mb-2 event-empty-icon-wrap"
      >
        <Sparkles size={28} className="text-brand-gold" strokeWidth={1.5} />
      </div>
      <p className="text-lg font-medium text-brand">
        {i18n[lang as keyof typeof i18n]?.events.specialEmptyTitle}
      </p>
      <p className="text-sm text-brand-mid">
        {i18n[lang as keyof typeof i18n]?.events.specialEmptyDesc}
      </p>
    </div>
  );
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────────────────
function SectionHeader({ lang }: { lang: string }) {
  const subtitleMap: Record<string, React.ReactNode> = {
    en: "Experience premium skin care at Star's exclusive prices.",
    ja: "スターの特別価格で、ワンランク上のスキンケアを。",
    zh: "以STAR独家优惠价，享受顶级皮肤护理。",
    ko: <><span>스타만의 특별한 가격으로,</span><br /><span>한 단계 높은 피부 관리를 시작해보세요.</span></>,
  };
  return (
    <div className="section-header-block">
      {/* eyebrow — 공통 클래스 적용 */}
      <span className="section-eyebrow font-montserrat">FOR YOU</span>
      {/* 제목 — section-title 공통 클래스 */}
      <h2 className="section-title">SPECIAL EVENT</h2>
      <div className="star-divider mx-auto" />
      {/* 서브타이틀 — section-subtitle 공통 클래스 */}
      <p className="section-subtitle">
        {subtitleMap[lang] ?? subtitleMap.ko}
      </p>
    </div>
  );
}

// ── 스켈레톤 카드 ─────────────────────────────────────────────────────────────
function EventCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    // [P2-FINISH] 모바일에서는 첫 번째 카드만 표시 — 답답함 방지
    <div
      className={`rounded-2xl overflow-hidden${index > 0 ? ' hidden md:block' : ''}`}
      style={{
        background: '#ffffff',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(196,168,130,0.20)',
      }}
      aria-hidden="true"
    >
      {/* 이미지 영역 — aspect-ratio 3/2 유지로 CLS 방지 */}
      <div className="skeleton-shimmer w-full" style={{ aspectRatio: '3/2' }} />
      {/* 텍스트 영역 */}
      <div className="p-4 md:p-5 flex flex-col gap-2.5">
        {/* 배지 라벨 — 골드 픽스드 (브랜드 힌트) */}
        <div style={{ height: '11px', width: '3.2rem', borderRadius: '999px', background: 'rgba(196,168,130,0.35)' }} />
        <div className="skeleton-shimmer rounded" style={{ height: '19px', width: '80%', animationDelay: `${index * 0.08 + 0.06}s` }} />
        <div className="skeleton-shimmer rounded" style={{ height: '14px', width: '60%', animationDelay: `${index * 0.08 + 0.12}s` }} />
        <div className="skeleton-shimmer rounded" style={{ height: '14px', width: '72%', animationDelay: `${index * 0.08 + 0.16}s` }} />
        <div className="skeleton-shimmer rounded" style={{ height: '14px', width: '40%', animationDelay: `${index * 0.08 + 0.20}s` }} />
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SpecialEventSection() {
  const { lang, t } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const { data: specialEvents = [], isLoading, error, refetch } = trpc.events.special.useQuery({ lang });
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleCount = isMobile && !showMore ? 2 : specialEvents.length;
  const visibleEvents = (specialEvents as SpecialEvent[]).slice(0, visibleCount);
  const hasMoreEvents = isMobile && (specialEvents as SpecialEvent[]).length > 2;

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (!error) return;
    toast.error(parseEventListError(error, lang), { duration: 5000 });
  }, [error, lang]);

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 section-bg-offwhite" aria-label="스페셜 이벤트" aria-busy="true">
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
            <EventCardSkeleton index={0} />
            <EventCardSkeleton index={1} />
            <EventCardSkeleton index={2} />
          </div>
        </div>
      </section>
    );
  }

  // 에러 상태: 재시도 버튼 표시
  if (error && (specialEvents as SpecialEvent[]).length === 0) {
    const retryLabel: Record<string, string> = {
      ko: "다시 시도",
      en: "Retry",
      ja: "再試行",
      zh: "重试",
    };
    return (
      <section id="events" className="py-20 md:py-28 section-bg-offwhite" aria-label="스페셜 이벤트">
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <p className="text-base text-brand-mid">{parseEventListError(error, lang)}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--brand-gold, #C4A882)" } as React.CSSProperties}
            >
              <RefreshCw size={15} />
              {retryLabel[lang] ?? retryLabel.ko}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 md:py-28 section-bg-offwhite" aria-label="스페셜 이벤트">
      <div className="container">
        <SectionHeader lang={lang} />
        {(specialEvents as SpecialEvent[]).length === 0 ? (
          <EventEmptyState lang={lang} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
              {visibleEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  getLocalizedText={getLocalizedText}
                />
              ))}
            </div>
            {hasMoreEvents && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--brand-gold, #C4A882)" } as React.CSSProperties}
                >
                  {showMore ? (
                    <>
                      {lang === "ko" ? "접기" : lang === "en" ? "Show Less" : lang === "ja" ? "閉じる" : "隐藏"}
                      <ChevronDown size={18} className="rotate-180" />
                    </>
                  ) : (
                    <>
                      {lang === "ko" ? "더보기" : lang === "en" ? "Show More" : lang === "ja" ? "もっと見る" : "更多"}
                      <ChevronDown size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
