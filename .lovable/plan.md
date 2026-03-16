
Obiettivo: confinare completamente sparkle e glow dentro il vano interno dell’arco, senza toccare la logica hover in/out che ora funziona.

1. Diagnosi
- Dall’immagine, le particelle stanno occupando tutto il box della porta, quindi “sfondano” sopra il frontone e fuori dall’apertura.
- Nel CSS attuale i layer `.door-hover-particles`, `.door-hover-sparkles-primary` e `.secondary` sono posizionati su un’area molto ampia (`inset` negativi) e mascherati con ellissi troppo generiche.
- Il wrapper delle particelle è montato a livello del bottone intero, non del vano interno dell’arco.

2. Approccio
- Spostare il sistema sparkle dentro il contenitore già corretto dell’apertura della porta:
  - lo stesso blocco che oggi contiene `.divine-light-inner` e `.fog-effect`
  - cioè `absolute inset-[8%] top-[5%] bottom-[3%] overflow-hidden`
- In questo modo il clipping lo fa direttamente la geometria interna della porta, non una mask ampia sul bottone.

3. Modifiche previste
- In `ThresholdDoor.tsx`
  - spostare `<DoorHoverParticles ... />` dentro il container interno dell’arco;
  - lasciare `DoorAuraLayer` fuori, perché l’aura può stare dietro la porta, ma le sparkles no;
  - mantenere invariato `active={isHoverActive && phase === "idle"}`.

- In `DoorHoverParticles.tsx`
  - mantenere il codice sparkle preso dal prompt come base;
  - semplificare il wrapper perché non dovrà più coprire l’intera card, ma solo l’apertura interna;
  - lasciare glow leggero solo se resta confinato dentro l’apertura.

- In `src/index.css`
  - ridurre i layer `.door-hover-particles` e `.door-hover-sparkles*` a `inset: 0`;
  - rimuovere inset negativi e mask che oggi fanno espandere l’effetto fuori sagoma;
  - usare una mask verticale morbida solo per il fade interno verso l’alto, non per delimitare l’area esterna;
  - assicurare `overflow: hidden` sul contenitore interno e z-index sotto il tempio ma sopra la luce interna.

4. Risultato atteso
- Le particelle saranno visibili solo dentro il vuoto della porta.
- Nulla apparirà sopra il tetto/frontone o ai lati esterni del tempio.
- Hover in/out resterà corretto come adesso.
- L’effetto finale sembrerà una sorgente luminosa che emana dall’interno della soglia.

5. File da aggiornare
- `src/components/threshold/ThresholdDoor.tsx`
- `src/components/threshold/DoorHoverParticles.tsx`
- `src/index.css`

Dettaglio tecnico
```text
Current:
button
 ├─ DoorAuraLayer
 ├─ DoorHoverParticles   <- troppo esterno
 └─ arch

Planned:
button
 ├─ DoorAuraLayer
 └─ arch
    └─ inner opening (overflow-hidden)
       ├─ divine-light-inner
       ├─ fog
       └─ DoorHoverParticles  <- confinato qui
```
