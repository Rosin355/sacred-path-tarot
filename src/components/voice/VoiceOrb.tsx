import { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

type OrbVisualState = VoiceState | 'listening' | 'thinking';

interface VoiceOrbProps {
  state: VoiceState;
  visualState?: OrbVisualState;
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

export default function VoiceOrb({ state, visualState, analyser, onClick }: VoiceOrbProps) {
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

    const size = 108;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;

    const render = () => {
      time += reducedMotion ? 0.007 : 0.018;
      context.clearRect(0, 0, size, size);

      const center = size / 2;
      let amplitude = effectiveState === 'speaking' ? getAmplitude() : 0;
      if (reducedMotion) amplitude = 0;

      let ringOpacity = 0.24;
      let lineWidth = 1.35;
      let radius = 22.5;
      let warp = 2.1;
      let spin = 0.52;
      let pulse = 0.08;
      let hueShift = 0;
      let verticalStretch = 0.82;
      let tailLength = 0.9;

      switch (effectiveState) {
        case 'listening':
          ringOpacity = 0.3;
          lineWidth = 1.5;
          radius = 23.5;
          warp = 2.7;
          spin = 0.72;
          pulse = 0.12;
          break;
        case 'thinking':
        case 'loading':
          ringOpacity = 0.32;
          lineWidth = 1.58;
          radius = 22;
          warp = 2.2;
          spin = 0.9;
          pulse = 0.14;
          hueShift = -8;
          break;
        case 'speaking':
          ringOpacity = 0.34 + amplitude * 0.24;
          lineWidth = 1.5 + amplitude * 0.9;
          radius = 23.5 + amplitude * 4.2;
          warp = 3.2 + amplitude * 9.8;
          spin = 0.88 + amplitude * 1.42;
          pulse = 0.16 + amplitude * 0.24;
          verticalStretch = 0.78;
          tailLength = 1.32 + amplitude * 0.42;
          break;
        case 'paused':
          ringOpacity = 0.18;
          lineWidth = 1.2;
          radius = 22;
          warp = 1.2;
          spin = 0.28;
          pulse = 0.04;
          break;
        case 'error':
          ringOpacity = 0.24;
          lineWidth = 1.35;
          radius = 22.5;
          warp = 1.8;
          spin = 0.44;
          pulse = 0.08;
          hueShift = 88;
          break;
        default:
          break;
      }

      const halo = context.createRadialGradient(center, center, 4, center, center, 36 + amplitude * 8);
      halo.addColorStop(0, `hsla(${210 + hueShift}, 100%, 78%, ${0.11 + pulse})`);
      halo.addColorStop(0.32, `hsla(${272 + hueShift}, 98%, 77%, ${0.1 + pulse * 0.76})`);
      halo.addColorStop(0.58, `hsla(${178 + hueShift}, 84%, 66%, ${0.06 + pulse * 0.4})`);
      halo.addColorStop(1, 'transparent');
      context.fillStyle = halo;
      context.beginPath();
      context.arc(center, center, 36 + amplitude * 6, 0, Math.PI * 2);
      context.fill();

      const drawRibbon = (offset: number, alpha: number) => {
        const points = 220;
        context.beginPath();

        for (let i = 0; i <= points; i += 1) {
          const t = (i / points) * Math.PI * 2 * tailLength;
          const waveA = Math.sin(t * 1.8 + time * spin + offset) * warp;
          const waveB = Math.cos(t * 2.6 - time * (spin * 0.8) + offset) * (warp * 0.34);
          const decay = 1 - i / points;
          const trailPull = effectiveState === 'speaking' ? decay * amplitude * 12 : decay * 2.4;
          const r = radius + waveA + waveB + trailPull;
          const x = center + Math.cos(t) * r;
          const y = center + Math.sin(t) * (r * verticalStretch);
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }

        const gradient = context.createConicGradient(time * 0.42 + offset, center, center);
        gradient.addColorStop(0, `hsla(${202 + hueShift}, 100%, 79%, ${ringOpacity * alpha})`);
        gradient.addColorStop(0.24, `hsla(${248 + hueShift}, 100%, 78%, ${ringOpacity * 0.9 * alpha})`);
        gradient.addColorStop(0.48, `hsla(${286 + hueShift}, 100%, 79%, ${ringOpacity * 0.94 * alpha})`);
        gradient.addColorStop(0.7, `hsla(${328 + hueShift}, 92%, 80%, ${ringOpacity * 0.64 * alpha})`);
        gradient.addColorStop(0.88, `hsla(${178 + hueShift}, 82%, 69%, ${ringOpacity * 0.72 * alpha})`);
        gradient.addColorStop(1, `hsla(${202 + hueShift}, 100%, 79%, ${ringOpacity * alpha})`);

        context.strokeStyle = gradient;
        context.lineWidth = lineWidth;
        context.lineJoin = 'round';
        context.lineCap = 'round';
        context.shadowBlur = 12 + amplitude * 12;
        context.shadowColor = `hsla(${252 + hueShift}, 88%, 74%, ${0.24 * alpha})`;
        context.stroke();
        context.shadowBlur = 0;
      };

      drawRibbon(0, 1);
      drawRibbon(Math.PI / 3.4, 0.42);
      drawRibbon(-Math.PI / 2.8, 0.22);

      const core = context.createRadialGradient(center, center, 0, center, center, 14 + amplitude * 1.6);
      core.addColorStop(0, `hsla(${0 + hueShift}, 0%, 100%, 0.88)`);
      core.addColorStop(0.22, `hsla(${204 + hueShift}, 100%, 88%, ${0.34 + amplitude * 0.14})`);
      core.addColorStop(0.5, `hsla(${280 + hueShift}, 88%, 82%, ${0.12 + amplitude * 0.08})`);
      core.addColorStop(1, 'transparent');
      context.fillStyle = core;
      context.beginPath();
      context.arc(center, center, 14 + amplitude * 1.6, 0, Math.PI * 2);
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
      className="voice-orb voice-siri-orb"
      aria-label={STATE_LABELS[state]}
      title="Assistente vocale"
      data-voice-assistant
      data-voice-orb
      data-state={state}
      data-visual-state={effectiveState}
    >
      <span className="voice-siri-orb__surface" aria-hidden="true" />
      <span className="voice-orb-halo" aria-hidden="true" />
      <span className="voice-orb-halo" aria-hidden="true" />
      <canvas ref={canvasRef} className="voice-orb-canvas" style={{ width: 108, height: 108 }} />
      <span className="voice-orb-tooltip" aria-hidden="true">Ascolta o chiedi guida</span>
    </button>
  );
}
