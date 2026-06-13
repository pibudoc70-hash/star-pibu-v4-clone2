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
    <div className="text-center mb-14 md:mb-20">
      {/* eyebrow — 에디토리얼 스타일 */}
      <p
        className="font-medium mb-4"
        style={{
          color: "#C9A84C",
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        FOR YOU
      </p>
      {/* 제목 — 절제된 폰트 웨이트 */}
      <h2
        className="text-navy mb-5"
        style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "0.06em",
          lineHeight: 1.15,
        }}
      >
        SPECIAL EVENT
      </h2>
      {/* 서브타이틀 — 더 어두운 톤 */}
      <p
        className="mx-auto"
        style={{
          color: "#9B8B6E",
          fontSize: "clamp(0.88rem, 2.2vw, 1rem)",
          lineHeight: 1.7,
          maxWidth: "480px",
          fontWeight: 400,
        }}
      >
        {subtitleMap[lang] ?? subtitleMap.ko}
      </p>
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

  // 에러 상태: 재시도 버튼 표시
  if (error && (specialEvents as SpecialEvent[]).length === 0) {
    const retryLabel: Record<string, string> = {
      ko: "다시 시도",
      en: "Retry",
      ja: "再試行",
      zh: "重试",
    };
    return (
      <section id="events" className="py-16 md:py-24 bg-white">
        <div className="container">
          <SectionHeader lang={lang} />
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <p className="text-base text-gray-500">{parseEventListError(error, lang)}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#C9A84C" }}
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
    <section id="events" className="py-20 md:py-28" style={{ background: "#FAFAF7" }}>
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
