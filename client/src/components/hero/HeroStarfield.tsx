/**
 * HeroStarfield — 모바일 히어로 섹션 별 배경
 * 캄캄한 밤하늘에 별이 약하게 조금씩 빛나는 효과
 * - 은하수 제거, 별 수 줄임
 * - opacity 낮게, 깜박임 속도 느리게
 * - 일부 별은 아주 천천히 골드 빛으로 빛남
 */
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;  // 기본 밝기 (낮게)
  twinkleAmp: number;   // 깜박임 진폭
  speed: number;        // 깜박임 속도 (느리게)
  phase: number;        // 위상 오프셋
  isGold: boolean;      // 골드 빛 여부
}

export default function HeroStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // 작은 별 — 약하고 느리게 깜박임
    const smallStars: Star[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 0.7 + 0.2,
      baseOpacity: Math.random() * 0.12 + 0.04,   // 0.04 ~ 0.16 (매우 약함)
      twinkleAmp: Math.random() * 0.08 + 0.02,    // 깜박임 폭 작게
      speed: Math.random() * 0.25 + 0.08,         // 매우 느리게
      phase: Math.random() * Math.PI * 2,
      isGold: false,
    }));

    // 중간 별 — 약간 밝고 느린 깜박임
    const midStars: Star[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.85,
      r: Math.random() * 0.9 + 0.5,
      baseOpacity: Math.random() * 0.18 + 0.08,   // 0.08 ~ 0.26
      twinkleAmp: Math.random() * 0.12 + 0.04,
      speed: Math.random() * 0.18 + 0.06,
      phase: Math.random() * Math.PI * 2,
      isGold: Math.random() < 0.3,                // 30%는 골드 빛
    }));

    // 밝은 별 — 아주 소수, 글로우 효과
    const brightStars: Star[] = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.7,
      r: Math.random() * 1.0 + 0.8,
      baseOpacity: Math.random() * 0.22 + 0.12,   // 0.12 ~ 0.34
      twinkleAmp: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.12 + 0.04,         // 아주 느리게
      phase: Math.random() * Math.PI * 2,
      isGold: Math.random() < 0.5,
    }));

    const startTime = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, W, H);

      // 작은 별
      smallStars.forEach((s) => {
        const flicker = Math.sin(elapsed * s.speed + s.phase);
        const alpha = Math.max(0, s.baseOpacity + s.twinkleAmp * flicker);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 252, 240, ${alpha})`;
        ctx.fill();
      });

      // 중간 별
      midStars.forEach((s) => {
        const flicker = Math.sin(elapsed * s.speed + s.phase);
        const alpha = Math.max(0, s.baseOpacity + s.twinkleAmp * flicker);
        const color = s.isGold ? "236, 213, 163" : "255, 252, 240";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      });

      // 밝은 별 + 부드러운 글로우
      brightStars.forEach((s) => {
        const flicker = Math.sin(elapsed * s.speed + s.phase);
        const alpha = Math.max(0, s.baseOpacity + s.twinkleAmp * flicker);
        const color = s.isGold ? "236, 213, 163" : "255, 252, 240";

        // 글로우 (매우 부드럽게)
        const glowR = s.r * 6;
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        grd.addColorStop(0, `rgba(${color}, ${alpha * 0.35})`);
        grd.addColorStop(0.4, `rgba(${color}, ${alpha * 0.12})`);
        grd.addColorStop(1, `rgba(${color}, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // 별 본체
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
