/**
 * HeroOverlays — Hero 배경 오버레이 레이어 모음
 * - 상단 다크 그라디언트
 * - 좌우 비네팅 (방사형 그라디언트)
 * - 상단 골드 소프트 글로우
 *
 * 모두 aria-hidden="true" — 스크린리더 무시 대상
 */

/** 상단/하단 다크 그라디언트 오버레이
 * 모바일: 텍스트 safe zone 확보를 위해 상단/하단 더 강하게
 * 데스크톱: 기존 값 유지
 */
export function HeroDarkOverlay() {
  return (
    <>
      {/* 데스크톱 오버레이 (md 이상) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, rgba(8,14,32,0.78) 0%, rgba(8,14,32,0.32) 38%, rgba(8,14,32,0.40) 62%, rgba(8,14,32,0.85) 100%)",
        }}
      />
      {/* 모바일 오버레이 — 텍스트 safe zone 강화 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,8,22,0.88) 0%, rgba(4,8,22,0.55) 28%, rgba(4,8,22,0.50) 58%, rgba(4,8,22,0.92) 100%)",
        }}
      />
    </>
  );
}

/** 좌우 비네팅 — 사진 중앙 집중
 * 모바일: 상하 비네팅 강화로 focal point 보호
 */
export function HeroVignette() {
  return (
    <>
      {/* 데스크톱 비네팅 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(4,8,22,0.55) 100%)",
        }}
      />
      {/* 모바일 비네팅 — 상하 강화, 좌우 유지 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 38%, transparent 22%, rgba(4,8,22,0.65) 100%)",
        }}
      />
    </>
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
        opacity: 0.22,
        mixBlendMode: "screen",
        willChange: "opacity",
      }}
    />
  );
}
