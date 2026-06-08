/**
 * HeroScrollIndicator — 하단 스크롤 유도 버튼
 * - 클릭 시 #about 섹션으로 부드럽게 스크롤
 * - aria-label로 접근성 보장
 *
 * [R18-P0-2] 인라인 style → CSS 클래스 (.hero-scroll-btn, .hero-scroll-label)
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
      className="hero-fade hero-scroll-btn flex flex-col items-center gap-1 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white/60"
      style={{ animationDelay }}
      aria-label={label ?? "Scroll"}
    >
      <span className="hero-scroll-label">
        {label}
      </span>
      <ChevronDown size={16} className="animate-bounce" />
    </button>
  );
}
