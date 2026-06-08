/**
 * HeroStatItem — Hero 통계 섹션의 개별 아이템
 *
 * [R19-P0-3] 인라인 style → CSS 클래스 교체
 * - isDone 조건부 스타일 → data-done attribute + CSS 선택자
 * - clamp/color/shadow 값 → .hero-stat-* CSS 클래스
 * - animationDelay → CSS custom property --delay
 */
import React from "react";

interface HeroStatItemProps {
  value: string;
  unit: string;
  label: string;
  isDone: boolean;
  animationDelay: string;
  className?: string;
}

export function HeroStatItem({
  value,
  unit,
  label,
  isDone,
  animationDelay,
  className = "",
}: HeroStatItemProps) {
  return (
    <div
      className={`text-center hero-fade ${className}`}
      style={{ "--delay": animationDelay } as React.CSSProperties}
    >
      <div className="hero-stat-value" data-done={String(isDone)}>
        {value}
        <span className="hero-stat-unit">{unit}</span>
      </div>
      <div className="hero-stat-bar" data-done={String(isDone)} />
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}
