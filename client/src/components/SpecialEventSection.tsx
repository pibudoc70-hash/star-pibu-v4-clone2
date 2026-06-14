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
import { useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
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
        className="flex items-center justify-center w-16 h-16 rounded-full mb-2"
        style={{ background: "linear-gradient(135deg, var(--brand-bg-alt, #F5F0EB) 0%, rgba(196,168,130,0.2) 100%)" }}
      >
        <Sparkles size={28} style={{ color: "var(--brand-gold, #C4A882)" }} strokeWidth={1.5} />
      </div>
      <p className="text-lg font-medium" style={{ color: "var(--brand-text, #2C2C2C)" }}>
        {i18n[lang as keyof typeof i18n]?.events.specialEmptyTitle}
      </p>
      <p className="text-sm" style={{ color: "var(--brand-text-mid, #666666)" }}>
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
    <div className="text-center mb-14 md:mb-20">
      {/* eyebrow — 공통 클래스 적용 */}
      <span className="section-eyebrow font-montserrat">FOR YOU</span>
      {/* 제목 — section-title 공통 클래스 */}
      <h2 className="section-title">SPECIAL EVENT</h2>
      {/* 서브타이틀 — section-subtitle 공통 클래스 */}
      <p className="section-subtitle">
        {subtitleMap[lang] ?? subtitleMap.ko}
      </p>
    </div>
  );
}

// ── 스켈레톤 카드 ─────────────────────────────────────────────────────────────
function EventCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "var(--brand-bg-alt, #F5F0EB)" }}>
      {/* 이미지 영역 */}
      <div className="h-48 w-full" style={{ background: "rgba(196,168,130,0.15)" }} />
      {/* 텍스트 영역 */}
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 w-16 rounded-full" style={{ background: "rgba(196,168,130,0.25)" }} />
        <div className="h-5 w-4/5 rounded" style={{ background: "rgba(196,168,130,0.2)" }} />
        <div className="h-4 w-3/5 rounded" style={{ background: "rgba(196,168,130,0.15)" }} />
        <div className="h-4 w-2/5 rounded mt-1" style={{ background: "rgba(196,168,130,0.2)" }} />
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SpecialEventSection() {
  const { lang, t } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const { data: specialEvents = [], isLoading, error, refetch } = trpc.events.special.useQuery({ lang });

  // 에러 발생 시 토스트 알림
  useEffect(() => {
    if (!error) return;
    toast.error(parseEventListError(error, lang), { duration: 5000 });
  }, [error, lang]);

  if (isLoading) {
    return (
      <section className="py-20 md:py-28" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
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
      <section id="events" className="py-20 md:py-28" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <p className="text-base" style={{ color: "var(--brand-text-mid, #666666)" }}>{parseEventListError(error, lang)}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--brand-gold, #C4A882)" }}
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
    <section id="events" className="py-20 md:py-28" style={{ background: "var(--brand-bg, #FAF8F5)" }}>
      <div className="container">
        <SectionHeader lang={lang} />
        {(specialEvents as SpecialEvent[]).length === 0 ? (
          <EventEmptyState lang={lang} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 items-start">
            {(specialEvents as SpecialEvent[]).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                getLocalizedText={getLocalizedText}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
