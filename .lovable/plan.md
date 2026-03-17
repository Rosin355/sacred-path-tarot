
Diagnosi
- Il comportamento attuale nasce dalla logica in `FloatingVoiceGuide`: quando `state === 'speaking'`, il pannello viene chiuso automaticamente, ma il trigger rimane nella variante compatta `Siri`.
- Nelle pagine interne questa variante usa `variant="compact"` e in CSS mobile ha width molto stretta (`13.75rem`) con altezza ridotta (`62px`), quindi l’equalizzatore/waveform viene compresso fino a sembrare una semplice linea o a sparire visivamente.
- In più, il componente `react-siriwave` è contenuto dentro `.voice-siri-preview__wave` con `overflow: hidden`; su mobile, tra dimensioni ridotte + padding + possibile rendering del canvas/SVG, la parte viva della waveform perde presenza.

Intervento proposto
1. Stabilizzare la presenza visiva dell’equalizzatore
- Rivedere le regole CSS di `.voice-siri-preview`, `.voice-siri-preview--compact` e `.voice-siri-preview__wave`.
- Dare alla capsule in stato `speaking/loading/paused` una dimensione minima più generosa, soprattutto su mobile, senza cambiare il posizionamento generale.

2. Evitare che la waveform collassi
- Ridurre il clipping interno della wave (`padding`, `overflow`, altezza utile).
- Verificare il rapporto tra `Siri.tsx` (`width/height` del componente Siriwave) e le dimensioni reali assegnate via CSS, così il renderer non viene schiacciato.

3. Rendere coerente desktop e mobile
- Mantenere la mini-star solo in idle.
- Durante lettura vocale, far sì che la capsule resti chiaramente leggibile anche nelle pagine interne, invece di una versione troppo “thin”.
- Se necessario, usare una compact meno estrema o una variante unica durante `speaking`.

4. Hardening del fallback visivo
- Se la waveform libreria risulta troppo sottile in certe condizioni, rafforzare i layer proprietari già presenti (`__glow`, `__surface`, `__rail`) per mantenere sempre una percezione di “assistente attivo”, anche quando l’onda è debole.

File coinvolti
- `src/components/voice/Siri.tsx`
- `src/components/voice/FloatingVoiceGuide.tsx`
- `src/index.css`

Risultato atteso
- Quando parte la lettura, l’equalizzatore non “sparisce” più.
- Su desktop resta chiaramente presente.
- Su mobile non collassa in una lineetta invisibile e mantiene l’aspetto del componente già approvato, senza redesign.
