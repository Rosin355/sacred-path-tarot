# Architettura e stack

## Stack

- React 18, TypeScript e Vite 5.
- React Router 6 per le rotte client-side.
- Tailwind CSS e shadcn/ui per pagine, autenticazione e amministrazione.
- GSAP ScrollTrigger e Lenis per il percorso cinematografico.
- Canvas 2D con `createImageBitmap` per lo scrub dei frame.
- Three.js come progressive enhancement atmosferico.
- Lovable Cloud/Supabase per Auth, Postgres, Storage ed Edge Functions.

## Mappa applicativa

```text
App
├── BackgroundMusicProvider
└── BrowserRouter
    ├── /                    CinematicHome
    ├── /arcani              ViaArcani
    ├── /respiro             ViaRespiro
    ├── /ispirazione         ViaIspirazione, nome pubblico Via dell'Arte
    ├── /transition/:via     redirect legacy
    ├── /login
    ├── /reset-password
    ├── /admin               ProtectedRoute
    └── *                    NotFound
```

## Home cinematica

`CinematicHome` possiede il markup React e inizializza il motore solo dopo il mount. Tutte le query DOM sono limitate alla root `.cinematic-home`. Il CSS è namespaced per non sovrascrivere le pagine Tailwind.

Home, Vie, autenticazione, admin e guida vocale sono caricati tramite `React.lazy`: il primo ingresso non include nel bundle iniziale il codice delle destinazioni non ancora visitate.

Il motore:

1. seleziona manifest desktop o mobile;
2. carica i frame della scena corrente e di quelle adiacenti;
3. aggiorna canvas, testi e waypoint tramite ScrollTrigger;
4. abilita Three.js solo su dispositivi adeguati;
5. ripiega sugli still quando la modalità completa non è disponibile;
6. distrugge cache, listener, timer, RAF, Lenis, ScrollTrigger e WebGL all'unmount.

Gli asset sono collocati sotto `public/cinematic` per evitare collisioni con altri asset Lovable.

## Routing e transizioni

I waypoint laterali aggiornano soltanto gli hash della home. Le porte finali chiamano React Router dopo una dissolvenza di 800 ms e passano il colore della soglia nello state. `ViaLayout` usa lo stesso colore nell'overlay di ingresso. Reduced motion elimina l'attesa.

Il ritorno usa `/#centro`: un ingresso normale su `/` parte dalla Soglia, mentre il ritorno da una Via riapre il Centro.

## Audio

`BackgroundMusicProvider` crea un solo `HTMLAudioElement` sopra il router. La sorgente resta `audio/ambient-music.mp3` nello storage collegato. Lo stato condiviso espone `isMuted`, `isPlaying`, `isReady` e `toggleMute`; la preferenza mute usa `localStorage`.

## Sicurezza e configurazione

- Nessun segreto viene aggiunto al client.
- Le variabili Lovable/Supabase esistenti non vengono cambiate.
- Nessuna migrazione DB o modifica RLS fa parte del rilascio.
- Il progetto mantiene entrypoint e build standard Vite richiesti da Lovable.
