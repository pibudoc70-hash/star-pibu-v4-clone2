/**
 * HeroOverlays — Hero 배경 오버레이 레이어 모음
 * - 상단 다크 그라디언트
 * - 좌우 비네팅 (방사형 그라디언트)
 * - 상단 골드 소프트 글로우
 *
 * 모두 aria-hidden="true" — 스크린리더 무시 대상
 */

/** 상단/하단 다크 그라디언트 오버레이
 * 모바일: 상단(네비 아래) + 하단(CTA 위) 강하게, 중간은 배경 이미지 살림
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
      {/* 모바일 오버레이 — 상단 강하게 + 중간 투명 + 하단 강하게
           밀딩 방지: 0.38→0.50 급격 전환 제거 → 6단계 완만한 전환 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,8,22,0.88) 0%, rgba(4,8,22,0.60) 15%, rgba(4,8,22,0.34) 38%, rgba(4,8,22,0.34) 55%, rgba(4,8,22,0.68) 78%, rgba(4,8,22,0.88) 100%)",
        }}
      />
    </>
  );
}

/** 좌우 비네팅 — 사진 중앙 집중
 * 모바일: 좌우 비네팅으로 시선 중앙 집중
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
      {/* 모바일 비네팅 — 좌우 강화, 중앙 투명 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, transparent 20%, rgba(4,8,22,0.45) 100%)",
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
        opacity: 0.28,
        mixBlendMode: "screen",
        willChange: "opacity",
      }}
    />
  );
}
