
Obiettivo: migliorare la presenza del Siri-style nella pagina Threshold, perché ora il componente è montato globalmente e il capsule da 19rem si sovrappone visivamente alla composizione delle tre porte.

1. Diagnosi del problema
- Il componente è renderizzato globalmente in `App.tsx`, quindi appare su tutte le route nello stesso modo.
- `FloatingVoiceGuide.tsx` usa un contenitore `fixed` in basso a destra con offset costanti.
- `Siri.tsx` ha una larghezza importante (`min(19rem, calc(100vw - 2rem))`), che nella homepage Threshold entra nella scena principale invece di sembrare integrato.
- Dallo screenshot si vede che il blocco invade la zona delle card/porte e pesa troppo nella gerarchia visiva.

2. Direzione di design proposta
Per la pagina Threshold lo trasformerei da “floating CTA generica” a “presenza discreta di scena”:
- più basso e più staccato dal contenuto
- più corto e leggermente più sottile
- con opacità/contrasto più controllati in idle
- con tooltip/testo meno invasivi
- con comportamento responsive specifico per desktop e mobile

3. Implementazione proposta
A. Rendere il posizionamento route-aware
- In `FloatingVoiceGuide.tsx` leggere `location.pathname`.
- Applicare una variante specifica per `/`:
  - desktop: ancoraggio più vicino al bordo inferiore/destro
  - mobile: full-width contenuta ma fuori dalla zona critica delle porte
- Aggiungere data-attribute o classi tipo:
  - `data-route-context="threshold"`
  - `data-route-context="default"`

B. Ridurre l’ingombro del capsule nella Threshold
- In `Siri.tsx` supportare una variante layout, ad esempio `compact`.
- Per Threshold:
  - width più corta
  - height leggermente ridotta
  - padding interno più misurato
  - glow più morbido in idle
- Mantenere comunque la forma Apple-like e la qualità del wave.

C. Migliorare il contenitore flottante
- In `FloatingVoiceGuide.tsx`:
  - usare classi responsive invece di solo inline style
  - su Threshold aggiungere una safe area più ampia rispetto al contenuto
  - allineamento meno “appoggiato” sulla composizione centrale
- Valutazione concreta:
  - desktop: `bottom` più vicino al margine basso, `right` più esterno
  - mobile: centrato in basso oppure quasi full-width con `max-width` controllata

D. Rifinire la UI della capsule
- In `src/index.css`:
  - abbassare leggermente opacità della superficie in idle
  - ridurre glow esterno quando non sta parlando
  - affinare il bordo vetro per farlo sembrare parte dell’ambiente e non overlay “pesante”
  - attenuare o nascondere il tooltip sulla homepage se risulta rumoroso

E. Gestire il pannello
- Lasciare il pannello apribile, ma farlo comparire sopra il capsule senza coprire gli elementi principali.
- Se necessario, nella Threshold:
  - aprirlo con offset dedicato
  - oppure farlo salire sopra il capsule con distanza maggiore
- Sui percorsi interni può restare il layout attuale.

4. Risultato atteso
- In homepage Threshold il Siri-style sembrerà integrato nella scena, non sovrapposto.
- La composizione “Tre Vie” resterà dominante.
- L’assistente rimarrà sempre accessibile, ma più elegante e meno invasivo.
- Su mobile il componente sarà più ordinato e non ostacolerà lettura, touch o scroll.

5. File da toccare
- `src/components/voice/FloatingVoiceGuide.tsx`
- `src/components/voice/Siri.tsx`
- `src/index.css`
- eventualmente `src/components/voice/VoicePanel.tsx` solo per rifinire l’offset/apertura nella route `/`

6. Dettagli tecnici
```text
App.tsx
└── FloatingVoiceGuide (globale)
    ├── legge pathname
    ├── decide variant: threshold | default
    └── passa variant a Siri + pannello

Siri.tsx
└── riceve variant
    ├── threshold => capsule più compatta
    └── default => capsule attuale

index.css
└── regole dedicate
    ├── [data-route-context="threshold"]
    ├── .voice-siri-preview--compact
    ├── idle glow più soft
    └── tooltip meno invasivo
```

7. Scelta consigliata
Ti consiglierei questa soluzione:
- homepage Threshold: capsule compatta, più discreta e meglio posizionata
- pagine interne: UI attuale quasi invariata
Così preserviamo il lavoro fatto sul Siri-style, ma lo adattiamo bene alla composizione editoriale della landing.
