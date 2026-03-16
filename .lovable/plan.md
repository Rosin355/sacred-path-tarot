
Obiettivo: correggere due problemi concreti senza stravolgere ciò che già funziona: 1) le sparkles non si leggono davvero, 2) il glow resta visibile anche dopo la fine dell’hover.

Cosa emerge dal codice attuale
- Le particelle esistono, ma sono quasi certamente troppo mascherate dal CSS:
  - `.door-hover-sparkles-primary` e `.secondary` usano `mask-image` con area visibile molto stretta.
  - Il layer particelle è grande, ma la maschera taglia quasi tutto.
- Il glow persistente nasce da una doppia gestione:
  - classe CSS `.door-hover-aura.is-active`
  - timeline GSAP su `.door-hover-aura`, `.door-hover-aura-core`, `.door-hover-aura-halo`
- Questo mix può lasciare il layer in uno stato visivo “sporco” quando il mouse esce o quando il reverse della timeline non riallinea perfettamente opacity/filter/scale.

Piano di intervento
1. Semplificare la fonte della verità dell’hover
- In `ThresholdDoor.tsx` userò una sola logica visiva coerente:
  - `isHoverActive && phase === "idle"` resta l’unico stato di attivazione.
  - La timeline GSAP verrà mantenuta, ma con reset esplicito allo stato base in uscita hover.
- Eviterò che CSS “is-active” e GSAP si pestino i piedi sugli stessi valori critici.

2. Rendere il glow affidabile in uscita
- In `DoorAuraLayer.tsx` terrò il layer sempre montato, ma lo stato attivo servirà solo come supporto semantico.
- In `ThresholdDoor.tsx` imposterò uno stato iniziale esplicito via GSAP/CSS per:
  - `opacity: 0`
  - `scale` base
  - `filter: blur(...)` base
- In uscita hover, la timeline non farà solo `reverse()`: prevederò anche un reset sicuro dei valori se necessario, così il glow non può restare “appeso”.

3. Far vedere davvero le particelle
- In `src/index.css` allargherò molto la zona visibile delle mask:
  - meno clipping duro
  - più area attorno e dentro l’arco
- In `DoorHoverParticles.tsx` aumenterò leggibilità, non invasività:
  - particelle più grandi di poco
  - densità leggermente maggiore
  - speed più evidente
  - prevalenza dal basso/centro dell’arco verso l’alto, come sorgente luminosa
- L’idea è “luce che emana”, non “polvere casuale”.

4. Rifinire `SparklesCore` per un comportamento più leggibile
- In `src/components/ui/sparkles.tsx` renderò il comportamento più stabile su attiva/disattiva:
  - niente configurazione che azzera brutalmente tutto in modo invisibile
  - tuning di `move`, `opacity.animation`, `number`, `direction`
- Se serve, terrò il canvas sempre montato e userò solo fade/motion sul wrapper per evitare flicker o reset poco percepibili.

5. Conservare intatta la transizione click → dissolve
- Nessun cambio a `Threshold.tsx`
- Nessun cambio alla pipeline di navigazione
- Nessuna interferenza con click, focus keyboard, reduced motion

File da aggiornare
- `src/components/threshold/ThresholdDoor.tsx`
- `src/components/threshold/DoorHoverParticles.tsx`
- `src/components/ui/sparkles.tsx`
- `src/index.css`

Risultato atteso
- In hover si vede una sorgente luminosa viva dietro/dentro la porta
- Le sparkles si muovono chiaramente verso l’alto, senza diventare invadenti
- Quando esci con il mouse, glow e particelle si spengono sempre subito e correttamente
- Il click continua a funzionare esattamente come ora

Dettagli tecnici
```text
Hover ON:
  state active -> GSAP play + sparkles visible + glow visible

Hover OFF:
  state inactive -> GSAP reverse/reset + sparkles fade out + no residual glow

Visual direction:
  lower-center of arch -> upward drift -> soft fade near top
```
