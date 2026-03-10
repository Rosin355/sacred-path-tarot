# Software Requirements Specification (SRS)

## 1. Overview

### 1.1 Purpose
Questo documento definisce i requisiti software del progetto **Sacred Path Tarot**, una web app esperienziale per consultazioni esoteriche con autenticazione utenti e area amministrativa.

### 1.2 Scope
Il sistema permette:
- esperienza front-end immersiva (loader, home, sezioni narrative)
- consultazione tarocchi a 3 carte con feedback audio
- autenticazione utenti via Supabase
- gestione ruoli (admin/user)
- dashboard admin per upload/sostituzione audio di background

### 1.3 Product Context
Stack attuale:
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn-ui
- React Router
- TanStack Query
- Supabase Auth, Database, Storage, RLS
- Tone.js (effetti sonori), Three.js/R3F (visual)

## 2. Stakeholders and User Classes

- **Visitatore anonimo**: naviga il sito, consulta contenuti pubblici.
- **Utente autenticato**: accede con email/password; può fruire esperienza completa lato utente.
- **Admin**: utente con ruolo `admin`, può accedere alla dashboard e gestire audio background.

## 3. Functional Requirements

### FR-01 Routing principale
- Il sistema deve esporre le route:
  - `/` Threshold homepage (tre porte)
  - `/arcani`, `/respiro`, `/ispirazione` mini-home delle tre vie
  - `/login` autenticazione/registrazione
  - `/admin` area protetta admin
  - fallback `*` su pagina 404

### FR-01b Transizione Threshold → Via
- Al click su una porta, il sistema esegue una transizione cinematica:
  - Le porte non selezionate sfumano
  - Il titolo della porta attiva anima verso il centro viewport (GSAP)
  - Un overlay Canvas 2D con petali organici e polvere copre la scena
  - Navigazione alla route selezionata al completamento
- Fallback: navigazione diretta dopo 3s
- `prefers-reduced-motion`: fade semplice + navigazione dopo 400ms
- Ref: `docs/threshold-motion-spec.md`

### FR-02 Loader di ingresso
- La route `/` deve mostrare un'animazione iniziale e un bottone `Enter`.
- Al click su `Enter`, l'utente deve essere reindirizzato a `/home`.

### FR-03 Home pubblica
- La home deve mostrare le sezioni principali (Hero, Metodo, Consultazione, Percorso, About, Services, Quote, Footer).
- La navigazione deve supportare desktop e mobile.

### FR-04 Consultazione tarocchi
- L'utente deve poter selezionare fino a 3 carte su 7 disponibili.
- A selezione completata, deve comparire il CTA “Rivela la Saggezza”.
- Dopo l'avvio lettura, il sistema deve mostrare:
  - 3 carte selezionate
  - testo interpretativo
  - corrispondenze esoteriche
  - pratica suggerita
- Deve essere possibile resettare la consultazione con “Nuova Consultazione”.

### FR-05 Effetti sonori
- Il sistema deve riprodurre effetti sonori su azioni chiave (selezione carta, reveal, navigazione).
- L'inizializzazione audio deve rispettare vincoli browser (attivazione dopo interazione utente).

### FR-06 Musica background
- Il sistema deve tentare autoplay della musica (se non in mute).
- Se autoplay è bloccato dal browser, l'app deve continuare senza crash.
- Lo stato mute deve essere persistito in `localStorage`.

### FR-07 Autenticazione
- Deve essere possibile registrarsi con email/password.
- Deve essere possibile autenticarsi e disconnettersi.
- Le sessioni devono persistere via Supabase Auth.

### FR-08 Profili utente
- Alla creazione account, il sistema deve creare automaticamente il profilo utente.

### FR-09 Ruoli e autorizzazioni
- I ruoli devono essere gestiti nella tabella `user_roles`.
- Il sistema deve riconoscere il ruolo `admin`.
- L'accesso a `/admin` deve essere consentito solo ad admin autenticati.

### FR-10 Dashboard Admin: file audio
- L'admin deve poter caricare un file MP3 di background.
- L'admin deve poter eliminare il file attuale.
- Il sistema deve validare formato e dimensione file.
- Il file deve essere salvato in bucket Supabase `audio` con nome canonico `ambient-music.mp3`.

