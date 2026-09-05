/**
 * FrameScrubber — sequenza WebP scrubbata su canvas.
 *
 * Caricamento "lazy-chunk per zona" (KB §6): si scaricano solo i frame della
 * scena corrente ± 1 scena, in ordine di distanza dalla posizione dello scrub;
 * quando lo scroll (o un salto da indicatore) sposta la zona, il caricamento
 * riparte da lì. Niente download eager dell'intera sequenza.
 *
 * Disegno: rAF con lerp verso il frame target e crossfade sub-frame — si
 * disegna il frame floor(current) e sopra il frame successivo con
 * globalAlpha pari alla parte frazionaria, così il movimento resta continuo
 * anche tra un fotogramma e l'altro.
 *
 * I frame sono tenuti come Blob compressi e decodificati SOLO via
 * createImageBitmap(blob) — mai HTMLImageElement — perché è l'unico percorso
 * che garantisce il decode WebP fuori dal main thread: qualunque decode
 * sincrono dentro il rAF produce gli scatti che questo motore deve evitare.
 * Una finestra LRU di ImageBitmap intorno alla posizione corrente (con
 * lookahead nella direzione di scroll) tiene pronti i frame vicini; se un
 * bitmap esatto manca si disegna il vicino più prossimo già decodificato.
 */
export class FrameScrubber {
  constructor(canvas, { base, scenes, width, height }, opts = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.frameW = width;
    this.frameH = height;
    this.concurrency = opts.concurrency ?? 6;
    this.maxDpr = opts.maxDpr ?? 2;
    this.bitmapWindow = opts.bitmapWindow ?? 48;

    this.frames = [];
    this.sceneStart = [];
    let acc = 0;
    for (const scene of scenes) {
      this.sceneStart.push(acc);
      for (let n = 1; n <= scene.count; n++) {
        this.frames.push({
          url: `${base}/${scene.id}/${String(n).padStart(4, '0')}.webp`,
          blob: null,
          loaded: false,
          loading: false,
          failed: false,
          bitmap: null,
          bitmapPending: false,
        });
      }
      acc += scene.count;
    }
    this.total = this.frames.length;

    this.target = 0;
    this.current = 0;
    this.lastDrawnKey = -1;
    this.loadedCount = 0;
    this.activeLoads = 0;
    this.bitmapJobs = 0;
    this.bitmapIdxs = new Set();
    this.progressCb = null;
    this.rafId = 0;
    this.lastTick = 0;
    this.destroyed = false;
    this.controllers = new Set();

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  frameAt(sceneIndex, sceneProgress) {
    const start = this.sceneStart[sceneIndex];
    const count = (this.sceneStart[sceneIndex + 1] ?? this.total) - start;
    return start + sceneProgress * (count - 1);
  }

  sceneOf(frame) {
    for (let s = this.sceneStart.length - 1; s >= 0; s--) {
      if (frame >= this.sceneStart[s]) return s;
    }
    return 0;
  }

  setTarget(frame) {
    this.target = Math.max(0, Math.min(this.total - 1, frame));
    this.#kickLoads();
  }

  onProgress(cb) { this.progressCb = cb; }

  start() {
    this.#kickLoads();
    const tick = timestamp => {
      this.#draw(timestamp);
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.lastDrawnKey = -1; // forza il ridisegno
  }

  /** Zona caricabile: scena del target ± 1 (lazy-chunk per zona, KB §6). */
  #zoneRange() {
    const s = this.sceneOf(Math.round(this.target));
    const from = this.sceneStart[Math.max(0, s - 1)];
    const to = (this.sceneStart[s + 2] ?? this.total) - 1;
    return [from, to];
  }

  #kickLoads() {
    while (this.activeLoads < this.concurrency && this.#loadNext()) { /* riempi gli slot */ }
  }

  #loadNext() {
    const [from, to] = this.#zoneRange();
    const idx = this.#nearestUnloaded(Math.round(this.target), from, to);
    if (idx === -1) return false;

    const frame = this.frames[idx];
    frame.loading = true;
    this.activeLoads++;
    const controller = new AbortController();
    this.controllers.add(controller);
    const done = () => {
      this.controllers.delete(controller);
      this.activeLoads--;
      if (this.destroyed) return;
      this.#kickLoads();
      this.#syncBitmaps();
    };
    fetch(frame.url, { cache: 'force-cache', signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then(blob => {
        frame.blob = blob;
        frame.loaded = true;
        this.loadedCount++;
        this.progressCb?.(this.loadedCount, this.total, idx);
        done();
      })
      .catch(err => {
        frame.loading = false;
        frame.failed = err.name !== 'AbortError'; // frame perso: non bloccare la catena
        done();
      });
    return true;
  }

  #nearestUnloaded(center, from, to) {
    let best = -1;
    let bestDist = Infinity;
    for (let i = from; i <= to; i++) {
      const f = this.frames[i];
      if (f.loaded || f.loading || f.failed) continue;
      const d = Math.abs(i - center);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  /**
   * Mantiene la finestra di ImageBitmap decodificati intorno a `current`,
   * dando priorità ai ~8 frame in avanti nella direzione dello scroll:
   * il crossfade ha sempre bisogno del frame successivo già decodificato.
   */
  #syncBitmaps() {
    const c = Math.round(this.current);
    const W = this.bitmapWindow;
    const LOOK = 8;

    for (const i of this.bitmapIdxs) {
      if (Math.abs(i - c) > W * 1.6) {
        this.frames[i].bitmap?.close();
        this.frames[i].bitmap = null;
        this.bitmapIdxs.delete(i);
      }
    }

    const dir = this.target >= this.current ? 1 : -1;
    const order = [];
    for (let d = 0; d <= LOOK; d++) order.push(c + d * dir);
    for (let d = 1; d <= W; d++) {
      order.push(c - d * dir);
      if (d > LOOK) order.push(c + d * dir);
    }

    for (const i of order) {
      if (this.bitmapJobs >= 4) return;
      if (i < 0 || i >= this.total) continue;
      const f = this.frames[i];
      if (!f.loaded || f.bitmap || f.bitmapPending) continue;
      f.bitmapPending = true;
      this.bitmapJobs++;
      createImageBitmap(f.blob).then(bmp => {
        f.bitmapPending = false;
        this.bitmapJobs--;
        if (this.destroyed || Math.abs(i - Math.round(this.current)) > W * 1.6) {
          bmp.close(); // la finestra si è già spostata altrove
        } else {
          f.bitmap = bmp;
          this.bitmapIdxs.add(i);
        }
        if (!this.destroyed) this.#syncBitmaps();
      }).catch(() => {
        f.bitmapPending = false;
        this.bitmapJobs--;
      });
    }
  }

  /** Frame disegnabile per idx: bitmap esatto, immagine esatta, o vicino più prossimo. */
  #drawableAt(idx) {
    const exact = this.#exactDrawable(idx);
    if (exact) return exact;

    // La cache contiene solo una piccola finestra: cercare lì evita una scansione
    // dei ~1.200 frame a ogni refresh quando il fotogramma esatto non è pronto.
    let nearest = -1;
    let distance = Infinity;
    for (const i of this.bitmapIdxs) {
      const candidateDistance = Math.abs(i - idx);
      if (candidateDistance < distance) {
        nearest = i;
        distance = candidateDistance;
      }
    }
    return nearest >= 0 ? this.#exactDrawable(nearest) : null;
  }

  #exactDrawable(idx) {
    const f = this.frames[idx];
    // solo bitmap già decodificati: mai decode sincrono dentro il rAF
    if (f?.bitmap) return { source: f.bitmap, idx };
    return null;
  }

