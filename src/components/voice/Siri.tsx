import { useEffect, useMemo, useState } from 'react';
import ReactSiriwave from 'react-siriwave';
import type { IReactSiriwaveProps } from 'react-siriwave';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

type SiriVisualState = VoiceState | 'listening' | 'thinking';

interface SiriProps {
  state: VoiceState;
  visualState?: SiriVisualState;
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

export default function Siri({ state, visualState, analyser, onClick }: SiriProps) {
  const effectiveState = visualState ?? state;
  const [amplitude, setAmplitude] = useState(0);

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
    let frame = 0;

    const tick = () => {
      const live = effectiveState === 'speaking' ? getAmplitude() : effectiveState === 'listening' ? 0.18 : effectiveState === 'thinking' || effectiveState === 'loading' ? 0.12 : 0;
      setAmplitude(live);
      frame = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(frame);
  }, [effectiveState, getAmplitude]);

  const waveConfig: IReactSiriwaveProps = {
    theme: 'ios9',
    ratio: 1,
    speed: effectiveState === 'speaking' ? 0.28 + amplitude * 0.9 : effectiveState === 'thinking' || effectiveState === 'loading' ? 0.18 : 0.12,
    amplitude: effectiveState === 'paused' ? 0.02 : effectiveState === 'error' ? 0.08 : effectiveState === 'speaking' ? Math.max(0.08, amplitude * 6.2) : effectiveState === 'listening' ? 1.15 : effectiveState === 'thinking' || effectiveState === 'loading' ? 0.85 : 0.12,
    frequency: effectiveState === 'speaking' ? 5 + amplitude * 3 : effectiveState === 'thinking' || effectiveState === 'loading' ? 4.2 : 3.2,
    color: 'hsl(var(--foreground))',
    cover: true,
    width: 220,
    height: 70,
    autostart: true,
    pixelDepth: 0.02,
    lerpSpeed: 0.08,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="voice-siri-preview"
      aria-label={STATE_LABELS[state]}
      title="Assistente vocale"
      data-voice-assistant
      data-voice-orb
      data-state={state}
      data-visual-state={effectiveState}
    >
      <span className="voice-siri-preview__glow" aria-hidden="true" />
      <span className="voice-siri-preview__surface" aria-hidden="true" />
      <span className="voice-siri-preview__wave" aria-hidden="true">
        <ReactSiriwave {...waveConfig} />
      </span>
      <span className="voice-orb-tooltip" aria-hidden="true">Ascolta o chiedi guida</span>
    </button>
  );
}
