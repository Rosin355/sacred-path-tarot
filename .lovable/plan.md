
Obiettivo: rendere l’hover realmente percepibile senza toccare in alcun modo la pipeline di click/transizione già corretta.

1. Diagnosi del problema attuale
- L’hover esiste nel codice, ma è troppo debole per risultare visibile.
- L’aura cambia classe (`is-active`) ma non ha una vera orchestrazione GSAP dedicata: appare quasi statica e molto tenue.
- Le particelle sono pochissime, molto piccole, con opacità bassa e drift corto; quindi nella pratica sembrano assenti.
- Il piccolo scale del bottone è oggi il feedback dominante, per questo percepisci solo lo “spostamento”.

2. Intervento proposto
- Lasciare invariato `Threshold.tsx` e tutta la logica di click/dissolve/navigation.
- Lasciare invariato `onClick` in `ThresholdDoor`.
- Rafforzare solo il layer hover in `ThresholdDoor`, `DoorAuraLayer`, `DoorHoverParticles` e CSS dedicato.

3. Modifiche mirate
- In `ThresholdDoor.tsx`
  - mantenere l’attuale hover timeline per scala/testo/luce interna;
  - aggiungere una timeline hover più leggibile per i layer visivi, senza collegarla alla logica di navigazione;
  - attivazione solo su `pointerenter` / `focus-visible`, disattivazione su `pointerleave` / `blur`, come ora.

- In `DoorAuraLayer.tsx` + CSS
  - aumentare leggermente area, luminosità e separazione dei gradienti;
  - aggiungere un “back halo” più evidente dietro l’arco, ma sempre morbido;
  - animare opacity + scale + blur in modo più leggibile;
  - mantenere micro-varianti cromatiche:
    - Arcani: violetto celeste più profondo
    - Respiro: chiarore avorio-turchese più arioso
    - Ispirazione: oro editoriale caldo

- In `DoorHoverParticles.tsx`
  - aumentare leggermente il numero particelle;
  - rendere i punti un po’ più grandi e luminosi;
  - allungare il drift verticale/laterale e aggiungere lieve shimmer;
  - distribuire le particelle più vicino al perimetro/centro dell’arco per farle leggere meglio;
  - mantenere `pointer-events: none`, lifecycle locale, cleanup invariato;
  - in reduced motion: niente drift continuo, solo presenza statica lieve.

- In `src/index.css`
  - alzare con moderazione opacity, glow e contrasto dei layer hover;
  - verificare `z-index` e area del layer per far leggere meglio aura e polvere senza coprire testo/porta;
  - evitare qualsiasi layout shift o interferenza visiva con il click state.

4. Risultato atteso
- Passando il mouse si percepisce chiaramente:
  - una luce sacra dietro la porta
  - una piccola polvere stellare viva e locale
- Uscendo dall’hover tutto sparisce in modo pulito.
- Cliccando, la transizione attuale parte subito identica a prima, senza ritardi né side effects.

5. Verifica finale
- Test hover mouse su tutte e 3 le porte
- Test focus da tastiera
- Test click mentre hover è attivo
- Test reduced motion
- Verifica che dissolve/spiral/route entry restino identici all’implementazione attuale