  #draw(timestamp) {
    const delta = this.target - this.current;
    const elapsed = this.lastTick ? Math.min(64, timestamp - this.lastTick) : 16.67;
    this.lastTick = timestamp;
    // Smoothing temporale indipendente dal refresh rate: equivalente a
    // current += (target - current) * (1 - Math.exp(-dt * 8)).
    const dt = elapsed / 1000;
    const smoothing = 1 - Math.exp(-dt * 8);
    const before = Math.round(this.current);
    if (Math.abs(delta) < 0.02) this.current = this.target;
    else this.current += delta * smoothing;
    if (Math.round(this.current) !== before) this.#syncBitmaps();

    const i0 = Math.floor(this.current);
    const i1 = Math.min(this.total - 1, i0 + 1);
    const frac = this.current - i0;

    const base = this.#drawableAt(i0);
    if (!base) return;
    // crossfade solo se il frame successivo esatto è già disponibile
    const next = frac > 0.01 && i1 !== i0 && base.idx === i0 ? this.#exactDrawable(i1) : null;
    const key = base.idx * 128 + (next ? 1 + Math.round(frac * 126) : 0);
    if (key === this.lastDrawnKey) return;

    const { width: cw, height: ch } = this.canvas;
    const scale = Math.max(cw / this.frameW, ch / this.frameH);
    const dw = this.frameW * scale, dh = this.frameH * scale;
    const x = (cw - dw) / 2, y = (ch - dh) / 2;
    this.ctx.globalAlpha = 1;
    this.ctx.drawImage(base.source, x, y, dw, dh);
    if (next) {
      this.ctx.globalAlpha = frac;
      this.ctx.drawImage(next.source, x, y, dw, dh);
      this.ctx.globalAlpha = 1;
    }
    this.lastDrawnKey = key;
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resize);
    for (const controller of this.controllers) controller.abort();
    this.controllers.clear();
    for (const i of this.bitmapIdxs) this.frames[i].bitmap?.close();
    this.bitmapIdxs.clear();
  }
}
