
Obiettivo: fare un passaggio non distruttivo in cui la lettura usa solo il contenuto della pagina, il pannello si minimizza quando parte davvero l’audio, e durante la riproduzione resta visibile solo l’orb con animazione synth/audio-reactive.

Piano di implementazione

1. Escludere esplicitamente il widget vocale dall’estrazione testo
- Aggiornerò `src/lib/pageContentExtractor.ts` per ignorare anche il pannello/orb dell’assistente, non solo `button`, `canvas`, `svg`.
- Strategia: aggiungere selettori dedicati tipo `data-voice-assistant`, `data-voice-panel`, `data-voice-orb` e far sì che l’estrattore scarti qualsiasi nodo che li contiene.
- Questo evita che “Leggi il contenuto” prenda testi del pannello come titolo, descrizione, CTA o footer del widget.

2. Marcare il widget come “non leggibile”
- In `src/components/voice/FloatingVoiceGuide.tsx`, `VoicePanel.tsx` e `VoiceOrb.tsx` aggiungerò attributi dati stabili per identificare l’assistente nel DOM.
- Così la logica resta invariata, ma il parser può riconoscere con precisione l’interfaccia vocale ed escluderla.

3. Minimizzazione automatica quando parte l’audio
- In `src/hooks/useVoiceAssistant.ts` estenderò il ritorno dell’hook con un segnale semplice di playback effettivo, ad esempio `hasStartedSpeaking` oppure uno stato derivato affidabile quando `audio.play()` parte e lo stato passa a `speaking`.
- In `FloatingVoiceGuide.tsx` userò questo segnale per chiudere/minimizzare il pannello automaticamente solo quando la voce inizia davvero, come richiesto.
- Non cambierò la logica di lettura, pause, resume, stop o restart: aggiungerò solo comportamento UI additivo.

4. Orb sempre visibile e animato durante la lettura
- L’orb resterà visibile mentre il pannello è minimizzato.
- Continuerà a usare `audioAnalyser` già esistente, quindi l’animazione synth/audio-reactive resterà attiva durante `speaking`.
- Rifinirò il mapping degli stati visivi in `FloatingVoiceGuide.tsx` così, a pannello chiuso durante playback, l’orb comunichi chiaramente che la lettura è in corso.

5. Riapertura rapida del pannello senza interrompere l’audio
- Il click sull’orb dovrà riaprire il pannello durante la lettura senza fermare la voce.
- Il bottone chiudi del pannello manterrà il comportamento attuale solo dove già previsto; se oggi chiudere interrompe la lettura, lo separerò in modo non distruttivo:
  - minimizzare = solo chiudere UI
  - stop = fermare playback
- Questo è importante per evitare che “minimizza” significhi accidentalmente “interrompi”.

Dettagli tecnici
- File da aggiornare:
  - `src/lib/pageContentExtractor.ts`
  - `src/hooks/useVoiceAssistant.ts`
  - `src/components/voice/FloatingVoiceGuide.tsx`
  - `src/components/voice/VoicePanel.tsx`
  - `src/components/voice/VoiceOrb.tsx`
- Nessun cambio backend richiesto.
- Nessun cambio all’integrazione ElevenLabs.
- Nessuna sostituzione dell’architettura attuale: solo raffinamento del layer UI e del filtering del contenuto.

Risultato atteso
- “Leggi il contenuto” legge solo la pagina web, non il widget aperto.
- Quando la voce parte, il pannello si minimizza automaticamente.
- L’orb resta visibile e mostra l’animazione audio-reactive durante la riproduzione.
- L’utente può riaprire il pannello in qualsiasi momento senza rompere la lettura.
