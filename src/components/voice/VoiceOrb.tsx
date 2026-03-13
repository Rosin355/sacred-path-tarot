import { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

interface VoiceOrbProps {
  state: VoiceState;
  analyser: AnalyserNode | null;
  onClick: () => void;
}

/**
 * Animated sacred voice orb that reacts to audio playback.
 * States: idle, loading, speaking, paused, error
 */
export default function VoiceOrb({ state, analyser, onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  // Compute average amplitude from analyser
  const getAmplitude = useMemo(() => {
    if (!analyser) return () => 0;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    return () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      return sum / (dataArray.length * 255);
    };
  }, [analyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 56;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const baseRadius = 18;

      let amplitude = 0;
      if (state === 'speaking' && analyser) {
        amplitude = getAmplitude();
      }

      // State-based visual parameters
      let glowIntensity = 0.15;
      let pulseSpeed = 0.8;
      let hue = 270; // Sacred Violet
      let saturation = 48;
      let lightness = 35;

      switch (state) {
        case 'idle':
          glowIntensity = 0.12;
          pulseSpeed = 0.5;
          break;
        case 'loading':
          glowIntensity = 0.25;
          pulseSpeed = 2.5;
          break;
        case 'speaking':
          glowIntensity = 0.2 + amplitude * 0.5;
          pulseSpeed = 1.2;
          break;
        case 'paused':
          glowIntensity = 0.18;
          pulseSpeed = 0.3;
          break;
        case 'error':
          hue = 0;
          saturation = 60;
          lightness = 45;
          glowIntensity = 0.2;
          pulseSpeed = 0.4;
          break;
      }

      if (reducedMotion) {
        pulseSpeed = 0;
        amplitude = 0;
      }

      const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
      const radius = baseRadius + pulse * 2 + amplitude * 6;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2);
      outerGlow.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${glowIntensity * pulse})`);
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, size, size);

      // Main orb
      const gradient = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, radius);
      gradient.addColorStop(0, `hsla(${hue}, ${saturation + 10}%, ${lightness + 20}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`);
      gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.3)`);

      ctx.beginPath();
      
      // Organic shape using sin waves for speaking state
      if (state === 'speaking' && !reducedMotion) {
        const points = 64;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const wave1 = Math.sin(angle * 3 + time * 2) * amplitude * 3;
          const wave2 = Math.sin(angle * 5 + time * 1.5) * amplitude * 1.5;
          const r = radius + wave1 + wave2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      } else {
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      }
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner highlight
      const innerGlow = ctx.createRadialGradient(cx, cy - 4, 0, cx, cy, radius * 0.6);
      innerGlow.addColorStop(0, `hsla(${hue}, 30%, 90%, 0.25)`);
      innerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Loading spinner ring
      if (state === 'loading' && !reducedMotion) {
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 15}%, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const startAngle = time * 3;
        ctx.arc(cx, cy, radius + 4, startAngle, startAngle + Math.PI * 1.2);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [state, analyser, getAmplitude, reducedMotion]);

  const ariaLabel = {
    idle: 'Assistente vocale — apri pannello',
    loading: 'Assistente vocale — caricamento in corso',
    speaking: 'Assistente vocale — in riproduzione',
    paused: 'Assistente vocale — in pausa',
    error: 'Assistente vocale — errore',
  }[state];

  return (
    <button
      onClick={onClick}
      className="relative w-14 h-14 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full"
      aria-label={ariaLabel}
      title="Assistente vocale"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: 56, height: 56 }}
      />
    </button>
  );
}
