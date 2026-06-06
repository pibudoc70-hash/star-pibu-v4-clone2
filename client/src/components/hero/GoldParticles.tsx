/**
 * GoldParticles — 금색 빛 가루 파티클 Canvas 컴포넌트
 * HeroSection에서 분리 (STRUCT-HERO-1)
 */
import { useEffect, useRef } from "react";

export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // prefers-reduced-motion: 모션 감소 설정 시 파티클 비활성화
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = true;
    // [PERF-P1-1] 모바일(≤640px)에서 파티클 수 절반으로 감소 → 메인스레드 부담 감소
    const PARTICLE_COUNT = window.innerWidth <= 640 ? 40 : 80;

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      opacityTarget: number;
      opacitySpeed: number;
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const mkParticle = (forceBottom = false): Particle => ({
      x: Math.random() * canvas.width,
      y: forceBottom ? canvas.height + Math.random() * 60 : Math.random() * canvas.height,
      size: 0.6 + Math.random() * 1.2,
      speedY: -(0.18 + Math.random() * 0.33),
      speedX: (Math.random() - 0.5) * 0.12,
      opacity: 0,
      opacityTarget: 0.12 + Math.random() * 0.12,
      opacitySpeed: 0.002 + Math.random() * 0.003,
    });

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      mkParticle(false)
    );

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        if (p.opacity < p.opacityTarget) p.opacity = Math.min(p.opacity + p.opacitySpeed, p.opacityTarget);
        else p.opacity = Math.max(p.opacity - p.opacitySpeed * 0.6, 0);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 172, 80, ${p.opacity})`;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          Object.assign(p, mkParticle(true));
        }
      }
      if (isRunning) animId = requestAnimationFrame(draw);
    };
    draw();

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        isRunning = true;
        draw();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", zIndex: 3 }}
    />
  );
}
