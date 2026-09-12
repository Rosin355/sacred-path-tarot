# Home cinematica — velo di lettura discreto + rimozione bottone

Obiettivo: mantenere il testo leggibile sui fotogrammi chiari senza il grande rettangolo bianco sfocato che oggi domina la scena, e rimuovere il bottone "Modalità lettura".

## Stato attuale (verificato)

- Il "rettangolo" chiaro è lo scrim `.moment::before` in `src/cinematic/cinematic-home.css` (riquadro pieno con blur 16px + box-shadow 40/24px, opacità .9–.94, versione ink avorio 244,239,230).
- Il bottone è in `src/pages/CinematicHome.tsx` (righe 149–157) con stile `.reading-mode-toggle` in CSS; controlla anche lo stato `readingMode` usato per la modalità statica e per la transizione verso le Vie.

## Direzione proposta

1. **Velo di base "editoriale" (sempre attivo, quasi invisibile)**
   - Sostituire il riquadro pieno con un gradiente radiale morbido, senza bordi né forma riconoscibile, con opacità molto bassa (~0.28 scuro / ~0.30 chiaro).
   - Aggiungere un `text-shadow` calibrato su titoli e paragrafi: garantisce leggibilità anche dove il velo è tenue, senza "box".

2. **Velo pieno on-demand**
   - Il velo si intensifica (fino a ~0.8) in due casi:
     - **hover / focus** sul blocco di testo del momento attivo;
     - **inattività**: dopo ~2.2s senza scroll o movimento mouse, il momento in vista entra in "modalità lettura passiva" e il velo sale.
   - Al ripartire dello scroll o al movimento del mouse il velo torna tenue con dissolvenza morbida (~450ms).
   - Implementazione: un piccolo hook di idle in `CinematicHome.tsx` che imposta `data-reading="idle"` sulla radice; il resto è CSS (`:hover`, `:focus-within`, `[data-reading="idle"]`).

3. **Rimozione bottone "Modalità lettura"**
   - Elimina il `<button>` e la regola `.reading-mode-toggle`, più il padding riservato per la sua riga.
   - Lo stato `readingMode` resta ma derivato solo dalla preferenza di sistema "riduci animazioni": chi ha quella impostazione continua a vedere la versione statica e leggibile. Nessuna perdita di accessibilità.

Nessuna modifica a scene, waypoint, testi, porte, transizioni o audio.

## Dettagli tecnici

- `src/cinematic/cinematic-home.css`: riscrittura di `.moment::before` (gradiente + variabile `--veil-strength`), varianti `[data-theme="ink"]`, stati `:hover`/`:focus-within`/`[data-reading="idle"]`, transizione `opacity .45s ease`; rimozione `.reading-mode-toggle` e del padding-top riservato; aggiornamento dei corrispettivi blocchi mobile e `cinematic-static`.
- `src/pages/CinematicHome.tsx`: rimozione bottone e dello stato/localStorage `temple-reading-mode`; `readingMode` = `systemReducedMotion`; nuovo effetto idle (listener passivi su `scroll`, `pointermove`, timer 2200ms) che scrive `data-reading` sul contenitore.
- Verifica su `/` a 1289×931 e in viewport mobile: testo leggibile in scroll, velo che sale a riposo, nessun bottone in alto a sinistra.
