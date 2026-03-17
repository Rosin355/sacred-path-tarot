
Obiettivo: nella homepage mostrare solo un orb piccolo e discreto in idle; al click si apre la UI più ampia. Questo risolve l’ingombro della capsule sempre visibile e mantiene l’effetto Siri quando serve davvero.

Piano di implementazione

1. Introdurre una modalità “orb-first” per la homepage
- In `FloatingVoiceGuide.tsx`, usare la route `/` per distinguere la homepage.
- Su `/`:
  - se il pannello è chiuso e lo stato è `idle`, mostrare solo `VoiceOrb`
  - al click sull’orb, aprire il pannello
  - quando il pannello è aperto, mostrare la capsule `Siri`
- Sulle altre pagine, mantenere il comportamento attuale.

2. Usare l’orb già presente come trigger iniziale
- `VoiceOrb.tsx` è già pronto e adatto a fare da entrypoint piccolo.
- Lo renderei variante “mini” o comunque più contenuto nella homepage:
  - diametro leggermente ridotto
  - glow più soft in idle
  - tooltip più discreto o assente su `/`

3. Far comparire la capsule solo dopo il click
- In `FloatingVoiceGuide.tsx`, condizionare il rendering:
  - `idle + pannello chiuso + homepage` => `VoiceOrb`
  - `pannello aperto` oppure `speaking/loading/paused/error` => `Siri`
- Così l’utente vede un ingresso minimale, ma una volta attivato ottiene la UI Siri completa.

4. Rifinire dimensioni e posizionamento
- In `src/index.css`:
  - ridurre ulteriormente l’ingombro dell’orb su homepage
  - tenere il posizionamento basso/destra senza entrare nella composizione centrale
  - far sì che la capsule aperta abbia una larghezza più contenuta su `/`
- A viewport attuale (1036px), la soluzione ideale è:
  - orb piccolo in basso a destra
  - capsule sopra l’orb solo quando aperta

5. Gestire bene le transizioni di stato
- Se parte la lettura (`speaking`), il pannello continua a minimizzarsi come oggi.
- In homepage, dopo la minimizzazione durante `speaking`, può restare visibile la capsule Siri compatta oppure tornare alla forma orb/Siri ridotta a seconda dello stato:
  - consigliato: durante `speaking` tenere `Siri` visibile, perché comunica meglio l’audio attivo.
- In `idle`, invece, tornare all’orb piccolo.

Risultato atteso
- Homepage molto più pulita
- Assistente ancora accessibile ma non invasivo
- Migliore gerarchia visiva: prima la scena Threshold, poi la voce
- Esperienza più elegante: orb come invito, capsule come interazione

File da toccare
- `src/components/voice/FloatingVoiceGuide.tsx`
- `src/components/voice/VoiceOrb.tsx`
- `src/components/voice/Siri.tsx`
- `src/index.css`

Dettaglio tecnico sintetico
```text
Homepage (/)
idle + chiuso     -> mostra VoiceOrb mini
click orb         -> apre pannello + mostra Siri
speaking/loading  -> mostra Siri
chiusura pannello -> torna a orb mini

Pagine interne
-> comportamento attuale quasi invariato
```

Scelta consigliata
- homepage: orb piccolo sempre visibile
- capsule Siri: solo dopo il click o negli stati attivi
- pagine interne: mantenere la capsule compatta già introdotta
