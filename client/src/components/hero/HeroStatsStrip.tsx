/**
 * HeroStatsStrip — Hero 통계 스트립 (3개 수치)
 *
 * [R19-P0-3] 인라인 style → CSS 클래스 교체
 * - marginBottom/gap/paddingTop clamp 값 → .hero-stats-wrap/.hero-stats-row CSS 클래스
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
    <div ref={statsRef} className="hero-stats-wrap">
      {/* 데스크톱: 3열 / 모바일: 상단 2열 */}
      <div className="hero-stats-row">
        <HeroStatItem {...years} />
        <HeroStatItem {...cases} />
        {/* 데스크톱에서만 3번째 통계 같은 행에 표시 */}
        <HeroStatItem {...types} className="hidden sm:block" />
      </div>

      {/* 모바일에서만 3번째 통계 하단 중앙에 표시 */}
      <div className="hero-stats-row-mobile sm:hidden">
        <HeroStatItem {...types} />
      </div>
    </div>
  );
}