### FR-11 Sicurezza dati (RLS)
- Le policy RLS devono garantire:
  - utente legge/aggiorna il proprio profilo
  - utente legge i propri ruoli
  - admin gestisce ruoli
  - pubblico legge audio
  - solo admin carica/elimina audio

## 4. Non-Functional Requirements

### NFR-01 Compatibilità Lovable (critico)
- Il progetto deve restare **Vite + React client-side** senza dipendenze runtime server custom.
- Le variabili ambiente devono usare prefisso `VITE_`.
- Evitare toolchain non supportate da preview Lovable.
- Mantenere entrypoint standard (`index.html`, `src/main.tsx`, `vite.config.ts`).
- Evitare script postinstall/build non deterministici.

### NFR-02 Affidabilità UX
- L'app non deve bloccarsi se audio/3D non disponibili.
- Degrado graduale obbligatorio per autoplay bloccato e fallimenti storage.

### NFR-03 Performance
- Prima visualizzazione pagina entro tempi accettabili su rete mobile media.
- Asset multimediali (audio/immagini/3D) devono essere ottimizzati e lazy quando possibile.

### NFR-04 Sicurezza
- Nessuna secret key lato client oltre chiavi publishable.
- RLS obbligatoria su tabelle e storage sensibili.

### NFR-05 Manutenibilità
- Componenti modulari, hook isolati per auth/audio/effects.
- Convenzioni TypeScript coerenti con alias `@/`.

## 5. Data Requirements

### 5.1 Tabelle
- `profiles`: dati base utente
- `user_roles`: ruoli applicativi (`admin`, `moderator`, `user`)

### 5.2 Storage
- Bucket `audio` pubblico (read)
- Oggetto canonico: `ambient-music.mp3`

## 6. External Interfaces

- Supabase Auth API
- Supabase Postgres + RLS
- Supabase Storage API
- Browser Web Audio API (via Tone.js)
- Rendering WebGL (Three.js / React Three Fiber)

## 7. Current Gaps / Technical Risks (dal codice attuale)

- Alcuni anchor di navigazione (`#lettura`) non corrispondono agli id effettivi di sezione: rischio UX (scroll non corretto).
- La dimensione massima file mostrata in UI (20MB) non è allineata con validazione codice (50MB).
- In ambiente offline/non installato non è possibile validare build/lint; serve CI per garanzia compatibilità continua.

## 8. Proposed Feature Roadmap

### P1 (alto impatto)
1. **Motore lettura dinamica (AI-backed)**
- Generazione interpretazione su carte scelte + contesto utente.
- Versione fallback con template statici se AI non disponibile.

2. **Storico consultazioni utente**
- Salvataggio letture con timestamp e note personali.
- Vista “Il mio percorso” con filtri e ricerca.

3. **Admin Content Manager**
- Gestione testi sezioni (Hero, Metodo, Quote) da dashboard.
- Preview locale prima pubblicazione.

### P2 (crescita prodotto)
1. **Deck reale da 78 carte + stese multiple**
- Stesa 1, 3, Celtic Cross.
- Significati upright/reversed.

2. **Onboarding spirituale guidato**
- Questionario iniziale per personalizzare tono e pratiche suggerite.

3. **Analytics etiche e privacy-first**
- Eventi anonimi per capire drop-off e ottimizzare funnel.

### P3 (ottimizzazione)
1. **Modalità performance/fallback**
- Toggle che disattiva effetti 3D su device low-end.

2. **Internationalization**
- Italiano/English con contenuti localizzati.

3. **Testing E2E e quality gates**
- Smoke test su route principali e auth/admin flow.

## 9. Lovable Compatibility Guardrails (operativi)

- Non spostare/stravolgere la struttura base Vite.
- Non introdurre dipendenze native o build steps non supportati in web preview.
- Mantenere `npm run dev`, `npm run build`, `npm run preview` funzionanti.
- Isolare feature sperimentali dietro flag.
- Prima merge: build locale + lint + smoke route.

## 10. Acceptance Criteria (MVP corrente)

- Utente anonimo vede loader e accede a home.
- Utente può completare una consultazione 3 carte senza errori runtime.
- Login/signup funzionanti con Supabase.
- Solo admin autenticato accede a `/admin`.
- Admin può caricare/eliminare audio in sicurezza.
- La preview Lovable si avvia senza errori bloccanti.
