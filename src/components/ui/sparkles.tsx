import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type SparklesCoreProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
  active?: boolean;
  direction?: 'top' | 'top-right' | 'top-left' | 'none';
};

const DIRECTION_ANGLE: Record<NonNullable<SparklesCoreProps['direction']>, number> = {
  top: -Math.PI / 2,
  'top-right': -Math.PI / 4,
  'top-left': (-3 * Math.PI) / 4,
  none: -Math.PI / 2,
};

const COLOR_VAR_FALLBACK = '0 0% 100%';

const resolveCssVarColor = (color: string, target?: HTMLElement | null) => {
  if (!color.includes('var(') || !target) return color;

  const computed = getComputedStyle(target);
  return color.replace(/var\((--[^)]+)\)/g, (_, token: string) => {
    const value = computed.getPropertyValue(token).trim();
    return value || COLOR_VAR_FALLBACK;
  });
};

type Particle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  drift: number;
};

export const SparklesCore = ({
  className,
  background = 'transparent',
  minSize = 1,
  maxSize = 3,
  speed = 1,
  particleColor = 'hsl(var(--foreground))',
  particleDensity = 120,
  active = true,
  direction = 'top',
}: SparklesCoreProps) => {
  const [resolvedParticleColor, setResolvedParticleColor] = useState(particleColor);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    setResolvedParticleColor(resolveCssVarColor(particleColor, containerRef.current));
  }, [particleColor]);

  const particles = useMemo<Particle[]>(() => {
    const count = Math.max(12, Math.round(particleDensity));
    const angle = DIRECTION_ANGLE[direction];

    return Array.from({ length: count }, () => {
      const velocity = (0.25 + Math.random() * 0.75) * speed;
      const spread = direction === 'none' ? Math.PI * 2 : 0.65;
      const particleAngle = direction === 'none'
        ? Math.random() * Math.PI * 2
        : angle + (Math.random() - 0.5) * spread;

      return {
        x: Math.random(),
        y: Math.random(),
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: 0.15 + Math.random() * 0.85,
        velocityX: Math.cos(particleAngle) * velocity * 0.0018,
        velocityY: Math.sin(particleAngle) * velocity * 0.0018,
        drift: (Math.random() - 0.5) * 0.0008,
      };
    });
  }, [direction, maxSize, minSize, particleDensity, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, rect.width) * dpr;
      canvas.height = Math.max(1, rect.height) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let lastTime = performance.now();

    const tick = (now: number) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const delta = Math.min(32, now - lastTime);
      lastTime = now;

      context.clearRect(0, 0, width, height);

      if (background !== 'transparent') {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
      }

      if (active) {
        for (const particle of particles) {
          particle.x += particle.velocityX * delta;
          particle.y += particle.velocityY * delta;
          particle.x += Math.sin(now * 0.001 + particle.y * 10) * particle.drift * delta;

          if (particle.x < -0.08 || particle.x > 1.08 || particle.y < -0.08 || particle.y > 1.08) {
            particle.x = 0.5 + (Math.random() - 0.5) * 0.3;
            particle.y = 1.02;
          }

          const x = particle.x * width;
          const y = particle.y * height;
          const radius = particle.size;
          const gradient = context.createRadialGradient(x, y, 0, x, y, radius * 3);
          gradient.addColorStop(0, resolvedParticleColor.replace('hsl(', 'hsla(').replace(')', ` / ${particle.opacity})`));
          gradient.addColorStop(1, 'transparent');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(x, y, radius * 3, 0, Math.PI * 2);
          context.fill();
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
    };
  }, [active, background, particles, resolvedParticleColor]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none transition-opacity duration-300 ease-out', active ? 'opacity-100' : 'opacity-0', className)}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default SparklesCore;
