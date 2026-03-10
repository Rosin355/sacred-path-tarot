# Lovable-safe PR Checklist

Usa questa checklist prima di aprire o mergiare una PR per evitare regressioni su **Lovable preview/run**.

## 1) Compatibilità build/runtime

- [ ] Il progetto resta **client-side Vite + React** (nessun runtime server custom richiesto).
- [ ] Nessuna dipendenza introdotta richiede componenti nativi/non web o toolchain non supportata da Lovable.
- [ ] I file base non sono stati rotti/spostati: `index.html`, `src/main.tsx`, `vite.config.ts`.
- [ ] Alias `@/` ancora funzionante (config Vite + TS coerente).

## 2) Environment variables

- [ ] Le nuove variabili ambiente usano prefisso `VITE_`.
- [ ] Non sono state committate secret private nel codice client.
- [ ] Le chiavi Supabase restano publishable lato client; nessuna service role key esposta.

## 3) Routing e UX core

- [ ] Le route principali funzionano: `/`, `/arcani`, `/respiro`, `/ispirazione`, `/login`, `/admin`, fallback `*`.
- [ ] Threshold → Via transition funziona (click porta → petali → navigazione).
- [ ] Fallback transition funziona (navigazione entro 3s anche se animazione fallisce).
- [ ] `prefers-reduced-motion` rispettato (fade semplice, no Canvas).
- [ ] Nessun link/anchor interno è rotto (sezioni raggiungibili da menu desktop/mobile).
- [ ] In caso di errore non critico (audio/autoplay/WebGL/Canvas), l'app degrada senza crash.

## 4) Auth, ruoli e sicurezza

- [ ] Le modifiche ad auth non rompono login/signup/signout.
- [ ] Le guardie route (`ProtectedRoute`) rispettano i ruoli.
- [ ] Le policy RLS (DB/Storage) restano coerenti con il comportamento UI.
- [ ] Le operazioni admin (es. upload/delete audio) restano consentite solo agli admin.

## 5) Stato, dati e backward compatibility

- [ ] Eventuali cambi schema DB hanno migration versionata in `supabase/migrations`.
- [ ] Le migrazioni sono backward-safe o con piano di rollout esplicito.
- [ ] Le modifiche a localStorage/sessione mantengono fallback per utenti esistenti.

## 6) Performance e asset

- [ ] Nuovi asset (immagini/audio/video/3D) sono ottimizzati per web preview.
- [ ] Nessun blocco in main thread introdotto da animazioni/effetti pesanti.
- [ ] Eventuali feature sperimentali sono protette da flag/fallback.

## 7) Verifiche minime prima merge

- [ ] `npm run build` passa.
- [ ] `npm run lint` passa.
- [ ] Smoke test manuale su route core completato.
- [ ] Smoke test auth/admin completato (se toccato da PR).

## 8) Criteri di stop-merge

- [ ] PR NON mergeabile se preview Lovable non parte o mostra errore bloccante.
- [ ] PR NON mergeabile se login/admin flow è regressivo.
- [ ] PR NON mergeabile se vengono introdotte dipendenze incompatibili con build web standard.

## 9) Note PR (da compilare)

- Impatto Lovable preview/run:
- Feature flag/fallback introdotti:
- Migrazioni Supabase incluse (sì/no):
- Rischi residui e mitigazioni:
