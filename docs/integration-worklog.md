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
- **Verifica:** build locale completata; nessuna migrazione database inclusa.
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
