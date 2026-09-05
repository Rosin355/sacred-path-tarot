# Product Requirements Document — Tempio delle Tre Vie

## Visione

Offrire a Jessica Marin un unico sito esperienziale che accompagni il visitatore attraverso una home cinematica e lo conduca a tre aree editoriali reali: Arcani, Respiro e Arte.

## Problema risolto

La precedente scena finale usava anchor interni: il click su una soglia riportava indietro nello scroll e non apriva una destinazione. Il prodotto unificato usa invece rotte React, mantenendo continuità visiva e sonora.

## Utenti

- Visitatore pubblico interessato a tarocchi, Yoga, attività fisica e Arte.
- Utente autenticato tramite Lovable Cloud/Supabase.
- Jessica o amministratore autorizzato alla gestione della knowledge base.

## Requisiti del rilascio

- `/` ospita la home cinematica senza video, basata su canvas e frame WebP.
- Le soglie finali aprono `/arcani`, `/respiro` e `/ispirazione`.
- `/ispirazione` conserva l'identificatore storico ma usa il nome pubblico “Via dell’Arte”.
- “Torna al Tempio” riapre `/#centro`.
- Musica ambientale unica e persistente, avviata al primo gesto e controllabile in ogni area pubblica.
- Guida vocale disponibile solo nelle tre Vie.
- Login, reset password, admin, database, storage ed Edge Functions restano compatibili.
- Fallback statico per reduced motion, risparmio dati, Canvas o WebGL non disponibili.

## Fuori ambito

- Migrazioni del database o modifiche alle policy RLS.
- Sostituzione dell'audio presente nel bucket Lovable/Supabase.
- Nuove funzioni commerciali, prenotazioni o pagamenti.
- Nuova rotta `/arte`: la rotta pubblica rimane `/ispirazione`.

## Criteri di accettazione

- Build e lint senza errori.
- Nessun salto all'indietro quando si seleziona una soglia finale.
- Apertura diretta e refresh delle tre rotte su Lovable.
- Audio senza duplicazioni o ripartenze durante la navigazione.
- Home usabile a 1440×900, 768 px e 390×844, anche con reduced motion.
- Login, area protetta e guida vocale non regressivi.

## KPI tecnici iniziali

- Zero errori runtime bloccanti nella preview Lovable.
- Zero listener, RAF o download della home rimasti attivi dopo il cambio rotta.
- Loader sempre sbloccato entro otto secondi tramite esperienza completa o fallback.
