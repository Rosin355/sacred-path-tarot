

# Piano: Porte con immagine classica, luce divina e nebbia + rimozione spirale

## Concept visivo

L'immagine caricata (arco classico con colonne corinzie) diventa la cornice delle tre porte. All'interno di ogni arco, un'animazione CSS simula una **luce divina** che pulsa e irradia dall'alto, con colori diversi per ogni via:
- **Arcani** → viola/porpora sacro (Sacred Violet)
- **Respiro** → verde/turchese (respiro, natura)  
- **Ispirazione** → oro/ambra (Antique Gold)

Un effetto **nebbia** sottile (gradiente animato con opacità variabile) si muove lentamente nella parte bassa dell'arco.

## Come potrebbe venire fuori

L'immagine dell'arco è una PNG con sfondo trasparente — perfetta per essere sovrapposta su uno sfondo scuro. L'effetto finale sarà:

```text
┌─────────────────────────────────────────────┐
│           Il Tempio delle Tre Vie            │
│                                              │
│   ╔═══╗       ╔═══╗       ╔═══╗             │
│   ║ ☀ ║       ║ ☀ ║       ║ ☀ ║  ← luce    │
│   ║   ║       ║   ║       ║   ║    divina   │
│   ║~~~║       ║~~~║       ║~~~║  ← nebbia   │
│   ╚═══╝       ╚═══╝       ╚═══╝             │
│   Arcani      Respiro    Ispirazione         │
│   (viola)     (turchese)  (oro)              │
└─────────────────────────────────────────────┘
```

**Punti di forza previsti:**
- L'arco classico è coerente con l'estetica "sacra, editoriale" — evoca il tempio senza essere fantasy
- La luce divina dall'alto crea senso di trascendenza e invito a entrare
- I tre colori diversi danno identità visiva immediata a ogni via
- La nebbia aggiunge profondità e mistero

**Rischi da gestire:**
- L'immagine è molto dettagliata/realistica — potrebbe stonare se troppo grande. Dimensioneremo le porte a ~200-250px di larghezza per mantenere eleganza
- Su mobile le tre porte in colonna potrebbero risultare ripetitive — valuteremo dopo il primo test

## Implementazione tecnica

### 1. Copiare l'immagine nel progetto
- `src/assets/temple-arch.jpg` — importata come ES module

### 2. Aggiornare `src/pages/Threshold.tsx`
- Ogni porta usa l'immagine dell'arco come `<img>` di sfondo/cornice
- All'interno dell'arco, un `<div>` con animazione CSS per la luce divina (radial-gradient animato dall'alto)
- Un `<div>` nebbia in basso (gradient con animazione di drift orizzontale)
- Colori via CSS custom properties per ogni porta
- Navigazione diretta a `/arcani`, `/respiro`, `/ispirazione` (senza passare dalla spirale)

### 3. Aggiornare `src/pages/Transition.tsx` / routing
- Rimuovere la spirale: le porte navigano direttamente alle rispettive vie

### 4. Animazioni CSS in `src/index.css`
- `@keyframes divine-light` — pulsazione di un radial-gradient dall'alto
- `@keyframes fog-drift` — traslazione orizzontale lenta della nebbia
- Classi per i tre colori: `.door-arcani`, `.door-respiro`, `.door-ispirazione`

### File coinvolti

| File | Azione |
|------|--------|
| `src/assets/temple-arch.jpg` | Copia immagine caricata |
| `src/pages/Threshold.tsx` | Ridisegno porte con immagine arco + luce + nebbia |
| `src/index.css` | Aggiunta keyframes divine-light e fog-drift |
| `src/pages/Threshold.tsx` | Navigazione diretta (skip spirale) |

