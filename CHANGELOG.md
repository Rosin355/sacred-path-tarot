# Changelog

## Unreleased — revisione editoriale homepage, 6 settembre 2026

- Ridotte le ripetizioni del marchio in apertura, loader, scena finale e footer.
- Nuovo H1 “Le tre vie / per illuminarsi”, sottotitolo descrittivo e invito allo scroll.
- Quinta tappa “La scelta” e chiusura “Il tuo prossimo passo / Scegli la via che senti tua”, con etichette accessibili coerenti.
- Adattati dimensione mobile dell'H1 e impaginazione del sottotitolo; rotte e animazioni invariate.

## Unreleased — integrazione home cinematica

### Aggiunto

- Home scroll-driven con frame WebP, GSAP, Lenis e atmosfera Three.js.
- Asset desktop/mobile e fallback statici.
- Provider audio persistente e avvio al primo gesto.
- Dissolvenza fra Centro del Tempio e pagine delle Vie.
- Navigazione globale immediata desktop/mobile, accessibile anche durante il loader.
- Form contestuali per Arcani, Respiro e Arte con CTA collegate.
- Pagina `/privacy` e recapito pubblico configurabile tramite ambiente.
- Tabella `contact_inquiries`, RPC di invio sicuro, scadenza a 12 mesi e policy RLS admin-only.
- Inbox amministrativa con conteggi, filtri, ricerca, paginazione e gestione delle richieste.
- PDR, architettura, roadmap e procedura di rilascio Lovable.

### Modificato

- La route `/` usa la home cinematica al posto della precedente Threshold.
- Le soglie finali aprono pagine React reali.
- “Torna al Tempio” riapre `/#centro`.
- La guida vocale appare soltanto nelle tre Vie.
- `/ispirazione` usa il nome pubblico Via dell'Arte.
- Via del Respiro comunica Yoga e attività fisica.
- Le CTA delle Vie aprono il form e preselezionano il motivo corrispondente.
- Il layout mobile riserva spazio alla dock delle Vie e alla guida vocale.

### Compatibilità

- Login, reset password, admin, Lovable Cloud e Supabase restano invariati.
- `/transition/:via` continua a funzionare come redirect legacy.
- La migrazione è esclusivamente additiva e non modifica auth, storage, knowledge base o funzioni esistenti.
- Il rollback applicativo conserva tabella e richieste già ricevute.
