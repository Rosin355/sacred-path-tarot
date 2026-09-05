# Changelog

## Unreleased — integrazione home cinematica

### Aggiunto

- Home scroll-driven con frame WebP, GSAP, Lenis e atmosfera Three.js.
- Asset desktop/mobile e fallback statici.
- Provider audio persistente e avvio al primo gesto.
- Dissolvenza fra Centro del Tempio e pagine delle Vie.
- PDR, architettura, roadmap e procedura di rilascio Lovable.

### Modificato

- La route `/` usa la home cinematica al posto della precedente Threshold.
- Le soglie finali aprono pagine React reali.
- “Torna al Tempio” riapre `/#centro`.
- La guida vocale appare soltanto nelle tre Vie.
- `/ispirazione` usa il nome pubblico Via dell'Arte.
- Via del Respiro comunica Yoga e attività fisica.

### Compatibilità

- Login, reset password, admin, Lovable Cloud e Supabase restano invariati.
- `/transition/:via` continua a funzionare come redirect legacy.
- Nessuna migrazione database inclusa.
