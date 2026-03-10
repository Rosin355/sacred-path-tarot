

# Il Tempio delle Tre Vie — Implementation Plan

## Current State
The site is a single-page tarot-focused site with: Hero (3D particle sphere), Method, TarotReading, Journey, About, Services, QuoteBanner, Footer, and a Loader page with spiral animation. There are also build errors: several components in `Index.tsx` don't accept a `className` prop.

## Architecture Overview

```text
Routes:
  /              → Sacred Threshold (homepage with 3 doors)
  /arcani        → Mini-home: La Via degli Arcani
  /respiro       → Mini-home: La Via del Respiro
  /ispirazione   → Mini-home: La Via dell'Ispirazione
  /transition/:via → Spiral transition (reuses existing SpiralAnimation)
  /login         → Login (existing)
  /admin         → Admin (existing)
```

## Phase 1 Implementation

### 1. Sacred Threshold Homepage (`/`)
**File: `src/pages/Threshold.tsx`** (new)

- Full-screen fixed scene, no scrolling
- Top center: poetic invocation ("Ogni via si apre a chi è pronto ad ascoltare.")
- Brand line: "Jessica Marin — Un solo tempio. Tre vie interiori."
- Three monumental stone doors in a centered frontal composition
- Each door: title, subtitle, subtle hover glow differentiation
  - **Arcani**: deeper violet aura — "Tarocchi, consulti ed eventi esoterici"
  - **Respiro**: silver-lilac aura — "Yoga, pranayama, corpo e presenza"
  - **Ispirazione**: warm antique parchment aura — "Arte, musica e letteratura esoterica"
- Dark near-black background with subtle ambient CSS animation (slow gradient drift)
- Clicking a door navigates to `/transition/:via`
- Keyboard accessible, semantic landmarks, `prefers-reduced-motion` support

### 2. Ritual Transition Page (`/transition/:via`)
**File: `src/pages/Transition.tsx`** (new)

- Reuses existing `SpiralAnimation` component
- No "Enter" text — purely cinematic
- Auto-navigates to the target Via mini-home after ~4 seconds
- Feels like a rite of passage

### 3. Three Mini-Home Pages
**Files:**
- `src/pages/ViaArcani.tsx`
- `src/pages/ViaRespiro.tsx`
- `src/pages/ViaIspirazione.tsx`

Each mini-home follows the same structure:
- Strong h1 title
- Evocative introductory paragraph (placeholder)
- Visual hero area with path-appropriate atmosphere
- 2–3 CTA cards/blocks (placeholder content matching the brief)
- "Torna al Tempio" button that returns to `/`
- Subtle color differentiation via CSS custom properties per path

**Via degli Arcani blocks:**
- Il metodo di Jessica (reuses existing Method content)
- Consulti / Percorsi
- Eventi esoterici

**Via del Respiro blocks:**
- Approccio e filosofia
- Discipline e pratiche
- Eventi / lezioni

**Via dell'Ispirazione blocks:**
- Articoli / riflessioni
- Musica e ispirazioni
- Letteratura esoterica

### 4. Shared Layout Component
**File: `src/components/ViaLayout.tsx`** (new)

- Shared wrapper for all three Via pages
- Includes "Torna al Tempio" navigation
- Accepts path-specific color accent via prop
- Minimal footer

### 5. Updated Routes
**File: `src/App.tsx`** (modify)

- `/` → `Threshold`
- `/transition/:via` → `Transition`
- `/arcani` → `ViaArcani`
- `/respiro` → `ViaRespiro`
- `/ispirazione` → `ViaIspirazione`
- Remove `/home` route and old Loader
- Keep `/login`, `/admin`, `*`

### 6. Color System Updates
**File: `src/index.css`** (modify)

Add CSS custom property variants for each path:
- `.via-arcani`: deeper violet shadows
- `.via-respiro`: silver-lilac, luminous accents
- `.via-ispirazione`: warm antique gold tones

All within the existing dark system. WCAG AA maintained.

### 7. Build Error Fixes
**File: `src/pages/Index.tsx`** — will be replaced by the new architecture, resolving all TS errors.

Components like `Method`, `TarotReading`, `Journey`, `About`, `Services` don't accept `className` — this becomes moot as they'll be used differently in the Via pages (without forced className props), or updated to accept className where needed.

### 8. Files to Remove/Deprecate
- `src/pages/Loader.tsx` — spiral reused in Transition, loader page removed
- `src/pages/Index.tsx` — replaced by Threshold + Via pages
- `src/components/Hero.tsx` — replaced by Threshold design
- `src/components/ScrollMorphSymbol.tsx` — no longer needed (no long scroll)

### 9. Files Preserved
- `src/components/ui/spiral-animation.tsx` — reused in Transition
- `src/components/Method.tsx` — reused inside Via Arcani
- `src/components/TarotReading.tsx` — reused inside Via Arcani
- `src/components/Services.tsx` — reused inside Via Arcani
- `src/components/About.tsx` — can be linked from any Via
- `src/components/Footer.tsx` — simplified, reused in ViaLayout
- All UI components, hooks, auth — preserved

## Design Specifications

**Typography**: Existing font system (Love Light for h1/h2, UnifrakturMaguntia for h3, Goudy Bookletter for body) — perfect for the sacred temple aesthetic.

**Door Design**: CSS-only monumental stone doors using gradients, borders, and subtle inner shadows. No external images needed. Hover reveals a soft path-colored glow behind each door.

**Motion**: Slow fade-ins (600-800ms), gentle hover glows (300ms), spiral transition (~4s). All respecting `prefers-reduced-motion`.

**Spacing**: 8pt grid. Threshold page uses generous negative space. Mini-homes are more informative but still ceremonial.

