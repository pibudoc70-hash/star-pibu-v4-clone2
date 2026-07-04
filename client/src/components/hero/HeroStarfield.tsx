/**
 * HeroStarfield — 모바일 히어로 배경 (골드 별자리 SVG 버전)
 *
 * 시안(star-hero-v3-standalone.html) 기반:
 * - 별 15개: 상단 밴드(5개) + 좌우 레일(6개) + 하단 밴드(4개)
 * - 중앙 텍스트 영역(y: 160~620)에는 별 없음
 * - 골드 라인으로 일부 별 연결 (strokeWidth 0.3, opacity 0.10)
 * - 별 크기 0.7~1.2px, opacity 0.28
 * - 그레인 오버레이: SVG turbulence (opacity 0.14, mix-blend-mode overlay)
 */
import { memo } from "react";

const STARS = [
  // 상단 밴드 (y: 62~122) — 텍스트 영역 위
  { x: 44,  y: 96,  r: 1.2 },
  { x: 118, y: 62,  r: 0.8 },
  { x: 210, y: 100, r: 1.0 },
  { x: 288, y: 66,  r: 1.1 },
  { x: 340, y: 122, r: 0.8 },
  // 왼쪽 레일 (x: 16~22) — 텍스트 영역 옆
  { x: 20,  y: 260, r: 0.8 },
  { x: 16,  y: 395, r: 0.9 },
  { x: 22,  y: 520, r: 0.8 },
  // 오른쪽 레일 (x: 348~360) — 텍스트 영역 옆
  { x: 360, y: 250, r: 0.9 },
  { x: 356, y: 380, r: 0.7 },
  { x: 348, y: 505, r: 1.0 },
  // 하단 밴드 (y: 700~738) — 텍스트 영역 아래
  { x: 72,  y: 700, r: 0.8 },
  { x: 168, y: 732, r: 1.0 },
  { x: 256, y: 708, r: 0.7 },
  { x: 322, y: 738, r: 0.9 },
];

// 연결할 별 인덱스 쌍 (골드 라인)
const LINES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],   // 상단 밴드
  [11, 12], [12, 13], [13, 14],      // 하단 밴드
];

// 그레인 SVG (turbulence)
const GRAIN_SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>")`;

function HeroStarfield() {
  return (
    <>
      {/* 그레인 오버레이 (SVG turbulence, 텍스처 노이즈) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN_SVG,
          opacity: 0.14,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
      {/* 별자리 SVG */}
      <svg
        aria-hidden="true"
        className="hero-starfield-canvas"
        viewBox="0 0 380 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* 골드 연결선 */}
        {LINES.map(([a, b], i) => (
          <line
            key={i}
            x1={STARS[a].x} y1={STARS[a].y}
            x2={STARS[b].x} y2={STARS[b].y}
            stroke="#c9a869"
            strokeWidth="0.3"
            opacity="0.10"
          />
        ))}
        {/* 별 */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x} cy={s.y} r={s.r}
            fill="#d9c48a"
            opacity="0.28"
          />
        ))}
      </svg>
    </>
  );
}

export default memo(HeroStarfield);
