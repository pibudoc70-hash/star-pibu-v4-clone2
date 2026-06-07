/**
 * HeroStatItem — Hero 통계 섹션의 개별 아이템
 *
 * - 카운트업 완료 시 골드 색상 전환
 * - 하단 골드 언더라인 scaleX 애니메이션
 * - 레이블 텍스트
 */

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
      style={{ animationDelay }}
    >
      <div
        style={{
          color: isDone ? "#F5D78E" : "rgba(255,255,255,0.97)",
          fontSize: "clamp(1.2rem, 4.5vw, 2.2rem)",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          textShadow: isDone
            ? "0 0 20px rgba(245,215,142,0.65), 0 2px 10px rgba(0,0,0,0.4)"
            : "0 2px 10px rgba(0,0,0,0.4)",
          lineHeight: 1,
          transition: "color 0.5s ease, text-shadow 0.5s ease",
          fontVariantNumeric: "tabular-nums",
          minWidth: "2ch",
          display: "inline-block",
          textAlign: "right",
        }}
      >
        {value}
        <span style={{ fontSize: "65%", fontWeight: 300, opacity: 0.85 }}>{unit}</span>
      </div>
      <div
        style={{
          height: "1.5px",
          background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
          marginTop: "6px",
          transform: isDone ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          transformOrigin: "center",
        }}
      />
      <div
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "clamp(0.62rem, 1.6vw, 0.78rem)",
          letterSpacing: "0.04em",
          paddingTop: "8px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
