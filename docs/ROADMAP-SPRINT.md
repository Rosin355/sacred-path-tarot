# Roadmap e sprint

## Sprint 1–3 — base Sacred Path

- [x] Tre pagine tematiche.
- [x] Autenticazione e area amministrativa.
- [x] Integrazione Lovable Cloud/Supabase.
- [x] Musica ambientale e guida vocale.
- [x] Prima home Threshold.

## Sprint 4 — integrazione cinematica

- [x] Import asset WebP desktop/mobile e still.
- [x] Conversione della home in React.
- [x] Isolamento CSS.
- [x] Teardown GSAP, Lenis, Canvas e Three.js.
- [x] Rotte reali dalle soglie finali.
- [x] Dissolvenza da 800 ms e reduced motion.
- [x] Audio persistente a livello applicazione.
- [x] Guida vocale limitata alle Vie.
- [x] Via dell'Arte su rotta storica `/ispirazione`.
- [x] Via del Respiro allineata a Yoga e attività fisica.
- [x] Build locale.
- [x] Lint completo senza errori.
- [x] QA locale desktop, tablet e mobile.
- [ ] Verifica preview Lovable.
- [ ] Security check Lovable.
- [ ] Merge su `main` e Publish → Update.

## Sprint 5 — navigazione e contatti

- [x] Menu globale desktop e mobile per le Tre Vie.
- [x] Navigazione disponibile sopra il loader e `aria-current`.
- [x] Form riutilizzabile e motivi contestuali per ogni Via.
- [x] CTA collegate al form con preselezione del motivo.
- [x] Pagina `/privacy` e gestione di `VITE_PRIVACY_CONTACT_EMAIL`.
- [x] Migrazione additiva `contact_inquiries` con RLS.
- [x] RPC pubblica controllata con validazione, honeypot, idempotenza e rate limit.
- [x] Inbox admin con ricerca, filtri, paginazione e gestione stato.
- [x] Pulizia automatica delle richieste scadute senza `pg_cron`.
- [ ] Applicazione migrazione e test RLS/RPC nella preview Lovable.
- [ ] Verifica visuale e funzionale Chrome/Safari nella preview.

## Sprint 6 — evoluzioni successive

- [x] Code splitting delle pagine interne e dei moduli 3D.
- [ ] Misurazione Core Web Vitals sull'hosting Lovable.
- [ ] Ottimizzazione ulteriore del numero di frame per reti lente.
- [x] Collegamento delle CTA ai form contestuali.
- [ ] Revisione accessibilità con screen reader e navigazione solo tastiera.
