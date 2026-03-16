import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useIsMobile } from '@/hooks/use-mobile';
import VoiceOrb from './VoiceOrb';
import VoicePanel from './VoicePanel';

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

  return (
    <div
      className="fixed z-[60] flex flex-col items-end gap-3"
      style={{
        bottom: isMobile ? 'max(1rem, env(safe-area-inset-bottom, 1rem))' : 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
        right: isMobile ? '1rem' : '1.5rem',
      }}
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
          onClose={() => {
            if (state === 'speaking' || state === 'loading') {
              stop();
            }
            setIsOpen(false);
          }}
        />
      )}

      <VoiceOrb
        state={state}
        analyser={audioAnalyser}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
}
