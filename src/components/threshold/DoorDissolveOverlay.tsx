import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface Props {
  doorRect: DOMRect | null;
  active: boolean;
  onComplete?: () => void;
  doorColor: string; // HSL like "270 55% 45%"
  /** Ref to the text element so we can fade it out in sync */
  textRef?: React.RefObject<HTMLDivElement>;
}

// ── Lightweight 2D value noise ──
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263 + 42;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return (h & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function fbmNoise(x: number, y: number): number {
  return smoothNoise(x, y) * 0.6 + smoothNoise(x * 2.3, y * 2.3) * 0.3 + smoothNoise(x * 5.1, y * 5.1) * 0.1;
}

interface Particle {
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

function parseHSL(color: string): { h: number; s: number; l: number } {
  const nums = color.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return { h: 270, s: 55, l: 45 };
  return { h: parseFloat(nums[0]), s: parseFloat(nums[1]), l: parseFloat(nums[2]) };
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const NOISE_SCALE = 0.06;
const DISSOLVE_DURATION = 1.8;

const DoorDissolveOverlay = ({ doorRect, active, onComplete, doorColor, textRef }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef({ value: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const spawnedRef = useRef<Set<string>>(new Set());

  const { h, s, l } = parseHSL(doorColor);

  const spawnParticles = useCallback(
    (worldX: number, worldY: number) => {
      const count = Math.floor(randomRange(2, 5));
      for (let i = 0; i < count; i++) {
        const isPetal = Math.random() > 0.4;
        const angle = randomRange(0, Math.PI * 2);
        const speed = isPetal ? randomRange(0.4, 2.8) : randomRange(0.15, 1.4);
        const jitter = randomRange(-3, 3);

        particlesRef.current.push({
          x: worldX + jitter,
          y: worldY + jitter,
          size: isPetal ? randomRange(4, 18) : randomRange(1, 5),
          rotation: randomRange(0, 360),
          opacity: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - randomRange(0.1, 1.1),
          vr: isPetal ? randomRange(-3, 3) : randomRange(-1, 1),
          life: 0,
          maxLife: randomRange(80, 160),
          color: isPetal
            ? `hsla(${h + randomRange(-20, 20)}, ${s + randomRange(-12, 12)}%, ${l + randomRange(-8, 20)}%, `
            : `hsla(${h + randomRange(-5, 5)}, ${s - 10}%, ${l + randomRange(15, 30)}%, `,
          type: isPetal ? "petal" : "dust",
        });
      }
    },
    [h, s, l]
  );

  useEffect(() => {
    if (!active || !doorRect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use full viewport so particles are never clipped
    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    canvas.style.width = `${vw}px`;
    canvas.style.height = `${vh}px`;
    ctx.scale(dpr, dpr);

    spawnedRef.current.clear();
    particlesRef.current = [];
    progressRef.current.value = 0;

    const tl = gsap.timeline();
    tl.to(progressRef.current, {
      value: 1,
      duration: DISSOLVE_DURATION,
      ease: "power2.out",
      onComplete: () => {
        onComplete?.();
      },
    });

    const doorW = doorRect.width;
    const doorH = doorRect.height;
    const cellSize = 3;
    // Center of the text area in viewport coords for radial glow
    const glowCx = doorRect.left + doorW / 2;
    const glowCy = doorRect.top + doorH / 2;

    const animate = () => {
      ctx.clearRect(0, 0, vw, vh);

      const progress = progressRef.current.value;

      // Fade out the real text element in sync with dissolve
      if (textRef?.current) {
        textRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.5));
      }

      // Spawn particles based on noise threshold over the text area
      for (let cy = 0; cy < doorH; cy += cellSize) {
        for (let cx = 0; cx < doorW; cx += cellSize) {
          const nx = cx * NOISE_SCALE;
          const ny = cy * NOISE_SCALE;
          const n = fbmNoise(nx, ny);

          const spawnKey = `${Math.floor(cx / (cellSize * 2))},${Math.floor(cy / (cellSize * 2))}`;
          if (!spawnedRef.current.has(spawnKey) && n < progress && Math.abs(n - progress) < 0.07) {
            spawnedRef.current.add(spawnKey);
            spawnParticles(doorRect.left + cx, doorRect.top + cy);
          }
        }
      }

      // Draw radial glow behind particles
      if (particlesRef.current.length > 0) {
        const glowRadius = 60 + progress * 120;
        const glowGrad = ctx.createRadialGradient(glowCx, glowCy, 0, glowCx, glowCy, glowRadius);
        const glowAlpha = Math.min(0.25, progress * 0.3);
        glowGrad.addColorStop(0, `hsla(${h}, ${s}%, ${l + 15}%, ${glowAlpha})`);
        glowGrad.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(glowCx - glowRadius, glowCy - glowRadius, glowRadius * 2, glowRadius * 2);
      }

      // Draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const alpha =
          lifeRatio < 0.15 ? lifeRatio / 0.15 : lifeRatio > 0.6 ? 1 - (lifeRatio - 0.6) / 0.4 : 1;
        p.opacity = Math.max(0, Math.min(1, alpha * 0.8));

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012;
        p.rotation += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === "petal") {
          ctx.fillStyle = p.color + p.opacity + ")";
          ctx.beginPath();
          const sz = p.size;
          ctx.moveTo(0, -sz);
          ctx.bezierCurveTo(sz * 0.6, -sz * 0.6, sz * 0.8, sz * 0.3, 0, sz);
          ctx.bezierCurveTo(-sz * 0.8, sz * 0.3, -sz * 0.6, -sz * 0.6, 0, -sz);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color + p.opacity + ")";
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      tl.kill();
      // Reset text opacity on cleanup
      if (textRef?.current) {
        textRef.current.style.opacity = "";
      }
    };
  }, [active, doorRect, doorColor, onComplete, spawnParticles, h, s, l, textRef]);

  if (!active || !doorRect) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    />
  );
};

export default DoorDissolveOverlay;
