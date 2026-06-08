/**
 * HeroFloorBadge — 층별 안내 텍스트 (모바일/데스크톱 분기)
 *
 * [R19-P0-3] 인라인 style → CSS 클래스 교체
 * - 모바일/데스크톱 위치/크기/색상 → .hero-floor-mobile/.hero-floor-desktop CSS 클래스
 * - animationDelay → CSS custom property --delay
 *
 * 모바일: 헤더 바로 아래 중앙 고정 (absolute, top:22px)
 * 데스크톱: 우상단 고정 (absolute, top/right clamp)
 */
import React from "react";

interface HeroFloorBadgeProps {
  text: string;
  animationDelay: string;
}

export function HeroFloorBadge({ text, animationDelay }: HeroFloorBadgeProps) {
  return (
    <>
      {/* 모바일 전용 */}
      <p
        className="hero-fade hero-floor-mobile md:hidden"
        style={{ "--delay": animationDelay } as React.CSSProperties}
      >
        {text}
      </p>
      {/* 데스크톱 전용 */}
      <p
        className="hero-fade hero-floor-desktop hidden md:block"
        style={{ "--delay": animationDelay } as React.CSSProperties}
      >
        {text}
      </p>
    </>
  );
}
