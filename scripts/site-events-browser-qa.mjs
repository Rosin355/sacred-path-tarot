// Test browser solo locale: intercetta REST e immagini, non contatta Supabase reale.
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
const base = "http://127.0.0.1:5173";
const day = (shift) => { const date = new Date(); date.setUTCDate(date.getUTCDate() + shift); return date.toISOString().slice(0, 10); };
const fixture = [
  { id: "00000000-0000-4000-8000-000000000001", title: "Vicino", description: "Descrizione completa del prossimo evento", start_date: day(2), end_date: day(3), status: "published" },
  { id: "00000000-0000-4000-8000-000000000002", title: "Lontano", description: "Altro evento", start_date: day(20), end_date: null, status: "published" },
  { id: "00000000-0000-4000-8000-000000000003", title: "Passato recente", description: "Evento concluso", start_date: day(-2), end_date: null, status: "published" },
  { id: "00000000-0000-4000-8000-000000000004", title: "Passato remoto", description: "Evento storico", start_date: day(-20), end_date: null, status: "published" },
  { id: "00000000-0000-4000-8000-000000000005", title: "Bozza segreta", description: "Non pubblicata", start_date: day(5), end_date: null, status: "draft" },
].map(event => ({ ...event, original_image_path: `${event.id}/original.png`, thumbnail_image_path: `${event.id}/thumb.png`, revision: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
const pixel = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");

try {
  for (const [width, height] of [[1440, 900], [768, 1024], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    await page.route(/https?:\/\/[^/]+\/(rest|auth|functions|storage)\/v1\//, route => {
      const url = new URL(route.request().url());
      if (url.pathname.includes("/storage/v1/object/public/event-posters/")) return route.fulfill({ body: pixel, contentType: "image/png" });
      if (url.pathname.endsWith("/rest/v1/site_events")) {
        assert.equal(url.searchParams.get("status"), "eq.published", "La pagina pubblica deve richiedere solo i pubblicati");
        return route.fulfill({ json: fixture.filter(event => event.status === "published") });
      }
      return route.fulfill({ json: [] });
    });
    await page.goto(`${base}/eventi`);
    await page.getByRole("button", { name: /Vicino/ }).waitFor({ timeout: 7000 });
    const next = page.getByRole("region", { name: "Prossimi eventi" });
    const past = page.getByRole("region", { name: "Eventi passati" });
    assert.deepEqual(await next.locator(".event-card strong").allTextContents(), ["Vicino", "Lontano"]);
    assert.deepEqual(await past.locator(".event-card strong").allTextContents(), ["Passato recente", "Passato remoto"]);
    assert.equal(await page.getByText("Bozza segreta").count(), 0);
    const card = page.getByRole("button", { name: /Vicino/ });
    await card.click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    assert(await dialog.getByRole("heading", { name: "Vicino" }).isVisible());
    assert(await dialog.getByText("Descrizione completa del prossimo evento").isVisible());
    assert(await dialog.locator("img.event-dialog__poster").isVisible());
    await page.keyboard.press("Tab");
    assert(await dialog.evaluate(node => node.contains(document.activeElement)), "Il focus deve restare nel dialog");
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    assert(await card.evaluate(node => node === document.activeElement), "Il focus deve tornare alla scheda");
    assert.equal(errors.length, 0, errors.join("\n"));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Overflow orizzontale");
    await page.close();
  }
  console.log("Griglia Eventi, ordinamento, bozza invisibile e dialog accessibile: OK");
} finally { await browser.close(); }
