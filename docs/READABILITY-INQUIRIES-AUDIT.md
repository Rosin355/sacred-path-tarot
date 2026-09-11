# Leggibilità e richieste — verifica 9–11 settembre 2026

## Stato della consegna

Implementazione locale sul branch `codex/cinematic-home-integration`, base `f0ec18b`. Nessun push, deploy, modifica al database remoto o configurazione di segreti. La sincronizzazione remota non è stata verificata con fetch in questo intervento.

## Correzioni e motivazioni

- I blocchi narrativi sono visibili a opacità piena durante il proprio intervallo: niente testo fermo a metà dissolvenza, blur del testo o sovrapposizione tra due messaggi. I cambi del testo sono netti; l'atmosfera resta animata.
- Velo chiaro/scuro legato al tema della scena, con bordi morbidi e protezione stabile. Il blur riguarda esclusivamente il velo decorativo.
- Paragrafi 16–18 px, peso 400, righe limitate; etichette significative almeno 14 px. Titoli serif, testo informativo sans-serif. Focus visibile e controlli più ampi.
- Modalità lettura persistente e fallback automatico quando il testo supera lo spazio disponibile. Le sezioni statiche seguono il contenuto, senza la durata artificiale dello scroll cinematografico.
- Hero Arcani protetta dalle carte decorative; contrasto rinforzato per testi secondari, form e menu. Barra mobile anche su tablet, con spazio per la guida vocale.
- Sottotitolo: “Tarocchi, yoga, attività fisica e arte: tre vie per conoscerti, ritrovare equilibrio ed esprimere ciò che sei.” Presentazione personale alleggerita senza cambiare discipline, servizi, luoghi e orari. CTA “Richiedi un consulto”, non promessa di prenotazione.

## Form, database e admin

- Email normalizzata; blocco sincrono dei doppi click; token conservato in caso di errore; conferma solo dopo risposta RPC positiva; valori preservati in errore.
- Errori associati ai campi e annunciati; consenso privacy accessibile. Senza recapito privacy valido l'invio resta disabilitato.
- Inbox: aggiornamento manuale, ordinamento stabile, protezione dalle risposte obsolete, gestione errori e sblocco delle azioni, riallineamento della pagina dopo cancellazioni, ricerca anche delle etichette italiane degli argomenti.
- Il caricamento del ruolo attende anche il recupero della sessione, evitando un redirect prematuro alla home.
- Migrazione additiva `20260909120000_harden_inquiry_retries.sql`: privilegi espliciti e lock sul token prima del controllo di idempotenza. Il lock per email mantiene il limite di tre richieste/ora. Non modifica la migrazione storica.

## Verifiche effettivamente eseguite

| Verifica | Esito e limite |
|---|---|
| Lint e build | `npm run check` superato; warning legacy e dimensione chunk restano da ottimizzare separatamente |
| Typecheck aggiuntivo | `tsc --noEmit -p tsconfig.app.json` evidenzia debito di tipizzazione nello scrubber preesistente (campi di classe non dichiarati); non incluso in `npm run check`. Corretta separatamente la tipizzazione boolean del consenso del form, mantenendo il vincolo di accettazione |
| Desktop 1440×900 | Home controllata visivamente; testo campionato durante lo scroll a opacità 1, filtro none, senza doppio blocco visibile |
| Mobile 390×844 | Fallback statico automatico, nessun overflow orizzontale; form e menu verificati |
| Tablet 768×1024 | Respiro e Arte verificati, nessun overflow orizzontale; paragrafi 16 px e kicker 14 px |
| Modalità lettura | Attivazione e persistenza dopo refresh confermate; sezioni a flusso naturale |
| Reduced motion del sistema, Safari, zoom effettivo 200% | Percorsi e CSS ispezionati; verifica visuale dedicata ancora da eseguire, non certificata |
| Form Arcani | CTA preseleziona consulto; errori obbligatori annunciati; errore di rete conserva valori; invio locale positivo dopo configurazione del trasporto QA |
| Form Respiro e Arte | Invii sintetici positivi dal browser; record visibili nell'inbox locale, ordinati dalla più recente |
| Admin | Login sintetico, contatori, cambio a Letta, ricerca per nome, dettaglio completo, archiviazione e ripristino confermati nell'interfaccia |
| SQL reale delle migrazioni in PGlite | Validazione, honeypot, normalizzazione, retry, quarto invio rifiutato, RLS visitatore/utente/admin, archiviazione/ripristino/cancellazione e scadenza superati |
| Concorrenza reale, PostgREST e Auth Supabase | Da verificare in staging: PGlite è a connessione singola e il trasporto/Auth QA è simulato |
| Paginazione oltre 25 record, filtri combinati, refresh remoto | Implementazione ispezionata; test completo in staging ancora richiesto |
| Rotte | Aperture locali di /, /arcani, /respiro, /ispirazione, /privacy, /login e /admin; non equivalgono a una verifica del routing del deploy |

Non è una certificazione WCAG AA: il miglioramento dei colori e il controllo visivo non sostituiscono la misurazione pixel per pixel su tutti i fotogrammi, gli stati focus e i browser. Non sono stati usati dati personali reali. Audio, guida vocale remota e knowledge base non sono simulati integralmente dal server QA.

## Ripetere i test locali

`scripts/inquiry-db-qa.mjs` esegue le migrazioni in un database PostgreSQL/WASM in memoria. Richiede `@electric-sql/pglite` installato in una directory temporanea e il percorso del modulo in `PGLITE_MODULE`; non aggiunge dipendenze al progetto e non legge una connection string remota.

```sh
PGLITE_MODULE=/percorso/temporaneo/node_modules/@electric-sql/pglite node scripts/inquiry-db-qa.mjs
```

