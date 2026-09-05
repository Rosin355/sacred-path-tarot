# Worklog — integrazione home cinematica

Questo registro accompagna i commit della migrazione da `jessicamarin-sitoV2` a `sacred-path-tarot`.

## Fase 1 — asset e dipendenze

- **Commit previsto:** `chore: import cinematic home assets and dependencies`
- **Obiettivo:** predisporre il progetto Lovable per il motore cinematografico senza modificare routing o backend.
- **Modifiche:** importati frame WebP desktop/mobile, still di fallback e dipendenze Lenis/font locali; aggiunto il comando aggregato `npm run check`.
- **Verifica:** struttura degli asset e manifest presenti; installazione dipendenze completata.
- **Rischi residui:** peso statico di circa 64 MB, mitigato dal caricamento per scena e dalla variante mobile.
- [x] Asset desktop
- [x] Asset mobile
- [x] Fallback statici
- [x] Dipendenze frontend
- [ ] Build completa dopo l'integrazione React
