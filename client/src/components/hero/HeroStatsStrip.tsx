/**
 * HeroStatsStrip — Hero 통계 스트립 (3개 수치)
 *
 * [R19-P0-3] 인라인 style → CSS 클래스 교체
 * - marginBottom/gap/paddingTop clamp 값 → .hero-stats-wrap/.hero-stats-row CSS 클래스
 *
 * 레이아웃:
 * - 데스크톱/모바일 공통: 3열 나란히 (한 행)
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
      {/* 3개 통계 한 행에 표시 */}
      <div className="hero-stats-row">
        <HeroStatItem {...years} />
        <HeroStatItem {...cases} />
        <HeroStatItem {...types} />
      </div>
    </div>
  );
}
