
Obiettivo: nascondere la linea orizzontale alla base del vano interno con un piccolo glow/fog luminoso, senza far uscire l’effetto fuori dalla porta e senza toccare il comportamento hover che ora funziona.

Approccio
- Userò il contenitore già corretto della porta interna (`.threshold-door-inner-light`), perché è già clipppato e confinato dentro l’arco.
- Aggiungerò un layer basso, morbido e centrato che “lava” la base della porta e copre il taglio orizzontale visivo.
- Lo terrò sempre presente in modo molto leggero, con una lieve intensificazione in hover per restare coerente con la luce interna.

Modifiche previste
1. `src/components/threshold/ThresholdDoor.tsx`
- Inserire un nuovo elemento decorativo dentro il vano interno, vicino a `.fog-effect`, ad esempio un layer tipo `door-threshold-glow`.
- Posizionarlo in basso, sotto le sparkles ma sopra il fondo interno, così maschera la linea senza disturbare le particelle.

2. `src/index.css`
- Creare uno stile dedicato per questo nuovo layer:
  - posizionamento assoluto in basso
  - gradiente radiale/ellittico centrato
  - blur morbido
  - opacità bassa di default
  - forma larga ma bassa, per coprire solo il “taglio” orizzontale
- Eventualmente aggiungere un leggero fade verticale per fondere meglio il glow col fondo viola della porta.
- Aumentare appena l’intensità in stato hover usando il selettore già disponibile (`data-hover-active` sul bottone oppure stato hover del gruppo), senza introdurre nuova logica JS.

3. Coerenza visiva
- Il colore del glow userà i token esistenti per porta (`--door-color`, `--door-color-bright`, `--door-particle-tint`) così Arcani/Respiro/Ispirazione restano coerenti.
- L’effetto resterà “editorial-sacred”: niente bloom aggressivo, solo una nebbia luminosa che addolcisce la base.

Risultato atteso
- La linea retta orizzontale alla base non si percepisce più come un taglio netto.
- La luce sembra emergere dall’interno della soglia.
- Sparkles e hover restano invariati e confinati dentro la porta.

File da aggiornare
- `src/components/threshold/ThresholdDoor.tsx`
- `src/index.css`

Dettaglio tecnico
```text
inner arch
├─ divine-light-inner
├─ fog-effect
├─ threshold-bottom-glow   <- nuovo layer per coprire la linea
└─ DoorHoverParticles
```
