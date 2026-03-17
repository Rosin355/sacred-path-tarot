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

    const size = 96;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;

    const render = () => {
      time += reducedMotion ? 0.008 : 0.02;
      context.clearRect(0, 0, size, size);

      const center = size / 2;
      let amplitude = effectiveState === 'speaking' ? getAmplitude() : 0;
      if (reducedMotion) amplitude = 0;

      let ringOpacity = 0.28;
      let lineWidth = 2.8;
      let radius = 20;
      let warp = 2.2;
      let spin = 0.55;
      let pulse = 0.14;
      let hueShift = 0;

      switch (effectiveState) {
        case 'listening':
          ringOpacity = 0.34;
          lineWidth = 3.1;
          radius = 21;
          warp = 2.8;
          spin = 0.8;
          pulse = 0.18;
          break;
        case 'thinking':
        case 'loading':
          ringOpacity = 0.4;
          lineWidth = 3.2;
          radius = 19;
          warp = 2.1;
          spin = 1.1;
          pulse = 0.22;
          hueShift = -12;
          break;
        case 'speaking':
          ringOpacity = 0.42 + amplitude * 0.34;
          lineWidth = 3.2 + amplitude * 1.6;
          radius = 21 + amplitude * 2.8;
          warp = 3.4 + amplitude * 8;
          spin = 1 + amplitude * 1.4;
          pulse = 0.2 + amplitude * 0.25;
          break;
        case 'paused':
          ringOpacity = 0.22;
          lineWidth = 2.4;
          radius = 19;
          warp = 1.3;
          spin = 0.35;
          pulse = 0.08;
          break;
        case 'error':
          ringOpacity = 0.3;
          lineWidth = 2.8;
          radius = 20;
          warp = 2.2;
          spin = 0.55;
          pulse = 0.12;
          hueShift = 88;
          break;
        default:
          break;
      }

      const halo = context.createRadialGradient(center, center, 4, center, center, 34 + amplitude * 8);
      halo.addColorStop(0, `hsla(${215 + hueShift}, 100%, 76%, ${0.22 + pulse})`);
      halo.addColorStop(0.28, `hsla(${286 + hueShift}, 88%, 74%, ${0.16 + pulse * 0.8})`);
      halo.addColorStop(0.56, `hsla(${168 + hueShift}, 82%, 62%, ${0.1 + pulse * 0.55})`);
      halo.addColorStop(1, 'transparent');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(center, center, 36 + amplitude * 8, 0, Math.PI * 2);
      context.fill();

      const drawRibbon = (offset: number, alpha: number) => {
        const points = 160;
        context.beginPath();

        for (let i = 0; i <= points; i += 1) {
          const t = (i / points) * Math.PI * 2;
          const waveA = Math.sin(t * 2 + time * spin + offset) * warp;
          const waveB = Math.cos(t * 3 - time * (spin * 0.8) + offset) * (warp * 0.45);
          const r = radius + waveA + waveB;
          const x = center + Math.cos(t) * r;
          const y = center + Math.sin(t) * (r * 0.88);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const gradient = context.createConicGradient(time * 0.5 + offset, center, center);
        gradient.addColorStop(0, `hsla(${198 + hueShift}, 100%, 76%, ${ringOpacity * alpha})`);
        gradient.addColorStop(0.22, `hsla(${262 + hueShift}, 96%, 72%, ${ringOpacity * 0.95 * alpha})`);
        gradient.addColorStop(0.42, `hsla(${320 + hueShift}, 92%, 76%, ${ringOpacity * 0.8 * alpha})`);
        gradient.addColorStop(0.64, `hsla(${168 + hueShift}, 88%, 66%, ${ringOpacity * 0.88 * alpha})`);
        gradient.addColorStop(0.84, `hsla(${42 + hueShift * 0.2}, 95%, 70%, ${ringOpacity * 0.6 * alpha})`);
        gradient.addColorStop(1, `hsla(${198 + hueShift}, 100%, 76%, ${ringOpacity * alpha})`);

        context.strokeStyle = gradient;
        context.lineWidth = lineWidth;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.shadowBlur = 16 + amplitude * 14;
        context.shadowColor = `hsla(${252 + hueShift}, 90%, 72%, ${0.3 * alpha})`;
        context.stroke();
        context.shadowBlur = 0;
      };

      drawRibbon(0, 1);
      drawRibbon(Math.PI / 3, 0.55);
      drawRibbon(-Math.PI / 2.4, 0.28);

      const core = context.createRadialGradient(center, center, 0, center, center, 14 + amplitude * 2);
      core.addColorStop(0, `hsla(${0 + hueShift}, 0%, 100%, ${0.92})`);
      core.addColorStop(0.24, `hsla(${202 + hueShift}, 100%, 86%, ${0.58 + amplitude * 0.2})`);
      core.addColorStop(0.5, `hsla(${281 + hueShift}, 88%, 80%, ${0.22 + amplitude * 0.12})`);
      core.addColorStop(1, 'transparent');
      context.fillStyle = core;
      context.beginPath();
      context.arc(center, center, 14 + amplitude * 2, 0, Math.PI * 2);
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
      className="voice-streak-glyph voice-siri-glyph"
      aria-label={STATE_LABELS[state]}
      title="Assistente vocale"
      data-voice-assistant
      data-voice-orb
      data-state={state}
      data-visual-state={effectiveState}
    >
      <span className="voice-siri-glyph__outer-ring" aria-hidden="true" />
      <span className="voice-siri-glyph__rim" aria-hidden="true" />
      <span className="voice-siri-glyph__spin" aria-hidden="true" />
      <span className="voice-siri-glyph__surface" aria-hidden="true" />
      <span className="voice-streak-glyph__halo" aria-hidden="true" />
      <canvas ref={canvasRef} className="voice-streak-glyph__canvas" style={{ width: 96, height: 96 }} />
      <span className="voice-streak-glyph__tooltip" aria-hidden="true">Ascolta o chiedi guida</span>
    </button>
  );
}
