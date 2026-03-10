

# Piano: Musica di sottofondo + Via degli Arcani con pagina originale + Sfondo stellato sulla Threshold

## Cosa fare

### 1. Ripristinare la musica di sottofondo sulla Threshold
La Threshold page attualmente non ha il background music. Devo aggiungere il `useBackgroundMusic` hook e un pulsante mute/unmute sulla pagina Threshold (come faceva `Navigation.tsx`). Il sistema audio esiste già completo (`useBackgroundMusic`, `audioStorage`, `soundEffects`).

**File:** `src/pages/Threshold.tsx`
- Importare `useBackgroundMusic`
- Aggiungere pulsante Volume2/VolumeX in posizione discreta (angolo in alto a destra)
- Il hook gestisce già autoplay, fade-in, localStorage persistence

### 2. Aggiungere sfondo stellato (ParticleSphere 3D) alla Threshold
La pagina Threshold deve avere lo sfondo con le carte tarocchi orbitanti e particelle stellate, come la vecchia Hero. Riutilizzo il componente `ParticleSphere` da `cosmos-3d-orbit-gallery.tsx`.

**File:** `src/pages/Threshold.tsx`
- Aggiungere `<Canvas>` con `<ParticleSphere>` come sfondo dietro le porte (stessa configurazione di `Hero.tsx`)
- Le porte restano sopra con `z-10`, il canvas è `z-0`

### 3. Via degli Arcani → pagina originale completa
Quando l'utente entra nella Via degli Arcani, deve vedere la pagina completa originale (quella di `Index.tsx`) con Navigation, Hero (ParticleSphere animata), Method, TarotReading, Journey, About, Services, QuoteBanner, Footer.

**File:** `src/pages/ViaArcani.tsx`
- Sostituire il contenuto attuale (mini-home con 3 CTA cards) con i componenti originali di `Index.tsx`
- Avvolgere tutto nel `ViaLayout` per mantenere il "Torna al Tempio"
- Includere: Hero, Method, TarotReading, Journey, About, Services, QuoteBanner, Footer

### 4. File coinvolti

| File | Azione |
|------|--------|
| `src/pages/Threshold.tsx` | Aggiungere Canvas+ParticleSphere come sfondo + useBackgroundMusic + pulsante mute |
| `src/pages/ViaArcani.tsx` | Sostituire con contenuto originale Index.tsx (Hero, Method, TarotReading, etc.) |

### 5. Nessun file da creare o eliminare
Tutti i componenti esistono già. Si tratta di ricomporli nelle pagine giuste.