Per QA browser, impostare una password esclusivamente sintetica nella variabile di processo `QA_TEST_PASSWORD` e aggiungere `QA_SERVE=1`: il server ascolta solo su 127.0.0.1:54321, con account fittizio `admin@example.test`. Non pubblicare questo server e non usarlo come backend applicativo.

```sh
VITE_SUPABASE_URL=http://127.0.0.1:5173 VITE_SUPABASE_PUBLISHABLE_KEY=local-synthetic-key VITE_PRIVACY_CONTACT_EMAIL=qa@example.test npm run dev -- --config scripts/vite-qa.config.ts --host 127.0.0.1 --port 5173
```

Gli indirizzi `.test` sono fixture riservate, non il recapito privacy di Jessica. La configurazione QA è opt-in e non viene usata da build/deploy. `scripts/readability-qa.mjs` contiene ulteriori test browser ripetibili: non eseguiti integralmente in questa sessione per limiti del browser headless; i controlli sopra sono quelli effettivamente eseguiti tramite browser interattivo.

## Recapito privacy: azione del proprietario

Serve l'indirizzo reale scelto da Jessica. Non è stato inventato né salvato in un file `.env` del repository.

La documentazione Lovable distingue i **build secrets** dalle **Cloud secrets**: per un workspace che supporta questa funzione, aprire **Settings → Build & deploy → Build secrets → New variable**, inserire `VITE_PRIVACY_CONTACT_EMAIL` e il recapito approvato, quindi **Save changes**. La funzione è documentata per Enterprise e ha ambito workspace: verificare il piano e gli altri progetti interessati. Fonte: [Lovable Build secrets](https://docs.lovable.dev/features/build-secrets).

Le secrets in **Cloud → Secrets** sono per il backend e non garantiscono l'iniezione nel bundle Vite. Se “Build secrets” non è disponibile, chiedere a Lovable il meccanismo di build supportato dal proprio piano; non salvare l'indirizzo nel repository per aggirare il vincolo e non acquistare un piano senza decisione del proprietario. Un'alternativa runtime richiederebbe una modifica architetturale separata.

La variabile `VITE_` è pubblica nel frontend, non un segreto: dopo la configurazione serve una nuova build e, soltanto dopo approvazione, pubblicazione. Fonte: [Lovable hosting e variabili Vite](https://docs.lovable.dev/tips-tricks/external-deployment-hosting).

## Migrazioni e checklist per l'amministratore

Compatibilità verificata con le dipendenze SQL versionate (`is_admin`, `set_updated_at`, ruoli). Lo schema effettivo di Lovable/Supabase non è stato interrogato: non si può certificare l'assenza di drift remoto.

1. Identificare inequivocabilmente il progetto staging; verificare backup e cronologia migrazioni. Da CLI già autenticata e collegata al progetto corretto: `supabase migration list --linked`. Non eseguire un `db push` indiscriminato.
2. Nel SQL editor controllare senza leggere dati personali:

```sql
select to_regclass('public.contact_inquiries');
select to_regprocedure('public.is_admin()'), to_regprocedure('public.set_updated_at()');
select relrowsecurity from pg_class where oid = to_regclass('public.contact_inquiries');
select policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename = 'contact_inquiries';
select grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'contact_inquiries';
```

3. Se assente, revisionare/applicare in staging `20260905180000_add_contact_inquiries.sql`, dopo le sue dipendenze. Poi applicare la nuova migrazione di hardening. Se già registrata, non rieseguire la migrazione iniziale: contiene creazioni non idempotenti.
4. Configurare il recapito privacy nella build di staging e ricompilare.
5. Da visitatore inviare un messaggio sintetico per ogni Via; aprire `/login` con un account staging già amministratore, poi `/admin` → **Richieste** → **Aggiorna richieste**. Cercare l'email sintetica e verificare Via, motivo e messaggio. Nessun invio email è previsto.
6. Provare filtri, ricerca argomento in italiano, oltre 25 record, letta/archivia/ripristina ed eliminazione confermata solo di fixture. Controllare che un utente normale non veda record e che anon non possa inserire direttamente. Provare due richieste simultanee con lo stesso token e il limite per email su connessioni separate.
7. Verificare Safari, reduced-motion, zoom 200%, focus e contrasto su fotogrammi estremi; eseguire Security Check Lovable. Non considerare la checklist completa se restano rilievi.
8. Solo dopo autorizzazione: commit/PR, migrazione di produzione revisionata, build e aggiornamento pubblicazione. Rollback applicativo senza cancellare tabella o richieste raccolte.

## File interessati

- `src/cinematic/cinematic-home.css`, `src/cinematic/cinematicJourney.ts`, `src/pages/CinematicHome.tsx`
- `src/readability.css`, `src/main.tsx`, `src/components/temple-navigation.css`
- `src/pages/ViaArcani.tsx`, `src/components/ViaLayout.tsx`
- `src/components/PathInquiryForm.tsx`, `src/components/admin/AdminInquiryManager.tsx`, `src/hooks/useUserRole.ts`
- `supabase/migrations/20260909120000_harden_inquiry_retries.sql`
- `scripts/inquiry-db-qa.mjs`, `scripts/readability-qa.mjs`, `scripts/vite-qa.config.ts`
- questo report, `docs/PDR.md`, `docs/integration-worklog.md`, `CHANGELOG.md`

Le indicazioni delle skill di sicurezza, data fetching e Postgres hanno guidato la separazione dei privilegi, la validazione lato database e la gestione degli errori. Il workflow Sites è stato limitato alla verifica locale, conservando stack Lovable e divieto di pubblicazione.
