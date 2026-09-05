# Lovable-safe PR Checklist

Usa questa checklist prima di aprire o mergiare una PR per evitare regressioni su **Lovable preview/run**.

## 1) Compatibilità build/runtime

- [x] Il progetto resta **client-side Vite + React** (nessun runtime server custom richiesto).
- [x] Nessuna dipendenza introdotta richiede componenti nativi/non web o toolchain non supportata da Lovable.
- [x] I file base non sono stati rotti/spostati: `index.html`, `src/main.tsx`, `vite.config.ts`.
- [x] Alias `@/` ancora funzionante (config Vite + TS coerente).

## 2) Environment variables

- [x] `VITE_PRIVACY_CONTACT_EMAIL` è documentata come recapito pubblico e non viene committata con un valore.
- [x] Senza il recapito configurato tutti i controlli del form e l'invio risultano disabilitati.
- [x] Non sono state committate secret private nel codice client.
- [x] Le chiavi Supabase restano publishable lato client; nessuna service role key esposta.

## 3) Routing e UX core

- [x] Le route principali funzionano localmente: `/`, `/arcani`, `/respiro`, `/ispirazione`, `/login`, `/admin`, fallback `*`.
- [x] La route `/privacy` è presente e supporta apertura diretta.
- [x] Centro del Tempio → Via funziona (click soglia → dissolvenza → navigazione reale).
- [x] Il ritorno da ogni Via apre `/#centro`.
- [x] Il loader attiva il fallback entro 8s se i frame non sono disponibili.
- [x] `prefers-reduced-motion` usa le sezioni statiche e naviga senza attese.
- [x] Le tre Vie sono raggiungibili dal menu desktop/mobile anche durante il loader.
- [x] In caso di errore non critico (audio/autoplay/WebGL/Canvas), l'app degrada senza crash.

## 4) Auth, ruoli e sicurezza

- [ ] Le modifiche ad auth non rompono login/signup/signout.
- [ ] Le guardie route (`ProtectedRoute`) rispettano i ruoli.
- [ ] Le policy RLS (DB/Storage) restano coerenti con il comportamento UI.
- [ ] Le operazioni admin (es. upload/delete audio) restano consentite solo agli admin.
- [ ] Visitatori e utenti normali possono eseguire la RPC di invio ma non leggere o scrivere direttamente `contact_inquiries`.
- [ ] Lettura, cambio stato ed eliminazione delle richieste sono consentiti soltanto agli admin.

## 5) Stato, dati e backward compatibility

- [x] La migrazione inclusa è additiva e non altera tabelle, auth, storage o funzioni applicative esistenti.
- [ ] Migrazione, grant RPC e policy RLS verificati nell'ambiente Lovable di preview.
- [x] La preferenza audio in `localStorage` mantiene un default compatibile con gli utenti esistenti.

## 6) Performance e asset

- [x] I frame WebP desktop/mobile e gli still sono disponibili sotto `public/cinematic`.
- [x] Gli asset vengono caricati per scena e non tutti in modo eager.
- [x] Canvas e Three.js hanno fallback statico e teardown esplicito.

## 7) Verifiche minime prima merge

- [x] `npm run build` passa.
- [x] `npm run lint` passa senza errori (dieci warning legacy non bloccanti).
- [x] Smoke test manuale su route core completato.
- [x] QA locale menu/form/privacy completato a 1440×900, 768×1024 e 390×844.
- [ ] Smoke test auth/admin completato (se toccato da PR).
- [x] Guida vocale assente dalla home e presente nelle tre Vie.
- [ ] Form delle tre Vie, CTA, validazione, conferma e retry verificati end-to-end.
- [ ] Inbox admin verificata con almeno una richiesta di test e paginazione/filtri.
- [ ] Audio verificato end-to-end nella preview con il bucket Lovable collegato.
- [ ] Vulnerabilità npm ereditate triagiate prima del merge.

## 8) Criteri di stop-merge

- [ ] PR NON mergeabile se preview Lovable non parte o mostra errore bloccante.
- [ ] PR NON mergeabile se login/admin flow è regressivo.
- [ ] PR NON mergeabile se vengono introdotte dipendenze incompatibili con build web standard.

## 9) Note PR (da compilare)

- Impatto Lovable preview/run: nuova home, navigazione globale, form, pagina privacy e inbox admin; migrazione backend additiva.
- Feature flag/fallback introdotti: still statici per reduced motion, data saver o indisponibilità Canvas/WebGL.
- Migrazioni Supabase incluse (sì/no): sì, `20260905180000_add_contact_inquiries.sql`.
- Rischi residui e mitigazioni: peso asset mitigato da manifest desktop/mobile e caricamento progressivo; form disabilitato senza recapito privacy; dati protetti tramite RPC/RLS; audio, auth, policy e inbox da verificare nella preview collegata.
