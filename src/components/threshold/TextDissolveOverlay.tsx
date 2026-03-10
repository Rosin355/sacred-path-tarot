import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface Props {
  title: string;
  startRect: DOMRect | null;
  active: boolean;
  onComplete?: () => void;
  doorColor: string; // HSL string like "270 55% 45%"
}

// ── Lightweight 2D value noise (no dependencies) ──
const NOISE_SEED = 42;
function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263 + NOISE_SEED;
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

// ── Particle types ──
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

const NOISE_SCALE = 0.04;
const DISSOLVE_DURATION = 1.6;

const TextDissolveOverlay = ({ title, startRect, active, onComplete, doorColor }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef({ value: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const textImageRef = useRef<ImageData | null>(null);
  const spawnedRef = useRef<Set<string>>(new Set());

  const spawnParticle = useCallback(
    (px: number, py: number, canvasLeft: number, canvasTop: number) => {
      const { h, s, l } = parseHSL(doorColor);
      const worldX = canvasLeft + px;
      const worldY = canvasTop + py;
      const isPetal = Math.random() > 0.6;
      const angle = randomRange(0, Math.PI * 2);
      const speed = isPetal ? randomRange(0.8, 2.5) : randomRange(0.3, 1.5);

      particlesRef.current.push({
        x: worldX,
        y: worldY,
        size: isPetal ? randomRange(5, 14) : randomRange(1.5, 3.5),
        rotation: randomRange(0, 360),
        opacity: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomRange(0.3, 1.2),
        vr: isPetal ? randomRange(-3, 3) : 0,
        life: 0,
        maxLife: randomRange(50, 100),
        color: isPetal
          ? `hsla(${h + randomRange(-15, 15)}, ${s + randomRange(-10, 10)}%, ${l + randomRange(-5, 15)}%, `
          : `hsla(${h}, ${s - 10}%, ${l + 20}%, `,
        type: isPetal ? "petal" : "dust",
      });
    },
    [doorColor]
  );

  useEffect(() => {
    if (!active || !startRect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    // Expand canvas area to contain particles that fly out
    const padding = 120;
    const cw = startRect.width + padding * 2;
    const ch = startRect.height + padding * 2;

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    canvas.style.left = `${startRect.left - padding}px`;
    canvas.style.top = `${startRect.top - padding}px`;
    ctx.scale(dpr, dpr);

    // Draw text to capture as bitmap
    const fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
    const textSize = window.innerWidth >= 768 ? fontSize * 1.125 : fontSize; // text-base or text-lg
    ctx.font = `400 ${textSize}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim();
    // Convert HSL token to actual color
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();
    ctx.fillStyle = `hsl(${fg})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "0.06em";
    ctx.fillText(title, cw / 2, ch / 2);

    // Capture text bitmap
    textImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    spawnedRef.current.clear();
    particlesRef.current = [];
    progressRef.current.value = 0;

    // GSAP dissolve progress
    const tl = gsap.timeline();
    tl.to(progressRef.current, {
      value: 1,
      duration: DISSOLVE_DURATION,
      ease: "power1.inOut",
      onComplete: () => {
        // Allow particles to finish before completing
        setTimeout(() => onComplete?.(), 400);
      },
    });

    const canvasLeft = startRect.left - padding;
    const canvasTop = startRect.top - padding;

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);

      const progress = progressRef.current.value;
      const imgData = textImageRef.current;

      if (imgData) {
        // Create a working copy of the text image
        const workingData = new ImageData(
          new Uint8ClampedArray(imgData.data),
          imgData.width,
          imgData.height
        );

        const step = Math.max(1, Math.round(2 / (window.devicePixelRatio || 1)));

        // Dissolve pixels based on noise
        for (let py = 0; py < imgData.height; py += step) {
          for (let px = 0; px < imgData.width; px += step) {
            const idx = (py * imgData.width + px) * 4;
            const alpha = imgData.data[idx + 3];
            if (alpha < 30) continue;

            const nx = px * NOISE_SCALE;
            const ny = py * NOISE_SCALE;
            const n = fbmNoise(nx, ny);

            if (n < progress) {
              // Erase this pixel region
              for (let dy = 0; dy < step && py + dy < imgData.height; dy++) {
                for (let dx = 0; dx < step && px + dx < imgData.width; dx++) {
                  const i2 = ((py + dy) * imgData.width + (px + dx)) * 4;
                  workingData.data[i2 + 3] = 0;
                }
              }

              // Spawn particle at dissolve boundary
              const spawnKey = `${Math.floor(px / (step * 3))},${Math.floor(py / (step * 3))}`;
              if (!spawnedRef.current.has(spawnKey) && Math.abs(n - progress) < 0.08) {
                spawnedRef.current.add(spawnKey);
                const dpx = px / (window.devicePixelRatio || 1);
                const dpy = py / (window.devicePixelRatio || 1);
                spawnParticle(dpx, dpy, canvasLeft, canvasTop);
              }
            }
          }
        }

        ctx.putImageData(workingData, 0, 0);
      }

      // Draw particles (in world coords converted to canvas-local)
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
        p.opacity = Math.max(0, Math.min(1, alpha * 0.85));

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;
        p.rotation += p.vr;

        // Convert world coords to canvas-local
        const lx = p.x - canvasLeft;
        const ly = p.y - canvasTop;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === "petal") {
          ctx.fillStyle = p.color + p.opacity + ")";
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s * 0.6, -s * 0.6, s * 0.8, s * 0.3, 0, s);
          ctx.bezierCurveTo(-s * 0.8, s * 0.3, -s * 0.6, -s * 0.6, 0, -s);
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
  }, [active, startRect, title, doorColor, onComplete, spawnParticle]);

  if (!active || !startRect) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed pointer-events-none"
      style={{ zIndex: 9999 }}
      aria-hidden="true"
    />
  );
};

export default TextDissolveOverlay;
