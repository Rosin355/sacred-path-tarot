# Worklog — integrazione home cinematica

Questo registro accompagna i commit della migrazione da `jessicamarin-sitoV2` a `sacred-path-tarot`.

## Fase 1 — asset e dipendenze

- **Commit:** `9015ae8 chore: import cinematic home assets and dependencies`
- **Obiettivo:** predisporre il progetto Lovable per il motore cinematografico senza modificare routing o backend.
- **Modifiche:** importati frame WebP desktop/mobile, still di fallback e dipendenze Lenis/font locali; aggiunto il comando aggregato `npm run check`.
- **Verifica:** struttura degli asset e manifest presenti; installazione dipendenze completata.
- **Rischi residui:** peso statico di circa 64 MB, mitigato dal caricamento per scena e dalla variante mobile.
- [x] Asset desktop
- [x] Asset mobile
- [x] Fallback statici
- [x] Dipendenze frontend
- [x] Build completa dopo l'integrazione React

## Fase 2 — home React

- **Commit:** `10d75ea feat: replace the legacy threshold with the cinematic journey`
- **Obiettivo:** sostituire la vecchia soglia con il percorso cinematografico mantenendo React Router come shell applicativa.
- **Modifiche:** creati componente React, motore GSAP/Lenis, scrubber canvas, atmosfera Three.js e CSS isolato; aggiunta la dissolvenza di uscita da 800 ms.
- **Verifica:** selettori limitati alla root cinematica e teardown esplicito di animazioni, listener, timer, richieste e WebGL.
- **Rischi residui:** la fluidità percepita va ricontrollata con rete e dispositivi reali nella preview Lovable.
- [x] Home convertita in JSX
- [x] Motore con cleanup su unmount
- [x] CSS isolato
- [x] Fallback statico
- [x] QA browser e viewport

## Fase 3 — routing, audio e funzioni Lovable

- **Commit:** `5f589c8 feat: connect path routes and persistent temple audio`
- **Obiettivo:** trasformare le soglie finali in navigazione reale e mantenere la musica senza interruzioni fra le rotte.
- **Modifiche:** introdotto un provider audio unico, avvio al primo gesto, controllo persistente, redirect legacy e guida vocale limitata alle tre Vie; il ritorno punta a `/#centro`.
- **Verifica:** build di produzione completata dopo la conversione della home; route state e overlay condividono il colore della soglia.
- **Rischi residui:** l'audio dipende dal bucket Lovable/Supabase e richiede verifica nell'ambiente collegato.
- [x] Navigazione `/arcani`, `/respiro`, `/ispirazione`
- [x] Redirect `/transition/:via`
- [x] Audio singleton a livello applicazione
- [x] Guida vocale solo nelle Vie
- [x] Ritorno al Centro del Tempio
- [ ] Smoke test con backend Lovable

## Fase 4 — allineamento editoriale

- **Commit:** `ba592aa content: align the breath and art paths`
- **Obiettivo:** rendere coerenti home, pagine interne, accessibilità e metadati con le tre Vie approvate.
- **Modifiche:** Via del Respiro centrata su Yoga e attività fisica; `/ispirazione` presenta esclusivamente il nome pubblico Via dell’Arte; aggiornati title, description e CTA.
- **Verifica:** la rotta tecnica `/ispirazione` resta invariata e non sono stati modificati identificatori backend o token grafici storici.
- **Rischi residui:** i documenti storici devono essere marcati e allineati nella fase documentale.
- [x] Copy Via del Respiro
- [x] Copy Via dell’Arte
- [x] SEO globale e di pagina
- [x] Route tecnica `/ispirazione` preservata
- [x] Allineamento documentazione storica

## Fase 5 — documentazione e rilascio

- **Commit:** `docs: record the Lovable migration and release checks` (questo documento)
- **Obiettivo:** consegnare una base governabile tramite GitHub e Lovable, con requisiti, architettura, roadmap, verifiche e rollback espliciti.
- **Modifiche:** aggiunti PDR, architettura, Sprint 4, changelog e runbook Lovable; marcate come storiche le specifiche della precedente Threshold.
- **Verifica:** build locale completata; quella fase non includeva migrazioni database. La migrazione additiva dei contatti viene introdotta successivamente nella Fase 7.
- **Rischi residui:** preview, security check e pubblicazione Lovable richiedono l'ambiente collegato dopo il merge. `npm audit --omit=dev` segnala inoltre vulnerabilità già presenti nelle catene React Router, Supabase, Recharts e toolchain; le tre nuove dipendenze dirette non compaiono nelle catene segnalate, ma il debito va riesaminato separatamente prima della pubblicazione.
- [x] PDR
- [x] Architettura
- [x] Roadmap e Sprint 4
- [x] Changelog
- [x] Procedura di rilascio e rollback
- [x] Lint completo: zero errori, dieci warning legacy non bloccanti
- [x] QA visuale locale: 1440×900, 768×1024, 390×844
- [x] Navigazione, redirect legacy e ritorno `/#centro` verificati localmente
- [x] `npm run check` completato dopo il riordino finale dei commit
- [x] Audit npm eseguito senza applicare aggiornamenti automatici potenzialmente regressivi
- [ ] Preview e Publish Lovable

