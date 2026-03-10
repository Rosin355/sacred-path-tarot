# Tasks — Il Tempio delle Tre Vie

> Fonte unica di verità per l'esecuzione. Ogni task fa riferimento ai documenti in `docs/`.

## Stato attuale del progetto

### Già implementato ✅
- Routing base: `/` (Threshold), `/transition/:via`, `/arcani`, `/respiro`, `/ispirazione`, `/login`, `/admin`
- `Threshold.tsx`: homepage full-screen con 3 porte
- `Transition.tsx`: spirale rituale con auto-navigate dopo 4s
- `ViaLayout.tsx`: wrapper condiviso con "Torna al Tempio"
- `ViaArcani.tsx`, `ViaRespiro.tsx`, `ViaIspirazione.tsx`: mini-home placeholder
- Auth: login/signup + admin + ruoli (user_roles table)
- Storage audio con bucket Supabase

### Da fare 🔧
- Design system non allineato alle guidelines (palette, tipografia, spacing)
- Tipografia da sostituire (Love Light → serif editoriale; UnifrakturMaguntia → rimuovere)
- Palette da aggiornare con colori specifici delle guidelines
- Pagine interne mancanti per ogni Via
- Form contatto/prenotazione
- Accessibilità da verificare
- Auth da nascondere (route attive ma non linkate nella UI pubblica)

---

## Fase 1 — Design System Base

> Ref: `docs/design-guidelines.md` §Typography, §Color System, §Spacing & Layout, §Motion
> Blocca: tutte le fasi successive

### Task 1.1: Aggiornare palette colori in index.css e tailwind.config.ts

**Criterio:** i token CSS riflettono esattamente la palette delle guidelines.

**File coinvolti:** `src/index.css`, `tailwind.config.ts`

**Dettaglio:**

Sostituire i token attuali con la palette definita nelle guidelines:

```
:root {
  /* Core palette - convertita in HSL */
  --background: 262 29% 5%;          /* Obsidian Plum #0D0A12 */
  --foreground: 37 33% 93%;          /* Lunar Ivory #F3EDE4 */
  --card: 268 26% 9%;               /* Temple Night #17111F */
  --card-foreground: 37 33% 93%;
  --primary: 262 48% 35%;           /* Sacred Violet #4B2E83 */
  --primary-foreground: 37 33% 93%;
  --secondary: 265 7% 49%;          /* Stone Gray #7E778B */
  --secondary-foreground: 37 33% 93%;
  --muted: 268 26% 9%;              /* Temple Night */
  --muted-foreground: 265 7% 49%;   /* Stone Gray */
  --accent: 39 47% 60%;             /* Antique Gold #C9A86A */
  --accent-foreground: 262 29% 5%;
  --border: 265 7% 25%;
  --ring: 262 48% 35%;

  /* Via-specific */
  --via-arcani-accent: 262 48% 35%;      /* Sacred Violet */
  --via-arcani-glow: 268 26% 9%;         /* Temple Night */
  --via-respiro-accent: 260 30% 75%;     /* Mist Lilac #B8A7D9 */
  --via-respiro-glow: 265 7% 49%;        /* Stone Gray */
  --via-ispirazione-accent: 37 40% 83%;  /* Parchment Glow #E7D8BE */
  --via-ispirazione-glow: 39 47% 60%;    /* Antique Gold */

  /* Semantic */
  --success: 138 28% 68%;    /* #93C6A0 */
  --warning: 39 56% 62%;     /* #D4B06A */
  --destructive: 0 63% 75%;  /* #E59A9A */
  --info: 201 49% 66%;       /* #7DB8D6 */
}
```

**Nota:** aggiungere token `success`, `warning`, `info` anche in tailwind.config.ts.

### Task 1.2: Sostituire tipografia

**Criterio:** font serif editoriale per H1/H2, serif strutturale per H3/H4, serif leggibile o soft sans per body.

**File coinvolti:** `src/index.css`, `tailwind.config.ts`, `index.html` (Google Fonts)

