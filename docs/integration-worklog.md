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

## Fase 2 — home React

- **Commit previsto:** `feat: replace the legacy threshold with the cinematic journey`
- **Obiettivo:** sostituire la vecchia soglia con il percorso cinematografico mantenendo React Router come shell applicativa.
- **Modifiche:** creati componente React, motore GSAP/Lenis, scrubber canvas, atmosfera Three.js e CSS isolato; aggiunta la dissolvenza di uscita da 800 ms.
- **Verifica:** selettori limitati alla root cinematica e teardown esplicito di animazioni, listener, timer, richieste e WebGL.
- **Rischi residui:** da validare lint/build e comportamento reale del loader sulle tre viewport.
- [x] Home convertita in JSX
- [x] Motore con cleanup su unmount
- [x] CSS isolato
- [x] Fallback statico
- [ ] QA browser e viewport
