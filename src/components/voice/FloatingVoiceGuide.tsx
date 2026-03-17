import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import type { VoiceState } from '@/hooks/useVoiceAssistant';
import Siri from './Siri';
import VoiceOrb from './VoiceOrb';
import VoicePanel from './VoicePanel';
import VoiceStreakGlyph from './VoiceStreakGlyph';

/**
 * Global floating voice assistant.
 * Positioned fixed bottom-right, safe for mobile.
 * Phase 1: "Leggi il contenuto" mode.
 * Phase 2 (placeholder): AI guide mode.
 */
export default function FloatingVoiceGuide() {
  const {
    state,
    isOpen,
    setIsOpen,
    readPage,
    pause,
    resume,
    stop,
    restart,
    errorMessage,
    audioAnalyser,
    progress,
  } = useVoiceAssistant();
  const isMobile = useIsMobile();
  const location = useLocation();
  const previousStateRef = useRef<VoiceState>('idle');
  const isThresholdRoute = location.pathname === '/';

  useEffect(() => {
    const previousState = previousStateRef.current;

    if (state === 'speaking' && previousState !== 'speaking') {
      setIsOpen(false);
    }

    previousStateRef.current = state;
  }, [state, setIsOpen]);

  const visualState = state === 'loading'
    ? 'thinking'
    : state === 'idle' && isOpen
      ? 'listening'
      : state;

  const showOrbOnly = isThresholdRoute && state === 'idle' && !isOpen;
  const handleToggleAssistant = () => setIsOpen(!isOpen);

  return (
    <div
      className="voice-assistant-shell fixed z-[60] flex flex-col items-end gap-3"
      data-voice-assistant
      data-route-context={isThresholdRoute ? 'threshold' : 'default'}
      data-mobile={isMobile ? 'true' : 'false'}
      data-display-mode={showOrbOnly ? 'orb' : 'siri'}
    >
      {isOpen && (
        <VoicePanel
          state={state}
          progress={progress}
          errorMessage={errorMessage}
          onReadPage={readPage}
          onPause={pause}
          onResume={resume}
          onStop={stop}
          onRestart={restart}
          onClose={() => setIsOpen(false)}
        />
      )}

      {showOrbOnly ? (
        <VoiceOrb
          state={state}
          visualState={visualState}
          analyser={audioAnalyser}
          onClick={handleToggleAssistant}
          variant="mini"
        />
      ) : (
        <Siri
          state={state}
          visualState={visualState}
          analyser={audioAnalyser}
          onClick={handleToggleAssistant}
          variant={isThresholdRoute ? 'compact' : 'default'}
        />
      )}

      <div className="hidden" aria-hidden="true">
        {!showOrbOnly && (
          <VoiceOrb
            state={state}
            visualState={visualState}
            analyser={audioAnalyser}
            onClick={handleToggleAssistant}
          />
        )}
        <VoiceStreakGlyph
          state={state}
          visualState={visualState}
          analyser={audioAnalyser}
          onClick={handleToggleAssistant}
        />
      </div>
    </div>
  );
}

