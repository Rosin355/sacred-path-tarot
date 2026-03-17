import { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

type GlyphVisualState = VoiceState | 'listening' | 'thinking';

interface VoiceStreakGlyphProps {
  state: VoiceState;
  visualState?: GlyphVisualState;
  analyser: AnalyserNode | null;
  onClick: () => void;
}

const STATE_LABELS: Record<VoiceState, string> = {
  idle: 'Assistente vocale — apri pannello',
  loading: 'Assistente vocale — caricamento in corso',
  speaking: 'Assistente vocale — in riproduzione',
  paused: 'Assistente vocale — in pausa',
  error: 'Assistente vocale — errore',
};

export default function VoiceStreakGlyph({ state, visualState, analyser, onClick }: VoiceStreakGlyphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();

  const effectiveState = visualState ?? state;

  const getAmplitude = useMemo(() => {
    if (!analyser) return () => 0;
    const data = new Uint8Array(analyser.frequencyBinCount);

    return () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i += 1) sum += data[i];
      return sum / (data.length * 255);
    };
  }, [analyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const size = 80;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;

    const drawTrail = ({
      phase,
      radius,
      sweep,
      opacity,
      width,
      hueShift,
      drift,
    }: {
      phase: number;
      radius: number;
      sweep: number;
      opacity: number;
      width: number;
      hueShift: number;
      drift: number;
    }) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const steps = reducedMotion ? 18 : 36;

      for (let i = 0; i < steps; i += 1) {
        const progress = i / steps;
        const angle = phase + progress * sweep;
        const modulation = reducedMotion ? 0 : Math.sin(time * 1.2 + progress * 7 + phase) * drift;
        const x = centerX + Math.cos(angle) * (radius + modulation);
        const y = centerY + Math.sin(angle) * (radius * 0.58 + modulation * 0.35);
        const nextAngle = phase + (progress + 1 / steps) * sweep;
        const nx = centerX + Math.cos(nextAngle) * (radius + modulation * 0.7);
        const ny = centerY + Math.sin(nextAngle) * (radius * 0.58 + modulation * 0.25);

        const segmentOpacity = opacity * (1 - progress) * 0.95;
        const gradient = context.createLinearGradient(x, y, nx, ny);
        gradient.addColorStop(0, `hsla(${270 + hueShift}, 48%, 88%, ${segmentOpacity})`);
        gradient.addColorStop(0.55, `hsla(${266 + hueShift}, 52%, 68%, ${segmentOpacity * 0.85})`);
        gradient.addColorStop(1, `hsla(${40 + hueShift * 0.2}, 46%, 58%, 0)`);

        context.strokeStyle = gradient;
        context.lineWidth = width * (1 - progress * 0.55);
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo((x + nx) / 2, (y + ny) / 2 + modulation * 0.1, nx, ny);
        context.stroke();
      }
    };

    const render = () => {
      time += reducedMotion ? 0.006 : 0.018;
      context.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      let amplitude = effectiveState === 'speaking' ? getAmplitude() : 0;
      if (reducedMotion) amplitude = 0;

      let speed = 0.7;
      let opacity = 0.28;
      let width = 2.3;
      let radius = 17;
      let drift = 2.2;
      let coreOpacity = 0.24;
      let hueShift = 0;

      switch (effectiveState) {
        case 'listening':
          speed = 1.05;
          opacity = 0.34;
          width = 2.5;
          radius = 17.5;
          drift = 2.6;
          coreOpacity = 0.28;
          break;
        case 'thinking':
        case 'loading':
          speed = 1.28;
          opacity = 0.38;
          width = 2.6;
          radius = 15.5;
          drift = 2;
          coreOpacity = 0.34;
          hueShift = -18;
          break;
        case 'speaking':
          speed = 1.55 + amplitude * 0.85;
          opacity = 0.34 + amplitude * 0.34;
          width = 2.6 + amplitude * 1.4;
          radius = 18 + amplitude * 2.6;
          drift = 2.8 + amplitude * 3.8;
          coreOpacity = 0.28 + amplitude * 0.18;
          break;
        case 'paused':
          speed = 0.32;
          opacity = 0.22;
          width = 2.1;
          radius = 16.5;
          drift = 1.2;
          coreOpacity = 0.18;
          break;
        case 'error':
          speed = 0.48;
          opacity = 0.26;
          width = 2.2;
          radius = 16;
          drift = 1.6;
          coreOpacity = 0.22;
          hueShift = 84;
          break;
        case 'idle':
        default:
          break;
      }

      const aura = context.createRadialGradient(centerX, centerY, 1, centerX, centerY, 30);
      aura.addColorStop(0, `hsla(${270 + hueShift}, 42%, 76%, ${coreOpacity})`);
      aura.addColorStop(0.45, `hsla(${262 + hueShift}, 40%, 40%, ${coreOpacity * 0.45})`);
      aura.addColorStop(1, 'transparent');
      context.fillStyle = aura;
      context.beginPath();
      context.arc(centerX, centerY, 30, 0, Math.PI * 2);
      context.fill();

      drawTrail({
        phase: time * speed,
        radius,
        sweep: Math.PI * 1.12,
        opacity,
        width,
        hueShift,
        drift,
      });

      drawTrail({
        phase: Math.PI + time * speed * -0.82,
        radius: radius - 1.5,
        sweep: Math.PI * 0.94,
        opacity: opacity * 0.82,
        width: Math.max(1.4, width - 0.5),
        hueShift: hueShift + 8,
        drift: drift * 0.78,
      });

      drawTrail({
        phase: Math.PI / 2 + time * speed * 0.56,
        radius: radius + 2.6,
        sweep: Math.PI * 0.62,
        opacity: opacity * 0.5,
        width: Math.max(1.2, width - 1),
        hueShift: hueShift - 10,
        drift: drift * 0.52,
      });

      const core = context.createRadialGradient(centerX - 2, centerY - 3, 0, centerX, centerY, 10);
      core.addColorStop(0, `hsla(${36 + hueShift * 0.15}, 55%, 88%, ${0.7 + amplitude * 0.2})`);
      core.addColorStop(0.4, `hsla(${270 + hueShift}, 48%, 80%, ${0.2 + amplitude * 0.12})`);
      core.addColorStop(1, 'transparent');
      context.fillStyle = core;
      context.beginPath();
      context.arc(centerX, centerY, 9.5 + amplitude * 2, 0, Math.PI * 2);
      context.fill();

      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameRef.current);
  }, [effectiveState, getAmplitude, reducedMotion]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="voice-streak-glyph"
      aria-label={STATE_LABELS[state]}
      title="Assistente vocale"
      data-voice-assistant
      data-voice-orb
      data-state={state}
      data-visual-state={effectiveState}
    >
      <span className="voice-streak-glyph__shell" aria-hidden="true" />
      <span className="voice-streak-glyph__halo" aria-hidden="true" />
      <canvas ref={canvasRef} className="voice-streak-glyph__canvas" style={{ width: 80, height: 80 }} />
      <span className="voice-streak-glyph__tooltip" aria-hidden="true">Ascolta o chiedi guida</span>
    </button>
  );
}
