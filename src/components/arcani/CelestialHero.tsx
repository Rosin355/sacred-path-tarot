import { useEffect, useRef, useMemo } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TAROT_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
];

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
}

interface FloatingCard {
  x: number;
  y: number;
  baseY: number;
  rotation: number;
  rotationSpeed: number;
  floatSpeed: number;
  floatAmplitude: number;
  scale: number;
  opacity: number;
  imgIndex: number;
  phase: number;
}

const CelestialHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedRef = useRef(0);

  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = [];
    for (let i = 0; i < 120; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.0003 + 0.0001,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  const cards = useMemo<FloatingCard[]>(() => {
    const positions = [
      { x: 0.08, y: 0.25, scale: 0.55, opacity: 0.12 },
      { x: 0.85, y: 0.18, scale: 0.5, opacity: 0.1 },
      { x: 0.15, y: 0.7, scale: 0.45, opacity: 0.09 },
      { x: 0.88, y: 0.65, scale: 0.6, opacity: 0.13 },
      { x: 0.5, y: 0.85, scale: 0.4, opacity: 0.08 },
    ];
    return positions.map((p, i) => ({
      x: p.x,
      y: p.y,
      baseY: p.y,
      rotation: (Math.random() - 0.5) * 15,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      floatSpeed: Math.random() * 0.0006 + 0.0003,
      floatAmplitude: Math.random() * 0.02 + 0.01,
      scale: p.scale,
      opacity: p.opacity,
      imgIndex: i,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    // Preload tarot card images
    TAROT_IMAGES.forEach((src, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        loadedRef.current++;
      };
      imagesRef.current[i] = img;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      // Static render
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x * rect.width, s.y * rect.height, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(270, 30%, 85%, ${s.opacity})`;
        ctx.fill();
      });
      return () => window.removeEventListener("resize", resize);
    }

    let time = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      time++;

      // Draw stars
      stars.forEach((s) => {
        const twinkle = Math.sin(time * s.speed * 60 + s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(270, 30%, 85%, ${s.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw floating tarot cards
      if (loadedRef.current > 0) {
        cards.forEach((card) => {
          const img = imagesRef.current[card.imgIndex];
          if (!img || !img.complete) return;

          const floatY = Math.sin(time * card.floatSpeed * 60 + card.phase) * card.floatAmplitude;
          const currentRotation = card.rotation + Math.sin(time * card.rotationSpeed * 0.5 + card.phase) * 3;

          const cx = card.x * w;
          const cy = (card.baseY + floatY) * h;
          const cardW = 70 * card.scale;
          const cardH = 120 * card.scale;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((currentRotation * Math.PI) / 180);
          ctx.globalAlpha = card.opacity;

          // Card shadow
          ctx.shadowColor = "hsla(270, 55%, 45%, 0.3)";
          ctx.shadowBlur = 20;

          // Draw card with rounded corners
          const r = 4 * card.scale;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, r);
          ctx.clip();
          ctx.drawImage(img, -cardW / 2, -cardH / 2, cardW, cardH);

          // Subtle border
          ctx.strokeStyle = "hsla(270, 40%, 60%, 0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        });
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [stars, cards, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default CelestialHero;
