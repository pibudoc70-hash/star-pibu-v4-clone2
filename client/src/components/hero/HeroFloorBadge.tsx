/**
 * HeroFloorBadge — 층별 안내 텍스트 (모바일/데스크톱 분기)
 *
 * 모바일: 헤더 바로 아래 중앙 고정 (absolute, top:22px)
 * 데스크톱: 우상단 고정 (absolute, top/right clamp)
 */

interface HeroFloorBadgeProps {
  text: string;
  animationDelay: string;
}

export function HeroFloorBadge({ text, animationDelay }: HeroFloorBadgeProps) {
  return (
    <>
      {/* 모바일 전용 */}
      <p
        className="hero-fade absolute z-20 md:hidden"
        style={{
          top: "22px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.85)",
          fontSize: "10px",
          letterSpacing: "0.03em",
          animationDelay,
          whiteSpace: "normal",
          wordBreak: "keep-all",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          textAlign: "center",
          width: "90vw",
          lineHeight: 1.4,
        }}
      >
        {text}
      </p>
      {/* 데스크톱 전용 */}
      <p
        className="hero-fade absolute z-20 hidden md:block"
        style={{
          top: "clamp(72px, 10vh, 90px)",
          right: "clamp(16px, 4vw, 40px)",
          color: "rgba(255,255,255,0.75)",
          fontSize: "clamp(0.62rem, 1.5vw, 0.8rem)",
          letterSpacing: "0.03em",
          animationDelay,
          whiteSpace: "nowrap",
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </p>
    </>
  );
}
