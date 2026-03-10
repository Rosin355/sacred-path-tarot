

## Problem

Two issues cause the visual glitch:

1. **PetalBurstOverlay is not fully opaque** — it uses `hsla` with alpha `0.7` / `0.9`, so even at `opacity: 1` the background bleeds through. When React unmounts it on navigation, this semi-transparent layer vanishes → flash.

2. **Color mismatch** — ViaLayout's overlay uses `alpha: 1` while PetalBurstOverlay uses `0.7/0.9`. The two don't match visually, causing a visible "pop" at the handoff moment.

3. **`onComplete` in useEffect deps** — `handleOverlayComplete` is recreated on every render (depends on `phase`), which can re-trigger the GSAP timeline or cause timing issues.

## Solution

### 1. `PetalBurstOverlay.tsx` — Make fully opaque
- Change the background `hsla` alpha values from `0.7`/`0.9` to `1`/`1` so the overlay is truly opaque when `opacity: 1`.
- Remove `onComplete` from the `useEffect` dependency array (use a ref instead) to prevent re-triggering.

### 2. `Threshold.tsx` — Stabilize callback
- Wrap `handleOverlayComplete` with a ref-based pattern or use `useRef` for `activeDoor`/`phase` to avoid recreating the callback, which destabilizes the GSAP effect.

### 3. `ViaLayout.tsx` — No changes needed
- The current implementation is correct once the PetalBurstOverlay colors match.

### Expected result
The PetalBurstOverlay fades to a fully opaque dark screen → navigation happens while screen is dark → ViaLayout mounts with an identical opaque overlay → overlay fades out smoothly. No flash at any point.

