# Rilascio Chi sono ed Eventi

## Stato osservato

Il 15 settembre 2026 la richiesta REST in sola lettura a `site_page_content` sul progetto `lrooqvnxwttpguyptpfn` ha restituito `HTTP 404 / PGRST205`. La CLI disponibile non mostra quel progetto tra quelli autorizzati e non è collegata al progetto. Nessuna migrazione, ruolo o pubblicazione remota è stata eseguita da questa sessione.

## Procedura remota, nell'ordine

1. Nel progetto Supabase **lrooqvnxwttpguyptpfn**, verificare con un account autorizzato `to_regclass('public.site_page_content')`, la cronologia delle migrazioni e l'esistenza di `public.is_admin()`. Non usare `supabase db push` indiscriminato: nel repository esistono migrazioni storiche divergenti.
2. Solo se `site_page_content` manca, eseguire in SQL Editor il contenuto esatto di [20260914120000_site_page_content.sql](../supabase/migrations/20260914120000_site_page_content.sql). Verificare `SELECT count(*) FROM public.site_page_content;` = **8**, due stati per ciascuna delle quattro pagine, la policy `Published site content is public`, il trigger di validazione e le funzioni `save_site_content_draft`, `publish_site_content`, `restore_site_content_draft`.
3. Applicare [20260915120000_chi_sono_events.sql](../supabase/migrations/20260915120000_chi_sono_events.sql). Verificare **10** record editoriali, i due bucket (`event-posters` pubblico, `event-poster-drafts` privato), le policy di `site_events` e `storage.objects`, e la funzione `save_site_event`. La migrazione incrementa la revisione solo dove aggiunge campi o sostituisce i due valori iniziali esatti; preserva i testi personalizzati.
4. Registrare Jessica da `https://trevieperilluminarsi.com/login` e completare la verifica email. Prima di cambiare ruoli, eseguire in SQL Editor la lettura seguente e accertare **esattamente una** utenza, email confermata e profilo corrispondente:

```sql
SELECT u.id, u.email, u.email_confirmed_at, p.id AS profile_id,
       EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id=u.id AND r.role='admin') AS already_admin
FROM auth.users u LEFT JOIN public.profiles p ON p.id=u.id
WHERE u.email='jessicaommarin@gmail.com';
```

Solo dopo questi controlli, applicare questa assegnazione esplicita. Non modifica né elimina altri amministratori:

```sql
DO $$
DECLARE target_id uuid; target_count integer; confirmed timestamptz;
BEGIN
  SELECT count(*), max(id), max(email_confirmed_at)
    INTO target_count, target_id, confirmed
    FROM auth.users WHERE email='jessicaommarin@gmail.com';
  IF target_count <> 1 THEN RAISE EXCEPTION 'Attesa una sola utenza Jessica, trovate %', target_count; END IF;
  IF confirmed IS NULL THEN RAISE EXCEPTION 'Email di Jessica non confermata'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id=target_id) THEN RAISE EXCEPTION 'Profilo Jessica mancante'; END IF;
  INSERT INTO public.user_roles(user_id,role) VALUES(target_id,'admin') ON CONFLICT(user_id,role) DO NOTHING;
END $$;
SELECT r.user_id,r.role FROM public.user_roles r
JOIN auth.users u ON u.id=r.user_id WHERE u.email='jessicaommarin@gmail.com';
```

5. Dopo il push del codice su `main`, pubblicare il progetto tramite Lovable usando l'interfaccia autorizzata. Verificare sul dominio reale `/`, `/chi-sono`, `/eventi`, `/login`, una pubblicazione di evento, bozze non visibili in anonimo, archiviazione/ripristino e accesso admin di Jessica e webmaster.

## Test locali

`npm run lint`, `npx tsc --noEmit`, `npm run build` e `node --experimental-strip-types scripts/site-events-validation-qa.mjs`. Su un Postgres temporaneo, applicare nell'ordine le due migrazioni e poi [site-events-db-qa.sql](../scripts/site-events-db-qa.sql). Il test controlla record iniziali, RLS anonima e per utenti normali, bucket e conflitti di revisione.

Con un Vite locale configurato per l'URL Supabase sintetico `http://127.0.0.1:54321`, eseguire [readability-qa.mjs](../scripts/readability-qa.mjs), [site-events-browser-qa.mjs](../scripts/site-events-browser-qa.mjs) e [site-events-admin-browser-qa.mjs](../scripts/site-events-admin-browser-qa.mjs) usando Playwright e Chrome installati. Questi test intercettano tutte le richieste REST/Auth/Storage: verificano layout, reduced motion, form, griglia e dialog Eventi, nonché bozza, pubblicazione, archiviazione, ripristino, conflitto, errore di rete e sostituzione locandina nel client. Il test sintetico non sostituisce una pubblicazione reale su Supabase/Lovable né una prova Safari.
