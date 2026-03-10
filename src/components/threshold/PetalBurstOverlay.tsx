import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface Props {
  active: boolean;
  doorColor: string; // e.g. "hsl(270, 55%, 45%)"
  onComplete?: () => void;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  vx: number;
  vy: number;
  vr: number;
  life: number;
  maxLife: number;
  color: string;
  type: "petal" | "dust";
}

const PETAL_COUNT = 60;
const DUST_COUNT = 80;

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/** Parse a doorColor like "270 55% 45%" or "hsl(270, 55%, 45%)" into h,s,l numbers */
function parseHSL(color: string): { h: number; s: number; l: number } {
  const nums = color.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return { h: 270, s: 55, l: 45 };
  return { h: parseFloat(nums[0]), s: parseFloat(nums[1]), l: parseFloat(nums[2]) };
}

const PetalBurstOverlay = ({ active, doorColor, onComplete }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const rafRef = useRef<number>(0);
  const progressRef = useRef({ value: 0 });
  const overlayRef = useRef({ opacity: 0 });

  const createPetals = useCallback(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const { h, s, l } = parseHSL(doorColor);
    const petals: Petal[] = [];

    // Petals — originate from center, arc outward with swirl
    for (let i = 0; i < PETAL_COUNT; i++) {
      const angle = randomRange(0, Math.PI * 2);
      const speed = randomRange(1.5, 4);
      const drift = randomRange(-0.3, 0.3);
      petals.push({
        x: cx + randomRange(-30, 30),
        y: cy + randomRange(-30, 30),
        size: randomRange(8, 22),
        rotation: randomRange(0, 360),
        opacity: 0,
        vx: Math.cos(angle) * speed + drift,
        vy: Math.sin(angle) * speed - randomRange(0.5, 2),
        vr: randomRange(-3, 3),
        life: 0,
        maxLife: randomRange(60, 120),
        color: `hsla(${h + randomRange(-15, 15)}, ${s + randomRange(-10, 10)}%, ${l + randomRange(-5, 15)}%, `,
        type: "petal",
      });
    }

    // Dust particles — smaller, faster fade
    for (let i = 0; i < DUST_COUNT; i++) {
      const angle = randomRange(0, Math.PI * 2);
      const speed = randomRange(0.5, 2.5);
      petals.push({
        x: cx + randomRange(-80, 80),
        y: cy + randomRange(-80, 80),
        size: randomRange(1.5, 4),
        rotation: 0,
        opacity: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomRange(0.3, 1),
        vr: 0,
        life: 0,
        maxLife: randomRange(40, 90),
        color: `hsla(${h}, ${s - 10}%, ${l + 20}%, `,
        type: "dust",
      });
    }

    return petals;
  }, [doorColor]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    petalsRef.current = createPetals();
    progressRef.current.value = 0;
    overlayRef.current.opacity = 0;

    // Animate overlay opacity from 0 to 1
    const tl = gsap.timeline();
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 1.8,
      ease: "power2.inOut",
      onComplete: () => onComplete?.(),
    });

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
      const lifeRatio = p.life / p.maxLife;
      // Fade in then out
      const alpha = lifeRatio < 0.2
        ? lifeRatio / 0.2
        : lifeRatio > 0.7
        ? 1 - (lifeRatio - 0.7) / 0.3
        : 1;
      p.opacity = Math.max(0, Math.min(1, alpha * 0.8));

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      if (p.type === "petal") {
        // Draw organic petal shape
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.6, -s * 0.6, s * 0.8, s * 0.3, 0, s);
        ctx.bezierCurveTo(-s * 0.8, s * 0.3, -s * 0.6, -s * 0.6, 0, -s);
        ctx.fill();

        // Soft glow
        ctx.shadowColor = p.color + "0.3)";
        ctx.shadowBlur = 8;
        ctx.fill();
      } else {
        // Dust: small circle
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Background overlay fade
      const { h, s, l } = parseHSL(doorColor);
      ctx.fillStyle = `hsla(${h}, ${s}%, ${Math.max(l - 30, 3)}%, ${overlayRef.current.opacity * 0.85})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Bloom glow at center
      if (overlayRef.current.opacity > 0.1) {
        const grd = ctx.createRadialGradient(
          window.innerWidth / 2, window.innerHeight / 2, 0,
          window.innerWidth / 2, window.innerHeight / 2, window.innerWidth * 0.5
        );
        grd.addColorStop(0, `hsla(${h}, ${s}%, ${l + 15}%, ${overlayRef.current.opacity * 0.15})`);
        grd.addColorStop(0.5, `hsla(${h}, ${s}%, ${l}%, ${overlayRef.current.opacity * 0.05})`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      }

      // Update and draw petals
      for (const p of petalsRef.current) {
        if (p.life < p.maxLife) {
          p.life++;
          // Spiral / swirl motion — pull toward center initially then drift outward
          const lifeRatio = p.life / p.maxLife;
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          const dx = cx - p.x;
          const dy = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Early: pull toward center. Late: drift outward
          const pullStrength = lifeRatio < 0.3 ? 0.008 : -0.002;
          p.vx += dx / (dist + 1) * pullStrength;
          p.vy += dy / (dist + 1) * pullStrength;

          // Add gentle rotation for swirl
          if (dist > 10) {
            p.vx += -dy / (dist + 1) * 0.015;
            p.vy += dx / (dist + 1) * 0.015;
          }

          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.vr;

          // Gentle gravity
          p.vy += 0.01;

          drawPetal(ctx, p);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      tl.kill();
    };
  }, [active, doorColor, createPetals, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
};

export default PetalBurstOverlay;
