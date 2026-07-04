/**
 * HeroStarfield - 모바일 히어로 섹션 전용 별/은하수 배경
 *
 * Canvas 기반 별 반짝임 + 은하수 효과
 * - 작은 별 200개: 랜덤 위치, 랜덤 밝기 깜박임
 * - 중간 별 40개: 약간 더 크고 밝은 별
 * - 은하수 밴드: 중앙 대각선 방향 성운 느낌 (가우시안 블러 효과)
 * - 배경: 깊은 네이비/블랙
 * - 모바일 전용 (md:hidden)
 */
import { useEffect, useRef, memo } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface NebulaParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
}

function HeroStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const nebulaRef = useRef<NebulaParticle[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      return { w, h };
    };

    const { w, h } = initCanvas();

    // 별 색상 팔레트 (흰색, 연한 파랑, 연한 노랑)
    const starColors = [
      "255,255,255",
      "220,235,255",
      "255,248,220",
      "200,220,255",
      "255,255,240",
    ];

    // 작은 별 생성
    const stars: Star[] = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 0.8 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // 중간 별 생성 (더 밝고 큰)
    for (let i = 0; i < 45; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.4 + 0.8,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.012 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // 밝은 별 (소수)
    for (let i = 0; i < 8; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.8 + 1.5,
        opacity: Math.random() * 0.3 + 0.7,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: "255,255,255",
      });
    }

    starsRef.current = stars;

    // 은하수 성운 파티클 생성
    const nebula: NebulaParticle[] = [];
    // 은하수 밴드: 좌상단 → 우하단 대각선 방향
    const nebulaColors = [
      "100,120,200",
      "80,100,180",
      "120,100,200",
      "60,80,160",
      "140,120,220",
      "80,140,200",
    ];

    for (let i = 0; i < 80; i++) {
      // 대각선 밴드 위에 분포
      const t = Math.random();
      const bandX = t * w * 1.4 - w * 0.2;
      const bandY = t * h * 0.7 + h * 0.05;
      const spread = h * 0.18;

      nebula.push({
        x: bandX + (Math.random() - 0.5) * spread * 2.5,
        y: bandY + (Math.random() - 0.5) * spread,
        radius: Math.random() * 40 + 15,
        opacity: Math.random() * 0.045 + 0.01,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      });
    }

    nebulaRef.current = nebula;

    const drawNebula = () => {
      for (const p of nebulaRef.current) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${p.color},${p.opacity})`);
        grad.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const drawStars = (time: number) => {
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.6 + 0.4 * twinkle);

        // 밝은 별에 글로우 효과
        if (star.radius > 1.2) {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 3
          );
          glow.addColorStop(0, `rgba(${star.color},${opacity * 0.6})`);
          glow.addColorStop(1, `rgba(${star.color},0)`);
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // 별 본체
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color},${opacity})`;
        ctx.fill();
      }
    };

    const animate = () => {
      timeRef.current += 1;
      const time = timeRef.current;

      // 배경 — 깊은 네이비 블랙
      ctx.fillStyle = "#07091a";
      ctx.fillRect(0, 0, w, h);

      // 은하수 성운
      drawNebula();

      // 별
      drawStars(time);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      cancelAnimationFrame(animFrameRef.current);
      const { w: nw, h: nh } = initCanvas();
      // 별 위치 재배치
      for (const star of starsRef.current) {
        star.x = Math.random() * nw;
        star.y = Math.random() * nh;
      }
      for (const p of nebulaRef.current) {
        const t = Math.random();
        p.x = t * nw * 1.4 - nw * 0.2 + (Math.random() - 0.5) * nh * 0.45;
        p.y = t * nh * 0.7 + nh * 0.05 + (Math.random() - 0.5) * nh * 0.18;
      }
      animate();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-starfield-canvas"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

export default memo(HeroStarfield);
