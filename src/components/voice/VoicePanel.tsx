import { Play, Pause, Square, RotateCcw, X, BookOpen, MessageCircle } from 'lucide-react';
import type { VoiceState } from '@/hooks/useVoiceAssistant';

interface VoicePanelProps {
  state: VoiceState;
  progress: number;
  errorMessage: string | null;
  onReadPage: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRestart: () => void;
  onClose: () => void;
}

const stateLabels: Record<VoiceState, string> = {
  idle: 'Pronta ad ascoltare',
  loading: 'Generazione in corso…',
  speaking: 'In ascolto',
  paused: 'In pausa',
  error: 'Si è verificato un errore',
};

export default function VoicePanel({
  state,
  progress,
  errorMessage,
  onReadPage,
  onPause,
  onResume,
  onStop,
  onRestart,
  onClose,
}: VoicePanelProps) {
  const isActive = state === 'speaking' || state === 'paused' || state === 'loading';

  return (
    <div
      className="w-72 animate-fade-in"
      style={{
        background: 'hsla(262, 25%, 9%, 0.92)',
        border: '1px solid hsla(262, 20%, 18%, 0.5)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 16px 64px -16px hsla(262, 29%, 3%, 0.8), 0 0 40px -10px hsla(270, 55%, 45%, 0.08)',
      }}
      role="dialog"
      aria-label="Pannello assistente vocale"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'hsla(262, 20%, 18%, 0.3)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: state === 'error'
                ? 'hsl(0, 60%, 50%)'
                : state === 'speaking'
                ? 'hsl(270, 55%, 55%)'
                : state === 'loading'
                ? 'hsl(40, 45%, 55%)'
                : 'hsla(270, 25%, 50%, 0.4)',
              boxShadow: state === 'speaking'
                ? '0 0 8px hsla(270, 55%, 55%, 0.5)'
                : 'none',
              animation: state === 'loading' ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
          <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            {stateLabels[state]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"
          aria-label="Chiudi pannello vocale"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      {isActive && (
        <div className="h-[2px] w-full" style={{ background: 'hsla(262, 20%, 18%, 0.3)' }}>
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(progress * 100, state === 'loading' ? 5 : 0)}%`,
              background: 'linear-gradient(90deg, hsla(270, 55%, 45%, 0.6), hsla(270, 55%, 55%, 0.8))',
            }}
          />
        </div>
      )}

      {/* Body */}
      <div className="px-5 py-5 space-y-4">
        {/* Error message */}
        {state === 'error' && errorMessage && (
          <p className="text-xs text-red-400/80 leading-relaxed" style={{ fontFamily: "'Source Serif 4', serif" }}>
            {errorMessage}
          </p>
        )}

        {/* Idle state: action buttons */}
        {state === 'idle' && (
          <div className="space-y-2.5">
            <button
              onClick={onReadPage}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-300"
              style={{
                background: 'hsla(270, 30%, 20%, 0.3)',
                border: '1px solid hsla(270, 20%, 25%, 0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'hsla(270, 30%, 25%, 0.4)';
                e.currentTarget.style.borderColor = 'hsla(270, 30%, 35%, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'hsla(270, 30%, 20%, 0.3)';
                e.currentTarget.style.borderColor = 'hsla(270, 20%, 25%, 0.3)';
              }}
            >
              <BookOpen className="w-4 h-4 text-muted-foreground/60 shrink-0" />
              <div>
                <p className="text-foreground/90 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                  Leggi il contenuto
                </p>
                <p className="text-muted-foreground/50 text-[10px] tracking-[0.1em] uppercase mt-0.5" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Ascolta questa pagina
                </p>
              </div>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-left opacity-40 cursor-not-allowed"
              disabled
              style={{
                background: 'hsla(270, 20%, 15%, 0.2)',
                border: '1px solid hsla(270, 15%, 20%, 0.2)',
              }}
              title="Prossimamente"
            >
              <MessageCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              <div>
                <p className="text-foreground/50 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
                  Chiedi alla guida
                </p>
                <p className="text-muted-foreground/30 text-[10px] tracking-[0.1em] uppercase mt-0.5" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Prossimamente
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Playback controls */}
        {isActive && (
          <div className="flex items-center justify-center gap-3">
            {/* Restart */}
            <button
              onClick={onRestart}
              className="p-2.5 text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Ricomincia"
              title="Ricomincia"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            {state === 'speaking' ? (
              <button
                onClick={onPause}
                className="p-3 transition-all duration-300"
                style={{
                  background: 'hsla(270, 40%, 30%, 0.4)',
                  border: '1px solid hsla(270, 30%, 40%, 0.3)',
                  borderRadius: '50%',
                }}
                aria-label="Pausa"
                title="Pausa"
              >
                <Pause className="w-5 h-5 text-foreground/80" />
              </button>
            ) : state === 'paused' ? (
              <button
                onClick={onResume}
                className="p-3 transition-all duration-300"
                style={{
                  background: 'hsla(270, 40%, 30%, 0.4)',
                  border: '1px solid hsla(270, 30%, 40%, 0.3)',
                  borderRadius: '50%',
                }}
                aria-label="Riprendi"
                title="Riprendi"
              >
                <Play className="w-5 h-5 text-foreground/80" />
              </button>
            ) : (
              <div
                className="p-3"
                style={{
                  background: 'hsla(270, 30%, 25%, 0.3)',
                  border: '1px solid hsla(270, 20%, 30%, 0.2)',
                  borderRadius: '50%',
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-foreground/30 border-t-foreground/70 rounded-full animate-spin" />
                </div>
              </div>
            )}

            {/* Stop */}
            <button
              onClick={onStop}
              className="p-2.5 text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Ferma"
              title="Ferma"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error retry */}
        {state === 'error' && (
          <button
            onClick={onReadPage}
            className="w-full sacred-cta font-caption text-center"
          >
            Riprova
          </button>
        )}
      </div>

      {/* Footer note */}
      <div className="px-5 py-3 border-t" style={{ borderColor: 'hsla(262, 20%, 18%, 0.2)' }}>
        <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 text-center" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          La voce di Jessica
        </p>
      </div>
    </div>
  );
}
