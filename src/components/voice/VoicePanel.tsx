import { Play, Pause, Square, RotateCcw, X, BookOpen, MessageCircle, Sparkles, Waves } from 'lucide-react';
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
  loading: 'Jessica sta componendo la voce…',
  speaking: 'La voce è in presenza',
  paused: 'La voce attende',
  error: 'Qualcosa non si è aperto',
};

const stateDescriptions: Record<VoiceState, string> = {
  idle: 'Apri l’ascolto della pagina o preparati alla futura guida rituale.',
  loading: 'Il testo si sta trasformando in un passaggio sonoro, con calma.',
  speaking: 'La lettura è attiva e il tempio respira con la voce.',
  paused: 'La lettura è sospesa, pronta a riprendere dal punto lasciato.',
  error: 'La presenza è ancora qui, ma serve un nuovo tentativo.',
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
  const isIdle = state === 'idle';

  return (
    <div className="voice-panel animate-fade-in" role="dialog" aria-label="Pannello assistente vocale">
      <div className="voice-panel__veil" aria-hidden="true" />

      <div className="voice-panel__header">
        <div className="voice-panel__identity">
          <div className="voice-panel__status-orb" data-state={state} />
          <div className="space-y-1">
            <p className="voice-panel__eyebrow">La voce di Jessica</p>
            <p className="voice-panel__title">{stateLabels[state]}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="voice-panel__close"
          aria-label="Chiudi pannello vocale"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="voice-panel__body">
        <div className="voice-panel__intro">
          <p className="voice-panel__description">{stateDescriptions[state]}</p>

          {(state === 'loading' || state === 'speaking') && (
            <div className="voice-panel__badge" data-tone={state === 'loading' ? 'thinking' : 'speaking'}>
              {state === 'loading' ? <Sparkles className="h-3 w-3" /> : <Waves className="h-3 w-3" />}
              <span>{state === 'loading' ? 'Thinking presence' : 'Speaking presence'}</span>
            </div>
          )}
        </div>

        {isActive && (
          <div className="voice-panel__progress-shell" aria-hidden="true">
            <div
              className="voice-panel__progress-bar"
              style={{ width: `${Math.max(progress * 100, state === 'loading' ? 10 : 0)}%` }}
            />
          </div>
        )}

        {state === 'error' && errorMessage && (
          <div className="voice-panel__error">
            <p>{errorMessage}</p>
          </div>
        )}

        {isIdle && (
          <div className="space-y-3">
            <button onClick={onReadPage} className="voice-panel__action-card voice-panel__action-card--primary">
              <BookOpen className="voice-panel__action-icon" />
              <div className="voice-panel__action-copy">
                <p className="voice-panel__action-title">Leggi il contenuto</p>
                <p className="voice-panel__action-meta">Ascolta questa pagina con la presenza vocale di Jessica</p>
              </div>
            </button>

            <button className="voice-panel__action-card voice-panel__action-card--muted" disabled title="Prossimamente">
              <MessageCircle className="voice-panel__action-icon" />
              <div className="voice-panel__action-copy">
                <p className="voice-panel__action-title">Chiedi alla guida</p>
                <p className="voice-panel__action-meta">Lo spazio conversazionale arriverà nella prossima fase</p>
              </div>
            </button>
          </div>
        )}

        {isActive && (
          <div className="voice-panel__controls">
            <button onClick={onRestart} className="voice-panel__icon-button" aria-label="Ricomincia" title="Ricomincia">
              <RotateCcw className="h-4 w-4" />
            </button>

            {state === 'speaking' ? (
              <button onClick={onPause} className="voice-panel__primary-control" aria-label="Pausa" title="Pausa">
                <Pause className="h-5 w-5" />
              </button>
            ) : state === 'paused' ? (
              <button onClick={onResume} className="voice-panel__primary-control" aria-label="Riprendi" title="Riprendi">
                <Play className="h-5 w-5" />
              </button>
            ) : (
              <div className="voice-panel__primary-control voice-panel__primary-control--loading" aria-hidden="true">
                <div className="voice-panel__spinner" />
              </div>
            )}

            <button onClick={onStop} className="voice-panel__icon-button" aria-label="Ferma" title="Ferma">
              <Square className="h-4 w-4" />
            </button>
          </div>
        )}

        {state === 'error' && (
          <button onClick={onReadPage} className="voice-panel__retry">
            Riprova
          </button>
        )}
      </div>

      <div className="voice-panel__footer">
        <p>Presenza rituale · lettura guidata · futura guida conversazionale</p>
      </div>
    </div>
  );
}