## Fase 6 — navigazione immediata

- **Commit:** `831a7c8 feat: add immediate global path navigation`
- **Obiettivo:** consentire l'accesso diretto alle tre Vie senza obbligare il visitatore a completare il percorso cinematografico.
- **Modifiche:** introdotto `TempleNavigation` condiviso; link fissi su desktop, dock inferiore su mobile, `aria-current`, disponibilità sopra il loader e adeguamento della guida vocale.
- **Verifica:** TypeScript e lint mirato completati; rotte e transizione cromatica esistenti riutilizzate.
- **Rischi residui:** spaziature e sovrapposizioni devono essere confermate nella preview Lovable su Safari e dispositivi reali.
- [x] Menu globale condiviso
- [x] Accesso durante il loader
- [x] Stato attivo accessibile
- [x] Compatibilità con dissolvenza e audio
- [ ] QA preview Chrome/Safari

## Fase 7 — persistenza sicura

- **Commit:** `39837ca feat: add secure path inquiry persistence`
- **Obiettivo:** registrare le richieste senza concedere accesso pubblico diretto ai dati.
- **Modifiche:** aggiunta migrazione con tabella, enum, trigger, indici, policy RLS e RPC; introdotti idempotenza, honeypot, limite di tre invii/ora, validazione server-side e scadenza a 12 mesi.
- **Verifica:** tipi Supabase aggiornati e controllo TypeScript completato.
- **Rischi residui:** la migrazione e le policy devono essere applicate e testate nell'ambiente Lovable collegato prima del merge.
- [x] Schema additivo
- [x] Nessun privilegio INSERT pubblico
- [x] RPC anon/auth limitata
- [x] RLS amministrativa
- [x] Pulizia richieste scadute
- [ ] Test SQL/RLS in preview

## Fase 8 — form, privacy e inbox

- **Commit:** `fc6587c feat: add path inquiry forms and admin inbox`
- **Obiettivo:** rendere operative le CTA e dare agli amministratori un flusso completo di consultazione delle richieste.
- **Modifiche:** aggiunti form contestuali, motivi per Via, pagina `/privacy`, gestione sicura del recapito pubblico, inbox admin e azioni di stato/eliminazione.
- **Verifica:** TypeScript e lint mirato completati; i contenuti utente sono renderizzati come testo React e gli errori pubblici non espongono dettagli backend.
- **Rischi residui:** invio reale e inbox richiedono migrazione applicata, variabile configurata e account admin nella preview.
- [x] CTA con preselezione
- [x] Validazione client e messaggi `aria-live`
- [x] Honeypot e token di invio
- [x] Privacy e conservazione documentate
- [x] Inbox paginata da 25
- [ ] Smoke test end-to-end Lovable

## Fase 9 — documentazione contatti e rilascio

- **Commit:** `docs: record inquiry workflow and privacy controls` (questo documento)
- **Obiettivo:** rendere verificabili architettura, requisiti, sicurezza, rilascio e rollback del nuovo flusso.
- **Modifiche:** aggiornati PDR, architettura, SRS, roadmap, changelog, worklog e checklist Lovable.
- **Verifica:** `npm run check`, diff check e QA locale vengono registrati al completamento della fase.
- **Rischi residui:** security check e test backend restano vincolati all'ambiente Lovable dopo l'applicazione della migrazione.
- [x] Requisiti e flusso dati documentati
- [x] Controlli privacy e RLS documentati
- [x] Procedura di rilascio e rollback aggiornata
- [x] `npm run check`: zero errori, dieci warning legacy non bloccanti
- [x] QA locale: 1440×900, 768×1024 e 390×844
- [x] Menu durante il loader, CTA/preselezione, validazione e `/privacy` verificati localmente
- [x] Dock mobile misurata nel viewport senza sovrapposizione con la guida vocale
- [x] Form disabilitato e nessun invio possibile senza `VITE_PRIVACY_CONTACT_EMAIL`
- [ ] Verifica preview Lovable
