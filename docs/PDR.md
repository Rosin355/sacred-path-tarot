# Product Requirements Document — Tempio delle Tre Vie

## Visione

### Gerarchia editoriale della homepage — 6 settembre 2026

Il marchio nell'header mantiene “Tempio delle Tre Vie”. L'apertura usa il sopratitolo “Un percorso con Jessica Marin”, l'H1 “Le tre vie / per illuminarsi” e il sottotitolo “Tarocchi, Yoga e attività fisica, Arte: percorsi per conoscere ed esprimere te stesso.” L'invito allo scroll è “Scorri e scopri il percorso”.

La tappa conclusiva è “La scelta”, introdotta da “Il tuo prossimo passo” e “Scegli la via / che senti tua”. Il footer mostra © Jessica Marin, simboli decorativi e Privacy; il loader identifica Jessica Marin. Questi testi sono condivisi da esperienza cinematica e fallback statico. Presentazione personale, offerte e nomi delle porte restano invariati.

Offrire a Jessica Marin un unico sito esperienziale che accompagni il visitatore attraverso una home cinematica e lo conduca a tre aree editoriali reali: Arcani, Respiro e Arte.

## Problema risolto

La precedente scena finale usava anchor interni: il click su una soglia riportava indietro nello scroll e non apriva una destinazione. Il prodotto unificato usa invece rotte React, mantenendo continuità visiva e sonora. La navigazione immediata e i form contestuali permettono inoltre di scegliere una Via o inviare una richiesta senza completare obbligatoriamente il percorso narrativo.

## Utenti

- Visitatore pubblico interessato a tarocchi, Yoga, attività fisica e Arte.
- Utente autenticato tramite Lovable Cloud/Supabase.
- Jessica o amministratore autorizzato alla gestione della knowledge base e delle richieste.

## Requisiti del rilascio

- `/` ospita la home cinematica senza video, basata su canvas e frame WebP.
- Le soglie finali aprono `/arcani`, `/respiro` e `/ispirazione`.
- Un menu globale raggiungibile da tastiera espone subito le tre Vie, anche durante il loader; su mobile diventa una barra inferiore compatta.
- `/ispirazione` conserva l'identificatore storico ma usa il nome pubblico “Via dell’Arte”.
- “Torna al Tempio” riapre `/#centro`.
- Musica ambientale unica e persistente, avviata al primo gesto e controllabile in ogni area pubblica.
- Guida vocale disponibile solo nelle tre Vie.
- Login, reset password, admin, database, storage ed Edge Functions restano compatibili.
- Ogni Via termina con un form contestuale che valida i dati, preseleziona il motivo dalla CTA e salva tramite una RPC Supabase idempotente.
- Le richieste sono leggibili e gestibili esclusivamente dagli amministratori nella nuova inbox “Richieste”.
- `/privacy` descrive trattamento, conservazione di 12 mesi e diritti; il recapito pubblico è letto da `VITE_PRIVACY_CONTACT_EMAIL`.
- Fallback statico per reduced motion, risparmio dati, Canvas o WebGL non disponibili.

## Fuori ambito

- Sostituzione dell'audio presente nel bucket Lovable/Supabase.
- Prenotazioni con calendario, pagamenti o notifiche email.
- Nuova rotta `/arte`: la rotta pubblica rimane `/ispirazione`.

## Criteri di accettazione

- Build e lint senza errori.
- Nessun salto all'indietro quando si seleziona una soglia finale.
- Apertura diretta e refresh delle tre rotte su Lovable.
- Audio senza duplicazioni o ripartenze durante la navigazione.
- Home usabile a 1440×900, 768 px e 390×844, anche con reduced motion.
- Login, area protetta e guida vocale non regressivi.
- CTA e form accessibili, con errori e conferme annunciati tramite `aria-live`.
- Nessun inserimento pubblico diretto in `contact_inquiries`: anonimi e autenticati possono chiamare soltanto `submit_contact_inquiry`.
- Lettura, aggiornamento ed eliminazione delle richieste consentiti soltanto agli admin tramite RLS.
- In assenza di `VITE_PRIVACY_CONTACT_EMAIL` il form resta disabilitato e non invia dati.

## KPI tecnici iniziali

- Zero errori runtime bloccanti nella preview Lovable.
- Zero listener, RAF o download della home rimasti attivi dopo il cambio rotta.
- Loader sempre sbloccato entro otto secondi tramite esperienza completa o fallback.
- Zero duplicati prodotti da retry con lo stesso `submission_token` e massimo tre richieste per email in un'ora.
