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
      taper,
    }: {
      phase: number;
      radius: number;
      sweep: number;
      opacity: number;
      width: number;
      hueShift: number;
      drift: number;
      taper: number;
    }) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const steps = reducedMotion ? 26 : 68;

      for (let i = 0; i < steps; i += 1) {
        const progress = i / steps;
        const angle = phase + progress * sweep;
        const curveWave = reducedMotion ? 0 : Math.sin(time * 1.45 + progress * 9 + phase) * drift;
        const x = centerX + Math.cos(angle) * (radius + curveWave);
        const y = centerY + Math.sin(angle) * (radius * 0.42 + curveWave * 0.24);
        const nextAngle = phase + (progress + 1 / steps) * sweep;
        const nextWave = reducedMotion ? 0 : Math.sin(time * 1.45 + (progress + 1 / steps) * 9 + phase) * drift;
        const nx = centerX + Math.cos(nextAngle) * (radius + nextWave);
        const ny = centerY + Math.sin(nextAngle) * (radius * 0.42 + nextWave * 0.24);

        const segmentOpacity = opacity * Math.pow(1 - progress, taper);
        const gradient = context.createLinearGradient(x, y, nx, ny);
        gradient.addColorStop(0, `hsla(${272 + hueShift}, 58%, 94%, ${segmentOpacity})`);
        gradient.addColorStop(0.3, `hsla(${266 + hueShift}, 56%, 76%, ${segmentOpacity * 0.95})`);
        gradient.addColorStop(0.7, `hsla(${42 + hueShift * 0.18}, 54%, 66%, ${segmentOpacity * 0.35})`);
        gradient.addColorStop(1, 'transparent');

        context.strokeStyle = gradient;
        context.lineWidth = Math.max(0.45, width * (1 - progress * 0.82));
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(x, y);
        context.quadraticCurveTo((x + nx) / 2, (y + ny) / 2 + curveWave * 0.08, nx, ny);
        context.stroke();
      }
    };

    const render = () => {
      time += reducedMotion ? 0.005 : 0.017;
      context.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      let amplitude = effectiveState === 'speaking' ? getAmplitude() : 0;
      if (reducedMotion) amplitude = 0;

      let speed = 0.62;
      let opacity = 0.22;
      let width = 1.55;
      let radius = 18;
      let drift = 1.8;
      let coreOpacity = 0.18;
      let auraOpacity = 0.16;
      let auraRadius = 26;
      let tailSweep = Math.PI * 1.46;
      let taper = 1.85;
      let hueShift = 0;

      switch (effectiveState) {
        case 'listening':
          speed = 0.92;
          opacity = 0.28;
          width = 1.65;
          radius = 18.5;
          drift = 2.2;
          coreOpacity = 0.22;
          auraOpacity = 0.2;
          tailSweep = Math.PI * 1.62;
          taper = 1.95;
          break;
        case 'thinking':
        case 'loading':
          speed = 1.18;
          opacity = 0.3;
          width = 1.7;
          radius = 16.2;
          drift = 1.5;
          coreOpacity = 0.28;
          auraOpacity = 0.22;
          auraRadius = 24;
          tailSweep = Math.PI * 1.72;
          taper = 2.05;
          hueShift = -18;
          break;
        case 'speaking':
          speed = 1.38 + amplitude * 0.95;
          opacity = 0.34 + amplitude * 0.32;
          width = 1.78 + amplitude * 0.52;
          radius = 19 + amplitude * 2.8;
          drift = 2.5 + amplitude * 4.2;
          coreOpacity = 0.24 + amplitude * 0.18;
          auraOpacity = 0.24 + amplitude * 0.24;
          auraRadius = 28 + amplitude * 5;
          tailSweep = Math.PI * (1.95 + amplitude * 0.85);
          taper = 2.35 + amplitude * 0.45;
          break;
        case 'paused':
          speed = 0.26;
          opacity = 0.16;
          width = 1.3;
          radius = 17;
          drift = 0.9;
          coreOpacity = 0.12;
          auraOpacity = 0.12;
          tailSweep = Math.PI * 1.28;
          taper = 1.75;
          break;
        case 'error':
          speed = 0.42;
          opacity = 0.2;
          width = 1.45;
          radius = 16.6;
          drift = 1.2;
          coreOpacity = 0.16;
          auraOpacity = 0.16;
          auraRadius = 24;
          tailSweep = Math.PI * 1.42;
          taper = 1.9;
          hueShift = 84;
          break;
        case 'idle':
        default:
          break;
      }

      const outerAura = context.createRadialGradient(centerX, centerY, 2, centerX, centerY, auraRadius);
      outerAura.addColorStop(0, `hsla(${270 + hueShift}, 46%, 74%, ${auraOpacity})`);
      outerAura.addColorStop(0.42, `hsla(${262 + hueShift}, 42%, 44%, ${auraOpacity * 0.45})`);
      outerAura.addColorStop(1, 'transparent');
      context.fillStyle = outerAura;
      context.beginPath();
      context.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      context.fill();

      const innerBloom = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 16 + amplitude * 4);
      innerBloom.addColorStop(0, `hsla(${42 + hueShift * 0.12}, 70%, 86%, ${coreOpacity * 0.95})`);
      innerBloom.addColorStop(0.34, `hsla(${270 + hueShift}, 58%, 74%, ${coreOpacity * 0.52})`);
      innerBloom.addColorStop(1, 'transparent');
      context.fillStyle = innerBloom;
      context.beginPath();
      context.arc(centerX, centerY, 16 + amplitude * 4, 0, Math.PI * 2);
      context.fill();

      drawTrail({
        phase: time * speed,
        radius,
        sweep: tailSweep,
        opacity,
        width,
        hueShift,
        drift,
        taper,
      });

      drawTrail({
        phase: Math.PI + time * speed * -0.7,
        radius: radius - 0.8,
        sweep: tailSweep * 0.88,
        opacity: opacity * 0.8,
        width: Math.max(0.7, width - 0.18),
        hueShift: hueShift + 6,
        drift: drift * 0.82,
        taper: taper + 0.1,
      });

      drawTrail({
        phase: Math.PI / 2 + time * speed * 0.48,
        radius: radius + 2.2,
        sweep: tailSweep * 0.52,
        opacity: opacity * 0.34,
        width: Math.max(0.5, width - 0.58),
        hueShift: hueShift - 10,
        drift: drift * 0.46,
        taper: taper + 0.28,
      });

      const core = context.createRadialGradient(centerX - 1.5, centerY - 2, 0, centerX, centerY, 8 + amplitude * 1.8);
      core.addColorStop(0, `hsla(${38 + hueShift * 0.1}, 72%, 92%, ${0.88 + amplitude * 0.08})`);
      core.addColorStop(0.38, `hsla(${270 + hueShift}, 54%, 82%, ${0.24 + amplitude * 0.1})`);
      core.addColorStop(1, 'transparent');
      context.fillStyle = core;
      context.beginPath();
      context.arc(centerX, centerY, 8 + amplitude * 1.8, 0, Math.PI * 2);
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
