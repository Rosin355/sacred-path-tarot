# Home essenziale ed editor testi — resoconto di implementazione

Data: 14 settembre 2026

## Ambito completato nel codice

- La barra nera laterale della home è sostituita da cinque indicatori circolari con area interattiva 44 × 44 px, stato attivo, etichetta su hover/focus e collegamenti alle sezioni.
- Le nove CTA intermedie della home sono rimosse senza lasciare contenitori vuoti.
- I tre portali finali sono testo semplice non interattivo.
- La riga finale con copyright, simboli e link Privacy è rimossa solo dalla home. L’informativa e i link dei form/pagine interne restano invariati.
- I testi pubblicati vengono risolti prima di montare le pagine. Il timeout è di 3 secondi e il fallback usa i testi inclusi nel codice per l’intera visita.
- `/admin` è diviso in Testi del sito, Richieste e Guida AI.
- L’editor gestisce Homepage, Arcani, Respiro e Arte con campi di testo semplice raggruppati per sezione.
- Sono disponibili Salva bozza, Anteprima, Pubblica testi e Ripristina dal pubblicato, con avviso per modifiche non salvate e controllo di revisione.
- La route protetta `/admin/testi/anteprima/:page` usa gli stessi componenti pubblici e mostra il contrassegno “Anteprima bozza”.

## Migrazione autonoma

File: `supabase/migrations/20260914120000_site_page_content.sql`

La migrazione crea soltanto il nuovo dominio `site_page_content`; non esegue nuovamente la cronologia divergente. Include otto record iniziali, RLS, validazione dei campi e tre funzioni atomiche. Gli anonimi leggono solo `published`; bozze e operazioni sono riservate al ruolo admin esistente.

## Verifiche locali

- `npx tsc --noEmit`: superato.
- `npm run check`: superato con 10 warning preesistenti.
- Build Vite di produzione: superata.
- Test database isolato: seed, RLS anon/admin, validazione, conflitto di revisione, pubblicazione e seconda applicazione idempotente superati.
- Ricerca statica: assenti dalla home le nove CTA, i portali cliccabili e la firma finale.
- I file locali duplicati con suffisso “2” non sono entrati nella copia di lavoro né nel commit.

## Stato pubblicazione

- Commit e push: implementazione pubblicata su `main` nel commit `43f404bdd9663572afd13a0fcbfb6d0440126333`.
- Migrazione remota: non ancora applicata. Una lettura anonima restituisce `PGRST205`, confermando che `site_page_content` non è presente. La sessione Supabase CLI non ha accesso al progetto `lrooqvnxwttpguyptpfn`; il progetto non risulta nell’elenco dell’account collegato.
- Deploy Lovable: non ancora eseguito. L’accesso browser automatizzato a Lovable è stato bloccato dal controllo di sicurezza amministrativo del browser.
- Verifica online: il deployment pubblico `cef730ba-a4af-4c64-a5db-64d16b6fadc4` serve ancora la versione precedente; nel modulo pubblico risultano ancora le vecchie CTA e la firma finale.

Non pubblicare il frontend prima della migrazione: il sito pubblico continuerebbe a funzionare grazie al fallback, ma l’editor non potrebbe salvare o pubblicare testi.