**Scelta font (da Google Fonts):**
- **H1 (Display):** Cormorant Garamond (700) — serif alto contrasto, cerimoniale ma non fantasy
- **H2–H4:** Cormorant Garamond (600) — continuità con H1, più contenuto
- **Body:** Source Serif 4 (400) — leggibile, calmo, contemporaneo
- **Caption/Label/Nav:** Source Sans 3 (400, 500) — sans sobria, ariosa

**Scala tipografica da guidelines:**

```css
h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 600; line-height: 1.1; }
h2 { font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 600; line-height: 1.15; }
h3 { font-size: clamp(1.5rem, 3vw, 1.75rem); font-weight: 600; line-height: 1.2; }
h4 { font-size: clamp(1.25rem, 2vw, 1.375rem); font-weight: 500; line-height: 1.25; }
body { font-size: clamp(1rem, 1.5vw, 1.125rem); line-height: 1.6; }
```

**Rimuovere:** Love Light, UnifrakturMaguntia, Manufacturing Consent.
**Rimuovere:** text-shadow glow eccessivo sui titoli (effetto fantasy).

### Task 1.3: Aggiornare spacing e layout

**File coinvolti:** `tailwind.config.ts`

**Dettaglio:**
- Verificare griglia 8pt
- Hero content max-width: 720px
- Content max-width: 760-840px
- CTA grid max-width: 1120-1280px

### Task 1.4: Aggiornare motion language

**File coinvolti:** `src/index.css`, `tailwind.config.ts`

**Dettaglio da guidelines:**
- Hover/focus/press: 150–250ms
- Transizioni UI: 200–300ms
- Reveal sezione: 240–320ms
- Spirale/soglia: 700–1200ms
- Easing: ease-out delicato, no bounce
- Rimuovere `.underwater-link` (troppo aggressivo/fantasy)
- Focus ring visibile e coerente

### Task 1.5: Creare componenti base riusabili

**File da creare:**
- `src/components/temple/HeroSection.tsx` — hero di Via riusabile
- `src/components/temple/CtaCard.tsx` — card CTA principale
- `src/components/temple/SectionBlock.tsx` — contenitore sezione editoriale
- `src/components/temple/RitualButton.tsx` — bottone/link rituale
- `src/components/temple/EmptyState.tsx` — stato vuoto gentile

**Criterio:** ogni componente usa solo token semantici, nessun colore diretto.

---

## Fase 2 — Homepage Soglia

> Ref: `docs/design-guidelines.md` §Threshold Homepage Art Direction
> Dipende da: Fase 1

### Task 2.1: Raffinare Threshold.tsx secondo guidelines

**File:** `src/pages/Threshold.tsx`

**Checklist:**
- [ ] Palette aggiornata (Obsidian Plum background)
- [ ] Tipografia aggiornata (serif editoriale, no glow eccessivo)
- [ ] Composizione frontale equilibrata desktop/mobile
- [ ] Porte: pietra antica, luce radente, no portali neon
- [ ] Hover: lieve risveglio di luce (150-250ms)
- [ ] Focus: ring visibile, contrastato
- [ ] Invocazione in alto al centro
- [ ] "Scegli la soglia che ti chiama" in basso
- [ ] `prefers-reduced-motion` supportato
- [ ] Nessun elemento UI che ruba centralità alle porte

### Task 2.2: Validare composizione mobile

- Porte in stack verticale su mobile
- Invocazione sempre visibile
- Sottotitoli leggibili
- Target touch comodi (min 44px)

---

## Fase 3 — Transizione Rituale

> Ref: `docs/implementation-plan.md` §Fase 3
> Dipende da: Fase 2

### Task 3.1: Raffinare Transition.tsx

**File:** `src/pages/Transition.tsx`

**Checklist:**
- [ ] Nessuna etichetta "Enter" (già fatto ✅)
- [ ] Spirale come rito di passaggio calmo
- [ ] Ridurre eccessi visivi se presenti
- [ ] Durata percepita adeguata (~3-4s)
- [ ] Fallback semplice se animazione non disponibile (fade + navigate)
- [ ] `prefers-reduced-motion`: fade rapido + navigate immediato

### Task 3.2: Verificare SpiralAnimation

**File:** `src/components/ui/spiral-animation.tsx`

- Verificare che non sia troppo "game portal"
- Verificare performance su dispositivi medi

