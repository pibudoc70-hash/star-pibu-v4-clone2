/**
 * HeroStatsStrip — Hero 통계 스트립 (3개 수치)
 *
 * 레이아웃:
 * - 데스크톱: 3열 나란히
 * - 모바일: 상단 2열 + 하단 1열 중앙
 *
 * IntersectionObserver ref를 외부에서 주입받아 카운트업 트리거
 */
import React from "react";
import { HeroStatItem } from "./HeroStatItem";

interface StatData {
  value: string;
  unit: string;
  label: string;
  isDone: boolean;
  animationDelay: string;
}

interface HeroStatsStripProps {
  statsRef: React.RefObject<HTMLDivElement | null>;
  stats: [StatData, StatData, StatData];
}

export function HeroStatsStrip({ statsRef, stats }: HeroStatsStripProps) {
  const [years, cases, types] = stats;

  return (
    <div
      ref={statsRef}
      style={{
        marginBottom: "clamp(1rem, 3vh, 2.5rem)",
        width: "100%",
      }}
    >
      {/* 데스크톱: 3열 / 모바일: 상단 2열 */}
      <div
        className="flex justify-center"
        style={{ gap: "clamp(1rem, 5vw, 3rem)", paddingTop: "30px" }}
      >
        <HeroStatItem {...years} />
        <HeroStatItem {...cases} />
        {/* 데스크톱에서만 3번째 통계 같은 행에 표시 */}
        <HeroStatItem {...types} className="hidden sm:block" />
      </div>

      {/* 모바일에서만 3번째 통계 하단 중앙에 표시 */}
      <div
        className="flex justify-center sm:hidden"
        style={{ marginTop: "clamp(0.5rem, 1.5vh, 0.75rem)" }}
      >
        <HeroStatItem {...types} />
      </div>
    </div>
  );
}
