import { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOrbEyeTracking } from '@/hooks/useOrbEyeTracking';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

type OrbVisualState = VoiceState | 'hover' | 'listening' | 'thinking';

interface VoiceOrbProps {
  state: VoiceState;
  visualState?: OrbVisualState;
  analyser: AnalyserNode | null;
  onClick: () => void;
}

/**
 * Animated sacred voice orb that reacts to audio playback.
 * States: idle, listening, thinking, speaking, paused, error
 */
export default function VoiceOrb({ state, visualState, analyser, onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const isInteractiveTracking = !reducedMotion && !isMobile;
  const { orbRef, eyeState, setHovering, reactToTap } = useOrbEyeTracking<HTMLButtonElement>({
    disabled: reducedMotion,
  });

  const effectiveVisualState: OrbVisualState = eyeState.isHovering && state === 'idle'
    ? 'hover'
    : (visualState ?? state);

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
    const size = 72;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const baseRadius = 22;

      let amplitude = 0;
      if (state === 'speaking' && analyser) {
        amplitude = getAmplitude();
      }

      let glowIntensity = 0.2;
      let pulseSpeed = 0.85;
      let hue = 270;
      let saturation = 48;
      let lightness = 39;
      let ringOpacity = 0.34;
      let ringWidth = 1.6;
      let auraSpread = 2.1;
      let shimmerOpacity = 0.08;
      let thinkingArcOpacity = 0;
      let listeningPulseOpacity = 0;

      switch (effectiveVisualState) {
        case 'idle':
          glowIntensity = 0.2;
          pulseSpeed = 0.5;
          ringOpacity = 0.36;
          break;
        case 'hover':
          glowIntensity = 0.25;
          pulseSpeed = 0.75;
          ringOpacity = 0.48;
          lightness = 42;
          shimmerOpacity = 0.12;
          break;
        case 'listening':
          glowIntensity = 0.24;
          pulseSpeed = 1.1;
          ringOpacity = 0.52;
          ringWidth = 1.9;
          lightness = 43;
          saturation = 42;
          listeningPulseOpacity = 0.26;
          break;
        case 'thinking':
          glowIntensity = 0.27;
          pulseSpeed = 1.35;
          ringOpacity = 0.46;
          ringWidth = 1.8;
          hue = 40;
          saturation = 38;
          lightness = 54;
          auraSpread = 2.25;
          shimmerOpacity = 0.18;
          thinkingArcOpacity = 0.34;
          break;
        case 'speaking':
          glowIntensity = 0.24 + amplitude * 0.55;
          pulseSpeed = 1.35;
          ringOpacity = 0.42 + amplitude * 0.28;
          ringWidth = 1.7 + amplitude * 1.1;
          auraSpread = 2.35 + amplitude * 0.45;
          shimmerOpacity = 0.12 + amplitude * 0.1;
          break;
        case 'paused':
          glowIntensity = 0.19;
          pulseSpeed = 0.24;
          ringOpacity = 0.32;
          break;
        case 'error':
          hue = 0;
          saturation = 52;
          lightness = 47;
          glowIntensity = 0.22;
          pulseSpeed = 0.35;
          ringOpacity = 0.38;
          break;
      }

      if (reducedMotion) {
        pulseSpeed = 0;
        amplitude = 0;
      }

      const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
      const radius = baseRadius + pulse * 1.8 + amplitude * 6;

      const shadowGlow = ctx.createRadialGradient(cx, cy + 5, radius * 0.25, cx, cy + 5, radius * 2.7);
      shadowGlow.addColorStop(0, `hsla(${hue}, ${saturation}%, ${Math.max(lightness - 8, 10)}%, ${0.22 + pulse * 0.08})`);
      shadowGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = shadowGlow;
      ctx.fillRect(0, 0, size, size);

      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius * auraSpread);
      outerGlow.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 8}%, ${glowIntensity * (0.5 + pulse * 0.6)})`);
      outerGlow.addColorStop(0.55, `hsla(${hue}, ${saturation}%, ${lightness}%, ${glowIntensity * 0.38})`);
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, size, size);

      ctx.save();
      ctx.beginPath();
      if (state === 'speaking' && !reducedMotion) {
        const points = 72;
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const wave1 = Math.sin(angle * 3 + time * 2.1) * amplitude * 2.9;
          const wave2 = Math.sin(angle * 5 + time * 1.6) * amplitude * 1.35;
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
      ctx.clip();

      const gradient = ctx.createRadialGradient(cx - 5, cy - 7, 0, cx, cy, radius * 1.1);
      gradient.addColorStop(0, `hsla(${hue}, ${Math.min(saturation + 16, 100)}%, ${lightness + 27}%, 0.98)`);
      gradient.addColorStop(0.28, `hsla(${hue}, ${saturation + 7}%, ${lightness + 12}%, 0.9)`);
      gradient.addColorStop(0.68, `hsla(${hue}, ${saturation}%, ${lightness - 4}%, 0.74)`);
      gradient.addColorStop(1, `hsla(${hue}, ${Math.max(saturation - 8, 18)}%, ${Math.max(lightness - 17, 10)}%, 0.84)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(cx - radius - 10, cy - radius - 10, radius * 2 + 20, radius * 2 + 20);

      const internalShimmer = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      internalShimmer.addColorStop(0, `hsla(${hue}, 55%, 92%, ${0.12 + pulse * 0.06})`);
      internalShimmer.addColorStop(0.5, 'transparent');
      internalShimmer.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, ${shimmerOpacity})`);
      ctx.fillStyle = internalShimmer;
      ctx.fillRect(cx - radius - 10, cy - radius - 10, radius * 2 + 20, radius * 2 + 20);

      const innerGlow = ctx.createRadialGradient(cx - 6, cy - 8, 0, cx, cy, radius * 0.9);
      innerGlow.addColorStop(0, `hsla(${hue}, 32%, 94%, ${0.28 + pulse * 0.06})`);
      innerGlow.addColorStop(0.45, `hsla(${hue}, ${saturation}%, ${lightness + 18}%, 0.14)`);
      innerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = innerGlow;
      ctx.fillRect(cx - radius - 10, cy - radius - 10, radius * 2 + 20, radius * 2 + 20);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, radius + 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, ${saturation + 8}%, ${lightness + 22}%, ${ringOpacity})`;
      ctx.lineWidth = ringWidth;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius - 4.5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 18%, 96%, ${0.12 + pulse * 0.06})`;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      if (listeningPulseOpacity > 0 && !reducedMotion) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 7 + pulse * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, ${saturation + 8}%, ${lightness + 18}%, ${listeningPulseOpacity * (0.6 + pulse * 0.4)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      if (thinkingArcOpacity > 0 && !reducedMotion) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 6, time * 1.5, time * 1.5 + Math.PI * 0.82);
        ctx.strokeStyle = `hsla(${hue}, ${saturation + 10}%, ${lightness + 14}%, ${thinkingArcOpacity})`;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, radius + 9, -time * 1.15, -time * 1.15 + Math.PI * 0.45);
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 8}%, ${thinkingArcOpacity * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (state === 'speaking' && !reducedMotion) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 6 + pulse * 1.2, time * 1.7, time * 1.7 + Math.PI * 0.95);
        ctx.strokeStyle = `hsla(${hue}, ${saturation + 12}%, ${lightness + 18}%, ${0.26 + amplitude * 0.24})`;
        ctx.lineWidth = 1.35;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [state, effectiveVisualState, analyser, getAmplitude, reducedMotion]);

  const ariaLabel = {
    idle: 'Assistente vocale — apri pannello',
    loading: 'Assistente vocale — caricamento in corso',
    speaking: 'Assistente vocale — in riproduzione',
    paused: 'Assistente vocale — in pausa',
    error: 'Assistente vocale — errore',
  }[state];

  const showAwakeState = eyeState.isHovering || effectiveVisualState === 'listening' || effectiveVisualState === 'thinking' || state === 'speaking';

  return (
    <button
      ref={orbRef}
      onClick={() => {
        if (isMobile) reactToTap();
        onClick();
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="voice-orb group relative h-[72px] w-[72px] cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={ariaLabel}
      title="Assistente vocale"
      data-state={state}
      data-visual-state={effectiveVisualState}
      data-hovered={eyeState.isHovering ? 'true' : 'false'}
    >
      <span className="voice-orb-shell" aria-hidden="true" />
      <span className="voice-orb-halo" aria-hidden="true" />

      <canvas
        ref={canvasRef}
        className="relative z-[1] h-full w-full"
        style={{ width: 72, height: 72 }}
      />

      <span className="voice-orb-eye-layer" aria-hidden="true">
        <span className={`voice-orb-eye-socket ${showAwakeState ? 'is-awake' : ''} ${eyeState.isBlinking ? 'is-blinking' : ''}`}>
          <span
            className="voice-orb-pupil"
            style={{
              transform: `translate(${isInteractiveTracking ? eyeState.left.x : 0}px, ${isInteractiveTracking ? eyeState.left.y : 0.5}px) scale(${showAwakeState ? 1.05 : 1})`,
            }}
          />
        </span>
        <span className={`voice-orb-eye-socket ${showAwakeState ? 'is-awake' : ''} ${eyeState.isBlinking ? 'is-blinking' : ''}`}>
          <span
            className="voice-orb-pupil"
            style={{
              transform: `translate(${isInteractiveTracking ? eyeState.right.x : 0}px, ${isInteractiveTracking ? eyeState.right.y : 0.5}px) scale(${showAwakeState ? 1.05 : 1})`,
            }}
          />
        </span>
      </span>

      <span className="voice-orb-tooltip" aria-hidden="true">
        Ascolta o chiedi guida
      </span>
    </button>
  );
}
