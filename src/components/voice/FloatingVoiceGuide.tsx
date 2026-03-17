import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSoundEffects } from '@/hooks/useSoundEffects';
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
  const { playStarInvocation, playCapsuleOpen, playCapsuleClose } = useSoundEffects();
  const isMobile = useIsMobile();
  const location = useLocation();
  const previousStateRef = useRef<VoiceState>('idle');
  const morphTimeoutRef = useRef<number | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);
  const isThresholdRoute = location.pathname === '/';

  useEffect(() => {
    const previousState = previousStateRef.current;

    if (state === 'speaking' && previousState !== 'speaking') {
      setIsOpen(false);
      setIsMorphing(false);
    }

    previousStateRef.current = state;
  }, [state, setIsOpen]);

  useEffect(() => () => {
    if (morphTimeoutRef.current) {
      window.clearTimeout(morphTimeoutRef.current);
    }
  }, []);

  const visualState = state === 'loading'
    ? 'thinking'
    : state === 'idle' && isOpen
      ? 'listening'
      : state;

  const showOrbOnly = state === 'idle' && !isOpen && !isMorphing;

  const collapseToStar = () => {
    if (morphTimeoutRef.current) {
      window.clearTimeout(morphTimeoutRef.current);
      morphTimeoutRef.current = null;
    }

    void playCapsuleClose();
    setIsMorphing(false);
    setIsOpen(false);
  };

  const handleToggleAssistant = () => {
    if (showOrbOnly) {
      void playStarInvocation();
      setIsMorphing(true);
      morphTimeoutRef.current = window.setTimeout(() => {
        void playCapsuleOpen();
        setIsOpen(true);
        setIsMorphing(false);
      }, 180);
      return;
    }

    if (state === 'idle' && isOpen) {
      collapseToStar();
      return;
    }

    if (morphTimeoutRef.current) {
      window.clearTimeout(morphTimeoutRef.current);
      morphTimeoutRef.current = null;
    }

    setIsMorphing(false);
    setIsOpen(!isOpen);
  };

  const handlePanelClose = () => {
    if (state === 'idle') {
      collapseToStar();
      return;
    }

    setIsOpen(false);
  };

  return (
    <div
      className="voice-assistant-shell fixed z-[60] flex flex-col items-end gap-3"
      data-voice-assistant
      data-route-context={isThresholdRoute ? 'threshold' : 'default'}
      data-mobile={isMobile ? 'true' : 'false'}
      data-display-mode={showOrbOnly ? 'orb' : 'siri'}
      data-morphing={isMorphing ? 'true' : 'false'}
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
          onClose={handlePanelClose}
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

