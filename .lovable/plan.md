

# Piano: Dissolve "Gommage" del titolo in loco

## Cosa cambia

Attualmente il titolo della porta cliccata vola al centro e poi esplodono petali dal centro. Il nuovo comportamento:

1. Click su una porta → le altre porte sfumano
2. Il titolo della porta attiva resta in posizione, si illumina brevemente (glow)
3. Il titolo si **sgretola progressivamente** in polvere e petali (effetto gommage) — dissolve noise-driven con particelle che nascono dal testo mentre si disintegra
4. Overlay scuro progressivo → navigazione

## Approccio tecnico

### GhostTitleOverlay → TextDissolveOverlay

Riscrivere il componente per usare **Canvas 2D** sovrapposto al titolo originale:

1. **Cattura il testo** come bitmap: posiziona un canvas esattamente sopra al titolo originale, disegna il testo con `ctx.fillText` usando lo stesso font/dimensione
2. **Dissolve noise-driven**: usa un campo di rumore 2D (simplex noise semplificato) che avanza nel tempo. Dove `noise(x, y) < threshold`, i pixel del testo vengono cancellati progressivamente (il threshold cresce da 0 a 1 via GSAP)
3. **Spawn particelle dal bordo di dissolve**: nei pixel dove il testo sta scomparendo (zona di confine noise), genera dust e petali che si staccano con moto organico
4. I petali hanno forma bezier (come ora), la polvere sono piccoli cerchi
5. Le particelle derivano verso l'esterno con leggera gravità e rotazione

### Flusso fasi aggiornato

```
idle → dissolving → navigating
```

- **idle**: porte cliccabili
- **dissolving**: titolo originale nascosto, canvas sovrapposto che sgretola il testo + overlay scuro progressivo + petali
- **navigating**: navigazione

Non serve più `title-centering` né `petal-burst` come fasi separate.

### File modificati

| File | Modifica |
|------|----------|
| `src/components/threshold/GhostTitleOverlay.tsx` | Riscrittura completa → `TextDissolveOverlay.tsx` con canvas dissolve + particelle |
| `src/components/threshold/PetalBurstOverlay.tsx` | Semplificato: solo overlay scuro progressivo (le particelle ora partono dal testo) |
| `src/pages/Threshold.tsx` | Fasi semplificate (`idle` → `dissolving` → `navigating`), titolo resta in posizione |

### Dettagli dissolve

- Noise 2D generato con una funzione simplex leggera inline (no dipendenze extra)
- Il canvas si posiziona esattamente sopra il titolo usando il `DOMRect` catturato
- GSAP anima un `dissolveProgress` da 0 a 1 in ~1.5s
- Ogni frame: per ogni pixel del testo, se `noise(x,y) + dissolveProgress > 1` → pixel cancellato, particella generata in quel punto
- Le particelle si muovono con drift + leggera rotazione, fade out con la vita
- Dopo dissolve completo (~1.8s), navigazione

### Vincoli rispettati

- Canvas 2D standard, no WebGPU
- GSAP per orchestrazione (già installato)
- No dipendenze aggiuntive
- Fallback 3s e `prefers-reduced-motion` mantenuti
- Simplex noise implementato inline (~30 righe)

