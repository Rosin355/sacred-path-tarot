# Threshold Motion Spec

> Specifica tecnica per la transizione cinematica delle porte nella Threshold page.

## Visual Reference

Ispirato a [Codrops WebGPU Gommage Effect](https://tympanus.net/codrops/2026/01/28/webgpu-gommage-effect-dissolving-msdf-text-into-dust-and-petals-with-three-js-tsl/) — adattato a un'architettura leggera DOM + Canvas 2D + GSAP.

## Click Flow

1. **idle** → utente clicca una porta
2. **title-centering** → le altre porte sfumano; il titolo della porta attiva viaggia verso il centro viewport (GSAP, ~900ms)
3. **petal-burst** → overlay Canvas 2D con petali organici + polvere che si espandono dal centro con moto a spirale, bloom glow, overlay scuro progressivo (~1800ms)
4. **navigating** → navigazione alla route selezionata

## Componenti

| Componente | File | Ruolo |
|---|---|---|
| ThresholdDoor | `src/components/threshold/ThresholdDoor.tsx` | Singola porta con arco, luce divina, nebbia |
| GhostTitleOverlay | `src/components/threshold/GhostTitleOverlay.tsx` | Titolo fantasma fixed che anima verso il centro |
| PetalBurstOverlay | `src/components/threshold/PetalBurstOverlay.tsx` | Canvas 2D con petali organici + polvere + bloom |
| useReducedMotion | `src/hooks/useReducedMotion.ts` | Hook per `prefers-reduced-motion` |

## Colori per porta

- **Arcani**: `270 55% 45%` (Sacred Violet)
- **Respiro**: `175 40% 45%` (Turchese)
- **Ispirazione**: `38 55% 52%` (Antique Gold)

## Animazione petali

- 60 petali organici (bezier curves) + 80 particelle polvere
- Moto: spirale iniziale verso centro → poi drift verso esterno
- Fade in/out con curva vita
- Glow e bloom radiale al centro
- Overlay scuro progressivo (0 → 0.85 opacity)

## Reduced Motion

- Nessun petalo né ghost title
- Semplice fade + navigazione dopo 400ms

## Fallback

- Timer di sicurezza: navigazione forzata dopo 3000ms in ogni caso
- Cleanup di RAF, GSAP timelines e timeout su unmount

## Vincoli Lovable

- No WebGPU, no shader custom, no TSL
- Canvas 2D standard
- GSAP già installato nel progetto
- Nessuna dipendenza aggiuntiva richiesta
