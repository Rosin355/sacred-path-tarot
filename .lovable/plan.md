
Obiettivo: rendere la stella/capsule nelle pagine interne cliccabile usando la stessa logica di posizione della home, sempre ancorata a destra.

1. Semplificare il posizionamento
- Interverrei in `src/index.css` rimuovendo gli offset speciali per `arcani`, `respiro` e `ispirazione`.
- Farei usare anche alle pagine interne gli stessi valori “safe” già usati in home per:
  - stella idle (`data-display-mode='orb'`)
  - capsule aperta (`data-display-mode='siri'`)
- Manterrei l’ancoraggio a destra, senza più micro-varianti per singola Via.

2. Allineare tutto il sistema vocale
- Applicherei una sola regola coerente per desktop e una per mobile, così stella e capsule restano sempre nella stessa fascia cliccabile.
- Verificherei che il `VoicePanel` continui ad aprirsi sopra/sul lato senza spingere il trigger fuori area utile.

3. Piccolo hardening dell’area cliccabile
- Se necessario, aumenterei leggermente la “hit area” del trigger in `VoiceOrb`/`Siri` via CSS, senza cambiare il look visivo, così il click resta facile anche con glow grande.

File coinvolti
- `src/index.css` — punto principale del fix
- `src/components/voice/FloatingVoiceGuide.tsx` — solo se serve semplificare gli attributi contestuali ormai superflui

Nota tecnica
Dalla CSS attuale il problema nasce dal fatto che nelle pagine interne ci sono più override cumulativi (`default` + `data-path-theme` + mobile) che spostano il trigger più verso il bordo rispetto alla home. La soluzione più robusta è eliminare questi offset per-Via e usare una sola posizione condivisa, identica alla home, così il componente resta sempre visibile e cliccabile.
