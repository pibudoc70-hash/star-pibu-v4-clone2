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
import { Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLang } from "@/contexts/LangContext";
import { useLocalizedEvent, type SpecialEvent } from "@/hooks/useLocalizedEvent";
import { i18n } from "@/lib/i18n";
import EventCard from "@/components/events/EventCard";

// ── Empty State ───────────────────────────────────────────────────────────────
function EventEmptyState({ lang }: { lang: string }) {
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mb-2"
        style={{ background: "linear-gradient(135deg, #f6efe0 0%, #ede0c4 100%)" }}
      >
        <Sparkles size={28} style={{ color: "#C9A84C" }} strokeWidth={1.5} />
      </div>
      <p className="text-lg font-medium" style={{ color: "#4B5563" }}>
        {i18n[lang as keyof typeof i18n]?.events.specialEmptyTitle}
      </p>
      <p className="text-sm" style={{ color: "#9CA3AF" }}>
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
    <div className="text-center mb-12 md:mb-16">
      <p className="text-sm font-medium text-gold mb-2">FOR YOU</p>
      <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">SPECIAL EVENT</h2>
      <p className="text-lg text-gold">{subtitleMap[lang] ?? subtitleMap.ko}</p>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function SpecialEventSection() {
  const { lang, t } = useLang();
  const { getLocalizedText } = useLocalizedEvent();
  const { data: specialEvents = [], isLoading } = trpc.events.special.useQuery({ lang });

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <SectionHeader lang={lang} />
          <p className="text-center text-lg text-gold">
            {t.events.loading}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 md:py-24 bg-white">
      <div className="container">
        <SectionHeader lang={lang} />
        {(specialEvents as SpecialEvent[]).length === 0 ? (
          <EventEmptyState lang={lang} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
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
