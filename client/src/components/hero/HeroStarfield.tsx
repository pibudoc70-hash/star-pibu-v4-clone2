/**
 * HeroStarfield — 모바일 히어로 섹션 별/은하수 캔버스 배경
 * 캄캄한 밤하늘에 별이 깜박이고 은하수 밴드가 흐르는 효과
 */
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  phase: number;
}

interface MilkyWayParticle {
  x: number;
  y: number;
  r: number;
  opacity: number;
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

    // 별 생성
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.0 + 0.3,
      opacity: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    // 밝은 별
    const brightStars: Star[] = Array.from({ length: 8 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.7,
      r: Math.random() * 1.5 + 1.2,
      opacity: Math.random() * 0.4 + 0.6,
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    // 은하수 파티클
    const milkyWay: MilkyWayParticle[] = Array.from({ length: 80 }, (_, i) => {
      const t = i / 80;
      const angle = -0.35;
      const cx = W * 0.5 + Math.cos(angle) * (t - 0.5) * W * 1.2;
      const cy = H * 0.4 + Math.sin(angle) * (t - 0.5) * W * 1.2;
      return {
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 40,
        r: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.18 + 0.04,
      };
    });

    const startTime = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, W, H);

      // 은하수
      milkyWay.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const hue = Math.random() > 0.5 ? "180, 200, 255" : "200, 180, 255";
        ctx.fillStyle = `rgba(${hue}, ${p.opacity})`;
        ctx.fill();
      });

      // 일반 별
      stars.forEach((s) => {
        const flicker = 0.5 + 0.5 * Math.sin(elapsed * s.speed + s.phase);
        const alpha = s.opacity * (0.6 + 0.4 * flicker);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // 밝은 별 + 글로우
      brightStars.forEach((s) => {
        const flicker = 0.5 + 0.5 * Math.sin(elapsed * s.speed + s.phase);
        const alpha = s.opacity * (0.7 + 0.3 * flicker);
        // 글로우
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        grd.addColorStop(0, `rgba(255, 248, 220, ${alpha * 0.5})`);
        grd.addColorStop(1, "rgba(255, 248, 220, 0)");
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // 별 본체
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
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
