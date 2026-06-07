/**
 * HeroScrollIndicator — 하단 스크롤 유도 버튼
 * - 클릭 시 #about 섹션으로 부드럽게 스크롤
 * - aria-label로 접근성 보장
 */
import { ChevronDown } from "lucide-react";

interface HeroScrollIndicatorProps {
  label: string | undefined;
  animationDelay: string;
}

export function HeroScrollIndicator({ label, animationDelay }: HeroScrollIndicatorProps) {
  const handleClick = () => {
    const el = document.querySelector("#about");
    if (el) {
      const header = document.querySelector('header[role="banner"]') as HTMLElement | null;
      const offset = header ? header.offsetHeight + 8 : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hero-fade absolute flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
      style={{
        bottom: "clamp(1.25rem, 3.5vh, 2.5rem)",
        left: "50%",
        transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.55)",
        animationDelay,
        marginBottom: "-7px",
        marginLeft: "-20px",
      }}
      aria-label={label ?? "Scroll"}
    >
      <span
        style={{
          fontSize: "clamp(0.58rem, 1.4vw, 0.68rem)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <ChevronDown size={16} className="animate-bounce" />
    </button>
  );
}
