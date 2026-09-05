# Procedura GitHub → Lovable

## Flusso di rilascio

1. Sviluppare sul branch `codex/cinematic-home-integration`.
2. Eseguire `npm run check` e gli smoke test locali.
3. Pubblicare il branch e aprire una PR verso `main`.
4. Verificare diff, assenza di migrazioni Supabase e checklist della PR.
5. Unire la PR soltanto dopo esito positivo.
6. Attendere la sincronizzazione del branch predefinito in Lovable.
7. Aggiornare la preview e verificare home, rotte, audio, auth e admin.
8. Eseguire il security check Lovable.
9. Usare **Publish → Update**.

## Rollback

- Non sono previste migrazioni dati: il rollback applicativo è indipendente dal database.
- In caso di regressione, effettuare revert della PR su GitHub e attendere la sincronizzazione di `main`.
- In alternativa usare la version history di Lovable, documentando comunque il rollback nel worklog.
- Netlify resta invariato fino all'approvazione della produzione Lovable e non viene dismesso automaticamente da questa PR.

## Controlli obbligatori

- [ ] Preview Lovable avviata senza errori.
- [ ] Refresh diretto di `/arcani`, `/respiro` e `/ispirazione`.
- [ ] Audio disponibile dal bucket collegato.
- [ ] Login e reset password.
- [ ] Protezione e apertura `/admin` con account autorizzato.
- [ ] Guida vocale assente dalla home e presente nelle tre Vie.
- [ ] Nessun valore segreto aggiunto al bundle client.
- [ ] Vulnerabilità npm ereditate analizzate e accettate, mitigate o aggiornate senza regressioni.
