import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface Props {
  doorRect: DOMRect | null;
  active: boolean;
  onComplete?: () => void;
  doorColor: string; // HSL like "270 55% 45%"
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
const DISSOLVE_DURATION = 2.4;
const PADDING = 160; // Extra space around door for particles to fly into

const DoorDissolveOverlay = ({ doorRect, active, onComplete, doorColor }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef({ value: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const spawnedRef = useRef<Set<string>>(new Set());

  const { h, s, l } = parseHSL(doorColor);

  const spawnParticle = useCallback(
    (worldX: number, worldY: number) => {
      const isPetal = Math.random() > 0.5;
      const angle = randomRange(0, Math.PI * 2);
      const speed = isPetal ? randomRange(0.5, 2.2) : randomRange(0.2, 1.0);

      particlesRef.current.push({
        x: worldX,
        y: worldY,
        size: isPetal ? randomRange(5, 15) : randomRange(1.5, 4),
        rotation: randomRange(0, 360),
        opacity: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomRange(0.2, 0.9),
        vr: isPetal ? randomRange(-2.5, 2.5) : 0,
        life: 0,
        maxLife: randomRange(70, 140),
        color: isPetal
          ? `hsla(${h + randomRange(-15, 15)}, ${s + randomRange(-10, 10)}%, ${l + randomRange(-5, 15)}%, `
          : `hsla(${h}, ${s - 10}%, ${l + 20}%, `,
        type: isPetal ? "petal" : "dust",
      });
    },
    [h, s, l]
  );

  useEffect(() => {
    if (!active || !doorRect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = doorRect.width + PADDING * 2;
    const ch = doorRect.height + PADDING * 2;
    const canvasLeft = doorRect.left - PADDING;
    const canvasTop = doorRect.top - PADDING;

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    canvas.style.left = `${canvasLeft}px`;
    canvas.style.top = `${canvasTop}px`;
    ctx.scale(dpr, dpr);

    // Get background color from CSS
    const bgRaw = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();

    spawnedRef.current.clear();
    particlesRef.current = [];
    progressRef.current.value = 0;

    const tl = gsap.timeline();
    tl.to(progressRef.current, {
      value: 1,
      duration: DISSOLVE_DURATION,
      ease: "power1.inOut",
      onComplete: () => {
        setTimeout(() => onComplete?.(), 400);
      },
    });

    // The door area within the canvas (offset by padding)
    const doorX = PADDING;
    const doorY = PADDING;
    const doorW = doorRect.width;
    const doorH = doorRect.height;

    const cellSize = 4; // Size of each dissolve cell in CSS pixels

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);

      const progress = progressRef.current.value;

      // Paint background-colored cells over the door area based on noise
      // This "erases" the door underneath
      for (let cy = 0; cy < doorH; cy += cellSize) {
        for (let cx = 0; cx < doorW; cx += cellSize) {
          const nx = cx * NOISE_SCALE;
          const ny = cy * NOISE_SCALE;
          const n = fbmNoise(nx, ny);

          if (n < progress) {
            // Draw a background-colored cell to hide the door pixel
            ctx.fillStyle = `hsl(${bgRaw})`;
            ctx.fillRect(doorX + cx, doorY + cy, cellSize, cellSize);

            // Spawn particle at dissolve boundary
            const spawnKey = `${Math.floor(cx / (cellSize * 3))},${Math.floor(cy / (cellSize * 3))}`;
            if (!spawnedRef.current.has(spawnKey) && Math.abs(n - progress) < 0.05) {
              spawnedRef.current.add(spawnKey);
              const worldX = doorRect.left + cx;
              const worldY = doorRect.top + cy;
              spawnParticle(worldX, worldY);
            }
          }
        }
      }

      // Draw particles (converted from world to canvas-local coords)
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

        // World → canvas-local
        const lx = p.x - canvasLeft;
        const ly = p.y - canvasTop;

        ctx.save();
        ctx.translate(lx, ly);
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
          ctx.shadowColor = p.color + "0.3)";
          ctx.shadowBlur = 6;
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
    };
  }, [active, doorRect, doorColor, onComplete, spawnParticle, h, s, l]);

  if (!active || !doorRect) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    />
  );
};

export default DoorDissolveOverlay;
