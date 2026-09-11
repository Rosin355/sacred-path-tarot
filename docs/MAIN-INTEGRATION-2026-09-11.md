# Integrazione su main — 11 settembre 2026

- Base remota acquisita con fetch: `49cc20f` (11 commit successivi a `f0ec18b`).
- Migliorie locali conservate nel commit `c9cd647`; integrazione non distruttiva con origin/main.
- Preservati `index.html`, favicon PNG e social-preview JPG del remoto, oltre allo storage Auth della preview Lovable e alla correzione dello scrubber.
- Risolto il conflitto privacy mantenendo la validazione boolean remota e gli errori accessibili locali.
- Form compatibile con RPC sia VOID (versione Lovable) sia UUID: una risposta senza errore conferma l'invio. Inbox non richiede più `archived_at`, assente nello schema Lovable.
- Corretto un errore lint `prefer-const` nel nuovo storage Auth, senza modificarne il comportamento.
- La migrazione di hardening gestisce entrambi i contratti RPC e protegge anche la purge con controllo admin. Test SQL isolati superati sulla variante Lovable. Nessuna migrazione remota applicata.

## Attenzione alla cronologia SQL

Le due migrazioni storiche `20260905180000` e `20260909102844` creano entrambe gli stessi oggetti con contratti differenti. Sono conservate per non riscrivere la cronologia già applicata. Non eseguire automaticamente tutta la catena su un database nuovo: prima riconciliare il registro migrazioni con lo schema effettivo. Il test `QA_SCHEMA=lovable` applica la variante Lovable e poi l'hardening; il test senza variabile applica la variante originale.

## Privacy e pubblicazione

Recapito approvato configurato esclusivamente in `.env.local`, ignorato da Git. Nessun indirizzo reale aggiunto ai file versionati.

Accesso al progetto Lovable confermato. In Impostazioni → Creazione e distribuzione → Segreti di build, il workspace Business mostra il blocco Enterprise e solo “Parla con il team vendite”. Nessuna variabile di build remota configurata. Le Cloud Secrets non sono un sostituto delle variabili Vite di compilazione.

Il proprietario deve ottenere un meccanismo supportato da Lovable per iniettare `VITE_PRIVACY_CONTACT_EMAIL` nella build (o autorizzare una soluzione alternativa). Dopo la configurazione occorre ricompilare e usare Pubblica → Aggiorna. La sola integrazione su main non rimuove l'avviso del form pubblico.

Backend: schema remoto non modificato, migrazione di hardening ancora da revisionare/applicare con autorizzazione. Test isolati non equivalgono a verifica della produzione. L'esito effettivo di push e pubblicazione viene riportato nel messaggio di consegna con il relativo commit.
