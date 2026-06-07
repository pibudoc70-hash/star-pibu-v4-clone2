/**
 * HeroOverlays — Hero 배경 오버레이 레이어 모음
 * - 상단 다크 그라디언트
 * - 좌우 비네팅 (방사형 그라디언트)
 * - 상단 골드 소프트 글로우
 *
 * 모두 aria-hidden="true" — 스크린리더 무시 대상
 */

/** 상단/하단 다크 그라디언트 오버레이 */
export function HeroDarkOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to bottom, rgba(10,18,40,0.72) 0%, rgba(10,18,40,0.38) 35%, rgba(10,18,40,0.42) 65%, rgba(10,18,40,0.80) 100%)",
      }}
    />
  );
}

/** 좌우 비네팅 — 사진 중앙 집중 */
export function HeroVignette() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 40%, rgba(5,10,25,0.45) 100%)",
      }}
    />
  );
}

/** 상단 골드 소프트 글로우 — 천장 조명의 골드빛 일렁임 */
export function HeroGoldGlow() {
  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "70%",
        height: "38%",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(210,172,103,0.9) 0%, rgba(210,172,103,0.3) 45%, transparent 75%)",
        animation: "softGlow 10s ease-in-out infinite",
        opacity: 0.15,
        mixBlendMode: "screen",
        willChange: "opacity",
      }}
    />
  );
}
