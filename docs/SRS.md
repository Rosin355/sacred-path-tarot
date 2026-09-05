# Software Requirements Specification

## 1. Scopo

Sacred Path Tarot è una web app esperienziale pubblicata tramite Lovable. La home cinematica presenta il Tempio delle Tre Vie e conduce alle pagine Arcani, Respiro e Arte; autenticazione, amministrazione e guida vocale utilizzano i servizi Lovable Cloud/Supabase esistenti.

## 2. Requisiti funzionali

### FR-01 — Routing

- `/` mostra `CinematicHome`.
- `/arcani`, `/respiro` e `/ispirazione` mostrano le tre Vie.
- `/ispirazione` mantiene l'ID tecnico storico ma presenta il nome pubblico “Via dell'Arte”.
- `/transition/:via` reindirizza alla Via corrispondente.
- `/login`, `/reset-password`, `/admin` e la pagina 404 restano disponibili.

### FR-02 — Percorso cinematografico

- La home usa frame WebP su canvas; non usa video.
- Lo scroll controlla la sequenza con interpolazione indipendente dal refresh rate.
- I waypoint permettono di raggiungere ogni scena senza zone morte.
- Le porte finali aprono rotte React dopo una dissolvenza di 800 ms.
- Click multipli durante la transizione vengono ignorati.
- Il ritorno dalle Vie conduce a `/#centro`.

### FR-03 — Progressive enhancement

- Reduced motion, risparmio dati o Canvas non disponibile attivano la versione statica.
- WebGL viene disabilitato su mobile o dispositivi con memoria ridotta.
- Un errore di rete non deve lasciare il loader bloccato oltre otto secondi.
- Uscendo dalla home devono essere distrutti listener, RAF, cache bitmap, richieste, Lenis, ScrollTrigger e renderer Three.js.

### FR-04 — Audio

- Un solo elemento audio deve sopravvivere ai cambi rotta.
- La sorgente resta `audio/ambient-music.mp3` nello storage collegato.
- La riproduzione parte al primo gesto valido, salvo preferenza mute.
- Mute e stato di riproduzione devono essere coerenti in home e pagine interne.

### FR-05 — Guida vocale

- La guida è disponibile soltanto su `/arcani`, `/respiro` e `/ispirazione`.
- Non compare su home, autenticazione o amministrazione.
- Le Edge Functions e la knowledge base esistenti non vengono modificate.

### FR-06 — Autenticazione e amministrazione

- Login, reset password, sessione e ruoli restano gestiti tramite Lovable Cloud/Supabase.
- `/admin` resta protetta dal ruolo amministratore.
- Non sono previste migrazioni DB o modifiche RLS.

## 3. Requisiti non funzionali

- Stack client-side Vite + React compatibile con Lovable.
- CSS della home isolato dalle pagine Tailwind.
- Asset caricati per scena con variante mobile dedicata.
- Testi accessibili, navigazione da tastiera e rispetto di `prefers-reduced-motion`.
- Nessuna chiave privata nel codice client.
- `npm run check` deve completare lint e build.

## 4. Interfacce

- React Router per la navigazione.
- `BackgroundMusicProvider` espone `isMuted`, `isPlaying`, `isReady` e `toggleMute`.
- Supabase Auth, Postgres, Storage ed Edge Functions restano le interfacce backend.
- Browser Canvas, Web Audio e WebGL sono usati con fallback.

## 5. Accettazione

- Tutte le rotte pubbliche si aprono e si aggiornano nella preview Lovable.
- I click sulle tre soglie non modificano soltanto l'hash della home.
- Il ritorno dalle Vie riapre il Centro del Tempio.
- Audio, auth, admin e guida vocale non mostrano regressioni.
- Home verificata a 1440×900, 768 px e 390×844.
- Build, lint e security check Lovable completati prima della pubblicazione.
