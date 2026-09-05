# Procedura GitHub → Lovable

## Flusso di rilascio

1. Sviluppare sul branch `codex/cinematic-home-integration`.
2. Eseguire `npm run check` e gli smoke test locali.
3. Pubblicare il branch e aprire una PR verso `main`.
4. Verificare il diff e la checklist della PR.
5. Configurare in Lovable `VITE_PRIVACY_CONTACT_EMAIL` con il recapito pubblico approvato; non usare una chiave segreta.
6. Applicare la migrazione `20260905180000_add_contact_inquiries.sql` nell'ambiente di preview e verificarne policy e funzioni.
7. Aggiornare la preview e verificare home, rotte, audio, auth, form e inbox admin.
8. Eseguire il security check Lovable.
9. Unire la PR soltanto dopo esito positivo e attendere la sincronizzazione di `main`.
10. Usare **Publish → Update** e ripetere gli smoke test in produzione.

## Rollback

- In caso di regressione, effettuare revert della PR su GitHub e attendere la sincronizzazione di `main`.
- In alternativa usare la version history di Lovable, documentando comunque il rollback nel worklog.
- La migrazione è additiva: durante un rollback applicativo non eliminare `contact_inquiries`, enum o RPC, così le richieste già ricevute restano conservate. Una rimozione dello schema richiede un intervento separato e una valutazione sui dati.
- Netlify resta invariato fino all'approvazione della produzione Lovable e non viene dismesso automaticamente da questa PR.

## Controlli obbligatori

- [ ] Preview Lovable avviata senza errori.
- [ ] Refresh diretto di `/arcani`, `/respiro` e `/ispirazione`.
- [ ] Audio disponibile dal bucket collegato.
- [ ] Login e reset password.
- [ ] Protezione e apertura `/admin` con account autorizzato.
- [ ] `VITE_PRIVACY_CONTACT_EMAIL` configurata e `/privacy` raggiungibile con refresh diretto.
- [ ] Migrazione applicata senza alterare tabelle e policy esistenti.
- [ ] Invio valido riuscito sulle tre Vie; retry con token identico non duplica il record.
- [ ] Honeypot e quarto invio nella stessa ora non producono record.
- [ ] Visitatore anonimo impossibilitato a leggere o inserire direttamente in `contact_inquiries`.
- [ ] Inbox visibile solo all'admin; filtri, ricerca, stati ed eliminazione verificati.
- [ ] Scadenza a 12 mesi e pulizia degli elementi scaduti verificate.
- [ ] Guida vocale assente dalla home e presente nelle tre Vie.
- [ ] Nessun valore segreto aggiunto al bundle client.
- [ ] Vulnerabilità npm ereditate analizzate e accettate, mitigate o aggiornate senza regressioni.
