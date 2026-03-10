

## Problem Analysis

The "glitch" happens at the exact moment of navigation: the PetalBurstOverlay (dark tinted overlay) is suddenly unmounted when React Router navigates away, and the destination page (ViaLayout) starts at `opacity: 0` and fades in over 1200ms. This creates a brief flash — the dark overlay vanishes instantly, revealing the raw background before the new page fades in.

## Solution

Create visual continuity by making the destination page start **from the same dark state** as the overlay, then gracefully reveal content.

### Changes

**1. `PetalBurstOverlay.tsx`** — Make the overlay reach full opacity faster (reduce from 1.8s to 1.2s) so the screen is fully dark before navigation fires.

**2. `Threshold.tsx`** — Delay navigation slightly: wait until the dark overlay is fully opaque before calling `navigate()`. Instead of navigating on dissolve complete, add a small delay (~400ms after overlay is fully dark) to ensure no flash.

**3. `ViaLayout.tsx`** — Instead of a simple opacity fade from 0 to 1, start with a dark color overlay that matches the PetalBurstOverlay's final state, then fade that overlay out while the content is already visible underneath. This eliminates the "gap" between the two pages:
   - Add an inner overlay `div` that starts fully opaque (dark, tinted with the door's color) and fades out over ~1200ms
   - Accept an optional color prop passed via route state
   - Content is rendered immediately at full opacity behind the overlay

**4. Route state** — Pass the door's color via `navigate(door.route, { state: { doorColor: "..." } })` so ViaLayout knows which tint to dissolve from.

### Flow After Fix

```text
Threshold (petals dissolve) 
  → Dark overlay fades to 100% opacity
  → Small pause (seamless dark)
  → Navigate with doorColor in state
  → ViaLayout mounts with matching dark overlay at 100%
  → Dark overlay fades out → content revealed
  = No flash, no glitch
```

### Files to modify
- `src/components/threshold/PetalBurstOverlay.tsx` — faster fade, callback on complete
- `src/pages/Threshold.tsx` — pass color via route state, delay navigation after overlay complete
- `src/components/ViaLayout.tsx` — accept route state color, render dissolving dark overlay on mount
- `src/pages/ViaArcani.tsx`, `ViaRespiro.tsx`, `ViaIspirazione.tsx` — no changes needed (ViaLayout handles it)

