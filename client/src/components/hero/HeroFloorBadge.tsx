/**
 * HeroFloorBadge — 층별 안내 텍스트 (모바일/데스크톱 분기)
 *
 * [R19-P0-3] 인라인 style → CSS 클래스 교체
 * - 모바일/데스크톱 위치/크기/색상 → .hero-floor-mobile/.hero-floor-desktop CSS 클래스
 * - animationDelay → CSS custom property --delay
 *
 * 모바일: 헤더 바로 아래 우측 고정 (absolute, top)
 *   - "|" 구분자를 기준으로 두 줄로 분리하여 잘림 방지
 * 데스크톱: 우상단 고정 (absolute, top/right clamp)
 */
import React from "react";

interface HeroFloorBadgeProps {
  text: string;
  animationDelay: string;
}

/** "|" 구분자를 기준으로 텍스트를 두 줄로 분리 */
function splitFloorText(text: string): { line1: string; line2: string | null } {
  const pipeIdx = text.indexOf("|");
  if (pipeIdx === -1) return { line1: text, line2: null };
  return {
    line1: text.slice(0, pipeIdx).trim(),
    line2: text.slice(pipeIdx + 1).trim(),
  };
}

export function HeroFloorBadge({ text, animationDelay }: HeroFloorBadgeProps) {
  const { line1, line2 } = splitFloorText(text);

  return (
    <>
      {/* 모바일 전용 — "|" 기준 두 줄 표시로 잘림 방지 */}
      <p
        className="hero-fade hero-floor-mobile md:hidden"
        style={{ "--delay": animationDelay } as React.CSSProperties}
      >
        <span className="block">{line1}</span>
        {line2 && <span className="block">{line2}</span>}
      </p>
      {/* 데스크톱 전용 — 한 줄 */}
      <p
        className="hero-fade hero-floor-desktop hidden md:block"
        style={{ "--delay": animationDelay } as React.CSSProperties}
      >
        {text}
      </p>
    </>
  );
}
