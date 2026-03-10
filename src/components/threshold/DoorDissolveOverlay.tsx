import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import templeArch from "@/assets/temple-arch.png";

interface Props {
  doorRect: DOMRect | null;
  titleText: string;
  subtitleText: string;
  active: boolean;
  onComplete?: () => void;
  doorColor: string;
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

const NOISE_SCALE = 0.035;
const DISSOLVE_DURATION = 2.4;
const PADDING = 150;

const DoorDissolveOverlay = ({ doorRect, titleText, subtitleText, active, onComplete, doorColor }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef({ value: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const snapshotRef = useRef<ImageData | null>(null);
  const spawnedRef = useRef<Set<string>>(new Set());
  const archImgRef = useRef<HTMLImageElement | null>(null);

  const spawnParticle = useCallback(
    (px: number, py: number, canvasLeft: number, canvasTop: number) => {
      const { h, s, l } = parseHSL(doorColor);
      const worldX = canvasLeft + px;
      const worldY = canvasTop + py;
      const isPetal = Math.random() > 0.55;
      const angle = randomRange(0, Math.PI * 2);
      const speed = isPetal ? randomRange(0.6, 2.0) : randomRange(0.2, 1.2);

      particlesRef.current.push({
        x: worldX,
        y: worldY,
        size: isPetal ? randomRange(6, 16) : randomRange(1.5, 4),
        rotation: randomRange(0, 360),
        opacity: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - randomRange(0.2, 0.8),
        vr: isPetal ? randomRange(-2, 2) : 0,
        life: 0,
        maxLife: randomRange(60, 130),
        color: isPetal
          ? `hsla(${h + randomRange(-15, 15)}, ${s + randomRange(-10, 10)}%, ${l + randomRange(-5, 15)}%, `
          : `hsla(${h}, ${s - 10}%, ${l + 20}%, `,
        type: isPetal ? "petal" : "dust",
      });
    },
    [doorColor]
  );

  // Preload arch image
  useEffect(() => {
    const img = new Image();
    img.src = templeArch;
    img.onload = () => {
      archImgRef.current = img;
    };
  }, []);

  useEffect(() => {
    if (!active || !doorRect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = doorRect.width + PADDING * 2;
    const ch = doorRect.height + PADDING * 2;

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    canvas.style.left = `${doorRect.left - PADDING}px`;
    canvas.style.top = `${doorRect.top - PADDING}px`;
    ctx.scale(dpr, dpr);

    // Draw the door snapshot onto canvas
    const drawSnapshot = () => {
      ctx.clearRect(0, 0, cw, ch);

      const archImg = archImgRef.current;
      const doorW = doorRect.width;

      // Draw arch image centered in canvas
      if (archImg) {
        const imgAspect = archImg.naturalHeight / archImg.naturalWidth;
        const drawW = doorW;
        const drawH = drawW * imgAspect;
        const drawX = PADDING;
        const drawY = PADDING;
        ctx.drawImage(archImg, drawX, drawY, drawW, drawH);
      }

      // Draw title text
      const root = document.documentElement;
      const fg = getComputedStyle(root).getPropertyValue("--foreground").trim();
      const isMd = window.innerWidth >= 768;
      const titleSize = isMd ? 18 : 16;

      ctx.font = `400 ${titleSize}px 'Cormorant Garamond', serif`;
      ctx.fillStyle = `hsl(${fg})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.letterSpacing = "0.06em";

      // Title position: below the arch image
      const archImg2 = archImgRef.current;
      let textY = PADDING + doorW * 1.3 + 16; // estimate arch height + margin
      if (archImg2) {
        const imgAspect = archImg2.naturalHeight / archImg2.naturalWidth;
        textY = PADDING + doorW * imgAspect + 16;
      }

      ctx.fillText(titleText, cw / 2, textY);

      // Draw subtitle
      const mutedFg = getComputedStyle(root).getPropertyValue("--muted-foreground").trim();
      ctx.font = `400 ${isMd ? 10.5 : 10}px 'Source Sans 3', sans-serif`;
      ctx.fillStyle = `hsl(${mutedFg})`;
      ctx.fillText(subtitleText, cw / 2, textY + titleSize + 8);

      // Capture snapshot
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Wait a frame for arch image, or proceed immediately
    if (archImgRef.current) {
      drawSnapshot();
    } else {
      const img = new Image();
      img.src = templeArch;
      img.onload = () => {
        archImgRef.current = img;
        drawSnapshot();
      };
    }

    spawnedRef.current.clear();
    particlesRef.current = [];
    progressRef.current.value = 0;

    const tl = gsap.timeline();
    tl.to(progressRef.current, {
      value: 1,
      duration: DISSOLVE_DURATION,
      ease: "power1.inOut",
      onComplete: () => {
        setTimeout(() => onComplete?.(), 500);
      },
    });

    const canvasLeft = doorRect.left - PADDING;
    const canvasTop = doorRect.top - PADDING;

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);

      const progress = progressRef.current.value;
      const imgData = snapshotRef.current;

      if (imgData) {
        const workingData = new ImageData(
          new Uint8ClampedArray(imgData.data),
          imgData.width,
          imgData.height
        );

        const step = Math.max(1, Math.round(2 / dpr));

        for (let py = 0; py < imgData.height; py += step) {
          for (let px = 0; px < imgData.width; px += step) {
            const idx = (py * imgData.width + px) * 4;
            const alpha = imgData.data[idx + 3];
            if (alpha < 20) continue;

            const nx = px * NOISE_SCALE;
            const ny = py * NOISE_SCALE;
            const n = fbmNoise(nx, ny);

            if (n < progress) {
              for (let dy = 0; dy < step && py + dy < imgData.height; dy++) {
                for (let dx = 0; dx < step && px + dx < imgData.width; dx++) {
                  const i2 = ((py + dy) * imgData.width + (px + dx)) * 4;
                  workingData.data[i2 + 3] = 0;
                }
              }

              // Spawn particles at dissolve boundary
              const cellSize = step * 4;
              const spawnKey = `${Math.floor(px / cellSize)},${Math.floor(py / cellSize)}`;
              if (!spawnedRef.current.has(spawnKey) && Math.abs(n - progress) < 0.06) {
                spawnedRef.current.add(spawnKey);
                spawnParticle(px / dpr, py / dpr, canvasLeft, canvasTop);
              }
            }
          }
        }

        ctx.putImageData(workingData, 0, 0);
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

    // Small delay to ensure snapshot is ready
    const startTimer = setTimeout(() => {
      if (snapshotRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }, 50);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(rafRef.current);
      tl.kill();
    };
  }, [active, doorRect, titleText, subtitleText, doorColor, onComplete, spawnParticle]);

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