---

## Fase 4 — Mini-Home delle Tre Vie

> Ref: `docs/implementation-plan.md` §Fase 4, `docs/app-flow-pages-and-roles.md`
> Dipende da: Fase 1 (componenti), Fase 3

### Task 4.1: Aggiornare ViaArcani.tsx

**File:** `src/pages/ViaArcani.tsx`

**Struttura:**
- Hero con atmosfera profonda e ombrosa (Sacred Violet dominant)
- Titolo forte
- Intro: metodo di Jessica (placeholder)
- 3 CTA cards: Scopri l'approccio → Il metodo / Prenota un consulto → Consulti / Esplora gli eventi → Eventi
- "Torna al Tempio"
- Le CTA devono essere link navigabili verso pagine interne (Fase 5)

### Task 4.2: Aggiornare ViaRespiro.tsx

**File:** `src/pages/ViaRespiro.tsx`

**Struttura:**
- Hero con atmosfera luminosa e ariosa (Mist Lilac dominant)
- 3 CTA: Comprendi la pratica / Scopri le attività / Richiedi informazioni
- Tono calmo, distinguere da fitness mainstream

### Task 4.3: Aggiornare ViaIspirazione.tsx

**File:** `src/pages/ViaIspirazione.tsx`

**Struttura:**
- Hero con atmosfera culturale e calda (Parchment Glow dominant)
- 3 CTA: Esplora le ispirazioni / Leggi le riflessioni / Scopri eventi o progetti
- Tono editoriale, contemplativo

### Task 4.4: Aggiornare ViaLayout.tsx

**File:** `src/components/ViaLayout.tsx`

- Usare componenti temple/ riusabili
- "Torna al Tempio" sempre accessibile
- Footer minimale con brand line
- Nav interna semplice con link alle pagine della Via

---

## Fase 5 — Pagine Interne Essenziali

> Ref: `docs/implementation-plan.md` §Fase 5, `docs/app-flow-pages-and-roles.md` §Purpose
> Dipende da: Fase 4

### Task 5.1: Pagine Via degli Arcani

**File da creare:**
- `src/pages/arcani/Metodo.tsx` — Il metodo di Jessica
- `src/pages/arcani/Consulti.tsx` — Consulti / Percorsi
- `src/pages/arcani/Eventi.tsx` — Eventi esoterici
- `src/pages/arcani/Contatti.tsx` — Contatti / Prenotazione

**Route:** `/arcani/metodo`, `/arcani/consulti`, `/arcani/eventi`, `/arcani/contatti`

**Struttura per pagina:** hero + spiegazione + CTA contestuale + uscita chiara

### Task 5.2: Pagine Via del Respiro

**File da creare:**
- `src/pages/respiro/Filosofia.tsx` — Approccio e filosofia
- `src/pages/respiro/Discipline.tsx` — Discipline e pratiche
- `src/pages/respiro/Lezioni.tsx` — Eventi / lezioni / incontri
- `src/pages/respiro/Contatti.tsx` — Contatti / Prenotazione

**Route:** `/respiro/filosofia`, `/respiro/discipline`, `/respiro/lezioni`, `/respiro/contatti`

### Task 5.3: Pagine Via dell'Ispirazione

**File da creare:**
- `src/pages/ispirazione/Articoli.tsx` — Articoli / riflessioni
- `src/pages/ispirazione/Musica.tsx` — Musica / ascolti / ispirazioni
- `src/pages/ispirazione/Letteratura.tsx` — Letteratura esoterica
- `src/pages/ispirazione/EventiCulturali.tsx` — Eventi culturali / progetti speciali

**Route:** `/ispirazione/articoli`, `/ispirazione/musica`, `/ispirazione/letteratura`, `/ispirazione/eventi`

### Task 5.4: Aggiornare App.tsx con tutte le route

**File:** `src/App.tsx`

Aggiungere tutte le route interne nidificate.

---

## Fase 6 — Contatti e Conversione Gentile

> Ref: `docs/implementation-plan.md` §Fase 6
> Dipende da: Fase 5

### Task 6.1: Creare componente ContactForm

**File:** `src/components/temple/ContactForm.tsx`

