# Threshold Implementation Blueprint

## Architettura attuale

La homepage `/` rende `Threshold.tsx` che mostra tre porte cliccabili (archi classici con luce divina e nebbia CSS).

## Struttura componenti

```
src/pages/Threshold.tsx          ← Orchestratore con phase state machine
├── src/components/threshold/
│   ├── ThresholdDoor.tsx        ← Singola porta (arco + effetti CSS)
│   ├── GhostTitleOverlay.tsx    ← Titolo animato verso centro (GSAP)
│   └── PetalBurstOverlay.tsx    ← Canvas 2D petal burst + dust
└── src/hooks/
    └── useReducedMotion.ts      ← Media query hook
```

## Phase State Machine

```
idle → title-centering → petal-burst → navigating
```

- **idle**: tutte le porte visibili e cliccabili
- **title-centering**: porta attiva evidenziata, altre dimmed, ghost title in viaggio
- **petal-burst**: overlay canvas con petali e bloom
- **navigating**: navigazione eseguita, cleanup

## Dipendenze

- `gsap` (già installato) — orchestrazione animazioni
- Canvas 2D nativo — rendering petali
- CSS esistente — luce divina e nebbia nelle porte

## Safety

- Fallback timer 3s per navigazione garantita
- `prefers-reduced-motion` rispettato con path semplificato
- Double-click prevention via phase check
- Cleanup completo su unmount (RAF, GSAP, setTimeout)

## Asset

- `src/assets/temple-arch.png` — immagine arco classico con colonne corinzie
