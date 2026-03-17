
Obiettivo: introdurre un nuovo elemento visivo simile al reference animato, senza cancellare `VoiceOrb`, e sistemare anche il build rotto causato dal componente sparkles.

1. Diagnosi
- Il reference sembra più vicino a “light streaks / energy wisps” su fondo scuro che a un orb pieno.
- `VoiceOrb` oggi è un bottone canvas circolare con occhi e stato audio: va mantenuto perché vuoi riusarlo altrove.
- Il build ora fallisce per un problema separato: `src/components/ui/sparkles.tsx` importa `@tsparticles/slim` e `framer-motion`, ma non risultano disponibili nel progetto.
- Quindi prima di qualsiasi sostituzione visiva va ripristinata la build.

2. Librerie già esistenti da valutare
Per ottenere qualcosa di simile al GIF, le opzioni più credibili sono:
- `react-webgl-trails`
  - buona candidata per scie luminose dinamiche in React/WebGL
  - più vicina al reference rispetto a un classico particle orb
- `light-trails`
  - utile per animazioni “trail” eleganti e controllabili
  - più generica, meno plug-and-play per un widget UI
- soluzione custom Canvas/WebGL interna
  - spesso la scelta migliore se vuoi un piccolo widget floating, molto controllato, senza dipendere troppo da librerie esterne

Valutazione progettuale:
- Per un bottone floating piccolo e brandizzato, consiglierei prima una nuova implementazione dedicata `VoiceStreakGlyph` in canvas o WebGL leggero.
- Se vuoi accelerare, `react-webgl-trails` è la libreria online/GitHub più vicina da prototipare.
- Non userei una libreria pesante “particles full screen” per questo caso, perché il reference è minimale e localizzato.

3. Piano di implementazione
A. Mettere in sicurezza il build
- Analizzare `src/components/ui/sparkles.tsx` e scegliere una di queste strade:
  - aggiungere le dipendenze mancanti se il componente deve restare così;
  - oppure rifare `SparklesCore` senza `framer-motion` e senza `@tsparticles/slim`, usando una base già presente nel progetto.
- Verificare anche che gli ultimi cambi mobile non abbiano introdotto altri errori TypeScript.

B. Non toccare `VoiceOrb`
- Lasciare `src/components/voice/VoiceOrb.tsx` intatto.
- Considerarlo “archiviato ma disponibile” per altri usi futuri.

C. Creare un nuovo renderer visivo
- Aggiungere un nuovo componente, ad esempio:
```text
src/components/voice/VoiceStreakGlyph.tsx
```
- Questo componente replicherà il linguaggio del reference:
  - fondo trasparente
  - 2–4 scie luminose sottili
  - movimento lento orbitale / diagonale
  - piccole variazioni in base agli stati `idle / loading / speaking / paused / error`
- Interazione prevista:
  - `idle`: moto lieve, contemplativo
  - `loading`: più coesione e raccolta verso il centro
  - `speaking`: più intensità, lunghezza e pulsazione
  - `paused`: rallentato
  - `error`: lieve shift cromatico verso rosso/ambra

D. Sostituire il componente usato nel floating assistant
- In `FloatingVoiceGuide.tsx` sostituire l’uso attivo di `VoiceOrb` con il nuovo `VoiceStreakGlyph`.
- Mantenere invariata la logica funzionale:
  - click apre/chiude `VoicePanel`
  - stati da `useVoiceAssistant`
  - posizionamento floating
- Se utile, prevedere un flag facile per tornare a `VoiceOrb` senza cancellarlo.

E. Allineare stile e UX
- Curare dimensioni del trigger floating per non perdere tappabilità su mobile.
- Assicurare che il nuovo visual resti leggibile su sfondo scuro della home e delle altre pagine.
- Conservare `prefers-reduced-motion` con fallback statico elegante.

4. File coinvolti
- `src/components/ui/sparkles.tsx` — fix build
- `src/components/voice/FloatingVoiceGuide.tsx` — sostituzione del renderer attivo
- nuovo file `src/components/voice/VoiceStreakGlyph.tsx`
- eventuale supporto CSS in `src/index.css`
- `src/components/voice/VoiceOrb.tsx` — da mantenere, non rimuovere

5. Risultato atteso
- Il progetto torna a compilare.
- L’orb attuale resta nel codebase.
- Il floating assistant mostra un visual più vicino al reference: scie sottili, più misteriose e meno “sfera”.
- La logica audio e il pannello restano invariati.

Dettaglio tecnico
```text
Current
FloatingVoiceGuide
 └─ VoiceOrb  (attivo)

Planned
FloatingVoiceGuide
 ├─ VoiceStreakGlyph  (attivo)
 └─ VoiceOrb          (preservato, non rimosso)
```

Nota di design
- La tua reference non sembra un “widget standard” già pronto identico su GitHub: ci sono librerie utili come base, ma il look finale migliore probabilmente verrà da una piccola implementazione custom ispirata a quei trail WebGL, non da un drop-in prefabbricato.