**Campi essenziali:**
- Nome
- Email
- Messaggio
- Via di provenienza (automatico dal contesto)

**Conferma:** "La tua richiesta è stata accolta. Ti risponderemo con cura."

**Protezione:** rate limiting base, validazione client

### Task 6.2: Creare tabella contatti nel database

**Migrazione SQL:**

```sql
CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  via text NOT NULL CHECK (via IN ('arcani', 'respiro', 'ispirazione', 'generale')),
  created_at timestamptz DEFAULT now(),
  read_at timestamptz,
  archived_at timestamptz
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Chiunque può inviare una richiesta
CREATE POLICY "Anyone can insert inquiries"
  ON public.contact_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Solo admin legge le richieste
CREATE POLICY "Admin can read inquiries"
  ON public.contact_inquiries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Solo admin aggiorna (read_at, archived_at)
CREATE POLICY "Admin can update inquiries"
  ON public.contact_inquiries FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
```

---

## Fase 7 — Content Management Leggero

> Ref: `docs/implementation-plan.md` §Fase 7
> Dipende da: Fase 5

### Task 7.1: Separare contenuti da layout

- Creare file di contenuti centralizzati (es. `src/content/arcani.ts`, `respiro.ts`, `ispirazione.ts`)
- Ogni file esporta titoli, intro, CTA, hero text
- I componenti leggono da questi file, non hardcodano testo

### Task 7.2: Predisporre struttura per contenuti dinamici futuri

- Schema coerente per le 3 Vie
- Pattern ripetibili documentati
- Convenzioni nomi e sezioni

---

## Fase 8 — Accessibilità, Qualità e Rifinitura

> Ref: `docs/design-guidelines.md` §Accessibility, §Emotional Audit
> Dipende da: tutte le fasi precedenti

### Task 8.1: Accessibilità

**Checklist:**
- [ ] Un solo H1 per pagina
- [ ] Landmarks semantici (header, main, nav, footer)
- [ ] Navigazione keyboard completa
- [ ] Focus states visibili
- [ ] Contrasto WCAG AA (4.5:1 body, 7:1 titoli chiave)
- [ ] `prefers-reduced-motion` supportato ovunque
- [ ] Target touch min 44px
- [ ] ARIA labels su porte e pulsanti
- [ ] Immagini decorative con aria-hidden

### Task 8.2: Performance

- Homepage leggera
- Animazioni non bloccanti
- Lazy loading dove opportuno
- Nessun effetto superfluo all'arrivo

### Task 8.3: Coerenza emotiva (Emotional Audit)

**Domande di validazione:**
- La soglia sembra sacra e iniziatica?
- Le 3 Vie sono distinte ma parte dello stesso tempio?
- La spirale sembra un rito di passaggio?
- L'utente capisce l'offerta prima di agire?
- Le CTA invitano senza premere?
- L'esperienza è chiara, gentile, emotivamente coerente?

---

## Decisioni operative

| Decisione | Scelta | Ref |
|-----------|--------|-----|
| Tipografia | Sostituire con serif editoriali (Cormorant Garamond + Source Serif 4) | User feedback |
| Auth | Nascondere route /login e /admin dalla UI pubblica, mantenere codice | User feedback |
| Backend | Lovable Cloud per form contatti e futuro CMS | master-plan |
| Palette | Implementare palette esatta delle guidelines | design-guidelines |
| Auth nell'MVP | No login richiesto per navigare | master-plan, app-flow |

---

## Ordine di esecuzione consigliato

```
1. Task 1.1 + 1.2 (palette + tipografia) → in parallelo
2. Task 1.3 + 1.4 (spacing + motion)
3. Task 1.5 (componenti base)
4. Task 2.1 + 2.2 (homepage soglia)
5. Task 3.1 + 3.2 (spirale)
6. Task 4.1 + 4.2 + 4.3 + 4.4 (mini-home)
7. Task 5.1 + 5.2 + 5.3 + 5.4 (pagine interne + routing)
8. Task 6.1 + 6.2 (contatti + DB)
9. Task 7.1 + 7.2 (content management)
10. Task 8.1 + 8.2 + 8.3 (QA finale)
```
